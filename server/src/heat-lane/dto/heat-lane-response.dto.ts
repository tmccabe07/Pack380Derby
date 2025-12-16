import { ApiProperty } from '@nestjs/swagger';
import { HeatLane as HeatLaneModel, Car as CarModel, Race as RaceModel } from '@prisma/client';
import { CarResponseDto } from '../../car/dto/car-response.dto';
import { RaceResponseDto } from '../../race/dto/race-response.dto';

export class HeatLaneResponseDto implements HeatLaneModel {
    @ApiProperty({
        example: 1,
        description: 'The unique identifier of the heat lane',
        required: true
    })
    id: number;

    @ApiProperty({
        example: 1,
        description: 'The lane number in the race (1-6 typically)',
        required: true
    })
    lane: number;

    @ApiProperty({
        example: 2,
        description: 'The finishing position in this heat lane (1st = 1, 2nd = 2, etc); 0 indicates default',
        required: false
    })
    result: number | null;

    @ApiProperty({
        example: 1,
        description: 'The ID of the car assigned to this lane',
        required: true
    })
    carId: number;

    @ApiProperty({
        type: () => CarResponseDto,
        description: 'The car assigned to this lane',
        required: true
    })
    car: CarModel;

    @ApiProperty({
        example: 1,
        description: 'The heat number within the race',
        required: true
    })
    heatId: number;

    @ApiProperty({
        example: 1,
        description: 'The ID of the race this heat lane belongs to',
        required: true
    })
    raceId: number;

    @ApiProperty({
        type: () => RaceResponseDto,
        description: 'The race this heat lane belongs to',
        required: true
    })
    race: RaceModel;

    @ApiProperty({
        example: 1,
        description: 'The type of race (e.g., preliminary, semifinal, final)',
        required: true
    })
    raceType: number;

    @ApiProperty({
        example: 'cub',
        description: 'The racer type category (e.g., cub, sibling, adult)',
        required: true
    })
    racerType: string;
}