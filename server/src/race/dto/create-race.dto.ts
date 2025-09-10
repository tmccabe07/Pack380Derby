import { IsString, IsNotEmpty, IsInt, IsIn, IsBoolean } from 'class-validator';

export class CreateRaceDto {

    @IsInt()
    numLanes: number;

    @IsInt()
    @IsNotEmpty()
    raceType: number;

    @IsString()
    @IsIn(['lion', 'tiger', 'wolf', 'bear', 'webelos', 'aol', 'cub','sibling','adult'], { message: 'rank must be one of: lion, tiger, wolf, bear, webelos, aol, cub, sibling, adult'})
    rank: string;
    
    @IsBoolean()
    groupByRank: boolean;
}
