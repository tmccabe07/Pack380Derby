import { IsInt, IsIn, IsString } from 'class-validator';

export class CreateResultDto {
    
    @IsInt()
    /*
        10 means sum by car id AND race type, 
        20 means sum all cars by race type AND role, 
        30 means sum all cars in all races for a role,
        Note: it is not valid to sum by raceId because car only races once per raceId
    */
    @IsIn([10,20, 30])
    sumBy: number; 
     
    @IsInt()
    carId: number;

    @IsInt()
    raceType: number;

    @IsString()
    role: string;
}
