import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create.user.dto';
import * as bcrypt from 'bcrypt';
import { EditUserDto } from './dto/update.user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>
  ){}

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
    
    const newUser = this.userRepo.create({
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
    return await this.userRepo.find({
      select: {
        id: true,
        name: true,
        email: true,
        role: true
      }
    })
  }

  // done
  async getUser(id: string){
    return await this.findUserById(id)
  }

  // done
  async editUserById(id: string, dto: EditUserDto, file: Express.Multer.File){
    const oldUser = await this.findUserById(id)

    const profilePicture = file? file.originalname : null;

    await this.userRepo.update(id, {
      ...oldUser,
      ...dto,
      profilePicture: profilePicture,
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
    if(user.affected == 0){
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

    delete user.password
    delete user.profilePicture
    
    return user
  }

  // filter user by role
  async getUserByRole(role: string){
    const builder = await this.userRepo.createQueryBuilder('user')
      .select('user')
      .where('user.role = :role', {role})
      .getMany()

      if(!builder){
        throw new HttpException(
          {
            statusCode: HttpStatus.NOT_FOUND,
            message: 'role not found'
          },
          HttpStatus.NOT_FOUND,
        );
      }

    return builder
  }

  // filter user by name
  async getUserByName(name: string){
    return await this.userRepo.createQueryBuilder('user')
      .select('user')
      .where('user.name ILIKE :name', {name: `%${name}%`})
      .getMany()
  }
}
