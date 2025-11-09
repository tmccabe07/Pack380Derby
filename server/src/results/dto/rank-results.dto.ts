import { IsString, IsInt, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RankResultsDto {
    @ApiProperty({
        example: 'cub',
        description: 'The rank to get results for',
        enum: ['cub', 'sibling', 'adult'],
    })
    @IsString()
    @IsIn(['cub', 'sibling', 'adult'])
    rank: string;

    @ApiProperty({
        example: 10,
        description: 'Race type code (10=preliminary, 20=semi, 30=final, 40=preliminarydeadheat, 50=semideadheat)',
    })
    @IsInt()
    raceType: number;
}