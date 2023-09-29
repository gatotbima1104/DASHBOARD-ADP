import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class LoginUserDto {
  @ApiProperty({
    description: "The email of user",
    example: 'james@gmail.com'
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: "The password of user",
    example: 'Password123'
  })
  @IsString()
  @MinLength(8)
  @MaxLength(20)
  password: string;
}
