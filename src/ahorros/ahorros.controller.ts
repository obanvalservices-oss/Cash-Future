// src/ahorros/ahorros.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  Req,
  UseGuards,
  Query,
  BadRequestException,
  ParseIntPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AhorrosService } from './ahorros.service';

// DTOs para validación y claridad
class CreateAhorroDto {
  objetivo: string;
  meta: number;
  aporte?: number;
  fijo: boolean;
  fechaInicio?: string;
  frecuencia?: 'semanal' | 'bisemanal' | 'mensual';
  aporteFijo?: number;
}

class UpdateAhorroDto extends CreateAhorroDto {}

@UseGuards(JwtAuthGuard)
@Controller('ahorros')
export class AhorrosController {
  constructor(private readonly ahorrosService: AhorrosService) {}

  @Post()
  create(@Req() req, @Body() dto: CreateAhorroDto) {
    return this.ahorrosService.create(req.user.id, dto);
  }

  @Get()
  findAll(@Req() req, @Query('withMovs') withMovs?: string) {
    // Esta ruta ahora siempre devuelve los saldos, ya que el frontend lo necesita
    return this.ahorrosService.findAllByUserWithSaldo(req.user.id);
  }

  @Patch(':id')
  update(
    @Req() req,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: Partial<UpdateAhorroDto>,
  ) {
    return this.ahorrosService.update(req.user.id, id, dto);
  }

  @Delete(':id')
  remove(@Req() req, @Param('id', ParseIntPipe) id: number) {
    return this.ahorrosService.remove(req.user.id, id);
  }
}