import { Test, TestingModule } from '@nestjs/testing';
import { RacerService } from './racer.service';
import { PrismaService } from '../prisma/prisma.service';

const racerArray = [
  { name: 'Racer 1', den: '8', rank: 'tiger'},
  { name: 'Racer 2', den: '10', rank: 'lion'},
  { name: 'Racer 3', den: 'adult', rank: 'adult'},
  { name: 'Racer 4', den: 'sibling', rank: 'sibling'},
];

const oneRacer = racerArray[0];

const db = {
  racer: {
    findMany: jest.fn().mockResolvedValue(racerArray),
    findUnique: jest.fn().mockResolvedValue(oneRacer),
    findFirst: jest.fn().mockResolvedValue(oneRacer),
    create: jest.fn().mockReturnValue(oneRacer),
    save: jest.fn(),
    update: jest.fn().mockResolvedValue(oneRacer),
    delete: jest.fn().mockResolvedValue(oneRacer),
  },
};

const oneAdult = racerArray[2];

const adultdb = {
  racer: {
    findMany: jest.fn().mockResolvedValue(racerArray),
    findUnique: jest.fn().mockResolvedValue(oneAdult),
    findFirst: jest.fn().mockResolvedValue(oneAdult),
    create: jest.fn().mockReturnValue(oneAdult),
    save: jest.fn(),
    update: jest.fn().mockResolvedValue(oneAdult),
    delete: jest.fn().mockResolvedValue(oneAdult),
  },
}

const oneSibling = racerArray[3];

const siblingdb = {
  racer: {
    findMany: jest.fn().mockResolvedValue(racerArray),
    findUnique: jest.fn().mockResolvedValue(oneSibling),
    findFirst: jest.fn().mockResolvedValue(oneSibling),
    create: jest.fn().mockReturnValue(oneSibling),
    save: jest.fn(),
    update: jest.fn().mockResolvedValue(oneSibling),
    delete: jest.fn().mockResolvedValue(oneSibling),
  },
}


describe('RacerService', () => {
  let service: RacerService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RacerService,
        {
          provide: PrismaService,
          useValue: db,
        },
      ],
    }).compile();

    service = module.get<RacerService>(RacerService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  describe('getAll', () => {
    it('should return an array of racer', async () => {
      const cats = await service.findAll();
      expect(cats).toEqual(racerArray);
    });
  });

  describe('getOne', () => {
    it('should get a single racer', () => {
      expect(service.findOne(1)).resolves.toEqual(oneRacer);
    });

    it('should return error message due to invalid id', () => {
      const dbSpy = jest
        .spyOn(prisma.racer, 'findUnique')
        .mockRejectedValueOnce(new Error('Racer with 4 does not exist.'));
      expect(service.findOne(4)).rejects.toThrow('Racer with 4 does not exist.')
    });
  });

   describe('createOne', () => {
    it('should successfully create a cub', () => {
      expect(
        service.createRacer({
          name: 'Racer 1',
          den: '8',
          rank: 'tiger',
        }),
      ).resolves.toEqual(oneRacer);
    });

    it('should return error message due to invalid rank', async () => {
      const dbSpy = jest
        .spyOn(prisma.racer, 'create')
        .mockRejectedValueOnce(new Error('Invalid Rank'));
      expect(service.createRacer({name: 'Racer 1', den: '8', rank: 'tigger'})).rejects.toThrow('Invalid Rank')
    });
  });

  describe('updateOne', () => {
    it('should call the update method', async () => {
      const cat = await service.update(2, {
        name: 'Racer 1',
        den: '8',
        rank: 'tiger',
      });
      expect(cat).toEqual(oneRacer);
    });

    it('should return error message due to invalid id', async () => {
      const dbSpy = jest
        .spyOn(prisma.racer, 'update')
        .mockRejectedValueOnce(new Error('Racer with 4 does not exist.'));
      expect(service.update(4, {name: 'Racer 1', den: '8', rank: 'tiger'})).rejects.toThrow('Racer with 4 does not exist.')
    });
  });

  describe('deleteOne', () => {
    it('should return value of deleted', () => {
      expect(service.remove(1)).resolves.toEqual(oneRacer);
    });

    it('should return error message due to invalid id', () => {
      const dbSpy = jest
        .spyOn(prisma.racer, 'delete')
        .mockRejectedValueOnce(new Error('Racer with 4 does not exist.'));
      expect(service.remove(4)).rejects.toThrow('Racer with 4 does not exist.')
    });
  });

  /*it('should be defined', () => {
    expect(service).toBeDefined();
  });*/


});

describe('RacerServiceAdult', () => {
  let service: RacerService;
  let prisma: PrismaService;

beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RacerService,
        {
          provide: PrismaService,
          useValue: adultdb,
        },
      ],
    }).compile();

    service = module.get<RacerService>(RacerService);
    prisma = module.get<PrismaService>(PrismaService);
  });


  describe('createAdult', () => {
    it('should successfully create an adult', () => {
      expect(
        service.createRacer({
          name: 'Racer 3',
          den: 'adult',
          rank: 'adult',
        }),
      ).resolves.toEqual(oneAdult);
    });
  });

});

describe('RacerServiceSibling', () => {
  let service: RacerService;
  let prisma: PrismaService;

beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RacerService,
        {
          provide: PrismaService,
          useValue: siblingdb,
        },
      ],
    }).compile();

    service = module.get<RacerService>(RacerService);
    prisma = module.get<PrismaService>(PrismaService);
  });


  describe('createAdult', () => {
    it('should successfully create a sibling', () => {
      expect(
        service.createRacer({
          name: 'Racer 4',
          den: 'sibling',
          rank: 'sibling',
        }),
      ).resolves.toEqual(oneSibling);
    });
  });

});