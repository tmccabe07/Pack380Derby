import { IsArray, ArrayMinSize, ArrayMaxSize, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SetUsableLanesDto {
  @ApiProperty({
    description: 'Array of usable lane numbers (1-based indexing)',
    example: [1, 2, 3, 4],
    isArray: true,
    type: 'number'
  })
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(6)
  @IsInt({ each: true })
  usableLanes: number[];
}
