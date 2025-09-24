// src/inversiones/inversiones.controller.ts
import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards, ParseIntPipe } from '@nestjs/common';
import { InversionesService } from './inversiones.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

class CreateInversionDto {
  tipo: string;
  activo: string;
  ticker: string; // <-- AÑADIDO
  cantidad: number;
  precioCompra: number;
  descripcion?: string;
}

class UpdateInversionDto extends CreateInversionDto {}

@UseGuards(JwtAuthGuard)
@Controller('inversiones')
export class InversionesController {
  constructor(private readonly inversionesService: InversionesService) {}

  @Post()
  create(@Req() req, @Body() createInversionDto: CreateInversionDto) {
    return this.inversionesService.create(req.user.id, createInversionDto);
  }

  @Get()
  findAll(@Req() req) {
    return this.inversionesService.findAllByUser(req.user.id);
  }

  @Get(':id')
  findOne(@Req() req, @Param('id', ParseIntPipe) id: number) {
    return this.inversionesService.findOne(req.user.id, id);
  }

  @Patch(':id')
  update(@Req() req, @Param('id', ParseIntPipe) id: number, @Body() updateInversionDto: Partial<UpdateInversionDto>) {
    return this.inversionesService.update(req.user.id, id, updateInversionDto);
  }

  @Delete(':id')
  remove(@Req() req, @Param('id', ParseIntPipe) id: number) {
    return this.inversionesService.remove(req.user.id, id);
  }
}