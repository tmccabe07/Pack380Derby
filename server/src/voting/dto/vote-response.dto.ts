import { ApiProperty } from '@nestjs/swagger';
import { Vote as VoteModel } from '@prisma/client';
import { CarResponseDto } from '../../car/dto/car-response.dto';
import { RacerResponseDto } from '../../racer/dto/racer-response.dto';
import { VoteCategoryResponseDto } from './vote-category-response.dto';

export class VoteResponseDto implements VoteModel {
    @ApiProperty({
        example: 1,
        description: 'The unique identifier of the vote'
    })
    id: number;

    @ApiProperty({
        example: 5,
        description: 'The score given in the vote (typically 1-5)',
        minimum: 1,
        maximum: 5
    })
    score: number;

    @ApiProperty({
        example: 1,
        description: 'The ID of the car being voted for'
    })
    carId: number;

    @ApiProperty({
        type: () => CarResponseDto,
        description: 'The car being voted for',
        required: false
    })
    car?: CarResponseDto;

    @ApiProperty({
        example: 1,
        description: 'The ID of the racer casting the vote'
    })
    voterId: number;

    @ApiProperty({
        type: () => RacerResponseDto,
        description: 'The racer casting the vote',
        required: false
    })
    voter?: RacerResponseDto;

    @ApiProperty({
        example: 1,
        description: 'The ID of the voting category'
    })
    categoryId: number;

    @ApiProperty({
        type: () => VoteCategoryResponseDto,
        description: 'The voting category',
        required: false
    })
    category?: VoteCategoryResponseDto;
}