import { ApiProperty } from '@nestjs/swagger';

export class RankResultsResponseDto {
    @ApiProperty({
        example: 1,
        description: 'The ID of the car',
    })
    carId: number;

    @ApiProperty({
        example: 'lion',
        description: 'The rank of the car',
        enum: ['lion', 'tiger', 'wolf', 'bear', 'webelos', 'aol', 'sibling', 'adult'],
    })
    rank: string;

    @ApiProperty({
        example: 10,
        description: 'Race type code (10=preliminary, 20=semi, 30=final, 40=preliminarydeadheat, 50=semideadheat). Null when aggregating across all race types.',
        required: false,
        nullable: true,
    })
    raceType?: number | null;

    @ApiProperty({
        example: 106,
        description: 'The summed place of all heats for this car, plus 100',
    })
    weightedTotal: number;
}