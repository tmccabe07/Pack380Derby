import { IsString, IsNotEmpty, IsInt, IsIn, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRaceDto {
   @ApiProperty({
        example: 10,
        description: 'The type of the race, valid values are 1 to generate prelim, 10 to generate semifinals, 20 to generate final',
        required: true,
    })
    @IsInt()
    @IsIn([1,10,20], { message: 'raceType must be one of: 1, 10, 20'})
    @IsNotEmpty()
    raceType: number;

    @ApiProperty({
        example: 'cub',
        description: 'The type of the racer, valid values are cub, sibling, adult',
        required: true,
    })
    @IsString()
    @IsIn(['cub','sibling','adult'], { message: 'racerType must be one of: cub, sibling, adult'})
    @IsNotEmpty()
    racerType: string;
    

    @ApiProperty({
        example: true,
        description: 'Whether to group results by rank, where false means group by cub',
        required: true,
    })
    @IsBoolean()
    @IsNotEmpty()
    groupByRank: boolean;
}
