import { Injectable } from '@nestjs/common';

@Injectable()
export class LatihanService {
  hello() {
    return 'hello world';
  }

  Welcome() {
    return 'Selamat Datang di Nest JS';
  }
}
