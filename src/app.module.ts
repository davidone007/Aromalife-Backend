import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { OrdersModule } from './orders/orders.module';
import { CandlesModule } from './candles/candles.module';
import { GiftsModule } from './gifts/gifts.module';
import { ReviewsModule } from './reviews/reviews.module';
import { IntendedImpactModule } from './intendedImpacts/intendedImpact.module';
import { MainOptionModule } from './mainOptions/mainOption.module';
import { AromasModule } from './aromas/aromas.module';
import { ContainersModule } from './containers/containers.module';
import { PlacesModule } from './places/places.module';
import { AiModule } from './ai/ai.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CartItemModule } from './cart-item/cart-item.module';
import { OrderItemModule } from './order-items/order-items.module';
@Module({
  controllers: [AppController],
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const isProd = process.env.NODE_ENV === 'production';
        
        if (isProd) {
          return {
            type: 'postgres',
            url: configService.get('DATABASE_URL'),
            entities: ['dist/**/*.entity{.ts,.js}'],
            synchronize: true, 
            ssl: {
              rejectUnauthorized: false // Necesario para algunas plataformas cloud
            },
            logging: false,
          }
        }

        return {
          type: 'postgres',
          host: configService.get('DB_HOST'),
          port: +configService.get('DB_PORT'),
          username: configService.get('DB_USERNAME'),
          password: configService.get('DB_PASSWORD'),
          database: configService.get('DB_DATABASE'),
          entities: [__dirname + '/**/*.entity{.ts,.js}'],
          synchronize: true,
          logging: true
        }
      },
      inject: [ConfigService],
    }),
    AuthModule,
    OrdersModule,
    CandlesModule,
    GiftsModule,
    ReviewsModule,
    IntendedImpactModule,
    MainOptionModule,
    AromasModule,
    ContainersModule,
    PlacesModule,
    AiModule,
    CartItemModule,
    OrderItemModule,
  ],
  providers: [AppService],
})
export class AppModule {}
