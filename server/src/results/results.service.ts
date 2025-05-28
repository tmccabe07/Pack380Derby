import { Injectable } from '@nestjs/common';
import { CreateResultDto } from './dto/create-result.dto';
import { UpdateResultDto } from './dto/update-result.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Results } from '@prisma/client';
import { Results as ResultEntity } from './entities/results.entity';

@Injectable()
export class ResultsService {
  
  constructor(private prisma: PrismaService) {}
  
  async create(createResultDto: CreateResultDto): Promise<Results> {

    const carId = createResultDto.carId;
    const raceType = createResultDto.raceType;
    let aggResults = 0;
    //create a unique value to use with prisma where
    const carIdandRaceType = carId.toString() + raceType.toString();

    //not declaring any type due to match errors; there must be a way to declare as Results though
    let totalResults = new ResultEntity();

    //find all heats of cars that match the car id and race id to filter on
    const selectHeats = await this.prisma.heatLane.findMany({
      select: {
        result: true,
        raceId: true,
        carId: true,
        id: true,
      },
      where: {
        carId: carId,
        raceType: raceType,
      },
      orderBy: {
        raceId: 'asc',
      },
    })

    console.log("selectHeats of car id ", carId, " :", selectHeats);
      
    //sum up results 
    if(selectHeats.length > 0) {
      //console.log("select Heats is not null");

      //sum up results  
      for(let j = 0; j < selectHeats.length; j++){
        aggResults = aggResults + (selectHeats[j].result ?? 0); 
      }

      //check if a result row already exists for this car and race type
      const oneValue = await this.prisma.results.findUnique({
        where: {
          carIdandRaceType: carIdandRaceType,
        }
      })

      //if result doesn't exist, create it
      if(oneValue === null){
        totalResults = await this.prisma.results.create({
          data: {
            carId: carId,
            raceType: raceType,
            aggResults: aggResults,
            carIdandRaceType: carIdandRaceType,
          },
        });
      } //otherwise, update the record
      else{
        totalResults = await this.prisma.results.update({
          where: {
            carIdandRaceType: carIdandRaceType,
          },
          data: {
            carId: carId,
            raceType: raceType,
            aggResults: aggResults,
            carIdandRaceType: carIdandRaceType,
          },
        })
      }
    }
    
    //summed up results.  
    //console.log("totalresults: ", totalResults);

    return totalResults;
  }
  
  async findAll() : Promise<Results[]> {
    return await this.prisma.results.findMany({}) 
  }

  async findOne(id: number): Promise<Results> {
    const oneValue = await this.prisma.results.findUnique({
      where: {
        id: id,
      },
    });

    if (oneValue === null) {
      return null as any;
    } 
    return oneValue; 
  }

  async findRaceType(raceType: number) : Promise<Results[]> {  
      return await this.prisma.results.findMany({
        where:{
          raceType: raceType,
        },
        orderBy: [
          {
            id: 'asc',
          },
        ],
      })
    }

  async remove(id: number) : Promise<Results> {
    const checkIndex = await this.prisma.results.findUnique({
      where: {
        id: id,
      },
    })

    if (checkIndex === null) {
      return null as any;
    } 
    
    return await this.prisma.results.delete({
        where: {
          id: id,
        },
    });
  }

  async clearResultsTable(): Promise<string> {
    await this.prisma.$queryRaw`DELETE FROM public."Results"`
    await this.prisma.$queryRaw`ALTER SEQUENCE public."Results_id_seq" RESTART WITH 1`;
    return "Results table dropped and sequence restarted";
  }

}
