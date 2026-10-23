import React, { useState } from 'react';
import { 
  Download, 
  ExternalLink, 
  Eye, 
  Figma, 
  FileText, 
  Grid, 
  Layers, 
  Palette, 
  ShieldCheck, 
  Sparkles, 
  Check, 
  Copy,
  Layout,
  Smartphone,
  Monitor,
  Maximize2
} from 'lucide-react';
import { USER_STORIES } from '../data/userStoriesData';

interface MockupDefinition {
  id: string;
  title: string;
  subtitle: string;
  imageSrc: string;
  associatedStories: string[]; // ['HU-01', 'HU-02', 'HU-06', 'HU-07']
  targetDevice: 'Desktop (1440px)' | 'Terminal de Caja (1024px)' | 'Tablet / Móvil Operador (768px)';
  figmaFrameName: string;
  description: string;
  keyComponents: string[];
  uxHighlights: string[];
  designSpecs: {
    dimensions: string;
    primaryAction: string;
    colorPalette: string[];
  };
}

const MOCKUPS: MockupDefinition[] = [
  {
    id: 'mockup-dashboard',
    title: 'Pantalla 1: Dashboard y Registro Rápido de Entrada',
    subtitle: 'Terminal de acceso vehicular con tablero interactivo de celdas en vivo',
    imageSrc: '/figma_mockup_dashboard.jpg',
    associatedStories: ['HU-01', 'HU-02', 'HU-03', 'HU-06', 'HU-07', 'HU-08'],
    targetDevice: 'Desktop (1440px)',
    figmaFrameName: 'Frame 1: Desktop - Terminal de Entrada',
    description: 'Diseño para el operador de acceso que permite digitar la placa colombiana, detectar si es mensualista o vehículo rotativo, asignar celda por zonas y visualizar en un semáforo interactivo las celdas disponibles (verde), ocupadas (rojo) y reservadas (naranja).',
    keyComponents: [
      'Input de Placa con mayúsculas automáticas y formateo (HNE612)',
      'Selector de Zona (Zona A, B, C) y Tipo de Automotor (Carro, Moto, Pesado)',
      'Matriz interactiva de celdas 6x4 con contadores en tiempo real (154 Libres, 89 Ocupadas)',
      'Tabla de últimos 5 ingresos con hora, tipo y badge de estado ACTIVO',
      'Widget de cuadre de caja diaria con desglose Efectivo vs Digital'
    ],
    uxHighlights: [
      'Flujo de registro completable en menos de 10 segundos con teclado numérico y Enter.',
      'Semaforización de alto contraste accesible según lineamientos WCAG 2.1 AA.',
      'Sidebar lateral con navegación clara y acceso directo a Novedades y Pagos.'
    ],
    designSpecs: {
      dimensions: '1440 x 900 px (16:9)',
      primaryAction: 'REGISTRAR INGRESO (Verde #10B981)',
      colorPalette: ['#0f172a (Sidebar)', '#10b981 (Disponible)', '#ef4444 (Ocupado)', '#f59e0b (Reservado)']
    }
  },
  {
    id: 'mockup-pago',
    title: 'Pantalla 2: Liquidación de Salida, Ticket QR y Cobro Multimedio',
    subtitle: 'Estación de caja y pasarela de cobro para emisión de comprobante y apertura de talanquera',
    imageSrc: '/figma_mockup_pago_salida.jpg',
    associatedStories: ['HU-04', 'HU-05', 'HU-15', 'HU-16', 'HU-17'],
    targetDevice: 'Terminal de Caja (1024px)',
    figmaFrameName: 'Frame 2: Terminal - Liquidación y Salida',
    description: 'Interfaz de cobro ágil al egreso. Muestra el ticket térmico generado con QR, desglose de tarifa base y minutos adicionales, cálculo dinámico de cambio en efectivo y botones de pago rápido (Efectivo, Nequi, Daviplata, Tarjeta).',
    keyComponents: [
      'Ticket térmico digital PAC-2026-1042 con código QR escaneable',
      'Desglose auditado: Tarifa Base $2.500 COP + Tiempo Extra 90 min $9.000 COP + IVA $1.000 COP = $12.500 COP',
      'Selector de método de pago con botones grandes táctiles (Efectivo, Nequi, Daviplata, Tarjeta)',
      'Campo "Efectivo Recibido" con cálculo instantáneo de cambio ($7.500 COP)',
      'Botón maestro con confirmación de apertura de talanquera electromecánica'
    ],
    uxHighlights: [
      'Evita errores de conteo de dinero calculando la devuelta en tiempo real.',
      'Admite validación de comprobante digital o salida sin ticket mediante escáner de placa.',
      'Botón secundario para emisión de Factura Electrónica legal.'
    ],
    designSpecs: {
      dimensions: '1440 x 810 px (16:9)',
      primaryAction: 'Completar Pago y Abrir Talanquera (#059669)',
      colorPalette: ['#064e3b (Ticket Header)', '#10b981 (Primary)', '#f8fafc (Surface)', '#0f172a (Text)']
    }
  },
  {
    id: 'mockup-novedad',
    title: 'Pantalla 3: Inspección Vehicular y Reporte de Novedades',
    subtitle: 'Módulo de auditoría de daños preexistentes con silueta anatómica y foto',
    imageSrc: '/figma_mockup_novedades.jpg',
    associatedStories: ['HU-12', 'HU-13', 'HU-14'],
    targetDevice: 'Tablet / Móvil Operador (768px)',
    figmaFrameName: 'Frame 3: Tablet - Inspección de Novedades',
    description: 'Pantalla diseñada para el vigilante u operador de patio. Permite inspeccionar el vehículo al entrar, marcar sobre el plano anatómico 2D del auto la ubicación de golpes o rayones, adjuntar foto de evidencia y tipificar la severidad para blindar jurídicamente al parqueadero.',
    keyComponents: [
      'Diagrama vectorial del vehículo con puntos interactivos de impacto (Bumper y Puerta)',
      'Identificador de placa en badge destacado (KLY872)',
      'Selector de Tipo de Daño (Rayón, Golpe, Desperfecto)',
      'Badges de Severidad con código cromático (Baja, Media, Alta)',
      'Contenedor de foto de evidencia fotográfica adjunta tomada con la cámara',
      'Campo de texto para descripción circunstancial',
      'Botón de registro y despacho de notificación al propietario'
    ],
    uxHighlights: [
      'Mapeo visual intuitivo de daños para evitar disputas y reclamos por rayones preexistentes.',
      'Soporte táctil optimizado para tablets de inspección en patio.',
      'Generación de constancia asociada al ticket de entrada del cliente.'
    ],
    designSpecs: {
      dimensions: '1440 x 810 px (16:9)',
      primaryAction: 'Guardar Novedad y Notificar Propietario (#2563eb)',
      colorPalette: ['#1e40af (Blue Accent)', '#ef4444 (Daño / Alto)', '#f59e0b (Medio)', '#10b981 (Bajo)']
    }
  }
];

