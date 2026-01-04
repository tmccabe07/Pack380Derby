import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateVoteDto } from './dto/create-vote.dto';
import { CreateVoteCategoryDto } from './dto/create-vote-category.dto';
import { UpdateVoteCategoryDto } from './dto/update-vote-category.dto';
import { Vote, VoteCategory } from '@prisma/client';

@Injectable()
export class VotingService {
    constructor(private prisma: PrismaService) {}

    async createCategory(createVoteCategoryDto: CreateVoteCategoryDto): Promise<VoteCategory> {
        return await this.prisma.voteCategory.create({
            data: createVoteCategoryDto,
        });
    }

    async getCategories(): Promise<VoteCategory[]> {
        return await this.prisma.voteCategory.findMany({
            orderBy: [
                {
                id: 'asc',
                },
            ],
        })
    }

    async getCategoriesWithVotes(): Promise<VoteCategory[]> {
        return await this.prisma.voteCategory.findMany({
            include: { 
                votes: true,
            },
        });
    }

    async getVotesByCategoryId(categoryId: number): Promise<Vote[]> {
        return await this.prisma.vote.findMany({ 
            where: { categoryId },
            include: {
                car: true,
                voter: true,
            },
        });
    }

    async createVote(createVoteDto: CreateVoteDto): Promise<Vote> {
        // Check if a vote already exists for this voter in this category
        const existingVote = await this.prisma.vote.findFirst({
            where: {
                voterId: createVoteDto.voterId,
                categoryId: createVoteDto.categoryId,
            },
        });

        if (existingVote) {
            // Update the existing vote
            return await this.prisma.vote.update({
                where: { id: existingVote.id },
                data: {
                    carId: createVoteDto.carId,
                    score: createVoteDto.score,
                },
            });
        }

        // Create a new vote if none exists
        return await this.prisma.vote.create({
            data: {
                carId: createVoteDto.carId,
                voterId: createVoteDto.voterId,
                score: createVoteDto.score,
                categoryId: createVoteDto.categoryId,
            },
        });
    }

    async findAll(): Promise<Vote[]> {
        return await this.prisma.vote.findMany({
            include: {
                car: true,
                voter: true,
            },
        });
    }

    async findOne(id: number): Promise<Vote | null> {
        return await this.prisma.vote.findUnique({
            where: { id },
            include: {
                car: true,
                voter: true,
            },
        });
    }

    async remove(id: number): Promise<Vote> {
        return await this.prisma.vote.delete({
            where: { id },
        });
    }

    async getVotesByCarId(carId: number): Promise<Vote[]> {
        return await this.prisma.vote.findMany({
            where: { carId },
            include: {
                voter: true,
            },
        });
    }

    async updateCategory(id: number, updateVoteCategoryDto: UpdateVoteCategoryDto): Promise<VoteCategory> {
        const category = await this.prisma.voteCategory.findUnique({
            where: { id },
        });

        if (!category) {
            throw new NotFoundException(`Vote category with ID ${id} not found`);
        }

        return await this.prisma.voteCategory.update({
            where: { id },
            data: updateVoteCategoryDto,
        });
    }

    async deleteCategory(id: number): Promise<VoteCategory> {
        const category = await this.prisma.voteCategory.findUnique({
            where: { id },
            include: {
                votes: true,
            },
        });

        if (!category) {
            throw new NotFoundException(`Vote category with ID ${id} not found`);
        }

        // First delete all votes in this category
        if (category.votes.length > 0) {
            await this.prisma.vote.deleteMany({
                where: { categoryId: id },
            });
        }

        // Then delete the category
        return await this.prisma.voteCategory.delete({
            where: { id },
        });
    }

    /*Groups votes by carId within a specific category
    Calculates the sum of scores for each car (assumes that each car can have multiple votes in a category)
    Includes car and racer details in the response
    Orders results by total score in descending order*/
    async getVotesByVoterId(voterId: number): Promise<Vote[]> {
        return await this.prisma.vote.findMany({
            where: { voterId },
            include: {
                //car: true,
                category: true,
            },
        });
    }
    async getSumScoresByCategory(categoryId: number) {
        const voteSums = await this.prisma.vote.groupBy({
            by: ['carId'],
            where: {
                categoryId: categoryId
            },
            _sum: {
                score: true
            },
            orderBy: {
                _sum: {
                    score: 'desc'
                }
            }
        });

        const carsWithScores = await Promise.all(
            voteSums.map(async (voteSum) => {
                const car = await this.prisma.car.findUnique({
                    where: { id: voteSum.carId },
                });

                return {
                    carId: voteSum.carId,
                    carName: car?.name,
                    totalScore: voteSum._sum.score
                };
            })
        );

        return carsWithScores;
    }
}
