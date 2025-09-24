// src/market-data/market-data.service.ts
import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class MarketDataService {
  constructor(private readonly httpService: HttpService) {}

  // Mapeo de tickers a IDs de CoinGecko (ejemplos)
  private tickerToApiId = {
    BTC: 'bitcoin',
    ETH: 'ethereum',
    // Puedes añadir más aquí
  };

  async getPrices(tickers: string[]): Promise<Record<string, number>> {
    const apiIds = tickers.map(t => this.tickerToApiId[t.toUpperCase()]).filter(Boolean);
    if (apiIds.length === 0) {
      return {};
    }

    const idsParam = apiIds.join(',');
    const url = `https://api.coingecko.com/api/v3/simple/price?ids=${idsParam}&vs_currencies=usd`;

    try {
      const response = await firstValueFrom(this.httpService.get(url));
      const prices: Record<string, number> = {};

      // Transformar la respuesta de CoinGecko a nuestro formato Ticker:Precio
      for (const ticker of tickers) {
        const apiId = this.tickerToApiId[ticker.toUpperCase()];
        if (apiId && response.data[apiId]) {
          prices[ticker.toUpperCase()] = response.data[apiId].usd;
        }
      }
      return prices;
    } catch (error) {
      console.error('Error fetching prices from CoinGecko:', error.message);
      return {}; // Devolver objeto vacío en caso de error
    }
  }
}