// src/inversiones/inversiones.controller.ts
import { Controller, Get, Post, Body, Param, Delete, Req, UseGuards, Patch } from '@nestjs/common';
import { InversionesService } from './inversiones.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateInversionDto } from './dto/create-inversione.dto';
// CORREGIDO: Nos aseguramos de que la importación y el uso sean correctos
import { UpdateInversionDto } from './dto/update-inversione.dto';

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
  findOne(@Param('id') id: string) {
    return this.inversionesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateInversionDto: UpdateInversionDto) {
    return this.inversionesService.update(id, updateInversionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.inversionesService.remove(id);
  }
}