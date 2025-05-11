import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart } from '../entities/cart.entity';
import { CartItem } from '../entities/cart-item.entity';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [TypeOrmModule.forFeature([Cart, CartItem]), PassportModule.register({ defaultStrategy: 'jwt' })],
  providers: [CartService],
  controllers: [CartController],
  exports: [CartService],
})
export class CartModule {}
