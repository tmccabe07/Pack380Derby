import { ApiProperty } from '@nestjs/swagger';
import { Racer as RacerEntity } from '../../racer/entities/racer.entity';

export class Car {
    @ApiProperty({
        example: '1',
        description: 'The unique id of the car',
    })
    id: number;
    
    
    @ApiProperty({
        example: 'Lightning McQueen',
        description: 'The name of the car',
    })
    name: string;
    
    @ApiProperty({
        example: '5.0',
        description: 'The official weight of the car',
    })
    weight: string;
    
    @ApiProperty({ required: false, nullable: true })
    racerId: number | null;

    @ApiProperty({ required: false, type: RacerEntity })
    racer?: RacerEntity;

    constructor({ racer, ...data }: Partial<Car>) {
    Object.assign(this, data);

    if (racer) {
      this.racer = new RacerEntity();
    }

  }

  @ApiProperty({
    example: '2025',
    description: 'The 4 digit year that this car raced',
  })
  year: number;

  @ApiProperty({
    example: '...',
    description: 'The URL path to the image of the car',
  })
  image?: string;
}
