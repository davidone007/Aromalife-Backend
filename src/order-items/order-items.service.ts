import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderItem } from '../entities/order-item.entity';
import { CreateOrderItemDto } from './dto/create-order-item.dto';
import { UpdateOrderItemDto } from './dto/update-order-item.dto';
import { Order } from '../entities/order.entity';
import { Candle } from '../entities/candle.entity';
import { Gift } from '../entities/gift.entity';

@Injectable()
export class OrderItemService {
  constructor(
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(Candle)
    private readonly candleRepository: Repository<Candle>,
    @InjectRepository(Gift)
    private readonly giftRepository: Repository<Gift>,
  ) {}

  async create(createOrderItemDto: CreateOrderItemDto): Promise<OrderItem> {
    const order = await this.orderRepository.findOne({ where: { id: createOrderItemDto.orderId } });
    if (!order) throw new NotFoundException('Order not found');

    const orderItem = this.orderItemRepository.create({
      order,
      quantity: createOrderItemDto.quantity,
      unitPrice: createOrderItemDto.unitPrice,
      totalPrice: createOrderItemDto.totalPrice,
    });

    if (createOrderItemDto.candleId) {
      const candle = await this.candleRepository.findOne({ where: { id: createOrderItemDto.candleId } });
      if (!candle) throw new NotFoundException('Candle not found');
      orderItem.candle = candle;
    }

    if (createOrderItemDto.giftId) {
      const gift = await this.giftRepository.findOne({ where: { id: createOrderItemDto.giftId } });
      if (!gift) throw new NotFoundException('Gift not found');
      orderItem.gift = gift;
    }

    return this.orderItemRepository.save(orderItem);
  }

  async findAll(): Promise<OrderItem[]> {
    return this.orderItemRepository.find({ relations: ['order', 'candle', 'gift'] });
  }

  async findOne(id: string): Promise<OrderItem> {
    const orderItem = await this.orderItemRepository.findOne({
      where: { id },
      relations: ['order', 'candle', 'gift'],
    });
    if (!orderItem) throw new NotFoundException('Order item not found');
    return orderItem;
  }

  async update(id: string, updateOrderItemDto: UpdateOrderItemDto): Promise<OrderItem> {
    const orderItem = await this.findOne(id);

    if (updateOrderItemDto.quantity !== undefined) orderItem.quantity = updateOrderItemDto.quantity;
    if (updateOrderItemDto.unitPrice !== undefined) orderItem.unitPrice = updateOrderItemDto.unitPrice;
    if (updateOrderItemDto.totalPrice !== undefined) orderItem.totalPrice = updateOrderItemDto.totalPrice;

    if (updateOrderItemDto.candleId) {
      const candle = await this.candleRepository.findOne({ where: { id: updateOrderItemDto.candleId } });
      if (!candle) throw new NotFoundException('Candle not found');
      orderItem.candle = candle;
    }

    if (updateOrderItemDto.giftId) {
      const gift = await this.giftRepository.findOne({ where: { id: updateOrderItemDto.giftId } });
      if (!gift) throw new NotFoundException('Gift not found');
      orderItem.gift = gift;
    }

    return this.orderItemRepository.save(orderItem);
  }

  async remove(id: string): Promise<void> {
    const result = await this.orderItemRepository.delete(id);
    if (result.affected === 0) throw new NotFoundException('Order item not found');
  }

  async assignCandle(orderItemId: string, candleId: string): Promise<OrderItem> {
    const orderItem = await this.orderItemRepository.findOne({
      where: { id: orderItemId },
      relations: ['candle'],
    });
    if (!orderItem) {
      throw new NotFoundException('Order item not found');
    }
  
    const candle = await this.candleRepository.findOne({ where: { id: candleId } });
    if (!candle) {
      throw new NotFoundException('Candle not found');
    }
  
    orderItem.candle = candle;
    return this.orderItemRepository.save(orderItem);
  }
  
  async assignOrder(orderItemId: string, orderId: string): Promise<OrderItem> {
    const orderItem = await this.orderItemRepository.findOne({
      where: { id: orderItemId },
      relations: ['order'],
    });
    if (!orderItem) {
      throw new NotFoundException('Order item not found');
    }
  
    const order = await this.orderRepository.findOne({ where: { id: orderId } });
    if (!order) {
      throw new NotFoundException('Order not found');
    }
  
    orderItem.order = order;
    return this.orderItemRepository.save(orderItem);
  }
  
  async assignGift(orderItemId: string, giftId: string): Promise<OrderItem> {
    const orderItem = await this.orderItemRepository.findOne({
      where: { id: orderItemId },
      relations: ['gift'],
    });
    if (!orderItem) {
      throw new NotFoundException('Order item not found');
    }
  
    const gift = await this.giftRepository.findOne({ where: { id: giftId } });
    if (!gift) {
      throw new NotFoundException('Gift not found');
    }
  
    orderItem.gift = gift;
    return this.orderItemRepository.save(orderItem);
  }
}