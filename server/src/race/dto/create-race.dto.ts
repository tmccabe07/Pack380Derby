import { IsString, IsNotEmpty, IsInt, IsIn, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRaceDto {
   @ApiProperty({
        example: 10,
        description: 'The type of the race, valid values are 10 to generate prelim, 20 to generate semifinals, 30 to generate final',
        required: true,
    })
    @IsInt()
    @IsIn([10,20,30], { message: 'raceType must be one of: 10, 20, 30'})
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
}
