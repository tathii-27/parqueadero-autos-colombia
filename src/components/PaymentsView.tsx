import React, { useState } from 'react';
import { useParking } from '../context/ParkingContext';
import { PaymentConcept, PaymentMethod } from '../types/parking';
import { formatCOP, formatDateTime } from '../utils/formatters';
import { 
  Banknote, 
  CreditCard, 
  Download, 
  Filter, 
  Plus, 
  Printer, 
  Receipt, 
  Search, 
  Smartphone, 
  Wallet 
} from 'lucide-react';

interface PaymentsViewProps {
  onViewReceipt: (receiptNumber: string, plate: string) => void;
}

export const PaymentsView: React.FC<PaymentsViewProps> = ({ onViewReceipt }) => {
  const { payments, config, recordDirectPayment } = useParking();

  const [search, setSearch] = useState('');
  const [methodFilter, setMethodFilter] = useState<string>('TODOS');
  const [conceptFilter, setConceptFilter] = useState<string>('TODOS');
  const [showManualPaymentModal, setShowManualPaymentModal] = useState(false);

  // Manual payment state
  const [clientName, setClientName] = useState('');
  const [clientDoc, setClientDoc] = useState('');
  const [plate, setPlate] = useState('');
  const [concept, setConcept] = useState<PaymentConcept>('PARQUEO_OCASIONAL');
  const [amount, setAmount] = useState<number>(10000);
  const [method, setMethod] = useState<PaymentMethod>('EFECTIVO');
  const [details, setDetails] = useState('');

  // Daily totals
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const todayPayments = payments.filter(p => new Date(p.date) >= todayStart);
  const totalToday = todayPayments.reduce((acc, p) => acc + p.amount, 0);
  const totalAllTime = payments.reduce((acc, p) => acc + p.amount, 0);

  const cashToday = todayPayments
    .filter(p => p.paymentMethod === 'EFECTIVO')
    .reduce((acc, p) => acc + p.amount, 0);

  const electronicToday = todayPayments
    .filter(p => p.paymentMethod === 'NEQUI' || p.paymentMethod === 'DAVIPLATA' || p.paymentMethod === 'TRANSFERENCIA')
    .reduce((acc, p) => acc + p.amount, 0);

  const cardToday = todayPayments
    .filter(p => p.paymentMethod === 'TARJETA_DEBITO' || p.paymentMethod === 'TARJETA_CREDITO')
    .reduce((acc, p) => acc + p.amount, 0);

  // Filter payments
  const filteredPayments = payments.filter(p => {
    const q = search.toLowerCase();
    const matchesSearch =
      !q ||
      p.receiptNumber.toLowerCase().includes(q) ||
      p.clientName.toLowerCase().includes(q) ||
      (p.plate && p.plate.toLowerCase().includes(q)) ||
      p.details.toLowerCase().includes(q);

    const matchesMethod = methodFilter === 'TODOS' || p.paymentMethod === methodFilter;
    const matchesConcept = conceptFilter === 'TODOS' || p.concept === conceptFilter;

    return matchesSearch && matchesMethod && matchesConcept;
  });

  const handleCreateManualPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim() || !amount) return;

    const created = recordDirectPayment({
      concept,
      amount: Number(amount),
      paymentMethod: method,
      plate: plate.toUpperCase().replace(/[^A-Z0-9]/g, '') || undefined,
      clientName: clientName.trim(),
      clientDoc: clientDoc.trim() || 'Consumidor Final',
      details: details.trim() || 'Cobro directo en taquilla',
      cashier: 'Caja Principal - Operaciones',
    });

    setShowManualPaymentModal(false);
    onViewReceipt(created.receiptNumber, created.plate || '');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-lg p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-semibold tracking-wider text-slate-500 uppercase">
              Contabilidad y Tesorería · Autos Colombia
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Gestión de Pagos y Caja
            </h1>
            <p className="mt-1 text-xs text-slate-600 max-w-2xl">
              Libro diario de ingresos, arqueo de caja por turnos, desglose por medios de pago colombianos (Efectivo, Nequi, Daviplata, Tarjetas y Bancolombia) y comprobantes fiscales de egreso.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setShowManualPaymentModal(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-md transition-colors shadow-xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Ingreso Extra a Caja</span>
            </button>
          </div>
        </div>

        {/* Financial KPI Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-200">
          <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 space-y-1">
            <span className="text-[11px] font-medium text-slate-500 flex items-center justify-between">
              Total Recaudado Hoy
              <Wallet className="w-3.5 h-3.5 text-slate-400" />
            </span>
            <div className="text-xl font-mono font-bold text-slate-950 tabular-nums">
              {formatCOP(totalToday)}
            </div>
            <div className="text-[10px] text-slate-400 font-mono">
              Historico total: {formatCOP(totalAllTime)}
            </div>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 space-y-1">
            <span className="text-[11px] font-medium text-slate-500 flex items-center justify-between">
              Efectivo en Caja (Hoy)
              <Banknote className="w-3.5 h-3.5 text-emerald-600" />
            </span>
            <div className="text-xl font-mono font-bold text-emerald-800 tabular-nums">
              {formatCOP(cashToday)}
            </div>
            <div className="text-[10px] text-slate-400">
              Disponible físico en gaveta
            </div>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 space-y-1">
            <span className="text-[11px] font-medium text-slate-500 flex items-center justify-between">
              Nequi / Daviplata / Transf.
              <Smartphone className="w-3.5 h-3.5 text-indigo-600" />
            </span>
            <div className="text-xl font-mono font-bold text-indigo-900 tabular-nums">
              {formatCOP(electronicToday)}
            </div>
            <div className="text-[10px] text-slate-400">
              Saldos en cuentas digitales
            </div>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 space-y-1">
            <span className="text-[11px] font-medium text-slate-500 flex items-center justify-between">
              Tarjetas Débito / Crédito
              <CreditCard className="w-3.5 h-3.5 text-slate-500" />
            </span>
            <div className="text-xl font-mono font-bold text-slate-900 tabular-nums">
              {formatCOP(cardToday)}
            </div>
            <div className="text-[10px] text-slate-400">
              Transacciones por datáfono
            </div>
          </div>
        </div>
      </div>

      {/* Transactions Table & Filters */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 space-y-4">
        {/* Filters */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Buscar por recibo, cliente, placa..."
              className="w-full pl-9 pr-3 py-1.5 border border-slate-300 rounded-md focus:outline-hidden focus:ring-1 focus:ring-slate-900"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={methodFilter}
              onChange={e => setMethodFilter(e.target.value)}
              className="px-2.5 py-1.5 border border-slate-300 rounded bg-white text-slate-700"
            >
              <option value="TODOS">Todos los Medios</option>
              <option value="EFECTIVO">Efectivo</option>
              <option value="NEQUI">Nequi</option>
              <option value="DAVIPLATA">Daviplata</option>
              <option value="TRANSFERENCIA">Transferencia</option>
              <option value="TARJETA_DEBITO">Débito</option>
              <option value="TARJETA_CREDITO">Crédito</option>
            </select>

            <select
              value={conceptFilter}
              onChange={e => setConceptFilter(e.target.value)}
              className="px-2.5 py-1.5 border border-slate-300 rounded bg-white text-slate-700"
            >
              <option value="TODOS">Todos los Conceptos</option>
              <option value="PARQUEO_OCASIONAL">Parqueo Ocasional</option>
              <option value="MENSUALIDAD">Mensualidad</option>
              <option value="SERVICIO_ADICIONAL">Servicio Adicional</option>
            </select>
          </div>
        </div>

        {/* Ledger Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-semibold">
                <th className="py-2.5 px-3">Recibo</th>
                <th className="py-2.5 px-3">Fecha y Hora</th>
                <th className="py-2.5 px-3">Concepto</th>
                <th className="py-2.5 px-3">Cliente / Placa</th>
                <th className="py-2.5 px-3">Medio de Pago</th>
                <th className="py-2.5 px-3 text-right">Monto (COP)</th>
                <th className="py-2.5 px-3 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-normal">
              {filteredPayments.map(pay => (
                <tr key={pay.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-2.5 px-3 font-mono font-bold text-slate-900 whitespace-nowrap">
                    {pay.receiptNumber}
                  </td>
                  <td className="py-2.5 px-3 font-mono text-slate-600 whitespace-nowrap">
                    {formatDateTime(pay.date)}
                  </td>
                  <td className="py-2.5 px-3">
                    <span className="font-semibold text-slate-900">
                      {pay.concept.replace('_', ' ')}
                    </span>
                    <div className="text-[10px] text-slate-500 truncate max-w-xs" title={pay.details}>
                      {pay.details}
                    </div>
                  </td>
                  <td className="py-2.5 px-3">
                    <div className="font-medium text-slate-800">{pay.clientName}</div>
                    <div className="text-[10px] text-slate-500 font-mono">
                      {pay.plate ? `Placa: ${pay.plate}` : pay.clientDoc}
                    </div>
                  </td>
                  <td className="py-2.5 px-3">
                    <span className="inline-block text-[11px] font-medium text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                      {pay.paymentMethod}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 font-mono font-bold text-slate-950 text-right whitespace-nowrap">
                    {formatCOP(pay.amount)}
                  </td>
                  <td className="py-2.5 px-3 text-right whitespace-nowrap">
                    <button
                      onClick={() => onViewReceipt(pay.receiptNumber, pay.plate || '')}
                      className="inline-flex items-center gap-1 text-[11px] font-medium text-indigo-600 hover:text-indigo-800 underline cursor-pointer"
                    >
                      <Printer className="w-3 h-3" />
                      <span>Comprobante</span>
                    </button>
                  </td>
                </tr>
              ))}

              {filteredPayments.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500 text-xs">
                    No se encontraron pagos con los filtros aplicados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Manual Payment Modal */}
      {showManualPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-sm border border-slate-200 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">Registrar Ingreso Manual en Caja</h3>
              <button onClick={() => setShowManualPaymentModal(false)} className="text-slate-400 hover:text-slate-600">
                ×
              </button>
            </div>

            <form onSubmit={handleCreateManualPayment} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 font-medium mb-1">Nombre del Cliente / Pagador</label>
                <input
                  type="text"
                  value={clientName}
                  onChange={e => setClientName(e.target.value)}
                  placeholder="Ej. Juan Pérez"
                  className="w-full px-3 py-1.5 border border-slate-300 rounded"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Placa o Referencia (Opcional)</label>
                <input
                  type="text"
                  value={plate}
                  onChange={e => setPlate(e.target.value.toUpperCase())}
                  placeholder="Ej. ABC123"
                  className="w-full px-3 py-1.5 border border-slate-300 rounded uppercase font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Concepto</label>
                  <select
                    value={concept}
                    onChange={e => setConcept(e.target.value as PaymentConcept)}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded"
                  >
                    <option value="PARQUEO_OCASIONAL">Parqueo Ocasional</option>
                    <option value="MENSUALIDAD">Mensualidad</option>
                    <option value="SERVICIO_ADICIONAL">Servicio Extra</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Medio</label>
                  <select
                    value={method}
                    onChange={e => setMethod(e.target.value as PaymentMethod)}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded"
                  >
                    <option value="EFECTIVO">Efectivo</option>
                    <option value="NEQUI">Nequi</option>
                    <option value="DAVIPLATA">Daviplata</option>
                    <option value="TRANSFERENCIA">Transferencia</option>
                    <option value="TARJETA_DEBITO">Débito</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Valor Recaudado (COP)</label>
                <input
                  type="number"
                  value={amount}
                  onChange={e => setAmount(Number(e.target.value))}
                  step={1000}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded font-mono font-bold"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Detalle / Observación</label>
                <input
                  type="text"
                  value={details}
                  onChange={e => setDetails(e.target.value)}
                  placeholder="Detalle del cobro..."
                  className="w-full px-3 py-1.5 border border-slate-300 rounded"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowManualPaymentModal(false)}
                  className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded"
                >
                  Asentar Pago
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
