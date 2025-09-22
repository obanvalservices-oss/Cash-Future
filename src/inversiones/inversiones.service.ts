import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class InversionesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: number, dto: any) {
    try {
      return await this.prisma.inversion.create({
        data: {
          tipo: dto.tipo,
          activo: dto.activo,
          categoria: dto.categoria,
          cantidad: dto.cantidad ?? null,
          precioCompra: dto.precioCompra ?? null,
          precioActual: dto.precioActual ?? null,
          descripcion: dto.descripcion ?? null,
          fondo: { connect: { id: dto.fondoId } },
          user: { connect: { id: userId } },
          // shared flags si aplican
        },
        include: { fondo: true },
      });
    } catch {
      throw new InternalServerErrorException('Error al crear inversión.');
    }
  }

  async findAllByUser(userId: number) {
    return this.prisma.inversion.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: { fondo: true },
    });
  }

  async findOne(id: string) {
    const row = await this.prisma.inversion.findUnique({
      where: { id: Number(id) },
      include: { fondo: true },
    });
    if (!row) throw new NotFoundException('Inversión no encontrada');
    return row;
  }

  async update(id: string, dto: any) {
    try {
      return await this.prisma.inversion.update({
        where: { id: Number(id) },
        data: {
          tipo: dto.tipo,
          activo: dto.activo,
          categoria: dto.categoria,
          cantidad: dto.cantidad,
          precioCompra: dto.precioCompra,
          precioActual: dto.precioActual,
          descripcion: dto.descripcion,
          fondoId: dto.fondoId,
        },
        include: { fondo: true },
      });
    } catch {
      throw new InternalServerErrorException('Error al actualizar inversión.');
    }
  }

  async remove(id: string) {
    try {
      return await this.prisma.inversion.delete({ where: { id: Number(id) } });
    } catch {
      throw new InternalServerErrorException('Error al eliminar inversión.');
    }
  }
}
