import { IsNotEmpty, IsInt, IsIn } from 'class-validator';
import { Car } from "../../car/entities/car.entity";

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
}
