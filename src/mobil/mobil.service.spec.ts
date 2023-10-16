import { Test, TestingModule } from '@nestjs/testing';
import { MobilService } from './mobil.service';

describe('MobilService', () => {
  let service: MobilService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MobilService],
    }).compile();

    service = module.get<MobilService>(MobilService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
