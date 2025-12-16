import { ApiProperty } from '@nestjs/swagger';
import { Race as RaceModel } from '@prisma/client';

export class RaceResponseDto implements RaceModel {
    @ApiProperty({
        example: 1,
        description: 'The unique identifier of the race',
        required: true
    })
    id: number;

    @ApiProperty({
        example: 'Preliminary',
        description: 'The name of the race',
        required: true
    })
    raceName: string;

    @ApiProperty({
        example: 1,
        description: 'The type of race (e.g., 10 for preliminary, 20 for semifinal, 30 for final, 40 for prelim-deadheat, 50 for semi-deadheat)',
        required: true
    })
    raceType: number;

    @ApiProperty({
        example: 'cub',
        description: 'The racer type category for this race (e.g., cub, sibling, adult)',
        required: true
    })
    racerType: string;

    @ApiProperty({
        example: 6,
        description: 'The number of lanes in this race',
        required: true
    })
    numLanes: number;
}