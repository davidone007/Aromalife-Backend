import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Place } from '../entities/place.entity';
import { CreatePlaceDto } from './dto/create-place.dto';
import { UpdatePlaceDto } from './dto/update-place.dto';

@Injectable()
export class PlacesService {
  constructor(
    @InjectRepository(Place)
    private readonly placeRepository: Repository<Place>,
  ) {}

  async create(createPlaceDto: CreatePlaceDto): Promise<Place> {
    const place = this.placeRepository.create(createPlaceDto);
    const saved = await this.placeRepository.save(place);
    if (!saved) {
      throw new InternalServerErrorException('Place could not be created');
    }
    return saved;
  }

  async findAll(): Promise<Place[]> {
    const places = await this.placeRepository.find({});
    if (!places || places.length === 0) {
      throw new NotFoundException('No places found');
    }
    return places;
  }

  async findOne(id: string): Promise<Place> {
    const place = await this.placeRepository.findOne({ where: { id } });
    if (!place) {
      throw new NotFoundException('Place not found');
    }
    return place;
  }

  async update(id: string, updatePlaceDto: UpdatePlaceDto): Promise<Place> {
    const exists = await this.placeRepository.findOne({ where: { id } });
    if (!exists) {
      throw new NotFoundException('Place not found');
    }
    await this.placeRepository.update(id, updatePlaceDto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const exists = await this.placeRepository.findOne({ where: { id } });
    if (!exists) {
      throw new NotFoundException('Place not found');
    }
    await this.placeRepository.delete(id);
  }
}
