import { IsString, IsNotEmpty, IsInt } from 'class-validator';
import { Racer } from "../../racer/entities/racer.entity"
import { ApiProperty } from '@nestjs/swagger';

export class CreateCarDto {
    @ApiProperty({
        example: 'Lightning McQueen',
        description: 'The name of the car',
    })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({
        example: '5.0',
        description: 'The official weight of the car',
    })
    @IsString()
    @IsNotEmpty()
    weight: string;

    @ApiProperty({ required: false, nullable: true })
    @IsInt()
    racerId: Racer["id"];

    @ApiProperty({
        example: '2025',
        description: 'The 4 digit year that this car raced',
    })
    @IsInt()
    year: number;

    @ApiProperty({
        example: '...',
        description: 'The URL path to the image of the car',
    })
    @IsString()
    image: string;

}
