import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Order } from '../../entities/order.entity';
import { Review } from '../../entities/review.entity';
import { Cart } from '../../entities/cart.entity';
import { Candle } from '../../entities/candle.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', { unique: true })
  email: string;

  @Column('text', { select: false })
  password: string;

  @Column('text')
  name: string;

  @Column('text', { array: true, default: [] })
  roles: string[];

  @Column('bool', { default: true })
  isActive: boolean;

  @OneToMany(() => Order, (order) => order.userId)
  orders: Order[];

  @OneToMany(() => Cart, (cart) => cart.userId)
  carts: Cart[];

  @OneToMany(() => Candle, (candle) => candle.user)
  candles: Candle[];
}