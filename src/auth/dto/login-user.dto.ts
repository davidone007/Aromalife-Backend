import { IsString, MaxLength, MinLength } from 'class-validator';

export class LoginUserDto {
  @IsString({ message: 'Email is required' })
  readonly email: string;

  @IsString({ message: 'Password is required' })
  @MinLength(6)
  @MaxLength(20)
  readonly password: string;
}
