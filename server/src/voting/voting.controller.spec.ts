import { Test, TestingModule } from '@nestjs/testing';
import { VotingController } from './voting.controller';
import { VotingService } from './voting.service';
import { CreateVoteDto } from './dto/create-vote.dto';
import { CreateVoteCategoryDto } from './dto/create-vote-category.dto';
import { UpdateVoteCategoryDto } from './dto/update-vote-category.dto';
import { PrismaService } from '../prisma/prisma.service';

describe('VotingController', () => {
  let controller: VotingController;
  let service: VotingService;

  const mockVotingService = {
    createCategory: jest.fn(),
    getCategories: jest.fn(),
    getCategoriesWithVotes: jest.fn(),
    getVotesByCategoryId: jest.fn(),
    createVote: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
    getVotesByCarId: jest.fn(),
    updateCategory: jest.fn(),
    deleteCategory: jest.fn(),
    getSumScoresByCategory: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VotingController],
      providers: [
        {
          provide: VotingService,
          useValue: mockVotingService,
        },
      ],
    }).compile();

    controller = module.get<VotingController>(VotingController);
    service = module.get<VotingService>(VotingService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createCategory', () => {
    it('should create a voting category', async () => {
      const createCategoryDto: CreateVoteCategoryDto = {
        name: 'Best Design',
        description: 'Vote for the best designed car',
      };

      const expectedResult = {
        id: 1,
        name: 'Best Design',
        description: 'Vote for the best designed car',
      };

      mockVotingService.createCategory.mockResolvedValue(expectedResult);

      const result = await controller.createCategory(createCategoryDto);

      expect(result).toEqual(expectedResult);
      expect(mockVotingService.createCategory).toHaveBeenCalledWith(createCategoryDto);
    });
  });

  describe('getCategories', () => {
    it('should return an array of categories', async () => {
      const expectedCategories = [
        {
          id: 1,
          name: 'Best Design',
          description: 'Vote for the best designed car',
        },
      ];

      mockVotingService.getCategories.mockResolvedValue(expectedCategories);

      const result = await controller.getCategories();

      expect(result).toEqual(expectedCategories);
      expect(mockVotingService.getCategories).toHaveBeenCalled();
    });
  });

  describe('createVote', () => {
    it('should create a vote', async () => {
      const createVoteDto: CreateVoteDto = {
        carId: 1,
        voterId: 1,
        categoryId: 1,
        score: 8,
      };

      const expectedResult = {
        id: 1,
        ...createVoteDto,
        createdAt: new Date(),
      };

      mockVotingService.createVote.mockResolvedValue(expectedResult);

      const result = await controller.createVote(createVoteDto);

      expect(result).toEqual(expectedResult);
      expect(mockVotingService.createVote).toHaveBeenCalledWith(createVoteDto);
    });
  });

  describe('getVotesByCategoryId', () => {
    it('should return votes for a specific category', async () => {
      const categoryId = 1;
      const expectedVotes = [
        {
          id: 1,
          carId: 1,
          voterId: 1,
          categoryId: 1,
          score: 1,
        },
      ];

      mockVotingService.getVotesByCategoryId.mockResolvedValue(expectedVotes);

      const result = await controller.getVotesByCategoryId(categoryId);

      expect(result).toEqual(expectedVotes);
      expect(mockVotingService.getVotesByCategoryId).toHaveBeenCalledWith(categoryId);
    });
  });

  describe('updateCategory', () => {
    it('should update a voting category', async () => {
      const categoryId = 1;
      const updateCategoryDto: UpdateVoteCategoryDto = {
        name: 'Updated Design Category',
        description: 'Updated description',
      };

      const expectedResult = {
        id: categoryId,
        ...updateCategoryDto,
      };

      mockVotingService.updateCategory.mockResolvedValue(expectedResult);

      const result = await controller.updateCategory(categoryId, updateCategoryDto);

      expect(result).toEqual(expectedResult);
      expect(mockVotingService.updateCategory).toHaveBeenCalledWith(categoryId, updateCategoryDto);
    });
  });

  describe('deleteCategory', () => {
    it('should delete a voting category', async () => {
      const categoryId = 1;
      const expectedResult = {
        id: categoryId,
        name: 'Design Category',
        description: 'Description',
      };

      mockVotingService.deleteCategory.mockResolvedValue(expectedResult);

      const result = await controller.deleteCategory(categoryId);

      expect(result).toEqual(expectedResult);
      expect(mockVotingService.deleteCategory).toHaveBeenCalledWith(categoryId);
    });
  });

  describe('getSumScoresByCategory', () => {
    it('should return summed scores for cars in a category', async () => {
      const categoryId = 1;
      const expectedResult = [
        {
          carId: 1,
          carName: 'Fast Car',
          totalScore: 24,
        },
        {
          carId: 2,
          carName: 'Cool Car',
          totalScore: 18,
        },
      ];

      mockVotingService.getSumScoresByCategory.mockResolvedValue(expectedResult);

      const result = await controller.getSumScoresByCategory(categoryId);

      expect(result).toEqual(expectedResult);
      expect(mockVotingService.getSumScoresByCategory).toHaveBeenCalledWith(categoryId);
    });
  });

  describe('findOne', () => {
    it('should return a single vote', async () => {
      const voteId = 1;
      const expectedVote = {
        id: voteId,
        carId: 1,
        voterId: 1,
        categoryId: 1,
        score: 8,
        createdAt: new Date(),
      };

      mockVotingService.findOne.mockResolvedValue(expectedVote);

      const result = await controller.findOne(voteId);

      expect(result).toEqual(expectedVote);
      expect(mockVotingService.findOne).toHaveBeenCalledWith(voteId);
    });

    it('should return null for non-existent vote', async () => {
      const voteId = 999;
      mockVotingService.findOne.mockResolvedValue(null);

      const result = await controller.findOne(voteId);

      expect(result).toBeNull();
      expect(mockVotingService.findOne).toHaveBeenCalledWith(voteId);
    });
  });

  describe('remove', () => {
    it('should remove a vote', async () => {
      const voteId = 1;
      const expectedResult = {
        id: voteId,
        carId: 1,
        voterId: 1,
        categoryId: 1,
        score: 8,
      };

      mockVotingService.remove.mockResolvedValue(expectedResult);

      const result = await controller.remove(voteId);

      expect(result).toEqual(expectedResult);
      expect(mockVotingService.remove).toHaveBeenCalledWith(voteId);
    });
  });
});
