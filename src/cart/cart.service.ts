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
    try {
      const cart = this.cartRepository.create(createCartDto);
      return await this.cartRepository.save(cart);
    } catch (error) {
      console.error('Error in create cart:', error);
      throw error;
    }
  }

  async findOne(id: string): Promise<Cart> {
    try {
      const cart = await this.cartRepository.findOne({
        where: { id },
        relations: ['cartItems', 'cartItems.gift', 'cartItems.candle'],
      });
      if (!cart) throw new NotFoundException('Cart not found');
      return cart;
    } catch (error) {
      console.error('Error in findOne cart:', error);
      throw error;
    }
  }

  async update(id: string, updateCartDto: UpdateCartDto): Promise<Cart> {
    try {
      const cart = await this.cartRepository.preload({ id, ...updateCartDto });
      if (!cart) throw new NotFoundException('Cart not found');
      return await this.cartRepository.save(cart);
    } catch (error) {
      console.error('Error in update cart:', error);
      throw error;
    }
  }

  async remove(id: string): Promise<void> {
    try {
      const cart = await this.cartRepository.findOne({ where: { id } });
      if (!cart) throw new NotFoundException('Cart not found');
      await this.cartRepository.delete(id);
    } catch (error) {
      console.error('Error in remove cart:', error);
      throw error;
    }
  }

  async addItem(
    cartId: string,
    addCartItemDto: AddCartItemDto,
  ): Promise<CartItem> {
    try {
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
        quantity: addCartItemDto.quantity,
      });
      
      cartItem.cart = cart;
      if (gift) cartItem.gift = gift;
      if (candle) cartItem.candle = candle;
      
      cartItem.calculatePrice();
      return await this.cartItemRepository.save(cartItem);
    } catch (error) {
      console.error('Error in addItem to cart:', error);
      throw error;
    }
  }

  async updateItem(
    cartId: string,
    itemId: string,
    updateCartItemDto: UpdateCartItemDto,
  ): Promise<CartItem> {
    try {
      const cartItem = await this.cartItemRepository.findOne({
        where: { id: itemId, cart: { id: cartId } },
        relations: ['gift', 'candle'],
      });
      if (!cartItem) throw new NotFoundException('Cart item not found');
      Object.assign(cartItem, updateCartItemDto);
      cartItem.calculatePrice();
      return await this.cartItemRepository.save(cartItem);
    } catch (error) {
      console.error('Error in updateItem in cart:', error);
      throw error;
    }
  }

  async removeItem(cartId: string, itemId: string): Promise<void> {
    try {
      const cartItem = await this.cartItemRepository.findOne({
        where: { id: itemId, cart: { id: cartId } },
      });
      if (!cartItem) throw new NotFoundException('Cart item not found');
      await this.cartItemRepository.delete(itemId);
    } catch (error) {
      console.error('Error in removeItem from cart:', error);
      throw error;
    }
  }

  async assignUserToCart(cartId: string, userId: string): Promise<Cart> {
    try {
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
      return await this.cartRepository.save(cart);
    } catch (error) {
      console.error('Error in assignUserToCart:', error);
      throw error;
    }
  }
}
