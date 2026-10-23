import React, { useState, useEffect } from 'react';
import { useParking } from '../context/ParkingContext';
import { ServiceType, VehicleType } from '../types/parking';
import { ColombianPlate } from './ColombianPlate';
import { getVehicleTypeLabel, formatCOP } from '../utils/formatters';
import { AlertCircle, Car, Check, ShieldAlert, X } from 'lucide-react';

interface EntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEntrySuccess: (ticketNumber: string, plate: string) => void;
  preselectedCellId?: string;
}

export const EntryModal: React.FC<EntryModalProps> = ({
  isOpen,
  onClose,
  onEntrySuccess,
  preselectedCellId,
}) => {
  const { cells, clients, activeEntries, config, registerEntry } = useParking();

  const [plate, setPlate] = useState('');
  const [vehicleType, setVehicleType] = useState<VehicleType>('AUTOMOVIL');
  const [serviceType, setServiceType] = useState<ServiceType>('OCASIONAL');
  const [cellId, setCellId] = useState(preselectedCellId || '');
  const [selectedClientId, setSelectedClientId] = useState<string | undefined>();
  const [matchedClientName, setMatchedClientName] = useState<string | undefined>();
  const [initialNotes, setInitialNotes] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // When preselected cell changes
  useEffect(() => {
    if (preselectedCellId) {
      setCellId(preselectedCellId);
      const cell = cells.find(c => c.id === preselectedCellId);
      if (cell) {
        setVehicleType(cell.allowedType);
      }
    }
  }, [preselectedCellId, cells]);

  // Check matching client when plate changes
  useEffect(() => {
    const cleaned = plate.toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (cleaned.length >= 4) {
      const match = clients.find(c =>
        c.vehicles.some(v => v.plate.toUpperCase().replace(/[^A-Z0-9]/g, '') === cleaned)
      );
      if (match) {
        const vehicle = match.vehicles.find(
          v => v.plate.toUpperCase().replace(/[^A-Z0-9]/g, '') === cleaned
        );
        setSelectedClientId(match.id);
        setMatchedClientName(match.fullName);
        if (vehicle) setVehicleType(vehicle.type);

        if (match.subscription.status !== 'VENCIDA') {
          setServiceType('MENSUALIDAD');
        }

        // If client has an assigned cell and it's free or reserved
        if (match.assignedCellId) {
          const reservedCell = cells.find(c => c.id === match.assignedCellId);
          if (reservedCell && reservedCell.status !== 'OCUPADA') {
            setCellId(match.assignedCellId);
          }
        }
      } else {
        setSelectedClientId(undefined);
        setMatchedClientName(undefined);
      }
    } else {
      setSelectedClientId(undefined);
      setMatchedClientName(undefined);
    }
  }, [plate, clients, cells]);

  if (!isOpen) return null;

  // Filter available cells for selected vehicle type
  const availableCells = cells.filter(
    c =>
      (c.status === 'DISPONIBLE' || (c.status === 'RESERVADA_MENSUAL' && c.reservedForUserId === selectedClientId)) &&
      (c.allowedType === vehicleType || (vehicleType === 'CAMIONETA' && c.zone === 'ZONA_C_ESPECIALES'))
  );

  // If currently selected cell is not compatible or occupied, pick the first available
  const effectiveCellId = cellId && availableCells.some(c => c.id === cellId)
    ? cellId
    : availableCells[0]?.id || '';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const normPlate = plate.toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (!normPlate || normPlate.length < 5) {
      setErrorMessage('Por favor ingrese una placa válida (mínimo 5 caracteres).');
      return;
    }

    // Check if plate is already inside
    const isAlreadyInside = activeEntries.some(
      entry => entry.plate.toUpperCase().replace(/[^A-Z0-9]/g, '') === normPlate
    );
    if (isAlreadyInside) {
      setErrorMessage(`El vehículo con placa ${normPlate} ya se encuentra registrado actualmente dentro del parqueadero.`);
      return;
    }

    if (!effectiveCellId) {
      setErrorMessage(`No hay celdas disponibles para el tipo de vehículo ${getVehicleTypeLabel(vehicleType)}.`);
      return;
    }

    try {
      const created = registerEntry({
        plate: normPlate,
        vehicleType,
        serviceType,
        userId: selectedClientId,
        clientName: matchedClientName,
        cellId: effectiveCellId,
        initialConditionNotes: initialNotes.trim() || 'Sin observaciones de ingreso.',
      });

      // Reset and notify
      setPlate('');
      setInitialNotes('');
      onClose();
      onEntrySuccess(created.ticketNumber, created.plate);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error al registrar entrada';
      setErrorMessage(message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Registrar Entrada de Vehículo
            </h2>
            <p className="text-xs text-slate-500">
              Requerimiento RF-ES-01 · Validación de placa y asignación de celda
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errorMessage && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md flex items-start gap-2 text-xs text-red-800">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Placa Input with live preview */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1.5">
              Placa del Vehículo (Formato Colombiano)
            </label>
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={plate}
                onChange={e => setPlate(e.target.value.toUpperCase())}
                placeholder="Ej. HNE612 o TXZ44E"
                maxLength={7}
                autoFocus
                className="flex-1 px-3 py-2 text-sm font-mono font-bold tracking-widest uppercase border border-slate-300 rounded-md focus:outline-hidden focus:ring-2 focus:ring-slate-950 focus:border-slate-950"
              />
              {plate && (
                <div className="shrink-0">
                  <ColombianPlate plate={plate} vehicleType={vehicleType} size="md" />
                </div>
              )}
            </div>
          </div>

          {/* Mensualista Match Alert if recognized */}
          {matchedClientName && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-md text-xs text-emerald-900 flex items-center justify-between">
              <div>
                <span className="font-semibold">¡Abonado Mensualista Identificado!</span>
                <div className="text-emerald-800 text-[11px] mt-0.5">
                  Titular: {matchedClientName} · Modalidad Mensualidad Activada ($0 COP a liquidar)
                </div>
              </div>
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
            </div>
          )}

          {/* Vehicle Type Selection */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {(['AUTOMOVIL', 'MOTO', 'CAMIONETA', 'BICICLETA'] as VehicleType[]).map(type => (
              <button
                type="button"
                key={type}
                onClick={() => setVehicleType(type)}
                className={`p-2.5 rounded-md border text-left transition-colors cursor-pointer ${
                  vehicleType === type
                    ? 'border-slate-950 bg-slate-900 text-white'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                }`}
              >
                <div className="text-xs font-semibold">{getVehicleTypeLabel(type)}</div>
                <div className={`text-[10px] tabular-nums mt-0.5 ${vehicleType === type ? 'text-slate-300' : 'text-slate-500'}`}>
                  {formatCOP(config.hourlyRates[type])}/h
                </div>
              </button>
            ))}
          </div>

          {/* Service Type (Mensualidad vs Ocasional) */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1.5">
              Tipo de Servicio
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setServiceType('OCASIONAL')}
                className={`p-2 text-xs font-medium rounded-md border transition-colors ${
                  serviceType === 'OCASIONAL'
                    ? 'bg-slate-100 border-slate-900 text-slate-950 font-bold'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                Ocasional (Por Horas)
              </button>
              <button
                type="button"
                onClick={() => setServiceType('MENSUALIDAD')}
                className={`p-2 text-xs font-medium rounded-md border transition-colors ${
                  serviceType === 'MENSUALIDAD'
                    ? 'bg-emerald-50 border-emerald-600 text-emerald-900 font-bold'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                Mensualidad (Abonado)
              </button>
            </div>
          </div>

          {/* Cell Assignment Selector */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide">
                Celda Asignada (Disponibles: {availableCells.length})
              </label>
              <span className="text-[11px] text-slate-500">
                RF-ES-02 · Asignación inteligente
              </span>
            </div>

            {availableCells.length > 0 ? (
              <select
                value={effectiveCellId}
                onChange={e => setCellId(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-hidden focus:ring-2 focus:ring-slate-950"
              >
                {availableCells.map(c => (
                  <option key={c.id} value={c.id}>
                    Celda {c.code} ({c.zone.replace('ZONA_', '').replace('_', ' ')}) {c.reservedForUserId ? '· Reservada para este cliente' : ''}
                  </option>
                ))}
              </select>
            ) : (
              <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-md text-xs text-amber-800 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
                <span>No hay celdas disponibles para esta categoría. Aforo completo.</span>
              </div>
            )}
          </div>

          {/* Initial Condition Notes (RF-ES-03) */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1.5">
              Inspección de Ingreso / Novedades Iniciales (Opcional)
            </label>
            <textarea
              value={initialNotes}
              onChange={e => setInitialNotes(e.target.value)}
              placeholder="Ej: Rayón superficial en guardabarros izquierdo, deja llaves en custodia, 1 casco..."
              rows={2}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-md focus:outline-hidden focus:ring-2 focus:ring-slate-950 resize-none"
            />
            <div className="flex flex-wrap gap-1.5 mt-1.5">
              {['Sin novedades visibles', 'Rayón previo', 'Deja llaves en custodia', 'Casco en custodia'].map(tag => (
                <button
                  type="button"
                  key={tag}
                  onClick={() => setInitialNotes(prev => (prev ? `${prev}, ${tag}` : tag))}
                  className="text-[10px] text-slate-600 bg-slate-100 hover:bg-slate-200 px-2 py-0.5 rounded transition-colors"
                >
                  + {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-md transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={availableCells.length === 0}
              className="px-5 py-2 text-xs font-medium text-white bg-slate-950 hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed rounded-md transition-colors shadow-xs"
            >
              Confirmar Entrada y Generar Ticket
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
