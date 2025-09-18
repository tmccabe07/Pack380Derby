import { ApiProperty } from '@nestjs/swagger';
import { Racer as RacerModel } from '@prisma/client';

export class RacerResponseDto implements RacerModel {
    @ApiProperty()
    id: number;
    
    @ApiProperty()
    name: string;
    
    @ApiProperty()
    den: string;
    
    @ApiProperty()
    rank: string;
}