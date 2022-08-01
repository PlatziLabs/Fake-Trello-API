import { IsString, IsNotEmpty, IsEnum } from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Colors } from '@models/colors.model';

export class CreateBoardDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @IsEnum(Colors)
  @IsNotEmpty()
  backgroundColor: Colors;
}

export class UpdateBoardDto extends PartialType(CreateBoardDto) {}
