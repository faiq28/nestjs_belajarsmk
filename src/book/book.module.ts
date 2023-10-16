import { Module } from '@nestjs/common';
import { BookService } from './book.service';
import { BookController } from './book.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Book } from './book.entity'; //import dari book.entity.ts

@Module({
  imports: [TypeOrmModule.forFeature([Book])], // import dengan TypeOrm For Feature
  providers: [BookService],
  controllers: [BookController],
})
export class BookModule {}
