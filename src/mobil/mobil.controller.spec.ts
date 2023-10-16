import { Test, TestingModule } from '@nestjs/testing';
import { MobilController } from './mobil.controller';

describe('MobilController', () => {
  let controller: MobilController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MobilController],
    }).compile();

    controller = module.get<MobilController>(MobilController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
