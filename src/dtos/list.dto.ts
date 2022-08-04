import { IsString, IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';

export class CreateListDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  position: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  boardId: number;
}

export class UpdateCardDto extends PartialType(CreateListDto) {}
