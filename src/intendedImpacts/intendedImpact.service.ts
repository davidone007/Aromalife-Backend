import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IntendedImpact } from '../entities/intendedImpact.entity';
import { CreateIntendedImpactDto } from './dto/create-intended-impact.dto';
import { UpdateIntendedImpactDto } from './dto/update-intended-impact.dto';
import { MainOption } from '../entities/mainOption.entity';
import { Place } from '../entities/place.entity';

@Injectable()
export class IntendedImpactService {
  constructor(
    @InjectRepository(IntendedImpact)
    private readonly intendedImpactRepository: Repository<IntendedImpact>,
    @InjectRepository(MainOption)
    private readonly mainOptionRepo: Repository<MainOption>,
    @InjectRepository(Place)
    private readonly placeRepository: Repository<Place>,
  ) {}

  async create(createIntendedImpactDto: CreateIntendedImpactDto): Promise<IntendedImpact> {
    const intendedImpact = this.intendedImpactRepository.create(createIntendedImpactDto);
    return this.intendedImpactRepository.save(intendedImpact);
  }

  async findAll(): Promise<IntendedImpact[]> {
    const intendedImpacts = await this.intendedImpactRepository.find();
    if (!intendedImpacts || intendedImpacts.length === 0) {
      throw new NotFoundException('No intended impacts found');
    }
    return intendedImpacts;
  }

  async findOne(id: string): Promise<IntendedImpact> {
    const intendedImpact = await this.intendedImpactRepository.findOne({ where: { id } });
    if (!intendedImpact) {
      throw new NotFoundException(`IntendedImpact with ID ${id} not found`);
    }
    return intendedImpact;
  }

  async update(id: string, updateIntendedImpactDto: UpdateIntendedImpactDto): Promise<IntendedImpact> {
    const intendedImpact = await this.findOne(id);
    Object.assign(intendedImpact, updateIntendedImpactDto);
    return this.intendedImpactRepository.save(intendedImpact);
  }

  async remove(id: string): Promise<void> {
    const result = await this.intendedImpactRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`IntendedImpact with ID ${id} not found`);
    }
  }

  async assignMainOption(intendedImpactId: string, mainOptionId: string): Promise<IntendedImpact> {
    const intendedImpact = await this.intendedImpactRepository.findOne({ where: { id: intendedImpactId } });
    if (!intendedImpact) {
      throw new NotFoundException(`IntendedImpact with ID ${intendedImpactId} not found`);
    }

    const mainOption = await this.mainOptionRepo.findOne({ where: { id: mainOptionId } });
    if (!mainOption) {
      throw new NotFoundException(`MainOption with ID ${mainOptionId} not found`);
    }

    intendedImpact.mainOption = mainOption;
    return this.intendedImpactRepository.save(intendedImpact);
  }

  async assignPlace(intendedImpactId: string, placeId: string): Promise<IntendedImpact> {
    const intendedImpact = await this.intendedImpactRepository.findOne({ where: { id: intendedImpactId } });
    if (!intendedImpact) {
      throw new NotFoundException(`IntendedImpact with ID ${intendedImpactId} not found`);
    }
  
    const place = await this.placeRepository.findOne({ where: { id: placeId } });
    if (!place) {
      throw new NotFoundException(`Place with ID ${placeId} not found`);
    }
  
    intendedImpact.place = place;
    return this.intendedImpactRepository.save(intendedImpact);
  }
}