import { Test, TestingModule } from '@nestjs/testing';
import { RacerController } from './racer.controller';
import { RacerService } from './racer.service';

describe('RacerController', () => {
  let controller: RacerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RacerController],
      providers: [RacerService],
    }).compile();

    controller = module.get<RacerController>(RacerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
