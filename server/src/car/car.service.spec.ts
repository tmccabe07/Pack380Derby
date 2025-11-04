import { Test, TestingModule } from '@nestjs/testing';
import { CarService } from './car.service';
import { Car } from '@prisma/client';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';
import { NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

describe('CarService', () => {
  let service: CarService;
  let prismaService: PrismaService;

  const mockCar: Car = {
    id: 1,
    name: 'Test Car',
    weight: '5.0',
    racerId: 1,
    year: 2024,
    image: "string",
  };

  const mockPrismaService = {
    car: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CarService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<CarService>(CarService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new car', async () => {
      const createCarDto: CreateCarDto = {
        name: 'Test Car',
        weight: '5.0',
        racerId: 1,
        year: 2024,
        image: "string"
      };

      mockPrismaService.car.create.mockResolvedValue(mockCar);

      const result = await service.create(createCarDto);

      expect(mockPrismaService.car.create).toHaveBeenCalledWith({
        data: createCarDto,
      });
      expect(result).toEqual(mockCar);
    });

    it('should handle database errors during creation', async () => {
      const createCarDto: CreateCarDto = {
        name: 'Test Car',
        weight: '5.0',
        racerId: 1,
        year: 2024,
        image: "string"
      };

      mockPrismaService.car.create.mockRejectedValue(new Error('Database error'));

      await expect(service.create(createCarDto)).rejects.toThrow('Database error');
    });
  });

  describe('findAll', () => {
    it('should return an array of cars', async () => {
      const cars = [mockCar];
      mockPrismaService.car.findMany.mockResolvedValue(cars);

      const result = await service.findAll();

      expect(mockPrismaService.car.findMany).toHaveBeenCalled();
      expect(result).toEqual(cars);
    });

    it('should return empty array when no cars exist', async () => {
      mockPrismaService.car.findMany.mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should return a car by id', async () => {
      mockPrismaService.car.findUnique.mockResolvedValue(mockCar);

      const result = await service.findOne(1);

      expect(mockPrismaService.car.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(result).toEqual(mockCar);
    });

    it('should throw NotFoundException when car not found', async () => {
      mockPrismaService.car.findUnique.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a car', async () => {
      const updateCarDto: UpdateCarDto = {
        name: 'Updated Car',
        weight: '4.8',
      };
      const updatedCar = { ...mockCar, ...updateCarDto };

      mockPrismaService.car.findUnique.mockResolvedValue(mockCar);
      mockPrismaService.car.update.mockResolvedValue(updatedCar);

      const result = await service.update(1, updateCarDto);

      expect(mockPrismaService.car.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(mockPrismaService.car.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: updateCarDto,
      });
      expect(result).toEqual(updatedCar);
    });

    it('should throw NotFoundException when updating non-existent car', async () => {
      const updateCarDto: UpdateCarDto = { name: 'Updated Car' };
      
      mockPrismaService.car.findUnique.mockResolvedValue(null);

      await expect(service.update(999, updateCarDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove a car', async () => {
      mockPrismaService.car.findUnique.mockResolvedValue(mockCar);
      mockPrismaService.car.delete.mockResolvedValue(mockCar);

      await service.remove(1);

      expect(mockPrismaService.car.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(mockPrismaService.car.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it('should throw NotFoundException when removing non-existent car', async () => {
      mockPrismaService.car.findUnique.mockResolvedValue(null);

      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });
  });

});
