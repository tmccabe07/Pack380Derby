import { IsString, IsNotEmpty, IsInt } from 'class-validator';

export class CreateRaceDto {

    @IsInt()
    numLanes: number;

    @IsInt()
    @IsNotEmpty()
    raceType: number;

    @IsString()
    role: string;
        
}
