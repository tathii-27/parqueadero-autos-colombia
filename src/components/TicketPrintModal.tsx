import React from 'react';
import { useParking } from '../context/ParkingContext';
import { ColombianPlate } from './ColombianPlate';
import { formatCOP, formatDateTime, getVehicleTypeLabel } from '../utils/formatters';
import { Check, Printer, QrCode, X } from 'lucide-react';

interface TicketPrintModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'ENTRY_TICKET' | 'EXIT_RECEIPT';
  ticketOrReceiptNumber: string;
  plate: string;
}

export const TicketPrintModal: React.FC<TicketPrintModalProps> = ({
  isOpen,
  onClose,
  type,
  ticketOrReceiptNumber,
  plate,
}) => {
  const { config, activeEntries, completedEntries, payments } = useParking();

  if (!isOpen) return null;

  // Find relevant entry
  const entry = 
    activeEntries.find(e => e.ticketNumber === ticketOrReceiptNumber || e.plate === plate) ||
    completedEntries.find(e => e.ticketNumber === ticketOrReceiptNumber || e.plate === plate);

  // Find payment if it is an exit receipt
  const payment = payments.find(p => p.receiptNumber === ticketOrReceiptNumber || p.plate === plate);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-sm border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 bg-slate-50">
          <span className="text-xs font-bold text-slate-800">
            {type === 'ENTRY_TICKET' ? 'Ticket de Entrada de Vehículo' : 'Comprobante de Caja y Salida'}
          </span>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Printable Ticket Body */}
        <div className="p-6 overflow-y-auto">
          <div
            id="printable-receipt"
            className="bg-white border border-dashed border-slate-300 p-5 rounded font-mono text-xs text-slate-900 space-y-3"
          >
            {/* Header info */}
            <div className="text-center space-y-0.5 border-b border-slate-200 pb-3">
              <div className="font-bold text-sm tracking-tight">{config.name}</div>
              <div className="text-[11px] text-slate-600">NIT: {config.nit}</div>
              <div className="text-[10px] text-slate-500">{config.address}</div>
              <div className="text-[10px] text-slate-500">{config.city}</div>
              <div className="text-[10px] text-slate-500">Tel: {config.phone}</div>
              <div className="text-[9px] text-slate-400 uppercase pt-1">{config.regime}</div>
            </div>

            {/* Document Title & Consecutivo */}
            <div className="text-center py-1">
              <div className="font-bold text-xs uppercase tracking-wider">
                {type === 'ENTRY_TICKET' ? 'TICKET DE ENTRADA' : 'RECIBO DE CAJA - SALIDA'}
              </div>
              <div className="text-sm font-bold tracking-widest text-slate-950 mt-0.5">
                {ticketOrReceiptNumber}
              </div>
            </div>

            {/* Plate Display */}
            <div className="flex justify-center py-1">
              <ColombianPlate
                plate={entry?.plate || plate}
                vehicleType={entry?.vehicleType || 'AUTOMOVIL'}
                size="md"
              />
            </div>

            {/* Operational details */}
            <div className="space-y-1 border-y border-slate-200 py-2 text-[11px]">
              <div className="flex justify-between">
                <span className="text-slate-500">Vehículo:</span>
                <span className="font-semibold">{entry ? getVehicleTypeLabel(entry.vehicleType) : 'Vehículo'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Celda:</span>
                <span className="font-bold">{entry?.cellId || '-'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Servicio:</span>
                <span className="font-semibold">
                  {entry?.serviceType === 'MENSUALIDAD' ? 'MENSUALIDAD (Abonado)' : 'OCASIONAL (Por Horas)'}
                </span>
              </div>
              {entry?.clientName && (
                <div className="flex justify-between">
                  <span className="text-slate-500">Titular:</span>
                  <span className="truncate max-w-[170px]">{entry.clientName}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-slate-500">Entrada:</span>
                <span>{entry ? formatDateTime(entry.entryTime) : formatDateTime(new Date().toISOString())}</span>
              </div>
              {type === 'EXIT_RECEIPT' && entry?.exitTime && (
                <div className="flex justify-between">
                  <span className="text-slate-500">Salida:</span>
                  <span>{formatDateTime(entry.exitTime)}</span>
                </div>
              )}
              {type === 'EXIT_RECEIPT' && entry?.totalMinutes !== undefined && (
                <div className="flex justify-between">
                  <span className="text-slate-500">Permanencia:</span>
                  <span className="font-bold">
                    {Math.floor(entry.totalMinutes / 60)}h {entry.totalMinutes % 60}m
                  </span>
                </div>
              )}
            </div>

            {/* Observation if any */}
            {entry?.initialConditionNotes && (
              <div className="text-[10px] bg-slate-50 p-2 rounded border border-slate-200">
                <span className="font-bold block text-slate-700">Inspección de Ingreso:</span>
                <span className="text-slate-600">{entry.initialConditionNotes}</span>
              </div>
            )}

            {/* Payment Summary if Exit */}
            {type === 'EXIT_RECEIPT' && payment && (
              <div className="space-y-1 border-b border-slate-200 pb-2 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-slate-500">Medio de Pago:</span>
                  <span className="font-semibold">{payment.paymentMethod}</span>
                </div>
                <div className="flex justify-between text-sm font-bold pt-1">
                  <span>TOTAL CANCELADO:</span>
                  <span>{formatCOP(payment.amount)}</span>
                </div>
              </div>
            )}

            {/* Simulated Barcode / QR */}
            <div className="pt-2 flex flex-col items-center justify-center text-center space-y-1">
              <div className="p-2 border border-slate-300 rounded bg-white">
                <QrCode className="w-16 h-16 text-slate-800" />
              </div>
              <div className="text-[9px] text-slate-400">
                Escanear para control de talanquera
              </div>
            </div>

            {/* Legal notice */}
            <div className="text-[8px] text-slate-400 text-center leading-tight pt-2 border-t border-slate-100">
              Conforme a la Ley 1480 de 2011, la empresa responde por el vehículo en custodia dentro de las instalaciones. Conserve este comprobante para autorizar la salida.
            </div>
          </div>
        </div>

        {/* Footer with Print and Close */}
        <div className="flex items-center justify-end gap-3 px-4 py-3 border-t border-slate-200 bg-slate-50">
          <button
            onClick={onClose}
            className="px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-200 rounded transition-colors"
          >
            Cerrar
          </button>
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-medium text-white bg-slate-900 hover:bg-slate-800 rounded transition-colors shadow-xs cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Imprimir Ticket</span>
          </button>
        </div>
      </div>
    </div>
  );
};
