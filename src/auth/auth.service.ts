import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt'
import { JwtPayload } from './jwt/jwt.interface';
import { RegisterUserDto } from './dto/register.user.dto';
import { LoginUserDto } from './dto/login.user.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async validatePassword(password: string, hashedPassword: string) {
    return await bcrypt.compare(password, hashedPassword);
  }

  async registerUser(dto: RegisterUserDto) {
    const user = await this.userRepo.findOne({ 
      where: {
        email: dto.email
      }
    })

    if (user) {
      throw new HttpException(
        {
          statusCode: HttpStatus.CONFLICT,
          message: 'Email already exist !',
        },
        HttpStatus.CONFLICT,
      );
    }

    const salt = await bcrypt.genSalt()
    const hashedPassword = await bcrypt.hash(dto.password, salt);

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
      password: hashedPassword,
    });

    const payload: JwtPayload = {
      id: newUser.id,
      role: newUser.role,
    };

    const token = this.jwtService.sign(payload);

    await this.userRepo.save(newUser);
    return {
      newUser,
      message: 'user registered successfully',
      token,
    };
  }

  async loginUser(dto: LoginUserDto) {
    const user = await this.userRepo.findOne({
      where: {
        email: dto.email
      },
    });

    if (!user) {
      throw new HttpException(
        {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Email is incorrect',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    const isMatch = await this.validatePassword(dto.password, user.password);

    if (!isMatch) {
      throw new HttpException(
        {
          statusCode: HttpStatus.UNAUTHORIZED,
          message: 'Password is incorrect',
        },
        HttpStatus.UNAUTHORIZED,
      );
    }

    const payload: JwtPayload = {
      id: user.id,
      role: user.role,
    };

    const token = this.jwtService.sign(payload);

    return {
      token,
      message: 'Logged in successfully',
    };
  }
}
