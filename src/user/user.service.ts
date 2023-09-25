import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create.user.dto';
import * as bcrypt from 'bcrypt';
import { EditUserDto } from './dto/update.user.dto';
import { FilterUserDto } from './dto/filter.user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>
  ){}

   // async uplaodImage(dto: FileDto){
  //   // Generate a unique filename for the profile picture using a timestamp
  //   const timestamp = new Date().getTime();
  //   const profilePictureFilename = `${dto.profilePicture.originalname}`;

  //   // Specify the destination directory for the profile pictures
  //   const uploadPath = './uploads/';

  //   // Save the profile picture to the specified location
  //   try {
  //     fs.writeFileSync(uploadPath + profilePictureFilename, dto.profilePicture.buffer);
  //   } catch (error) {
  //     throw new BadRequestException('Failed to save profile picture');
  //   }
  // }

  async createUser(dto: CreateUserDto, file: Express.Multer.File){
    const user = await this.userRepo.findOne({ 
      where: {
        email: dto.email
      }
    })

    if(user){
      throw new HttpException(
        {
          statusCode: HttpStatus.CONFLICT,
          message: 'Email already exist !'
        },
        HttpStatus.CONFLICT,
      );
    }

    const salt = await bcrypt.genSalt()
    const hashPassword = await bcrypt.hash(dto.password, salt)

    //add images
    const profilePicture = file? file.originalname : null;

    if(dto.confirmPassword !== dto.password){
      throw new HttpException(
        {
          statusCode: HttpStatus.CONFLICT,
          message: 'Confirm password is incorrect'
        },
        HttpStatus.CONFLICT,
      );
    }
    
    // Create a new user entity
    const newUser = this.userRepo.create({
      // name: dto.name,
      // email: dto.email,
      ...dto,
      password: hashPassword,
      profilePicture: profilePicture,
    });

    await this.userRepo.save(newUser)

    delete newUser.password
    return {
      newUser,
      message: 'created user successfully'
    }
  }

  // done
  async getUsers(){
    return await this.userRepo.find()
  }

  // done
  async getUser(id: string){
    return await this.findUserById(id)
  }

  // done
  async editUserById(id: string, dto: EditUserDto){
    const oldUser = await this.findUserById(id)
    await this.userRepo.update(id, {
      ...oldUser,
      ...dto,
    })

    const updatedUser = await this.userRepo.findOneBy({id})
    return{
      updatedUser,
      message: 'user updated successfully'
    }
  }

  // done
  async removeUserById(id: string){
    const user = await this.userRepo.delete(id)
    if(!user){
      throw new HttpException(
        {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'User not found'
        },
        HttpStatus.NOT_FOUND,
      );
    }

    return { message: 'user deleted successfully'}
  }

  // find user by Id
  async findUserById(id: string){
    const user = await this.userRepo.findOneBy({id})  
    if (!user) {
      throw new HttpException(
        {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'User not found'
        },
        HttpStatus.NOT_FOUND,
      );
    }
    return user
  }

  async getUserByFilter(filter: FilterUserDto){
    const builder = await this.userRepo.createQueryBuilder('user')
      .select('user')
      .where('user.position = :position', {position: filter})
      .getMany()

      if(!builder){
        throw new HttpException(
          {
            statusCode: HttpStatus.NOT_FOUND,
            message: 'position not found'
          },
          HttpStatus.NOT_FOUND,
        );
      }

    return builder
  }
}
