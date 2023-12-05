import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class EditUserDto {
  @ApiProperty({
    description: "The name of user",
    example: 'Jamesbon'
  })
  @IsString()
  @MinLength(6)
  @MaxLength(20)
  @IsOptional()
  name: string;

  @ApiProperty({
    description: "The email of user",
    example: 'james@gmail.com'
  })
  @IsEmail()
  @IsOptional()
  email: string;

  @ApiProperty({
    description: "The Image profile user",
    example: 'optional / .jpg/.jpeg/.png'
  })
  @IsOptional()
  // profilePicture?: Express.Multer.File; // This is correctly typed for file uploads
  profilePicture?: string; // This is correctly typed for file uploads
}
