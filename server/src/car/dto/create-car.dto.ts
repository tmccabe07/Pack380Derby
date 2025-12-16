import { IsString, IsNotEmpty, IsInt, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCarDto {
    @ApiProperty({
        example: 'Lightning McQueen',
        description: 'The name of the car',
         required: true,
    })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({
        example: '5.0',
        description: 'The official weight of the car',
        required: true,
    })
    @IsString()
    @IsNotEmpty()
    weight: string;

    @ApiProperty({
        example: 1,
        description: 'The ID of the racer who owns this car',
        required: true,
    })
    @IsInt()
    racerId: number;

    @ApiProperty({
        example: '2025',
        description: 'The 4 digit year that this car raced',
        required: false,
        nullable: true
    })
    @IsInt()
    @IsOptional()
    year?: number;

    @ApiProperty({
        example: '...',
        description: 'The base64 encoding ofthe image of the car',
        required: false,
        nullable: true
    })
    @IsString()
    @IsOptional()
    image: string;

}
