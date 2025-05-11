import { IsUUID, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCartDto {
  @ApiProperty({ description: 'ID of the user who owns this cart' })
  @IsUUID()
  userId: string;

  @ApiProperty({ description: 'Whether the cart has been checked out', required: false, default: false })
  @IsOptional()
  @IsBoolean()
  checkedOut?: boolean;
}
