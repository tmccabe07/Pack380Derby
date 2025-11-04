import { Test, TestingModule } from '@nestjs/testing';
import { CarController } from './car.controller';
import { CarService } from './car.service';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';
import { Car } from '@prisma/client';

describe('CarController', () => {
  let controller: CarController;
  let service: CarService;

  const mockCar: Car = {
    id: 1,
    name: 'Test Car',
    weight: '5.0',
    racerId: 1,
    year: 2024,
    image: 'test-image.jpg',
  };

  const mockCarService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findAllByRacerId: jest.fn(),
    findAllByRank: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    clearCarTable: jest.fn(),
    importCarsFromCSV: jest.fn(),
    findRacesByCarId: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CarController],
      providers: [
        {
          provide: CarService,
          useValue: mockCarService,
        },
      ],
    }).compile();

    controller = module.get<CarController>(CarController);
    service = module.get<CarService>(CarService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a car successfully', async () => {
      const createCarDto: CreateCarDto = {
        name: 'Test Car',
        weight: '5.0',
        racerId: 1,
        year: 2024,
        image: 'test-image.jpg',
      };

      mockCarService.create.mockResolvedValue(mockCar);

      const result = await controller.create(createCarDto);

      expect(service.create).toHaveBeenCalledWith(createCarDto);
      expect(result).toEqual(mockCar);
    });
  });

  describe('findAll', () => {
    it('should return all cars when no racerId is provided', async () => {
      const mockCars = [mockCar];
      mockCarService.findAll.mockResolvedValue(mockCars);

      const result = await controller.findAll();

      expect(service.findAll).toHaveBeenCalled();
      expect(service.findAllByRacerId).not.toHaveBeenCalled();
      expect(result).toEqual(mockCars);
    });

    it('should return cars by racerId when racerId is provided', async () => {
      const mockCars = [mockCar];
      const racerId = '1';
      mockCarService.findAllByRacerId.mockResolvedValue(mockCars);

      const result = await controller.findAll(racerId);

      expect(service.findAllByRacerId).toHaveBeenCalledWith(racerId);
      expect(service.findAll).not.toHaveBeenCalled();
      expect(result).toEqual(mockCars);
    });
  });

  describe('findAllByRank', () => {
    it('should return cars by rank', async () => {
      const rank = 'Bear';
      const mockCars = [mockCar];
      mockCarService.findAllByRank.mockResolvedValue(mockCars);

      const result = await controller.findAllByRank(rank);

      expect(service.findAllByRank).toHaveBeenCalledWith(rank);
      expect(result).toEqual(mockCars);
    });
  });

  describe('findOne', () => {
    it('should return a car when found', async () => {
      const id = 1;
      mockCarService.findOne.mockResolvedValue(mockCar);

      const result = await controller.findOne(id);

      expect(service.findOne).toHaveBeenCalledWith(id);
      expect(result).toEqual(mockCar);
    });

    it('should throw NotFoundException when car not found', async () => {
      const id = 999;
      mockCarService.findOne.mockResolvedValue(null);

      await expect(controller.findOne(id)).rejects.toThrow(
        new NotFoundException(`Car with ${id} does not exist.`)
      );
      expect(service.findOne).toHaveBeenCalledWith(id);
    });
  });

  describe('update', () => {
    it('should update a car successfully', async () => {
      const id = 1;
      const updateCarDto: UpdateCarDto = {
        name: 'Updated Car',
        weight: '4.8',
      };
      const updatedCar = { ...mockCar, ...updateCarDto };
      mockCarService.update.mockResolvedValue(updatedCar);

      const result = await controller.update(id, updateCarDto);

      expect(service.update).toHaveBeenCalledWith(id, updateCarDto);
      expect(result).toEqual(updatedCar);
    });

    it('should throw NotFoundException when car to update not found', async () => {
      const id = 999;
      const updateCarDto: UpdateCarDto = { name: 'Updated Car' };
      mockCarService.update.mockResolvedValue(null);

      await expect(controller.update(id, updateCarDto)).rejects.toThrow(
        new NotFoundException(`Car with ${id} does not exist.`)
      );
      expect(service.update).toHaveBeenCalledWith(id, updateCarDto);
    });
  });

  describe('remove', () => {
    it('should remove a car successfully', async () => {
      const id = 1;
      mockCarService.remove.mockResolvedValue(mockCar);

      const result = await controller.remove(id);

      expect(service.remove).toHaveBeenCalledWith(id);
      expect(result).toEqual(mockCar);
    });

    it('should throw NotFoundException when car to remove not found', async () => {
      const id = 999;
      mockCarService.remove.mockResolvedValue(null);

      await expect(controller.remove(id)).rejects.toThrow(
        new NotFoundException(`Car with ${id} does not exist.`)
      );
      expect(service.remove).toHaveBeenCalledWith(id);
    });
  });

  describe('clearCarTable', () => {
    it('should clear car table successfully', async () => {
      const message = 'Car table dropped and sequence restarted';
      mockCarService.clearCarTable.mockResolvedValue(message);

      const result = await controller.clearCarTable();

      expect(service.clearCarTable).toHaveBeenCalled();
      expect(result).toEqual(message);
    });
  });

  describe('importRacers', () => {
    it('should import cars from CSV file successfully', async () => {
      const mockFile: Express.Multer.File = {
        fieldname: 'file',
        originalname: 'cars.csv',
        encoding: '7bit',
        mimetype: 'text/csv',
        size: 1024,
        buffer: Buffer.from('name,weight,racerid,year,image\nTest Car,5.0,1,2024,test.jpg'),
        stream: null as any,
        destination: '',
        filename: '',
        path: '',
      };

      const importResult = { success: 1, failed: 0, errors: [] };
      mockCarService.importCarsFromCSV.mockResolvedValue(importResult);

      const result = await controller.importRacers(mockFile);

      expect(service.importCarsFromCSV).toHaveBeenCalledWith(mockFile.buffer);
      expect(result).toEqual(importResult);
    });

    it('should throw BadRequestException when no file is uploaded', async () => {
      await expect(controller.importRacers(undefined as any)).rejects.toThrow(
        new BadRequestException('No file uploaded')
      );
      expect(service.importCarsFromCSV).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException when file is not CSV', async () => {
      const mockFile: Express.Multer.File = {
        fieldname: 'file',
        originalname: 'cars.txt',
        encoding: '7bit',
        mimetype: 'text/plain',
        size: 1024,
        buffer: Buffer.from('test content'),
        stream: null as any,
        destination: '',
        filename: '',
        path: '',
      };

      await expect(controller.importRacers(mockFile)).rejects.toThrow(
        new BadRequestException('File must be a CSV')
      );
      expect(service.importCarsFromCSV).not.toHaveBeenCalled();
    });
  });

  describe('findRacesByCarId', () => {
    it('should return races for a car when car exists', async () => {
      const id = 1;
      const mockRaces = [
        {
          raceId: 1,
          heatId: 1,
          lane: 1,
          result: 2,
          race: { raceName: 'Test Race' },
        },
      ];
      
      mockCarService.findOne.mockResolvedValue(mockCar);
      mockCarService.findRacesByCarId.mockResolvedValue(mockRaces);

      const result = await controller.findRacesByCarId(id);

      expect(service.findOne).toHaveBeenCalledWith(id);
      expect(service.findRacesByCarId).toHaveBeenCalledWith(id);
      expect(result).toEqual(mockRaces);
    });

    it('should throw NotFoundException when car does not exist', async () => {
      const id = 999;
      mockCarService.findOne.mockResolvedValue(null);

      await expect(controller.findRacesByCarId(id)).rejects.toThrow(
        new NotFoundException(`Car with ID ${id} does not exist.`)
      );
      expect(service.findOne).toHaveBeenCalledWith(id);
      expect(service.findRacesByCarId).not.toHaveBeenCalled();
    });
  });
});
