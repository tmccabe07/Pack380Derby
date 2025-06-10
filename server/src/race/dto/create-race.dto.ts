import { IsString, IsNotEmpty, IsInt, IsIn } from 'class-validator';

export class CreateRaceDto {

    @IsInt()
    numLanes: number;

    @IsInt()
    @IsNotEmpty()
    raceType: number;

    @IsString()
    @IsIn(['cub','sibling','adult'], { message: 'rank must be one of: cub, sibling, adult'})
    rank: string;
        
}
