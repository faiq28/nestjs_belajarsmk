import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LatihanModule } from './latihan/latihan.module';
import { BookModule } from './book/book.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';
import { MobilModule } from './mobil/mobil.module';
import { AuthModule } from './app/auth/auth.module';
import { MailModule } from './app/mail/mail.module';
import { ProdukModule } from './produk/produk.module';
import { ConfigModule } from '@nestjs/config';
import { KategoriModule } from './app/kategori/kategori.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // konfigurasi is global untuk semua module
    }),
    TypeOrmModule.forRoot(typeOrmConfig),
    AuthModule,
    MailModule,
    KategoriModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
