import { IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateVoteDto {
    @ApiProperty({ description: 'The ID of the car being voted for', example: 1 })
    @IsNumber()
    @IsNotEmpty()
    carId: number;

    @ApiProperty({ description: 'The ID of the voter', example: 1 })
    @IsNumber()
    @IsNotEmpty()
    voterId: number;

    @ApiProperty({ description: 'The vote', example: 1 })
    @IsNumber()
    @IsNotEmpty()
    score: number;

    @ApiProperty({ description: 'The ID of the voting category', example: 1 })
    @IsNumber()
    @IsNotEmpty()
    categoryId: number; // Assuming categoryId is part of CreateVoteDto
}
