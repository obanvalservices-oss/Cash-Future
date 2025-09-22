import { Controller, Get, Post, Body, Param, Delete, Req, UseGuards, Patch, Query } from '@nestjs/common';
import { InversionesService } from './inversiones.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('inversiones')
export class InversionesController {
  constructor(private readonly inversionesService: InversionesService) {}

  @Post()
  create(@Req() req, @Body() dto: any) {
    return this.inversionesService.create(req.user.id, dto);
  }

  @Get()
  findAll(@Req() req) {
    return this.inversionesService.findAllByUser(req.user.id);
  }

  @Get('proyectados')
  findAllWithProjection(@Req() req, @Query('meses') meses?: string) {
    // Por ahora no proyectamos inversiones; devolvemos las reales
    return this.inversionesService.findAllByUser(req.user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.inversionesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: any) {
    return this.inversionesService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.inversionesService.remove(id);
  }
}
