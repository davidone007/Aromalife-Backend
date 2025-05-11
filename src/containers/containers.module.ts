import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Container } from '../entities/container.entity';
import { ContainersService } from './containers.service';
import { ContainersController } from './containers.controller';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [TypeOrmModule.forFeature([Container]), PassportModule.register({ defaultStrategy: 'jwt' })],
  controllers: [ContainersController],
  providers: [ContainersService],
  exports: [ContainersService],
})
export class ContainersModule {}
