import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsString, Matches, MaxLength, MinLength } from 'class-validator';
import { Role } from 'src/auth/role/roles.enum';

export class CreateUserDto {
  @ApiProperty({
    description: "The name of user",
    example: 'Jamesbon'
  })
  @IsString()
  @MinLength(6)
  @MaxLength(20)
  name: string;

  @ApiProperty({
    description: "The email of user",
    example: 'email@gmail.com'
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: "The password of user",
    example: 'Password@123'
  })
  @IsString()
  @MinLength(8)
  @MaxLength(20)
  password: string;

  @ApiProperty({
    description: "The confirm of user password",
    example: 'Password@123'
  })
  @IsString()
  @MinLength(8)
  @MaxLength(20)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]*$/, {
    message: 'Password must contain one uppercase letter, one lowercase letter, and one number',
  })
  confirmPassword: string;

  @IsEnum(Role)
  role: Role

  @ApiProperty({
    description: "The Image profile user",
    example: 'optional / .jpg/.jpeg/.png'
  })
  profilePicture?: Express.Multer.File; // This is correctly typed for file uploads
}
