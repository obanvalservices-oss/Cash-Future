// src/compartido/compartido.service.ts
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateInvitacionDto } from './dto/create-invitacion.dto';
import { AceptarInvitacionDto } from './dto/aceptar-invitacion.dto';
import { UpdatePermisosDto } from './dto/update-permisos.dto';
import { CreateMovimientoDto } from './dto/create-movcomp.dto';
import { SyncOcultosDto } from './dto/sync-ocultos.dto';
import { ModuloTipo, VisibilidadNivel, AsociacionEstado } from '@prisma/client';

@Injectable()
export class CompartidoService {
  constructor(private readonly prisma: PrismaService) {}

  private async findOrCreateFondoInversion(userId: number, nombre: string) {
    let fondo = await this.prisma.fondoInversion.findUnique({
      where: { userId_nombre: { userId, nombre } },
    });
    if (!fondo) {
      fondo = await this.prisma.fondoInversion.create({
        data: { userId, nombre },
      });
    }
    return fondo;
  }
  
  async createInvitacion(ownerId: number, dto: CreateInvitacionDto) {
    const existing = await this.prisma.asociacion.findFirst({
      where: { ownerId, partnerEmail: dto.partnerEmail },
    });
    if (existing) throw new BadRequestException('Ya existe una invitación o asociación con este email.');

    const newAsoc = await this.prisma.asociacion.create({
      data: {
        ownerId,
        partnerEmail: dto.partnerEmail,
        partnerDisplayName: dto.partnerDisplayName,
        relacion: dto.relacion,
        estado: AsociacionEstado.PENDIENTE,
      },
    });
    const permisos = Object.values(ModuloTipo).map((mod) => ({
      asociacionId: newAsoc.id,
      modulo: mod,
      visibilidad: VisibilidadNivel.NADA,
    }));
    await this.prisma.asociacionPermiso.createMany({ data: permisos });
    return this.prisma.asociacion.findUnique({ where: { id: newAsoc.id }, include: { permisos: true } });
  }
  
  async aceptarInvitacion(userId: number, dto: AceptarInvitacionDto) {
    const invitacion = await this.prisma.asociacion.findFirst({
      where: { id: dto.asociacionId, partnerEmail: dto.userEmail, estado: AsociacionEstado.PENDIENTE },
    });
    if (!invitacion) throw new NotFoundException('Invitación no encontrada o no válida.');
    return this.prisma.asociacion.update({
      where: { id: invitacion.id },
      data: { partnerUserId: userId, estado: AsociacionEstado.ACTIVA, aliasParaPartner: dto.aliasParaPartner },
    });
  }

  async getMisAsociaciones(userId: number) {
    return this.prisma.asociacion.findMany({
      where: { OR: [{ ownerId: userId }, { partnerUserId: userId }], estado: AsociacionEstado.ACTIVA },
      orderBy: { createdAt: 'desc' },
      include: {
        permisos: true,
        owner: { select: { id: true, nombre: true, email: true } },
        partnerUser: { select: { id: true, nombre: true, email: true } },
      },
    });
  }

  async getInvitacionesPendientes(email: string) {
    return this.prisma.asociacion.findMany({
      where: { partnerEmail: email, estado: AsociacionEstado.PENDIENTE },
      include: { owner: { select: { nombre: true, email: true } } },
    });
  }
  
  async updatePermisos(ownerId: number, asociacionId: string, dto: UpdatePermisosDto) {
    const asoc = await this.prisma.asociacion.findFirst({ where: { id: asociacionId, ownerId } });
    if (!asoc) throw new NotFoundException('Asociación no encontrada');
    const updates = dto.permisos.map((p) =>
      this.prisma.asociacionPermiso.update({
        where: { asociacionId_modulo: { asociacionId, modulo: p.modulo } },
        data: { visibilidad: p.visibilidad },
      }),
    );
    await this.prisma.$transaction(updates);
    return true;
  }

  async syncOcultos(ownerId: number, asociacionId: string, dto: SyncOcultosDto) {
    const asoc = await this.prisma.asociacion.findFirst({ where: { id: asociacionId, ownerId } });
    if (!asoc) throw new NotFoundException('Asociación no encontrada');
    await this.prisma.asociacionOculto.deleteMany({
      where: { asociacionId, modulo: dto.modulo },
    });
    if (dto.recordIds.length > 0) {
      await this.prisma.asociacionOculto.createMany({
        data: dto.recordIds.map((recordId) => ({
          asociacionId,
          modulo: dto.modulo,
          recordId,
        })),
      });
    }
    return true;
  }

  async createMovimiento(ownerId: number, dto: CreateMovimientoDto) {
    const asoc = await this.prisma.asociacion.findFirst({
      where: { id: dto.asociacionId, ownerId },
    });
    if (!asoc || !asoc.partnerUserId) throw new NotFoundException('Asociación no válida');
    const partnerId = asoc.partnerUserId;

    const { aporteOwner, aportePartner } = this.calculateAportes(dto.montoTotal, dto.tipoDivision, dto.aporteOwner);

    const mov = await this.prisma.movimientoCompartido.create({
      data: {
        asociacionId: dto.asociacionId,
        modulo: dto.modulo,
        concepto: dto.concepto,
        montoTotal: dto.montoTotal,
        aporteOwner,
        aportePartner,
        fecha: new Date(dto.fecha),
        createdByUserId: ownerId,
      },
    });
    const fecha = new Date(dto.fecha);
    
    if (dto.modulo === ModuloTipo.AHORROS) {
      await this.prisma.ahorro.createMany({
        data: [
          { userId: ownerId, objetivo: dto.concepto, meta: aporteOwner, fechaInicio: fecha, fijo: false },
          { userId: partnerId, objetivo: dto.concepto, meta: aportePartner, fechaInicio: fecha, fijo: false },
        ],
      });
    } else if (dto.modulo === ModuloTipo.INVERSIONES) {
      const fondoOwner = (await this.findOrCreateFondoInversion(ownerId, 'Compartido')).id;
      const fondoPartner = (await this.findOrCreateFondoInversion(partnerId, 'Compartido')).id;
      
      await this.prisma.inversion.createMany({
        data: [
          { userId: ownerId, tipo: 'Compartido', activo: dto.concepto, ticker: 'SHARED', cantidad: 1, precioCompra: aporteOwner, descripcion: 'Mov compartido', fondoId: fondoOwner },
          { userId: partnerId, tipo: 'Compartido', activo: dto.concepto, ticker: 'SHARED', cantidad: 1, precioCompra: aportePartner, descripcion: 'Mov compartido', fondoId: fondoPartner },
        ],
      });
    }
    return mov;
  }

  private calculateAportes(total: number, tipo: 'PROPORCIONAL' | 'IGUAL' | 'EXACTO', aporteOwner?: number) {
    if (tipo === 'IGUAL') {
      const half = total / 2;
      return { aporteOwner: half, aportePartner: half };
    }
    if (tipo === 'EXACTO') {
      const owner = aporteOwner ?? 0;
      return { aporteOwner: owner, aportePartner: total - owner };
    }
    const half = total / 2;
    return { aporteOwner: half, aportePartner: half };
  }
}