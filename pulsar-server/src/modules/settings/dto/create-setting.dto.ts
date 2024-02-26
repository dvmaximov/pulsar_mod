import { IsNotEmpty, IsString } from 'class-validator';

export class CreateSettingDto {
  @IsNotEmpty({ message: 'Field name must be added' })
  @IsString()
  name: string;

  @IsNotEmpty({ message: 'Field type must be added' })
  @IsString()
  type: string;

  @IsNotEmpty({ message: 'Provide an value' })
  @IsString()
  value: string;
}