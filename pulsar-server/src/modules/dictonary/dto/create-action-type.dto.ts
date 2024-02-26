import { IsNotEmpty, IsString } from 'class-validator';

export class CreateActionTypeDto {
  @IsNotEmpty({ message: 'Имя должно быть задано' })
  @IsString()
  name: string;

  @IsNotEmpty({ message: 'Значение value1 быть задано' })
  value1: string;

  @IsNotEmpty({ message: 'Значение value2 быть задано' })
  value2: string;

  @IsNotEmpty({ message: 'Значение value3 быть задано' })
  value3: string;
}