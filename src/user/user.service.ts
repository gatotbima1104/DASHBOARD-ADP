import { BadRequestException, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create.user.dto';
import * as bcrypt from 'bcrypt';
import { EditUserDto } from './dto/update.user.dto';
import * as fs from 'fs'

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
    const profilePicture = file? process.env.IMAGE_URL+file.filename : null;

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
        role: true,
        profilePicture: true
      }
    })
  }

  // done
  async getUser(id: string){
    return await this.findUserById(id)
  }

  // done
  async editUserById(id: string, dto: EditUserDto, file: Express.Multer.File){
    try{
      if(Object.keys(dto).length === 0 && !file){
        throw new BadRequestException('Must change at least 1 property')
      }
      
      let userDetails = {...dto}
      if(file){
        const user = await this.getUser(id)
        await fs.unlink(`.${user.profilePicture.replace(process.env.IMAGE_URL, '/uploads/')}`, (err)=> {
          if(err){
            console.log(err)
            return err
          }
        })
        userDetails.profilePicture = `${process.env.IMAGE_URL}${file.filename}`
      }

      const result = await this.userRepo.update(id, {...userDetails})

      // const updatedUser = await this.userRepo.findOneBy({id})

      if(result.affected === 0){
        throw new NotFoundException(`User with id ${id} is not found`)
      }
      return{
        // updatedUser,
        message: 'user updated successfully'
      }
    }
    catch(err){
      console.log(err)
      return {
        error: err
      }
    }
  }
  // done
  async removeUserById(id: string){

    const image = await this.userRepo.findOneBy({id})
    try {
      await fs.unlink(`.${image.profilePicture.replace(process.env.IMAGE_URL, '/uploads/')}`, (err)=> {
        if(err){
          console.log(err)
          return err
        }
      })
    } catch (error) {
      // console.log(error)
    }

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
    // delete user.profilePicture
    
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
