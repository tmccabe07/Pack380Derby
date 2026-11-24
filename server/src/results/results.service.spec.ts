import { Test, TestingModule } from '@nestjs/testing';
import { ResultsService } from './results.service';

describe('ResultsService', () => {
  let service: ResultsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ResultsService],
    })
      .useMocker(() => ({}))
      .compile();

    service = module.get<ResultsService>(ResultsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
