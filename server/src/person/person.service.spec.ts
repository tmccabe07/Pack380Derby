import { Test, TestingModule } from '@nestjs/testing';
import { PersonService } from './person.service';
import { PrismaService } from '../prisma/prisma.service';

const personArray = [
  { name: 'Person 1', den: '8', rank: 'tiger', role: 'cub' },
  { name: 'Person 2', den: '10', rank: 'lion', role: 'cub' },
  { name: 'Person 3', den: 'adult', rank: 'adult', role: 'adult' },
  { name: 'Person 4', den: 'sibling', rank: 'sibling', role: 'sibling' },
];

const onePerson = personArray[0];

const db = {
  person: {
    findMany: jest.fn().mockResolvedValue(personArray),
    findUnique: jest.fn().mockResolvedValue(onePerson),
    findFirst: jest.fn().mockResolvedValue(onePerson),
    create: jest.fn().mockReturnValue(onePerson),
    save: jest.fn(),
    update: jest.fn().mockResolvedValue(onePerson),
    delete: jest.fn().mockResolvedValue(onePerson),
  },
};

const oneAdult = personArray[2];

const adultdb = {
  person: {
    findMany: jest.fn().mockResolvedValue(personArray),
    findUnique: jest.fn().mockResolvedValue(oneAdult),
    findFirst: jest.fn().mockResolvedValue(oneAdult),
    create: jest.fn().mockReturnValue(oneAdult),
    save: jest.fn(),
    update: jest.fn().mockResolvedValue(oneAdult),
    delete: jest.fn().mockResolvedValue(oneAdult),
  },
}

const oneSibling = personArray[3];

const siblingdb = {
  person: {
    findMany: jest.fn().mockResolvedValue(personArray),
    findUnique: jest.fn().mockResolvedValue(oneSibling),
    findFirst: jest.fn().mockResolvedValue(oneSibling),
    create: jest.fn().mockReturnValue(oneSibling),
    save: jest.fn(),
    update: jest.fn().mockResolvedValue(oneSibling),
    delete: jest.fn().mockResolvedValue(oneSibling),
  },
}


describe('PersonService', () => {
  let service: PersonService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PersonService,
        {
          provide: PrismaService,
          useValue: db,
        },
      ],
    }).compile();

    service = module.get<PersonService>(PersonService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  describe('getAll', () => {
    it('should return an array of person', async () => {
      const cats = await service.findAll();
      expect(cats).toEqual(personArray);
    });
  });

  describe('getOne', () => {
    it('should get a single person', () => {
      expect(service.findOne(1)).resolves.toEqual(onePerson);
    });

    it('should return error message due to invalid id', () => {
      const dbSpy = jest
        .spyOn(prisma.person, 'findUnique')
        .mockRejectedValueOnce(new Error('Person with 4 does not exist.'));
      expect(service.findOne(4)).rejects.toThrow('Person with 4 does not exist.')
    });
  });

   describe('createOne', () => {
    it('should successfully create a cub', () => {
      expect(
        service.createPerson({
          name: 'Person 1',
          den: '8',
          rank: 'tiger',
          role: 'cub',
        }),
      ).resolves.toEqual(onePerson);
    });

    it('should return error message due to invalid rank', async () => {
      const dbSpy = jest
        .spyOn(prisma.person, 'create')
        .mockRejectedValueOnce(new Error('Invalid Rank'));
      expect(service.createPerson({name: 'Person 1', den: '8', rank: 'tigger', role: 'cub'})).rejects.toThrow('Invalid Rank')
    });

    it('should return error message due to invalid role', async () => {
      const dbSpy = jest
        .spyOn(prisma.person, 'create')
        .mockRejectedValueOnce(new Error('Invalid Role'));
      expect(service.createPerson({name: 'Person 1', den: '8', rank: 'tiger', role: 'bear'})).rejects.toThrow('Invalid Role')
    });

  });

  describe('updateOne', () => {
    it('should call the update method', async () => {
      const cat = await service.update(2, {
        name: 'Person 1',
        den: '8',
        rank: 'tiger',
        role: 'cub'
      });
      expect(cat).toEqual(onePerson);
    });

    it('should return error message due to invalid id', async () => {
      const dbSpy = jest
        .spyOn(prisma.person, 'update')
        .mockRejectedValueOnce(new Error('Person with 4 does not exist.'));
      expect(service.update(4, {name: 'Person 1', den: '8', rank: 'tiger', role: 'cub'})).rejects.toThrow('Person with 4 does not exist.')
    });
  });

  describe('deleteOne', () => {
    it('should return value of deleted', () => {
      expect(service.remove(1)).resolves.toEqual(onePerson);
    });

    it('should return error message due to invalid id', () => {
      const dbSpy = jest
        .spyOn(prisma.person, 'delete')
        .mockRejectedValueOnce(new Error('Person with 4 does not exist.'));
      expect(service.remove(4)).rejects.toThrow('Person with 4 does not exist.')
    });
  });

  /*it('should be defined', () => {
    expect(service).toBeDefined();
  });*/


});

describe('PersonServiceAdult', () => {
  let service: PersonService;
  let prisma: PrismaService;

beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PersonService,
        {
          provide: PrismaService,
          useValue: adultdb,
        },
      ],
    }).compile();

    service = module.get<PersonService>(PersonService);
    prisma = module.get<PrismaService>(PrismaService);
  });


  describe('createAdult', () => {
    it('should successfully create an adult', () => {
      expect(
        service.createPerson({
          name: 'Person 3',
          den: 'adult',
          rank: 'adult',
          role: 'adult',
        }),
      ).resolves.toEqual(oneAdult);
    });
  });

});

describe('PersonServiceSibling', () => {
  let service: PersonService;
  let prisma: PrismaService;

beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PersonService,
        {
          provide: PrismaService,
          useValue: siblingdb,
        },
      ],
    }).compile();

    service = module.get<PersonService>(PersonService);
    prisma = module.get<PrismaService>(PrismaService);
  });


  describe('createAdult', () => {
    it('should successfully create a sibling', () => {
      expect(
        service.createPerson({
          name: 'Person 4',
          den: 'sibling',
          rank: 'sibling',
          role: 'sibling',
        }),
      ).resolves.toEqual(oneSibling);
    });
  });

});