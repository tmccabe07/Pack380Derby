import { IsNotEmpty, IsInt, IsIn, IsString } from 'class-validator';
import { Car, Race } from "@prisma/client";

export class CreateHeatLaneDto {
    @IsInt()
    @IsNotEmpty()
    @IsIn([1,2,3,4,5,6,0])
    lane: number;
    
    @IsInt()
    @IsIn([1,2,3,4,5,6,0])
    result: number;
    
    @IsInt()
    carId: Car["id"];

    @IsInt()
    heatId: number;

    @IsInt()
    raceId: Race["id"];

    @IsInt()
    raceType: number;

    @IsString()
    @IsIn(['cub', 'sibling', 'adult'])
    rank: string;
}
