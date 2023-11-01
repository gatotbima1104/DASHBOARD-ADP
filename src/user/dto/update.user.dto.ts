import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class EditUserDto {
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
    example: 'james@gmail.com'
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: "The Image profile user",
    example: 'optional / .jpg/.jpeg/.png'
  })
  profilePicture?: Express.Multer.File; // This is correctly typed for file uploads
}
