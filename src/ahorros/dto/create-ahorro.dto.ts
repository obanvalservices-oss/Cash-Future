import { IsBoolean, IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CrearAhorroDto {
  @IsString()
  @IsNotEmpty()
  objetivo: string;

  @IsNumber()
  @Min(0)
  meta: number; // Corregido: de 'monto' a 'meta'

  @IsBoolean()
  fijo: boolean; // Corregido: de 'recurrente' a 'fijo'

  @IsDateString()
  fechaInicio: string; // Corregido: de 'fecha' a 'fechaInicio'

  // Campos opcionales que el formulario también puede enviar
  @IsNumber()
  @IsOptional()
  @Min(0)
  aporteInicial?: number;

  @IsString()
  @IsOptional()
  frecuencia?: string;

  @IsNumber()
  @IsOptional()
  @Min(0)
  aporteFijo?: number;

  // El campo 'categoria' no está en tu schema de Ahorro, lo he eliminado.
}