import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Candle } from '../entities/candle.entity';
import { Container } from '../entities/container.entity';
import { Aroma } from '../entities/aroma.entity';
import { Gift } from '../entities/gift.entity';

@Injectable()
export class CandlesService {
  constructor(
    @InjectRepository(Candle)
    private readonly candleRepository: Repository<Candle>,
    @InjectRepository(Container)
    private readonly containerRepository: Repository<Container>,
    @InjectRepository(Aroma)
    private readonly aromaRepository: Repository<Aroma>,
    @InjectRepository(Gift)
    private readonly giftRepository: Repository<Gift>,
  ) {}

  async createCandle(data: Partial<Candle>): Promise<Candle> {
    try {
      const candle = this.candleRepository.create(data);
      const saved = await this.candleRepository.save(candle);
      if (!saved) {
        throw new InternalServerErrorException('Candle could not be created');
      }
      return saved;
    } catch (error) {
      console.error('Error in createCandle:', error);
      throw error;
    }
  }

  async findAll(): Promise<Candle[]> {
    try {
      const candles = await this.candleRepository.find({});
      if (!candles || candles.length === 0) {
        throw new NotFoundException('No candles found');
      }
      return candles;
    } catch (error) {
      console.error('Error in findAll candles:', error);
      throw error;
    }
  }

  async findOne(id: string): Promise<Candle> {
    try {
      const candle = await this.candleRepository.findOne({
        where: { id },
      });
      if (!candle) {
        throw new NotFoundException('Candle not found');
      }
      return candle;
    } catch (error) {
      console.error('Error in findOne candle:', error);
      throw error;
    }
  }

  async update(id: string, data: Partial<Candle>): Promise<Candle> {
    try {
      const exists = await this.candleRepository.findOne({ where: { id } });
      if (!exists) {
        throw new NotFoundException('Candle not found');
      }
      await this.candleRepository.update(id, data);
      return this.findOne(id);
    } catch (error) {
      console.error('Error in update candle:', error);
      throw error;
    }
  }

  async remove(id: string): Promise<void> {
    try {
      const exists = await this.candleRepository.findOne({ where: { id } });
      if (!exists) {
        throw new NotFoundException('Candle not found');
      }
      await this.candleRepository.delete(id);
    } catch (error) {
      console.error('Error in remove candle:', error);
      throw error;
    }
  }

  async getContainers(): Promise<Container[]> {
    try {
      return await this.containerRepository.find();
    } catch (error) {
      console.error('Error in getContainers:', error);
      throw error;
    }
  }

  async getGifts(): Promise<Gift[]> {
    try {
      return await this.giftRepository.find();
    } catch (error) {
      console.error('Error in getGifts:', error);
      throw error;
    }
  }

  async assignAroma(candleId: string, aromaId: string): Promise<Candle> {
    try {
      const candle = await this.candleRepository.findOne({ where: { id: candleId } });
      if (!candle) {
        throw new NotFoundException('Candle not found');
      }
    
      const aroma = await this.aromaRepository.findOne({ where: { id: aromaId } });
      if (!aroma) {
        throw new NotFoundException('Aroma not found');
      }
    
      candle.aroma = aroma;
      return await this.candleRepository.save(candle);
    } catch (error) {
      console.error('Error in assignAroma:', error);
      throw error;
    }
  }

  async assignContainer(candleId: string, containerId: string): Promise<Candle> {
    try {
      const candle = await this.candleRepository.findOne({ where: { id: candleId } });
      if (!candle) {
        throw new NotFoundException('Candle not found');
      }
    
      const container = await this.containerRepository.findOne({ where: { id: containerId } });
      if (!container) {
        throw new NotFoundException('Container not found');
      }
    
      candle.container = container;
      return await this.candleRepository.save(candle);
    } catch (error) {
      console.error('Error in assignContainer:', error);
      throw error;
    }
  }
}
