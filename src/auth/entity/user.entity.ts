import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Order } from '../../entities/order.entity';
import { Review } from '../../entities/review.entity';
import { Cart } from '../../entities/cart.entity';

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

  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];

  @OneToMany(() => Cart, (cart) => cart.user)
  carts: Cart[];
}
