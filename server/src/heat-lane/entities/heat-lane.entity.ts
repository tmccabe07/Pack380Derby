import { ApiProperty } from '@nestjs/swagger';
import { Car as CarEntity } from '../../car/entities/car.entity';

export class HeatLane {
    @ApiProperty({
        example: '1',
        description: 'The unique id of the heatLane',
    })
    id: number;
        
    @ApiProperty({
        example: '1',
        description: 'The number of the lane',
    })
    lane: number;
        
    @ApiProperty({
        example: '1',
        description: 'The official result of the car',
    })
    result: number;
 
    @ApiProperty({ required: false, nullable: true })
    carId: number | null;

    @ApiProperty({ required: false, type: CarEntity })
    car?: CarEntity;

    constructor({ car, ...data }: Partial<HeatLane>) {
    Object.assign(this, data);

    if (car) {
      this.car = new CarEntity({});
    }

  }
    
}
