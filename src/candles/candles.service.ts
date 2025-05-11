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
    const candle = this.candleRepository.create(data);
    const saved = await this.candleRepository.save(candle);
    if (!saved) {
      throw new InternalServerErrorException('Candle could not be created');
    }
    return saved;
  }

  async findAll(): Promise<Candle[]> {
    const candles = await this.candleRepository.find({});
    if (!candles || candles.length === 0) {
      throw new NotFoundException('No candles found');
    }
    return candles;
  }

  async findOne(id: string): Promise<Candle> {
    const candle = await this.candleRepository.findOne({
      where: { id },
    });
    if (!candle) {
      throw new NotFoundException('Candle not found');
    }
    return candle;
  }

  async update(id: string, data: Partial<Candle>): Promise<Candle> {
    const exists = await this.candleRepository.findOne({ where: { id } });
    if (!exists) {
      throw new NotFoundException('Candle not found');
    }
    await this.candleRepository.update(id, data);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const exists = await this.candleRepository.findOne({ where: { id } });
    if (!exists) {
      throw new NotFoundException('Candle not found');
    }
    await this.candleRepository.delete(id);
  }

  async getContainers(): Promise<Container[]> {
    return this.containerRepository.find();
  }

  async getGifts(): Promise<Gift[]> {
    return this.giftRepository.find();
  }

  async assignAroma(candleId: string, aromaId: string): Promise<Candle> {
    const candle = await this.candleRepository.findOne({ where: { id: candleId } });
    if (!candle) {
      throw new NotFoundException('Candle not found');
    }
  
    const aroma = await this.aromaRepository.findOne({ where: { id: aromaId } });
    if (!aroma) {
      throw new NotFoundException('Aroma not found');
    }
  
    candle.aroma = aroma;
    return this.candleRepository.save(candle);
  }

  async assignContainer(candleId: string, containerId: string): Promise<Candle> {
    const candle = await this.candleRepository.findOne({ where: { id: candleId } });
    if (!candle) {
      throw new NotFoundException('Candle not found');
    }
  
    const container = await this.containerRepository.findOne({ where: { id: containerId } });
    if (!container) {
      throw new NotFoundException('Container not found');
    }
  
    candle.container = container;
    return this.candleRepository.save(candle);
  }
}
