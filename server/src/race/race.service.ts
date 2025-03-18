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
            carId: cars[j].id, 
            heatId: i, 
            raceId: raceId,
            raceName: raceName, 
          },
        });
        heats.push(newHeatLane);
        counter++; 
      }
    }

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
