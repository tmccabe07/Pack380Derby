import { IsInt, Min, Max, IsArray, ArrayMinSize, ArrayMaxSize, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SetLanesDto {
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

  @ApiProperty({
    description: 'Array of usable lane numbers (1-based indexing)',
    example: [1, 2, 3, 4, 5, 6],
    required: false
  })
  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(6)
  @IsInt({ each: true })
  usableLanes?: number[];
}
