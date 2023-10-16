import { Module } from '@nestjs/common';
import { MobilController } from './mobil.controller';
import { MobilService } from './mobil.service';
import { PembelianMobil } from './mobil.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([PembelianMobil])],
  controllers: [MobilController],
  providers: [MobilService],
})
export class MobilModule {}
