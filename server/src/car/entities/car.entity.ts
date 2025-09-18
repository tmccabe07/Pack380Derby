import { ApiProperty } from '@nestjs/swagger';
import { Racer as RacerEntity } from '../../racer/entities/racer.entity';

export class Car {
   
    id: number;
    
    name: string;
    
    weight: string;
    
    racerId: number | null;

    @ApiProperty({ required: false, type: RacerEntity })
    racer?: RacerEntity;

    constructor({ racer, ...data }: Partial<Car>) {
    Object.assign(this, data);

    if (racer) {
      this.racer = new RacerEntity();
    }

  }

  year: number;

  
  image?: string;
}
