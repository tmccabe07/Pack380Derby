import { Injectable } from '@nestjs/common';
import { CreateRaceDto } from './dto/create-race.dto';
import { UpdateRaceDto } from './dto/update-race.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Car, HeatLane, Prisma, Race } from '@prisma/client';
import { RaceGlobalVariableService } from './raceGlobalVariable.service';

@Injectable()
export class RaceService {

  constructor(private prisma: PrismaService, private numAdvances: RaceGlobalVariableService) {}

  
  async createNewRace(createRaceDto: CreateRaceDto): Promise<HeatLane[]> {
    
    //create a new race  object
    const raceName = this.numAdvances.getRaceName(createRaceDto.raceType);

    const data = {
      raceName: raceName,
      numLanes: createRaceDto.numLanes,
      role: createRaceDto.role,
      raceType: createRaceDto.raceType
    }
    await this.prisma.race.create({data});

    const latestRace = await this.prisma.race.findMany({
      orderBy: {
          id: 'desc',
      },
      take: 1,
    })


    //set variable for number of lanes from API parameter input
    const numLanes = createRaceDto.numLanes;

    //set variable for raceType from API parameter input
    const raceType = createRaceDto.raceType;

    //set variable for raceId from API parameter input
    //const raceId = createRaceDto.raceId;

    //set variable for raceId from newest race  object
    const raceId = latestRace[0].id;

    //set variable for role to filter car table based on API parameter iput
    const inputRole = createRaceDto.role;
  
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

    //initialize temp variable to check role as type any; 
    let checkRole; 

    //loop through car table to create array of cars.  Use foundindex because index may not match row number if row deletions have occurred
    for(let i = 0; foundIndex < carCount._all; i++){
      const oneValue = await this.prisma.car.findUnique({
        where: {
          id: i,
        },
        include: {
          person: true,
        }
      });
      if(oneValue !== null){
        //filter results by role, use the ? since person can be null
        checkRole = oneValue.person?.role;
        if( checkRole === inputRole){
          cars.push(oneValue);
        }
        foundIndex++;
      }
    }

    //add blank cars to make full lanes
    //use this syntax to assign async result because async result can't be assigned directly
    this.addBlankCars(cars, numLanes).then(result => cars = result);

    //randomly sort the cars including blanks
    cars = await this.shuffleSort(cars);
   
    //console.log("after shuffle: ", cars);

    //figure out how many heats are needed
    let numHeats = cars.length/numLanes;

    //assign lanes
    return await this.createHeats(numHeats, cars, raceId, raceType, inputRole);

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
  async createHeats(numHeats: number, cars: Car[], raceId: number, raceType: number, inputRole: string): Promise<HeatLane[]>{
    
    const heats : HeatLane[] = [];

    //assign lanes to new array of heat that includes already randomized cars
    let counter = 0; 

    //assign lanes to heatlane and persist in table
    for(let i = 0; i < numHeats; i++) {
      for(let j = 0; j < 6; j++) {
        const newHeatLane = await this.prisma.heatLane.create({
          data: {
            result: 99, 
            lane: j+1, 
            carId: cars[counter].id, 
            heatId: i, 
            raceId: raceId,
            raceType: raceType,
            role: inputRole, 
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

    //updating car table and cubs array with blanks
    //consider - do we need a blank person by role?
    for (let i = 0; i < numCarBlanks; i++){
      const blankCar = await this.prisma.car.create({
        data: {
          name: "blank", 
          weight: "0", 
          personId: null, 
          year: 9999, 
          image: "blank", 
        },
      });
      cars.push(blankCar);
    }

    //console.log("addBlankCars ending with: ", cars);

    return cars;
  }

  async createSemiorFinal(createRaceDto: CreateRaceDto) {
  
    //set variable for number of lanes from API parameter input
    const numLanes = createRaceDto.numLanes;

    //set variable for raceType from API parameter input, which is the race that new race is created from
    //first time quarterfinals, then quarterdeadheats
    const raceType = createRaceDto.raceType;

    //set variable for raceId from API parameter input
    //const raceId = createRaceDto.raceId;

    //set variable for role to filter car table based on API parameter iput
    const inputRole = createRaceDto.role;

    let numTotalLanes = 0;
    let deadHeatRaceType = 0;
    let nextRaceType = 0;
    let deadHeatRaceName = "";
    let nextRaceName = "";

    //initializing advance array and number of advancing first time for semis or finals
    //note: consider what happens if there is more than one deadheat
    switch(raceType){
      case 1: //api sent quarterfinal, which is what we're filtering by, meaning create new semi
        this.numAdvances.initAdvance();
        this.numAdvances.setnumAdvances(0);
        numTotalLanes = numLanes * 2;
        deadHeatRaceType = 4;
        nextRaceType = 2;
        deadHeatRaceName = "quarterfinaldeadheat";
        nextRaceName = "semi";
        break;
      case 2: //api sent semi, which is what we're filtering by to create a new final
        this.numAdvances.initAdvance();
        this.numAdvances.setnumAdvances(0);
        numTotalLanes = numLanes;
        deadHeatRaceType = 5;
        nextRaceType = 3;
        deadHeatRaceName = "semideadheat";
        nextRaceName = "final";
        break;
      case 3: //api sent final, which doesn't make sense
       console.log("why would api send final to filter by");
      case 4: //create semi from quarter deadheat
        numTotalLanes = numLanes * 2;
        deadHeatRaceType = 4;
        nextRaceType = 2;
        deadHeatRaceName = "quarterfinaldeadheat";
        nextRaceName = "semi";
        break;
      case 5: //create final from semi deadheat
        numTotalLanes = numLanes;
        deadHeatRaceType = 5;
        nextRaceType = 3;
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
    const cars : Car[] = [];

    //initialize found index variable since index number may not match table row number
    let foundIndex = 0; 

    //initialize temp variable to check role as type any; 
    let checkRole; 

    //initialize total results array
    const totalResults = [
      { 
        carId: 0,
        aggResults: 0, 
      },
    ];

    totalResults.length = 0;

    //loop through car table to create array of non-blankcars.  Use foundindex because index may not match row number if row deletions have occurred
    for(let i = 0; foundIndex < carCount._all; i++){
      const oneValue = await this.prisma.car.findUnique({
        where: {
          id: i,
        },
        include: {
          person: true,
        }
      });
      if(oneValue !== null){
        //filter results by role, use the ? since person can be null
        checkRole = oneValue.person?.role;
        if( checkRole === inputRole){
          if( oneValue.name !== "blank"){
            cars.push(oneValue);
          }
        }
        foundIndex++;
      }
    }

    //find all the results in a set of races for each non-blank car id

    let totalResultsIndex = 0;

    //loop through all heatlanes of non-blank cars that match the input role and the race type to filter on
     for(let i = 0; i < cars.length; i++){
      const selectHeats = await this.prisma.heatLane.findMany({
        select: {
          result: true,
          raceId: true,
          carId: true,
          id: true,
        },
        where: {
          role: inputRole,
          carId: cars[i].id,
          raceType: raceType,
        },
        orderBy: {
          raceId: 'asc',
        },
      })

      //console.log("selectHeats of car id ", cars[i].id, " :", selectHeats);
      
      //only sum up results for cars that were found to match the input role and race type
      if(selectHeats.length > 0) {
        //console.log("select Heats is not null");
        totalResults.push({
            carId: cars[i].id,
            aggResults: 0,
        });

        totalResultsIndex = totalResults.length-1;

        //sum up results for each car that was found for the input role and race type 
        for(let j = 0; j < selectHeats.length; j++){
          totalResults[totalResultsIndex].aggResults = totalResults[totalResultsIndex].aggResults + (selectHeats[j].result ?? 0); 
        }
      }
    }

    //summed up results.  
    console.log("totalresults: ", totalResults);

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
          role: inputRole,
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

        await this.createHeats(numDeadHeats, deadHeatCars, latestRace[0].id, deadHeatRaceType, inputRole).then(result => heats = result);
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
          role: inputRole,
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
       
        await this.createHeats(numNewRaceHeats, advanceCars, latestRace[0].id, nextRaceType, inputRole).then(result => heats = result);
      }

    }
   
  }

  async create(createRaceDto: CreateRaceDto): Promise<Race> {
    const raceName = this.numAdvances.getRaceName(createRaceDto.raceType); 
    
    const data = {
      raceName: raceName,
      numLanes: createRaceDto.numLanes,
      raceType: createRaceDto.raceType,
      role: createRaceDto.role
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

}
