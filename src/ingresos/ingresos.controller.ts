import { Controller, Get, Post, Body, Param, Delete, Req, UseGuards, Patch, Query } from '@nestjs/common';
import { IngresosService } from './ingresos.service';
import { CreateIngresoDto } from './dto/create-ingreso.dto';
import { UpdateIngresoDto } from './dto/update-ingreso.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('ingresos')
export class IngresosController {
  constructor(private readonly ingresosService: IngresosService) {}

  @Post()
  create(@Req() req, @Body() dto: CreateIngresoDto) {
    return this.ingresosService.create(req.user.id, dto);
  }

  @Get()
  findAll(@Req() req) {
    return this.ingresosService.findAllByUser(req.user.id); // ✅ solo reales
  }

  @Get('proyectados')
  findAllWithProjection(@Req() req, @Query('meses') meses?: string) {
    return this.ingresosService.findAllByUserWithProjection(req.user.id, {
      proyectar: true,
      meses: Number(meses) || 6,
    });
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateIngresoDto) {
    return this.ingresosService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ingresosService.remove(id);
  }
}