export const FigmaMockupsView: React.FC = () => {
  const [selectedMockupId, setSelectedMockupId] = useState<string>(MOCKUPS[0].id);
  const [copiedTokens, setCopiedTokens] = useState(false);

  const currentMockup = MOCKUPS.find(m => m.id === selectedMockupId) || MOCKUPS[0];

  const handleCopyFigmaTokens = () => {
    const figmaTokens = `/* PARQUEADERO AUTOS COLOMBIA - FIGMA DESIGN TOKENS */
/* Color Palette */
--color-primary: #10B981; /* Emerald 500 */
--color-primary-dark: #059669; /* Emerald 600 */
--color-surface-sidebar: #0F172A; /* Slate 900 */
--color-surface-card: #FFFFFF;
--color-surface-bg: #F8FAFC; /* Slate 50 */
--color-border: #E2E8F0; /* Slate 200 */
--color-text-main: #0F172A;
--color-text-muted: #64748B;
--color-status-available: #10B981;
--color-status-occupied: #EF4444;
--color-status-reserved: #F59E0B;
--color-accent-blue: #2563EB;

/* Typography Scale */
Display: 32px / Bold (Inter)
H1: 24px / Bold (Inter)
H2: 18px / SemiBold (Inter)
Body: 14px / Regular (Inter)
Caption: 12px / Medium (Inter)
Code/Plate: 14px / Bold (Roboto Mono / JetBrains Mono)

/* Spacing Grid */
Base Unit: 8px (8px, 16px, 24px, 32px, 48px, 64px)
Border Radius: Card (12px), Button (8px), Tag (6px), Input (8px)
Elevations: Soft Shadow (0 4px 6px -1px rgb(0 0 0 / 0.05), 0 2px 4px -2px rgb(0 0 0 / 0.05))`;

    navigator.clipboard.writeText(figmaTokens);
    setCopiedTokens(true);
    setTimeout(() => setCopiedTokens(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 rounded-lg p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-semibold bg-violet-50 text-violet-700 border border-violet-200">
                <Figma className="w-3.5 h-3.5" />
                Diseño UI / UX · Prototipado en Figma
              </span>
              <span className="text-[11px] text-slate-500 font-medium">
                Metodología Scrum · 18 Historias de Usuario
              </span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Mockups de Historias de Usuario en Figma
            </h1>
            <p className="mt-1 text-sm text-slate-600 max-w-3xl">
              Diseños de alta fidelidad organizados por épicas del sistema "Parqueadero Autos Colombia", listos para exportar, presentar ante la IU Digital o recrear en Figma.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={handleCopyFigmaTokens}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors cursor-pointer"
              title="Copiar variables y tokens CSS/Figma al portapapeles"
            >
              {copiedTokens ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-700">¡Tokens Copiados!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-slate-600" />
                  <span>Copiar Design Tokens</span>
                </>
              )}
            </button>
            <a
              href={currentMockup.imageSrc}
              download={`${currentMockup.id}.jpg`}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-md transition-colors shadow-xs cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Descargar Mockup HD</span>
            </a>
          </div>
        </div>

        {/* Mockup Selector Tabs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-6 border-t border-slate-100 pt-4">
          {MOCKUPS.map((mockup) => {
            const isSelected = selectedMockupId === mockup.id;
            return (
              <button
                key={mockup.id}
                onClick={() => setSelectedMockupId(mockup.id)}
                className={`p-3.5 rounded-lg border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'border-violet-600 bg-violet-50/40 shadow-xs ring-1 ring-violet-200'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className={`text-[10px] font-bold font-mono px-1.5 py-0.5 rounded ${
                    isSelected ? 'bg-violet-700 text-white' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {mockup.targetDevice}
                  </span>
                  <span className="text-[10px] font-semibold text-violet-700 font-mono">
                    {mockup.associatedStories.length} HU asociadas
                  </span>
                </div>
                <h3 className="text-xs font-bold text-slate-900 line-clamp-1">
                  {mockup.title}
                </h3>
                <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                  {mockup.subtitle}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Showcase of Selected Mockup */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: High Fidelity Visual Mockup */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white border border-slate-200 rounded-lg p-5 space-y-3">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <span className="text-xs font-mono font-bold text-violet-700 block">
                  {currentMockup.figmaFrameName}
                </span>
                <h2 className="text-base font-bold text-slate-900">
                  {currentMockup.title}
                </h2>
              </div>
              <a
                href={currentMockup.imageSrc}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-2.5 py-1.5 rounded transition-colors"
                title="Abrir imagen completa en pestaña nueva"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span>Ver a pantalla completa</span>
              </a>
            </div>

            {/* Mockup Image Container */}
            <div className="relative rounded-lg overflow-hidden border border-slate-300 bg-slate-950 shadow-md group">
              <img
                src={currentMockup.imageSrc}
                alt={currentMockup.title}
                className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-[1.01]"
              />
              <div className="absolute bottom-3 right-3 bg-slate-900/80 backdrop-blur-sm px-2.5 py-1 rounded text-[10px] font-mono text-white flex items-center gap-2">
                <span>Resolución: {currentMockup.designSpecs.dimensions}</span>
                <span>•</span>
                <span>Figma Ready</span>
              </div>
            </div>

            {/* Key Components Pills */}
            <div className="space-y-2 pt-2">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wide block">
                Componentes de Interfaz Diseñados (Figma Design System):
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {currentMockup.keyComponents.map((comp, idx) => (
                  <div key={idx} className="p-2 bg-slate-50 border border-slate-200 rounded flex items-start gap-2 text-[11px] text-slate-700">
                    <span className="text-violet-600 font-bold font-mono">0{idx + 1}.</span>
                    <span>{comp}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Figma Prototyping & Recreation Guide */}
          <div className="bg-slate-900 text-white rounded-lg p-5 space-y-3 text-xs">
            <div className="flex items-center gap-2 text-violet-400 font-bold text-sm">
              <Figma className="w-4 h-4" />
              <span>Cómo usar este Mockup en Figma para tu entrega de la IU Digital</span>
            </div>
            <p className="text-slate-300 leading-relaxed text-[11px]">
              Para presentar este mockup en tu archivo de Figma o pegarlo en el informe:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
              <div className="bg-slate-800/80 p-3 rounded border border-slate-700">
                <span className="font-bold text-white block mb-1">Paso 1: Crear Frame</span>
                <span className="text-slate-400 text-[11px]">
                  En Figma presiona la tecla <strong>F</strong> y selecciona un Frame de <strong>Desktop (1440 x 900)</strong> o crea las dimensiones indicadas.
                </span>
              </div>
              <div className="bg-slate-800/80 p-3 rounded border border-slate-700">
                <span className="font-bold text-white block mb-1">Paso 2: Insertar la Imagen</span>
                <span className="text-slate-400 text-[11px]">
                  Descarga la imagen con el botón superior y en Figma presiona <strong>Ctrl + Shift + K</strong> para colocar la imagen directamente en tu Frame.
                </span>
              </div>
              <div className="bg-slate-800/80 p-3 rounded border border-slate-700">
                <span className="font-bold text-white block mb-1">Paso 3: Interacciones</span>
                <span className="text-slate-400 text-[11px]">
                  En la pestaña <em>Prototype</em> de Figma, enlaza los botones ("REGISTRAR INGRESO", "PAGAR") entre las pantallas con transición <em>Smart Animate</em>.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Associated User Stories & Acceptance Criteria */}
        <div className="lg:col-span-4 space-y-4">
          {/* Associated User Stories List */}
          <div className="bg-white border border-slate-200 rounded-lg p-5 space-y-4">
            <div className="border-b pb-3">
              <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block font-mono">
                Trazabilidad Scrum
              </span>
              <h3 className="text-sm font-bold text-slate-900 mt-0.5">
                Historias de Usuario Cumplidas
              </h3>
              <p className="text-[11px] text-slate-500">
                Requisitos ágiles que se validan visualmente en esta pantalla:
              </p>
            </div>

            <div className="space-y-3">
              {currentMockup.associatedStories.map(huId => {
                const story = USER_STORIES.find(s => s.id === huId);
                if (!story) return null;
                return (
                  <div key={huId} className="p-3 bg-slate-50 border border-slate-200 rounded-md text-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-slate-950 bg-white px-2 py-0.5 rounded border border-slate-200">
                        {story.id}
                      </span>
                      <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 font-semibold">
                        {story.storyPoints} Puntos · {story.priority}
                      </span>
                    </div>

                    <h4 className="font-bold text-slate-900 text-[11px] leading-snug">
                      {story.title}
                    </h4>

                    <div className="text-[11px] text-slate-600 bg-white p-2 rounded border border-slate-100 font-sans space-y-1">
                      <p><strong>Como:</strong> {story.role}</p>
                      <p><strong>Quiero:</strong> {story.action}</p>
                      <p><strong>Para:</strong> {story.benefit}</p>
                    </div>

                    {story.acceptanceCriteria.length > 0 && (
                      <div className="pt-1 text-[10px] text-slate-500">
                        <span className="font-semibold text-slate-700 block mb-0.5">Criterio Gherkin:</span>
                        <div className="italic bg-amber-50/50 p-1.5 rounded border border-amber-200/50 text-slate-700">
                          <strong>Dado:</strong> {story.acceptanceCriteria[0].given} <br/>
                          <strong>Cuando:</strong> {story.acceptanceCriteria[0].when} <br/>
                          <strong>Entonces:</strong> {story.acceptanceCriteria[0].then}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Design Specifications Card */}
          <div className="bg-white border border-slate-200 rounded-lg p-5 space-y-3 text-xs">
            <h4 className="font-bold text-slate-900 uppercase tracking-wide text-[11px]">
              Ficha Técnica del Prototipo
            </h4>
            <div className="space-y-2 text-[11px] text-slate-700">
              <div className="flex items-center justify-between border-b pb-1">
                <span className="text-slate-500">Dispositivo Base:</span>
                <span className="font-semibold text-slate-900">{currentMockup.targetDevice}</span>
              </div>
              <div className="flex items-center justify-between border-b pb-1">
                <span className="text-slate-500">Acción Principal (CTA):</span>
                <span className="font-mono text-emerald-700 font-semibold">{currentMockup.designSpecs.primaryAction}</span>
              </div>
              <div className="flex items-center justify-between border-b pb-1">
                <span className="text-slate-500">Grid Base:</span>
                <span className="font-semibold text-slate-900">8pt System (Auto Layout)</span>
              </div>
            </div>

            <div className="pt-2">
              <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1.5">
                Paleta de Color del Frame:
              </span>
              <div className="space-y-1">
                {currentMockup.designSpecs.colorPalette.map((col, i) => (
                  <div key={i} className="flex items-center gap-2 text-[10px] font-mono text-slate-600">
                    <span
                      className="w-3.5 h-3.5 rounded-full border border-slate-300 shrink-0"
                      style={{ backgroundColor: col.split(' ')[0] }}
                    />
                    <span>{col}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
