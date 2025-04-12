import { Injectable } from '@nestjs/common';
import { CreateRaceDto } from './dto/create-race.dto';
import { UpdateRaceDto } from './dto/update-race.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Car, HeatLane, Prisma } from '@prisma/client';
import { SemiGlobalVariableService } from './semi.service';

@Injectable()
export class RaceService {

  constructor(private prisma: PrismaService, private numAdvances: SemiGlobalVariableService) {}

  async create(createRaceDto: CreateRaceDto): Promise<HeatLane[]> {
    
    //set variable for number of lanes from API parameter input
    const numLanes = createRaceDto.numLanes;

    //set variable for raceName from API parameter input
    const raceName = createRaceDto.raceName;

    //set variable for raceId from API parameter input
    const raceId = createRaceDto.raceId;

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
          racer: true,
        }
      });
      if(oneValue !== null){
        //filter results by role, use the ? since racer can be null
        checkRole = oneValue.racer?.role;
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
    cars = this.shuffleSort(cars);
   
    //console.log("after shuffle: ", cars);

    //figure out how many heats are needed
    let numHeats = cars.length/numLanes;

    //assign lanes
    return this.createHeats(numHeats, cars, raceId, raceName, inputRole);

  }

  //reusable function for fisher yates shuffle sort
  shuffleSort(cars: Car[]): Car[] {
    for (let i = cars.length - 1; i > 0; i--) { 
      const j = Math.floor(Math.random() * (i + 1)); 
      [cars[i], cars[j]] = [cars[j], cars[i]]; 
    } 

    return cars; 
  }

  async createHeats(numHeats: number, cars: Car[], raceId: number, raceName: string, inputRole: string): Promise<HeatLane[]>{
    
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
            raceName: raceName,
            raceRole: inputRole, 
          },
        });
        heats.push(newHeatLane);
        counter++; 
      }
    }

    return heats;
  }

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
          racerId: null, 
          year: 9999, 
          image: "blank", 
        },
      });
      cars.push(blankCar);
    }

    return cars;
  }

  async createSemi(createRaceDto: CreateRaceDto): Promise<HeatLane[]> {
  
    //set variable for number of lanes from API parameter input
    const numLanes = createRaceDto.numLanes;

    //set variable for raceName from API parameter input, which is the race that semis are created from
    //first time quarterfinals, then quarterdeadheats
    const raceName = createRaceDto.raceName;

    //set variable for raceId from API parameter input
    const raceId = createRaceDto.raceId;

    //set variable for role to filter car table based on API parameter iput
    const inputRole = createRaceDto.role;

    let heats : HeatLane[] = [];

    const heatCount = await this.prisma.heatLane.count({
      select: {
        _all: true, // Count all records
      },
    })

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
          racer: true,
        }
      });
      if(oneValue !== null){
        //filter results by role, use the ? since racer can be null
        checkRole = oneValue.racer?.role;
        if( checkRole === inputRole){
          if( oneValue.name !== "blank"){
            cars.push(oneValue);
          }
        }
        foundIndex++;
      }
    }

    //find all the results in a set of races for each non-blank car id

    //loop through all heatlanes of non-blank cars that match the input role
    //note racename should be "quarterfinals" first
    for(let i = 0; i < cars.length; i++){
      const selectHeats = await this.prisma.heatLane.findMany({
        select: {
          result: true,
          raceId: true,
          carId: true,
          id: true,
        },
        where: {
          raceRole: inputRole,
          carId: cars[i].id,
          raceName: raceName,
        },
        orderBy: {
          raceId: 'asc',
        },
      })

      //console.log("selectHeats of car id ", cars[i].id, " :", selectHeats);
      
      totalResults.push({
          carId: cars[i].id,
          aggResults: 0,
      });

      //sum up results for each car 
      for(let j = 0; j < selectHeats.length; j++){
        //the ?? syntax is because that value could be null
        totalResults[i].aggResults = totalResults[i].aggResults + (selectHeats[j].result ?? 0); 
      }
    }

    //summed up results.  Note, this likely needs to be a table not an array
    //console.log("totalresults: ", totalResults);

    //total number of semifinal participants
    const numSemiLanes = numLanes * 2; 

    //console.log("numSemiLanes: " + numSemiLanes);
  
    //find the top number that is within the semifinal participants
    
    //sort from lowest to highest
    const sortedResult = totalResults.sort((a, b) => a.aggResults - b.aggResults);

    console.log("sortedResult: ", sortedResult);

    //check if there are any ties
    //find last place first
    const lastPlaceAggResults = sortedResult[numSemiLanes-1].aggResults;

    console.log("last place: ", sortedResult[numSemiLanes-1].carId);

    const deadHeat = [
      { 
        carId: 0,
        aggResults: 0, 
      },
    ];

    deadHeat.length = 0;

    const advanceToSemis = [
      { 
        carId: 0,
        aggResults: 0, 
      },
    ];
    
    advanceToSemis.length = 0;
    
    //Check how many can advance if this is the deadheat one
    //numSemiLanes is the total number that can advance if this is quarterfinals

    let checkNumAdvances = this.numAdvances.getNumAdvances();

    console.log("checkNumAdvances: " + checkNumAdvances);

    if(checkNumAdvances === 0){
      checkNumAdvances = numSemiLanes;
    }
    else{
      checkNumAdvances = numSemiLanes - checkNumAdvances;
    }
    
    console.log("checkNumAdvances after checking for zero value: " + checkNumAdvances);

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
        if(i <= checkNumAdvances ){
          if(sortedResult[i].aggResults === lastPlaceAggResults){
            deadHeat.push({
              carId: sortedResult[i].carId,
              aggResults: sortedResult[i].aggResults,
            });
          }
          else {
            advanceToSemis.push({
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
      this.addBlankCars(deadHeatCars, numLanes).then(result => deadHeatCars = result);

      //randomly sort the cars including blanks
      deadHeatCars = this.shuffleSort(deadHeatCars);
   
      //console.log("after shuffle: ", cars);

      //figure out how many heats are needed
      let numDeadHeats = deadHeatCars.length/numLanes;

      let deadHeatRaceName = raceName + "deadHeat";

      //assign lanes
      this.createHeats(numDeadHeats, deadHeatCars, raceId, deadHeatRaceName, inputRole).then(result => heats = result);

      //console.log("these deadheat cars are now sorted: ", deadHeatCars);    
    }
    //if there isn't, then there's no need for deadheat, because all cars that can advance will advance, and there's no need to care about ties
    else{
      for(let i = 0; i < sortedResult.length; i++){
        if(i < checkNumAdvances ){
          advanceToSemis.push({
            carId: sortedResult[i].carId,
            aggResults: sortedResult[i].aggResults,
          });
        }
      }
    }

    //TODO: revisit when numAdvances gets set, and what to do with the cars that do advance

    this.numAdvances.setnumAdvances(advanceToSemis.length);

    console.log("this many advanced: " + this.numAdvances.getNumAdvances());

    console.log("these cars advance to semis: ", advanceToSemis);

    let advanceToSemisCars : Car[] = [];    

    for(let i = 0; i < advanceToSemis.length; i++){
      const oneValue = await this.prisma.car.findUnique({
        where: {
          id: advanceToSemis[i].carId,
        }
      });
      if(oneValue !== null){
        advanceToSemisCars.push(oneValue);
      }
    }

    //NOTE: shuffle and building semi heats needs to wait until a full semis is available
    //advanceToSemisCars = this.shuffleSort(advanceToSemisCars);

    //console.log("these advance to semis cars are now sorted: ", advanceToSemisCars);

    //note return is returning deadheats technically ... maybe don't need a return at all? 
    return heats; 

  }

  findAll() {
    return `This action returns all race`;
  }

  findOne(id: number) {
    return `This action returns a #${id} race`;
  }

  update(id: number, updateRaceDto: UpdateRaceDto) {
    return `This action updates a #${id} race`;
  }

  remove(id: number) {
    return `This action removes a #${id} race`;
  }
}
