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
    try {
      const container = this.containerRepository.create(createContainerDto);
      const saved = await this.containerRepository.save(container);
      if (!saved) {
        throw new InternalServerErrorException('Container could not be created');
      }
      return saved;
    } catch (error) {
      console.error('Error in create container:', error);
      throw error;
    }
  }

  async findAll(): Promise<Container[]> {
    try {
      const containers = await this.containerRepository.find({});
      if (!containers || containers.length === 0) {
        throw new NotFoundException('No containers found');
      }
      return containers;
    } catch (error) {
      console.error('Error in findAll containers:', error);
      throw error;
    }
  }

  async findOne(id: string): Promise<Container> {
    try {
      const container = await this.containerRepository.findOne({ where: { id } });
      if (!container) {
        throw new NotFoundException('Container not found');
      }
      return container;
    } catch (error) {
      console.error('Error in findOne container:', error);
      throw error;
    }
  }

  async update(id: string, data: Partial<Container>): Promise<Container> {
    try {
      const exists = await this.containerRepository.findOne({ where: { id } });
      if (!exists) {
        throw new NotFoundException('Container not found');
      }
      await this.containerRepository.update(id, data);
      return this.findOne(id);
    } catch (error) {
      console.error('Error in update container:', error);
      throw error;
    }
  }

  async remove(id: string): Promise<void> {
    try {
      const result = await this.containerRepository.delete(id);
      if (result.affected === 0) {
        throw new NotFoundException('Container not found');
      }
    } catch (error) {
      console.error('Error in remove container:', error);
      throw error;
    }
  }
}
