import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Container } from '../entities/container.entity';

@Injectable()
export class ContainersService {
  constructor(
    @InjectRepository(Container)
    private readonly containerRepository: Repository<Container>,
  ) {}

  async create(createContainerDto: Partial<Container>): Promise<Container> {
    const container = this.containerRepository.create(createContainerDto);
    const saved = await this.containerRepository.save(container);
    if (!saved) {
      throw new InternalServerErrorException('Container could not be created');
    }
    return saved;
  }

  async findAll(): Promise<Container[]> {
    const containers = await this.containerRepository.find({});
    if (!containers || containers.length === 0) {
      throw new NotFoundException('No containers found');
    }
    return containers;
  }

  async findOne(id: string): Promise<Container> {
    const container = await this.containerRepository.findOne({ where: { id } });
    if (!container) {
      throw new NotFoundException('Container not found');
    }
    return container;
  }

  async update(
    id: string,
    updateContainerDto: Partial<Container>,
  ): Promise<Container> {
    const exists = await this.containerRepository.findOne({ where: { id } });
    if (!exists) {
      throw new NotFoundException('Container not found');
    }
    await this.containerRepository.update(id, updateContainerDto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const exists = await this.containerRepository.findOne({ where: { id } });
    if (!exists) {
      throw new NotFoundException('Container not found');
    }
    await this.containerRepository.delete(id);
  }
}
