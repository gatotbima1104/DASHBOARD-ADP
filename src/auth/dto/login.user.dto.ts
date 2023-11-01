import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class LoginUserDto {
  @ApiProperty({
    description: "The email of user",
    example: 'super@admin.com'
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: "The password of user",
    example: 'Superadmin123'
  })
  @IsString()
  @MinLength(8)
  @MaxLength(20)
  password: string;
}
