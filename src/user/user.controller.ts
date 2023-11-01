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
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create.user.dto';
import { EditUserDto } from './dto/update.user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import path = require('path');
import { Roles } from 'src/auth/role/roles.decorator';
import { Role } from 'src/auth/role/roles.enum';
import { v4 as uuidv4 } from 'uuid';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import fs from 'fs';
import { imageFileFilter } from './interceptor/image.filter';

// MAKE SAVING FUNCTION INTO STORAGE ./UPLOADS
export const storage = {
  storage: diskStorage({
    destination: './uploads',
    filename: (req, file, cb) => {
      const filename: string =
        path.parse(file.originalname).name.replace(/\s/g, '') + uuidv4();
      const extention: string = path.parse(file.originalname).ext;

      cb(null, `${filename}${extention}`);
    },
  }),
  fileFilter: imageFileFilter,
};

@ApiTags('user')
@ApiBearerAuth()
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // CREATE USER
  @Post()
  @Roles(Role.Admin)
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        email: { type: 'email' },
        password: { type: 'password' },
        confirmPassword: { type: 'password' },
        profilePicture: {
          type: 'string',
          format: 'binary',
        },
        role: {
          enum: ['admin', 'worker'],
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('profilePicture', storage))
  // @UseInterceptors(FileInterceptor)
  async createUser(
    @Body() dto: CreateUserDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    try {
      const createdUser = await this.userService.createUser(dto, file);
      return createdUser;
    } catch (error) {
      console.log(error);

      if (file) {
        fs.unlinkSync(file.path);
      }
      throw error;
    }
  }

  // GET ALL USERS
  @Get()
  getUsers() {
    return this.userService.getUsers();
  }

  // GET BY FILTER NAME, ROLE
  @Get('filter')
  @ApiQuery({ name: 'name', required: false })
  @ApiQuery({ name: 'role', required: false, enum: ['admin', 'worker'] })
  getUsersFilter(@Query('name') name: string, @Query('role') role: string) {
    if (name) {
      return this.userService.getUserByName(name);
    } else if (role) {
      return this.userService.getUserByRole(role);
    }
  }

  // GET BY ID USER
  @Get(':id')
  getUsersById(@Param('id') id: string) {
    return this.userService.getUser(id);
  }

  // EDIT BY ID USER
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
      },
    },
  })
  @UseInterceptors(FileInterceptor('profilePicture', storage))
  // @UseInterceptors(FileInterceptor)
  updateUser(
    @Param('id') id: string,
    @Body() dto: EditUserDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.userService.editUserById(id, dto, file);
  }

  // DELETE BY ID USER
  @Delete(':id')
  @Roles(Role.Admin)
  removeUser(@Param('id') id: string) {
    return this.userService.removeUserById(id);
  }

  // // GET IMAGES
  // @Get(':profilePicture')
  // getImageById(@Param('profilePicture') profilePicture: string, @Res() res){
  //   // const filePath = `./uploads/${profilePicture}`
  //     return res.sendFile(profilePicture, {
  //       root: './uploads'
  //     })
  // }
}
