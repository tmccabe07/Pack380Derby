import { ApiProperty } from '@nestjs/swagger';
import { VoteCategory as VoteCategoryModel, Vote as VoteModel } from '@prisma/client';

export class VoteCategoryResponseDto implements VoteCategoryModel {
    @ApiProperty({
        example: 1,
        description: 'The unique identifier of the vote category'
    })
    id: number;

    @ApiProperty({
        example: 'Best Paint Job',
        description: 'The name of the voting category'
    })
    name: string;

    @ApiProperty({
        example: 'Vote for the car with the most creative and well-executed paint design',
        description: 'Detailed description of the voting category',
        required: false
    })
    description: string | null;

    @ApiProperty({
        type: 'array',
        description: 'List of votes in this category',
        required: false
    })
    votes?: VoteModel[];
}