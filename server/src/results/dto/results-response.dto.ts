import { ApiProperty } from '@nestjs/swagger';
import { Car } from '@prisma/client';
import { CarResponseDto } from '../../car/dto/car-response.dto';

export class ResultsResponseDto {
    @ApiProperty({
        example: 1,
        description: 'The ID of the car',
        required: false,
        nullable: true
    })
    carId: number | null;

    @ApiProperty({ 
        type: () => CarResponseDto,
        description: 'The car details',
        required: false
    })
    car?: Car;

    @ApiProperty({
        example: 10,
        description: 'Race type code (10=quarterfinal, 20=semi, 30=final, 40=quarterfinaldeadheat, 50=semideadheat)',
        required: false,
        nullable: true
    })
    raceType: number | null;

    @ApiProperty({
        example: 6,
        description: 'The aggregated results based on the sumBy parameter. Lower numbers are better.',
        required: false,
        nullable: true
    })
    aggResults: number | null;

    @ApiProperty({
        example: 'tiger',
        description: 'The rank category (e.g., tiger, wolf, bear)',
        required: false
    })
    rank?: string;

}