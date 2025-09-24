// src/ahorros/ahorros.service.ts
import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

interface CreateAhorroDto {
  objetivo: string;
  meta: number;
  aporte?: number; // Aporte inicial
  fijo: boolean;
  fechaInicio?: string;
  frecuencia?: 'semanal' | 'bisemanal' | 'mensual';
  aporteFijo?: number;
}

interface UpdateAhorroDto extends Partial<CreateAhorroDto> {}

@Injectable()
export class AhorrosService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: number, dto: CreateAhorroDto) {
    try {
      const createdFondo = await this.prisma.ahorro.create({
        data: {
          userId,
          objetivo: dto.objetivo,
          meta: dto.meta,
          fijo: dto.fijo,
          fechaInicio: dto.fijo ? new Date(dto.fechaInicio) : new Date(),
          frecuencia: dto.fijo ? dto.frecuencia : null,
          aporteFijo: dto.fijo ? dto.aporteFijo : 0,
        },
      });

      // Si hay un aporte inicial, se registra como el primer movimiento
      if (dto.aporte && dto.aporte > 0) {
        await this.prisma.movimientoAhorro.create({
          data: {
            ahorroId: createdFondo.id,
            monto: dto.aporte,
            motivo: 'Aporte inicial',
            fecha: createdFondo.fechaInicio,
          },
        });
      }

      return createdFondo;
    } catch (e) {
      console.error(e);
      throw new InternalServerErrorException('Error al crear el fondo de ahorro.');
    }
  }

  async findAllByUserWithSaldo(userId: number) {
    const fondos = await this.prisma.ahorro.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: { movimientos: true },
    });

    return fondos.map(f => {
      const saldo = f.movimientos.reduce((acc, m) => acc + m.monto, 0);
      return { ...f, saldo };
    });
  }

  async update(userId: number, id: number, dto: UpdateAhorroDto) {
    await this.findAndEnsureOwner(userId, id); // Verifica propiedad
    return this.prisma.ahorro.update({
      where: { id },
      data: {
        objetivo: dto.objetivo,
        meta: dto.meta,
        fijo: dto.fijo,
        fechaInicio: dto.fechaInicio ? new Date(dto.fechaInicio) : undefined,
        frecuencia: dto.frecuencia,
        aporteFijo: dto.aporteFijo,
      },
    });
  }

  async remove(userId: number, id: number) {
    await this.findAndEnsureOwner(userId, id);
    // Usamos una transacción para borrar los movimientos y luego el fondo
    return this.prisma.$transaction([
      this.prisma.movimientoAhorro.deleteMany({ where: { ahorroId: id } }),
      this.prisma.ahorro.delete({ where: { id } }),
    ]);
  }
  
  private async findAndEnsureOwner(userId: number, ahorroId: number) {
    const fondo = await this.prisma.ahorro.findFirst({ where: { id: ahorroId, userId } });
    if (!fondo) throw new NotFoundException('Fondo de ahorro no encontrado o no pertenece al usuario.');
    return fondo;
  }
}