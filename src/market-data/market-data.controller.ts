// src/market-data/market-data.controller.ts
import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { MarketDataService } from './market-data.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('market-data')
export class MarketDataController {
  constructor(private readonly marketDataService: MarketDataService) {}

  @Get('prices')
  async getPrices(@Query('tickers') tickers: string) {
    const tickerArray = tickers ? tickers.split(',') : [];
    return this.marketDataService.getPrices(tickerArray);
  }
}