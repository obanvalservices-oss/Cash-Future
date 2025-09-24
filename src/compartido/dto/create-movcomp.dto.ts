import { ModuloTipo } from '@prisma/client';

export class CreateMovimientoDto {
  asociacionId: string;
  modulo: ModuloTipo;
  concepto: string;
  montoTotal: number;
  tipoDivision: 'IGUAL' | 'EXACTO' | 'PROPORCIONAL';
  aporteOwner?: number;
  fecha: string;
}