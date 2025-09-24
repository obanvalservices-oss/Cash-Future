// src/market-data/market-data.module.ts
import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { MarketDataController } from './market-data.controller';
import { MarketDataService } from './market-data.service';

@Module({
  imports: [HttpModule], // Importamos HttpModule para poder hacer peticiones
  controllers: [MarketDataController],
  providers: [MarketDataService],
  exports: [MarketDataService], // Lo exportamos para que otros módulos puedan usarlo
})
export class MarketDataModule {}