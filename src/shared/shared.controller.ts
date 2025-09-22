import { Controller, Post, Body, Req } from '@nestjs/common';
import { SharedService } from './shared.service';
import { RelacionTipo, ModuloTipo, VisibilidadNivel } from '@prisma/client';

@Controller('shared')
export class SharedController {
  constructor(private readonly sharedService: SharedService) {}

  @Post('invite')
  async crearInvitacion(
    @Req() req,
    @Body()
    body: {
      partnerEmail: string;
      partnerDisplayName: string;
      relacion: RelacionTipo;
      permisos: { modulo: ModuloTipo; visibilidad: VisibilidadNivel }[];
    },
  ) {
    const ownerId = req.user.id; // asumiendo que tienes middleware de auth
    return this.sharedService.crearInvitacion(
      ownerId,
      body.partnerEmail,
      body.partnerDisplayName,
      body.relacion,
      body.permisos,
    );
  }
}
