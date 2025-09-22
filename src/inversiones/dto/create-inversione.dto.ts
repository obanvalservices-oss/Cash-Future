// src/inversiones/dto/create-inversion.dto.ts
import { IsString, IsNumber, IsOptional, IsInt, IsDateString } from 'class-validator';

export class CreateInversionDto {
  @IsString() tipo: string;
  @IsString() activo: string;
  @IsString() categoria: string;

  @IsNumber() cantidad: number;
  @IsNumber() precioCompra: number;
  @IsNumber() precioActual: number;

  @IsString() @IsOptional() descripcion?: string;

  @IsInt() fondoId: number;
  @IsDateString() fecha: string;

  @IsInt() userId: number;
}
