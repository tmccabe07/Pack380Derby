import { ApiProperty } from '@nestjs/swagger';
import { HeatLane as HeatLaneModel, Car as CarModel, Race as RaceModel } from '@prisma/client';
import { CarResponseDto } from '../../car/dto/car-response.dto';
import { RaceResponseDto } from '../../race/dto/race-response.dto';

export class HeatLaneResponseDto implements HeatLaneModel {
    @ApiProperty({
        example: 1,
        description: 'The unique identifier of the heat lane'
    })
    id: number;

    @ApiProperty({
        example: 1,
        description: 'The lane number in the race (1-6 typically)'
    })
    lane: number;

    @ApiProperty({
        example: 2,
        description: 'The finishing position in this heat lane (1st = 1, 2nd = 2, etc)',
        required: false
    })
    result: number | null;

    @ApiProperty({
        example: 1,
        description: 'The ID of the car assigned to this lane',
        required: false
    })
    carId: number | null;

    @ApiProperty({
        type: () => CarResponseDto,
        description: 'The car assigned to this lane',
        required: false
    })
    car?: CarModel | null;

    @ApiProperty({
        example: 1,
        description: 'The heat number within the race',
        required: false
    })
    heatId: number | null;

    @ApiProperty({
        example: 1,
        description: 'The ID of the race this heat lane belongs to',
        required: false
    })
    raceId: number | null;

    @ApiProperty({
        type: () => RaceResponseDto,
        description: 'The race this heat lane belongs to',
        required: false
    })
    race?: RaceModel | null;

    @ApiProperty({
        example: 1,
        description: 'The type of race (e.g., preliminary, semifinal, final)',
        required: false
    })
    raceType: number | null;

    @ApiProperty({
        example: 'cub',
        description: 'The racer type category (e.g., cub, sibling, adult)',
        required: false
    })
    racerType: string | null;
}