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
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';


// save file into storage
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

@ApiTags('user')
@ApiBearerAuth()
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // create user
  @Post()
  @Roles(Role.Admin)
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        email: { type: 'email' },
        password: {type: 'password'},
        confirmPassword: {type: 'password'},
        profilePicture: {
          type: 'string',
          format: 'binary',
        },
      }
    }
  })
  @UseInterceptors(FileInterceptor('profilePicture', storage))
  createUser(
    @Body() dto: CreateUserDto, @UploadedFile() file: Express.Multer.File) {
    return this.userService.createUser(dto, file);
  }

  //filter by role
  @Get()
  getUsers(@Query('role') filter: FilterUserDto){
    if(filter){
      return this.userService.getUserByFilter(filter)
    }else{
      return this.userService.getUsers()
    }
  }

  // get by id
  @Get(':id')
  getUsersById(@Param('id') id: string) {
    return this.userService.getUser(id);
  }

  @Patch(':id')
  @Roles(Role.Admin)
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        email: { type: 'email' },
        profilePicture: {
          type: 'string',
          format: 'binary',
        },
      }
    }
  })
  @UseInterceptors(FileInterceptor('profilePicture', storage))
  updateUser(@Param('id') id: string, @Body() dto: EditUserDto, @UploadedFile() file: Express.Multer.File) {
    return this.userService.editUserById(id, dto, file);
  }

  @Delete(':id')
  @Roles(Role.Admin)
  removeUser(@Param('id') id: string) {
    return this.userService.removeUserById(id);
  }
}


