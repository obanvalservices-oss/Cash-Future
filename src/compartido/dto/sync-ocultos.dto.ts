import { ModuloTipo } from '@prisma/client';

export class SyncOcultosDto {
  modulo: ModuloTipo;
  recordIds: string[];
}