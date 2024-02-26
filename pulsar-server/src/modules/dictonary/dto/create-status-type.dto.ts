import { IsNotEmpty, IsString } from 'class-validator';

export class CreateStatusTypeDto {
  @IsNotEmpty({ message: 'Имя должно быть задано' })
  @IsString()
  name: string;
}