import React, { useState } from 'react';
import { useParking } from '../context/ParkingContext';
import { BusinessConfig } from '../types/parking';
import { formatCOP } from '../utils/formatters';
import { AlertTriangle, Check, RefreshCw, Save, ShieldAlert } from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { config, updateConfig, resetToDemoData } = useParking();

  const [formConfig, setFormConfig] = useState<BusinessConfig>(config);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateConfig(formConfig);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-lg p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-semibold tracking-wider text-slate-500 uppercase">
              Parámetros Operativos y Comerciales
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Configuración y Tarifas
            </h1>
            <p className="mt-1 text-xs text-slate-600 max-w-2xl">
              Parametrización de tarifas horarias, planes de mensualidades, periodos de gracia y datos fiscales de facturación de Parqueadero Autos Colombia.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setShowResetConfirm(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-red-700 bg-slate-50 hover:bg-red-50 border border-slate-200 rounded transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Restaurar Datos Demo</span>
            </button>
          </div>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-900 flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>Configuración guardada exitosamente y aplicada a todas las liquidaciones en curso.</span>
        </div>
      )}

      {/* Settings Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Hourly rates */}
        <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-4">
          <h2 className="text-sm font-bold text-slate-900 border-b pb-2">
            1. Tarifas Horarias para Parqueo Ocasional (COP)
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Automóvil / Sedán (/hora)
              </label>
              <input
                type="number"
                value={formConfig.hourlyRates.AUTOMOVIL}
                onChange={e =>
                  setFormConfig({
                    ...formConfig,
                    hourlyRates: {
                      ...formConfig.hourlyRates,
                      AUTOMOVIL: Number(e.target.value),
                    },
                  })
                }
                step={500}
                className="w-full px-3 py-1.5 border border-slate-300 rounded font-mono font-bold"
                required
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Motocicleta (/hora)
              </label>
              <input
                type="number"
                value={formConfig.hourlyRates.MOTO}
                onChange={e =>
                  setFormConfig({
                    ...formConfig,
                    hourlyRates: {
                      ...formConfig.hourlyRates,
                      MOTO: Number(e.target.value),
                    },
                  })
                }
                step={500}
                className="w-full px-3 py-1.5 border border-slate-300 rounded font-mono font-bold"
                required
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Camioneta / SUV (/hora)
              </label>
              <input
                type="number"
                value={formConfig.hourlyRates.CAMIONETA}
                onChange={e =>
                  setFormConfig({
                    ...formConfig,
                    hourlyRates: {
                      ...formConfig.hourlyRates,
                      CAMIONETA: Number(e.target.value),
                    },
                  })
                }
                step={500}
                className="w-full px-3 py-1.5 border border-slate-300 rounded font-mono font-bold"
                required
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Bicicleta (/hora o día)
              </label>
              <input
                type="number"
                value={formConfig.hourlyRates.BICICLETA}
                onChange={e =>
                  setFormConfig({
                    ...formConfig,
                    hourlyRates: {
                      ...formConfig.hourlyRates,
                      BICICLETA: Number(e.target.value),
                    },
                  })
                }
                step={100}
                className="w-full px-3 py-1.5 border border-slate-300 rounded font-mono font-bold"
                required
              />
            </div>
          </div>

          <div className="pt-2">
            <label className="block text-slate-700 font-semibold text-xs mb-1">
              Tiempo de Gracia Libre de Costo (Minutos)
            </label>
            <input
              type="number"
              value={formConfig.gracePeriodMinutes}
              onChange={e =>
                setFormConfig({
                  ...formConfig,
                  gracePeriodMinutes: Number(e.target.value),
                })
              }
              className="w-36 px-3 py-1.5 border border-slate-300 rounded text-xs font-mono font-bold"
              min={0}
              max={60}
              required
            />
            <span className="text-[11px] text-slate-500 block mt-1">
              Permanencia inferior a este tiempo no genera cobro ($0 COP).
            </span>
          </div>
        </div>

        {/* Monthly Subscription Rates */}
        <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-4">
          <h2 className="text-sm font-bold text-slate-900 border-b pb-2">
            2. Planes Estándar de Mensualidad (COP)
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Mensualidad Automóvil
              </label>
              <input
                type="number"
                value={formConfig.monthlyRates.AUTOMOVIL}
                onChange={e =>
                  setFormConfig({
                    ...formConfig,
                    monthlyRates: {
                      ...formConfig.monthlyRates,
                      AUTOMOVIL: Number(e.target.value),
                    },
                  })
                }
                step={5000}
                className="w-full px-3 py-1.5 border border-slate-300 rounded font-mono font-bold"
                required
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Mensualidad Moto
              </label>
              <input
                type="number"
                value={formConfig.monthlyRates.MOTO}
                onChange={e =>
                  setFormConfig({
                    ...formConfig,
                    monthlyRates: {
                      ...formConfig.monthlyRates,
                      MOTO: Number(e.target.value),
                    },
                  })
                }
                step={5000}
                className="w-full px-3 py-1.5 border border-slate-300 rounded font-mono font-bold"
                required
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Mensualidad Camioneta / SUV
              </label>
              <input
                type="number"
                value={formConfig.monthlyRates.CAMIONETA}
                onChange={e =>
                  setFormConfig({
                    ...formConfig,
                    monthlyRates: {
                      ...formConfig.monthlyRates,
                      CAMIONETA: Number(e.target.value),
                    },
                  })
                }
                step={5000}
                className="w-full px-3 py-1.5 border border-slate-300 rounded font-mono font-bold"
                required
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Mensualidad Bicicleta
              </label>
              <input
                type="number"
                value={formConfig.monthlyRates.BICICLETA}
                onChange={e =>
                  setFormConfig({
                    ...formConfig,
                    monthlyRates: {
                      ...formConfig.monthlyRates,
                      BICICLETA: Number(e.target.value),
                    },
                  })
                }
                step={5000}
                className="w-full px-3 py-1.5 border border-slate-300 rounded font-mono font-bold"
                required
              />
            </div>
          </div>
        </div>

        {/* Business details */}
        <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-4">
          <h2 className="text-sm font-bold text-slate-900 border-b pb-2">
            3. Datos de la Razón Social y Facturación
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Nombre Comercial</label>
              <input
                type="text"
                value={formConfig.name}
                onChange={e => setFormConfig({ ...formConfig, name: e.target.value })}
                className="w-full px-3 py-1.5 border border-slate-300 rounded font-semibold"
                required
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">NIT / Identificación Tributaria</label>
              <input
                type="text"
                value={formConfig.nit}
                onChange={e => setFormConfig({ ...formConfig, nit: e.target.value })}
                className="w-full px-3 py-1.5 border border-slate-300 rounded font-mono font-semibold"
                required
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Dirección Física</label>
              <input
                type="text"
                value={formConfig.address}
                onChange={e => setFormConfig({ ...formConfig, address: e.target.value })}
                className="w-full px-3 py-1.5 border border-slate-300 rounded"
                required
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Ciudad y Departamento</label>
              <input
                type="text"
                value={formConfig.city}
                onChange={e => setFormConfig({ ...formConfig, city: e.target.value })}
                className="w-full px-3 py-1.5 border border-slate-300 rounded"
                required
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Teléfonos de Atención</label>
              <input
                type="text"
                value={formConfig.phone}
                onChange={e => setFormConfig({ ...formConfig, phone: e.target.value })}
                className="w-full px-3 py-1.5 border border-slate-300 rounded"
                required
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Régimen y Resolución</label>
              <input
                type="text"
                value={formConfig.regime}
                onChange={e => setFormConfig({ ...formConfig, regime: e.target.value })}
                className="w-full px-3 py-1.5 border border-slate-300 rounded"
                required
              />
            </div>
          </div>
        </div>

        {/* Submit button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-6 py-2.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-md transition-colors shadow-xs cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Guardar y Aplicar Cambios</span>
          </button>
        </div>
      </form>

      {/* Reset Confirmation Dialog */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-sm border border-slate-200 p-5 space-y-4">
            <div className="flex items-center gap-3 text-amber-600">
              <ShieldAlert className="w-6 h-6 shrink-0" />
              <h3 className="text-sm font-bold text-slate-900">¿Restaurar datos iniciales?</h3>
            </div>
            <p className="text-xs text-slate-600">
              Esto restablecerá las celdas, vehículos activos, clientes mensualistas, novedades y pagos al conjunto de demostración original de Autos Colombia.
            </p>
            <div className="pt-2 flex justify-end gap-2 text-xs">
              <button
                type="button"
                onClick={() => setShowResetConfirm(false)}
                className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => {
                  resetToDemoData();
                  setShowResetConfirm(false);
                }}
                className="px-4 py-1.5 font-semibold text-white bg-red-600 hover:bg-red-700 rounded"
              >
                Sí, Restaurar Demo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
