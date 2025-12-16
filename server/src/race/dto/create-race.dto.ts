import { IsString, IsNotEmpty, IsInt, IsIn, IsBoolean } from 'class-validator';

export class CreateRaceDto {
    @IsInt()
    @IsNotEmpty()
    raceType: number;

    @IsString()
    @IsIn(['lion', 'tiger', 'wolf', 'bear', 'webelos', 'aol', 'cub','sibling','adult'], { message: 'racerType must be one of: lion, tiger, wolf, bear, webelos, aol, cub, sibling, adult'})
    racerType: string;
    
    @IsBoolean()
    groupByRank: boolean;
}
