import { IsNotEmpty, IsInt, IsIn, IsString } from 'class-validator';
import { Car } from "../../car/entities/car.entity";
import { Race } from "../../race/entities/race.entity"

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
