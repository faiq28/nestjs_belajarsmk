import { TypeOrmModuleOptions } from '@nestjs/typeorm';
export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: 'localhost',
  port: 3308, //port default 3306 lihat xampp
  username: 'root', // username default xampp root
  password: 'root', // password default xampp string kosong
  // database: 'belajar_nest_js',
  // database: 'belajar_projectbe_kls2',
  database: 'kafka',
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: true,
  logging: true,
};
