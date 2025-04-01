import { Injectable } from '@nestjs/common';
import { CreateRaceDto } from './dto/create-race.dto';
import { UpdateRaceDto } from './dto/update-race.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Car, HeatLane, Prisma } from '@prisma/client';

@Injectable()
export class RaceService {

  constructor(private prisma: PrismaService) {}

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
    const cars : Car[] = [];

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

    //set variable to number of total number of cars in car table filtered by role
    const numCars = cars.length;

    //console.log("numCars: ", numCars);

    //find out how many blank cars are needed based on dividing filtered total by numLanes
    const numCarBlanks = numLanes - numCars % numLanes;

    //add appropriate number of blanks to array only, not to persistent table, therefore 900 as high number.
    let blankCarId = 900;

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
      blankCarId++;
    }


    //fisher yates random sort the car array
    for (let i = cars.length - 1; i > 0; i--) { 
      const j = Math.floor(Math.random() * (i + 1)); 
      [cars[i], cars[j]] = [cars[j], cars[i]]; 
    } 

    //assign lanes
    //console.log("after shuffle: ", cars);

    //figure out how many heats are needed
    let numHeats = cars.length/numLanes;
  
    //initialize an array of heatlanes to represent this race
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

  async createSemi(createRaceDto: CreateRaceDto): Promise<HeatLane[]> {
  
    //set variable for number of lanes from API parameter input
    const numLanes = createRaceDto.numLanes;

    //set variable for raceName from API parameter input
    const raceName = createRaceDto.raceName;

    //set variable for raceId from API parameter input
    const raceId = createRaceDto.raceId;

    //set variable for role to filter car table based on API parameter iput
    const inputRole = createRaceDto.role;

    const heats : HeatLane[] = [];

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
    //note hardcoded to racename quarterfinals
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
          raceName: "quarterfinals",
        },
        orderBy: {
          raceId: 'asc',
        },
      })

      //console.log("selectHeats of car id ", cars[i].id, " :", selectHeats);

      //since array was initialized with 1 value, only add values after i is greater than zero
      if(i===0){
        totalResults[i].carId = cars[i].id;
      }
      else{
        totalResults.push({
          carId: cars[i].id,
          aggResults: 0,
        });
      }

      //sum up results for each car 
      for(let j = 0; j < selectHeats.length; j++){
        //the ?? syntax is because that value could be null
        totalResults[i].aggResults = totalResults[i].aggResults + (selectHeats[j].result ?? 0); 
      }
    }

    //summed up results.  Note, this likely needs to be a table not an array
   // console.log("totalresults: ", totalResults);

    //total number of semifinal participants
    const numSemiLanes = numLanes * 2; 
  
    //find the top number that is within the semifinal participants
    
    //sort from lowest to highest
    const sortedResult = totalResults.sort((a, b) => a.aggResults - b.aggResults);
    

    console.log("sortedResult: ", sortedResult);

    //check if there are any ties
    const lastPlaceAggResults = sortedResult[numSemiLanes-1].aggResults;

    console.log("last place: ", sortedResult[numSemiLanes-1].carId);

    const deadHeat = [
      { 
        carId: 0,
        aggResults: 0, 
      },
    ];

    let deadHeatCounter = 0;

    const advanceToSemis = [
      { 
        carId: 0,
        aggResults: 0, 
      },
    ];

    let advanceToSemisCounter = 0;

    for(let i = 0; i < sortedResult.length; i++){
      if(sortedResult[i].aggResults === lastPlaceAggResults){
        if(deadHeatCounter===0){
          deadHeat[0].carId = sortedResult[i].carId;
          deadHeat[0].aggResults = sortedResult[i].aggResults;
        }
        else{
          deadHeat.push({
            carId: sortedResult[i].carId,
            aggResults: sortedResult[i].aggResults,
          });
        }
        deadHeatCounter++;
      }
      else if (i < numSemiLanes) {
        if(advanceToSemisCounter===0){
          advanceToSemis[0].carId = sortedResult[i].carId;
          advanceToSemis[0].aggResults = sortedResult[i].aggResults;
        }
        else{
          advanceToSemis.push({
            carId: sortedResult[i].carId,
            aggResults: sortedResult[i].aggResults,
          });
        }
        advanceToSemisCounter++;
      }

    }

    console.log("these cars are tied and need to do a deadheat: ", deadHeat);
    console.log("these cars advance to semis: ", advanceToSemis);
    
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
