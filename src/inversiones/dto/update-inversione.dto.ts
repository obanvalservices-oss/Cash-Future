// src/inversiones/dto/update-inversione.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateInversionDto } from './create-inversione.dto'

export class UpdateInversioneDto extends PartialType(CreateInversionDto) {}
