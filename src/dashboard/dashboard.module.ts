// src/dashboard/dashboard.module.ts
import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { MarketDataModule } from '../market-data/market-data.module'; // <-- AÑADIDO

@Module({
  imports: [
    PrismaModule,
    MarketDataModule, // <-- AÑADIDO: Ahora DashboardModule sabe que MarketDataModule existe
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}