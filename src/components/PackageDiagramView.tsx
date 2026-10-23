import React, { useRef, useState } from 'react';
import { 
  Download, 
  Check, 
  Package as PackageIcon, 
  HelpCircle, 
  Layers, 
  ArrowRight, 
  Code, 
  Copy, 
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  FileCode
} from 'lucide-react';
import { UML_PACKAGES, UmlPackage, PLANTUML_PACKAGE_CODE } from '../data/packageDiagramData';

export const PackageDiagramView: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [downloadPngSuccess, setDownloadPngSuccess] = useState(false);
  const [downloadSvgSuccess, setDownloadSvgSuccess] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<UmlPackage>(UML_PACKAGES[0]);
  const [copiedCode, setCopiedCode] = useState(false);
  const [activeSubView, setActiveSubView] = useState<'diagrama' | 'plantuml' | 'matriz'>('diagrama');

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
        // High-resolution export (2.5x scale -> 2700 x 2200 px) for crisp academic reports
        const scale = 2.5;
        const canvas = document.createElement('canvas');
        canvas.width = 1080 * scale;
        canvas.height = 880 * scale;
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
          downloadLink.download = 'Diagrama_Paquetes_Parqueadero_Autos_Colombia.png';
          document.body.appendChild(downloadLink);
          downloadLink.click();
          downloadLink.remove();
          setDownloadPngSuccess(true);
          setTimeout(() => setDownloadPngSuccess(false), 3000);
        }
      };
      image.src = blobURL;
    } catch {
      handleDownloadSvg();
    }
  };

  const handleDownloadSvg = () => {
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', '/Diagrama_Paquetes_Parqueadero_Autos_Colombia.svg');
    downloadAnchor.setAttribute('download', 'Diagrama_Paquetes_Parqueadero_Autos_Colombia.svg');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    setDownloadSvgSuccess(true);
    setTimeout(() => setDownloadSvgSuccess(false), 3000);
  };

  const handleDownloadMdj = () => {
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', '/ParqueaderoAutosColombia_Paquetes.mdj');
    downloadAnchor.setAttribute('download', 'ParqueaderoAutosColombia_Paquetes.mdj');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Tutorial Callout for StarUML */}
      <div className="bg-sky-50 border border-sky-200 rounded-lg p-5 text-slate-800 space-y-3">
        <div className="flex items-center gap-2 text-sky-950 font-bold text-sm">
          <HelpCircle className="w-5 h-5 text-sky-700 shrink-0" />
          <span>¿Cómo crear un Diagrama de Paquetes en StarUML? (Paso a paso)</span>
        </div>
        <p className="text-xs text-sky-900 leading-relaxed">
          En StarUML, los <strong>Diagramas de Paquetes (Package Diagram)</strong> organizan el código fuente en capas y subsistemas desacoplados, mostrando cómo interactúan los módulos mediante dependencias <code>«use»</code> e <code>«import»</code>:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs pt-1">
          <div className="bg-white p-3 rounded border border-sky-200/80 shadow-2xs">
            <div className="font-bold text-sky-900 mb-1 flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-sky-100 text-sky-800 inline-flex items-center justify-center text-[11px] font-mono">1</span>
              <span>Crear el Diagrama</span>
            </div>
            <p className="text-slate-600 text-[11px]">
              En el menú superior: <strong>Model</strong> ➔ <strong>Add Diagram</strong> ➔ <strong>Package Diagram</strong>.
            </p>
          </div>

          <div className="bg-white p-3 rounded border border-sky-200/80 shadow-2xs">
            <div className="font-bold text-sky-900 mb-1 flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-sky-100 text-sky-800 inline-flex items-center justify-center text-[11px] font-mono">2</span>
              <span>Dibujar las Carpetas</span>
            </div>
            <p className="text-slate-600 text-[11px]">
              En el <strong>TOOLBOX</strong> izquierdo, haz clic en <strong>Package</strong> y pulsa en el lienzo para crear las 6 capas arquitectónicas.
            </p>
          </div>

          <div className="bg-white p-3 rounded border border-sky-200/80 shadow-2xs">
            <div className="font-bold text-sky-900 mb-1 flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-sky-100 text-sky-800 inline-flex items-center justify-center text-[11px] font-mono">3</span>
              <span>Trazar Dependencias</span>
            </div>
            <p className="text-slate-600 text-[11px]">
              Selecciona <strong>Dependency</strong> en el Toolbox. Haz <strong>clic sostenido</strong> en el paquete cliente y suelta en el destino.
            </p>
          </div>

          <div className="bg-white p-3 rounded border border-sky-200/80 shadow-2xs">
            <div className="font-bold text-sky-900 mb-1 flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-sky-100 text-sky-800 inline-flex items-center justify-center text-[11px] font-mono">4</span>
              <span>Estereotipar («utiliza»)</span>
            </div>
            <p className="text-slate-600 text-[11px]">
              En el panel <strong>Properties</strong> de la línea, escribe <code>utiliza</code> o <code>importa</code> en la casilla <strong>stereotype</strong>.
            </p>
          </div>
        </div>

        <div className="pt-1 flex items-center justify-between text-xs text-sky-900 border-t border-sky-200/60 font-medium">
          <span>💡 <strong>Tip para tu entrega:</strong> Puedes descargar abajo la imagen completa en PNG o SVG para tu documento, o descargar el archivo nativo <code>.mdj</code> para abrirlo directamente en StarUML.</span>
        </div>
      </div>

      {/* Main Container Card */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 space-y-4">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <PackageIcon className="w-5 h-5 text-indigo-600" />
              <span>Diagrama de Paquetes Arquitectural (Clean Architecture / N-Tier)</span>
              <span className="text-[11px] font-mono font-medium text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                6 Paquetes UML 2.5 en Español
              </span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Estructura modular de paquetes en español con dependencias dirigidas, clases internas y reglas de acoplamiento.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleDownloadPng}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-md transition-colors shadow-xs cursor-pointer"
              title="Descargar imagen completa en PNG de alta resolución (2700x2200 px)"
            >
              {downloadPngSuccess ? (
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
              title="Descargar formato vectorial SVG"
            >
              {downloadSvgSuccess ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-700">¡SVG Descargado!</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" />
                  <span>Descargar SVG</span>
                </>
              )}
            </button>

            <button
              onClick={handleDownloadMdj}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-indigo-800 bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 rounded-md transition-colors cursor-pointer"
              title="Descargar proyecto nativo para StarUML"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Descargar StarUML (.mdj)</span>
            </button>
          </div>
        </div>

        {/* View Switcher SubTabs */}
        <div className="flex items-center gap-2 text-xs font-medium border-b border-slate-100 pb-2">
          <button
            onClick={() => setActiveSubView('diagrama')}
            className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
              activeSubView === 'diagrama'
                ? 'bg-slate-900 text-white font-semibold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Lienzo del Diagrama Visual
          </button>
          <button
            onClick={() => setActiveSubView('matriz')}
            className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
              activeSubView === 'matriz'
                ? 'bg-slate-900 text-white font-semibold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Matriz de Acoplamiento y Dependencias
          </button>
          <button
            onClick={() => setActiveSubView('plantuml')}
            className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeSubView === 'plantuml'
                ? 'bg-slate-900 text-white font-semibold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            <span>Código PlantUML</span>
          </button>
        </div>

        {/* TAB 1: SVG DIAGRAM CANVAS */}
        {activeSubView === 'diagrama' && (
          <div className="space-y-4">
            <div className="overflow-x-auto border border-slate-200 rounded-lg bg-slate-50/50 p-2">
              <svg
                ref={svgRef}
                viewBox="0 0 1080 880"
                className="w-full max-w-[1080px] h-auto bg-white rounded shadow-inner mx-auto"
                style={{ minWidth: '850px' }}
              >
                <defs>
                  {/* Open Arrow Marker for UML Dependencies */}
                  <marker
                    id="uml-pkg-arrow"
                    viewBox="0 0 12 12"
                    refX="10"
                    refY="6"
                    markerWidth="8"
                    markerHeight="8"
                    orient="auto-start-reverse"
                  >
                    <path d="M 1 2 L 10 6 L 1 10" fill="none" stroke="#1e293b" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </marker>

                  {/* Grid pattern background */}
                  <pattern id="canvas-grid" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#f1f5f9" strokeWidth="1" />
                  </pattern>
                </defs>

                {/* Background grid */}
                <rect width="1080" height="880" fill="url(#canvas-grid)" />

                {/* ================= CONNECTIONS / DEPENDENCIES ================= */}

                {/* 1. Presentacion -> Controladores */}
                <g className="cursor-pointer">
                  <line x1="330" y1="210" x2="398" y2="210" stroke="#1e293b" strokeWidth="2" strokeDasharray="5,4" markerEnd="url(#uml-pkg-arrow)" />
                  <rect x="338" y="198" width="58" height="18" fill="#ffffff" rx="3" stroke="#cbd5e1" strokeWidth="1" />
                  <text x="367" y="211" fontSize="9" fill="#1e293b" fontWeight="700" textAnchor="middle" fontFamily="monospace">«utiliza»</text>
                </g>

                {/* 2. Controladores -> Servicios */}
                <g className="cursor-pointer">
                  <line x1="680" y1="210" x2="748" y2="210" stroke="#1e293b" strokeWidth="2" strokeDasharray="5,4" markerEnd="url(#uml-pkg-arrow)" />
                  <rect x="688" y="198" width="58" height="18" fill="#ffffff" rx="3" stroke="#cbd5e1" strokeWidth="1" />
                  <text x="717" y="211" fontSize="9" fill="#1e293b" fontWeight="700" textAnchor="middle" fontFamily="monospace">«utiliza»</text>
                </g>

                {/* 3. Presentacion -> Dominio */}
                <g className="cursor-pointer">
                  <path d="M 180 330 L 180 460 L 218 460" fill="none" stroke="#1e293b" strokeWidth="1.8" strokeDasharray="5,4" markerEnd="url(#uml-pkg-arrow)" />
                  <rect x="148" y="385" width="62" height="18" fill="#ffffff" rx="3" stroke="#cbd5e1" strokeWidth="1" />
                  <text x="179" y="398" fontSize="8.5" fill="#1e293b" fontWeight="700" textAnchor="middle" fontFamily="monospace">«importa»</text>
                </g>

                {/* 4. Controladores -> Dominio */}
                <g className="cursor-pointer">
                  <line x1="490" y1="330" x2="430" y2="398" stroke="#1e293b" strokeWidth="1.8" strokeDasharray="5,4" markerEnd="url(#uml-pkg-arrow)" />
                  <rect x="443" y="355" width="62" height="18" fill="#ffffff" rx="3" stroke="#cbd5e1" strokeWidth="1" />
                  <text x="474" y="368" fontSize="8.5" fill="#1e293b" fontWeight="700" textAnchor="middle" fontFamily="monospace">«importa»</text>
                </g>

                {/* 5. Servicios -> Dominio */}
                <g className="cursor-pointer">
                  <path d="M 790 330 L 790 370 L 532 440" fill="none" stroke="#1e293b" strokeWidth="1.8" strokeDasharray="5,4" markerEnd="url(#uml-pkg-arrow)" />
                  <rect x="636" y="365" width="58" height="18" fill="#ffffff" rx="3" stroke="#cbd5e1" strokeWidth="1" />
                  <text x="665" y="378" fontSize="9" fill="#1e293b" fontWeight="700" textAnchor="middle" fontFamily="monospace">«utiliza»</text>
                </g>

                {/* 6. Servicios -> Persistencia */}
                <g className="cursor-pointer">
                  <line x1="890" y1="330" x2="790" y2="398" stroke="#1e293b" strokeWidth="1.8" strokeDasharray="5,4" markerEnd="url(#uml-pkg-arrow)" />
                  <rect x="826" y="355" width="58" height="18" fill="#ffffff" rx="3" stroke="#cbd5e1" strokeWidth="1" />
                  <text x="855" y="368" fontSize="9" fill="#1e293b" fontWeight="700" textAnchor="middle" fontFamily="monospace">«utiliza»</text>
                </g>

                {/* 7. Persistencia -> Dominio */}
                <g className="cursor-pointer">
                  <line x1="590" y1="510" x2="532" y2="510" stroke="#1e293b" strokeWidth="1.8" strokeDasharray="5,4" markerEnd="url(#uml-pkg-arrow)" />
                  <rect x="536" y="498" width="62" height="18" fill="#ffffff" rx="3" stroke="#cbd5e1" strokeWidth="1" />
                  <text x="567" y="511" fontSize="8.5" fill="#1e293b" fontWeight="700" textAnchor="middle" fontFamily="monospace">«importa»</text>
                </g>

                {/* 8. Dominio -> Transversal */}
                <g className="cursor-pointer">
                  <line x1="380" y1="630" x2="480" y2="678" stroke="#1e293b" strokeWidth="1.8" strokeDasharray="5,4" markerEnd="url(#uml-pkg-arrow)" />
                  <rect x="411" y="645" width="58" height="18" fill="#ffffff" rx="3" stroke="#cbd5e1" strokeWidth="1" />
                  <text x="440" y="658" fontSize="9" fill="#1e293b" fontWeight="700" textAnchor="middle" fontFamily="monospace">«utiliza»</text>
                </g>

                {/* 9. Persistencia -> Transversal */}
                <g className="cursor-pointer">
                  <line x1="740" y1="630" x2="640" y2="678" stroke="#1e293b" strokeWidth="1.8" strokeDasharray="5,4" markerEnd="url(#uml-pkg-arrow)" />
                  <rect x="671" y="645" width="58" height="18" fill="#ffffff" rx="3" stroke="#cbd5e1" strokeWidth="1" />
                  <text x="700" y="658" fontSize="9" fill="#1e293b" fontWeight="700" textAnchor="middle" fontFamily="monospace">«utiliza»</text>
                </g>

                {/* ================= PACKAGES (UML Standard Folder Shape) ================= */}

                {/* 1. PRESENTACION */}
                <g
                  className="cursor-pointer group"
                  onClick={() => setSelectedPackage(UML_PACKAGES[0])}
                >
                  <path d="M 40 100 L 170 100 L 170 124 L 40 124 Z" fill="#dcfce7" stroke="#16a34a" strokeWidth="2" />
                  <text x="50" y="116" fontSize="9.5" fontWeight="bold" fill="#15803d">«capa»</text>
                  <rect x="40" y="124" width="290" height="206" fill={selectedPackage.id === 'pkg-presentacion' ? '#ecfdf5' : '#f0fdf4'} stroke="#16a34a" strokeWidth={selectedPackage.id === 'pkg-presentacion' ? 2.5 : 2} rx="2" />
                  <text x="55" y="148" fontSize="13" fontWeight="bold" fill="#14532d">Presentacion</text>
                  <text x="55" y="163" fontSize="8.5" fontFamily="monospace" fill="#166534">com.autoscolombia.presentacion</text>
                  <line x1="40" y1="172" x2="330" y2="172" stroke="#86efac" strokeWidth="1" />
                  
                  <text x="55" y="190" fontSize="10" fill="#14532d">• VistaOperacionesPatio</text>
                  <text x="55" y="206" fontSize="10" fill="#14532d">• ModalRegistroIngreso / Liquidacion</text>
                  <text x="55" y="222" fontSize="10" fill="#14532d">• VistaMapaCeldas (Mapa de Celdas)</text>
                  <text x="55" y="238" fontSize="10" fill="#14532d">• VistaGestionMensualistas</text>
                  <text x="55" y="254" fontSize="10" fill="#14532d">• VistaLibroNovedades</text>
                  <text x="55" y="270" fontSize="10" fill="#14532d">• VistaArqueoCajaDiaria</text>
                  <text x="55" y="286" fontSize="10" fill="#14532d">• ModalImpresionComprobante</text>
                  <text x="55" y="315" fontSize="8.5" fill="#15803d" fontStyle="italic">Haz clic para ver detalles</text>
                </g>

                {/* 2. CONTROLADORES */}
                <g
                  className="cursor-pointer group"
                  onClick={() => setSelectedPackage(UML_PACKAGES[1])}
                >
                  <path d="M 400 100 L 530 100 L 530 124 L 400 124 Z" fill="#dbeafe" stroke="#2563eb" strokeWidth="2" />
                  <text x="410" y="116" fontSize="9.5" fontWeight="bold" fill="#1d4ed8">«capa»</text>
                  <rect x="400" y="124" width="280" height="206" fill={selectedPackage.id === 'pkg-controladores' ? '#eff6ff' : '#f8fafc'} stroke="#2563eb" strokeWidth={selectedPackage.id === 'pkg-controladores' ? 2.5 : 2} rx="2" />
                  <text x="415" y="148" fontSize="13" fontWeight="bold" fill="#1e3a8a">Controladores</text>
                  <text x="415" y="163" fontSize="8.5" fontFamily="monospace" fill="#1e40af">com.autoscolombia.controladores</text>
                  <line x1="400" y1="172" x2="680" y2="172" stroke="#93c5fd" strokeWidth="1" />

                  <text x="415" y="194" fontSize="10.5" fill="#1e3a8a">• ControladorParqueadero (Fachada)</text>
                  <text x="415" y="216" fontSize="10.5" fill="#1e3a8a">• ControladorCaja (Arqueo y Pagos)</text>
                  <text x="415" y="238" fontSize="10.5" fill="#1e3a8a">• ControladorMensualidades</text>
                  <text x="415" y="260" fontSize="10.5" fill="#1e3a8a">• ControladorNovedades</text>
                  <text x="415" y="282" fontSize="10.5" fill="#1e3a8a">• ControladorAsignacionCeldas</text>
                  <text x="415" y="315" fontSize="8.5" fill="#1d4ed8" fontStyle="italic">Haz clic para ver detalles</text>
                </g>

                {/* 3. SERVICIOS */}
                <g
                  className="cursor-pointer group"
                  onClick={() => setSelectedPackage(UML_PACKAGES[2])}
                >
                  <path d="M 750 100 L 870 100 L 870 124 L 750 124 Z" fill="#f3e8ff" stroke="#9333ea" strokeWidth="2" />
                  <text x="760" y="116" fontSize="9.5" fontWeight="bold" fill="#7e22ce">«capa»</text>
                  <rect x="750" y="124" width="290" height="206" fill={selectedPackage.id === 'pkg-servicios' ? '#faf5ff' : '#fdf4ff'} stroke="#9333ea" strokeWidth={selectedPackage.id === 'pkg-servicios' ? 2.5 : 2} rx="2" />
                  <text x="765" y="148" fontSize="13" fontWeight="bold" fill="#581c87">Servicios</text>
                  <text x="765" y="163" fontSize="8.5" fontFamily="monospace" fill="#6b21a8">com.autoscolombia.servicios</text>
                  <line x1="750" y1="172" x2="1040" y2="172" stroke="#d8b4fe" strokeWidth="1" />

                  <text x="765" y="190" fontSize="10" fill="#581c87">• ServicioIngresoVehiculo (RN-01..03)</text>
                  <text x="765" y="208" fontSize="10" fill="#581c87">• ServicioSalidaVehiculo (RN-04..06)</text>
                  <text x="765" y="226" fontSize="10" fill="#581c87">• ServicioCalculoTarifas (Tarifador)</text>
                  <text x="765" y="244" fontSize="10" fill="#581c87">• ServicioAsignacionCeldas</text>
                  <text x="765" y="262" fontSize="10" fill="#581c87">• GestorSuscripciones (Mensualistas)</text>
                  <text x="765" y="280" fontSize="10" fill="#581c87">• GestorNovedades (Custodia)</text>
                  <text x="765" y="315" fontSize="8.5" fill="#7e22ce" fontStyle="italic">Haz clic para ver detalles</text>
                </g>

                {/* 4. DOMINIO */}
                <g
                  className="cursor-pointer group"
                  onClick={() => setSelectedPackage(UML_PACKAGES[3])}
                >
                  <path d="M 220 400 L 330 400 L 330 424 L 220 424 Z" fill="#fef3c7" stroke="#d97706" strokeWidth="2" />
                  <text x="230" y="416" fontSize="9.5" fontWeight="bold" fill="#b45309">«subsistema»</text>
                  <rect x="220" y="424" width="310" height="206" fill={selectedPackage.id === 'pkg-dominio' ? '#fffbeb' : '#fffdf5'} stroke="#d97706" strokeWidth={selectedPackage.id === 'pkg-dominio' ? 2.5 : 2} rx="2" />
                  <text x="235" y="448" fontSize="13" fontWeight="bold" fill="#78350f">Dominio</text>
                  <text x="235" y="463" fontSize="8.5" fontFamily="monospace" fill="#92400e">com.autoscolombia.dominio</text>
                  <line x1="220" y1="472" x2="530" y2="472" stroke="#fcd34d" strokeWidth="1" />

                  <text x="235" y="490" fontSize="10" fill="#78350f">• Vehiculo (Entidad)</text>
                  <text x="235" y="506" fontSize="10" fill="#78350f">• EntradaVehiculo (Raíz Agregada)</text>
                  <text x="235" y="522" fontSize="10" fill="#78350f">• CeldaParqueo (Entidad)</text>
                  <text x="235" y="538" fontSize="10" fill="#78350f">• UsuarioMensualista (Entidad)</text>
                  <text x="235" y="554" fontSize="10" fill="#78350f">• SuscripcionMensual (Entidad)</text>
                  <text x="235" y="570" fontSize="10" fill="#78350f">• NovedadVehiculo y Pago (Entidades)</text>
                  <text x="235" y="586" fontSize="10" fill="#78350f">• ConfiguracionTarifas (Entidad)</text>
                  <text x="235" y="615" fontSize="8.5" fill="#b45309" fontStyle="italic">Haz clic para ver detalles</text>
                </g>

                {/* 5. PERSISTENCIA */}
                <g
                  className="cursor-pointer group"
                  onClick={() => setSelectedPackage(UML_PACKAGES[4])}
                >
                  <path d="M 590 400 L 720 400 L 720 424 L 590 424 Z" fill="#fce7f3" stroke="#db2777" strokeWidth="2" />
                  <text x="600" y="416" fontSize="9.5" fontWeight="bold" fill="#be185d">«capa»</text>
                  <rect x="590" y="424" width="310" height="206" fill={selectedPackage.id === 'pkg-persistencia' ? '#fdf2f8' : '#fff5f7'} stroke="#db2777" strokeWidth={selectedPackage.id === 'pkg-persistencia' ? 2.5 : 2} rx="2" />
                  <text x="605" y="448" fontSize="13" fontWeight="bold" fill="#831843">Persistencia</text>
                  <text x="605" y="463" fontSize="8.5" fontFamily="monospace" fill="#9d174d">com.autoscolombia.persistencia</text>
                  <line x1="590" y1="472" x2="900" y2="472" stroke="#f472b6" strokeWidth="1" />

                  <text x="605" y="494" fontSize="10.5" fill="#831843">• «interface» IRepositorioParqueadero</text>
                  <text x="605" y="516" fontSize="10.5" fill="#831843">• AdaptadorAlmacenamientoLocal</text>
                  <text x="605" y="538" fontSize="10.5" fill="#831843">• AdaptadorBaseDatosSql (SQL 3FN)</text>
                  <text x="605" y="560" fontSize="10.5" fill="#831843">• GestorAuditoriaTransaccional</text>
                  <text x="605" y="582" fontSize="10.5" fill="#831843">• CoordinadorTransacciones</text>
                  <text x="605" y="615" fontSize="8.5" fill="#be185d" fontStyle="italic">Haz clic para ver detalles</text>
                </g>

                {/* 6. TRANSVERSAL */}
                <g
                  className="cursor-pointer group"
                  onClick={() => setSelectedPackage(UML_PACKAGES[5])}
                >
                  <path d="M 400 680 L 530 680 L 530 704 L 400 704 Z" fill="#e2e8f0" stroke="#475569" strokeWidth="2" />
                  <text x="410" y="696" fontSize="9.5" fontWeight="bold" fill="#334155">«transversal»</text>
                  <rect x="400" y="704" width="310" height="150" fill={selectedPackage.id === 'pkg-transversal' ? '#f8fafc' : '#f1f5f9'} stroke="#475569" strokeWidth={selectedPackage.id === 'pkg-transversal' ? 2.5 : 2} rx="2" />
                  <text x="415" y="728" fontSize="13" fontWeight="bold" fill="#0f172a">Transversal</text>
                  <text x="415" y="743" fontSize="8.5" fontFamily="monospace" fill="#334155">com.autoscolombia.transversal</text>
                  <line x1="400" y1="752" x2="710" y2="752" stroke="#cbd5e1" strokeWidth="1" />

                  <text x="415" y="770" fontSize="10" fill="#0f172a">• TipoVehiculoEnum / EstadoCeldaEnum</text>
                  <text x="415" y="788" fontSize="10" fill="#0f172a">• TipoServicioEnum (Tarifas)</text>
                  <text x="415" y="806" fontSize="10" fill="#0f172a">• ValidadorPlacasRunt (Sintaxis Colombia)</text>
                  <text x="415" y="824" fontSize="10" fill="#0f172a">• FormateadorMonedaCop ($ COP)</text>
                </g>
              </svg>
            </div>

            {/* Selected Package Inspector Drawer */}
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-5 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3.5 h-3.5 rounded-full"
                    style={{ backgroundColor: selectedPackage.color.border }}
                  />
                  <h4 className="text-sm font-bold text-slate-900">
                    Paquete Seleccionado: <span className="font-mono text-indigo-700">{selectedPackage.name}</span>
                  </h4>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-700">
                    {selectedPackage.stereotype}
                  </span>
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-indigo-50 border border-indigo-200 text-indigo-800">
                    Capa: {selectedPackage.layer}
                  </span>
                </div>

                <span className="text-xs font-mono text-slate-500">
                  {selectedPackage.qualifiedName}
                </span>
              </div>

              <p className="text-xs text-slate-700 leading-relaxed">
                {selectedPackage.description}
              </p>

              {/* Elements & Dependencies Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                {/* Internal Elements */}
                <div className="bg-white border border-slate-200 rounded-lg p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Elementos Internos ({selectedPackage.elements.length})</span>
                    </span>
                  </div>
                  <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                    {selectedPackage.elements.map((elem, idx) => (
                      <div key={idx} className="p-2 rounded bg-slate-50 border border-slate-100 text-xs">
                        <div className="flex items-center justify-between font-mono font-semibold text-slate-800">
                          <span>{elem.name}</span>
                          <span className="text-[10px] font-sans font-normal text-slate-500 bg-white px-1.5 py-0.5 rounded border border-slate-200">
                            {elem.type}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600 mt-0.5">
                          {elem.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Dependencies */}
                <div className="bg-white border border-slate-200 rounded-lg p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <ArrowRight className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Dependencias Salientes ({selectedPackage.dependencies.length})</span>
                    </span>
                  </div>
                  {selectedPackage.dependencies.length === 0 ? (
                    <div className="p-4 text-center text-xs text-slate-500 bg-slate-50 rounded border border-slate-100">
                      Este paquete es independiente (Hoja del árbol arquitectural / Módulo Base).
                    </div>
                  ) : (
                    <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                      {selectedPackage.dependencies.map((dep, idx) => (
                        <div key={idx} className="p-2 rounded bg-slate-50 border border-slate-100 text-xs">
                          <div className="flex items-center gap-2 font-mono font-semibold text-slate-800">
                            <span>{selectedPackage.name}</span>
                            <span className="text-indigo-600 text-[10px] font-bold">{dep.stereotype}</span>
                            <span className="text-indigo-700">➔ {dep.targetName}</span>
                          </div>
                          <p className="text-[11px] text-slate-600 mt-0.5">
                            {dep.reason}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: MATRIZ DE ACOPLAMIENTO */}
        {activeSubView === 'matriz' && (
          <div className="space-y-4">
            <div className="bg-white border border-slate-200 rounded-lg p-5">
              <h4 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Matriz de Dependencias y Acoplamiento (Clean Architecture)</span>
              </h4>
              <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                Esta matriz demuestra que las dependencias fluyen hacia adentro (el dominio nunca depende de la presentación ni de la persistencia), garantizando bajo acoplamiento (Loose Coupling) y alta cohesión (High Cohesion):
              </p>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-100 text-slate-700 font-mono border-b border-slate-200">
                      <th className="p-2.5">Paquete Origen \ Destino</th>
                      <th className="p-2.5">Presentacion</th>
                      <th className="p-2.5">Controladores</th>
                      <th className="p-2.5">Servicios</th>
                      <th className="p-2.5">Dominio</th>
                      <th className="p-2.5">Persistencia</th>
                      <th className="p-2.5">Transversal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono">
                    <tr className="hover:bg-slate-50">
                      <td className="p-2.5 font-bold text-slate-900 bg-slate-50">Presentacion</td>
                      <td className="p-2.5 text-slate-300">-</td>
                      <td className="p-2.5 font-bold text-emerald-700">«utiliza»</td>
                      <td className="p-2.5 text-slate-300">-</td>
                      <td className="p-2.5 font-bold text-sky-700">«importa»</td>
                      <td className="p-2.5 text-slate-300">-</td>
                      <td className="p-2.5 font-bold text-emerald-700">«utiliza»</td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="p-2.5 font-bold text-slate-900 bg-slate-50">Controladores</td>
                      <td className="p-2.5 text-slate-300">-</td>
                      <td className="p-2.5 text-slate-300">-</td>
                      <td className="p-2.5 font-bold text-emerald-700">«utiliza»</td>
                      <td className="p-2.5 font-bold text-sky-700">«importa»</td>
                      <td className="p-2.5 text-slate-300">-</td>
                      <td className="p-2.5 font-bold text-emerald-700">«utiliza»</td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="p-2.5 font-bold text-slate-900 bg-slate-50">Servicios</td>
                      <td className="p-2.5 text-slate-300">-</td>
                      <td className="p-2.5 text-slate-300">-</td>
                      <td className="p-2.5 text-slate-300">-</td>
                      <td className="p-2.5 font-bold text-emerald-700">«utiliza»</td>
                      <td className="p-2.5 font-bold text-emerald-700">«utiliza»</td>
                      <td className="p-2.5 font-bold text-emerald-700">«utiliza»</td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="p-2.5 font-bold text-slate-900 bg-slate-50">Dominio</td>
                      <td className="p-2.5 text-slate-300">-</td>
                      <td className="p-2.5 text-slate-300">-</td>
                      <td className="p-2.5 text-slate-300">-</td>
                      <td className="p-2.5 text-slate-300">-</td>
                      <td className="p-2.5 text-slate-300">-</td>
                      <td className="p-2.5 font-bold text-emerald-700">«utiliza»</td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="p-2.5 font-bold text-slate-900 bg-slate-50">Persistencia</td>
                      <td className="p-2.5 text-slate-300">-</td>
                      <td className="p-2.5 text-slate-300">-</td>
                      <td className="p-2.5 text-slate-300">-</td>
                      <td className="p-2.5 font-bold text-sky-700">«importa»</td>
                      <td className="p-2.5 text-slate-300">-</td>
                      <td className="p-2.5 font-bold text-emerald-700">«utiliza»</td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="p-2.5 font-bold text-slate-900 bg-slate-50">Transversal</td>
                      <td className="p-2.5 text-slate-300">-</td>
                      <td className="p-2.5 text-slate-300">-</td>
                      <td className="p-2.5 text-slate-300">-</td>
                      <td className="p-2.5 text-slate-300">-</td>
                      <td className="p-2.5 text-slate-300">-</td>
                      <td className="p-2.5 text-slate-300">-</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded text-xs text-emerald-900 space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Validación de Arquitectura Limpia Cumplida:</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  No existen dependencias cíclicas (Acyclic Dependencies Principle - ADP). El paquete <code>domain</code> permanece completamente desacoplado de frameworks e interfaces web.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: PLANTUML CODE */}
        {activeSubView === 'plantuml' && (
          <div className="space-y-4">
            <div className="bg-slate-900 rounded-lg p-4 text-slate-200 space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-slate-400 flex items-center gap-2">
                  <FileCode className="w-4 h-4 text-indigo-400" />
                  <span>Diagrama_Paquetes_Parqueadero_Autos_Colombia.puml</span>
                </span>
                <button
                  onClick={() => handleCopyCode(PLANTUML_PACKAGE_CODE)}
                  className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded border border-slate-700 transition-colors cursor-pointer"
                >
                  {copiedCode ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">¡Copiado!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copiar PlantUML</span>
                    </>
                  )}
                </button>
              </div>
              <pre className="overflow-x-auto p-2 bg-slate-950 rounded text-slate-300 leading-relaxed max-h-[460px]">
                {PLANTUML_PACKAGE_CODE}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
