import React, { useRef, useState } from 'react';
import { 
  Download, 
  Check, 
  Copy, 
  ExternalLink, 
  Layers, 
  Users, 
  FileText, 
  GitBranch, 
  HelpCircle, 
  Search, 
  ArrowRight,
  ShieldCheck,
  Code,
  Eye,
  Info
} from 'lucide-react';
import { 
  USE_CASE_ACTORS, 
  USE_CASES_LIST, 
  PLANTUML_USE_CASE_CODE,
  UseCaseItem 
} from '../data/useCaseData';

export const UseCaseDiagramView: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'diagrama' | 'especificaciones' | 'actores' | 'guia' | 'plantuml'>('diagrama');
  const [selectedModule, setSelectedModule] = useState<string>('TODOS');
  const [selectedUseCaseId, setSelectedUseCaseId] = useState<string>(USE_CASES_LIST[0].id);
  const [copiedPlantUml, setCopiedPlantUml] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const svgRef = useRef<SVGSVGElement>(null);

  const selectedUseCase = USE_CASES_LIST.find(cu => cu.id === selectedUseCaseId) || USE_CASES_LIST[0];

  const filteredUseCases = USE_CASES_LIST.filter(cu => {
    const matchesModule = selectedModule === 'TODOS' || cu.module === selectedModule;
    const matchesSearch = cu.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          cu.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          cu.primaryActor.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesModule && matchesSearch;
  });

  const handleDownloadPng = () => {
    try {
      const svgElement = svgRef.current;
      if (!svgElement) {
        window.open('/Diagrama_CasosDeUso_Parqueadero_Autos_Colombia.svg', '_blank');
        return;
      }
      const svgString = new XMLSerializer().serializeToString(svgElement);
      const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
      const URL = window.URL || window.webkitURL || window;
      const blobURL = URL.createObjectURL(svgBlob);
      const image = new Image();

      image.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 2700;
        canvas.height = 1920;
        const context = canvas.getContext('2d');
        if (context) {
          context.fillStyle = '#ffffff';
          context.fillRect(0, 0, canvas.width, canvas.height);
          context.drawImage(image, 0, 0, canvas.width, canvas.height);
          const pngUrl = canvas.toDataURL('image/png');
          const downloadLink = document.createElement('a');
          downloadLink.href = pngUrl;
          downloadLink.download = 'Diagrama_CasosDeUso_Parqueadero_Autos_Colombia.png';
          document.body.appendChild(downloadLink);
          downloadLink.click();
          downloadLink.remove();
          setDownloadSuccess('¡Diagrama de Casos de Uso descargado en PNG de alta resolución!');
          setTimeout(() => setDownloadSuccess(null), 4000);
        }
      };
      image.onerror = () => {
        handleDownloadSvg();
      };
      image.src = blobURL;
    } catch {
      handleDownloadSvg();
    }
  };

  const handleDownloadSvg = () => {
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', '/Diagrama_CasosDeUso_Parqueadero_Autos_Colombia.svg');
    downloadAnchor.setAttribute('download', 'Diagrama_CasosDeUso_Parqueadero_Autos_Colombia.svg');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    setDownloadSuccess('¡Diagrama descargado en formato vectorial SVG!');
    setTimeout(() => setDownloadSuccess(null), 4000);
  };

  const handleDownloadMdj = () => {
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', '/ParqueaderoAutosColombia_CasosDeUso.mdj');
    downloadAnchor.setAttribute('download', 'ParqueaderoAutosColombia_CasosDeUso.mdj');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    setDownloadSuccess('¡Archivo nativo de StarUML (.mdj) descargado!');
    setTimeout(() => setDownloadSuccess(null), 4000);
  };

  const handleDownloadRupTxt = () => {
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', '/Especificacion_CasosDeUso_RUP_Parqueadero.txt');
    downloadAnchor.setAttribute('download', 'Especificacion_CasosDeUso_RUP_Parqueadero.txt');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    setDownloadSuccess('¡Documento de especificación RUP descargado en .txt!');
    setTimeout(() => setDownloadSuccess(null), 4000);
  };

  const handleCopyPlantUml = () => {
    navigator.clipboard.writeText(PLANTUML_USE_CASE_CODE);
    setCopiedPlantUml(true);
    setTimeout(() => setCopiedPlantUml(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                <Users className="w-3.5 h-3.5" />
                Modelado UML 2.5 · Casos de Uso StarUML
              </span>
              <span className="text-[11px] text-slate-500 font-medium">
                4 Actores · 16 Casos de Uso · Metodología RUP / IEEE
              </span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Diagrama de Casos de Uso del Sistema (StarUML)
            </h1>
            <p className="mt-1 text-sm text-slate-600 max-w-3xl">
              Modelado funcional para "Parqueadero Autos Colombia" con delimitación de frontera del sistema, actores principales y externos, y relaciones de inclusión (<code>&lt;&lt;include&gt;&gt;</code>) y extensión condicional (<code>&lt;&lt;extend&gt;&gt;</code>).
            </p>
          </div>

          {/* Quick Action Download Buttons */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              onClick={handleDownloadPng}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-md transition-all shadow-xs cursor-pointer"
              title="Descargar diagrama en imagen PNG de alta resolución para pegar en Word o PDF"
            >
              <Download className="w-4 h-4" />
              <span>Descargar Diagrama (PNG)</span>
            </button>
            <button
              onClick={handleDownloadMdj}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-md transition-colors cursor-pointer"
              title="Descargar proyecto nativo para abrir y editar en StarUML"
            >
              <Download className="w-3.5 h-3.5" />
              <span>StarUML (.mdj)</span>
            </button>
            <button
              onClick={handleDownloadRupTxt}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-md transition-colors cursor-pointer"
              title="Descargar plantilla de especificación RUP en texto"
            >
              <FileText className="w-3.5 h-3.5 text-slate-500" />
              <span>Doc RUP (.txt)</span>
            </button>
            <button
              onClick={handleDownloadSvg}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-md transition-colors cursor-pointer"
              title="Descargar archivo vectorial SVG"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>SVG</span>
            </button>
          </div>
        </div>

        {/* Sub-navigation tabs */}
        <div className="flex items-center gap-2 mt-6 border-b border-slate-200 pb-2 text-xs font-medium overflow-x-auto">
          <button
            onClick={() => setActiveSubTab('diagrama')}
            className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap cursor-pointer ${
              activeSubTab === 'diagrama'
                ? 'bg-slate-900 text-white font-semibold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            1. Diagrama Visual StarUML
          </button>
          <button
            onClick={() => setActiveSubTab('especificaciones')}
            className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap cursor-pointer ${
              activeSubTab === 'especificaciones'
                ? 'bg-slate-900 text-white font-semibold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            2. Especificaciones RUP (16 Casos de Uso)
          </button>
          <button
            onClick={() => setActiveSubTab('actores')}
            className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap cursor-pointer ${
              activeSubTab === 'actores'
                ? 'bg-slate-900 text-white font-semibold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            3. Actores del Sistema ({USE_CASE_ACTORS.length})
          </button>
          <button
            onClick={() => setActiveSubTab('guia')}
            className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap cursor-pointer ${
              activeSubTab === 'guia'
                ? 'bg-slate-900 text-white font-semibold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            4. Guía Paso a Paso StarUML
          </button>
          <button
            onClick={() => setActiveSubTab('plantuml')}
            className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap cursor-pointer ${
              activeSubTab === 'plantuml'
                ? 'bg-slate-900 text-white font-semibold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            5. Código PlantUML
          </button>
        </div>
      </div>

      {/* Success Notification */}
      {downloadSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center justify-between text-xs text-emerald-800">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-semibold">{downloadSuccess}</span>
          </div>
        </div>
      )}

      {/* ================= SUBTAB 1: DIAGRAMA VISUAL STARUML ================= */}
      {activeSubTab === 'diagrama' && (
        <div className="space-y-6">
          {/* Module Filter Pills */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white border border-slate-200 rounded-lg p-3">
            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              <span className="text-slate-500 font-medium mr-1 text-[11px]">Filtrar Módulo:</span>
              {(['TODOS', 'Acceso y Celdas', 'Facturación y Cobro', 'Mensualistas', 'Administración'] as const).map(mod => (
                <button
                  key={mod}
                  onClick={() => setSelectedModule(mod)}
                  className={`px-2.5 py-1 rounded text-xs transition-colors cursor-pointer ${
                    selectedModule === mod
                      ? 'bg-indigo-600 text-white font-semibold shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {mod === 'TODOS' ? 'Ver Todos (16)' : mod}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 text-xs">
              <a
                href="/Diagrama_CasosDeUso_Parqueadero_Autos_Colombia.svg"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-slate-600 hover:text-indigo-600 underline text-xs"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Abrir SVG en pestaña completa</span>
              </a>
            </div>
          </div>

          {/* Canvas SVG Container */}
          <div className="bg-white border border-slate-200 rounded-lg p-4 overflow-x-auto shadow-xs">
            <svg
              ref={svgRef}
              viewBox="0 0 1350 960"
              className="w-full max-w-[1350px] h-auto bg-white rounded mx-auto"
              style={{ minWidth: '950px' }}
            >
              <defs>
                <filter id="canvas-uc-shadow" x="-3%" y="-3%" width="106%" height="106%">
                  <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.08" />
                </filter>
                <marker id="canvas-dash-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 1 L 10 5 L 0 9 z" fill="#4338ca" />
                </marker>
                <marker id="canvas-extend-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 1 L 10 5 L 0 9 z" fill="#b45309" />
                </marker>
                <marker id="canvas-gen-arrow" viewBox="0 0 12 12" refX="11" refY="6" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
                  <polygon points="0,1 11,6 0,11" fill="#ffffff" stroke="#0f172a" strokeWidth="1.5" />
                </marker>
              </defs>

              {/* Encabezado Superior */}
              <rect x="0" y="0" width="1350" height="64" fill="#0f172a" />
              <text x="35" y="38" fill="#ffffff" fontSize="18" fontWeight="bold">PARQUEADERO AUTOS COLOMBIA · DIAGRAMA DE CASOS DE USO (STARUML / UML 2.5)</text>
              <text x="1000" y="38" fill="#38bdf8" fontSize="12" fontWeight="600">4 Actores · 16 Casos de Uso · RUP / IEEE</text>

              {/* LÍMITE DEL SISTEMA */}
              <rect x="230" y="80" width="880" height="800" rx="12" fill="#f8fafc" stroke="#64748b" strokeWidth="2" strokeDasharray="8,6" />
              <rect x="250" y="90" width="360" height="28" rx="6" fill="#0f172a" />
              <text x="265" y="109" fill="#ffffff" fontSize="12" fontWeight="bold">Sistema: Parqueadero Autos Colombia</text>

              {/* LÍNEAS DE ASOCIACIÓN */}
              <line x1="160" y1="180" x2="310" y2="180" stroke="#475569" strokeWidth="1.5" />
              <line x1="160" y1="190" x2="310" y2="340" stroke="#475569" strokeWidth="1.5" />
              <line x1="160" y1="200" x2="310" y2="400" stroke="#475569" strokeWidth="1.5" />
              <line x1="160" y1="210" x2="680" y2="180" stroke="#475569" strokeWidth="1.5" />
              <line x1="160" y1="220" x2="680" y2="400" stroke="#475569" strokeWidth="1.5" />

              <line x1="160" y1="620" x2="310" y2="560" stroke="#475569" strokeWidth="1.5" />
              <line x1="160" y1="630" x2="310" y2="640" stroke="#475569" strokeWidth="1.5" />
              <line x1="160" y1="640" x2="310" y2="720" stroke="#475569" strokeWidth="1.5" />
              <line x1="160" y1="650" x2="310" y2="800" stroke="#475569" strokeWidth="1.5" />
              <line x1="160" y1="660" x2="680" y2="600" stroke="#475569" strokeWidth="1.5" />
              <line x1="160" y1="670" x2="680" y2="700" stroke="#475569" strokeWidth="1.5" />

              {/* Generalización Admin -> Operario */}
              <line x1="100" y1="560" x2="100" y2="290" stroke="#0f172a" strokeWidth="2" markerEnd="url(#canvas-gen-arrow)" />
              <text x="110" y="420" fill="#0f172a" fontSize="10" fontWeight="bold">&lt;&lt;generaliza&gt;&gt;</text>

              {/* Cliente -> CU-01, CU-04, CU-07, CU-11 */}
              <line x1="1180" y1="200" x2="520" y2="180" stroke="#475569" strokeWidth="1.5" />
              <line x1="1180" y1="210" x2="520" y2="340" stroke="#475569" strokeWidth="1.5" />
              <line x1="1180" y1="220" x2="890" y2="240" stroke="#475569" strokeWidth="1.5" />
              <line x1="1180" y1="240" x2="520" y2="560" stroke="#475569" strokeWidth="1.5" />

              {/* Pasarela -> CU-07, CU-08 */}
              <line x1="1180" y1="680" x2="890" y2="260" stroke="#475569" strokeWidth="1.5" />
              <line x1="1180" y1="690" x2="890" y2="320" stroke="#475569" strokeWidth="1.5" />

              {/* INCLUDES */}
              <line x1="415" y1="210" x2="415" y2="250" stroke="#4338ca" strokeWidth="1.8" strokeDasharray="5,4" markerEnd="url(#canvas-dash-arrow)" />
              <text x="425" y="235" fill="#4338ca" fontSize="9" fontWeight="bold">&lt;&lt;include&gt;&gt;</text>

              <line x1="520" y1="340" x2="680" y2="195" stroke="#4338ca" strokeWidth="1.8" strokeDasharray="5,4" markerEnd="url(#canvas-dash-arrow)" />
              <text x="560" y="270" fill="#4338ca" fontSize="9" fontWeight="bold">&lt;&lt;include&gt;&gt;</text>

              <line x1="785" y1="205" x2="785" y2="235" stroke="#4338ca" strokeWidth="1.8" strokeDasharray="5,4" markerEnd="url(#canvas-dash-arrow)" />
              <text x="795" y="225" fill="#4338ca" fontSize="9" fontWeight="bold">&lt;&lt;include&gt;&gt;</text>

              <line x1="785" y1="285" x2="785" y2="310" stroke="#4338ca" strokeWidth="1.8" strokeDasharray="5,4" markerEnd="url(#canvas-dash-arrow)" />
              <text x="795" y="302" fill="#4338ca" fontSize="9" fontWeight="bold">&lt;&lt;include&gt;&gt;</text>

              {/* EXTENDS */}
              <line x1="520" y1="150" x2="470" y2="160" stroke="#b45309" strokeWidth="1.8" strokeDasharray="5,4" markerEnd="url(#canvas-extend-arrow)" />
              <text x="495" y="145" fill="#b45309" fontSize="9" fontWeight="bold">&lt;&lt;extend&gt;&gt;</text>

              <line x1="900" y1="160" x2="840" y2="170" stroke="#b45309" strokeWidth="1.8" strokeDasharray="5,4" markerEnd="url(#canvas-extend-arrow)" />
              <text x="860" y="152" fill="#b45309" fontSize="9" fontWeight="bold">&lt;&lt;extend&gt;&gt;</text>

              {/* PAQUETE 1: CONTROL DE ACCESO */}
              <rect x="250" y="130" width="370" height="340" rx="8" fill="#f0f9ff" stroke="#bae6fd" strokeWidth="1.5" />
              <text x="265" y="150" fill="#0369a1" fontSize="11" fontWeight="bold">Paquete 1: Control de Acceso y Celdas</text>

              <g filter="url(#canvas-uc-shadow)">
                <ellipse cx="415" cy="180" rx="105" ry="25" fill="#ffffff" stroke="#0284c7" strokeWidth="2" />
                <text x="415" y="184" fill="#0f172a" fontSize="11" fontWeight="600" textAnchor="middle">CU-01: Registrar Ingreso Vehicular</text>
              </g>

              <g filter="url(#canvas-uc-shadow)">
                <ellipse cx="415" cy="275" rx="105" ry="24" fill="#e0f2fe" stroke="#0284c7" strokeWidth="1.5" />
                <text x="415" y="278" fill="#0369a1" fontSize="10.5" fontWeight="600" textAnchor="middle">CU-02: Asignar Celda de Parqueo</text>
              </g>

              <g filter="url(#canvas-uc-shadow)">
                <ellipse cx="570" cy="150" rx="45" ry="20" fill="#fef3c7" stroke="#d97706" strokeWidth="1.5" />
                <text x="570" y="153" fill="#92400e" fontSize="9" fontWeight="bold" textAnchor="middle">CU-03: Novedad</text>
              </g>

              <g filter="url(#canvas-uc-shadow)">
                <ellipse cx="415" cy="340" rx="105" ry="24" fill="#ffffff" stroke="#0284c7" strokeWidth="2" />
                <text x="415" y="344" fill="#0f172a" fontSize="11" fontWeight="600" textAnchor="middle">CU-04: Registrar Salida y Tiempo</text>
              </g>

              <g filter="url(#canvas-uc-shadow)">
                <ellipse cx="415" cy="405" rx="105" ry="24" fill="#ffffff" stroke="#0284c7" strokeWidth="1.5" />
                <text x="415" y="409" fill="#0f172a" fontSize="11" fontWeight="600" textAnchor="middle">CU-05: Monitorear Celdas en Vivo</text>
              </g>

              {/* PAQUETE 2: FACTURACIÓN Y COBRO */}
              <rect x="650" y="130" width="440" height="340" rx="8" fill="#f0fdf4" stroke="#bbf7d0" strokeWidth="1.5" />
              <text x="665" y="150" fill="#15803d" fontSize="11" fontWeight="bold">Paquete 2: Facturación y Cobro</text>

              <g filter="url(#canvas-uc-shadow)">
                <ellipse cx="785" cy="180" rx="105" ry="25" fill="#ffffff" stroke="#16a34a" strokeWidth="2" />
                <text x="785" y="184" fill="#0f172a" fontSize="11" fontWeight="600" textAnchor="middle">CU-06: Liquidar Cobro Estancia</text>
              </g>

              <g filter="url(#canvas-uc-shadow)">
                <ellipse cx="945" cy="160" rx="45" ry="20" fill="#fef3c7" stroke="#d97706" strokeWidth="1.5" />
                <text x="945" y="163" fill="#92400e" fontSize="8.5" fontWeight="bold" textAnchor="middle">CU-09: Descuento</text>
              </g>

              <g filter="url(#canvas-uc-shadow)">
                <ellipse cx="785" cy="260" rx="105" ry="24" fill="#dcfce7" stroke="#16a34a" strokeWidth="1.5" />
                <text x="785" y="264" fill="#166534" fontSize="10.5" fontWeight="600" textAnchor="middle">CU-07: Procesar Pago</text>
              </g>

              <g filter="url(#canvas-uc-shadow)">
                <ellipse cx="785" cy="335" rx="105" ry="24" fill="#dcfce7" stroke="#16a34a" strokeWidth="1.5" />
                <text x="785" y="339" fill="#166534" fontSize="10.5" fontWeight="600" textAnchor="middle">CU-08: Emitir Factura / Ticket</text>
              </g>

              <g filter="url(#canvas-uc-shadow)">
                <ellipse cx="785" cy="405" rx="105" ry="24" fill="#ffffff" stroke="#16a34a" strokeWidth="1.5" />
                <text x="785" y="409" fill="#0f172a" fontSize="11" fontWeight="600" textAnchor="middle">CU-10: Cierre / Arqueo de Caja</text>
              </g>

              {/* PAQUETE 3: CLIENTES MENSUALISTAS */}
              <rect x="250" y="510" width="370" height="340" rx="8" fill="#faf5ff" stroke="#e9d5ff" strokeWidth="1.5" />
              <text x="265" y="530" fill="#7e22ce" fontSize="11" fontWeight="bold">Paquete 3: Clientes Mensualistas y Suscripciones</text>

              <g filter="url(#canvas-uc-shadow)">
                <ellipse cx="415" cy="560" rx="110" ry="24" fill="#ffffff" stroke="#9333ea" strokeWidth="1.5" />
                <text x="415" y="564" fill="#0f172a" fontSize="11" fontWeight="600" textAnchor="middle">CU-11: Registrar Mensualista</text>
              </g>

              <g filter="url(#canvas-uc-shadow)">
                <ellipse cx="415" cy="640" rx="110" ry="24" fill="#ffffff" stroke="#9333ea" strokeWidth="1.5" />
                <text x="415" y="644" fill="#0f172a" fontSize="11" fontWeight="600" textAnchor="middle">CU-12: Suscribir Cupo Mensual</text>
              </g>

              <g filter="url(#canvas-uc-shadow)">
                <ellipse cx="415" cy="720" rx="110" ry="24" fill="#ffffff" stroke="#9333ea" strokeWidth="1.5" />
                <text x="415" y="724" fill="#0f172a" fontSize="11" fontWeight="600" textAnchor="middle">CU-13: Renovar Suscripción</text>
              </g>

              <g filter="url(#canvas-uc-shadow)">
                <ellipse cx="415" cy="800" rx="110" ry="24" fill="#ffffff" stroke="#9333ea" strokeWidth="1.5" />
                <text x="415" y="804" fill="#0f172a" fontSize="11" fontWeight="600" textAnchor="middle">CU-14: Consultar Estado Cuenta</text>
              </g>

              {/* PAQUETE 4: CONFIGURACIÓN Y AUDITORÍA */}
              <rect x="650" y="510" width="440" height="340" rx="8" fill="#fff1f2" stroke="#fecdd3" strokeWidth="1.5" />
              <text x="665" y="530" fill="#be123c" fontSize="11" fontWeight="bold">Paquete 4: Administración y Parámetros</text>

              <g filter="url(#canvas-uc-shadow)">
                <ellipse cx="785" cy="600" rx="115" ry="25" fill="#ffffff" stroke="#e11d48" strokeWidth="1.5" />
                <text x="785" y="604" fill="#0f172a" fontSize="11" fontWeight="600" textAnchor="middle">CU-15: Configurar Tarifas</text>
              </g>

              <g filter="url(#canvas-uc-shadow)">
                <ellipse cx="785" cy="700" rx="115" ry="25" fill="#ffffff" stroke="#e11d48" strokeWidth="1.5" />
                <text x="785" y="704" fill="#0f172a" fontSize="11" fontWeight="600" textAnchor="middle">CU-16: Reportes de Ocupación</text>
              </g>

              {/* ACTORES */}
              {/* Operario */}
              <g transform="translate(60, 140)">
                <circle cx="40" cy="20" r="14" fill="#ffffff" stroke="#0284c7" strokeWidth="2.5" />
                <line x1="40" y1="34" x2="40" y2="70" stroke="#0284c7" strokeWidth="2.5" />
                <line x1="15" y1="48" x2="65" y2="48" stroke="#0284c7" strokeWidth="2.5" />
                <line x1="40" y1="70" x2="20" y2="100" stroke="#0284c7" strokeWidth="2.5" />
                <line x1="40" y1="70" x2="60" y2="100" stroke="#0284c7" strokeWidth="2.5" />
                <text x="40" y="120" fill="#0f172a" fontSize="12" fontWeight="bold" textAnchor="middle">Operario / Cajero</text>
                <text x="40" y="134" fill="#64748b" fontSize="10" textAnchor="middle">(Actor Principal)</text>
              </g>

              {/* Admin */}
              <g transform="translate(60, 580)">
                <circle cx="40" cy="20" r="14" fill="#ffffff" stroke="#4f46e5" strokeWidth="2.5" />
                <polygon points="32,7 40,2 48,7 45,10 35,10" fill="#f59e0b" />
                <line x1="40" y1="34" x2="40" y2="70" stroke="#4f46e5" strokeWidth="2.5" />
                <line x1="15" y1="48" x2="65" y2="48" stroke="#4f46e5" strokeWidth="2.5" />
                <line x1="40" y1="70" x2="20" y2="100" stroke="#4f46e5" strokeWidth="2.5" />
                <line x1="40" y1="70" x2="60" y2="100" stroke="#4f46e5" strokeWidth="2.5" />
                <text x="40" y="120" fill="#0f172a" fontSize="12" fontWeight="bold" textAnchor="middle">Administrador</text>
                <text x="40" y="134" fill="#64748b" fontSize="10" textAnchor="middle">(Supervisor)</text>
              </g>

              {/* Cliente */}
              <g transform="translate(1180, 160)">
                <circle cx="40" cy="20" r="14" fill="#ffffff" stroke="#059669" strokeWidth="2.5" />
                <line x1="40" y1="34" x2="40" y2="70" stroke="#059669" strokeWidth="2.5" />
                <line x1="15" y1="48" x2="65" y2="48" stroke="#059669" strokeWidth="2.5" />
                <line x1="40" y1="70" x2="20" y2="100" stroke="#059669" strokeWidth="2.5" />
                <line x1="40" y1="70" x2="60" y2="100" stroke="#059669" strokeWidth="2.5" />
                <text x="40" y="120" fill="#0f172a" fontSize="12" fontWeight="bold" textAnchor="middle">Cliente Conductor</text>
                <text x="40" y="134" fill="#64748b" fontSize="10" textAnchor="middle">(Mensualista)</text>
              </g>

              {/* Pasarela */}
              <g transform="translate(1180, 640)">
                <rect x="5" y="10" width="70" height="50" rx="6" fill="#fef3c7" stroke="#d97706" strokeWidth="2" />
                <line x1="15" y1="25" x2="65" y2="25" stroke="#d97706" strokeWidth="2" />
                <circle cx="20" cy="42" r="3" fill="#d97706" />
                <circle cx="32" cy="42" r="3" fill="#d97706" />
                <text x="40" y="76" fill="#0f172a" fontSize="11" fontWeight="bold" textAnchor="middle">Pasarela Pagos</text>
                <text x="40" y="90" fill="#64748b" fontSize="10" textAnchor="middle">Facturación DIAN</text>
                <text x="40" y="104" fill="#b45309" fontSize="9" fontStyle="italic" textAnchor="middle">&lt;&lt;sistema externo&gt;&gt;</text>
              </g>

              {/* LEYENDA INFERIOR */}
              <rect x="35" y="900" width="1280" height="45" rx="6" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
              
              <ellipse cx="60" cy="922" rx="16" ry="10" fill="#ffffff" stroke="#0284c7" strokeWidth="1.5" />
              <text x="85" y="926" fill="#334155" fontSize="11" fontWeight="600">Caso de Uso (Óvalo)</text>

              <line x1="230" y1="922" x2="270" y2="922" stroke="#475569" strokeWidth="1.5" />
              <text x="280" y="926" fill="#334155" fontSize="11" fontWeight="600">Asociación Directa</text>

              <line x1="420" y1="922" x2="460" y2="922" stroke="#4338ca" strokeWidth="1.8" strokeDasharray="4,3" markerEnd="url(#canvas-dash-arrow)" />
              <text x="470" y="926" fill="#4338ca" fontSize="11" fontWeight="bold">&lt;&lt;include&gt;&gt; Inclusión Requerida</text>

              <line x1="680" y1="922" x2="720" y2="922" stroke="#b45309" strokeWidth="1.8" strokeDasharray="4,3" markerEnd="url(#canvas-extend-arrow)" />
              <text x="730" y="926" fill="#b45309" fontSize="11" fontWeight="bold">&lt;&lt;extend&gt;&gt; Extensión Condicional</text>

              <line x1="940" y1="922" x2="980" y2="922" stroke="#0f172a" strokeWidth="1.8" markerEnd="url(#canvas-gen-arrow)" />
              <text x="990" y="926" fill="#0f172a" fontSize="11" fontWeight="bold">Generalización de Actores</text>
            </svg>
          </div>

          {/* Quick Info Box */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-2">
            <div className="flex items-center gap-2 text-slate-900 font-semibold text-xs">
              <HelpCircle className="w-4 h-4 text-indigo-600" />
              <span>Instrucciones de Descarga para Tatiana (IU Digital):</span>
            </div>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              Pulsa el botón verde <strong>"Descargar Diagrama (PNG)"</strong> para obtener la imagen en alta definición (2700 × 1920 px) lista para incluir en tu informe académico de Word o PDF. Si necesitas abrirlo en el software de escritorio StarUML, descarga el archivo <strong>"StarUML (.mdj)"</strong>.
            </p>
          </div>
        </div>
      )}

      {/* ================= SUBTAB 2: ESPECIFICACIONES RUP ================= */}
      {activeSubTab === 'especificaciones' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Use Cases Directory List */}
          <div className="lg:col-span-4 bg-white border border-slate-200 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="text-xs font-bold text-slate-900 uppercase">
                Catálogo de Casos de Uso ({USE_CASES_LIST.length})
              </h3>
              <span className="text-[10px] font-mono bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded font-bold">
                RUP Standard
              </span>
            </div>

            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                placeholder="Buscar caso de uso o actor..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full text-xs pl-8 pr-3 py-1.5 border border-slate-200 rounded-md bg-slate-50 focus:bg-white focus:outline-hidden focus:border-indigo-500"
              />
            </div>

            <div className="space-y-1.5 max-h-[550px] overflow-y-auto pr-1">
              {filteredUseCases.map(cu => (
                <button
                  key={cu.id}
                  onClick={() => setSelectedUseCaseId(cu.id)}
                  className={`w-full text-left p-2.5 rounded-md transition-colors cursor-pointer border ${
                    selectedUseCaseId === cu.id
                      ? 'bg-indigo-50 border-indigo-300 text-indigo-900 shadow-xs'
                      : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-xs">{cu.id}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded font-medium bg-slate-100 text-slate-600">
                      {cu.module}
                    </span>
                  </div>
                  <div className="text-xs font-semibold text-slate-900 mt-1 truncate">
                    {cu.name}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5 truncate">
                    Actor: {cu.primaryActor}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Right: Detailed Specification Sheet (Plantilla RUP) */}
          <div className="lg:col-span-8 bg-white border border-slate-200 rounded-lg p-6 space-y-5 shadow-xs">
            <div className="border-b pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded font-mono text-xs font-bold bg-indigo-100 text-indigo-800">
                    {selectedUseCase.id}
                  </span>
                  <span className="text-xs font-semibold text-slate-500">
                    {selectedUseCase.module}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-slate-900 mt-1">
                  {selectedUseCase.name}
                </h2>
              </div>
              <span className="text-xs font-medium text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
                Actor: <strong>{selectedUseCase.primaryActor}</strong>
              </span>
            </div>

            {/* Description & Relations */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="font-bold text-slate-700 block mb-1">Descripción:</span>
                <p className="text-slate-600 leading-relaxed text-[11px]">
                  {selectedUseCase.description}
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1.5 text-[11px]">
                <div>
                  <span className="font-bold text-slate-700">Relaciones UML:</span>
                  {selectedUseCase.includes && (
                    <div className="text-indigo-700 font-mono mt-0.5">
                      &bull; &lt;&lt;include&gt;&gt; {selectedUseCase.includes.join(', ')}
                    </div>
                  )}
                  {selectedUseCase.extendedBy && (
                    <div className="text-amber-700 font-mono mt-0.5">
                      &bull; Extendido por: {selectedUseCase.extendedBy.join(', ')}
                    </div>
                  )}
                  {selectedUseCase.extendsFrom && (
                    <div className="text-amber-700 font-mono mt-0.5">
                      &bull; &lt;&lt;extend&gt;&gt; hacia {selectedUseCase.extendsFrom}
                    </div>
                  )}
                  {!selectedUseCase.includes && !selectedUseCase.extendedBy && !selectedUseCase.extendsFrom && (
                    <span className="text-slate-400 block mt-0.5">Asociación directa únicamente</span>
                  )}
                </div>
                {selectedUseCase.extensionPoint && (
                  <div className="pt-1 text-slate-500 italic text-[10px]">
                    {selectedUseCase.extensionPoint}
                  </div>
                )}
              </div>
            </div>

            {/* Precondiciones */}
            <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-lg text-xs">
              <span className="font-bold text-amber-900 block mb-0.5">Precondiciones:</span>
              <p className="text-amber-950 text-[11px]">{selectedUseCase.preconditions}</p>
            </div>

            {/* Flujo Principal */}
            <div className="space-y-2 text-xs">
              <span className="font-bold text-slate-900 flex items-center gap-1.5">
                <GitBranch className="w-4 h-4 text-indigo-600" />
                <span>Flujo Principal de Eventos (Paso a Paso):</span>
              </span>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1.5 font-sans text-[11px]">
                {selectedUseCase.mainFlow.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-slate-700">
                    <span className="shrink-0 text-indigo-600 font-bold">&bull;</span>
                    <span>{step}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Flujos Alternos */}
            {selectedUseCase.alternativeFlows.length > 0 && (
              <div className="space-y-2 text-xs">
                <span className="font-bold text-slate-900 flex items-center gap-1.5">
                  <ArrowRight className="w-4 h-4 text-amber-600" />
                  <span>Flujos Alternativos y Excepciones:</span>
                </span>
                <div className="p-3 bg-amber-50/50 rounded-lg border border-amber-200 space-y-1.5 font-sans text-[11px]">
                  {selectedUseCase.alternativeFlows.map((alt, idx) => (
                    <div key={idx} className="text-amber-950">
                      {alt}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Postcondiciones */}
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs">
              <span className="font-bold text-emerald-900 block mb-0.5">Postcondiciones (Garantía de Éxito):</span>
              <p className="text-emerald-950 text-[11px]">{selectedUseCase.postconditions}</p>
            </div>
          </div>
        </div>
      )}

      {/* ================= SUBTAB 3: ACTORES DEL SISTEMA ================= */}
      {activeSubTab === 'actores' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {USE_CASE_ACTORS.map(actor => (
              <div key={actor.id} className="bg-white border border-slate-200 rounded-lg p-5 space-y-3 shadow-xs">
                <div className="flex items-center justify-between border-b pb-2">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-indigo-600" />
                    <h3 className="font-bold text-slate-900 text-sm">{actor.name}</h3>
                  </div>
                  <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                    {actor.type}
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {actor.description}
                </p>

                {actor.inheritsFrom && (
                  <div className="p-2 bg-indigo-50 border border-indigo-200 rounded text-[11px] text-indigo-900">
                    <strong>Herencia UML (Generalización):</strong> Hereda todas las atribuciones de <code>{actor.inheritsFrom}</code>.
                  </div>
                )}

                <div className="pt-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                    Casos de Uso Vinculados ({actor.associatedUseCases.length}):
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {actor.associatedUseCases.map(cuId => (
                      <span key={cuId} className="px-2 py-0.5 text-[10px] font-mono font-semibold rounded bg-slate-100 text-slate-700">
                        {cuId}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= SUBTAB 4: GUÍA PASO A PASO STARUML ================= */}
      {activeSubTab === 'guia' && (
        <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-6 shadow-xs text-xs">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Guía para Abrir y Trabajar con los Casos de Uso en StarUML
            </h3>
            <p className="text-slate-600 text-xs mt-1">
              Pasos exactos para abrir tu archivo <code>ParqueaderoAutosColombia_CasosDeUso.mdj</code> o recrearlo en clase en la IU Digital.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
              <div className="flex items-center gap-2 font-bold text-slate-900 text-xs">
                <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px]">1</span>
                <span>Cómo abrir el archivo nativo en StarUML</span>
              </div>
              <ol className="list-decimal list-inside space-y-1.5 text-slate-600 text-[11px] leading-relaxed">
                <li>Descarga el archivo <strong>"StarUML (.mdj)"</strong> desde el botón superior.</li>
                <li>Abre el software <strong>StarUML</strong> en tu computador.</li>
                <li>Ve al menú <strong>File &gt; Open...</strong> (o presiona <code>Ctrl + O</code>).</li>
                <li>Selecciona el archivo descargado <code>ParqueaderoAutosColombia_CasosDeUso.mdj</code>.</li>
                <li>En el panel lateral derecho (Model Explorer), verás el <strong>"Diagrama de Casos de Uso Principal"</strong> listo.</li>
              </ol>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
              <div className="flex items-center gap-2 font-bold text-slate-900 text-xs">
                <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px]">2</span>
                <span>Cómo dibujar Casos de Uso desde cero</span>
              </div>
              <ol className="list-decimal list-inside space-y-1.5 text-slate-600 text-[11px] leading-relaxed">
                <li>En la barra de herramientas izquierda (Toolbox), selecciona <strong>Actor</strong> y haz clic en el lienzo.</li>
                <li>Selecciona <strong>UseCase</strong> (Óvalo) para crear los casos de uso.</li>
                <li>Para unir el Actor con el Caso de Uso, usa la herramienta <strong>Association</strong>.</li>
                <li>Para el límite del sistema, usa <strong>System Boundary</strong> (Rectángulo envolvente).</li>
              </ol>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
              <div className="flex items-center gap-2 font-bold text-slate-900 text-xs">
                <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px]">3</span>
                <span>Cómo agregar relaciones &lt;&lt;include&gt;&gt; y &lt;&lt;extend&gt;&gt;</span>
              </div>
              <ol className="list-decimal list-inside space-y-1.5 text-slate-600 text-[11px] leading-relaxed">
                <li><strong>Include:</strong> Arrastra desde <code>CU-01</code> hacia <code>CU-02</code> con la herramienta <strong>Include</strong>. La flecha apuntará hacia el caso de uso incluido con el estereotipo <code>&lt;&lt;include&gt;&gt;</code>.</li>
                <li><strong>Extend:</strong> Arrastra desde <code>CU-03</code> (Novedad previa) hacia <code>CU-01</code> con la herramienta <strong>Extend</strong>.</li>
                <li><strong>Generalization:</strong> Conecta <code>Administrador</code> hacia <code>Operario</code> para reflejar la jerarquía de roles.</li>
              </ol>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
              <div className="flex items-center gap-2 font-bold text-slate-900 text-xs">
                <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px]">4</span>
                <span>Exportar imagen desde StarUML</span>
              </div>
              <ol className="list-decimal list-inside space-y-1.5 text-slate-600 text-[11px] leading-relaxed">
                <li>En StarUML, ve a <strong>File &gt; Export Diagram As &gt; PNG...</strong></li>
                <li>Elige resolución alta (2x o 3x).</li>
                <li>Guarda la imagen para adjuntarla en tu documento final de entrega.</li>
              </ol>
            </div>
          </div>
        </div>
      )}

      {/* ================= SUBTAB 5: CÓDIGO PLANTUML ================= */}
      {activeSubTab === 'plantuml' && (
        <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b pb-3">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Código Fuente PlantUML (UML 2.5)
              </h3>
              <p className="text-xs text-slate-500">
                Puedes copiar este código y pegarlo en PlantText.com o en tu editor local para renderizar el diagrama automáticamente.
              </p>
            </div>
            <button
              onClick={handleCopyPlantUml}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors cursor-pointer"
            >
              {copiedPlantUml ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-700 font-bold">¡Código Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-slate-600" />
                  <span>Copiar Código</span>
                </>
              )}
            </button>
          </div>

          <pre className="p-4 bg-slate-900 text-emerald-400 font-mono text-xs rounded-lg overflow-x-auto max-h-[450px]">
            {PLANTUML_USE_CASE_CODE}
          </pre>
        </div>
      )}
    </div>
  );
};
