import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CandlesService } from './candles.service';
import { CandlesController } from './candles.controller';
import { Candle } from '../entities/candle.entity';
import { Container } from '../entities/container.entity';
import { Aroma } from '../entities/aroma.entity';
import { Gift } from '../entities/gift.entity';
import { Order } from '../entities/order.entity';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [TypeOrmModule.forFeature([Candle, Container, Aroma, Gift, Order]), PassportModule.register({ defaultStrategy: 'jwt' })],
  controllers: [CandlesController],
  providers: [CandlesService],
  exports: [CandlesService],
})
export class CandlesModule {}
