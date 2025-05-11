import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Container } from './container.entity';
import { Aroma } from './aroma.entity';
import { Order } from './order.entity';
import { CartItem } from './cart-item.entity';
import { OrderItem } from './order-item.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Candle {
  @ApiProperty({ description: 'Unique identifier of the candle' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Name of the candle' })
  @Column()
  name: string;

  @ApiProperty({ description: 'Description of the candle', required: false })
  @Column({ nullable: true })
  description: string;

  @ApiProperty({ description: 'Price of the candle' })
  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @ApiProperty({ description: 'URL of the candle image', required: false })
  @Column({ nullable: true })
  imageUrl: string;

  @ApiProperty({ description: 'URL of the audio message', required: false })
  @Column({ nullable: true })
  audioUrl: string;

  @ApiProperty({ description: 'Custom message for the candle', required: false })
  @Column({ nullable: true })
  message: string;

  @ApiProperty({ description: 'URL of the QR code', required: false })
  @Column({ nullable: true })
  qrUrl: string;

  @ApiProperty({ description: 'ID of the associated order', required: false })
  @Column({ nullable: true })
  orderId: string;

  @ApiProperty({ description: 'Date when the candle was created' })
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @ApiProperty({ description: 'Date when the candle was last updated' })
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @ApiProperty({ description: 'Container information' })
  @ManyToOne(() => Container, (container) => container.candles)
  container: Container;

  @ApiProperty({ description: 'Aroma information' })
  @ManyToOne(() => Aroma, (aroma) => aroma.candles)
  aroma: Aroma;

  @ApiProperty({ description: 'Associated order items' })
  @OneToMany(() => OrderItem, (orderItems) => orderItems.candle)
  orderItems: OrderItem[];

  @ApiProperty({ description: 'Associated cart items' })
  @OneToMany(() => CartItem, (cartItems) => cartItems.candle)
  cartItems: CartItem[];
}
