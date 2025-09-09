import { Injectable } from '@nestjs/common';
import { CreateRaceDto } from './dto/create-race.dto';
import { UpdateRaceDto } from './dto/update-race.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Car, HeatLane, Race } from '@prisma/client';
import { RaceGlobalVariableService } from './raceGlobalVariable.service';
import { RaceStage, RaceResult, RacerType } from '../common/types/race.types';
import { RaceProgressionService } from './services/race-progression.service';
import { RaceGenerationService } from './services/race-generation.service';

@Injectable()
export class RaceService {

  constructor(private prisma: PrismaService, 
    private numAdvances: RaceGlobalVariableService,
    private progression: RaceProgressionService,
    private generator: RaceGenerationService) {}


  async newcreateRaceAndHeats(createRaceDto: CreateRaceDto) {
    const { numLanes, raceType, rank } = createRaceDto;
    const currentStage = raceType as RaceStage;
    
    // To start everything, create the quarterfinals
    if (currentStage === RaceStage.PRELIMINARY) {
      return this.generator.createQuarterfinalRace(rank as RacerType, numLanes);
    }

    // Get results from this current stage and its corresponding deadheat stage
    const results = await this.getStageResults(currentStage, rank);

    //console.log("results from current stage: ", results);

    const nextStage = this.progression.getNextStage(currentStage);
      if (!nextStage) {
        throw new Error(`No next stage defined for ${currentStage}`);
      }

    // Calculate who advances for the next stage
    const advancingCount = this.progression.calculateAdvancingCount(nextStage, numLanes);

    //console.log("advancingCount: ", advancingCount);

    const { advancing, needsTiebreaker, tiedCarIds } = 
      await this.progression.determineAdvancingResults(results, advancingCount);

    //console.log("needsTiebreaker: ", needsTiebreaker);
    //console.log("tiedCarIds: ", tiedCarIds);
    //console.log("these cars are advancing: ", advancing);

    // Either handle tie breakers if needed by creating deadheat, or create this stage's race with all the advancers
    if (needsTiebreaker) {
      const deadheatStage = this.progression.getDeadheatStage(currentStage);
      if (!deadheatStage) {
        throw new Error(`No deadheat stage defined for ${currentStage}`);
      }
      return this.generator.createDeadheatRace(
        tiedCarIds,
        deadheatStage,
        numLanes,
        rank as RacerType
      );
    }
    else{

    // Create next stage race
      return this.generator.createNextStageRace(
        advancing,
        nextStage,
        numLanes,
        rank as RacerType
      );

    }

    
  
  }

  //reusable function for fisher yates shuffle sort
  async shuffleSort(cars: Car[]): Promise<Car[]> {
    for (let i = cars.length - 1; i > 0; i--) { 
      const j = Math.floor(Math.random() * (i + 1)); 
      [cars[i], cars[j]] = [cars[j], cars[i]]; 
    } 

    return cars; 
  }

  //reusable function to create heats in a race
  async createHeats(numHeats: number, cars: Car[], raceId: number, raceType: number, inputRank: string): Promise<HeatLane[]>{
    
    const heats : HeatLane[] = [];

    //assign lanes to new array of heat that includes already randomized cars
    let counter = 0; 

    //assign lanes to heatlane and persist in table
    for(let i = 0; i < numHeats; i++) {
      for(let j = 0; j < 6; j++) {
        const newHeatLane = await this.prisma.heatLane.create({
          data: {
            result: 0, 
            lane: j+1, 
            carId: cars[counter].id, 
            heatId: i, 
            raceId: raceId,
            raceType: raceType,
            rank: inputRank, 
          },
        });
        heats.push(newHeatLane);
        counter++; 
      }
    }

    return heats;
  }

