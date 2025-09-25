// src/dashboard/dashboard.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MarketDataService } from '../market-data/market-data.service';
import { Inversion, Ahorro, Debt, MovimientoAhorro } from '@prisma/client';

type WeeklyParams = { period?: 'SEMANA' | 'COMPARAR' | '1M' | '3M' | '6M' | string | undefined; from?: string; to?: string; };
type WeekSpan = { start: Date; end: Date; label: string };

export type FondoWidgetDto = { id: number; nombre: string; saldo: number; meta: number; };
export type DeudasWidgetDto = { id: number; nombre: string; saldoPendiente: number; montoTotal: number; };
export type ActivoAgrupadoDto = { activo: string; ticker: string; totalCantidad: number; totalInvertido: number; valorActual: number; pnl: number; pnlPorcentaje: number; };
export type InversionesWidgetDto = { activos: ActivoAgrupadoDto[]; pnlTotal: number; inversionTotal: number; valorTotal: number; };

@Injectable()
export class DashboardService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly marketDataService: MarketDataService,
  ) {}

  // ... (todas las funciones de fecha como startOfWeek, endOfWeek, etc., se quedan igual)
  private startOfWeek(d: Date, weekStartDay: number): Date {
    const x = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    const dow = x.getDay();
    const offset = (7 + dow - weekStartDay) % 7;
    x.setDate(x.getDate() - offset);
    x.setHours(0, 0, 0, 0);
    return x;
  }

  private endOfWeek(d: Date, weekEndDay: number, weekStartDay: number): Date {
    const s = this.startOfWeek(d, weekStartDay);
    const span = (7 + weekEndDay - weekStartDay) % 7;
    const e = new Date(s);
    e.setDate(s.getDate() + span);
    e.setHours(23, 59, 59, 999);
    return e;
  }

  private addWeeks(d: Date, n: number) { const r = new Date(d); r.setDate(r.getDate() + n * 7); return r; }
  private addMonths(d: Date, n: number) { const r = new Date(d); r.setMonth(r.getMonth() + n); return r; }

  private fmtLabel(start: Date, end: Date, idx: number, period: string) {
    const s = start.toLocaleDateString();
    const e = end.toLocaleDateString();
    if (period === 'COMPARAR') { return idx === 0 ? `Semana (actual) ${s} - ${e}` : `Semana (anterior) ${s} - ${e}`; }
    return `Semana ${s} - ${e}`;
  }

  private buildWeeksByPeriod(now: Date, period: string, weekStartDay: number, weekEndDay: number): WeekSpan[] {
    const curS = this.startOfWeek(now, weekStartDay);
    const curE = this.endOfWeek(now, weekEndDay, weekStartDay);
    if (period === 'SEMANA' || !period) { return [{ start: curS, end: curE, label: this.fmtLabel(curS, curE, 0, 'SEMANA') }]; }
    if (period === 'COMPARAR') {
      const prevS = this.addWeeks(curS, -1);
      const prevE = this.endOfWeek(prevS, weekEndDay, weekStartDay);
      return [ { start: curS, end: curE, label: this.fmtLabel(curS, curE, 0, 'COMPARAR') }, { start: prevS, end: prevE, label: this.fmtLabel(prevS, prevE, 1, 'COMPARAR') }];
    }
    const monthsMap: Record<string, number> = { '1M': 1, '3M': 3, '6M': 6 };
    const m = monthsMap[period] ?? 1;
    const endTarget = this.endOfWeek(this.addMonths(now, m), weekEndDay, weekStartDay);
    const arr: WeekSpan[] = [];
    let cursor = new Date(curS);
    let idx = 0;
    while (cursor <= endTarget) {
      const s = new Date(cursor);
      const e = this.endOfWeek(s, weekEndDay, weekStartDay);
      arr.push({ start: s, end: e, label: this.fmtLabel(s, e, idx++, period) });
      cursor = this.addWeeks(cursor, 1);
    }
    return arr;
  }

  private buildWeeksByRange(from: Date, to: Date, weekStartDay: number, weekEndDay: number): WeekSpan[] {
    const first = this.startOfWeek(from, weekStartDay);
    const last = this.endOfWeek(to, weekEndDay, weekStartDay);
    const out: WeekSpan[] = [];
    let cursor = new Date(first);
    let idx = 0;
    while (cursor <= last) {
      const s = new Date(cursor);
      const e = this.endOfWeek(s, weekEndDay, weekStartDay);
      out.push({ start: s, end: e, label: this.fmtLabel(s, e, idx++, 'RANGO') });
      cursor = this.addWeeks(cursor, 1);
    }
    return out;
  }

  private placeInWeek(date: Date, weeks: WeekSpan[]): number {
    const t = +date;
    for (let i = 0; i < weeks.length; i++) { if (t >= +weeks[i].start && t <= +weeks[i].end) return i; }
    return -1;
  }

  private projectRecurringDates(baseDate: Date, weeks: WeekSpan[], frequency: 'semanal' | 'bisemanal' | 'quincenal' | 'mensual') {
    const out: Date[] = [];
    if (!frequency) return out;
    
    const first = weeks[0].start;
    const last = weeks[weeks.length-1].end;
    let cursor = new Date(baseDate);

    while (cursor < first) {
      if (frequency === 'semanal') cursor = this.addWeeks(cursor, 1);
      else if (frequency === 'bisemanal') cursor = this.addWeeks(cursor, 2);
      else if (frequency === 'mensual') cursor = this.addMonths(cursor, 1);
      else break; 
    }

    while(cursor <= last) {
      out.push(new Date(cursor));
      if (frequency === 'semanal') cursor = this.addWeeks(cursor, 1);
      else if (frequency === 'bisemanal') cursor = this.addWeeks(cursor, 2);
      else if (frequency === 'mensual') cursor = this.addMonths(cursor, 1);
      else break;
    }
    return out;
  }

  async getWeekly(userId: number, params: WeeklyParams) {
    const settings = (await this.prisma.userSettings.findUnique({ where: { userId } })) ?? ({} as any);
    const weekStartDay = Number(settings.weekStartDay ?? 1);
    const weekEndDay = Number(settings.weekEndDay ?? 0);
    let weeks: WeekSpan[];
    if (params.from && params.to) { weeks = this.buildWeeksByRange(new Date(params.from), new Date(params.to), weekStartDay, weekEndDay); } else { const p = (params.period || '6M').toUpperCase(); weeks = this.buildWeeksByPeriod(new Date(), p, weekStartDay, weekEndDay); }
    if (!weeks.length) return { widgets: {}, weeklyProjection: { weeks: [], totals: {} } };
    const rangeStart = weeks[0].start;
    const rangeEnd = weeks[weeks.length - 1].end;

    const [ingresos, gastos, inversiones, fondos, deudas] = await Promise.all([
      this.prisma.ingreso.findMany({ where: { userId, OR: [{ fecha: { gte: rangeStart, lte: rangeEnd } }, { fijo: true }] }}),
      this.prisma.gasto.findMany({ where: { userId, OR: [{ fecha: { gte: rangeStart, lte: rangeEnd } }, { fijo: true }] }, include: { categoria: true } }),
      this.prisma.inversion.findMany({ where: { userId } }),
      this.prisma.ahorro.findMany({ where: { userId }, include: { movimientos: true } }),
      this.prisma.debt.findMany({ where: { userId, status: 'ACTIVA' }, include: { payments: true } }),
    ]);

    const weeklyProjectionResult = this.calculateWeeklyProjection(weeks, ingresos, gastos, inversiones, fondos, deudas);
    const totalsAll = weeklyProjectionResult.totals;
    const saldoProyectado = totalsAll.ingresos - totalsAll.gastos - totalsAll.ahorros - totalsAll.inversiones - totalsAll.pagosDeuda;

    const fondosWidget = fondos.map(f => ({ id: f.id, nombre: f.objetivo, saldo: f.movimientos.reduce((acc, mov) => acc + mov.monto, 0), meta: f.meta }));
    const deudasWidget = deudas.map(d => ({ id: d.id, nombre: d.title, montoTotal: d.principal, saldoPendiente: d.principal - d.payments.reduce((acc, p) => acc + p.monto, 0) }));
    const inversionesWidget = await this.buildInversionesWidget(inversiones);

    return {
      widgets: { saldoProyectado: { monto: saldoProyectado, fechaFinal: rangeEnd }, fondos: fondosWidget, inversiones: inversionesWidget, deudas: deudasWidget },
      weeklyProjection: { weeks: weeklyProjectionResult.weeks, totals: weeklyProjectionResult.totals },
      settings: { weekStartDay, weekEndDay },
    };
  }

  private async buildInversionesWidget(inversiones: Inversion[]): Promise<InversionesWidgetDto> {
    if (inversiones.length === 0) { return { activos: [], pnlTotal: 0, inversionTotal: 0, valorTotal: 0 }; }
    const tickers = [...new Set(inversiones.map(inv => inv.ticker.toUpperCase()))];
    const preciosActuales = await this.marketDataService.getPrices(tickers);
    const agrupado: Record<string, ActivoAgrupadoDto> = {};
    for (const inv of inversiones) {
      const ticker = inv.ticker.toUpperCase();
      if (!agrupado[ticker]) { agrupado[ticker] = { activo: inv.activo, ticker, totalCantidad: 0, totalInvertido: 0, valorActual: 0, pnl: 0, pnlPorcentaje: 0 }; }
      const precioActual = preciosActuales[ticker] ?? inv.precioCompra;
      agrupado[ticker].totalCantidad += inv.cantidad;
      agrupado[ticker].totalInvertido += inv.cantidad * inv.precioCompra;
      agrupado[ticker].valorActual += inv.cantidad * precioActual;
    }
    let pnlTotalGeneral = 0, inversionTotalGeneral = 0, valorTotalGeneral = 0;
    const activosResultantes = Object.values(agrupado).map(activo => {
      activo.pnl = activo.valorActual - activo.totalInvertido;
      activo.pnlPorcentaje = activo.totalInvertido > 0 ? (activo.pnl / activo.totalInvertido) * 100 : 0;
      pnlTotalGeneral += activo.pnl;
      inversionTotalGeneral += activo.totalInvertido;
      valorTotalGeneral += activo.valorActual;
      return activo;
    });
    return { activos: activosResultantes, pnlTotal: pnlTotalGeneral, inversionTotal: inversionTotalGeneral, valorTotal: valorTotalGeneral };
  }
  
  private calculateWeeklyProjection(
    weeks: WeekSpan[],
    ingresos: any[],
    gastos: any[],
    inversiones: Inversion[],
    fondos: (Ahorro & { movimientos: MovimientoAhorro[] })[],
    deudas: (Debt & { payments: any[] })[]
  ) {
    const buckets: { title: string; start: Date; end: Date; ingresos: any[]; gastos: any[]; inversiones: any[]; aportes: any[]; pagosDeuda: any[]; }[] = weeks.map(w => ({ title: w.label, start: w.start, end: w.end, ingresos: [], gastos: [], inversiones: [], aportes: [], pagosDeuda: [] }));

    const placeItem = (item: any, collection: any[][]) => {
      const idx = this.placeInWeek(new Date(item.fecha || item.createdAt), weeks);
      if (idx >= 0) {
        collection[idx].push(item);
      }
    };

    ingresos.forEach(i => {
      if (!i.fijo || !i.frecuencia) {
        placeItem(i, buckets.map(b => b.ingresos));
      } else {
        const dates = this.projectRecurringDates(i.fecha, weeks, i.frecuencia as any);
        dates.forEach(d => placeItem({ ...i, fecha: d, __projection: true, id: `proj_ing_${i.id}_${d.toISOString().slice(0, 10)}` }, buckets.map(b => b.ingresos)));
      }
    });

    gastos.forEach(g => {
      if (!g.fijo || !g.frecuencia) {
        placeItem(g, buckets.map(b => b.gastos));
      } else {
        const dates = this.projectRecurringDates(g.fecha, weeks, g.frecuencia as any);
        dates.forEach(d => placeItem({ ...g, fecha: d, __projection: true, id: `proj_gto_${g.id}_${d.toISOString().slice(0, 10)}` }, buckets.map(b => b.gastos)));
      }
    });

    fondos.forEach(f => {
      // 1. SOLO proyectar aportes fijos.
      if (f.fijo && f.aporteFijo && f.aporteFijo > 0 && f.frecuencia) {
        const projectedDates = this.projectRecurringDates(f.fechaInicio, weeks, f.frecuencia as any);
        projectedDates.forEach(d => {
          placeItem({
            monto: f.aporteFijo,
            fecha: d,
            objetivo: f.objetivo,
            motivo: `Aporte fijo a ${f.objetivo}`,
            __projection: true,
            id: `proj_apo_${f.id}_${d.toISOString().slice(0, 10)}`
          }, buckets.map(b => b.aportes));
        });
      }
      
      // 2. SOLO añadir movimientos REALES que NO sean "Aporte inicial".
      const movimientosDeFlujoReal = f.movimientos.filter(m => m.motivo !== 'Aporte inicial');
      movimientosDeFlujoReal.forEach(m => {
          placeItem({ ...m, objetivo: f.objetivo, tipo: 'aporte' }, buckets.map(b => b.aportes));
      });
    });
    
    deudas.forEach(d => {
      d.payments.forEach(p => placeItem({ ...p, title: d.title, tipo: 'pagoDeuda' }, buckets.map(b => b.pagosDeuda)));
      if (d.installmentAmount && d.installmentAmount > 0 && d.firstDueDate && d.frequency) {
        const dates = this.projectRecurringDates(d.firstDueDate, weeks, d.frequency as any);
        dates.forEach(due => {
          const ymd = due.toISOString().slice(0, 10);
          if (!d.payments.some(p => new Date(p.fecha).toISOString().slice(0, 10) === ymd)) {
            placeItem({ monto: d.installmentAmount, fecha: due, title: d.title, tipo: 'pagoDeuda', __projection: true, id: `proj_deu_${d.id}_${ymd}` }, buckets.map(b => b.pagosDeuda));
          }
        });
      }
    });

    inversiones.forEach(inv => placeItem(inv, buckets.map(b => b.inversiones)));
    
    const sum = (arr: any[], field = 'monto') => arr.reduce((a, x) => a + (Number(x[field]) || 0), 0);
    const sumInversiones = (arr: any[]) => arr.reduce((a, x) => a + (Number(x.precioCompra * x.cantidad) || 0), 0);
    
    const result = buckets.map((b) => {
      const totals = {
        ingresos: sum(b.ingresos),
        gastos: sum(b.gastos),
        ahorros: sum(b.aportes),
        inversiones: sumInversiones(b.inversiones),
        pagosDeuda: sum(b.pagosDeuda),
        balance: 0,
      };
      totals.balance = totals.ingresos - totals.gastos - totals.ahorros - totals.inversiones - totals.pagosDeuda;
      return { ...b, totals };
    });

    const totalsAll = result.reduce((acc, r) => {
      Object.keys(r.totals).forEach(key => { if (key !== 'balance') acc[key] = (acc[key] || 0) + r.totals[key]; });
      return acc;
    }, { ingresos: 0, gastos: 0, ahorros: 0, inversiones: 0, pagosDeuda: 0 });

    return { weeks: result, totals: totalsAll };
  }
}