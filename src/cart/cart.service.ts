import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { Cart } from '../entities/cart.entity';
import { CartItem } from '../entities/cart-item.entity';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { AddCartItemDto } from './dto/add-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { Gift } from '../entities/gift.entity';
import { Candle } from '../entities/candle.entity';
import { User } from '../auth/entity/user.entity';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,
    @InjectRepository(CartItem)
    private readonly cartItemRepository: Repository<CartItem>,
    @InjectRepository(Gift)
    private readonly giftRepository: Repository<Gift>,
    @InjectRepository(Candle)
    private readonly candleRepository: Repository<Candle>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createCartDto: CreateCartDto): Promise<Cart> {
    const cart = this.cartRepository.create(createCartDto);
    return this.cartRepository.save(cart);
  }

  async findOne(id: string): Promise<Cart> {
    const cart = await this.cartRepository.findOne({
      where: { id },
      relations: ['cartItems', 'cartItems.gift', 'cartItems.candle'],
    });
    if (!cart) throw new NotFoundException('Cart not found');
    return cart;
  }

  async update(id: string, updateCartDto: UpdateCartDto): Promise<Cart> {
    const cart = await this.cartRepository.preload({ id, ...updateCartDto });
    if (!cart) throw new NotFoundException('Cart not found');
    return this.cartRepository.save(cart);
  }

  async remove(id: string): Promise<void> {
    const cart = await this.cartRepository.findOne({ where: { id } });
    if (!cart) throw new NotFoundException('Cart not found');
    await this.cartRepository.delete(id);
  }

  async addItem(
    cartId: string,
    addCartItemDto: AddCartItemDto,
  ): Promise<CartItem> {
    const cart = await this.cartRepository.findOne({ where: { id: cartId } });
    if (!cart) throw new NotFoundException('Cart not found');
    let gift: Gift | null = null;
    let candle: Candle | null = null;

    if (addCartItemDto.giftId) {
      gift = await this.giftRepository.findOne({
        where: { id: addCartItemDto.giftId },
      });
      if (!gift) throw new NotFoundException('Gift not found');
    }

    if (addCartItemDto.candleId) {
      candle = await this.candleRepository.findOne({
        where: { id: addCartItemDto.candleId },
      });
      if (!candle) throw new NotFoundException('Candle not found');
    }

    const cartItem = this.cartItemRepository.create({
      cart,
      gift,
      candle,
      quantity: addCartItemDto.quantity,
      unitPrice: 0, // temporary value
      totalPrice: 0,
    } as DeepPartial<CartItem>);

    cartItem.calculatePrice();

    return this.cartItemRepository.save(cartItem);
  }

  async updateItem(
    cartId: string,
    itemId: string,
    updateCartItemDto: UpdateCartItemDto,
  ): Promise<CartItem> {
    const cartItem = await this.cartItemRepository.findOne({
      where: { id: itemId, cart: { id: cartId } },
      relations: ['gift', 'candle'],
    });
    if (!cartItem) throw new NotFoundException('Cart item not found');
    Object.assign(cartItem, updateCartItemDto);
    cartItem.calculatePrice();
    return this.cartItemRepository.save(cartItem);
  }

  async removeItem(cartId: string, itemId: string): Promise<void> {
    const cartItem = await this.cartItemRepository.findOne({
      where: { id: itemId, cart: { id: cartId } },
    });
    if (!cartItem) throw new NotFoundException('Cart item not found');
    await this.cartItemRepository.delete(itemId);
  }

  async assignUserToCart(cartId: string, userId: string): Promise<Cart> {
    const cart = await this.cartRepository.findOne({
      where: { id: cartId },
      relations: ['user'],
    });
    if (!cart) {
      throw new NotFoundException('Cart not found');
    }
  
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
  
    cart.user = user;
    return this.cartRepository.save(cart);
  }
}
