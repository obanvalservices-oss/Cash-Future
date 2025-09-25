// src/inversiones/inversiones.service.ts
import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateInversionDto } from './dto/create-inversione.dto';
import { UpdateInversionDto } from './dto/update-inversione.dto';

@Injectable()
export class InversionesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: number, dto: CreateInversionDto) {
    // Separamos el fondoId del resto de los datos del DTO
    const { fondoId, ...inversionData } = dto;

    try {
      return await this.prisma.inversion.create({
        data: {
          ...inversionData, // Usamos el resto de los datos del DTO
          user: { connect: { id: userId } }, // Conectamos con el usuario
          fondo: { connect: { id: fondoId } }, // Conectamos con el fondo de inversión
        },
        include: { fondo: true },
      });
    } catch (e) {
      console.error('Error al crear inversión:', e);
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

  async findOne(id: string) {
    const row = await this.prisma.inversion.findUnique({
      where: { id: Number(id) },
      include: { fondo: true },
    });
    if (!row) throw new NotFoundException('Inversión no encontrada');
    return row;
  }

  async update(id: string, dto: UpdateInversionDto) {
    const { fondoId, ...inversionData } = dto;

    try {
      return await this.prisma.inversion.update({
        where: { id: Number(id) },
        data: {
          ...inversionData,
          // Si se envía un nuevo fondoId, actualizamos la conexión
          ...(fondoId && { fondo: { connect: { id: fondoId } } }),
        },
        include: { fondo: true },
      });
    } catch (e) {
      console.error('Error al actualizar inversión:', e);
      throw new InternalServerErrorException('Error al actualizar la inversión.');
    }
  }

  async remove(id: string) {
    try {
      return await this.prisma.inversion.delete({ where: { id: Number(id) } });
    } catch {
      throw new InternalServerErrorException('Error al eliminar la inversión.');
    }
  }
}