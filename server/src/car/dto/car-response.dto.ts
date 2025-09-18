import { ApiProperty } from '@nestjs/swagger';
import { Car as CarModel } from '@prisma/client';

export class CarResponseDto implements CarModel {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  weight: string;

  @ApiProperty()
  racerId: number;

  @ApiProperty()
  year: number;

  @ApiProperty()
  image: string;

 
}
