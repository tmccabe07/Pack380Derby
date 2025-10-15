import { IsInt, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SetTotalLanesDto {
  @ApiProperty({ 
    description: 'Total number of lanes for the race track where max is 6',
    minimum: 1,
    maximum: 6,
    example: 6
  })
  @IsInt()
  @Min(1)
  @Max(6)
  numLanes: number;
}
