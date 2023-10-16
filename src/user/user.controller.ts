import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { UserService } from './user.service';
import {
  CreateUserDto,
  createUserArrayDto,
  UpdateUserDto,
  FindUserDto,
} from './user.dto';
import { Pagination } from 'src/utils/decorator/pagination.decorator';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('/list')
  findAllUser(@Pagination() findUserDto: FindUserDto) {
    return this.userService.getAllUser(findUserDto);
  }

  @Get('detail/:id')
  getDetail(@Param('id') id: string) {
    return this.userService.getDetail(Number(id));
  }

  @Post('/create')
  createUser(@Body() payload: CreateUserDto) {
    return this.userService.createUser(payload);
  }

  @Put('update/:id')
  updateUser(@Param('id') id: string, @Body() payload: any) {
    return this.userService.updateUser(+id, payload);
  }

  @Delete('delete/:id')
  deleteUser(@Param('id') id: string) {
    return this.userService.deleteUser(+id);
  }

  @Post('create/bulk')
  createBulk(@Body() payload: createUserArrayDto) {
    console.log('pay', payload);
    return this.userService.bulkCreate(payload);
  }
}
