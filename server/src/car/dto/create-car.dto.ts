import { IsString, IsNotEmpty, IsInt } from 'class-validator';
import { Racer } from "../../racer/entities/racer.entity"

export class CreateCarDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    weight: string;

    @IsInt()
    racerId: Racer["id"];

    @IsInt()
    year: number;

    @IsString()
    image: string;

}
