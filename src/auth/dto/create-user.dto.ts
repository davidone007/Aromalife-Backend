import {
  ArrayNotEmpty,
  IsArray,
  IsEmail,
  IsEnum,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

import { ValidRoles } from '../interfaces/valid-roles';

export class CreateUserDto {
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

  @IsArray({ message: 'Roles must be an array' })
  @IsEnum(ValidRoles, {
    each: true,
    message:
      'Each role must be one of the valid roles (admin, client, manager)',
  })
  @ArrayNotEmpty({ message: 'Roles cannot be empty' })
  @IsString({ each: true, message: 'Each role must be a string' })
  readonly roles: string[];
}
