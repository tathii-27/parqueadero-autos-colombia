import React, { useState } from 'react';
import { 
  Car, 
  Bike, 
  Truck, 
  Search, 
  QrCode, 
  Printer, 
  CheckCircle2, 
  Clock, 
  DollarSign, 
  CreditCard, 
  Banknote, 
  Smartphone, 
  AlertTriangle, 
  ShieldCheck, 
  Check, 
  FileText,
  MapPin,
  Calendar,
  Sparkles,
  ArrowRight,
  Filter,
  RefreshCw,
  Hash
} from 'lucide-react';

/* =========================================================================
   PANTALLA 1: REGISTRO DE ENTRADA DE VEHÍCULOS
   ========================================================================= */
export const Screen1EntradaMockup: React.FC = () => {
  return (
    <div className="bg-slate-900 text-slate-100 rounded-xl p-6 shadow-2xl border border-slate-800 font-sans">
      {/* Top Header of the Device Mockup */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Car className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                FRAME 01 · CASETA NORTE
              </span>
              <span className="text-xs text-slate-400">Operador: Carlos Mendoza (Turno Mañana)</span>
            </div>
            <h3 className="text-xl font-bold text-white tracking-tight">
              Registro de Ingreso Vehicular
            </h3>
          </div>
        </div>
        <div className="text-right font-mono text-xs text-slate-400">
          <div className="text-emerald-400 font-bold text-sm">SISTEMA EN LÍNEA · RUNT VINCULADO</div>
          <div>23 Octubre 2026 · 15:30:12</div>
        </div>
      </div>

      {/* Main Grid: Form Inputs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Form: Inputs */}
        <div className="lg:col-span-7 space-y-5">
          {/* Plate Input with Colombian RUNT Stying */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Placa del Vehículo (Formato Oficial RUNT):
            </label>
            <div className="flex gap-3">
              <div className="relative flex-1">
                <input
                  type="text"
                  readOnly
                  value="HNE-612"
                  className="w-full bg-slate-950 border-2 border-emerald-500/80 rounded-lg px-4 py-3.5 text-2xl font-black font-mono tracking-widest text-emerald-400 focus:outline-none"
                />
                <span className="absolute right-3 top-3 text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded">
                  COLOMBIA
                </span>
              </div>
              <div className="bg-slate-800/80 border border-slate-700 rounded-lg px-4 py-2 flex flex-col justify-center">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Modalidad</span>
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Rotativo
                </span>
              </div>
            </div>
            <p className="text-[11px] text-slate-400 mt-1.5 flex items-center gap-1">
              <Check className="w-3.5 h-3.5 text-emerald-400" /> Sintaxis válida. No presenta orden de embargo ni registros previos activos en patio (RN-01).
            </p>
          </div>

          {/* Vehicle Type Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Categoría y Tarifa Base:
            </label>
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 rounded-lg border-2 border-emerald-500 bg-emerald-500/10 text-white cursor-pointer">
                <div className="flex items-center justify-between mb-1">
                  <Car className="w-5 h-5 text-emerald-400" />
                  <span className="text-[10px] font-bold bg-emerald-500 text-slate-950 px-1.5 py-0.5 rounded">
                    Seleccionado
                  </span>
                </div>
                <div className="font-bold text-sm">Automóvil / SUV</div>
                <div className="text-xs text-emerald-400 font-mono font-semibold">$4.500 COP / hora</div>
              </div>

              <div className="p-3 rounded-lg border border-slate-700 bg-slate-800/50 text-slate-400">
                <div className="flex items-center justify-between mb-1">
                  <Bike className="w-5 h-5 text-slate-400" />
                  <span className="text-[10px] text-slate-500">Zona B</span>
                </div>
                <div className="font-bold text-sm text-slate-200">Motocicleta</div>
                <div className="text-xs text-slate-400 font-mono">$2.200 COP / hora</div>
              </div>

              <div className="p-3 rounded-lg border border-slate-700 bg-slate-800/50 text-slate-400">
                <div className="flex items-center justify-between mb-1">
                  <Truck className="w-5 h-5 text-slate-400" />
                  <span className="text-[10px] text-slate-500">Zona C</span>
                </div>
                <div className="font-bold text-sm text-slate-200">Camioneta / Pesado</div>
                <div className="text-xs text-slate-400 font-mono">$9.000 COP / hora</div>
              </div>
            </div>
          </div>

          {/* Cell Assignment Selector */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Celda Asignada (Zona A - Automóviles):
              </label>
              <span className="text-xs text-emerald-400 font-semibold">154 Disponibles</span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              <div className="p-2.5 rounded-lg border-2 border-emerald-500 bg-emerald-500/20 text-center cursor-pointer">
                <div className="text-sm font-black font-mono text-emerald-300">CELDA A-14</div>
                <div className="text-[10px] text-emerald-400 font-semibold">Sugerida · Libre</div>
              </div>
              <div className="p-2.5 rounded-lg border border-slate-700 bg-slate-800/60 text-center">
                <div className="text-sm font-bold font-mono text-slate-200">A-15</div>
                <div className="text-[10px] text-slate-400">Libre</div>
              </div>
              <div className="p-2.5 rounded-lg border border-red-500/30 bg-red-500/10 text-center opacity-60">
                <div className="text-sm font-bold font-mono text-red-400">A-16</div>
                <div className="text-[10px] text-red-400">Ocupada</div>
              </div>
              <div className="p-2.5 rounded-lg border border-slate-700 bg-slate-800/60 text-center">
                <div className="text-sm font-bold font-mono text-slate-200">A-17</div>
                <div className="text-[10px] text-slate-400">Libre</div>
              </div>
            </div>
          </div>

          {/* Physical Inspection Checklist */}
          <div className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-lg space-y-2">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5" /> Inspección Física Inicial de Custodia:
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs text-slate-300">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded accent-emerald-500" readOnly />
                <span>Luces e integridad exterior OK</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded accent-emerald-500" readOnly />
                <span>Rayón previo en puerta lateral</span>
              </label>
            </div>
            <input
              type="text"
              readOnly
              value="Vehículo ingresa con paquete en maletero declarado por conductor"
              className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-slate-300 mt-1"
            />
          </div>
        </div>

        {/* Right Summary & Action */}
        <div className="lg:col-span-5 bg-slate-950/80 border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <div className="text-xs font-mono font-bold text-slate-400 uppercase mb-3 pb-2 border-b border-slate-800">
              Resumen de Operación · Pre-Ticket
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-800/80">
                <span className="text-slate-400">Placa Registrada:</span>
                <span className="font-mono font-bold text-white text-sm">HNE-612</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/80">
                <span className="text-slate-400">Tipo de Vehículo:</span>
                <span className="text-slate-200 font-semibold">Automóvil Particular</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/80">
                <span className="text-slate-400">Ubicación Asignada:</span>
                <span className="font-mono font-bold text-emerald-400">Pabellón Central - Celda A-14</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/80">
                <span className="text-slate-400">Periodo de Gracia:</span>
                <span className="text-emerald-400 font-semibold">15 minutos ($0 COP)</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Consecutivo a emitir:</span>
                <span className="font-mono font-bold text-amber-400">PAC-2026-1042</span>
              </div>
            </div>

            <div className="mt-5 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-400 mt-0.5" />
              <span>Al confirmar, la talanquera de entrada se abrirá y el tiquete térmico con código QR se imprimirá automáticamente.</span>
            </div>
          </div>

          <button className="mt-6 w-full py-4 px-4 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-sm rounded-lg flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 cursor-pointer">
            <Check className="w-5 h-5" />
            <span>CONFIRMAR INGRESO Y EMITIR TICKET (ENTER)</span>
          </button>
        </div>
      </div>
    </div>
  );
};

/* =========================================================================
   PANTALLA 2: CONFIRMACIÓN DE INGRESO Y EMISIÓN DE TICKET
   ========================================================================= */
export const Screen2TicketMockup: React.FC = () => {
  return (
    <div className="bg-slate-900 text-slate-100 rounded-xl p-6 shadow-2xl border border-slate-800 font-sans">
      <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-violet-500/20 border border-violet-500/30 flex items-center justify-center text-violet-400">
            <Printer className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-violet-500/10 text-violet-400 border border-violet-500/30">
                FRAME 02 · TERMINAL POS ESC/POS
              </span>
              <span className="text-xs text-slate-400">Formato Estándar 80mm Térmico</span>
            </div>
            <h3 className="text-xl font-bold text-white tracking-tight">
              Confirmación de Ingreso y Emisión de Tiquete
            </h3>
          </div>
        </div>
        <div className="text-right font-mono text-xs text-emerald-400 font-bold flex items-center gap-1.5">
          <CheckCircle2 className="w-4 h-4" /> TALANQUERA DE ENTRADA HABILITADA
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left: Thermal Ticket Physical Simulation */}
        <div className="lg:col-span-5 flex justify-center">
          <div className="w-72 bg-white text-slate-900 rounded-md p-5 shadow-2xl border-t-8 border-emerald-500 font-mono text-xs space-y-3 relative">
            {/* Cut marks */}
            <div className="text-center pb-2 border-b border-dashed border-slate-400">
              <div className="font-black text-sm tracking-tight">AUTOS COLOMBIA S.A.S.</div>
              <div className="text-[10px] text-slate-600">NIT 900.842.125-4 · Régimen Común</div>
              <div className="text-[10px] text-slate-500">Calle 50 # 45-20 · Medellín, Antioquia</div>
              <div className="text-[10px] text-slate-500">PBX: (604) 444-8920</div>
            </div>

            <div className="text-center py-1 bg-slate-100 rounded">
              <span className="text-[10px] font-bold text-slate-500">TIQUETE DE INGRESO VEHICULAR</span>
              <div className="font-black text-base text-slate-900 tracking-wider">PAC-2026-1042</div>
            </div>

            <div className="space-y-1.5 text-[11px] pt-1">
              <div className="flex justify-between border-b border-slate-200 pb-1">
                <span className="text-slate-500">PLACA:</span>
                <span className="font-black text-base bg-yellow-300 text-slate-950 px-2 py-0.5 rounded">HNE 612</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">CATEGORÍA:</span>
                <span className="font-bold">Automóvil Particular</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">CELDA ASIGNADA:</span>
                <span className="font-bold text-emerald-700">A-14 (Zona A)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">FECHA ENTRADA:</span>
                <span className="font-bold">23/10/2026</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">HORA INGRESO:</span>
                <span className="font-bold">15:30:12</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">TARIFA HORA:</span>
                <span className="font-bold">$4.500 COP</span>
              </div>
            </div>

            {/* QR Code */}
            <div className="pt-2 pb-1 border-t border-b border-dashed border-slate-300 flex flex-col items-center">
              <div className="p-2 bg-slate-900 text-white rounded">
                <QrCode className="w-20 h-20" />
              </div>
              <span className="text-[9px] text-slate-500 mt-1">Presente este código en caseta de salida</span>
            </div>

            {/* Legal terms Ley 1480 */}
            <div className="text-[8px] text-slate-500 leading-tight text-justify">
              Contrato de depósito mercantil conforme a la Ley 1480 de 2011. Gracia: 15 minutos sin costo. Parqueadero amparado por Póliza de Responsabilidad Civil Seguros Bolívar No. 44021948.
            </div>
          </div>
        </div>

        {/* Right: Actions and Integrations */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-4 bg-slate-950 rounded-lg border border-slate-800 space-y-3">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Ingreso Registrado con Éxito en Base de Datos
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              El automotor <strong>HNE-612</strong> quedó asociado a la celda <strong>A-14</strong> en el servidor central. El reloj de permanencia y auditoría fiscal comenzaron a contar desde las 15:30:12.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button className="py-3 px-4 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs rounded-lg flex items-center justify-center gap-2 cursor-pointer shadow">
              <Printer className="w-4 h-4" />
              <span>Imprimir Tiquete Térmico (Ctrl+P)</span>
            </button>
            <button className="py-3 px-4 bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs rounded-lg flex items-center justify-center gap-2 cursor-pointer border border-slate-700">
              <Smartphone className="w-4 h-4" />
              <span>Enviar por WhatsApp / SMS</span>
            </button>
          </div>

          <div className="p-3 bg-slate-950/60 rounded border border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Siguiente acción recomendada:</span>
            <span className="text-violet-400 font-semibold flex items-center gap-1 cursor-pointer">
              Registrar nuevo ingreso <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

/* =========================================================================
   PANTALLA 3: BÚSQUEDA Y MONITOREO DE VEHÍCULOS ACTIVOS
   ========================================================================= */
export const Screen3BusquedaMockup: React.FC = () => {
  return (
    <div className="bg-slate-900 text-slate-100 rounded-xl p-6 shadow-2xl border border-slate-800 font-sans">
      <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
            <Search className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/30">
                FRAME 03 · PATIO Y CONTROL CENTRAL
              </span>
              <span className="text-xs text-slate-400">Monitoreo de Aforo y Búsqueda Predictiva</span>
            </div>
            <h3 className="text-xl font-bold text-white tracking-tight">
              Búsqueda y Monitoreo de Vehículos Activos
            </h3>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700">
            <RefreshCw className="w-3.5 h-3.5 text-emerald-400 animate-spin" />
            <span className="text-slate-300 font-mono">Actualizado hace 2 seg</span>
          </div>
        </div>
      </div>

      {/* KPI Cards: Aforo */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        <div className="p-3.5 bg-slate-950/80 border border-slate-800 rounded-lg">
          <div className="text-[10px] uppercase font-bold text-slate-400">Celdas Libres</div>
          <div className="text-2xl font-black font-mono text-emerald-400 mt-1">154</div>
          <div className="text-[10px] text-emerald-500/80">60.4% capacidad</div>
        </div>
        <div className="p-3.5 bg-slate-950/80 border border-slate-800 rounded-lg">
          <div className="text-[10px] uppercase font-bold text-slate-400">Vehículos en Patio</div>
          <div className="text-2xl font-black font-mono text-blue-400 mt-1">89</div>
          <div className="text-[10px] text-blue-400">34.9% ocupado</div>
        </div>
        <div className="p-3.5 bg-slate-950/80 border border-slate-800 rounded-lg">
          <div className="text-[10px] uppercase font-bold text-slate-400">Abonados Mensuales</div>
          <div className="text-2xl font-black font-mono text-violet-400 mt-1">12</div>
          <div className="text-[10px] text-violet-400">Tarifa convenida</div>
        </div>
        <div className="p-3.5 bg-slate-950/80 border border-slate-800 rounded-lg">
          <div className="text-[10px] uppercase font-bold text-slate-400">Recaudo Estimado</div>
          <div className="text-2xl font-black font-mono text-amber-400 mt-1">$412.500</div>
          <div className="text-[10px] text-amber-400">Turno en curso</div>
        </div>
      </div>

      {/* Search Input and Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            readOnly
            value="Filtrando por: HNE"
            className="w-full bg-slate-950 border border-blue-500/80 rounded-lg pl-9 pr-4 py-2 text-xs font-mono text-white focus:outline-none"
          />
        </div>
        <div className="flex gap-2">
          <button className="px-3 py-1.5 bg-blue-600 text-white text-xs font-bold rounded-lg flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5" /> Todos (89)
          </button>
          <button className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-lg">
            Autos (52)
          </button>
          <button className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-lg">
            Motos (31)
          </button>
        </div>
      </div>

      {/* Live Active Vehicles Table */}
      <div className="overflow-hidden border border-slate-800 rounded-lg bg-slate-950">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-800/80 text-slate-400 font-mono uppercase text-[10px]">
            <tr>
              <th className="py-2.5 px-3">Placa / Tipo</th>
              <th className="py-2.5 px-3">Ticket</th>
              <th className="py-2.5 px-3">Celda</th>
              <th className="py-2.5 px-3">Hora Ingreso</th>
              <th className="py-2.5 px-3">Tiempo Activo</th>
              <th className="py-2.5 px-3">Valor Estimado</th>
              <th className="py-2.5 px-3 text-right">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-mono text-slate-200">
            <tr className="bg-blue-500/10 hover:bg-blue-500/20">
              <td className="py-2.5 px-3">
                <span className="font-bold text-yellow-300 bg-slate-900 px-2 py-0.5 rounded border border-yellow-500/40">
                  HNE-612
                </span>
                <span className="ml-2 text-[10px] text-slate-400">Automóvil</span>
              </td>
              <td className="py-2.5 px-3 text-slate-300">PAC-2026-1042</td>
              <td className="py-2.5 px-3 font-bold text-emerald-400">A-14</td>
              <td className="py-2.5 px-3 text-slate-300">15:30:12</td>
              <td className="py-2.5 px-3 text-amber-400 font-bold flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> 12 min (Gracia)
              </td>
              <td className="py-2.5 px-3 font-bold text-emerald-400">$0 COP</td>
              <td className="py-2.5 px-3 text-right">
                <button className="px-2.5 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded text-[11px] font-bold cursor-pointer">
                  Liquidar Salida
                </button>
              </td>
            </tr>
            <tr className="hover:bg-slate-800/40">
              <td className="py-2.5 px-3">
                <span className="font-bold text-yellow-300 bg-slate-900 px-2 py-0.5 rounded border border-yellow-500/40">
                  BKG-401
                </span>
                <span className="ml-2 text-[10px] text-slate-400">Automóvil</span>
              </td>
              <td className="py-2.5 px-3 text-slate-300">PAC-2026-1039</td>
              <td className="py-2.5 px-3 font-bold text-emerald-400">A-08</td>
              <td className="py-2.5 px-3 text-slate-300">14:15:00</td>
              <td className="py-2.5 px-3 text-slate-300">1h 17 min</td>
              <td className="py-2.5 px-3 font-bold text-white">$9.000 COP</td>
              <td className="py-2.5 px-3 text-right">
                <button className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[11px]">
                  Ver Detalle
                </button>
              </td>
            </tr>
            <tr className="hover:bg-slate-800/40">
              <td className="py-2.5 px-3">
                <span className="font-bold text-yellow-300 bg-slate-900 px-2 py-0.5 rounded border border-yellow-500/40">
                  UYS-98D
                </span>
                <span className="ml-2 text-[10px] text-slate-400">Moto</span>
              </td>
              <td className="py-2.5 px-3 text-slate-300">PAC-2026-1035</td>
              <td className="py-2.5 px-3 font-bold text-emerald-400">B-03</td>
              <td className="py-2.5 px-3 text-slate-300">13:40:00</td>
              <td className="py-2.5 px-3 text-slate-300">1h 52 min</td>
              <td className="py-2.5 px-3 font-bold text-white">$4.400 COP</td>
              <td className="py-2.5 px-3 text-right">
                <button className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[11px]">
                  Ver Detalle
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

/* =========================================================================
   PANTALLA 4: REGISTRO DE SALIDA Y LIQUIDACIÓN DEL COBRO
   ========================================================================= */
export const Screen4SalidaCobroMockup: React.FC = () => {
  return (
    <div className="bg-slate-900 text-slate-100 rounded-xl p-6 shadow-2xl border border-slate-800 font-sans">
      <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30">
                FRAME 04 · CASETA DE SALIDA Y CAJA
              </span>
              <span className="text-xs text-slate-400">Cálculo de Permanencia y Recaudo Multicanal</span>
            </div>
            <h3 className="text-xl font-bold text-white tracking-tight">
              Registro de Salida y Liquidación del Cobro
            </h3>
          </div>
        </div>
        <div className="text-right font-mono text-xs">
          <div className="text-amber-400 font-bold">ESTACIÓN 02 - SALIDA SUR</div>
          <div className="text-slate-400">Cajero: Diana Restrepo</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Calculation Breakdown */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-slate-400 uppercase">Vehículo a Liquidar</span>
                <div className="text-xl font-black font-mono text-yellow-300">HNE-612 (Automóvil)</div>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-mono text-slate-400 uppercase">Tiquete Origen</span>
                <div className="text-sm font-bold font-mono text-slate-200">PAC-2026-1042</div>
              </div>
            </div>

            {/* Time Details Grid */}
            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800 text-xs font-mono">
              <div className="bg-slate-900 p-2.5 rounded">
                <div className="text-slate-400 text-[10px]">Ingreso Registrado</div>
                <div className="font-bold text-slate-200">14:05:00</div>
              </div>
              <div className="bg-slate-900 p-2.5 rounded">
                <div className="text-slate-400 text-[10px]">Salida Actual</div>
                <div className="font-bold text-slate-200">16:22:15</div>
              </div>
              <div className="bg-slate-900 p-2.5 rounded">
                <div className="text-slate-400 text-[10px]">Tiempo Total</div>
                <div className="font-bold text-amber-400">2h 17 min</div>
              </div>
            </div>

            {/* Tariff Breakdown */}
            <div className="bg-slate-900/60 p-3 rounded text-xs space-y-1.5 font-mono">
              <div className="flex justify-between text-slate-400">
                <span>Horas completas (2 x $4.500):</span>
                <span>$9.000 COP</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Fracción &gt; 15 min (1 x $4.500):</span>
                <span>$4.500 COP</span>
              </div>
              <div className="flex justify-between text-emerald-400 pt-1 border-t border-slate-800">
                <span>Periodo de gracia evaluado:</span>
                <span>Superado (&gt; 15 min)</span>
              </div>
              <div className="flex justify-between text-white font-bold text-base pt-1">
                <span>TOTAL A COBRAR:</span>
                <span className="text-emerald-400 font-black">$13.500 COP</span>
              </div>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Seleccione Medio de Pago:
            </label>
            <div className="grid grid-cols-4 gap-2">
              <div className="p-2.5 rounded-lg border-2 border-emerald-500 bg-emerald-500/20 text-center cursor-pointer">
                <Banknote className="w-5 h-5 mx-auto text-emerald-400 mb-1" />
                <div className="text-xs font-bold text-white">Efectivo</div>
              </div>
              <div className="p-2.5 rounded-lg border border-slate-700 bg-slate-800/60 text-center">
                <Smartphone className="w-5 h-5 mx-auto text-purple-400 mb-1" />
                <div className="text-xs font-semibold text-slate-300">Nequi</div>
              </div>
              <div className="p-2.5 rounded-lg border border-slate-700 bg-slate-800/60 text-center">
                <Smartphone className="w-5 h-5 mx-auto text-red-400 mb-1" />
                <div className="text-xs font-semibold text-slate-300">Daviplata</div>
              </div>
              <div className="p-2.5 rounded-lg border border-slate-700 bg-slate-800/60 text-center">
                <CreditCard className="w-5 h-5 mx-auto text-blue-400 mb-1" />
                <div className="text-xs font-semibold text-slate-300">Tarjeta</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Cashier Cash Calculator */}
        <div className="lg:col-span-5 bg-slate-950 p-5 rounded-xl border border-slate-800 flex flex-col justify-between">
          <div className="space-y-4">
            <span className="text-xs font-mono font-bold text-slate-400 uppercase block pb-2 border-b border-slate-800">
              Calculadora de Cambio (Devuelta)
            </span>

            <div>
              <label className="text-[11px] text-slate-400 font-medium block mb-1">
                Monto Recibido del Cliente (Efectivo):
              </label>
              <div className="relative">
                <span className="absolute left-3 top-3 text-slate-400 font-mono text-sm">$</span>
                <input
                  type="text"
                  readOnly
                  value="20.000"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-8 pr-4 py-2.5 text-lg font-black font-mono text-white focus:outline-none"
                />
              </div>
            </div>

            <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
              <span className="text-[10px] text-emerald-400 uppercase font-bold block">
                Devuelta Exacta al Conductor:
              </span>
              <div className="text-2xl font-black font-mono text-emerald-400 mt-0.5">
                $6.500 COP
              </div>
              <span className="text-[10px] text-slate-400">
                1 billete de $5.000 + 1 moneda de $1.000 + 1 moneda de $500
              </span>
            </div>

            <div className="p-2.5 bg-amber-500/10 border border-amber-500/20 rounded text-[11px] text-amber-300 flex items-start gap-1.5">
              <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5" />
              <span>Verificación de novedades: El vehículo no reportó daños nuevos en salida.</span>
            </div>
          </div>

          <button className="mt-5 w-full py-3.5 px-4 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs rounded-lg flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-500/20">
            <Check className="w-4 h-4" />
            <span>CONFIRMAR PAGO Y HABILITAR SALIDA (F2)</span>
          </button>
        </div>
      </div>
    </div>
  );
};

/* =========================================================================
   PANTALLA 5: CONFIRMACIÓN DE SALIDA Y RECIBO FISCAL DE CAJA
   ========================================================================= */
export const Screen5ConfirmacionSalidaMockup: React.FC = () => {
  return (
    <div className="bg-slate-900 text-slate-100 rounded-xl p-6 shadow-2xl border border-slate-800 font-sans">
      <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                FRAME 05 · SALIDA CONFIRMADA
              </span>
              <span className="text-xs text-slate-400">Transacción Asentada y Celda Liberada</span>
            </div>
            <h3 className="text-xl font-bold text-white tracking-tight">
              Confirmación de Salida y Recibo Fiscal de Caja
            </h3>
          </div>
        </div>
        <div className="text-right font-mono text-xs text-emerald-400 font-bold">
          TALANQUERA SUR ABIERTA
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left: Barrier Opened & Notification */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-5 bg-emerald-500/10 border-2 border-emerald-500 rounded-xl text-center space-y-2">
            <div className="w-12 h-12 bg-emerald-500 text-slate-950 rounded-full flex items-center justify-center mx-auto font-black shadow-lg">
              <Check className="w-7 h-7" />
            </div>
            <h4 className="text-lg font-black text-white">¡Salida Completada con Éxito!</h4>
            <p className="text-xs text-emerald-300 max-w-md mx-auto">
              El vehículo <span className="font-mono font-bold text-white bg-slate-900 px-2 py-0.5 rounded">HNE-612</span> ha sido autorizado para salir del recinto. La celda ha sido liberada en tiempo real.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs font-mono">
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
              <span className="text-slate-400 text-[10px] block">Celda Desocupada:</span>
              <span className="text-base font-bold text-emerald-400">CELDA A-14</span>
              <div className="text-[10px] text-emerald-500 mt-1 flex items-center gap-1">
                <Check className="w-3 h-3" /> Estado: DISPONIBLE
              </div>
            </div>
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
              <span className="text-slate-400 text-[10px] block">Nuevo Aforo General:</span>
              <span className="text-base font-bold text-white">155 Plazas Libres</span>
              <div className="text-[10px] text-blue-400 mt-1">
                60.8% capacidad disponible
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button className="flex-1 py-3 px-4 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs rounded-lg flex items-center justify-center gap-2 cursor-pointer shadow">
              <Printer className="w-4 h-4" />
              <span>Imprimir Recibo de Caja (REC-008920)</span>
            </button>
            <button className="py-3 px-4 bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs rounded-lg flex items-center justify-center gap-2 cursor-pointer border border-slate-700">
              <FileText className="w-4 h-4" />
              <span>Generar Factura Electrónica DIAN</span>
            </button>
          </div>
        </div>

        {/* Right: Fiscal Receipt Preview */}
        <div className="lg:col-span-5 flex justify-center">
          <div className="w-72 bg-white text-slate-900 rounded-md p-5 shadow-2xl border-t-8 border-slate-900 font-mono text-xs space-y-2.5">
            <div className="text-center pb-2 border-b border-dashed border-slate-400">
              <div className="font-black text-sm">AUTOS COLOMBIA S.A.S.</div>
              <div className="text-[10px] text-slate-600">NIT 900.842.125-4</div>
              <div className="text-[10px] font-bold text-slate-900 mt-1">RECIBO DE CAJA Y PAGO</div>
              <div className="text-xs font-black text-slate-900">No. REC-008920</div>
            </div>

            <div className="space-y-1 text-[11px]">
              <div className="flex justify-between">
                <span className="text-slate-500">Fecha y Hora:</span>
                <span>23/10/2026 16:22</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Placa Vehículo:</span>
                <span className="font-bold">HNE-612</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Tiempo Cobrado:</span>
                <span>3 horas</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Medio de Pago:</span>
                <span className="font-bold">Efectivo</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Cajero:</span>
                <span>Diana Restrepo</span>
              </div>
            </div>

            <div className="pt-2 border-t border-dashed border-slate-300 space-y-1 text-[11px]">
              <div className="flex justify-between">
                <span className="text-slate-500">Subtotal:</span>
                <span>$11.345 COP</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">IVA (19%):</span>
                <span>$2.155 COP</span>
              </div>
              <div className="flex justify-between font-black text-sm pt-1 border-t border-slate-200">
                <span>TOTAL PAGADO:</span>
                <span>$13.500 COP</span>
              </div>
              <div className="flex justify-between text-slate-600 text-[10px]">
                <span>Monto Recibido:</span>
                <span>$20.000 COP</span>
              </div>
              <div className="flex justify-between text-slate-600 text-[10px]">
                <span>Cambio Entregado:</span>
                <span>$6.500 COP</span>
              </div>
            </div>

            <div className="text-[8px] text-center text-slate-500 pt-2 border-t border-dashed border-slate-300">
              ¡Gracias por preferir a Autos Colombia!<br/>Conserve este comprobante para salir del establecimiento.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
