import { ApiProperty } from '@nestjs/swagger';

export class UnifiedResultsResponseDto {
    @ApiProperty({
        example: 1,
        description: 'The ID of the car',
    })
    carId: number;

    @ApiProperty({
        example: 'lion',
        description: 'The rank of the racer (e.g., lion, tiger, wolf, bear, webelos, aol, cub, sibling, adult)',
        required: false,
        nullable: true,
    })
    rank?: string | null;

    @ApiProperty({
        example: 'cub',
        description: 'The racer type (cub, sibling, adult)',
        required: false,
        nullable: true,
    })
    racerType?: string | null;

    @ApiProperty({
        example: 10,
        description: 'Race type code (10=preliminary, 20=semi, 30=final, 40=preliminarydeadheat, 50=semideadheat). Null when aggregating across all race types.',
        required: false,
        nullable: true,
    })
    raceType?: number | null;

    @ApiProperty({
        example: 306,
        description: 'The weighted total place of all heats for this car (result * 100 for each heat, summed)',
    })
    weightedTotal: number;
}
