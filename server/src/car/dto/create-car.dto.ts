import { IsString, IsNotEmpty, IsInt } from 'class-validator';
import { Person } from "../../person/entities/person.entity"

export class CreateCarDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    weight: string;

    @IsInt()
    racerId: Person["id"];

    @IsInt()
    year: number;

    @IsString()
    image: string;

}