  //reusable function to add blank cars to an array of cars
  async addBlankCars(cars: Car[], numLanes: number): Promise<Car[]>{
    //set variable to number of total number of cars 
    const numCars = cars.length;

    //console.log("numCars: ", numCars);

    //find out how many blank cars are needed based on dividing filtered total by numLanes
    const numCarBlanks = numLanes - numCars % numLanes;

    //console.log("numCarBlanks: " + numCarBlanks);

    //updating car table and cubs array with blanks
    for (let i = 0; i < numCarBlanks; i++){
      const blankCar = await this.prisma.car.create({
        data: {
          name: "blank", 
          weight: "0", 
          racerId: null, 
          year: 9999, 
          image: "blank", 
        },
      });
      cars.push(blankCar);
    }

    //console.log("addBlankCars ending with: ", cars);

    return cars;
  }

  async createRaceAndHeats(createRaceDto: CreateRaceDto) {
  
    //set variable for number of lanes from API parameter input
    const numLanes = createRaceDto.numLanes;

    //set variable for raceType from API parameter input, which is the race that new race is created from
    //first time quarterfinals, then quarterdeadheats
    const raceType = createRaceDto.raceType;

    //set variable for rank to filter car table based on API parameter input.  Note, role consolidated into rank.
    const inputRank = createRaceDto.rank;

    let numTotalLanes = 0;
    let deadHeatRaceType = 0;
    let nextRaceType = 0;
    let deadHeatRaceName = "";
    let nextRaceName = "";

    //initializing advance array and number of advancing first time for semis or finals
    //note: consider what happens if there is more than one deadheat
    switch(raceType){
      case 1: //api sent prelim, meaning generate quarterfinals
        nextRaceType = 10;
        nextRaceName = "quarterfinal";
        break;
      case 10: //api sent quarterfinal, which is what we're filtering by, meaning create new semi
        this.numAdvances.initAdvance();
        this.numAdvances.setnumAdvances(0);
        numTotalLanes = numLanes * 2;
        deadHeatRaceType = 40;
        nextRaceType = 20;
        deadHeatRaceName = "quarterfinaldeadheat";
        nextRaceName = "semi";
        break;
      case 20: //api sent semi, which is what we're filtering by to create a new final
        this.numAdvances.initAdvance();
        this.numAdvances.setnumAdvances(0);
        numTotalLanes = numLanes;
        deadHeatRaceType = 50;
        nextRaceType = 30;
        deadHeatRaceName = "semideadheat";
        nextRaceName = "final";
        break;
      case 30: //api sent final, which doesn't make sense
       console.log("why would api send final to filter by");
      case 40: //create semi from quarter deadheat
        numTotalLanes = numLanes * 2;
        deadHeatRaceType = 40;
        nextRaceType = 20;
        deadHeatRaceName = "quarterfinaldeadheat";
        nextRaceName = "semi";
        break;
      case 50: //create final from semi deadheat
        numTotalLanes = numLanes;
        deadHeatRaceType = 50;
        nextRaceType = 30;
        deadHeatRaceName = "semideadheat";
        nextRaceName = "final";
        break;
    }

    //console.log("numTotalLanes: " + numTotalLanes);
    
    //this is needed for return of heat lane creation; but is not returned overall
    let heats : HeatLane[] = [];

    //need to find all the car ids that aren't blank
    //find out how many cars are in the car table overall
    const carCount = await this.prisma.car.count({
      select: {
        _all: true, // Count all records
      },
    })
    
    //create a new array of car type
    let cars : Car[] = [];

    //initialize found index variable since index number may not match table row number
    let foundIndex = 0; 

    //initialize temp variable to check rank as type any; 
    let checkRank; 

    //loop through car table to create array of non-blankcars.  Use foundindex because index may not match row number if row deletions have occurred
    for(let i = 0; foundIndex < carCount._all; i++){
      const oneValue = await this.prisma.car.findUnique({
        where: {
          id: i,
        },
        include: {
          racer: true,
        }
      });
      if(oneValue !== null){
        //filter results by rank, use the ? since racer can be null
        //exclude blank cars, which could happen for generating semis
        checkRank = oneValue.racer?.rank;

        //add logic to convert rank after consolidating role and rank
        if(inputRank == "cub"){
          if( checkRank != "sibling" && checkRank != "adult" ){
            if( oneValue.name !== "blank"){
              cars.push(oneValue);
            }
          }
        }
        else if( checkRank === inputRank){
          if( oneValue.name !== "blank"){
            cars.push(oneValue);
          }
        }
        foundIndex++;
      }
    }

    //generate quarterfinals if api sends prelim code
    if(raceType == 1){

      //create a new race  object
      const data = {
        raceName: nextRaceName,
        numLanes: createRaceDto.numLanes,
        rank: createRaceDto.rank,
        raceType: nextRaceType
      }
      await this.prisma.race.create({data});

      const latestRace = await this.prisma.race.findMany({
        orderBy: {
            id: 'desc',
        },
        take: 1,
      })

      const raceId = latestRace[0].id;

        //add blank cars to make full lanes
      //use this syntax to assign async result because async result can't be assigned directly
      await this.addBlankCars(cars, numLanes).then(result => cars = result);

      //randomly sort the cars including blanks
      cars = await this.shuffleSort(cars);
    
      //console.log("after quarter shuffle: ", cars);

      //figure out how many heats are needed
      let numHeats = cars.length/numLanes;

      //assign lanes
      return await this.createHeats(numHeats, cars, raceId, nextRaceType, inputRank);
    }

    //if not quarter finals, find all the results in a set of races for each non-blank car id

    //initialize total results array
    const totalResults = [
      { 
        carId: 0,
        aggResults: 0, 
      },
    ];

    totalResults.length = 0;

    let totalResultsIndex = 0;

    //loop through all heatlanes of non-blank cars that match the input rank and the race type to filter on
    //how to do a nested where?
     for(let i = 0; i < cars.length; i++){
      
      const selectHeats = await this.prisma.heatLane.findMany({
        select: {
          result: true,
          raceId: true,
          carId: true,
          id: true,
        },
        where: {
          rank: inputRank,
          carId: cars[i].id,
          raceType: raceType,
        },
        orderBy: {
          raceId: 'asc',
        },
      })
      
      console.log("selectHeats of car id ", cars[i].id, " :", selectHeats);
      
      //only sum up results for cars that were found to match the input rank and race type
      if(selectHeats.length > 0) {
        //console.log("select Heats is not null");
        totalResults.push({
            carId: cars[i].id,
            aggResults: 0,
        });

        totalResultsIndex = totalResults.length-1;

        //sum up results for each car that was found for the input rank and race type 
        for(let j = 0; j < selectHeats.length; j++){
          totalResults[totalResultsIndex].aggResults = totalResults[totalResultsIndex].aggResults + (selectHeats[j].result ?? 0); 
        }
      }
    }

    //summed up results.  
    //console.log("totalresults: ", totalResults);

    //sort from lowest to highest
    const sortedResult = totalResults.sort((a, b) => a.aggResults - b.aggResults);

    console.log("sorted total Result: ", sortedResult);

    //check if there are any ties for last place of who can advance
    //numTotalLanes is the total number that can advance
    
    let checkNumAdvances = this.numAdvances.getNumAdvances();

    //console.log("orig checkNumAdvances: " + checkNumAdvances);

    if(checkNumAdvances === 0){
      checkNumAdvances = numTotalLanes;
    }
    else{
      checkNumAdvances = numTotalLanes - checkNumAdvances;
    }
    
    console.log("checkNumAdvances: " + checkNumAdvances);

    let advance = this.numAdvances.getAdvance();

    //find last place of what will advance
    let lastPlaceAggResults = 0;

    lastPlaceAggResults = sortedResult[checkNumAdvances-1].aggResults;
    console.log("last place: ", sortedResult[checkNumAdvances-1].carId);
      
    const deadHeat = [
      { 
        carId: 0,
        aggResults: 0, 
      },
    ];

    deadHeat.length = 0;

    //need to know if there is a match of last place after the number of advancement slots
    for(let i = 0; i < sortedResult.length; i++){
      if(i >= checkNumAdvances){
        if(sortedResult[i].aggResults === lastPlaceAggResults){
          deadHeat.push({
            carId: sortedResult[i].carId,
            aggResults: sortedResult[i].aggResults,
          });
        }
      }
    }
    //if there is tie for last place, then need to look through the start of the array again for all ties and add that to deadheat; else goes to advance
    if(deadHeat.length > 0){
      for(let i = 0; i < sortedResult.length; i++){
        if(i < checkNumAdvances ){
          if(sortedResult[i].aggResults === lastPlaceAggResults){
            deadHeat.push({
              carId: sortedResult[i].carId,
              aggResults: sortedResult[i].aggResults,
            });
          }
          else {
            advance.push({
              carId: sortedResult[i].carId,
              aggResults: sortedResult[i].aggResults,
            });
          }
        }
      }
      console.log("these cars are tied and need to do a deadheat: ", deadHeat);
      //build car array from deadHeats
      let deadHeatCars : Car[] = [];

      for(let i = 0; i < deadHeat.length; i++){
        const oneValue = await this.prisma.car.findUnique({
          where: {
            id: deadHeat[i].carId,
          }
        });
        if(oneValue !== null){
          deadHeatCars.push(oneValue);
        }
      }

      //console.log("these cars are tied: ", deadHeatCars);

      //add blank cars to make full lanes
      //use this syntax to assign async result because async result can't be assigned directly
      await this.addBlankCars(deadHeatCars, numLanes).then(result => deadHeatCars = result);
        
      //figure out how many heats are needed
      let numDeadHeats = deadHeatCars.length/numLanes;

      //assign lanes
      for(let i = 0; i < numDeadHeats; i++){
          
        //create a new deadheat race
        const data = {
          numLanes: numLanes,
          raceType: deadHeatRaceType,
          rank: inputRank,
          raceName: deadHeatRaceName
        }
        await this.prisma.race.create({data});

        //find the id of the newest deadheat race 
        const latestRace = await this.prisma.race.findMany({
          orderBy: {
              id: 'desc',
          },
          take: 1,
        })

        //randomly sort the cars including blanks
        deadHeatCars = await this.shuffleSort(deadHeatCars);
      
        //console.log("dead heat for race: ", latestRace[0].id, " cars are shuffled: ", deadHeatCars);

        await this.createHeats(numDeadHeats, deadHeatCars, latestRace[0].id, deadHeatRaceType, inputRank).then(result => heats = result);
      }
    }
    //if there isn't any tie, then there's no need for deadheat, because all cars that can advance will advance, and there's no need to care about ties
    else{
      for(let i = 0; i < sortedResult.length; i++){
        if(i < checkNumAdvances ){
          advance.push({
            carId: sortedResult[i].carId,
            aggResults: sortedResult[i].aggResults,
          });
        }
      }
        //save all the cars that advance
      this.numAdvances.setAdvance(advance);
    }

 
    //if advancing greater than zero and less than the total number of advancing possible save in global variable
    if(advance.length > 0 && advance.length < numTotalLanes){
      this.numAdvances.setnumAdvances(advance.length);

      console.log("this many advanced and need to be saved: " + this.numAdvances.getNumAdvances());

      //save the partial set of cars that will advance into a global variable
      this.numAdvances.setAdvance(advance);
    }

    //instead of an else get all the cars that will advance to check if there's a full set that can advance
    let finalAdvance = this.numAdvances.getAdvance();

    if(finalAdvance.length === numTotalLanes){
      
      console.log("these cars advance to next race: ", finalAdvance);

      let advanceCars : Car[] = [];    

      for(let i = 0; i < finalAdvance.length; i++){
        const oneValue = await this.prisma.car.findUnique({
          where: {
            id: finalAdvance[i].carId,
          }
        });
        if(oneValue !== null){
          advanceCars.push(oneValue);
        }
      }
      
      //figure out how many heats are needed
      let numNewRaceHeats = advanceCars.length/numLanes;

      

      //using i as raceId 
      for(let i = 0; i < numNewRaceHeats; i++){ 
        //no need to add blanks because will always have a full set of cars advancing
        //sort the array of cars for each race
        advanceCars = await this.shuffleSort(advanceCars);

        //create a new semi race
        const data = {
          numLanes: numLanes,
          raceType: nextRaceType,
          rank: inputRank,
          raceName: "semi"
        }
        await this.prisma.race.create({data});
        
        //find the id of the newest deadheat race 
        const latestRace = await this.prisma.race.findMany({
          orderBy: {
              id: 'desc',
          },
          take: 1,
        })

        //console.log("advance to next race cars for race: ", latestRace[0].id, " are sorted: ", advanceCars);
       
        await this.createHeats(numNewRaceHeats, advanceCars, latestRace[0].id, nextRaceType, inputRank).then(result => heats = result);
      }

    }
   
  }

