import { IsNotEmpty, IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateVoteCategoryDto {
    @ApiProperty({ description: 'The updated name of the voting category', example: 'Best Design', required: false })
    @IsOptional()
    @IsString()
    name?: string;

    @ApiProperty({ description: 'The updated description of the voting category', example: 'Vote for the car with the most creative design', required: false })
    @IsOptional()
    @IsString()
    description?: string;
}
