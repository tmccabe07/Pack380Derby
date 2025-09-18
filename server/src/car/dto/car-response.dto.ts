import { ApiProperty } from '@nestjs/swagger';

export class CarResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  weight: number;

  @ApiProperty()
  racerId: number;

  @ApiProperty()
  year: number;

  @ApiProperty()
  image: string;

 
}
