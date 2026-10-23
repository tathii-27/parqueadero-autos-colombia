import React, { useState } from 'react';
import { useParking } from '../context/ParkingContext';
import { IncidentSeverity, IncidentStatus, IncidentType, VehicleIncident } from '../types/parking';
import { ColombianPlate } from './ColombianPlate';
import { formatDateTime } from '../utils/formatters';
import { 
  AlertOctagon, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Filter, 
  Plus, 
  Search, 
  ShieldAlert, 
  X 
} from 'lucide-react';

interface IncidentsViewProps {
  initialPlate?: string;
  initialCellId?: string;
  onClearInitialValues?: () => void;
}

export const IncidentsView: React.FC<IncidentsViewProps> = ({
  initialPlate = '',
  initialCellId = '',
  onClearInitialValues,
}) => {
  const { incidents, activeEntries, createIncident, updateIncidentStatus } = useParking();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('TODAS');
  const [severityFilter, setSeverityFilter] = useState<string>('TODAS');
  const [showNewModal, setShowNewModal] = useState(Boolean(initialPlate));
  const [resolvingIncident, setResolvingIncident] = useState<VehicleIncident | null>(null);

  // New incident form state
  const [plate, setPlate] = useState(initialPlate);
  const [cellId, setCellId] = useState(initialCellId);
  const [incidentType, setIncidentType] = useState<IncidentType>('RAYON_GOLPE');
  const [severity, setSeverity] = useState<IncidentSeverity>('MEDIA');
  const [description, setDescription] = useState('');
  const [reportedBy, setReportedBy] = useState('');
  const [clientPhone, setClientPhone] = useState('');

  // Resolution state
  const [resolutionNotes, setResolutionNotes] = useState('');

  // Auto-fill cell if plate matches active vehicle
  const handlePlateChange = (val: string) => {
    const cleaned = val.toUpperCase().replace(/[^A-Z0-9]/g, '');
    setPlate(cleaned);
    const active = activeEntries.find(
      e => e.plate.toUpperCase().replace(/[^A-Z0-9]/g, '') === cleaned
    );
    if (active) {
      setCellId(active.cellId);
    }
  };

  const handleCreateIncident = (e: React.FormEvent) => {
    e.preventDefault();
    if (!plate.trim() || !description.trim()) return;

    createIncident({
      plate: plate.trim().toUpperCase(),
      cellId: cellId || undefined,
      type: incidentType,
      severity,
      description: description.trim(),
      reportedBy: reportedBy.trim() || 'Operador de Turno',
      clientPhone: clientPhone.trim() || undefined,
    });

    setPlate('');
    setCellId('');
    setDescription('');
    setShowNewModal(false);
    if (onClearInitialValues) onClearInitialValues();
  };

  const handleExecuteResolution = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resolvingIncident) return;

    updateIncidentStatus(
      resolvingIncident.id,
      'RESUELTA',
      resolutionNotes.trim() || 'Incidencia revisada y resuelta con el cliente o equipo de custodia.'
    );

    setResolvingIncident(null);
    setResolutionNotes('');
  };

  const filteredIncidents = incidents.filter(inc => {
    const q = search.toLowerCase();
    const matchesSearch =
      !q ||
      inc.code.toLowerCase().includes(q) ||
      inc.plate.toLowerCase().includes(q) ||
      inc.description.toLowerCase().includes(q);

    const matchesStatus = statusFilter === 'TODAS' || inc.status === statusFilter;
    const matchesSeverity = severityFilter === 'TODAS' || inc.severity === severityFilter;

    return matchesSearch && matchesStatus && matchesSeverity;
  });

  const getIncidentTypeLabel = (type: IncidentType) => {
    switch (type) {
      case 'RAYON_GOLPE':
        return 'Rayón o Golpe Previo/Posterior';
      case 'FUGA_LIQUIDOS':
        return 'Fuga de Líquidos (Aceite/Agua)';
      case 'LUCES_ENCENDIDAS':
        return 'Luces Encendidas';
      case 'ALARMA_ACTIVA':
        return 'Alarma Sonora Continua';
      case 'OBJETO_VALOR':
        return 'Objeto de Valor en Custodia';
      case 'PUERTA_VENTANA':
        return 'Puerta o Ventana Abierta';
      case 'MECANICO':
        return 'Falla Mecánica / Llanta Baja';
      case 'OTRO':
        return 'Otra Novedad Operativa';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-lg p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-semibold tracking-wider text-slate-500 uppercase">
              Custodia y Libro de Patio · Autos Colombia
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Gestión de Novedades e Incidencias
            </h1>
            <p className="mt-1 text-xs text-slate-600 max-w-2xl">
              Registro formal de novedades ocurridas sobre vehículos dentro del parqueadero (rayones, fugas de fluidos, luces encendidas o pertenencias en custodia) para trazabilidad y amparo legal.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setShowNewModal(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-md transition-colors shadow-xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Registrar Novedad</span>
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="mt-6 pt-4 border-t border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Buscar por placa, código o descripción..."
              className="w-full pl-9 pr-3 py-1.5 border border-slate-300 rounded-md focus:outline-hidden focus:ring-1 focus:ring-slate-900"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-slate-500 font-medium">Estado:</span>
            {['TODAS', 'PENDIENTE', 'NOTIFICADO', 'RESUELTA'].map(st => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-2.5 py-1 rounded transition-colors ${
                  statusFilter === st
                    ? 'bg-slate-900 text-white font-semibold'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {st === 'TODAS' ? 'Todas' : st === 'PENDIENTE' ? 'Pendientes' : st === 'NOTIFICADO' ? 'Notificadas' : 'Resueltas'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Incidents Grid */}
      <div className="space-y-3">
        {filteredIncidents.map(inc => {
          const isPending = inc.status !== 'RESUELTA';
          return (
            <div
              key={inc.id}
              className={`bg-white border rounded-lg p-5 transition-colors ${
                isPending ? 'border-amber-200' : 'border-slate-200'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs font-bold bg-slate-100 px-2 py-0.5 rounded text-slate-900 border border-slate-200">
                    {inc.code}
                  </span>
                  <ColombianPlate plate={inc.plate} size="sm" />
                  {inc.cellId && (
                    <span className="text-xs font-semibold text-slate-700">
                      Celda {inc.cellId}
                    </span>
                  )}
                  <span className="text-xs font-medium text-slate-800">
                    · {getIncidentTypeLabel(inc.type)}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <span
                    className={`px-2 py-0.5 rounded font-semibold text-[11px] ${
                      inc.severity === 'ALTA'
                        ? 'bg-red-50 text-red-700 border border-red-200'
                        : inc.severity === 'MEDIA'
                        ? 'bg-amber-50 text-amber-800 border border-amber-200'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    Severidad {inc.severity}
                  </span>

                  <span
                    className={`px-2 py-0.5 rounded font-semibold text-[11px] ${
                      inc.status === 'RESUELTA'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : inc.status === 'NOTIFICADO'
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : 'bg-amber-50 text-amber-800 border border-amber-200'
                    }`}
                  >
                    {inc.status}
                  </span>
                </div>
              </div>

              {/* Body */}
              <div className="py-3 text-xs text-slate-700 leading-relaxed">
                {inc.description}
              </div>

              {/* Resolution details if available */}
              {inc.resolutionNotes && (
                <div className="p-2.5 bg-emerald-50/60 rounded border border-emerald-200 text-xs text-emerald-900 space-y-0.5 mb-2">
                  <span className="font-semibold block">Resolución / Solución:</span>
                  <p>{inc.resolutionNotes}</p>
                </div>
              )}

              {/* Footer info & Actions */}
              <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-slate-500">
                <div>
                  Reportado el {formatDateTime(inc.date)} por <span className="font-medium text-slate-700">{inc.reportedBy}</span>
                </div>

                <div className="flex items-center gap-2">
                  {isPending && (
                    <button
                      onClick={() => setResolvingIncident(inc)}
                      className="px-3 py-1 font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded transition-colors"
                    >
                      Marcar como Resuelta
                    </button>
                  )}
                  {inc.status === 'PENDIENTE' && (
                    <button
                      onClick={() => updateIncidentStatus(inc.id, 'NOTIFICADO')}
                      className="px-2.5 py-1 text-slate-700 hover:bg-slate-100 border border-slate-200 rounded transition-colors"
                    >
                      Notificado al Cliente
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {filteredIncidents.length === 0 && (
          <div className="bg-white p-8 rounded-lg border border-slate-200 text-center text-xs text-slate-500">
            No se encontraron novedades registradas con los criterios seleccionados.
          </div>
        )}
      </div>

      {/* Modal: New Incident */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md border border-slate-200 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">Registrar Novedad sobre Vehículo</h3>
                <p className="text-xs text-slate-500">Libro de incidencias de patio y custodia</p>
              </div>
              <button
                onClick={() => {
                  setShowNewModal(false);
                  if (onClearInitialValues) onClearInitialValues();
                }}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateIncident} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Placa del Vehículo</label>
                  <input
                    type="text"
                    value={plate}
                    onChange={e => handlePlateChange(e.target.value)}
                    placeholder="Ej. HNE612"
                    maxLength={7}
                    className="w-full px-3 py-1.5 font-mono font-bold uppercase border border-slate-300 rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Celda de Parqueo</label>
                  <input
                    type="text"
                    value={cellId}
                    onChange={e => setCellId(e.target.value.toUpperCase())}
                    placeholder="Ej. A-01"
                    className="w-full px-3 py-1.5 border border-slate-300 rounded uppercase font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Tipo de Novedad</label>
                  <select
                    value={incidentType}
                    onChange={e => setIncidentType(e.target.value as IncidentType)}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded"
                  >
                    <option value="RAYON_GOLPE">Rayón o Golpe</option>
                    <option value="FUGA_LIQUIDOS">Fuga de Líquidos</option>
                    <option value="LUCES_ENCENDIDAS">Luces Encendidas</option>
                    <option value="ALARMA_ACTIVA">Alarma Activa</option>
                    <option value="OBJETO_VALOR">Objeto de Valor</option>
                    <option value="PUERTA_VENTANA">Ventana/Puerta Abierta</option>
                    <option value="MECANICO">Falla Mecánica/Llanta</option>
                    <option value="OTRO">Otro</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Severidad</label>
                  <select
                    value={severity}
                    onChange={e => setSeverity(e.target.value as IncidentSeverity)}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded"
                  >
                    <option value="BAJA">Baja</option>
                    <option value="MEDIA">Media</option>
                    <option value="ALTA">Alta</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Descripción Detallada</label>
                <textarea
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Describa el hecho ocurrido, ubicación del daño o detalle de la observación..."
                  rows={3}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded resize-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Reportado Por</label>
                  <input
                    type="text"
                    value={reportedBy}
                    onChange={e => setReportedBy(e.target.value)}
                    placeholder="Operador Turno Mañana..."
                    className="w-full px-3 py-1.5 border border-slate-300 rounded"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Teléfono Contacto Cliente</label>
                  <input
                    type="tel"
                    value={clientPhone}
                    onChange={e => setClientPhone(e.target.value)}
                    placeholder="3101234567"
                    className="w-full px-3 py-1.5 border border-slate-300 rounded"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t">
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded"
                >
                  Guardar Novedad
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Resolve Incident */}
      {resolvingIncident && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-sm border border-slate-200 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">Solucionar Novedad {resolvingIncident.code}</h3>
              <button onClick={() => setResolvingIncident(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600">{resolvingIncident.description}</p>

            <form onSubmit={handleExecuteResolution} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Notas de Cierre / Solución</label>
                <textarea
                  value={resolutionNotes}
                  onChange={e => setResolutionNotes(e.target.value)}
                  placeholder="Detalle cómo se atendió la novedad (ej: cliente apagó luces, pertenencia devuelta, acuerdo de rayón previo...)"
                  rows={3}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded resize-none"
                  required
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setResolvingIncident(null)}
                  className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded"
                >
                  Cerrar como Resuelta
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
