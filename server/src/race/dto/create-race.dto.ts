import { IsString, IsNotEmpty, IsInt, IsIn } from 'class-validator';

export class CreateRaceDto {

    @IsInt()
    numLanes: number;

    @IsInt()
    @IsNotEmpty()
    raceType: number;

    @IsString()
    @IsIn(['cub','sibling','adult'], { message: 'role must be one of: cub, sibling, adult'})
    role: string;
        
}
