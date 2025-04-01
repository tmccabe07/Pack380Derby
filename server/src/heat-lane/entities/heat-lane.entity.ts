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
    carId?: number | null;

    @ApiProperty({ required: false, type: CarEntity })
    car?: CarEntity;

    @ApiProperty({ required: true, nullable: true }) 
    heatId: number | null;

    @ApiProperty({ required: true, nullable: true }) 
    raceId: number | null;

    @ApiProperty({
        example: 'Cub Quarterfinals',
        description: 'The name of the race',
    })
    raceName: string;

    @ApiProperty({
        example: 'Cub',
        description: 'The role that the race is applicable to, Cub, Sibling or Adult',
    })
    raceRole: string;

    constructor({ car, ...data }: Partial<HeatLane>) {
        Object.assign(this, data);

        if (car) {
        this.car = new CarEntity({});
        }

    }

    
    
    
}
