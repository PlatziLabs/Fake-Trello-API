import { IsString, IsNotEmpty, IsDecimal, IsNumber } from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';

export class CreateCardDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  position: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  boardId: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  listId: number;
}

export class UpdateCardDto extends PartialType(CreateCardDto) {}
