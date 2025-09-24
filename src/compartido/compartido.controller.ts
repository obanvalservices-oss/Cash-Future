// src/compartido/compartido.controller.ts
import { Controller, Post, Body, Req, UseGuards, Get, Param, Patch } from '@nestjs/common';
import { CompartidoService } from './compartido.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateInvitacionDto } from './dto/create-invitacion.dto';
import { AceptarInvitacionDto } from './dto/aceptar-invitacion.dto';
import { UpdatePermisosDto } from './dto/update-permisos.dto';
import { CreateMovimientoDto } from './dto/create-movcomp.dto';
import { SyncOcultosDto } from './dto/sync-ocultos.dto';

@UseGuards(JwtAuthGuard)
@Controller('compartido')
export class CompartidoController {
  constructor(private readonly service: CompartidoService) {}

  @Post('invitar')
  createInvitacion(@Req() req, @Body() body: CreateInvitacionDto) {
    return this.service.createInvitacion(req.user.id, body);
  }

  @Post('invitacion/aceptar')
  aceptarInvitacion(@Req() req, @Body() body: AceptarInvitacionDto) {
    return this.service.aceptarInvitacion(req.user.id, body);
  }

  @Get('asociaciones')
  getMisAsociaciones(@Req() req) {
    return this.service.getMisAsociaciones(req.user.id);
  }

  @Get('invitaciones')
  getInvitacionesPendientes(@Req() req) {
    return this.service.getInvitacionesPendientes(req.user.email);
  }
  
  @Patch('permisos/:asociacionId')
  updatePermisos(@Req() req, @Param('asociacionId') asociacionId: string, @Body() body: UpdatePermisosDto) {
    return this.service.updatePermisos(req.user.id, asociacionId, body);
  }

  @Post('ocultos/:asociacionId')
  syncOcultos(@Req() req, @Param('asociacionId') asociacionId: string, @Body() body: SyncOcultosDto) {
    return this.service.syncOcultos(req.user.id, asociacionId, body);
  }

  @Post('movimiento')
  createMovimiento(@Req() req, @Body() body: CreateMovimientoDto) {
    return this.service.createMovimiento(req.user.id, body);
  }
}