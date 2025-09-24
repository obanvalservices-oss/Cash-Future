// src/inversiones/inversiones.service.ts
import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

// DTO para mayor claridad y consistencia
interface CreateInversionDto {
  tipo: string;
  activo: string;
  ticker: string; // Añadido
  cantidad: number;
  precioCompra: number;
  descripcion?: string;
}

interface UpdateInversionDto extends Partial<CreateInversionDto> {}

@Injectable()
export class InversionesService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Busca o crea un fondo de inversión por defecto para el usuario.
   */
  private async findOrCreateDefaultFondo(userId: number) {
    const defaultFondoName = 'Mi Portafolio';
    let fondo = await this.prisma.fondoInversion.findFirst({
      where: { userId, nombre: defaultFondoName },
    });

    if (!fondo) {
      fondo = await this.prisma.fondoInversion.create({
        data: {
          nombre: defaultFondoName,
          user: { connect: { id: userId } },
        },
      });
    }
    return fondo;
  }

  async create(userId: number, dto: CreateInversionDto) {
    try {
      const fondo = await this.findOrCreateDefaultFondo(userId);

      return await this.prisma.inversion.create({
        data: {
          tipo: dto.tipo,
          activo: dto.activo,
          ticker: dto.ticker,
          cantidad: dto.cantidad,
          precioCompra: dto.precioCompra,
          descripcion: dto.descripcion,
          fondo: { connect: { id: fondo.id } },
          user: { connect: { id: userId } },
        },
        include: { fondo: true },
      });
    } catch (error) {
      console.error('Error detallado al crear inversión:', error);
      throw new InternalServerErrorException('Error al crear la inversión.');
    }
  }

  async findAllByUser(userId: number) {
    return this.prisma.inversion.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: { fondo: true },
    });
  }

  async findOne(userId: number, id: number) {
    const row = await this.prisma.inversion.findFirst({
      where: { id, userId },
      include: { fondo: true },
    });
    if (!row) throw new NotFoundException('Inversión no encontrada');
    return row;
  }

  async update(userId: number, id: number, dto: UpdateInversionDto) {
    await this.findOne(userId, id); // Verifica que la inversión existe y pertenece al usuario

    try {
      return await this.prisma.inversion.update({
        where: { id },
        data: dto, // Prisma ignorará campos undefined, es más limpio
        include: { fondo: true },
      });
    } catch {
      throw new InternalServerErrorException('Error al actualizar la inversión.');
    }
  }

  async remove(userId: number, id: number) {
    await this.findOne(userId, id); // Verifica pertenencia antes de borrar

    try {
      return await this.prisma.inversion.delete({ where: { id } });
    } catch {
      throw new InternalServerErrorException('Error al eliminar la inversión.');
    }
  }
}