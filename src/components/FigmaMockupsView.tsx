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
import {
  Screen1EntradaMockup,
  Screen2TicketMockup,
  Screen3BusquedaMockup,
  Screen4SalidaCobroMockup,
  Screen5ConfirmacionSalidaMockup
} from './FigmaScreenMockups';

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

export const FIGMA_PROTOTYPE_URL = 'https://www.figma.com/proto/KqmKxldrSK9RND8iz1Si8o/Parqueadero-Autos-Colombia?node-id=2011-3791&p=f&t=rAJnrMkW641cLTh8-1&scaling=scale-down&content-scaling=fixed&page-id=0%3A1';

const MOCKUPS: MockupDefinition[] = [
  {
    id: 'mockup-1-entrada',
    title: 'Pantalla 1: Registro de Entrada de Vehículos',
    subtitle: 'Captura ágil de placa RUNT colombiana, detección de mensualistas y asignación de celda',
    imageSrc: '/mockup_1_registro_entrada.svg',
    associatedStories: ['HU-01', 'HU-02', 'HU-03', 'HU-04'],
    targetDevice: 'Desktop (1440px)',
    figmaFrameName: 'Frame 1: Caseta - Registro de Entrada',
    description: 'Diseño para el operador de acceso que permite digitar la placa colombiana (formato estándar AAA-123 o motos AAA-12D), detectar de forma automática si cuenta con un contrato activo de mensualidad ($0 COP), filtrar y sugerir celdas compatibles por zona (A: Autos, B: Motos, C: Pesados) y documentar el estado físico de recepción.',
    keyComponents: [
      'Input de Placa con mayúsculas automáticas y formateo asistido (ej. HNE-612)',
      'Selector de Categoría Vehicular (Automóvil, Motocicleta, Camioneta/SUV, Pesado)',
      'Selector dinámico de celdas filtrado por zona según la tipología vehicular',
      'Detector automático de modalidad (Rotativo Ocasional vs Abonado Mensualista)',
      'Campo de notas de inspección previa (daños, rayones o accesorios dejados en custodia)'
    ],
    uxHighlights: [
      'Flujo de registro operable en menos de 10 segundos con atajos de teclado y Enter.',
      'Prevención de errores: Validación en tiempo real de formato RUNT y bloqueo de duplicados (RN-01).',
      'Etiquetas de alto contraste para máxima legibilidad en cabinas de patio.'
    ],
    designSpecs: {
      dimensions: '1440 x 900 px (16:9)',
      primaryAction: 'CONFIRMAR INGRESO Y EMITIR TICKET (#10B981)',
      colorPalette: ['#0f172a (Superficie)', '#10b981 (Confirmar)', '#3b82f6 (Placa RUNT)', '#f59e0b (Inspección)']
    }
  },
  {
    id: 'mockup-2-ticket',
    title: 'Pantalla 2: Confirmación de Ingreso y Emisión de Ticket',
    subtitle: 'Comprobante físico y térmico numerado PAC-2026-XXXX con código QR y datos fiscales',
    imageSrc: '/mockup_2_confirmacion_ticket.svg',
    associatedStories: ['HU-04', 'HU-05'],
    targetDevice: 'Terminal de Caja (1024px)',
    figmaFrameName: 'Frame 2: Terminal - Emisión de Ticket Térmico',
    description: 'Comprobante formal emitido al conductor tras registrar su ingreso. Cumple estrictamente con la Ley 1480 de 2011 (Estatuto del Consumidor de Colombia), incluyendo NIT del parqueadero, timestamp exacto de entrada, código QR para validación rápida en salida, celda asignada y póliza de responsabilidad civil.',
    keyComponents: [
      'Encabezado fiscal corporativo: Autos Colombia S.A.S. · NIT 900.842.125-4',
      'Número consecutivo único e inmutable (PAC-2026-1042)',
      'Placa vehicular en tipografía tipificada de alto impacto (HNE612)',
      'Fecha y hora exacta de acceso con marca de tiempo ISO',
      'Código QR bidimensional escaneable en la cabina de salida',
      'Detalle de inspección inicial y cláusula legal de custodia'
    ],
    uxHighlights: [
      'Estilos de impresión térmica adaptativa para papel estándar de 58mm y 80mm ESC/POS.',
      'Apertura automática de la vista previa con un solo clic o atajo Ctrl+P.',
      'Soporte digital para envío por correo o consulta en pantalla táctil.'
    ],
    designSpecs: {
      dimensions: '1024 x 768 px (4:3)',
      primaryAction: 'IMPRIMIR TICKET TÉRMICO (#0F172A)',
      colorPalette: ['#0f172a (Texto)', '#10b981 (QR/Validado)', '#ffffff (Papel Térmico)', '#64748b (Fiscal)']
    }
  },
  {
    id: 'mockup-3-busqueda',
    title: 'Pantalla 3: Búsqueda y Monitoreo de Vehículos Activos',
    subtitle: 'Panel de control de patio en tiempo real con buscador predictivo por placa y mapa de aforo',
    imageSrc: '/mockup_3_busqueda_activos.svg',
    associatedStories: ['HU-06', 'HU-11'],
    targetDevice: 'Desktop (1440px)',
    figmaFrameName: 'Frame 3: Patio - Búsqueda de Vehículos Activos',
    description: 'Tablero de control para supervisión de estancia. Permite localizar cualquier vehículo en menos de 100 milisegundos mediante un buscador insensible a mayúsculas/minúsculas, visualizando en tarjetas interactivas el tiempo transcurrido en minutos, la celda ocupada, el estado de la mensualidad y el botón de liquidación directa.',
    keyComponents: [
      'Buscador reactivo instantáneo por placa, número de ticket o celda',
      'Semáforo de aforo en vivo: 154 Libres, 89 Ocupadas, 12 Reservadas',
      'Tarjetas de vehículos activos con contador dinámico de tiempo transcurrido',
      'Filtros rápidos por tipología: Todos, Automóviles, Motos, Camionetas',
      'Acceso directo con un clic a "Liquidar Salida"'
    ],
    uxHighlights: [
      'Respuesta predictiva en tiempo real sin recargar la página.',
      'Código cromático según tiempo de permanencia para detectar vehículos con sobretiempo.',
      'Diseño responsivo operable tanto en pantallas panorámicas como en tablets de patio.'
    ],
    designSpecs: {
      dimensions: '1440 x 900 px (16:9)',
      primaryAction: 'LIQUIDAR SALIDA (#2563EB)',
      colorPalette: ['#0f172a (Sidebar)', '#10b981 (Disponible)', '#ef4444 (Ocupado)', '#3b82f6 (Búsqueda)']
    }
  },
  {
    id: 'mockup-4-salida-cobro',
    title: 'Pantalla 4: Registro de Salida y Liquidación del Cobro',
    subtitle: 'Cálculo exacto de permanencia, aplicación de gracia (15 min), alerta de novedades y calculadora de cambio',
    imageSrc: '/mockup_4_salida_cobro.svg',
    associatedStories: ['HU-06', 'HU-07', 'HU-10'],
    targetDevice: 'Terminal de Caja (1024px)',
    figmaFrameName: 'Frame 4: Taquilla - Liquidación y Cobro de Salida',
    description: 'Pantalla nuclear del cajero de salida. Al seleccionar un vehículo, computa la permanencia exacta, aplica la regla de gracia de 15 minutos ($0 COP), desglosa horas y fracciones facturables según la tarifa en COP, advierte si existen novedades abiertas y provee una calculadora de cambio para pagos en efectivo o botones para pasarelas digitales (Nequi, Daviplata, Tarjeta).',
    keyComponents: [
      'Cronómetro de permanencia: Hora entrada vs Hora salida y Total minutos',
      'Indicador de Periodo de Gracia: Exoneración automática si permanencia ≤ 15 min',
      'Alerta visual ámbar en caso de novedades pendientes en el automotor (Regla RN-14)',
      'Selector multicanal de pago: Efectivo, Nequi, Daviplata, Tarjeta Débito/Crédito',
      'Calculadora de cambio: Input "Monto Recibido" con cálculo automático de "Devuelta"'
    ],
    uxHighlights: [
      'Elimina descuadres de caja mostrando el cambio exacto a entregar en billetes grandes.',
      'Exige acuse de recibo si hay incidencias físicas previas antes de abrir la talanquera.',
      'Soporte táctil con teclas numéricas gigantes para terminales POS.'
    ],
    designSpecs: {
      dimensions: '1024 x 768 px (4:3)',
      primaryAction: 'CONFIRMAR PAGO Y REGISTRAR SALIDA (#059669)',
      colorPalette: ['#064e3b (Encabezado)', '#10b981 (Completar Pago)', '#f59e0b (Alerta Novedad)', '#f8fafc (Fondo)']
    }
  },
  {
    id: 'mockup-5-confirmacion-salida',
    title: 'Pantalla 5: Confirmación de Salida y Recibo Fiscal de Caja',
    subtitle: 'Liberación reactiva de celda a DISPONIBLE, apertura de talanquera y recibo REC-XXXXXX Ley 1480',
    imageSrc: '/mockup_5_confirmacion_salida.svg',
    associatedStories: ['HU-08', 'HU-09'],
    targetDevice: 'Terminal de Caja (1024px)',
    figmaFrameName: 'Frame 5: Salida Exitosa y Recibo Fiscal',
    description: 'Pantalla final del ciclo de salida. Confirma el asentamiento contable del pago en la base de datos, emite el recibo oficial de caja consecutivo REC-XXXXXX con validez tributaria, actualiza instantáneamente la celda en el mapa a color verde (DISPONIBLE) y activa el comando de apertura de talanquera vehicular.',
    keyComponents: [
      'Banner de éxito: "Salida Completada Exitosamente · Talanquera Abierta"',
      'Recibo oficial consecutivo REC-008920 con fecha, hora, medio de pago y cajero',
      'Desglose tributario: Subtotal, Base gravable e IVA régimen simplificado',
      'Indicador de Celda Liberada: Transición inmediata a DISPONIBLE (verde)',
      'Botones de acción: Imprimir Recibo, Enviar por Email o Volver a Operaciones'
    ],
    uxHighlights: [
      'Cierre visual inequívoco que garantiza que el automotor ya no figura en patio.',
      'Generación de documento auditable conforme al Estatuto Tributario y Ley 1480.',
      'Animación de confirmación de celda desocupada que reduce tiempos muertos en taquilla.'
    ],
    designSpecs: {
      dimensions: '1024 x 768 px (4:3)',
      primaryAction: 'IMPRIMIR RECIBO FISCAL (#0F172A)',
      colorPalette: ['#10b981 (Éxito)', '#0f172a (Recibo)', '#3b82f6 (Nueva Operación)', '#ffffff (Fondo)']
    }
  }
];

