import { RelacionTipo } from '@prisma/client';

export class CreateInvitacionDto {
  partnerEmail: string;
  partnerDisplayName: string;
  relacion: RelacionTipo;
}