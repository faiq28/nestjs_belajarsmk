import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/app/auth/auth.entity';
import BaseResponse from 'src/utils/response/base.response';
import { Repository } from 'typeorm';
@Injectable()
export class QueryBuilderService extends BaseResponse {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
    super();
  }

  async latihan() {
    // return 'ok';
    // const result = await this.userRepository
    //   .createQueryBuilder('user')
    //   .getMany();
    // return this._success('ok', result);
    const queryBuilder = await this.userRepository.createQueryBuilder('user');
    queryBuilder.select(['user.id', 'user.email']);

    const result = await queryBuilder.getMany();
    //.getMany menjadikan data menjadi Array dan bisa mengambil banyak data
    //.getOne menjadikan data menjadi Object dan hanya bisa mengambil 1 data yaitu data teratas
    //.getCount datanya nya nanti di hitung
    //.getSql melihat proses selectnya

    return this._success('ok', result);
  }
}
