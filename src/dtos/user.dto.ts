import {
  IsString,
  IsNotEmpty,
  IsAlphanumeric,
  IsEmail,
  IsOptional,
  IsUrl,
  IsNumber,
  MinLength,
} from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsAlphanumeric()
  @IsNotEmpty()
  @MinLength(8, {
    message: 'password is too short',
  })
  password: string;
}

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiProperty()
  @IsUrl()
  @IsNotEmpty()
  avatar: string;
}

export class ValidateUserDto {
  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;
}

export class FilterUsersDto {
  @ApiProperty()
  @IsNumber()
  @IsOptional()
  limit?: number;
}
