import { IsEmail, IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class EditUserDto {
  @IsString()
  @MinLength(8)
  @MaxLength(20)
  name: string;

  @IsEmail()
  email: string;

  // @IsString()
  // position: string

  // @IsString()
  // @MinLength(8)
  // @MaxLength(20)
  // password: string;

  // @FileInterceptor('profilePicture') // 'profilePicture' should match the field name in your HTML form
  // profilePicture: Express.Multer.File; // This is correctly typed for file uploads
}
