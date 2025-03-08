import { Test, TestingModule } from '@nestjs/testing';
import { HeatLaneService } from './heat-lane.service';

describe('HeatLaneService', () => {
  let service: HeatLaneService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HeatLaneService],
    }).compile();

    service = module.get<HeatLaneService>(HeatLaneService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
