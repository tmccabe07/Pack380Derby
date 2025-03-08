import { IsString, IsNotEmpty, IsInt } from 'class-validator';
import { Car } from "../../car/entities/car.entity";

export class CreateHeatLaneDto {
    @IsInt()
    @IsNotEmpty()
    lane: number;
    
    @IsInt()
    result: number;
    
    @IsInt()
    carId: Car["id"];
}