  async create(createRaceDto: CreateRaceDto): Promise<Race> {
    const raceName = this.numAdvances.getRaceName(createRaceDto.raceType); 
    
    const data = {
      raceName: raceName,
      numLanes: createRaceDto.numLanes,
      raceType: createRaceDto.raceType,
      rank: createRaceDto.rank
    }

    return await this.prisma.race.create({data});
  }

  async findAll() {
    return this.prisma.race.findMany({
      orderBy: [
        {
          id: 'asc',
        },
      ],
    })
  }

  async findOne(id: number) : Promise<Race> {
    const oneValue = await this.prisma.race.findUnique({
      where: {
        id: id,
      }
    });

    if (oneValue === null) {
      return null as any;
    } 
    
    return oneValue;
  }

  async getStageResults(stage: RaceStage, rank: string): Promise<Array<{ carId: number; totalScore: number }>> {
    // Get all heat results for this stage and its corresponding deadheat stage
    const deadheatStage = this.progression.getDeadheatStage(stage);
    const stages = deadheatStage ? [stage, deadheatStage] : [stage];

    const heatResults = await this.prisma.heatLane.findMany({
      where: {
        raceType: {
          in: stages
        },
        rank: rank,
        car: {
          name: { not: 'blank' } // Exclude blank cars
        }
      },
      select: {
        carId: true,
        result: true,
        raceId: true,
        raceType: true
      },
      orderBy: [
        { raceId: 'asc' },
        { lane: 'asc' }
      ]
    });

    // Group results by car and calculate total score
    const resultMap = new Map<number, number>();
    
    for (const heat of heatResults) {
      if (heat.carId !== null) {  // Ensure carId is not null
        const currentTotal = resultMap.get(heat.carId) ?? 0;
        const resultValue = heat.result ?? 0;
        resultMap.set(heat.carId, currentTotal + resultValue);
      }
    }

    // Convert to array of results
    return Array.from(resultMap.entries()).map(([carId, totalScore]) => ({
      carId,
      totalScore
    }));
  }
  
  async update(id: number, updateRaceDto: UpdateRaceDto): Promise<Race> {
    const checkIndex = await this.prisma.race.findUnique({
      where: {
        id: id, 
      },
    })

    if (checkIndex === null) {
      return null as any;
    } 
    
    return await this.prisma.race.update({
        where: {
          id: id,
        },
        data: updateRaceDto,
    });

  }

  async remove(id: number): Promise<Race> {
    const checkIndex = await this.prisma.race.findUnique({
      where: {
        id: id,
      },
    })

    if (checkIndex === null) {
      return null as any;
    } 
    
    return await this.prisma.race.delete({
        where: {
          id: id,
        },
    });
  }

  async clearRaceTable(): Promise<string> {
    await this.prisma.$queryRaw`DELETE FROM public."Race"`
    await this.prisma.$queryRaw`ALTER SEQUENCE public."Race_id_seq" RESTART WITH 1`;
    return "Race table dropped and sequence restarted";
  }

}
