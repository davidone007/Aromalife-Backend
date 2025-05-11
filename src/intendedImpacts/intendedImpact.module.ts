import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { IntendedImpact } from '../entities/intendedImpact.entity';
import { IntendedImpactService } from './intendedImpact.service';
import { IntendedImpactController } from './intendedImpact.controller';
import { MainOptionModule } from 'src/mainOptions/mainOption.module';
import { PlacesModule } from 'src/places/places.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([IntendedImpact]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    MainOptionModule,
    PlacesModule
  ],
  controllers: [IntendedImpactController],
  providers: [IntendedImpactService],
  exports: [IntendedImpactService, TypeOrmModule],
})
export class IntendedImpactModule {}
