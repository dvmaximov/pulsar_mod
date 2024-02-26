import { IsNotEmpty, IsString } from 'class-validator';

export class CreateWorkTypeDto {
  @IsNotEmpty({ message: 'Имя должно быть задано' })
  @IsString()
  name: string;
}