// src/inversiones/dto/update-inversion.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateInversionDto } from './create-inversione.dto';

// CORREGIDO: Se eliminó la 'e' extra de "Inversione"
export class UpdateInversionDto extends PartialType(CreateInversionDto) {}