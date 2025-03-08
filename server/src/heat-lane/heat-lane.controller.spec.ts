import { Test, TestingModule } from '@nestjs/testing';
import { HeatLaneController } from './heat-lane.controller';
import { HeatLaneService } from './heat-lane.service';

describe('HeatLaneController', () => {
  let controller: HeatLaneController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HeatLaneController],
      providers: [HeatLaneService],
    }).compile();

    controller = module.get<HeatLaneController>(HeatLaneController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
