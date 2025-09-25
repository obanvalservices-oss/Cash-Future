// src/inversiones/dto/create-inversione.dto.ts
import { IsString, IsNumber, IsOptional, IsInt, IsNotEmpty } from 'class-validator';

export class CreateInversionDto {
  @IsString()
  @IsNotEmpty()
  tipo: string;

  @IsString()
  @IsNotEmpty()
  activo: string;
  
  @IsString()
  @IsNotEmpty()
  ticker: string;

  @IsString()
  @IsNotEmpty()
  categoria: string;

  @IsNumber()
  cantidad: number;

  @IsNumber()
  precioCompra: number;

  @IsString()
  @IsOptional()
  descripcion?: string;

  @IsInt()
  fondoId: number;
}