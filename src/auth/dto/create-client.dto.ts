import {
  IsEmail,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateClientDto {
  @IsString({ message: 'Name is required' })
  @MinLength(3)
  @MaxLength(20)
  readonly name: string;

  @IsString({ message: 'Email is required' })
  @IsEmail()
  readonly email: string;

  @IsString({ message: 'Password is required' })
  @MinLength(6)
  @MaxLength(20)
  readonly password: string;


}
