import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
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

  async create(data: Partial<Gift>): Promise<Gift> {
    try {
      const gift = this.giftRepository.create(data);
      const saved = await this.giftRepository.save(gift);
      if (!saved) {
        throw new InternalServerErrorException('Gift could not be created');
      }
      return saved;
    } catch (error) {
      console.error('Error in create gift:', error);
      throw error;
    }
  }

  async findAll(): Promise<Gift[]> {
    try {
      const gifts = await this.giftRepository.find({});
      if (!gifts || gifts.length === 0) {
        throw new NotFoundException('No gifts found');
      }
      return gifts;
    } catch (error) {
      console.error('Error in findAll gifts:', error);
      throw error;
    }
  }

  async findOne(id: string): Promise<Gift> {
    try {
      const gift = await this.giftRepository.findOne({ where: { id } });
      if (!gift) {
        throw new NotFoundException('Gift not found');
      }
      return gift;
    } catch (error) {
      console.error('Error in findOne gift:', error);
      throw error;
    }
  }

  async update(id: string, data: Partial<Gift>): Promise<Gift> {
    try {
      const gift = await this.findOne(id);
      if (!gift) {
        throw new NotFoundException('Gift not found');
      }
      Object.assign(gift, data);
      return await this.giftRepository.save(gift);
    } catch (error) {
      console.error('Error in update gift:', error);
      throw error;
    }
  }

  async remove(id: string): Promise<void> {
    try {
      const result = await this.giftRepository.delete(id);
      if (result.affected === 0) {
        throw new NotFoundException('Gift not found');
      }
    } catch (error) {
      console.error('Error in remove gift:', error);
      throw error;
    }
  }
}