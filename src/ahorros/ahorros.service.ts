import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AhorrosService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: number, dto: any) {
    try {
      const created = await this.prisma.ahorro.create({
        data: {
          objetivo: dto.nombre ?? dto.objetivo ?? '',
          monto: dto.meta ?? dto.monto ?? 0,                 // meta
          categoria: 'FONDO',
          fecha: new Date(dto.fechaInicio ?? dto.fecha),     // fechaInicio real
          recurrente: !!(dto.fijo ?? dto.recurrente),        // fijo
          colorTag: dto.frecuencia ?? null,                  // usamos colorTag para guardar frecuencia
          // guardamos aporte fijo en un campo libre (sharedId) si no tienes columna dedicada
          sharedId: dto.aporteFijo != null ? String(dto.aporteFijo) : null,
          // descripción opcional
          descripcion: dto.descripcion ?? dto.nombre ?? null,
          user: { connect: { id: userId } },
          isShared: false,
        } as any,
      });

      // primer movimiento (si llega "aporte")
      if (typeof dto.aporte === 'number' && dto.aporte > 0) {
        await this.prisma.movimientoAhorro.create({
          data: {
            ahorro: { connect: { id: created.id } },
            fecha: new Date(dto.fechaInicio ?? dto.fecha),
            motivo: 'APORTE',
            monto: dto.aporte,
          },
        });
      }

      return created;
    } catch (e) {
      throw new InternalServerErrorException('Error al crear ahorro.');
    }
  }

  async findAllByUser(userId: number) {
    return this.prisma.ahorro.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  // Devuelve fondos con saldo + datos necesarios para proyección
  async findAllByUserWithSaldo(userId: number) {
    const fondos = await this.prisma.ahorro.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: { movimientos: true },
    });

    return fondos.map((f: any) => {
      const saldo = (f.movimientos || []).reduce((acc: number, m: any) => acc + (Number(m.monto) || 0), 0);
      const aporteFijo = f.sharedId != null && !isNaN(Number(f.sharedId)) ? Number(f.sharedId) : 0;

      return {
        id: f.id,
        nombre: f.objetivo,
        descripcion: f.descripcion ?? null,
        meta: Number(f.monto) || 0,
        fechaInicio: f.fecha,            // clave para proyección
        fechaCreacion: f.createdAt,
        fijo: !!f.recurrente,
        frecuencia: f.colorTag ?? '',    // semanal | bisemanal | mensual
        aporteFijo,                      // monto a proyectar
        saldo,
        movimientos: (f.movimientos || []).map((m: any) => ({
          id: m.id,
          fecha: m.fecha,
          motivo: m.motivo,
          monto: Number(m.monto) || 0,
        })),
      };
    });
  }

  async update(id: string, dto: any) {
    return this.prisma.ahorro.update({
      where: { id: Number(id) },
      data: {
        objetivo: dto.nombre ?? dto.objetivo,
        descripcion: dto.descripcion,
        monto: dto.meta ?? dto.monto,
        fecha: dto.fechaInicio ? new Date(dto.fechaInicio) : dto.fecha ? new Date(dto.fecha) : undefined,
        recurrente: dto.fijo ?? dto.recurrente,
        colorTag: (dto.frecuencia === undefined ? undefined : dto.frecuencia),
        sharedId: (dto.aporteFijo === undefined ? undefined : String(dto.aporteFijo)),
      } as any,
    });
  }

  async remove(userId: number, id: string) {
    const fondo = await this.prisma.ahorro.findFirst({ where: { id: Number(id), userId } });
    if (!fondo) throw new NotFoundException('Fondo no encontrado');

    await this.prisma.$transaction([
      this.prisma.movimientoAhorro.deleteMany({ where: { ahorroId: fondo.id } }),
      this.prisma.ahorro.delete({ where: { id: fondo.id } }),
    ]);

    return { ok: true };
  }

  // Movimientos
  async addMovimiento(ahorroId: number, data: { fecha: Date; monto: number; motivo: string }) {
    const f = await this.prisma.ahorro.findUnique({ where: { id: ahorroId } });
    if (!f) throw new NotFoundException('Fondo no encontrado');

    return this.prisma.movimientoAhorro.create({
      data: {
        ahorro: { connect: { id: ahorroId } },
        fecha: data.fecha,
        motivo: data.motivo,
        monto: data.monto,
      },
    });
  }

  async updateMovimiento(ahorroId: number, movId: number, patch: { fecha?: Date; monto?: number; motivo?: string }) {
    const mov = await this.prisma.movimientoAhorro.findUnique({ where: { id: movId } });
    if (!mov || mov.ahorroId !== ahorroId) throw new NotFoundException('Movimiento no encontrado');

    return this.prisma.movimientoAhorro.update({
      where: { id: movId },
      data: {
        fecha: patch.fecha,
        monto: patch.monto as any,
        motivo: patch.motivo,
      },
    });
  }

  async deleteMovimiento(ahorroId: number, movId: number) {
    const mov = await this.prisma.movimientoAhorro.findUnique({ where: { id: movId } });
    if (!mov || mov.ahorroId !== ahorroId) throw new NotFoundException('Movimiento no encontrado');

    await this.prisma.movimientoAhorro.delete({ where: { id: movId } });
    return { ok: true };
  }
}