export const FigmaMockupsView: React.FC = () => {
  const [selectedMockupId, setSelectedMockupId] = useState<string>(MOCKUPS[0].id);
  const [copiedTokens, setCopiedTokens] = useState(false);

  const [viewMode, setViewMode] = useState<'ui' | 'image'>('ui');

  const renderMockupPreview = (id: string) => {
    switch (id) {
      case 'mockup-1-entrada':
        return <Screen1EntradaMockup />;
      case 'mockup-2-ticket':
        return <Screen2TicketMockup />;
      case 'mockup-3-busqueda':
        return <Screen3BusquedaMockup />;
      case 'mockup-4-salida-cobro':
        return <Screen4SalidaCobroMockup />;
      case 'mockup-5-confirmacion-salida':
        return <Screen5ConfirmacionSalidaMockup />;
      default:
        return <Screen1EntradaMockup />;
    }
  };

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

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <a
              href={FIGMA_PROTOTYPE_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-violet-600 hover:bg-violet-700 rounded-md transition-colors shadow-xs cursor-pointer"
              title="Abrir prototipo interactivo directamente en Figma"
            >
              <Figma className="w-4 h-4" />
              <span>Abrir Prototipo en Figma</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-80" />
            </a>

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
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-md transition-colors shadow-xs cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Descargar Mockup</span>
            </a>
          </div>
        </div>

        {/* Prototype Alert Banner */}
        <div className="mt-4 p-3 bg-violet-50/60 border border-violet-200 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-violet-900">
            <span className="p-1 rounded bg-violet-100 text-violet-700">
              <Figma className="w-4 h-4" />
            </span>
            <div>
              <span className="font-bold">Prototipo Interactivo Oficial: </span>
              <span className="text-violet-700 font-mono text-[11px] break-all">
                node-id=2011-3791 (Parqueadero-Autos-Colombia)
              </span>
            </div>
          </div>
          <a
            href={FIGMA_PROTOTYPE_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 font-semibold text-violet-700 hover:text-violet-900 hover:underline shrink-0"
          >
            <span>Probar navegación en vivo en Figma</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Mockup Selector Tabs - 5 Screens */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5 mt-5 border-t border-slate-100 pt-4">
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
              <div className="flex items-center gap-2">
                <div className="flex bg-slate-100 p-0.5 rounded-md border border-slate-200 text-xs">
                  <button
                    onClick={() => setViewMode('ui')}
                    className={`px-2.5 py-1 rounded font-medium transition-colors cursor-pointer ${
                      viewMode === 'ui'
                        ? 'bg-white text-violet-700 shadow-xs font-semibold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Mockup UI Renderizado (Figma)
                  </button>
                  <button
                    onClick={() => setViewMode('image')}
                    className={`px-2.5 py-1 rounded font-medium transition-colors cursor-pointer ${
                      viewMode === 'image'
                        ? 'bg-white text-violet-700 shadow-xs font-semibold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Captura JPG
                  </button>
                </div>

                <a
                  href={currentMockup.imageSrc}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-2.5 py-1.5 rounded transition-colors"
                  title="Abrir imagen en pestaña nueva"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span>Pantalla Completa</span>
                </a>
              </div>
            </div>

            {/* Mockup Display Container: Dedicated UI or Static Image */}
            {viewMode === 'ui' ? (
              <div className="rounded-xl overflow-hidden border border-slate-700 shadow-lg">
                {renderMockupPreview(currentMockup.id)}
              </div>
            ) : (
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
            )}

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
