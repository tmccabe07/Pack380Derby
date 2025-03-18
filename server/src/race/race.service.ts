import { Injectable } from '@nestjs/common';
import { CreateRaceDto } from './dto/create-race.dto';
import { UpdateRaceDto } from './dto/update-race.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Car, HeatLane, Prisma } from '@prisma/client';

@Injectable()
export class RaceService {

  //constructor(private readonly heatLaneService: HeatLaneService) {}

  constructor(private prisma: PrismaService) {}

  async create(createRaceDto: CreateRaceDto): Promise<Car[]> {
    
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

    //find out how many blank cars are needed based on dividing filtered total by numLanes
    const numCarBlanks = numLanes - numCars % numLanes;

    //add appropriate number of blanks to array only, not to persistent table, therefore 900 as high number.
    let blankCarId = 900;

    //updating cubcars array with blanks
    for (let i = 0; i < numCarBlanks; i++){
      cars.push({
          id: blankCarId, 
          name: 'Blank',
          weight: '0',
          racerId: null,
          year: null,
          image: null
      })
      blankCarId++;
    }

    //fisher yates random sort the car array
    for (let i = cars.length - 1; i > 0; i--) { 
      const j = Math.floor(Math.random() * (i + 1)); 
      [cars[i], cars[j]] = [cars[j], cars[i]]; 
    } 

    //assign lanes

    //figure out how many heats are needed
    let numHeats = cars.length/numLanes;
  
    //initialize an array of heatlanes to represent this race
    const heat : HeatLane[] = []; 

    //assign lanes to new array of heat that includes already randomized cars
    let counter = 0; 

    for(let i = 0; i < numHeats; i++) {
      for(let j = 0; j < 6; j++) {
        heat.push({
          id: i+1, 
          result: 99, 
          lane: j+1, 
          carId: cars[j].id, 
          heatId: i+1, 
          raceId: raceId, 
          raceName: raceName 
        })

        /*the data structure passes syntax checks but gives a foreign key constraint violated: 'Heatlane_carId_fkey (index)'*/
        /*await this.prisma.heatLane.create({
            data: {
              result: 99, 
              lane: j+1, 
              carId: cars[j].id, 
              heatId: i+1, 
              raceId: raceId, 
              raceName: raceName
            },
        });*/
        counter++; 
      }
    }




    //console.log("heat", heat);
    //is heat-lane id and heatId redundant?
    //how to include car object into heat? do you only do car ids and then put objects in later? 
    //how do you store heat from an array into a table? maybe instead of an array above, do a prisma write? 

    return cars;

    //return 'This action adds a new race';
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
