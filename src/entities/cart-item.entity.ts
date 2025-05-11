import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Cart } from './cart.entity';
import { Gift } from './gift.entity';
import { Candle } from './candle.entity';

@Entity()
export class CartItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Cart, (cart) => cart.cartItems)
  cart: Cart;

  @ManyToOne(() => Gift, (gift) => gift.cartItems, { nullable: true })
  gift: Gift;

  @ManyToOne(() => Candle, (candle) => candle.cartItems, { nullable: true })
  candle: Candle;

  @Column('int')
  quantity: number;

  @Column('decimal', { precision: 10, scale: 2 })
  unitPrice: number;

  @Column('decimal', { precision: 10, scale: 2 })
  totalPrice: number;

  calculatePrice() {
    if (this.gift) {
      this.unitPrice = Number(this.gift.price);
    } else if (this.candle) {
      this.unitPrice = Number(this.candle.price);
    } else {
      this.unitPrice = 0;
    }
    this.totalPrice = this.unitPrice * this.quantity;
  }
}
