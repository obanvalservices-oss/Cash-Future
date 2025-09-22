// src/deudas/dto/create-deuda.dto.ts
export class CreateDeudaDto {
    nombre!: string;
    montoTotal!: number;
  
    // datos opcionales de plan de pago
    cuotaMonto?: number;          // monto de la cuota si existe
    cuotaFecha?: string;          // ISO date de próximo vencimiento (si aplica)
    frecuencia?: 'mensual' | 'semanal' | 'libre';
  
    // pago inicial opcional
    initialPayment?: number;
    initialPaymentDate?: string;  // ISO date
  }
  