import { Controller, Get, Post, Body, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { VotingService } from './voting.service';
import { CreateVoteDto } from './dto/create-vote.dto';
import { CreateVoteCategoryDto } from './dto/create-vote-category.dto';
import { Vote, VoteCategory } from '@prisma/client';


@ApiTags('voting')
@Controller('voting')
export class VotingController {
    constructor(private readonly votingService: VotingService) {}

    @Post('category')
    @ApiOperation({ summary: 'Create a new voting category' })
    @ApiBody({ type: CreateVoteCategoryDto })
    @ApiResponse({ status: 201, description: 'The voting category has been successfully created.' })
    @ApiResponse({ status: 400, description: 'Bad Request.' })
    async createCategory(@Body() createVoteCategoryDto: CreateVoteCategoryDto): Promise<VoteCategory> {
        return this.votingService.createCategory(createVoteCategoryDto);
    }
    
    @Get('category')
    @ApiOperation({ summary: 'Get all voting categories' })
    @ApiResponse({ status: 200, description: 'Return all voting categories' })
    async getCategories(): Promise<VoteCategory[]> {
        return this.votingService.getCategories();
    }

    @Get('category-with-votes')
    @ApiOperation({ summary: 'Get all categories with their votes' })
    @ApiResponse({ status: 200, description: 'Return all categories with their associated votes' })
    async getCategoriesWithVotes(): Promise<VoteCategory[]> {
        return this.votingService.getCategoriesWithVotes();
    }

    @Post()
    @ApiOperation({ summary: 'Create a new vote' })
    @ApiBody({ type: CreateVoteDto })
    @ApiResponse({ status: 201, description: 'The vote has been successfully created.' })
    @ApiResponse({ status: 400, description: 'Bad Request.' })
    async createVote(@Body() createVoteDto: CreateVoteDto): Promise<Vote> {
        return this.votingService.createVote(createVoteDto);
    }

    @Get()
    @ApiOperation({ summary: 'Get all votes' })
    @ApiResponse({ status: 200, description: 'Return all votes' })
    async findAll(): Promise<Vote[]> {
        return this.votingService.findAll();
    }

    @Get('category/:categoryId')
    @ApiOperation({ summary: 'Get votes by category ID' })
    @ApiParam({ name: 'categoryId', type: 'number', description: 'ID of the voting category' })
    @ApiResponse({ status: 200, description: 'Return votes for the specified category' })
    @ApiResponse({ status: 404, description: 'Category not found' })
    async getVotesByCategoryId(@Param('categoryId', ParseIntPipe) categoryId: number): Promise<Vote[]> {
        return this.votingService.getVotesByCategoryId(categoryId);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a vote by ID' })
    @ApiParam({ name: 'id', type: 'number', description: 'ID of the vote' })
    @ApiResponse({ status: 200, description: 'Return the vote' })
    @ApiResponse({ status: 404, description: 'Vote not found' })
    async findOne(@Param('id', ParseIntPipe) id: number): Promise<Vote | null> {
        return this.votingService.findOne(id);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a vote' })
    @ApiParam({ name: 'id', type: 'number', description: 'ID of the vote to delete' })
    @ApiResponse({ status: 200, description: 'Vote has been successfully deleted' })
    @ApiResponse({ status: 404, description: 'Vote not found' })
    async remove(@Param('id', ParseIntPipe) id: number): Promise<Vote> {
        return this.votingService.remove(id);
    }

    @Get('car/:carId')
    @ApiOperation({ summary: 'Get votes by car ID' })
    @ApiParam({ name: 'carId', type: 'number', description: 'ID of the car' })
    @ApiResponse({ status: 200, description: 'Return votes for the specified car' })
    @ApiResponse({ status: 404, description: 'Car not found' })
    async getVotesByCarId(@Param('carId', ParseIntPipe) carId: number): Promise<Vote[]> {
        return this.votingService.getVotesByCarId(carId);
    }

    @Get('category/:categoryId/scores')
    @ApiOperation({ summary: 'Get sum of vote scores by car for a specific category' })
    @ApiParam({ name: 'categoryId', type: 'number', description: 'ID of the voting category' })
    @ApiResponse({ status: 200, description: 'Returns total scores for each car in the category' })
    @ApiResponse({ status: 404, description: 'Category not found' })
    async getSumScoresByCategory(@Param('categoryId', ParseIntPipe) categoryId: number) {
        return this.votingService.getSumScoresByCategory(categoryId);
    }
}
