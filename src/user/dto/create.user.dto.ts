import { IsEmail, IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @MinLength(6)
  @MaxLength(20)
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  @MaxLength(20)
  password: string;

  @IsString()
  @MinLength(8)
  @MaxLength(20)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]*$/, {
    message: 'Password must contain one uppercase letter, one lowercase letter, and one number',
  })
  confirmPassword: string;

  // @IsString()
  // profilePicture: string
  profilePicture?: Express.Multer.File; // This is correctly typed for file uploads
}
