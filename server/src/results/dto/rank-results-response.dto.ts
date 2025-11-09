import { ApiProperty } from '@nestjs/swagger';

export class RankResultsResponseDto {
    @ApiProperty({
        example: 1,
        description: 'The ID of the car',
    })
    carId: number;

    @ApiProperty({
        example: 'cub',
        description: 'The rank of the car',
        enum: ['cub', 'sibling', 'adult'],
    })
    rank: string;

    @ApiProperty({
        example: 10,
        description: 'Race type code (10=preliminary, 20=semi, 30=final, 40=preliminarydeadheat, 50=semideadheat)',
    })
    raceType: number;

    @ApiProperty({
        example: 106,
        description: 'The summed place of all heats for this car, plus 100',
    })
    totalPlace: number;
}