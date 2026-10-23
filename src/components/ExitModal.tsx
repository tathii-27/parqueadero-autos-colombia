import React, { useState } from 'react';
import { useParking } from '../context/ParkingContext';
import { PaymentMethod, VehicleEntry } from '../types/parking';
import { ColombianPlate } from './ColombianPlate';
import { formatCOP, formatDateTime, getVehicleTypeLabel } from '../utils/formatters';
import { 
  AlertTriangle, 
  Banknote, 
  Check, 
  CreditCard, 
  DollarSign, 
  Smartphone, 
  X 
} from 'lucide-react';

interface ExitModalProps {
  entry: VehicleEntry | null;
  isOpen: boolean;
  onClose: () => void;
  onExitSuccess: (entry: VehicleEntry, receiptId?: string) => void;
}

export const ExitModal: React.FC<ExitModalProps> = ({
  entry,
  isOpen,
  onClose,
  onExitSuccess,
}) => {
  const { calculateExitQuote, registerExit, incidents } = useParking();

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('EFECTIVO');
  const [cashGiven, setCashGiven] = useState<string>('');
  const [discount, setDiscount] = useState<number>(0);
  const [additionalCharge, setAdditionalCharge] = useState<number>(0);
  const [notes, setNotes] = useState<string>('');
  const [error, setError] = useState<string>('');

  if (!isOpen || !entry) return null;

  const quote = calculateExitQuote(entry.id);
  const finalTotal = Math.max(0, quote.totalToPay - discount + additionalCharge);

  // Check if this vehicle has any recorded incidents
  const vehicleIncidents = incidents.filter(
    i => i.plate.toUpperCase().replace(/[^A-Z0-9]/g, '') === entry.plate.toUpperCase().replace(/[^A-Z0-9]/g, '')
  );

  const cashGivenNumber = Number(cashGiven) || 0;
  const changeDue = Math.max(0, cashGivenNumber - finalTotal);

  const handleConfirmExit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (paymentMethod === 'EFECTIVO' && finalTotal > 0 && cashGivenNumber < finalTotal) {
      setError(`El efectivo recibido ($${cashGivenNumber.toLocaleString()}) es menor al valor total a cobrar ($${finalTotal.toLocaleString()}).`);
      return;
    }

    try {
      const result = registerExit(
        entry.id,
        paymentMethod,
        discount,
        additionalCharge,
        notes
      );
      onClose();
      onExitSuccess(result.entry, result.payment?.receiptNumber);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error al registrar salida';
      setError(message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Registrar Salida y Liquidación
            </h2>
            <p className="text-xs text-slate-500">
              Requerimiento RF-ES-06, RF-ES-07, RF-ES-08 · Cálculo tarifario y liberación
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleConfirmExit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md text-xs text-red-800">
              {error}
            </div>
          )}

          {/* Vehicle & Ticket Card */}
          <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ColombianPlate plate={entry.plate} vehicleType={entry.vehicleType} size="md" />
                <div>
                  <div className="text-xs font-bold text-slate-900">
                    {getVehicleTypeLabel(entry.vehicleType)} · Celda {entry.cellId}
                  </div>
                  <div className="text-[11px] text-slate-500 font-mono">
                    Ticket: {entry.ticketNumber}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs font-semibold text-slate-900">
                  {entry.serviceType === 'MENSUALIDAD' ? 'Mensualista' : 'Ocasional'}
                </div>
                {entry.clientName && (
                  <div className="text-[11px] text-slate-500 truncate max-w-[140px]" title={entry.clientName}>
                    {entry.clientName}
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200/70 text-xs">
              <div>
                <span className="text-slate-500 block text-[11px]">Hora de Entrada:</span>
                <span className="font-mono text-slate-800">{formatDateTime(entry.entryTime)}</span>
              </div>
              <div className="text-right">
                <span className="text-slate-500 block text-[11px]">Tiempo Transcurrido:</span>
                <span className="font-mono font-bold text-slate-900">
                  {quote.durationFormatted} ({quote.durationMinutes} min)
                </span>
              </div>
            </div>
          </div>

          {/* Incident Warning if exists (RF-ES-10) */}
          {vehicleIncidents.length > 0 && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900 space-y-1">
              <div className="flex items-center gap-1.5 font-bold">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Novedad Registrada para este Vehículo (RF-ES-10)</span>
              </div>
              {vehicleIncidents.map(inc => (
                <div key={inc.id} className="text-[11px] text-amber-800">
                  • <strong>{inc.code}:</strong> {inc.description} ({inc.status})
                </div>
              ))}
            </div>
          )}

          {/* Billing Breakdown */}
          <div className="p-4 bg-slate-900 text-white rounded-lg space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Tipo de Liquidación</span>
              <span>{quote.isMensualidadActive ? 'Abonado Mensualista' : 'Tarifa Ocasional'}</span>
            </div>

            {quote.isMensualidadActive ? (
              <div className="py-2 flex items-center justify-between border-y border-slate-800">
                <div className="text-xs text-emerald-400 font-semibold flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-400" />
                  Mensualidad Vigente (Amparada)
                </div>
                <div className="font-mono text-xl font-bold text-emerald-400">$ 0 COP</div>
              </div>
            ) : (
              <div className="space-y-1 py-2 border-y border-slate-800 text-xs">
                <div className="flex justify-between text-slate-300">
                  <span>Tarifa Base ({getVehicleTypeLabel(entry.vehicleType)})</span>
                  <span className="font-mono">{formatCOP(quote.rateApplied)}/h</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Horas a Facturar</span>
                  <span className="font-mono">{Math.max(1, Math.ceil(quote.durationMinutes / 60))} h</span>
                </div>
                <div className="flex justify-between font-bold text-white text-base pt-1">
                  <span>Total a Pagar</span>
                  <span className="font-mono text-emerald-400 text-lg">{formatCOP(finalTotal)}</span>
                </div>
              </div>
            )}
          </div>

          {/* Payment Method Selector if there is an amount or for receipt record */}
          {finalTotal > 0 && (
            <div className="space-y-3">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide">
                Medio de Pago (RF-ES-07)
              </label>

              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'EFECTIVO', label: 'Efectivo', icon: Banknote },
                  { id: 'NEQUI', label: 'Nequi', icon: Smartphone },
                  { id: 'DAVIPLATA', label: 'Daviplata', icon: Smartphone },
                  { id: 'TARJETA_DEBITO', label: 'Débito', icon: CreditCard },
                  { id: 'TARJETA_CREDITO', label: 'Crédito', icon: CreditCard },
                  { id: 'TRANSFERENCIA', label: 'Transferencia', icon: DollarSign },
                ].map(item => {
                  const Icon = item.icon;
                  return (
                    <button
                      type="button"
                      key={item.id}
                      onClick={() => setPaymentMethod(item.id as PaymentMethod)}
                      className={`p-2 rounded-md border text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                        paymentMethod === item.id
                          ? 'border-slate-900 bg-slate-900 text-white'
                          : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Cash Calculator if Efectivo */}
              {paymentMethod === 'EFECTIVO' && (
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-md grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                      Efectivo Recibido (COP)
                    </label>
                    <input
                      type="number"
                      value={cashGiven}
                      onChange={e => setCashGiven(e.target.value)}
                      placeholder={finalTotal.toString()}
                      step={1000}
                      className="w-full px-2.5 py-1.5 font-mono text-sm border border-slate-300 rounded focus:outline-hidden focus:ring-1 focus:ring-slate-900"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                      Cambio / Devuelta
                    </label>
                    <div className="px-2.5 py-1.5 font-mono text-sm font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded">
                      {formatCOP(changeDue)}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

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
              className="px-5 py-2 text-xs font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-md transition-colors shadow-xs font-semibold cursor-pointer"
            >
              {finalTotal > 0 ? `Cobrar ${formatCOP(finalTotal)} y Liberar Celda` : 'Confirmar Salida y Liberar Celda'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
