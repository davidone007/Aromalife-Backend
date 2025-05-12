import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GiftsController } from './gifts.controller';
import { GiftsService } from './gifts.service';
import { Gift } from '../entities/gift.entity';
import { Order } from '../entities/order.entity';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [TypeOrmModule.forFeature([Gift, Order]), PassportModule.register({ defaultStrategy: 'jwt' })],
  controllers: [GiftsController],
  providers: [GiftsService],
  exports: [GiftsService, TypeOrmModule],
})
export class GiftsModule {}
