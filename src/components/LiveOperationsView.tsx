import React, { useState, useEffect } from 'react';
import { useParking } from '../context/ParkingContext';
import { ColombianPlate } from './ColombianPlate';
import { 
  calculateDuration, 
  formatCOP, 
  formatDateTime, 
  getVehicleTypeLabel 
} from '../utils/formatters';
import { VehicleEntry } from '../types/parking';
import { 
  AlertTriangle, 
  ArrowUpRight, 
  Car, 
  Clock, 
  LogOut, 
  Plus, 
  Receipt, 
  Search, 
  ShieldCheck, 
  Users 
} from 'lucide-react';

interface LiveOperationsViewProps {
  onOpenNewEntry: () => void;
  onSelectExit: (entry: VehicleEntry) => void;
  onViewTicket: (ticketNumber: string, plate: string) => void;
  onOpenIncident: (plate: string, cellId?: string) => void;
}

export const LiveOperationsView: React.FC<LiveOperationsViewProps> = ({
  onOpenNewEntry,
  onSelectExit,
  onViewTicket,
  onOpenIncident,
}) => {
  const { 
    cells, 
    activeEntries, 
    completedEntries, 
    clients, 
    payments, 
    incidents 
  } = useParking();

  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<'TODOS' | 'OCASIONAL' | 'MENSUALIDAD'>('TODOS');
  const [currentTimeTick, setCurrentTimeTick] = useState(Date.now());

  // Update live elapsed time every 30 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTimeTick(Date.now());
    }, 30000);
    return () => clearInterval(timer);
  }, []);

  // Calculate metrics
  const totalCells = cells.length;
  const occupiedCells = cells.filter(c => c.status === 'OCUPADA').length;
  const availableCellsCount = cells.filter(c => c.status === 'DISPONIBLE').length;
  const reservedCellsCount = cells.filter(c => c.status === 'RESERVADA_MENSUAL').length;

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const todayPayments = payments.filter(p => new Date(p.date) >= todayStart);
  const totalCollectedToday = todayPayments.reduce((acc, curr) => acc + curr.amount, 0);
  const activeSubscribersCount = clients.filter(c => c.subscription.status === 'ACTIVA').length;

  // Filtered active vehicles
  const filteredEntries = activeEntries.filter(entry => {
    const query = search.toUpperCase().trim().replace(/[^A-Z0-9]/g, '');
    const matchesQuery = 
      !query ||
      entry.plate.toUpperCase().includes(query) ||
      entry.ticketNumber.toUpperCase().includes(query) ||
      entry.cellId.toUpperCase().includes(query) ||
      (entry.clientName && entry.clientName.toUpperCase().includes(search.toUpperCase()));

    const matchesFilter = 
      filterType === 'TODOS' || entry.serviceType === filterType;

    return matchesQuery && matchesFilter;
  });

  return (
    <div className="space-y-6">
      {/* Visual Facility Showcase Banner */}
      <div className="relative rounded-lg overflow-hidden border border-slate-200 bg-slate-900 text-white min-h-[160px] flex items-center">
        <img
          src="/src/assets/images/parking_autos_colombia_1792617811231.jpg"
          alt="Parqueadero Autos Colombia"
          className="absolute inset-0 w-full h-full object-cover opacity-25"
          referrerPolicy="no-referrer"
        />
        <div className="relative z-10 p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4 w-full">
          <div>
            <div className="text-xs font-semibold tracking-wider text-amber-400 uppercase">
              Operaciones en Tiempo Real · Bahías de Acceso
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white mt-1">
              Parqueadero Autos Colombia
            </h1>
            <p className="mt-1 text-xs md:text-sm text-slate-300 max-w-2xl">
              Control sistematizado de entrada y salida de automotores, verificación de mensualidades, liquidación de fracciones y gestión integral de celdas.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onOpenNewEntry}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-md transition-colors shadow-md cursor-pointer whitespace-nowrap"
            >
              <Plus className="w-4 h-4 text-slate-950" />
              <span>Registrar Nueva Entrada</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-white p-4 rounded-lg border border-slate-200 space-y-1">
          <div className="text-xs font-medium text-slate-500 flex items-center justify-between">
            <span>Ocupación en Patio</span>
            <Car className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-bold font-mono tracking-tight text-slate-900 tabular-nums">
            {activeEntries.length} <span className="text-xs font-normal text-slate-500">/ {totalCells} celdas</span>
          </div>
          <div className="text-[11px] text-slate-500">
            {Math.round((occupiedCells / totalCells) * 100)}% de ocupación actual
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white p-4 rounded-lg border border-slate-200 space-y-1">
          <div className="text-xs font-medium text-slate-500 flex items-center justify-between">
            <span>Celdas Libres</span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold font-mono tracking-tight text-emerald-700 tabular-nums">
            {availableCellsCount}
          </div>
          <div className="text-[11px] text-slate-500">
            + {reservedCellsCount} reservadas a mensualistas
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white p-4 rounded-lg border border-slate-200 space-y-1">
          <div className="text-xs font-medium text-slate-500 flex items-center justify-between">
            <span>Recaudado Hoy</span>
            <Receipt className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-bold font-mono tracking-tight text-slate-900 tabular-nums">
            {formatCOP(totalCollectedToday)}
          </div>
          <div className="text-[11px] text-slate-500">
            {todayPayments.length} transacciones de caja
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-white p-4 rounded-lg border border-slate-200 space-y-1">
          <div className="text-xs font-medium text-slate-500 flex items-center justify-between">
            <span>Abonados al Día</span>
            <Users className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-bold font-mono tracking-tight text-slate-900 tabular-nums">
            {activeSubscribersCount}
          </div>
          <div className="text-[11px] text-slate-500">
            Total mensualistas registrados: {clients.length}
          </div>
        </div>
      </div>

      {/* Live Active Vehicles Table & Search */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 space-y-4">
        {/* Search & Filter Toolbar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Buscar por placa, celda, ticket o cliente..."
              className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-md focus:outline-hidden focus:ring-1 focus:ring-slate-950"
            />
          </div>

          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-md text-xs font-medium">
            <button
              onClick={() => setFilterType('TODOS')}
              className={`px-3 py-1 rounded transition-colors ${
                filterType === 'TODOS' ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Todos ({activeEntries.length})
            </button>
            <button
              onClick={() => setFilterType('OCASIONAL')}
              className={`px-3 py-1 rounded transition-colors ${
                filterType === 'OCASIONAL' ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Ocasionales
            </button>
            <button
              onClick={() => setFilterType('MENSUALIDAD')}
              className={`px-3 py-1 rounded transition-colors ${
                filterType === 'MENSUALIDAD' ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Mensualistas
            </button>
          </div>
        </div>

        {/* Table of active entries */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-semibold">
                <th className="py-2.5 px-3">Placa</th>
                <th className="py-2.5 px-3">Vehículo</th>
                <th className="py-2.5 px-3">Celda</th>
                <th className="py-2.5 px-3">Modalidad / Cliente</th>
                <th className="py-2.5 px-3">Ingreso</th>
                <th className="py-2.5 px-3">Permanencia</th>
                <th className="py-2.5 px-3">Novedades / Notas</th>
                <th className="py-2.5 px-3 text-right">Acción de Salida</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-normal">
              {filteredEntries.map(entry => {
                const duration = calculateDuration(entry.entryTime);
                const vehicleIncidents = incidents.filter(
                  i => i.plate.toUpperCase().replace(/[^A-Z0-9]/g, '') === entry.plate.toUpperCase().replace(/[^A-Z0-9]/g, '')
                );
                const hasPendingIncident = vehicleIncidents.some(i => i.status !== 'RESUELTA');

                return (
                  <tr key={entry.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-2.5 px-3 whitespace-nowrap">
                      <ColombianPlate
                        plate={entry.plate}
                        vehicleType={entry.vehicleType}
                        size="sm"
                      />
                    </td>
                    <td className="py-2.5 px-3 text-slate-800">
                      <div className="font-medium">{getVehicleTypeLabel(entry.vehicleType)}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{entry.ticketNumber}</div>
                    </td>
                    <td className="py-2.5 px-3 font-mono font-bold text-slate-900">
                      Celda {entry.cellId}
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="font-medium text-slate-900">
                        {entry.serviceType === 'MENSUALIDAD' ? (
                          <span className="text-emerald-700">Mensualidad</span>
                        ) : (
                          <span className="text-slate-600">Ocasional</span>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-500 truncate max-w-[140px]">
                        {entry.clientName || 'Cliente Ocasional'}
                      </div>
                    </td>
                    <td className="py-2.5 px-3 text-slate-600 font-mono text-[11px] whitespace-nowrap">
                      {formatDateTime(entry.entryTime)}
                    </td>
                    <td className="py-2.5 px-3 font-mono font-bold text-slate-900 whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>{duration.formattedString}</span>
                      </div>
                    </td>
                    <td className="py-2.5 px-3 max-w-xs">
                      {hasPendingIncident && (
                        <div className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200 mb-1">
                          <AlertTriangle className="w-3 h-3 text-amber-600 shrink-0" />
                          <span>Novedad activa</span>
                        </div>
                      )}
                      <div className="text-[11px] text-slate-500 truncate" title={entry.initialConditionNotes}>
                        {entry.initialConditionNotes || 'Sin notas'}
                      </div>
                    </td>
                    <td className="py-2.5 px-3 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onViewTicket(entry.ticketNumber, entry.plate)}
                          className="px-2 py-1 text-[11px] font-medium text-slate-700 hover:bg-slate-100 border border-slate-200 rounded transition-colors"
                          title="Ver Ticket de Ingreso"
                        >
                          Ticket
                        </button>
                        <button
                          onClick={() => onOpenIncident(entry.plate, entry.cellId)}
                          className="px-2 py-1 text-[11px] font-medium text-slate-700 hover:bg-slate-100 border border-slate-200 rounded transition-colors"
                          title="Reportar Novedad sobre este Vehículo"
                        >
                          + Novedad
                        </button>
                        <button
                          onClick={() => onSelectExit(entry)}
                          className="inline-flex items-center gap-1 px-3 py-1 text-[11px] font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded transition-colors cursor-pointer"
                        >
                          <LogOut className="w-3 h-3" />
                          <span>Salida</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredEntries.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-500 text-xs">
                    No se encontraron vehículos activos con los filtros aplicados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Exits Section */}
      {completedEntries.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-lg p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">
              Salidas Recientes del Turno
            </h3>
            <span className="text-xs text-slate-500">
              {completedEntries.length} salidas finalizadas
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-semibold bg-slate-50">
                  <th className="py-2 px-3">Placa</th>
                  <th className="py-2 px-3">Celda Liberada</th>
                  <th className="py-2 px-3">Hora Salida</th>
                  <th className="py-2 px-3">Permanencia</th>
                  <th className="py-2 px-3">Monto Cobrado</th>
                  <th className="py-2 px-3 text-right">Comprobante</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {completedEntries.slice(0, 5).map(entry => (
                  <tr key={entry.id} className="hover:bg-slate-50">
                    <td className="py-2 px-3 font-mono font-bold text-slate-900">
                      {entry.plate}
                    </td>
                    <td className="py-2 px-3 text-slate-600">
                      Celda {entry.cellId}
                    </td>
                    <td className="py-2 px-3 font-mono text-slate-500">
                      {entry.exitTime ? formatDateTime(entry.exitTime) : '-'}
                    </td>
                    <td className="py-2 px-3 font-mono text-slate-600">
                      {entry.totalMinutes !== undefined ? `${Math.floor(entry.totalMinutes / 60)}h ${entry.totalMinutes % 60}m` : '-'}
                    </td>
                    <td className="py-2 px-3 font-mono font-semibold text-slate-900">
                      {entry.amountDue !== undefined ? formatCOP(entry.amountDue) : '$ 0 COP'}
                    </td>
                    <td className="py-2 px-3 text-right">
                      <button
                        onClick={() => onViewTicket(entry.ticketNumber, entry.plate)}
                        className="text-indigo-600 hover:text-indigo-800 text-[11px] font-medium underline"
                      >
                        Ver Recibo
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
