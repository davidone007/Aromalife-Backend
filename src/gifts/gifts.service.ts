import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Gift } from '../entities/gift.entity';
import { CreateGiftDto } from './dto/create-gift.dto';
import { UpdateGiftDto } from './dto/update-gift.dto';

@Injectable()
export class GiftsService {
  constructor(
    @InjectRepository(Gift)
    private readonly giftRepository: Repository<Gift>,
  ) {}

  async create(createGiftDto: CreateGiftDto): Promise<Gift> {
    const gift = this.giftRepository.create(createGiftDto);
    return this.giftRepository.save(gift);
  }

  async findAll(): Promise<Gift[]> {
    const gifts = await this.giftRepository.find();
    if (!gifts || gifts.length === 0) {
      throw new NotFoundException('No gifts found');
    }
    return gifts;
  }

  async findOne(id: string): Promise<Gift> {
    const gift = await this.giftRepository.findOne({ where: { id } });
    if (!gift) {
      throw new NotFoundException(`Gift with ID ${id} not found`);
    }
    return gift;
  }

  async update(id: string, updateGiftDto: UpdateGiftDto): Promise<Gift> {
    const gift = await this.findOne(id);
    Object.assign(gift, updateGiftDto);
    return this.giftRepository.save(gift);
  }

  async remove(id: string): Promise<void> {
    const result = await this.giftRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Gift with ID ${id} not found`);
    }
  }
}