import { IsString, IsEmail, IsNotEmpty,IsOptional } from 'class-validator';

export class UpdateSettingDto {
@IsNotEmpty({ message: 'field name must be added' })
  @IsString()
  name: string;

  @IsOptional()
  @IsEmail()
  type?: string;

  @IsOptional()
  @IsString()
  value?: string;
}