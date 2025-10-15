import { IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SetMultiplierDto {
  @ApiProperty({ 
    description: 'Multiplier value for determining advancing cars',
    minimum: 1,
    example: 2
  })
  @IsNumber()
  @Min(1)
  multiplier: number;
}
