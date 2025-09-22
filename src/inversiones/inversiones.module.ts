import { Module } from '@nestjs/common';
import { InversionesService } from './inversiones.service';
import { InversionesController } from './inversiones.controller';

@Module({
  controllers: [InversionesController],
  providers: [InversionesService],
})
export class InversionesModule {}
