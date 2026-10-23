import React, { useState } from 'react';
import { useParking } from '../context/ParkingContext';
import { PaymentMethod, SubscriptionStatus, UserClient, VehicleType } from '../types/parking';
import { ColombianPlate } from './ColombianPlate';
import { formatCOP, formatDateOnly, getVehicleTypeLabel } from '../utils/formatters';
import { 
  AlertCircle, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  Mail, 
  Phone, 
  Plus, 
  RefreshCw, 
  Search, 
  ShieldCheck, 
  UserCheck, 
  X 
} from 'lucide-react';

interface UsersViewProps {
  onViewReceipt: (receiptNumber: string, plate: string) => void;
}

export const UsersView: React.FC<UsersViewProps> = ({ onViewReceipt }) => {
  const { clients, cells, config, createClient, renewSubscription } = useParking();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('TODAS');
  const [showNewClientModal, setShowNewClientModal] = useState(false);
  const [renewingClient, setRenewingClient] = useState<UserClient | null>(null);

  // New Client Form State
  const [fullName, setFullName] = useState('');
  const [docType, setDocType] = useState<'CC' | 'CE' | 'NIT'>('CC');
  const [docNumber, setDocNumber] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [assignedCellId, setAssignedCellId] = useState('');
  const [plate, setPlate] = useState('');
  const [vehicleBrand, setVehicleBrand] = useState('');
  const [vehicleModel, setVehicleModel] = useState('');
  const [vehicleColor, setVehicleColor] = useState('');
  const [vehicleType, setVehicleType] = useState<VehicleType>('AUTOMOVIL');
  const [monthlyRate, setMonthlyRate] = useState<number>(config.monthlyRates.AUTOMOVIL);
  const [initialPaymentMethod, setInitialPaymentMethod] = useState<PaymentMethod>('EFECTIVO');
  const [recordInitialPayment, setRecordInitialPayment] = useState(true);

  // Renewal Form State
  const [renewalMonths, setRenewalMonths] = useState(1);
  const [renewalPaymentMethod, setRenewalPaymentMethod] = useState<PaymentMethod>('TRANSFERENCIA');

  // Filter clients
  const filteredClients = clients.filter(c => {
    const q = search.toLowerCase();
    const matchesSearch =
      !q ||
      c.fullName.toLowerCase().includes(q) ||
      c.docNumber.includes(q) ||
      c.phone.includes(q) ||
      c.vehicles.some(v => v.plate.toLowerCase().includes(q));

    const matchesStatus = statusFilter === 'TODAS' || c.subscription.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreateClient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !docNumber.trim() || !plate.trim()) return;

    const startDate = new Date().toISOString().split('T')[0];
    const endDateObj = new Date();
    endDateObj.setMonth(endDateObj.getMonth() + 1);
    const endDate = endDateObj.toISOString().split('T')[0];

    const cleanPlate = plate.toUpperCase().replace(/[^A-Z0-9]/g, '');

    createClient(
      {
        fullName: fullName.trim(),
        docType,
        docNumber: docNumber.trim(),
        phone: phone.trim(),
        email: email.trim(),
        address: address.trim(),
        assignedCellId: assignedCellId || undefined,
        vehicles: [
          {
            plate: cleanPlate,
            brand: vehicleBrand || 'No especificada',
            model: vehicleModel || 'Estándar',
            color: vehicleColor || 'Gris',
            type: vehicleType,
          },
        ],
        subscription: {
          startDate,
          endDate,
          monthlyRate: Number(monthlyRate) || config.monthlyRates[vehicleType],
          status: 'ACTIVA',
          planType: `Mensualidad 24/7 ${getVehicleTypeLabel(vehicleType)}`,
        },
      },
      recordInitialPayment ? initialPaymentMethod : undefined
    );

    // Reset
    setFullName('');
    setDocNumber('');
    setPhone('');
    setEmail('');
    setAddress('');
    setPlate('');
    setShowNewClientModal(false);
  };

  const handleExecuteRenewal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!renewingClient) return;

    const payment = renewSubscription(
      renewingClient.id,
      renewalMonths,
      renewalPaymentMethod
    );

    setRenewingClient(null);
    onViewReceipt(payment.receiptNumber, payment.plate || '');
  };

  const getStatusBadge = (status: SubscriptionStatus) => {
    switch (status) {
      case 'ACTIVA':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            Al Día
          </span>
        );
      case 'POR_VENCER':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
            <Clock className="w-3 h-3 text-amber-600" />
            Por Vencer
          </span>
        );
      case 'VENCIDA':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-red-700 bg-red-50 px-2 py-0.5 rounded border border-red-200">
            <AlertCircle className="w-3 h-3 text-red-600" />
            Vencida
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-lg p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-semibold tracking-wider text-slate-500 uppercase">
              Abonados y Contratos · Autos Colombia
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Gestión de Usuarios y Mensualistas
            </h1>
            <p className="mt-1 text-xs text-slate-600 max-w-2xl">
              Registro de clientes con membresía mensual, control de fechas de corte, vehículos asociados, celdas asignadas y cobro de renovaciones periódicas.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setShowNewClientModal(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-md transition-colors shadow-xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Nuevo Mensualista</span>
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="mt-6 pt-4 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Buscar por nombre, documento o placa..."
              className="w-full pl-9 pr-3 py-1.5 border border-slate-300 rounded-md focus:outline-hidden focus:ring-1 focus:ring-slate-900"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-medium">Estado:</span>
            {['TODAS', 'ACTIVA', 'POR_VENCER', 'VENCIDA'].map(st => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-2.5 py-1 rounded transition-colors ${
                  statusFilter === st
                    ? 'bg-slate-900 text-white font-semibold'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {st === 'TODAS' ? 'Todos' : st === 'ACTIVA' ? 'Al Día' : st === 'POR_VENCER' ? 'Por Vencer' : 'Vencidas'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Clients List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredClients.map(client => (
          <div
            key={client.id}
            className="bg-white border border-slate-200 rounded-lg p-5 flex flex-col justify-between space-y-4 hover:border-slate-300 transition-colors"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">{client.fullName}</h3>
                  <div className="text-xs text-slate-500 font-mono">
                    {client.docType} {client.docNumber}
                  </div>
                </div>
                <div>{getStatusBadge(client.subscription.status)}</div>
              </div>

              {/* Contact info */}
              <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600">
                <div className="flex items-center gap-1.5 truncate">
                  <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{client.phone}</span>
                </div>
                <div className="flex items-center gap-1.5 truncate">
                  <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{client.email || 'Sin correo'}</span>
                </div>
              </div>

              {/* Vehicles & Cell */}
              <div className="p-3 bg-slate-50 rounded-md border border-slate-200 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">Vehículo Asociado:</span>
                  <span className="text-slate-700 font-semibold">
                    {client.assignedCellId ? `Celda Fija: ${client.assignedCellId}` : 'Celda Rotativa'}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  {client.vehicles.map((v, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <ColombianPlate plate={v.plate} vehicleType={v.type} size="sm" />
                      <span className="text-[11px] text-slate-600">
                        {v.brand} {v.model} ({v.color})
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Subscription details */}
              <div className="flex items-center justify-between text-xs pt-1">
                <div>
                  <span className="text-slate-500 block text-[10px]">Vigencia mensual:</span>
                  <span className="font-mono text-slate-800">
                    {formatDateOnly(client.subscription.startDate)} al {formatDateOnly(client.subscription.endDate)}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-slate-500 block text-[10px]">Canon mensual:</span>
                  <span className="font-mono font-bold text-slate-900">
                    {formatCOP(client.subscription.monthlyRate)}
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[10px] text-slate-400">
                Inscrito desde {formatDateOnly(client.createdAt)}
              </span>
              <button
                onClick={() => setRenewingClient(client)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-900 bg-slate-100 hover:bg-slate-200 rounded transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3 h-3 text-slate-700" />
                <span>Renovar Mensualidad</span>
              </button>
            </div>
          </div>
        ))}

        {filteredClients.length === 0 && (
          <div className="col-span-2 py-12 text-center text-slate-500 text-xs bg-white rounded-lg border border-slate-200">
            No se encontraron usuarios mensualistas con los filtros seleccionados.
          </div>
        )}
      </div>

      {/* Modal: New Client / Mensualista */}
      {showNewClientModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
              <div>
                <h3 className="text-base font-bold text-slate-900">Registrar Nuevo Mensualista</h3>
                <p className="text-xs text-slate-500">Contrato de estacionamiento mensual para Autos Colombia</p>
              </div>
              <button onClick={() => setShowNewClientModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateClient} className="p-6 space-y-4 text-xs">
              <div className="space-y-3">
                <div className="font-semibold text-slate-800 border-b pb-1">1. Datos Personales / Corporativos</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">Nombre Completo o Razón Social</label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={e => setFullName(e.target.value)}
                      placeholder="Ej. Juan Carlos Montoya"
                      className="w-full px-3 py-1.5 border border-slate-300 rounded"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block text-slate-600 font-medium mb-1">Tipo</label>
                      <select
                        value={docType}
                        onChange={e => setDocType(e.target.value as any)}
                        className="w-full px-2 py-1.5 border border-slate-300 rounded"
                      >
                        <option value="CC">C.C.</option>
                        <option value="CE">C.E.</option>
                        <option value="NIT">NIT</option>
                      </select>
                    </div>
                    <div className="col-span-2">
                      <label className="block text-slate-600 font-medium mb-1">Número de Doc.</label>
                      <input
                        type="text"
                        value={docNumber}
                        onChange={e => setDocNumber(e.target.value)}
                        placeholder="71234567"
                        className="w-full px-3 py-1.5 border border-slate-300 rounded"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">Teléfono Celular</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      placeholder="3101234567"
                      className="w-full px-3 py-1.5 border border-slate-300 rounded"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">Correo Electrónico</label>
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="usuario@email.com"
                      className="w-full px-3 py-1.5 border border-slate-300 rounded"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <div className="font-semibold text-slate-800 border-b pb-1">2. Datos del Vehículo y Celda</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">Placa</label>
                    <input
                      type="text"
                      value={plate}
                      onChange={e => setPlate(e.target.value.toUpperCase())}
                      placeholder="Ej. ABC123"
                      maxLength={7}
                      className="w-full px-3 py-1.5 font-mono font-bold uppercase border border-slate-300 rounded"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">Tipo de Vehículo</label>
                    <select
                      value={vehicleType}
                      onChange={e => {
                        const vt = e.target.value as VehicleType;
                        setVehicleType(vt);
                        setMonthlyRate(config.monthlyRates[vt]);
                      }}
                      className="w-full px-3 py-1.5 border border-slate-300 rounded"
                    >
                      <option value="AUTOMOVIL">Automóvil</option>
                      <option value="MOTO">Motocicleta</option>
                      <option value="CAMIONETA">Camioneta / SUV</option>
                      <option value="BICICLETA">Bicicleta</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">Marca</label>
                    <input
                      type="text"
                      value={vehicleBrand}
                      onChange={e => setVehicleBrand(e.target.value)}
                      placeholder="Chevrolet, Renault..."
                      className="w-full px-2.5 py-1.5 border border-slate-300 rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">Modelo</label>
                    <input
                      type="text"
                      value={vehicleModel}
                      onChange={e => setVehicleModel(e.target.value)}
                      placeholder="2023..."
                      className="w-full px-2.5 py-1.5 border border-slate-300 rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">Color</label>
                    <input
                      type="text"
                      value={vehicleColor}
                      onChange={e => setVehicleColor(e.target.value)}
                      placeholder="Gris, Blanco..."
                      className="w-full px-2.5 py-1.5 border border-slate-300 rounded"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-600 font-medium mb-1">Asignar Celda Fija (Opcional)</label>
                  <select
                    value={assignedCellId}
                    onChange={e => setAssignedCellId(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded"
                  >
                    <option value="">Celda Rotativa (Cualquier celda libre al ingresar)</option>
                    {cells.filter(c => c.status === 'DISPONIBLE' || c.status === 'RESERVADA_MENSUAL').map(c => (
                      <option key={c.id} value={c.id}>
                        Celda {c.code} ({c.zone.replace('ZONA_', '')})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <div className="font-semibold text-slate-800 border-b pb-1">3. Tarifa y Pago Inicial</div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">Canon Mensual (COP)</label>
                    <input
                      type="number"
                      value={monthlyRate}
                      onChange={e => setMonthlyRate(Number(e.target.value))}
                      step={5000}
                      className="w-full px-3 py-1.5 font-mono font-bold border border-slate-300 rounded"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">Medio de Pago</label>
                    <select
                      value={initialPaymentMethod}
                      onChange={e => setInitialPaymentMethod(e.target.value as PaymentMethod)}
                      className="w-full px-3 py-1.5 border border-slate-300 rounded"
                    >
                      <option value="EFECTIVO">Efectivo</option>
                      <option value="NEQUI">Nequi</option>
                      <option value="DAVIPLATA">Daviplata</option>
                      <option value="TRANSFERENCIA">Transferencia Bancolombia</option>
                      <option value="TARJETA_DEBITO">Tarjeta Débito</option>
                      <option value="TARJETA_CREDITO">Tarjeta Crédito</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="recPayment"
                    checked={recordInitialPayment}
                    onChange={e => setRecordInitialPayment(e.target.checked)}
                    className="rounded border-slate-300"
                  />
                  <label htmlFor="recPayment" className="text-slate-700">
                    Asentar pago del primer mes de una vez y generar Recibo de Caja
                  </label>
                </div>
              </div>

              <div className="pt-3 border-t flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowNewClientModal(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded shadow-xs"
                >
                  Guardar y Activar Mensualidad
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Renew Subscription */}
      {renewingClient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-sm border border-slate-200 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">Renovar Mensualidad</h3>
              <button onClick={() => setRenewingClient(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 bg-slate-50 rounded border border-slate-200 text-xs space-y-1">
              <div className="font-semibold text-slate-900">{renewingClient.fullName}</div>
              <div className="text-slate-500 font-mono">
                Placa: {renewingClient.vehicles[0]?.plate || '-'} · {renewingClient.docType} {renewingClient.docNumber}
              </div>
              <div className="text-slate-600">
                Vence actual: <strong>{formatDateOnly(renewingClient.subscription.endDate)}</strong>
              </div>
            </div>

            <form onSubmit={handleExecuteRenewal} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 font-medium mb-1">Meses a Renovar</label>
                <select
                  value={renewalMonths}
                  onChange={e => setRenewalMonths(Number(e.target.value))}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded font-bold"
                >
                  <option value={1}>1 Mes</option>
                  <option value={2}>2 Meses</option>
                  <option value={3}>3 Meses (Trimestral)</option>
                  <option value={6}>6 Meses (Semestral)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Medio de Pago</label>
                <select
                  value={renewalPaymentMethod}
                  onChange={e => setRenewalPaymentMethod(e.target.value as PaymentMethod)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded"
                >
                  <option value="EFECTIVO">Efectivo</option>
                  <option value="NEQUI">Nequi</option>
                  <option value="DAVIPLATA">Daviplata</option>
                  <option value="TRANSFERENCIA">Transferencia Bancolombia</option>
                  <option value="TARJETA_DEBITO">Tarjeta Débito</option>
                  <option value="TARJETA_CREDITO">Tarjeta Crédito</option>
                </select>
              </div>

              <div className="p-3 bg-slate-900 text-white rounded flex justify-between items-center font-mono">
                <span className="text-xs text-slate-300">Total a Cobrar:</span>
                <span className="text-base font-bold text-emerald-400">
                  {formatCOP(renewingClient.subscription.monthlyRate * renewalMonths)}
                </span>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setRenewingClient(null)}
                  className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded"
                >
                  Confirmar Cobro y Extender
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
