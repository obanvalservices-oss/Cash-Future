// src/dashboard/dashboard.controller.ts
import {
    Controller,
    Get,
    Query,
    Req,
    UseGuards,
    BadRequestException,
  } from '@nestjs/common';
  import { JwtAuthGuard } from '../auth/jwt-auth.guard';
  import { DashboardService } from './dashboard.service';
  
  @UseGuards(JwtAuthGuard)
  @Controller('dashboard')
  export class DashboardController {
    constructor(private readonly dashboard: DashboardService) {}
  
    /**
     * GET /dashboard/weekly
     * Parámetros opcionales:
     * - period: "SEMANA" | "COMPARAR" | "1M" | "3M" | "6M"
     * - from, to: rango explícito (YYYY-MM-DD). Si se envían, se ignora period.
     */
    @Get('weekly')
    async weekly(
      @Req() req: any,
      @Query('period') period?: string,
      @Query('from') from?: string,
      @Query('to') to?: string,
    ) {
      // Validaciones simples
      if ((from && !to) || (!from && to)) {
        throw new BadRequestException('Debe enviar ambos: from y to, o ninguno.');
      }
  
      return this.dashboard.getWeekly(req.user.id, { period, from, to });
    }
  }
  