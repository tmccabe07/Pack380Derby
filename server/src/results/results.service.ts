import { Injectable } from '@nestjs/common';
import { CreateResultDto } from './dto/create-result.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Results as ResultEntity } from './entities/results.entity';

@Injectable()
export class ResultsService {
  
  constructor(private prisma: PrismaService) {}

  async getRaceResults(createResultDto: CreateResultDto) : Promise<ResultEntity[]> {
    
    const sumBy = createResultDto.sumBy;
    const carId = createResultDto.carId;
    const raceType = createResultDto.raceType;
    const rank = createResultDto.rank;

    let selectHeats;
    
    switch(sumBy){
      case 10: //sum by car id AND race type 
        //find all heats of cars that match the car id and race type to filter on
        selectHeats = await this.prisma.heatLane.findMany({
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
        break;
      case 20: //sum all cars by race type AND rank
        //find all heats of cars that match the race type and rank to filter on
        selectHeats = await this.prisma.heatLane.findMany({
          select: {
            result: true,
            raceId: true,
            carId: true,
            id: true,
          },
          where: {
            raceType: raceType,
            rank: rank,
          },
          orderBy: {
            raceId: 'asc',
          },
        })
        break;
      case 30: //sum all races for a rank
        //find all heats of cars that match the rank to filter on
        selectHeats = await this.prisma.heatLane.findMany({
          select: {
            result: true,
            raceId: true,
            carId: true,
            id: true,
          },
          where: {
            rank: rank,
          },
          orderBy: {
            raceId: 'asc',
          },
        })
        break;
    }

    //initialize total results array
    const totalResults = [
      { 
        carId: carId,
        raceType: raceType,
        rank: rank,
        aggResults: 0, 
      },
    ];

    totalResults.length = 0;


    let totalResultsIndex = 0;

    let cars = [0];

    cars.length = 0;

    let uniqueCars = [0];

    uniqueCars.length = 0;

    if(selectHeats.length > 0){

      for(let i = 0; i < selectHeats.length; i++){   
        cars.push(selectHeats[i].carId);
      }

      //console.log("cars: " + cars);

      //find number of unique cars in select heats
      cars.forEach(item => {
        if (!uniqueCars.includes(item)) {
          uniqueCars.push(item);
        }
      })

      //console.log("unique cars: " + uniqueCars);
      
      for(let i=0; i < uniqueCars.length; i++){

        totalResults.push({
          carId: uniqueCars[i],
          raceType: raceType,
          rank: rank,
          aggResults: 0,
        })

        totalResultsIndex = totalResults.length-1;

        //if unique cars is more than one, need to only sum the select heats for that car
        const specificHeats = selectHeats.filter(element => element.carId === uniqueCars[i]);

        //sum up results for each set of heats for one car at a time 
        for(let j = 0; j < specificHeats.length; j++){
            totalResults[totalResultsIndex].aggResults = totalResults[totalResultsIndex].aggResults + (specificHeats[j].result ?? 0); 
        }

        totalResultsIndex++;
      }
    }

    return totalResults;

  }
  
}
