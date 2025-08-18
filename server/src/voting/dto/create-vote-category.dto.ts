import { IsNotEmpty, IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateVoteCategoryDto {
  @ApiProperty({ description: 'The name of the voting category', example: 'Best Design' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ description: 'Optional description of the voting category', example: 'Vote for the car with the most creative design', required: false })
  @IsOptional()
  @IsString()
  description?: string;
}
