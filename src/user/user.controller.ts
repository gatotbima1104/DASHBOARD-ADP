import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
  Query
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create.user.dto';
import { EditUserDto } from './dto/update.user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import path = require('path')
import { FilterUserDto } from './dto/filter.user.dto';
import { Roles } from 'src/auth/role/roles.decorator';
import { Role } from 'src/auth/role/roles.enum';
import { v4 as uuidv4 } from 'uuid';


export const storage = {
    storage: diskStorage({
    destination: './uploads',
    filename: (req, file, cb) => {
      const filename: string = path.parse(file.originalname).name.replace(/\s/g, '') + uuidv4()
      const extention: string = path.parse(file.originalname).ext

      cb(null, `${filename}${extention}`)
    }  
  })
}

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('photo', {
      dest: './uploads'
    }),
  )
  createUser(
    @Body() dto: CreateUserDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.userService.createUser(dto, file);
  }

  // @Post('upload')
  // @UseInterceptors(FileInterceptor('photo', {dest: './uploads'}))
  // uploadFile(@UploadedFile() file){
  //   console.log(file)
  // }

  // @Get()
  // getUsers(@Query('pos') filter: FilterUserDto) {
  //   console.log(filter)

  //   if(Object.keys(filter).length > 0){
  //     return this.userService.getUserByFilter(filter)
  //   }else{
  //     return this.userService.getUsers();
  //   } 
  // }
  @Get()
  @Roles(Role.Admin)
  getUsers(){
    return this.userService.getUsers();
  }

  @Get(':id')
  getUsersById(@Param('id') id: string) {
    return this.userService.getUser(id);
  }

  @Patch(':id')
  updateUser(@Param('id') id: string, @Body() dto: EditUserDto) {
    return this.userService.editUserById(id, dto);
  }

  @Delete(':id')
  removeUser(@Param('id') id: string) {
    return this.userService.removeUserById(id);
  }
}


