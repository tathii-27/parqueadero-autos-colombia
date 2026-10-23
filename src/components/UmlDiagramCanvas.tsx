import React, { useRef, useState } from 'react';
import { Download, Check, MousePointer, Info, ArrowUpRight, HelpCircle } from 'lucide-react';

interface UmlDiagramCanvasProps {
  onDownloadMdj: () => void;
}

export const UmlDiagramCanvas: React.FC<UmlDiagramCanvasProps> = ({ onDownloadMdj }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [downloadSvgSuccess, setDownloadSvgSuccess] = useState(false);
  const [selectedRelationship, setSelectedRelationship] = useState<string | null>(null);

  const handleDownloadPng = () => {
    if (!svgRef.current) return;
    try {
      const svgElement = svgRef.current;
      const svgString = new XMLSerializer().serializeToString(svgElement);
      const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
      const URL = window.URL || window.webkitURL || window;
      const blobURL = URL.createObjectURL(svgBlob);
      const image = new Image();

      image.onload = () => {
        // High-resolution scale (2.5x -> 2700 x 2100 px) for crisp academic reports
        const scale = 2.5;
        const canvas = document.createElement('canvas');
        canvas.width = 1080 * scale;
        canvas.height = 840 * scale;
        const context = canvas.getContext('2d');
        if (context) {
          context.fillStyle = '#ffffff';
          context.fillRect(0, 0, canvas.width, canvas.height);
          context.imageSmoothingEnabled = true;
          context.imageSmoothingQuality = 'high';
          context.drawImage(image, 0, 0, canvas.width, canvas.height);
          const pngUrl = canvas.toDataURL('image/png');
          const downloadLink = document.createElement('a');
          downloadLink.href = pngUrl;
          downloadLink.download = 'Diagrama_Clases_Parqueadero_Autos_Colombia.png';
          document.body.appendChild(downloadLink);
          downloadLink.click();
          downloadLink.remove();
          setDownloadSuccess(true);
          setTimeout(() => setDownloadSuccess(false), 3000);
        }
      };
      image.src = blobURL;
    } catch {
      handleDownloadSvg();
    }
  };

  const handleDownloadSvg = () => {
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', '/Diagrama_Clases_Parqueadero_Autos_Colombia.svg');
    downloadAnchor.setAttribute('download', 'Diagrama_Clases_Parqueadero_Autos_Colombia.svg');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    setDownloadSvgSuccess(true);
    setTimeout(() => setDownloadSvgSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Step by step callout explaining the physical gesture in StarUML */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-5 text-slate-800 space-y-3">
        <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
          <HelpCircle className="w-5 h-5 text-amber-700 shrink-0" />
          <span>¿Por qué cuesta poner las líneas en StarUML? (El truco del ratón)</span>
        </div>
        <p className="text-xs text-amber-950 leading-relaxed">
          En StarUML <strong>NO</strong> se hace clic en una caja y luego clic en la otra. Si haces eso, la línea se cancela. El gesto físico exacto es:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs pt-1">
          <div className="bg-white p-3 rounded border border-amber-200/80 shadow-xs">
            <div className="font-bold text-amber-800 mb-1 flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-800 inline-flex items-center justify-center text-[11px] font-mono">1</span>
              <span>Selecciona la herramienta</span>
            </div>
            <p className="text-slate-600 text-[11px]">
              En la barra izquierda (<strong>TOOLBOX</strong>), haz un solo clic en <strong>Directed Association</strong> (o <strong>Association</strong>). Tu cursor se volverá una cruz (+).
            </p>
          </div>

          <div className="bg-white p-3 rounded border border-amber-200/80 shadow-xs">
            <div className="font-bold text-amber-800 mb-1 flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-800 inline-flex items-center justify-center text-[11px] font-mono">2</span>
              <span>Clic sostenido (¡No sueltes!)</span>
            </div>
            <p className="text-slate-600 text-[11px]">
              Pon el mouse dentro de la primera caja (ej. <strong>Vehiculo</strong>). Presiona el botón izquierdo y <strong>MANTÉNLO PRESIONADO</strong> mientras mueves el ratón.
            </p>
          </div>

          <div className="bg-white p-3 rounded border border-amber-200/80 shadow-xs">
            <div className="font-bold text-amber-800 mb-1 flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-800 inline-flex items-center justify-center text-[11px] font-mono">3</span>
              <span>Suelta dentro del destino</span>
            </div>
            <p className="text-slate-600 text-[11px]">
              Lleva el puntero hasta adentro de la segunda caja (ej. <strong>EntradaVehiculo</strong>) y <strong>RECIÉN AHÍ SUELTA</strong> el botón del mouse. ¡La línea aparecerá sola!
            </p>
          </div>
        </div>

        <div className="pt-1 flex items-center justify-between text-xs text-amber-900 border-t border-amber-200/60 font-medium">
          <span>✨ <strong>Truco extra:</strong> O si no quieres lidiar con StarUML, abajo tienes el diagrama 100% terminado con todas las líneas para <strong>descargar la imagen en 1 clic</strong> y pegarla directo en Word.</span>
        </div>
      </div>

      {/* Main Diagram Canvas Card */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span>Diagrama de Clases del Dominio con Conexiones y Multiplicidades</span>
              <span className="text-[11px] font-mono font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                100% Conectado (UML 2.5)
              </span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Basado exactamente en la distribución de 7 clases que organizaste en StarUML.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleDownloadPng}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-md transition-colors shadow-xs cursor-pointer"
              title="Descargar imagen en PNG de alta resolución (2700x2100 px) para Word o PDF"
            >
              {downloadSuccess ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>¡PNG Descargado!</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Descargar PNG (Alta Resolución)</span>
                </>
              )}
            </button>

            <button
              onClick={handleDownloadSvg}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-md transition-colors cursor-pointer shadow-2xs"
              title="Descargar formato vectorial SVG (sin pérdida de calidad)"
            >
              {downloadSvgSuccess ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-700">¡SVG Descargado!</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" />
                  <span>Descargar SVG Vectorial</span>
                </>
              )}
            </button>

            <button
              onClick={onDownloadMdj}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 rounded-md transition-colors cursor-pointer"
              title="Descargar archivo .mdj nativo para abrir en StarUML"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Descargar StarUML (.mdj)</span>
            </button>
          </div>
        </div>

        {/* SVG Diagram Canvas */}
        <div className="overflow-x-auto border border-slate-200 rounded-lg bg-slate-50/50 p-2">
          <svg
            ref={svgRef}
            viewBox="0 0 1080 840"
            className="w-full max-w-[1080px] h-auto bg-white rounded shadow-inner mx-auto"
            style={{ minWidth: '850px' }}
          >
            <defs>
              {/* Arrow Marker for Directed Associations */}
              <marker
                id="uml-arrow"
                viewBox="0 0 10 10"
                refX="9"
                refY="5"
                markerWidth="7"
                markerHeight="7"
                orient="auto-start-reverse"
              >
                <path d="M 0 1 L 10 5 L 0 9 z" fill="#1e293b" />
              </marker>

              {/* Grid pattern background */}
              <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#f1f5f9" strokeWidth="1" />
              </pattern>
            </defs>

            {/* Background grid */}
            <rect width="1080" height="840" fill="url(#grid)" />

            {/* ================= CONNECTOR LINES & ARROWS ================= */}

            {/* 1. Vehiculo (x=270, y=140) -> EntradaVehiculo (x=380, y=140) */}
            <g
              className="cursor-pointer transition-opacity"
              onClick={() => setSelectedRelationship('Vehiculo -> EntradaVehiculo')}
            >
              <line
                x1="270"
                y1="140"
                x2="378"
                y2="140"
                stroke="#1e293b"
                strokeWidth="2"
                markerEnd="url(#uml-arrow)"
              />
              <rect x="290" y="118" width="60" height="18" fill="#ffffff" rx="3" stroke="#cbd5e1" strokeWidth="1" />
              <text x="320" y="131" fontSize="10" fill="#0f172a" fontWeight="600" textAnchor="middle" fontFamily="monospace">
                registra
              </text>
              <text x="278" y="134" fontSize="10" fill="#475569" fontWeight="600" fontFamily="sans-serif">1</text>
              <text x="365" y="134" fontSize="10" fill="#475569" fontWeight="600" fontFamily="sans-serif">0..*</text>
            </g>

            {/* 2. EntradaVehiculo (x=660, y=140) -> CeldaParqueo (x=760, y=140) */}
            <g
              className="cursor-pointer transition-opacity"
              onClick={() => setSelectedRelationship('EntradaVehiculo -> CeldaParqueo')}
            >
              <line
                x1="660"
                y1="140"
                x2="758"
                y2="140"
                stroke="#1e293b"
                strokeWidth="2"
                markerEnd="url(#uml-arrow)"
              />
              <rect x="680" y="118" width="55" height="18" fill="#ffffff" rx="3" stroke="#cbd5e1" strokeWidth="1" />
              <text x="707" y="131" fontSize="10" fill="#0f172a" fontWeight="600" textAnchor="middle" fontFamily="monospace">
                asigna
              </text>
              <text x="668" y="134" fontSize="10" fill="#475569" fontWeight="600" fontFamily="sans-serif">0..1</text>
              <text x="745" y="134" fontSize="10" fill="#475569" fontWeight="600" fontFamily="sans-serif">1</text>
            </g>

            {/* 3. Vehiculo (x=150, y=250) -> NovedadVehiculo (x=150, y=360) */}
            <g
              className="cursor-pointer transition-opacity"
              onClick={() => setSelectedRelationship('Vehiculo -> NovedadVehiculo')}
            >
              <line
                x1="150"
                y1="250"
                x2="150"
                y2="358"
                stroke="#1e293b"
                strokeWidth="2"
                markerEnd="url(#uml-arrow)"
              />
              <rect x="156" y="295" width="60" height="18" fill="#ffffff" rx="3" stroke="#cbd5e1" strokeWidth="1" />
              <text x="186" y="308" fontSize="10" fill="#0f172a" fontWeight="600" textAnchor="middle" fontFamily="monospace">
                presenta
              </text>
              <text x="135" y="270" fontSize="10" fill="#475569" fontWeight="600" fontFamily="sans-serif">1</text>
              <text x="135" y="348" fontSize="10" fill="#475569" fontWeight="600" fontFamily="sans-serif">0..*</text>
            </g>

            {/* 4. UsuarioMensualista (x=380, y=420) -> Vehiculo (x=270, y=220) via polyline */}
            <g
              className="cursor-pointer transition-opacity"
              onClick={() => setSelectedRelationship('UsuarioMensualista -> Vehiculo')}
            >
              <path
                d="M 380 430 L 320 430 L 320 220 L 272 220"
                fill="none"
                stroke="#1e293b"
                strokeWidth="2"
                markerEnd="url(#uml-arrow)"
              />
              <rect x="290" y="315" width="55" height="18" fill="#ffffff" rx="3" stroke="#cbd5e1" strokeWidth="1" />
              <text x="317" y="328" fontSize="10" fill="#0f172a" fontWeight="600" textAnchor="middle" fontFamily="monospace">
                posee
              </text>
              <text x="360" y="424" fontSize="10" fill="#475569" fontWeight="600" fontFamily="sans-serif">1</text>
              <text x="278" y="214" fontSize="10" fill="#475569" fontWeight="600" fontFamily="sans-serif">1..*</text>
            </g>

            {/* 5. UsuarioMensualista (x=660, y=440) -> SuscripcionMensual (x=760, y=440) */}
            <g
              className="cursor-pointer transition-opacity"
              onClick={() => setSelectedRelationship('UsuarioMensualista -> SuscripcionMensual')}
            >
              <line
                x1="660"
                y1="440"
                x2="758"
                y2="440"
                stroke="#1e293b"
                strokeWidth="2"
                markerEnd="url(#uml-arrow)"
              />
              <rect x="682" y="420" width="58" height="18" fill="#ffffff" rx="3" stroke="#cbd5e1" strokeWidth="1" />
              <text x="711" y="433" fontSize="10" fill="#0f172a" fontWeight="600" textAnchor="middle" fontFamily="monospace">
                contrata
              </text>
              <text x="670" y="434" fontSize="10" fill="#475569" fontWeight="600" fontFamily="sans-serif">1</text>
              <text x="745" y="434" fontSize="10" fill="#475569" fontWeight="600" fontFamily="sans-serif">1</text>
            </g>

            {/* 6. EntradaVehiculo (x=460, y=345) -> Pago (x=460, y=608) */}
            <g
              className="cursor-pointer transition-opacity"
              onClick={() => setSelectedRelationship('EntradaVehiculo -> Pago')}
            >
              <path
                d="M 470 345 L 470 540 L 470 608"
                fill="none"
                stroke="#1e293b"
                strokeWidth="2"
                markerEnd="url(#uml-arrow)"
              />
              <rect x="476" y="555" width="55" height="18" fill="#ffffff" rx="3" stroke="#cbd5e1" strokeWidth="1" />
              <text x="503" y="568" fontSize="10" fill="#0f172a" fontWeight="600" textAnchor="middle" fontFamily="monospace">
                liquida
              </text>
              <text x="476" y="365" fontSize="10" fill="#475569" fontWeight="600" fontFamily="sans-serif">1</text>
              <text x="476" y="598" fontSize="10" fill="#475569" fontWeight="600" fontFamily="sans-serif">0..1</text>
            </g>

            {/* 7. SuscripcionMensual (x=880, y=520) -> Pago (x=660, y=700) via polyline */}
            <g
              className="cursor-pointer transition-opacity"
              onClick={() => setSelectedRelationship('SuscripcionMensual -> Pago')}
            >
              <path
                d="M 880 520 L 880 700 L 662 700"
                fill="none"
                stroke="#1e293b"
                strokeWidth="2"
                markerEnd="url(#uml-arrow)"
              />
              <rect x="740" y="682" width="55" height="18" fill="#ffffff" rx="3" stroke="#cbd5e1" strokeWidth="1" />
              <text x="767" y="695" fontSize="10" fill="#0f172a" fontWeight="600" textAnchor="middle" fontFamily="monospace">
                abona
              </text>
              <text x="888" y="540" fontSize="10" fill="#475569" fontWeight="600" fontFamily="sans-serif">1</text>
              <text x="670" y="694" fontSize="10" fill="#475569" fontWeight="600" fontFamily="sans-serif">1..*</text>
            </g>

            {/* ================= CLASS BOXES (UML Standard) ================= */}

            {/* 1. VEHICULO (x=30, y=40, w=240, h=210) */}
            <g id="box-vehiculo">
              <rect x="30" y="40" width="240" height="210" fill="#ffffff" stroke="#0f172a" strokeWidth="2" rx="4" />
              {/* Header */}
              <rect x="30" y="40" width="240" height="32" fill="#f8fafc" stroke="#0f172a" strokeWidth="1" />
              <text x="150" y="61" fontSize="13" fontWeight="bold" fill="#0f172a" textAnchor="middle" fontFamily="sans-serif">
                Vehiculo
              </text>
              {/* Attributes */}
              <text x="40" y="90" fontSize="10" fill="#0f172a" fontFamily="monospace">- placa: String</text>
              <text x="40" y="106" fontSize="10" fill="#0f172a" fontFamily="monospace">- tipo: TipoVehiculo</text>
              <text x="40" y="122" fontSize="10" fill="#0f172a" fontFamily="monospace">- marca: String</text>
              <text x="40" y="138" fontSize="10" fill="#0f172a" fontFamily="monospace">- modelo: String</text>
              <text x="40" y="154" fontSize="10" fill="#0f172a" fontFamily="monospace">- color: String</text>
              <line x1="30" y1="166" x2="270" y2="166" stroke="#0f172a" strokeWidth="1" />
              {/* Methods */}
              <text x="40" y="184" fontSize="10" fill="#0f172a" fontFamily="monospace">+ validarFormatoPlaca(placa): Bool</text>
              <text x="40" y="202" fontSize="10" fill="#0f172a" fontFamily="monospace">+ esParticular(): Boolean</text>
            </g>

            {/* 2. ENTRADA VEHICULO (x=380, y=30, w=280, h=315) */}
            <g id="box-entrada">
              <rect x="380" y="30" width="280" height="315" fill="#ffffff" stroke="#0f172a" strokeWidth="2" rx="4" />
              {/* Header */}
              <rect x="380" y="30" width="280" height="32" fill="#f8fafc" stroke="#0f172a" strokeWidth="1" />
              <text x="520" y="51" fontSize="13" fontWeight="bold" fill="#0f172a" textAnchor="middle" fontFamily="sans-serif">
                EntradaVehiculo
              </text>
              {/* Attributes */}
              <text x="390" y="78" fontSize="9.5" fill="#0f172a" fontFamily="monospace">- id: String</text>
              <text x="390" y="93" fontSize="9.5" fill="#0f172a" fontFamily="monospace">- numeroTicket: String</text>
              <text x="390" y="108" fontSize="9.5" fill="#0f172a" fontFamily="monospace">- placa: String</text>
              <text x="390" y="123" fontSize="9.5" fill="#0f172a" fontFamily="monospace">- tipoVehiculo: TipoVehiculo</text>
              <text x="390" y="138" fontSize="9.5" fill="#0f172a" fontFamily="monospace">- tipoServicio: TipoServicio</text>
              <text x="390" y="153" fontSize="9.5" fill="#0f172a" fontFamily="monospace">- celdaId: String</text>
              <text x="390" y="168" fontSize="9.5" fill="#0f172a" fontFamily="monospace">- horaEntrada: DateTime</text>
              <text x="390" y="183" fontSize="9.5" fill="#0f172a" fontFamily="monospace">- horaSalida: DateTime</text>
              <text x="390" y="198" fontSize="9.5" fill="#0f172a" fontFamily="monospace">- notasInspeccion: String</text>
              <text x="390" y="213" fontSize="9.5" fill="#0f172a" fontFamily="monospace">- estado: String</text>
              <text x="390" y="228" fontSize="9.5" fill="#0f172a" fontFamily="monospace">- totalMinutos: Integer</text>
              <text x="390" y="243" fontSize="9.5" fill="#0f172a" fontFamily="monospace">- montoLiquidado: Double</text>
              <line x1="380" y1="254" x2="660" y2="254" stroke="#0f172a" strokeWidth="1" />
              {/* Methods */}
              <text x="390" y="274" fontSize="9.5" fill="#0f172a" fontFamily="monospace">+ calcularMinutosTranscurridos(h): Int</text>
              <text x="390" y="294" fontSize="9.5" fill="#0f172a" fontFamily="monospace">+ finalizarEstadia(hSal, monto): Void</text>
            </g>

            {/* 3. CELDA PARQUEO (x=760, y=40, w=250, h=230) */}
            <g id="box-celda">
              <rect x="760" y="40" width="250" height="230" fill="#ffffff" stroke="#0f172a" strokeWidth="2" rx="4" />
              {/* Header */}
              <rect x="760" y="40" width="250" height="32" fill="#f8fafc" stroke="#0f172a" strokeWidth="1" />
              <text x="885" y="61" fontSize="13" fontWeight="bold" fill="#0f172a" textAnchor="middle" fontFamily="sans-serif">
                CeldaParqueo
              </text>
              {/* Attributes */}
              <text x="770" y="88" fontSize="10" fill="#0f172a" fontFamily="monospace">- id: String</text>
              <text x="770" y="104" fontSize="10" fill="#0f172a" fontFamily="monospace">- zona: String</text>
              <text x="770" y="120" fontSize="10" fill="#0f172a" fontFamily="monospace">- tipoPermitido: TipoVehiculo</text>
              <text x="770" y="136" fontSize="10" fill="#0f172a" fontFamily="monospace">- estado: EstadoCelda</text>
              <text x="770" y="152" fontSize="10" fill="#0f172a" fontFamily="monospace">- placaActual: String</text>
              <text x="770" y="168" fontSize="10" fill="#0f172a" fontFamily="monospace">- usuarioReservadoId: String</text>
              <line x1="760" y1="178" x2="1010" y2="178" stroke="#0f172a" strokeWidth="1" />
              {/* Methods */}
              <text x="770" y="196" fontSize="10" fill="#0f172a" fontFamily="monospace">+ ocupar(placa): Boolean</text>
              <text x="770" y="212" fontSize="10" fill="#0f172a" fontFamily="monospace">+ liberar(): Void</text>
              <text x="770" y="228" fontSize="10" fill="#0f172a" fontFamily="monospace">+ inhabilitarPorMantenimiento(): Void</text>
            </g>

            {/* 4. NOVEDAD VEHICULO (x=30, y=360, w=240, h=220) */}
            <g id="box-novedad">
              <rect x="30" y="360" width="240" height="220" fill="#ffffff" stroke="#0f172a" strokeWidth="2" rx="4" />
              {/* Header */}
              <rect x="30" y="360" width="240" height="32" fill="#f8fafc" stroke="#0f172a" strokeWidth="1" />
              <text x="150" y="381" fontSize="13" fontWeight="bold" fill="#0f172a" textAnchor="middle" fontFamily="sans-serif">
                NovedadVehiculo
              </text>
              {/* Attributes */}
              <text x="40" y="408" fontSize="10" fill="#0f172a" fontFamily="monospace">- id: String</text>
              <text x="40" y="424" fontSize="10" fill="#0f172a" fontFamily="monospace">- codigo: String</text>
              <text x="40" y="440" fontSize="10" fill="#0f172a" fontFamily="monospace">- placa: String</text>
              <text x="40" y="456" fontSize="10" fill="#0f172a" fontFamily="monospace">- tipo: String</text>
              <text x="40" y="472" fontSize="10" fill="#0f172a" fontFamily="monospace">- severidad: String</text>
              <text x="40" y="488" fontSize="10" fill="#0f172a" fontFamily="monospace">- descripcion: String</text>
              <text x="40" y="504" fontSize="10" fill="#0f172a" fontFamily="monospace">- estado: String</text>
              <line x1="30" y1="516" x2="270" y2="516" stroke="#0f172a" strokeWidth="1" />
              {/* Methods */}
              <text x="40" y="536" fontSize="10" fill="#0f172a" fontFamily="monospace">+ notificarPropietario(tel): Void</text>
              <text x="40" y="554" fontSize="10" fill="#0f172a" fontFamily="monospace">+ resolver(solucion): Void</text>
            </g>

            {/* 5. USUARIO MENSUALISTA (x=380, y=375, w=280, h=215) */}
            <g id="box-usuario">
              <rect x="380" y="375" width="280" height="215" fill="#ffffff" stroke="#0f172a" strokeWidth="2" rx="4" />
              {/* Header */}
              <rect x="380" y="375" width="280" height="32" fill="#f8fafc" stroke="#0f172a" strokeWidth="1" />
              <text x="520" y="396" fontSize="13" fontWeight="bold" fill="#0f172a" textAnchor="middle" fontFamily="sans-serif">
                UsuarioMensualista
              </text>
              {/* Attributes */}
              <text x="390" y="422" fontSize="9.5" fill="#0f172a" fontFamily="monospace">- id: String</text>
              <text x="390" y="437" fontSize="9.5" fill="#0f172a" fontFamily="monospace">- nombreCompleto: String</text>
              <text x="390" y="452" fontSize="9.5" fill="#0f172a" fontFamily="monospace">- tipoDocumento: String</text>
              <text x="390" y="467" fontSize="9.5" fill="#0f172a" fontFamily="monospace">- numeroDocumento: String</text>
              <text x="390" y="482" fontSize="9.5" fill="#0f172a" fontFamily="monospace">- telefono: String</text>
              <text x="390" y="497" fontSize="9.5" fill="#0f172a" fontFamily="monospace">- email: String</text>
              <text x="390" y="512" fontSize="9.5" fill="#0f172a" fontFamily="monospace">- celdaAsignadaId: String</text>
              <line x1="380" y1="522" x2="660" y2="522" stroke="#0f172a" strokeWidth="1" />
              {/* Methods */}
              <text x="390" y="540" fontSize="9.5" fill="#0f172a" fontFamily="monospace">+ tieneMensualidadAlDia(): Boolean</text>
              <text x="390" y="556" fontSize="9.5" fill="#0f172a" fontFamily="monospace">+ vincularVehiculo(v: Vehiculo): Void</text>
              <text x="390" y="572" fontSize="9.5" fill="#0f172a" fontFamily="monospace">+ renovarContrato(meses): Void</text>
            </g>

            {/* 6. SUSCRIPCION MENSUAL (x=760, y=365, w=250, h=165) */}
            <g id="box-suscripcion">
              <rect x="760" y="365" width="250" height="165" fill="#ffffff" stroke="#0f172a" strokeWidth="2" rx="4" />
              {/* Header */}
              <rect x="760" y="365" width="250" height="32" fill="#f8fafc" stroke="#0f172a" strokeWidth="1" />
              <text x="885" y="386" fontSize="13" fontWeight="bold" fill="#0f172a" textAnchor="middle" fontFamily="sans-serif">
                SuscripcionMensual
              </text>
              {/* Attributes */}
              <text x="770" y="414" fontSize="10" fill="#0f172a" fontFamily="monospace">- fechaInicio: Date</text>
              <text x="770" y="430" fontSize="10" fill="#0f172a" fontFamily="monospace">- fechaVencimiento: Date</text>
              <text x="770" y="446" fontSize="10" fill="#0f172a" fontFamily="monospace">- canonMensual: Double</text>
              <text x="770" y="462" fontSize="10" fill="#0f172a" fontFamily="monospace">- estado: String</text>
              <line x1="760" y1="474" x2="1010" y2="474" stroke="#0f172a" strokeWidth="1" />
              {/* Methods */}
              <text x="770" y="494" fontSize="10" fill="#0f172a" fontFamily="monospace">+ diasParaVencimiento(): Integer</text>
              <text x="770" y="512" fontSize="10" fill="#0f172a" fontFamily="monospace">+ estaVencida(): Boolean</text>
            </g>

            {/* 7. PAGO (x=380, y=615, w=280, h=195) */}
            <g id="box-pago">
              <rect x="380" y="615" width="280" height="195" fill="#ffffff" stroke="#0f172a" strokeWidth="2" rx="4" />
              {/* Header */}
              <rect x="380" y="615" width="280" height="32" fill="#f8fafc" stroke="#0f172a" strokeWidth="1" />
              <text x="520" y="636" fontSize="13" fontWeight="bold" fill="#0f172a" textAnchor="middle" fontFamily="sans-serif">
                Pago
              </text>
              {/* Attributes */}
              <text x="390" y="662" fontSize="9.5" fill="#0f172a" fontFamily="monospace">- id: String</text>
              <text x="390" y="677" fontSize="9.5" fill="#0f172a" fontFamily="monospace">- numeroRecibo: String</text>
              <text x="390" y="692" fontSize="9.5" fill="#0f172a" fontFamily="monospace">- fecha: DateTime</text>
              <text x="390" y="707" fontSize="9.5" fill="#0f172a" fontFamily="monospace">- concepto: String</text>
              <text x="390" y="722" fontSize="9.5" fill="#0f172a" fontFamily="monospace">- monto: Double</text>
              <text x="390" y="737" fontSize="9.5" fill="#0f172a" fontFamily="monospace">- medioPago: String</text>
              <text x="390" y="752" fontSize="9.5" fill="#0f172a" fontFamily="monospace">- cajero: String</text>
              <line x1="380" y1="762" x2="660" y2="762" stroke="#0f172a" strokeWidth="1" />
              {/* Methods */}
              <text x="390" y="785" fontSize="9.5" fill="#0f172a" fontFamily="monospace">+ generarComprobanteImprimible(): String</text>
            </g>
          </svg>
        </div>

        {/* Legend of Relationships */}
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-2">
          <div className="font-bold text-slate-900 flex items-center justify-between">
            <span>Guía de Conexiones Representadas en el Diagrama:</span>
            {selectedRelationship && (
              <span className="text-[11px] font-mono font-normal text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                Seleccionada: {selectedRelationship}
              </span>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-[11px] text-slate-700 font-mono">
            <div className="p-2 bg-white rounded border border-slate-200">
              <span className="font-bold text-indigo-600">1. Vehiculo &rarr; Entrada</span>
              <p className="text-slate-500 font-sans text-[10px] mt-0.5">1 a 0..* (registra ingresos)</p>
            </div>
            <div className="p-2 bg-white rounded border border-slate-200">
              <span className="font-bold text-indigo-600">2. Entrada &rarr; Celda</span>
              <p className="text-slate-500 font-sans text-[10px] mt-0.5">0..1 a 1 (asigna espacio)</p>
            </div>
            <div className="p-2 bg-white rounded border border-slate-200">
              <span className="font-bold text-indigo-600">3. Vehiculo &rarr; Novedad</span>
              <p className="text-slate-500 font-sans text-[10px] mt-0.5">1 a 0..* (rayones o golpes)</p>
            </div>
            <div className="p-2 bg-white rounded border border-slate-200">
              <span className="font-bold text-indigo-600">4. Usuario &rarr; Vehiculo</span>
              <p className="text-slate-500 font-sans text-[10px] mt-0.5">1 a 1..* (propiedad cliente)</p>
            </div>
            <div className="p-2 bg-white rounded border border-slate-200">
              <span className="font-bold text-indigo-600">5. Usuario &rarr; Suscripcion</span>
              <p className="text-slate-500 font-sans text-[10px] mt-0.5">1 a 1 (contrato mensual)</p>
            </div>
            <div className="p-2 bg-white rounded border border-slate-200">
              <span className="font-bold text-indigo-600">6. Entrada &rarr; Pago</span>
              <p className="text-slate-500 font-sans text-[10px] mt-0.5">1 a 0..1 (cobro por tiempo)</p>
            </div>
            <div className="p-2 bg-white rounded border border-slate-200">
              <span className="font-bold text-indigo-600">7. Suscripcion &rarr; Pago</span>
              <p className="text-slate-500 font-sans text-[10px] mt-0.5">1 a 1..* (canon periódico)</p>
            </div>
            <div className="p-2 bg-emerald-50 rounded border border-emerald-200 text-emerald-900 font-sans">
              <span className="font-bold block">✓ Listo para Word</span>
              <p className="text-[10px] text-emerald-700 mt-0.5">Descarga el PNG con el botón verde</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
