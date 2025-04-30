import { Injectable } from '@nestjs/common';
import { CreateResultDto } from './dto/create-result.dto';
import { UpdateResultDto } from './dto/update-result.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Results } from '@prisma/client';
import { Result as ResultEntity } from '../results/entities/result.entity';

@Injectable()
export class ResultsService {
  
  constructor(private prisma: PrismaService) {}
  
  async create(createResultDto: CreateResultDto): Promise<Results> {

    const carId = createResultDto.carId;
    const raceType = createResultDto.raceType;
    let aggResults = 0;

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
      
    //only sum up results for cars that were found to match the heatId and raceId
    if(selectHeats.length > 0) {
      //console.log("select Heats is not null");

      //sum up results for each car that was found for the input role and race type 
      for(let j = 0; j < selectHeats.length; j++){
        aggResults = aggResults + (selectHeats[j].result ?? 0); 
      }

      //note, will only want to create first time, else will want to update
      totalResults = await this.prisma.results.create({
        data: {
          carId: carId,
          raceType: raceType,
          aggResults: aggResults,
        },
      });
    }
    
    //summed up results.  
    //console.log("totalresults: ", totalResults);

    return totalResults;
  }
  
  findAll() {
    return `This action returns all results`;
  }

  findOne(id: number) {
    return `This action returns a #${id} result`;
  }

  update(id: number, updateResultDto: UpdateResultDto) {
    return `This action updates a #${id} result`;
  }

  remove(id: number) {
    return `This action removes a #${id} result`;
  }
}
