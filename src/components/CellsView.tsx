import React, { useState } from 'react';
import { useParking } from '../context/ParkingContext';
import { CellStatus, CellZone, ParkingCell, VehicleType } from '../types/parking';
import { ColombianPlate } from './ColombianPlate';
import { getVehicleTypeLabel } from '../utils/formatters';
import { 
  AlertCircle, 
  Car, 
  CheckCircle2, 
  Clock, 
  Filter, 
  Layers, 
  Plus, 
  ShieldAlert, 
  Wrench, 
  X 
} from 'lucide-react';

interface CellsViewProps {
  onDirectEntryToCell: (cellId: string) => void;
  onDirectExitFromCell: (plate: string) => void;
}

export const CellsView: React.FC<CellsViewProps> = ({
  onDirectEntryToCell,
  onDirectExitFromCell,
}) => {
  const { cells, activeEntries, clients, updateCellStatus, createCell } = useParking();

  const [selectedZone, setSelectedZone] = useState<string>('TODAS');
  const [selectedStatus, setSelectedStatus] = useState<string>('TODOS');
  const [selectedCell, setSelectedCell] = useState<ParkingCell | null>(null);
  const [showNewCellModal, setShowNewCellModal] = useState(false);

  // New cell form state
  const [newCode, setNewCode] = useState('');
  const [newZone, setNewZone] = useState<CellZone>('ZONA_A_AUTOS');
  const [newType, setNewType] = useState<VehicleType>('AUTOMOVIL');

  // Filtered cells
  const filteredCells = cells.filter(cell => {
    const matchesZone = selectedZone === 'TODAS' || cell.zone === selectedZone;
    const matchesStatus = selectedStatus === 'TODOS' || cell.status === selectedStatus;
    return matchesZone && matchesStatus;
  });

  const zones: { id: CellZone; name: string; description: string }[] = [
    { id: 'ZONA_A_AUTOS', name: 'Zona A · Automóviles', description: 'Bahías amplias con demarcación amarilla para autos sedan y hatchback.' },
    { id: 'ZONA_B_MOTOS', name: 'Zona B · Motocicletas', description: 'Celdas compactas optimizadas para motos y scooters con anclaje.' },
    { id: 'ZONA_C_ESPECIALES', name: 'Zona C · Camionetas / Especiales', description: 'Celdas de gran altura y longitud para camionetas, SUVs y bicicletas.' },
  ];

  const handleCreateCell = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode.trim()) return;

    createCell({
      code: newCode.trim().toUpperCase(),
      zone: newZone,
      allowedType: newType,
      status: 'DISPONIBLE',
    });

    setNewCode('');
    setShowNewCellModal(false);
  };

  const getStatusColor = (status: CellStatus) => {
    switch (status) {
      case 'DISPONIBLE':
        return 'bg-emerald-50 border-emerald-300 text-emerald-950 hover:border-emerald-500';
      case 'OCUPADA':
        return 'bg-slate-900 border-slate-950 text-white';
      case 'RESERVADA_MENSUAL':
        return 'bg-indigo-50 border-indigo-300 text-indigo-950 hover:border-indigo-500';
      case 'MANTENIMIENTO':
        return 'bg-amber-50 border-amber-300 text-amber-950 hover:border-amber-500';
      default:
        return 'bg-slate-100 border-slate-300 text-slate-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="bg-white border border-slate-200 rounded-lg p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-semibold tracking-wider text-slate-500 uppercase">
              Control Espacial de Parqueo · Aforo
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Gestión Integral de Celdas
            </h1>
            <p className="mt-1 text-xs text-slate-600 max-w-2xl">
              Visualización topográfica del parqueadero en tiempo real. Haga clic sobre cualquier celda para ver el estado, registrar entrada directa o iniciar liquidación de salida.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setShowNewCellModal(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-md transition-colors shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Añadir Nueva Celda</span>
            </button>
          </div>
        </div>

        {/* Status Legend & Filters */}
        <div className="mt-6 pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4 text-xs">
          {/* Status filter tabs */}
          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-medium">Estado:</span>
            {['TODOS', 'DISPONIBLE', 'OCUPADA', 'RESERVADA_MENSUAL', 'MANTENIMIENTO'].map(st => (
              <button
                key={st}
                onClick={() => setSelectedStatus(st)}
                className={`px-2.5 py-1 rounded transition-colors ${
                  selectedStatus === st
                    ? 'bg-slate-900 text-white font-semibold'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {st === 'TODOS'
                  ? 'Todas'
                  : st === 'DISPONIBLE'
                  ? 'Libres'
                  : st === 'OCUPADA'
                  ? 'Ocupadas'
                  : st === 'RESERVADA_MENSUAL'
                  ? 'Reservadas Mensual'
                  : 'Mantenimiento'}
              </button>
            ))}
          </div>

          {/* Color Legend */}
          <div className="flex items-center gap-4 text-[11px] text-slate-600">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-emerald-500 inline-block"></span>
              <span>Libre</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-slate-900 inline-block"></span>
              <span>Ocupada</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-indigo-500 inline-block"></span>
              <span>Reservada Mensual</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-amber-500 inline-block"></span>
              <span>Mantenimiento</span>
            </div>
          </div>
        </div>
      </div>

      {/* Cells Grid by Zones */}
      <div className="space-y-6">
        {zones.map(zone => {
          const zoneCells = filteredCells.filter(c => c.zone === zone.id);
          if (zoneCells.length === 0 && selectedZone !== 'TODAS') return null;

          return (
            <div key={zone.id} className="bg-white border border-slate-200 rounded-lg p-5 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-slate-100 pb-3">
                <div>
                  <h2 className="text-sm font-bold text-slate-900">{zone.name}</h2>
                  <p className="text-[11px] text-slate-500">{zone.description}</p>
                </div>
                <div className="text-xs text-slate-600 font-medium">
                  {zoneCells.filter(c => c.status === 'OCUPADA').length} ocupadas / {zoneCells.length} celdas
                </div>
              </div>

              {/* Grid of bays */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {zoneCells.map(cell => {
                  const entry = activeEntries.find(e => e.cellId === cell.id);
                  const reservedUser = cell.reservedForUserId 
                    ? clients.find(cl => cl.id === cell.reservedForUserId)
                    : null;

                  return (
                    <div
                      key={cell.id}
                      onClick={() => setSelectedCell(cell)}
                      className={`p-3 rounded-lg border-2 transition-all cursor-pointer flex flex-col justify-between min-h-[110px] ${getStatusColor(
                        cell.status
                      )}`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-sm tracking-wide">
                          {cell.code}
                        </span>
                        <span className="text-[10px] uppercase font-semibold">
                          {cell.allowedType === 'AUTOMOVIL' ? 'Auto' : cell.allowedType === 'MOTO' ? 'Moto' : cell.allowedType === 'CAMIONETA' ? 'SUV' : 'Bici'}
                        </span>
                      </div>

                      <div className="my-2">
                        {cell.status === 'OCUPADA' && cell.currentVehiclePlate && (
                          <div className="space-y-1">
                            <ColombianPlate
                              plate={cell.currentVehiclePlate}
                              vehicleType={cell.allowedType}
                              size="sm"
                            />
                            {entry && (
                              <div className="text-[10px] opacity-80 truncate">
                                {entry.serviceType === 'MENSUALIDAD' ? 'Mensual' : 'Ocasional'}
                              </div>
                            )}
                          </div>
                        )}

                        {cell.status === 'DISPONIBLE' && (
                          <div className="text-[11px] text-emerald-800 font-medium">
                            Disponible
                          </div>
                        )}

                        {cell.status === 'RESERVADA_MENSUAL' && (
                          <div className="text-[10px] text-indigo-900 leading-tight">
                            <div className="font-semibold">Abonado:</div>
                            <div className="truncate">{reservedUser?.fullName || 'Reservada'}</div>
                          </div>
                        )}

                        {cell.status === 'MANTENIMIENTO' && (
                          <div className="text-[10px] text-amber-900 font-medium flex items-center gap-1">
                            <Wrench className="w-3 h-3 text-amber-700 shrink-0" />
                            <span>Fuera de servicio</span>
                          </div>
                        )}
                      </div>

                      <div className="text-[10px] pt-1 border-t border-current/15 flex items-center justify-between">
                        <span className="opacity-75">
                          {cell.status === 'OCUPADA' ? 'En uso' : 'Ver detalle'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Cell Detail Modal */}
      {selectedCell && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md border border-slate-200 overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 bg-slate-50">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Detalle de la Celda {selectedCell.code}
                </h3>
                <p className="text-xs text-slate-500">
                  {selectedCell.zone.replace('ZONA_', '').replace('_', ' ')} · Tipo permitido: {getVehicleTypeLabel(selectedCell.allowedType)}
                </p>
              </div>
              <button
                onClick={() => setSelectedCell(null)}
                className="text-slate-400 hover:text-slate-600 transition-colors p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              {/* Status display */}
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-md border border-slate-200">
                <span className="text-slate-500 font-medium">Estado actual:</span>
                <span className="font-bold uppercase text-slate-900">
                  {selectedCell.status.replace('_', ' ')}
                </span>
              </div>

              {/* If occupied, show vehicle details and direct exit button */}
              {selectedCell.status === 'OCUPADA' && selectedCell.currentVehiclePlate && (
                <div className="p-4 bg-slate-900 text-white rounded-md space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Vehículo Estacionado:</span>
                    <ColombianPlate
                      plate={selectedCell.currentVehiclePlate}
                      vehicleType={selectedCell.allowedType}
                      size="sm"
                    />
                  </div>

                  <div className="pt-2 border-t border-slate-800 flex justify-end">
                    <button
                      onClick={() => {
                        const plate = selectedCell.currentVehiclePlate!;
                        setSelectedCell(null);
                        onDirectExitFromCell(plate);
                      }}
                      className="px-3.5 py-1.5 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded transition-colors"
                    >
                      Registrar Salida de esta Celda
                    </button>
                  </div>
                </div>
              )}

              {/* If available, show direct check in button */}
              {selectedCell.status === 'DISPONIBLE' && (
                <div className="p-4 bg-emerald-50 rounded-md border border-emerald-200 flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-emerald-900">Celda libre para parqueo</div>
                    <div className="text-[11px] text-emerald-700">Puede asignar un vehículo inmediatamente.</div>
                  </div>
                  <button
                    onClick={() => {
                      const id = selectedCell.id;
                      setSelectedCell(null);
                      onDirectEntryToCell(id);
                    }}
                    className="px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded transition-colors shadow-xs"
                  >
                    Asignar Entrada
                  </button>
                </div>
              )}

              {/* Maintenance toggle */}
              <div className="pt-2 border-t border-slate-200 space-y-2">
                <span className="font-semibold text-slate-700 block">Modificar Condición Operativa:</span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      updateCellStatus(selectedCell.id, 'DISPONIBLE');
                      setSelectedCell(null);
                    }}
                    className="flex-1 py-1.5 px-2 text-xs font-medium bg-emerald-100 text-emerald-800 hover:bg-emerald-200 rounded text-center transition-colors"
                  >
                    Marcar Libre
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      updateCellStatus(selectedCell.id, 'MANTENIMIENTO', 'En revisión técnica de pintura o sensor');
                      setSelectedCell(null);
                    }}
                    className="flex-1 py-1.5 px-2 text-xs font-medium bg-amber-100 text-amber-800 hover:bg-amber-200 rounded text-center transition-colors"
                  >
                    Mantenimiento
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New Cell Modal */}
      {showNewCellModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-sm border border-slate-200 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">Añadir Nueva Celda de Parqueo</h3>
              <button onClick={() => setShowNewCellModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateCell} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Código de la Celda</label>
                <input
                  type="text"
                  value={newCode}
                  onChange={e => setNewCode(e.target.value.toUpperCase())}
                  placeholder="Ej. A-15, B-11, C-07"
                  className="w-full px-3 py-1.5 border border-slate-300 rounded font-mono font-bold"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Zona del Parqueadero</label>
                <select
                  value={newZone}
                  onChange={e => setNewZone(e.target.value as CellZone)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded"
                >
                  <option value="ZONA_A_AUTOS">Zona A · Automóviles</option>
                  <option value="ZONA_B_MOTOS">Zona B · Motos</option>
                  <option value="ZONA_C_ESPECIALES">Zona C · Camionetas / Especiales</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Tipo de Vehículo Permitido</label>
                <select
                  value={newType}
                  onChange={e => setNewType(e.target.value as VehicleType)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded"
                >
                  <option value="AUTOMOVIL">Automóvil</option>
                  <option value="MOTO">Motocicleta</option>
                  <option value="CAMIONETA">Camioneta / SUV</option>
                  <option value="BICICLETA">Bicicleta</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowNewCellModal(false)}
                  className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded"
                >
                  Guardar Celda
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
