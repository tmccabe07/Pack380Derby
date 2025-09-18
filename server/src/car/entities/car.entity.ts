import { ApiProperty } from '@nestjs/swagger';
import { Racer as RacerModel } from '@prisma/client';
import { RacerResponseDto } from '../../racer/dto/racer-response.dto';

export class Car {
   
    id: number;
    
    name: string;
    
    weight: string;
    
    racerId: number | null;

    @ApiProperty({ required: false, type: () => RacerResponseDto })
    racer?: RacerModel;

    constructor({ racer, ...data }: Partial<Car>) {
      Object.assign(this, data);
    }

    year: number;

    image?: string;
}
