import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
// import { LatihanModule } from './latihan/latihan.module';
import { BookModule } from './book/book.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';
// import { MobilModule } from './mobil/mobil.module';
import { AuthModule } from './app/auth/auth.module';
import { MailModule } from './app/mail/mail.module';
// import { ProdukModule } from './produk/produk.module';
import { ConfigModule } from '@nestjs/config';
import { KategoriModule } from './app/kategori/kategori.module';
import { ProdukModule } from './app/produk/produk.module';
import { UploadController } from './app/upload/upload.controller';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { KonsumenModule } from './app/konsumen/konsumen.module';
import { ProfileModule } from './app/profile/profile.module';
import { Service } from './app/.service';
import { UniqueValidator } from './utils/validator/unique.validator';
import { OrderModule } from './app/order/order.module';
import { OrderDetailModule } from './app/order_detail/order_detail.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),

    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(typeOrmConfig),
    AuthModule,
    MailModule,
    KategoriModule,
    ProdukModule,
    BookModule,
    KonsumenModule,
    ProfileModule,
    OrderModule,
    OrderDetailModule,
  ],
  controllers: [AppController, UploadController],
  providers: [AppService, Service, UniqueValidator],
})
export class AppModule {}
