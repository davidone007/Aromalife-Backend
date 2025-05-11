import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Aroma } from '../entities/aroma.entity';
import { IntendedImpact } from '../entities/intendedImpact.entity';

@Injectable()
export class AromasService {
  constructor(
    @InjectRepository(Aroma)
    private readonly aromaRepository: Repository<Aroma>,
    @InjectRepository(IntendedImpact)
    private readonly intendedImpactRepository: Repository<IntendedImpact>,
  ) {}

  async create(createAromaDto: Partial<Aroma>): Promise<Aroma> {
    const aroma = this.aromaRepository.create(createAromaDto);
    return this.aromaRepository.save(aroma);
  }

  async findAll(): Promise<Aroma[]> {
    const aromas = await this.aromaRepository.find({});
    if (!aromas || aromas.length === 0) {
      throw new NotFoundException('No aromas found');
    }
    return aromas;
  }

  async findOne(id: string): Promise<Aroma> {
    const aroma = await this.aromaRepository.findOne({ where: { id } });
    if (!aroma) {
      throw new NotFoundException('Aroma not found');
    }
    return aroma;
  }

  async update(id: string, updateAromaDto: Partial<Aroma>): Promise<Aroma> {
    await this.aromaRepository.update(id, updateAromaDto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const result = await this.aromaRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Aroma not found');
    }
  }

  async assignIntendedImpact(aromaId: string, intendedImpactId: string): Promise<Aroma> {
    const aroma = await this.aromaRepository.findOne({
      where: { id: aromaId },
      relations: ['intendedImpacts'], // Load existing intended impacts
    });
    if (!aroma) {
      throw new NotFoundException(`Aroma with ID ${aromaId} is not found`);
    }
  
    const intendedImpact = await this.intendedImpactRepository.findOne({ where: { id: intendedImpactId } });
    if (!intendedImpact) {
      throw new NotFoundException(`IntendedImpact with ID ${intendedImpactId} not found`);
    }
  
    // Add the intended impact to the aroma's intendedImpacts array
    aroma.intendedImpacts.push(intendedImpact);
  
    return this.aromaRepository.save(aroma);
  }
}
