import { ApiProperty } from '@nestjs/swagger';
import { Race as RaceModel } from '@prisma/client';

export class RaceResponseDto implements RaceModel {
    @ApiProperty({
        example: 1,
        description: 'The unique identifier of the race'
    })
    id: number;

    @ApiProperty({
        example: 'Quarterfinals',
        description: 'The name of the race',
        required: false
    })
    raceName: string | null;

    @ApiProperty({
        example: 1,
        description: 'The type of race (e.g., 10 for quarterfinal, 20 for semifinal, 30 for final)',
        required: false
    })
    raceType: number | null;

    @ApiProperty({
        example: 'tiger',
        description: 'The rank category for this race (e.g., cub, sibling, adult, tiger, wolf, bear)',
        required: false
    })
    rank: string | null;

    @ApiProperty({
        example: 6,
        description: 'The number of lanes in this race'
    })
    numLanes: number;
}