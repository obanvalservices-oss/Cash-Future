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
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AhorrosService } from './ahorros.service';

@UseGuards(JwtAuthGuard)
@Controller('ahorros')
export class AhorrosController {
  constructor(private readonly ahorros: AhorrosService) {}

  @Post()
  create(@Req() req, @Body() dto: any) {
    return this.ahorros.create(req.user.id, dto);
  }

  @Get()
  findAll(@Req() req, @Query('withMovs') withMovs?: string) {
    if (withMovs === '1') {
      return this.ahorros.findAllByUserWithSaldo(req.user.id);
    }
    return this.ahorros.findAllByUser(req.user.id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: any) {
    return this.ahorros.update(id, dto);
  }

  @Delete(':id')
  remove(@Req() req, @Param('id') id: string) {
    return this.ahorros.remove(req.user.id, id);
  }

  // Movimientos
  @Post(':id/movimientos')
  addMovimiento(
    @Param('id') ahorroId: string,
    @Body() dto: { fecha: string; monto: number; motivo?: string },
  ) {
    if (!dto?.fecha || typeof dto?.monto !== 'number') {
      throw new BadRequestException('Campos requeridos: fecha, monto');
    }
    return this.ahorros.addMovimiento(Number(ahorroId), {
      fecha: new Date(dto.fecha),
      monto: dto.monto,
      motivo: dto.motivo ?? 'APORTE',
    });
  }

  @Patch(':id/movimientos/:movId')
  updateMovimiento(
    @Param('id') ahorroId: string,
    @Param('movId') movId: string,
    @Body() dto: { fecha?: string; monto?: number; motivo?: string },
  ) {
    return this.ahorros.updateMovimiento(Number(ahorroId), Number(movId), {
      fecha: dto.fecha ? new Date(dto.fecha) : undefined,
      monto: typeof dto.monto === 'number' ? dto.monto : undefined,
      motivo: dto.motivo,
    });
  }

  @Delete(':id/movimientos/:movId')
  deleteMovimiento(@Param('id') ahorroId: string, @Param('movId') movId: string) {
    return this.ahorros.deleteMovimiento(Number(ahorroId), Number(movId));
  }
}
