import React, { useRef, useState } from 'react';
import { 
  Database, 
  Table, 
  Key, 
  Code2, 
  Download, 
  Copy, 
  Check, 
  ExternalLink, 
  HelpCircle, 
  Layers, 
  FileText, 
  ListTree, 
  ShieldCheck,
  GitBranch,
  Image as ImageIcon
} from 'lucide-react';
import { RELATIONAL_TABLES, SQL_PHYSICAL_DDL } from '../data/databaseData';

export const DatabaseModelView: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'mer' | 'mr' | 'fisico' | 'diccionario'>('mer');
  const [copiedSql, setCopiedSql] = useState(false);
  const [downloadMerSuccess, setDownloadMerSuccess] = useState(false);
  const [downloadMrSuccess, setDownloadMrSuccess] = useState(false);
  const [copiedMr, setCopiedMr] = useState(false);
  const [selectedTable, setSelectedTable] = useState<string>(RELATIONAL_TABLES[0].tableName);
  const merSvgRef = useRef<SVGSVGElement>(null);
  const mrSvgRef = useRef<SVGSVGElement>(null);

  const handleCopySql = () => {
    navigator.clipboard.writeText(SQL_PHYSICAL_DDL);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 3000);
  };

  const handleDownloadSql = () => {
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', '/ParqueaderoAutosColombia_ModeloFisico.sql');
    downloadAnchor.setAttribute('download', 'ParqueaderoAutosColombia_ModeloFisico.sql');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleDownloadMerPng = () => {
    try {
      const svgElement = merSvgRef.current;
      if (!svgElement) {
        window.open('/Diagrama_MER_Parqueadero_Autos_Colombia.svg', '_blank');
        return;
      }
      const svgString = new XMLSerializer().serializeToString(svgElement);
      const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
      const URL = window.URL || window.webkitURL || window;
      const blobURL = URL.createObjectURL(svgBlob);
      const image = new Image();

      image.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 2200;
        canvas.height = 1500;
        const context = canvas.getContext('2d');
        if (context) {
          context.fillStyle = '#ffffff';
          context.fillRect(0, 0, canvas.width, canvas.height);
          context.drawImage(image, 0, 0, canvas.width, canvas.height);
          const pngUrl = canvas.toDataURL('image/png');
          const downloadLink = document.createElement('a');
          downloadLink.href = pngUrl;
          downloadLink.download = 'Diagrama_MER_Parqueadero_Autos_Colombia.png';
          document.body.appendChild(downloadLink);
          downloadLink.click();
          downloadLink.remove();
          setDownloadMerSuccess(true);
          setTimeout(() => setDownloadMerSuccess(false), 3500);
        }
      };
      image.onerror = () => {
        handleDownloadMerSvg();
      };
      image.src = blobURL;
    } catch {
      handleDownloadMerSvg();
    }
  };

  const handleDownloadMerSvg = () => {
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', '/Diagrama_MER_Parqueadero_Autos_Colombia.svg');
    downloadAnchor.setAttribute('download', 'Diagrama_MER_Parqueadero_Autos_Colombia.svg');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    setDownloadMerSuccess(true);
    setTimeout(() => setDownloadMerSuccess(false), 3500);
  };

  const handleDownloadMrPng = () => {
    try {
      const svgElement = mrSvgRef.current;
      if (!svgElement) {
        window.open('/Diagrama_MR_Relacional_Parqueadero.svg', '_blank');
        return;
      }
      const svgString = new XMLSerializer().serializeToString(svgElement);
      const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
      const URL = window.URL || window.webkitURL || window;
      const blobURL = URL.createObjectURL(svgBlob);
      const image = new Image();

      image.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 2400; // Crisp high-res for 3FN relational diagram
        canvas.height = 1720;
        const context = canvas.getContext('2d');
        if (context) {
          context.fillStyle = '#f8fafc';
          context.fillRect(0, 0, canvas.width, canvas.height);
          context.drawImage(image, 0, 0, canvas.width, canvas.height);
          const pngUrl = canvas.toDataURL('image/png');
          const downloadLink = document.createElement('a');
          downloadLink.href = pngUrl;
          downloadLink.download = 'Diagrama_MR_Relacional_Parqueadero_Autos_Colombia.png';
          document.body.appendChild(downloadLink);
          downloadLink.click();
          downloadLink.remove();
          setDownloadMrSuccess(true);
          setTimeout(() => setDownloadMrSuccess(false), 3500);
        }
      };
      image.onerror = () => {
        handleDownloadMrSvg();
      };
      image.src = blobURL;
    } catch {
      handleDownloadMrSvg();
    }
  };

  const handleDownloadMrSvg = () => {
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', '/Diagrama_MR_Relacional_Parqueadero.svg');
    downloadAnchor.setAttribute('download', 'Diagrama_MR_Relacional_Parqueadero_Autos_Colombia.svg');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    setDownloadMrSuccess(true);
    setTimeout(() => setDownloadMrSuccess(false), 3500);
  };

  const handleDownloadMrTxt = () => {
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', '/Modelo_Relacional_3FN_Parqueadero.txt');
    downloadAnchor.setAttribute('download', 'Modelo_Relacional_3FN_Parqueadero_Autos_Colombia.txt');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    setDownloadMrSuccess(true);
    setTimeout(() => setDownloadMrSuccess(false), 3500);
  };

  const handleCopyMrNotation = () => {
    const textNotation = RELATIONAL_TABLES.map(t => {
      const cols = t.columns.map(c => c.isPk ? `${c.name} [PK]` : c.isFk ? `*${c.name} [FK]` : c.name).join(', ');
      const fks = t.foreignKeys.map(fk => `   - FK: ${fk.column} -> ${fk.targetTable}(${fk.targetColumn})`).join('\n');
      return `${t.tableName} (${cols})${fks ? '\n' + fks : ''}`;
    }).join('\n\n');

    navigator.clipboard.writeText(textNotation);
    setCopiedMr(true);
    setTimeout(() => setCopiedMr(false), 3000);
  };

  const currentTableData = RELATIONAL_TABLES.find(t => t.tableName === selectedTable) || RELATIONAL_TABLES[0];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 rounded-lg p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <Database className="w-3.5 h-3.5" />
                Modelado de Base de Datos · Ingeniería de Software
              </span>
              <span className="text-[11px] text-slate-500 font-medium">
                MER (Conceptual) · MR (Lógico 3FN) · Modelo Físico (SQL DDL)
              </span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Base de Datos: MER, MR y Modelo Físico
            </h1>
            <p className="mt-1 text-sm text-slate-600 max-w-3xl">
              Diseño integral de datos para "Parqueadero Autos Colombia", normalizado en Tercera Forma Normal (3FN), con integridad referencial, claves primarias (PK), foráneas (FK), índices y script DDL ejecutable.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={handleDownloadMerPng}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-emerald-800 bg-emerald-100 hover:bg-emerald-200 border border-emerald-300 rounded-md transition-colors shadow-xs cursor-pointer"
              title="Descargar imagen PNG del Diagrama MER Conceptual (Notación Peter Chen)"
            >
              {downloadMerSuccess ? (
                <>
                  <Check className="w-4 h-4 text-emerald-700" />
                  <span className="font-bold text-emerald-800">¡MER Descargado!</span>
                </>
              ) : (
                <>
                  <ImageIcon className="w-4 h-4 text-emerald-700" />
                  <span>Descargar MER (PNG)</span>
                </>
              )}
            </button>
            <button
              onClick={handleDownloadMrPng}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-sky-800 bg-sky-100 hover:bg-sky-200 border border-sky-300 rounded-md transition-colors shadow-xs cursor-pointer"
              title="Descargar imagen PNG del Modelo Relacional (MR - 3FN)"
            >
              {downloadMrSuccess ? (
                <>
                  <Check className="w-4 h-4 text-sky-700" />
                  <span className="font-bold text-sky-800">¡MR Descargado!</span>
                </>
              ) : (
                <>
                  <Table className="w-4 h-4 text-sky-700" />
                  <span>Descargar MR (PNG)</span>
                </>
              )}
            </button>
            <button
              onClick={handleCopySql}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors cursor-pointer"
              title="Copiar script SQL DDL al portapapeles"
            >
              {copiedSql ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-700 font-medium">¡SQL Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-slate-600" />
                  <span>Copiar SQL</span>
                </>
              )}
            </button>
            <button
              onClick={handleDownloadSql}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-md transition-colors shadow-xs cursor-pointer"
              title="Descargar script SQL DDL para PostgreSQL o MySQL"
            >
              <Download className="w-4 h-4" />
              <span>Script .sql</span>
            </button>
          </div>
        </div>

        {/* Sub Navigation Tabs */}
        <div className="flex items-center gap-2 mt-6 border-b border-slate-200 pb-2 text-xs font-medium overflow-x-auto">
          <button
            onClick={() => setActiveSubTab('mer')}
            className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap cursor-pointer ${
              activeSubTab === 'mer'
                ? 'bg-slate-900 text-white font-semibold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            1. MER (Modelo Entidad - Relación)
          </button>
          <button
            onClick={() => setActiveSubTab('mr')}
            className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap cursor-pointer ${
              activeSubTab === 'mr'
                ? 'bg-slate-900 text-white font-semibold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            2. MR (Modelo Relacional Lógico 3FN)
          </button>
          <button
            onClick={() => setActiveSubTab('fisico')}
            className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap cursor-pointer ${
              activeSubTab === 'fisico'
                ? 'bg-slate-900 text-white font-semibold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            3. Modelo Físico (Script SQL DDL)
          </button>
          <button
            onClick={() => setActiveSubTab('diccionario')}
            className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap cursor-pointer ${
              activeSubTab === 'diccionario'
                ? 'bg-slate-900 text-white font-semibold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            4. Diccionario de Datos ({RELATIONAL_TABLES.length} Tablas)
          </button>
        </div>
      </div>

      {/* ================= 1. MODELO ENTIDAD - RELACIÓN (MER) ================= */}
      {activeSubTab === 'mer' && (
        <div className="space-y-6">
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-xs space-y-2">
            <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm">
              <GitBranch className="w-4 h-4 text-emerald-700" />
              <span>Fundamento Conceptual del MER (Modelo Entidad - Relación)</span>
            </div>
            <p className="text-emerald-950 leading-relaxed text-[11px]">
              El MER describe la realidad del negocio a nivel semántico e independiente del motor de base de datos.
              En este sistema identificamos <strong>8 entidades fuertes</strong> y <strong>7 relaciones cardinales</strong> representadas con notación de Peter Chen y cardinalidad estándar:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 text-[11px] font-mono pt-1">
              <div className="p-2 bg-white rounded border border-emerald-100">
                <span className="font-bold text-emerald-700">VEHICULO - ENTRADA:</span>
                <p className="text-slate-600 font-sans text-[10px]">1 a (0,N) (Registra)</p>
              </div>
              <div className="p-2 bg-white rounded border border-emerald-100">
                <span className="font-bold text-emerald-700">ENTRADA - CELDA:</span>
                <p className="text-slate-600 font-sans text-[10px]">(0,1) a (1,1) (Ocupa)</p>
              </div>
              <div className="p-2 bg-white rounded border border-emerald-100">
                <span className="font-bold text-emerald-700">USUARIO - VEHICULO:</span>
                <p className="text-slate-600 font-sans text-[10px]">1 a (1,N) (Posee)</p>
              </div>
              <div className="p-2 bg-white rounded border border-emerald-100">
                <span className="font-bold text-emerald-700">USUARIO - SUSCRIPCIÓN:</span>
                <p className="text-slate-600 font-sans text-[10px]">1 a (1,1) (Contrata)</p>
              </div>
            </div>
          </div>

          {/* Canvas SVG del MER Conceptual con Botones de Descarga */}
          <div className="bg-white border border-slate-200 rounded-lg p-5 space-y-4 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-slate-900">
                    Diagrama MER Conceptual (Notación Peter Chen & Cardinalidades)
                  </h3>
                  <span className="text-xs font-mono font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    8 Entidades · 8 Relaciones
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Entidades (Rectángulos oscuros), Relaciones (Rombos verdes), Claves Primarias (PK) y Atributos.
                </p>
              </div>

              {/* Botones directos de descarga del MER */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={handleDownloadMerPng}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-md transition-all shadow-xs cursor-pointer"
                  title="Descargar diagrama MER en formato imagen PNG de alta resolución"
                >
                  {downloadMerSuccess ? (
                    <>
                      <Check className="w-4 h-4 text-white" />
                      <span>¡Descargado con Éxito!</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      <span>Descargar Diagrama MER (PNG)</span>
                    </>
                  )}
                </button>
                <button
                  onClick={handleDownloadMerSvg}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-md transition-colors cursor-pointer"
                  title="Descargar archivo vectorial SVG"
                >
                  <Download className="w-3.5 h-3.5 text-slate-500" />
                  <span>SVG Vectorial</span>
                </button>
                <a
                  href="/Diagrama_MER_Parqueadero_Autos_Colombia.svg"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-2.5 py-2 text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-md transition-colors"
                  title="Abrir imagen SVG en pestaña completa"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span className="hidden md:inline">Ver Directo</span>
                </a>
              </div>
            </div>

            {/* Notificación de éxito si descargó */}
            {downloadMerSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-md flex items-center justify-between text-xs text-emerald-800">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>
                    <strong>¡Descarga completada!</strong> El archivo <code>Diagrama_MER_Parqueadero_Autos_Colombia.png</code> se guardó en tu carpeta de Descargas. Ya puedes pegarlo en tu documento de Word o PDF.
                  </span>
                </div>
              </div>
            )}

            {/* Contenedor del Diagrama SVG */}
            <div className="overflow-x-auto border border-slate-200 rounded-lg bg-slate-50/50 p-2">
              <svg
                ref={merSvgRef}
                viewBox="0 0 1060 740"
                className="w-full max-w-[1060px] h-auto bg-white rounded mx-auto"
                style={{ minWidth: '780px' }}
              >
                <defs>
                  <marker
                    id="mer-arrow"
                    viewBox="0 0 10 10"
                    refX="9"
                    refY="5"
                    markerWidth="6"
                    markerHeight="6"
                    orient="auto-start-reverse"
                  >
                    <path d="M 0 1 L 10 5 L 0 9 z" fill="#334155" />
                  </marker>
                </defs>

                {/* Líneas de conexión */}
                {/* VEHICULO <-> REGISTRA <-> ENTRADA */}
                <line x1="200" y1="110" x2="290" y2="110" stroke="#475569" strokeWidth="2" />
                <line x1="370" y1="110" x2="460" y2="110" stroke="#475569" strokeWidth="2" />

                {/* ENTRADA <-> ASIGNA <-> CELDA */}
                <line x1="600" y1="110" x2="680" y2="110" stroke="#475569" strokeWidth="2" />
                <line x1="760" y1="110" x2="840" y2="110" stroke="#475569" strokeWidth="2" />

                {/* VEHICULO <-> REPORTA <-> NOVEDAD */}
                <line x1="130" y1="140" x2="130" y2="240" stroke="#475569" strokeWidth="2" />
                <line x1="130" y1="310" x2="130" y2="390" stroke="#475569" strokeWidth="2" />

                {/* USUARIO <-> POSEE <-> VEHICULO */}
                <line x1="460" y1="420" x2="380" y2="420" stroke="#475569" strokeWidth="2" />
                <line x1="300" y1="420" x2="180" y2="150" stroke="#475569" strokeWidth="2" />

                {/* USUARIO <-> CONTRATA <-> SUSCRIPCION */}
                <line x1="600" y1="420" x2="680" y2="420" stroke="#475569" strokeWidth="2" />
                <line x1="760" y1="420" x2="840" y2="420" stroke="#475569" strokeWidth="2" />

                {/* ENTRADA <-> LIQUIDA <-> PAGO */}
                <line x1="530" y1="140" x2="530" y2="240" stroke="#475569" strokeWidth="2" />
                <line x1="530" y1="310" x2="530" y2="590" stroke="#475569" strokeWidth="2" />

                {/* SUSCRIPCION <-> ABONA <-> PAGO */}
                <line x1="910" y1="450" x2="910" y2="520" stroke="#475569" strokeWidth="2" />
                <line x1="910" y1="580" x2="910" y2="620" stroke="#475569" strokeWidth="2" />
                <line x1="910" y1="620" x2="600" y2="620" stroke="#475569" strokeWidth="2" />

                {/* TARIFA <-> APLICA <-> PAGO */}
                <line x1="200" y1="620" x2="290" y2="620" stroke="#475569" strokeWidth="2" />
                <line x1="370" y1="620" x2="460" y2="620" stroke="#475569" strokeWidth="2" />

                {/* ================= ENTIDADES (RECTÁNGULOS OSCUROS SLATE) ================= */}
                {/* 1. VEHICULO */}
                <g>
                  <rect x="60" y="80" width="140" height="60" fill="#0f172a" rx="5" />
                  <text x="130" y="115" fill="#ffffff" fontWeight="bold" fontSize="12" textAnchor="middle" fontFamily="sans-serif">VEHÍCULO</text>
                  <text x="60" y="70" fill="#2563eb" fontSize="10" fontWeight="bold" fontFamily="monospace">PK: placa</text>
                </g>

                {/* 2. ENTRADA_VEHICULO */}
                <g>
                  <rect x="460" y="80" width="140" height="60" fill="#0f172a" rx="5" />
                  <text x="530" y="115" fill="#ffffff" fontWeight="bold" fontSize="12" textAnchor="middle" fontFamily="sans-serif">ENTRADA</text>
                  <text x="460" y="70" fill="#2563eb" fontSize="10" fontWeight="bold" fontFamily="monospace">PK: id_entrada</text>
                </g>

                {/* 3. CELDA_PARQUEO */}
                <g>
                  <rect x="840" y="80" width="140" height="60" fill="#0f172a" rx="5" />
                  <text x="910" y="115" fill="#ffffff" fontWeight="bold" fontSize="12" textAnchor="middle" fontFamily="sans-serif">CELDA</text>
                  <text x="840" y="70" fill="#2563eb" fontSize="10" fontWeight="bold" fontFamily="monospace">PK: id_celda</text>
                </g>

                {/* 4. NOVEDAD_VEHICULO */}
                <g>
                  <rect x="60" y="390" width="140" height="60" fill="#0f172a" rx="5" />
                  <text x="130" y="425" fill="#ffffff" fontWeight="bold" fontSize="12" textAnchor="middle" fontFamily="sans-serif">NOVEDAD</text>
                  <text x="60" y="380" fill="#2563eb" fontSize="10" fontWeight="bold" fontFamily="monospace">PK: id_novedad</text>
                </g>

                {/* 5. USUARIO_MENSUALISTA */}
                <g>
                  <rect x="460" y="390" width="140" height="60" fill="#0f172a" rx="5" />
                  <text x="530" y="425" fill="#ffffff" fontWeight="bold" fontSize="12" textAnchor="middle" fontFamily="sans-serif">MENSUALISTA</text>
                  <text x="460" y="380" fill="#2563eb" fontSize="10" fontWeight="bold" fontFamily="monospace">PK: id_usuario</text>
                </g>

                {/* 6. SUSCRIPCION_MENSUAL */}
                <g>
                  <rect x="840" y="390" width="140" height="60" fill="#0f172a" rx="5" />
                  <text x="910" y="425" fill="#ffffff" fontWeight="bold" fontSize="12" textAnchor="middle" fontFamily="sans-serif">SUSCRIPCIÓN</text>
                  <text x="840" y="380" fill="#2563eb" fontSize="10" fontWeight="bold" fontFamily="monospace">PK: id_suscripcion</text>
                </g>

                {/* 7. PAGO */}
                <g>
                  <rect x="460" y="590" width="140" height="60" fill="#0f172a" rx="5" />
                  <text x="530" y="625" fill="#ffffff" fontWeight="bold" fontSize="12" textAnchor="middle" fontFamily="sans-serif">PAGO / FACTURA</text>
                  <text x="460" y="580" fill="#2563eb" fontSize="10" fontWeight="bold" fontFamily="monospace">PK: id_pago</text>
                </g>

                {/* 8. TARIFA */}
                <g>
                  <rect x="60" y="590" width="140" height="60" fill="#0f172a" rx="5" />
                  <text x="130" y="625" fill="#ffffff" fontWeight="bold" fontSize="12" textAnchor="middle" fontFamily="sans-serif">TARIFA</text>
                  <text x="60" y="580" fill="#2563eb" fontSize="10" fontWeight="bold" fontFamily="monospace">PK: id_tarifa</text>
                </g>

                {/* ================= RELACIONES (ROMBOS VERDES ESMERALDA) ================= */}
                {/* 1. REGISTRA */}
                <g>
                  <polygon points="330,80 370,110 330,140 290,110" fill="#10b981" stroke="#059669" strokeWidth="1.5" />
                  <text x="330" y="113" fill="#ffffff" fontWeight="bold" fontSize="9" textAnchor="middle" fontFamily="sans-serif">REGISTRA</text>
                  <text x="215" y="103" fill="#0f172a" fontSize="10" fontWeight="bold" fontFamily="monospace">1 (1,1)</text>
                  <text x="420" y="103" fill="#0f172a" fontSize="10" fontWeight="bold" fontFamily="monospace">N (0,n)</text>
                </g>

                {/* 2. ASIGNA */}
                <g>
                  <polygon points="720,80 760,110 720,140 680,110" fill="#10b981" stroke="#059669" strokeWidth="1.5" />
                  <text x="720" y="113" fill="#ffffff" fontWeight="bold" fontSize="9" textAnchor="middle" fontFamily="sans-serif">ASIGNA</text>
                  <text x="615" y="103" fill="#0f172a" fontSize="10" fontWeight="bold" fontFamily="monospace">1 (0,1)</text>
                  <text x="800" y="103" fill="#0f172a" fontSize="10" fontWeight="bold" fontFamily="monospace">1 (1,1)</text>
                </g>

                {/* 3. REPORTA */}
                <g>
                  <polygon points="130,240 165,275 130,310 95,275" fill="#10b981" stroke="#059669" strokeWidth="1.5" />
                  <text x="130" y="278" fill="#ffffff" fontWeight="bold" fontSize="8.5" textAnchor="middle" fontFamily="sans-serif">REPORTA</text>
                  <text x="140" y="170" fill="#0f172a" fontSize="10" fontWeight="bold" fontFamily="monospace">1 (1,1)</text>
                  <text x="140" y="370" fill="#0f172a" fontSize="10" fontWeight="bold" fontFamily="monospace">N (0,n)</text>
                </g>

                {/* 4. POSEE */}
                <g>
                  <polygon points="340,390 375,420 340,450 305,420" fill="#10b981" stroke="#059669" strokeWidth="1.5" />
                  <text x="340" y="423" fill="#ffffff" fontWeight="bold" fontSize="9" textAnchor="middle" fontFamily="sans-serif">POSEE</text>
                  <text x="420" y="410" fill="#0f172a" fontSize="10" fontWeight="bold" fontFamily="monospace">1 (1,1)</text>
                  <text x="210" y="180" fill="#0f172a" fontSize="10" fontWeight="bold" fontFamily="monospace">N (1,n)</text>
                </g>

                {/* 5. CONTRATA */}
                <g>
                  <polygon points="720,390 760,420 720,450 680,420" fill="#10b981" stroke="#059669" strokeWidth="1.5" />
                  <text x="720" y="423" fill="#ffffff" fontWeight="bold" fontSize="8" textAnchor="middle" fontFamily="sans-serif">CONTRATA</text>
                  <text x="615" y="410" fill="#0f172a" fontSize="10" fontWeight="bold" fontFamily="monospace">1 (1,1)</text>
                  <text x="800" y="410" fill="#0f172a" fontSize="10" fontWeight="bold" fontFamily="monospace">1 (1,1)</text>
                </g>

                {/* 6. LIQUIDA */}
                <g>
                  <polygon points="530,240 565,275 530,310 495,275" fill="#10b981" stroke="#059669" strokeWidth="1.5" />
                  <text x="530" y="278" fill="#ffffff" fontWeight="bold" fontSize="9" textAnchor="middle" fontFamily="sans-serif">LIQUIDA</text>
                  <text x="540" y="170" fill="#0f172a" fontSize="10" fontWeight="bold" fontFamily="monospace">1 (1,1)</text>
                  <text x="540" y="570" fill="#0f172a" fontSize="10" fontWeight="bold" fontFamily="monospace">1 (0,1)</text>
                </g>

                {/* 7. ABONA */}
                <g>
                  <polygon points="910,520 945,550 910,580 875,550" fill="#10b981" stroke="#059669" strokeWidth="1.5" />
                  <text x="910" y="554" fill="#ffffff" fontWeight="bold" fontSize="8.5" textAnchor="middle" fontFamily="sans-serif">ABONA</text>
                  <text x="920" y="480" fill="#0f172a" fontSize="10" fontWeight="bold" fontFamily="monospace">1 (1,1)</text>
                  <text x="700" y="612" fill="#0f172a" fontSize="10" fontWeight="bold" fontFamily="monospace">N (0,n)</text>
                </g>

                {/* 8. APLICA */}
                <g>
                  <polygon points="330,590 370,620 330,650 290,620" fill="#10b981" stroke="#059669" strokeWidth="1.5" />
                  <text x="330" y="624" fill="#ffffff" fontWeight="bold" fontSize="9" textAnchor="middle" fontFamily="sans-serif">APLICA</text>
                  <text x="215" y="612" fill="#0f172a" fontSize="10" fontWeight="bold" fontFamily="monospace">1 (1,1)</text>
                  <text x="420" y="612" fill="#0f172a" fontSize="10" fontWeight="bold" fontFamily="monospace">N (1,n)</text>
                </g>

                {/* Leyenda en el canvas */}
                <rect x="50" y="690" width="960" height="32" rx="4" fill="#f8fafc" stroke="#e2e8f0" />
                <rect x="65" y="700" width="14" height="12" fill="#0f172a" rx="2" />
                <text x="85" y="710" fill="#334155" fontSize="10" fontWeight="600" fontFamily="sans-serif">Entidad Fuerte (Rectángulo)</text>

                <polygon points="265,706 273,700 281,706 273,712" fill="#10b981" />
                <text x="290" y="710" fill="#334155" fontSize="10" fontWeight="600" fontFamily="sans-serif">Relación Semántica (Rombo)</text>

                <text x="500" y="710" fill="#2563eb" fontSize="10" fontWeight="bold" fontFamily="monospace">PK: Clave Primaria</text>
                <text x="680" y="710" fill="#0f172a" fontSize="10" fontWeight="bold" fontFamily="monospace">(min, max): Cardinalidad Formal</text>
              </svg>
            </div>

            {/* Tarjeta de ayuda rápida para el trabajo de grado / informe académico */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-2">
              <div className="flex items-center gap-2 text-slate-900 font-semibold text-xs">
                <HelpCircle className="w-4 h-4 text-emerald-600" />
                <span>¿Cómo usar este MER en tu entrega académica de la IU Digital?</span>
              </div>
              <ul className="text-slate-600 space-y-1 list-disc list-inside text-[11px] leading-relaxed">
                <li>
                  <strong>Descarga con 1 Clic:</strong> Pulsa el botón verde <strong>"Descargar Diagrama MER (PNG)"</strong>. Se descargará una imagen en alta definición lista para insertar en Word o Google Docs.
                </li>
                <li>
                  <strong>Formato Vectorial:</strong> Si prefieres insertarlo en Illustrator o Visio, usa el botón <strong>"SVG Vectorial"</strong> o abre el <a href="/Diagrama_MER_Parqueadero_Autos_Colombia.svg" target="_blank" className="text-emerald-700 underline font-semibold">enlace directo del archivo SVG</a>.
                </li>
                <li>
                  <strong>Criterios Académicos Cubiertos:</strong> Notación de Peter Chen, 8 entidades del dominio, 8 relaciones con cardinalidad mínima y máxima, y claves primarias (PK) identificadas.
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* ================= 2. MODELO RELACIONAL (MR LÓGICO 3FN) ================= */}
      {activeSubTab === 'mr' && (
        <div className="space-y-6">
          {/* Encabezado del MR */}
          <div className="p-4 bg-slate-900 text-white rounded-lg text-xs space-y-2">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
              <Table className="w-4 h-4" />
              <span>Esquema Lógico Relacional Normalizado en Tercera Forma Normal (3FN)</span>
            </div>
            <p className="text-slate-300 leading-relaxed text-[11px]">
              El Modelo Relacional traduce las entidades y relaciones a tablas con claves primarias (<strong>PK</strong> identificadas y subrayadas) y claves foráneas (<strong>FK</strong> con flechas de integridad referencial), garantizando la ausencia de anomalías de inserción, actualización o eliminación.
            </p>
          </div>

          {/* Diagrama Visual del Esquema Relacional (MR) */}
          <div className="bg-white border border-slate-200 rounded-lg p-5 space-y-4 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-slate-900">
                    Diagrama del Modelo Relacional (Esquema Lógico 3FN)
                  </h3>
                  <span className="text-xs font-mono font-semibold text-sky-700 bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
                    8 Tablas Relacionales · 7 Claves Foráneas (FK)
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Estructura física de columnas, tipos de datos, claves primarias [PK] y enlaces de integridad referencial [FK].
                </p>
              </div>

              {/* Botones de Descarga del MR */}
              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <button
                  onClick={handleDownloadMrPng}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 rounded-md transition-all shadow-xs cursor-pointer"
                  title="Descargar diagrama del Modelo Relacional en formato imagen PNG de alta resolución"
                >
                  {downloadMrSuccess ? (
                    <>
                      <Check className="w-4 h-4 text-white" />
                      <span>¡Descargado con Éxito!</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      <span>Descargar Esquema MR (PNG)</span>
                    </>
                  )}
                </button>
                <button
                  onClick={handleDownloadMrSvg}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-md transition-colors cursor-pointer"
                  title="Descargar archivo vectorial SVG del Modelo Relacional"
                >
                  <Download className="w-3.5 h-3.5 text-slate-500" />
                  <span>SVG Vectorial</span>
                </button>
                <button
                  onClick={handleDownloadMrTxt}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-md transition-colors cursor-pointer"
                  title="Descargar documento de texto formal del Modelo Relacional"
                >
                  <FileText className="w-3.5 h-3.5 text-slate-500" />
                  <span>Esquema (.txt)</span>
                </button>
                <button
                  onClick={handleCopyMrNotation}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-md transition-colors cursor-pointer"
                  title="Copiar notación matemática relacional al portapapeles"
                >
                  {copiedMr ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700 font-medium">¡Copiado!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-500" />
                      <span>Copiar 3FN</span>
                    </>
                  )}
                </button>
                <a
                  href="/Diagrama_MR_Relacional_Parqueadero.svg"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-2.5 py-2 text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-md transition-colors"
                  title="Abrir imagen SVG en pestaña completa"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span className="hidden md:inline">Ver Directo</span>
                </a>
              </div>
            </div>

            {/* Notificación de éxito si descargó */}
            {downloadMrSuccess && (
              <div className="p-3 bg-sky-50 border border-sky-200 rounded-md flex items-center justify-between text-xs text-sky-800">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-sky-600 shrink-0" />
                  <span>
                    <strong>¡Descarga completada!</strong> El archivo <code>Diagrama_MR_Relacional_Parqueadero_Autos_Colombia.png</code> se guardó en tu carpeta de Descargas. Ya puedes pegarlo en tu entrega de Word o PDF.
                  </span>
                </div>
              </div>
            )}

            {/* Contenedor del Diagrama Visual SVG del Modelo Relacional */}
            <div className="overflow-x-auto border border-slate-200 rounded-lg bg-slate-100/60 p-2">
              <svg
                ref={mrSvgRef}
                viewBox="0 0 1200 860"
                className="w-full max-w-[1200px] h-auto bg-slate-50 rounded mx-auto"
                style={{ minWidth: '850px' }}
              >
                <defs>
                  <filter id="mr-view-shadow" x="-3%" y="-3%" width="106%" height="106%">
                    <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.08" />
                  </filter>
                  <marker id="mr-fk-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                    <path d="M 0 1 L 10 5 L 0 9 z" fill="#0284c7" />
                  </marker>
                </defs>

                {/* Banner de Título */}
                <rect x="0" y="0" width="1200" height="60" fill="#0f172a" />
                <text x="35" y="36" fill="#ffffff" fontSize="18" fontWeight="bold">PARQUEADERO AUTOS COLOMBIA · MODELO RELACIONAL LÓGICO (MR - 3FN)</text>
                <text x="890" y="36" fill="#38bdf8" fontSize="12" fontWeight="600">8 Tablas Relacionales · Integridad Referencial</text>

                {/* Líneas de conexión FK -> PK */}
                {/* 1. VEHICULOS.id_usuario_propietario (FK) -> USUARIOS_MENSUALISTAS.id_usuario (PK) */}
                <path d="M 285 245 L 320 245 L 320 160 L 350 160" fill="none" stroke="#0284c7" strokeWidth="2" strokeDasharray="4,3" markerEnd="url(#mr-fk-arrow)" />

                {/* 2. NOVEDADES.placa_vehiculo (FK) -> VEHICULOS.placa (PK) */}
                <path d="M 165 470 L 165 310" fill="none" stroke="#0284c7" strokeWidth="2" markerEnd="url(#mr-fk-arrow)" />

                {/* 3. ENTRADAS.placa_vehiculo (FK) -> VEHICULOS.placa (PK) */}
                <path d="M 640 180 L 285 180" fill="none" stroke="#0284c7" strokeWidth="2" markerEnd="url(#mr-fk-arrow)" />

                {/* 4. ENTRADAS.id_celda_asignada (FK) -> CELDAS_PARQUEO.id_celda (PK) */}
                <path d="M 890 205 L 940 205" fill="none" stroke="#0284c7" strokeWidth="2" markerEnd="url(#mr-fk-arrow)" />

                {/* 5. SUSCRIPCIONES.id_usuario (FK) -> USUARIOS_MENSUALISTAS.id_usuario (PK) */}
                <path d="M 475 480 L 475 350" fill="none" stroke="#0284c7" strokeWidth="2" markerEnd="url(#mr-fk-arrow)" />

                {/* 6. PAGOS.id_entrada (FK) -> ENTRADAS.id_entrada (PK) */}
                <path d="M 765 520 L 765 360" fill="none" stroke="#0284c7" strokeWidth="2" markerEnd="url(#mr-fk-arrow)" />

                {/* 7. PAGOS.id_suscripcion (FK) -> SUSCRIPCIONES.id_suscripcion (PK) */}
                <path d="M 640 590 L 600 590" fill="none" stroke="#0284c7" strokeWidth="2" markerEnd="url(#mr-fk-arrow)" />

                {/* 8. PAGOS.id_tarifa_aplicada (FK) -> TARIFAS.id_tarifa (PK) */}
                <path d="M 890 640 L 940 640" fill="none" stroke="#0284c7" strokeWidth="2" markerEnd="url(#mr-fk-arrow)" />

                {/* ================= TABLA 1: VEHICULOS ================= */}
                <g filter="url(#mr-view-shadow)" transform="translate(35, 90)">
                  <rect width="250" height="230" rx="6" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
                  <path d="M 0 6 Q 0 0 6 0 L 244 0 Q 250 0 250 6 L 250 32 L 0 32 Z" fill="#0f172a" />
                  <text x="15" y="21" fill="#ffffff" fontSize="12" fontWeight="bold">VEHICULOS</text>
                  <text x="235" y="21" fill="#94a3b8" fontSize="10" textAnchor="end">Catálogo</text>

                  <rect x="0" y="32" width="250" height="26" fill="#fef3c7" />
                  <text x="12" y="49" fill="#92400e" fontSize="10.5" fontWeight="bold">🔑 placa</text>
                  <text x="238" y="49" fill="#78350f" fontSize="9.5" fontFamily="monospace" textAnchor="end">VARCHAR(8) [PK]</text>

                  <text x="12" y="75" fill="#334155" fontSize="10.5">tipo_vehiculo</text>
                  <text x="238" y="75" fill="#64748b" fontSize="9.5" fontFamily="monospace" textAnchor="end">VARCHAR(20)</text>

                  <text x="12" y="101" fill="#334155" fontSize="10.5">marca</text>
                  <text x="238" y="101" fill="#64748b" fontSize="9.5" fontFamily="monospace" textAnchor="end">VARCHAR(40)</text>

                  <text x="12" y="127" fill="#334155" fontSize="10.5">modelo</text>
                  <text x="238" y="127" fill="#64748b" fontSize="9.5" fontFamily="monospace" textAnchor="end">VARCHAR(40)</text>

                  <text x="12" y="153" fill="#334155" fontSize="10.5">color</text>
                  <text x="238" y="153" fill="#64748b" fontSize="9.5" fontFamily="monospace" textAnchor="end">VARCHAR(30)</text>

                  <rect x="0" y="162" width="250" height="26" fill="#f0f9ff" />
                  <text x="12" y="179" fill="#0369a1" fontSize="10.5" fontWeight="bold">🔗 id_usuario_propietario</text>
                  <text x="238" y="179" fill="#0284c7" fontSize="9.5" fontFamily="monospace" textAnchor="end">UUID [FK]</text>

                  <text x="12" y="209" fill="#334155" fontSize="10.5">creado_en</text>
                  <text x="238" y="209" fill="#64748b" fontSize="9.5" fontFamily="monospace" textAnchor="end">TIMESTAMP</text>
                </g>

                {/* ================= TABLA 2: USUARIOS_MENSUALISTAS ================= */}
                <g filter="url(#mr-view-shadow)" transform="translate(350, 90)">
                  <rect width="250" height="255" rx="6" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
                  <path d="M 0 6 Q 0 0 6 0 L 244 0 Q 250 0 250 6 L 250 32 L 0 32 Z" fill="#0f172a" />
                  <text x="15" y="21" fill="#ffffff" fontSize="12" fontWeight="bold">USUARIOS_MENSUALISTAS</text>

                  <rect x="0" y="32" width="250" height="26" fill="#fef3c7" />
                  <text x="12" y="49" fill="#92400e" fontSize="10.5" fontWeight="bold">🔑 id_usuario</text>
                  <text x="238" y="49" fill="#78350f" fontSize="9.5" fontFamily="monospace" textAnchor="end">UUID [PK]</text>

                  <text x="12" y="75" fill="#334155" fontSize="10.5">tipo_documento</text>
                  <text x="238" y="75" fill="#64748b" fontSize="9.5" fontFamily="monospace" textAnchor="end">VARCHAR(10)</text>

                  <text x="12" y="101" fill="#334155" fontSize="10.5">numero_documento</text>
                  <text x="238" y="101" fill="#64748b" fontSize="9.5" fontFamily="monospace" textAnchor="end">VARCHAR(25)</text>

                  <text x="12" y="127" fill="#334155" fontSize="10.5">nombres</text>
                  <text x="238" y="127" fill="#64748b" fontSize="9.5" fontFamily="monospace" textAnchor="end">VARCHAR(60)</text>

                  <text x="12" y="153" fill="#334155" fontSize="10.5">apellidos</text>
                  <text x="238" y="153" fill="#64748b" fontSize="9.5" fontFamily="monospace" textAnchor="end">VARCHAR(60)</text>

                  <text x="12" y="179" fill="#334155" fontSize="10.5">telefono</text>
                  <text x="238" y="179" fill="#64748b" fontSize="9.5" fontFamily="monospace" textAnchor="end">VARCHAR(20)</text>

                  <text x="12" y="205" fill="#334155" fontSize="10.5">email</text>
                  <text x="238" y="205" fill="#64748b" fontSize="9.5" fontFamily="monospace" textAnchor="end">VARCHAR(100)</text>

                  <text x="12" y="231" fill="#334155" fontSize="10.5">estado</text>
                  <text x="238" y="231" fill="#64748b" fontSize="9.5" fontFamily="monospace" textAnchor="end">VARCHAR(20)</text>
                </g>

                {/* ================= TABLA 3: ENTRADAS_VEHICULOS ================= */}
                <g filter="url(#mr-view-shadow)" transform="translate(640, 90)">
                  <rect width="250" height="260" rx="6" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
                  <path d="M 0 6 Q 0 0 6 0 L 244 0 Q 250 0 250 6 L 250 32 L 0 32 Z" fill="#0f172a" />
                  <text x="15" y="21" fill="#ffffff" fontSize="12" fontWeight="bold">ENTRADAS_VEHICULOS</text>

                  <rect x="0" y="32" width="250" height="26" fill="#fef3c7" />
                  <text x="12" y="49" fill="#92400e" fontSize="10.5" fontWeight="bold">🔑 id_entrada</text>
                  <text x="238" y="49" fill="#78350f" fontSize="9.5" fontFamily="monospace" textAnchor="end">UUID [PK]</text>

                  <rect x="0" y="58" width="250" height="26" fill="#f0f9ff" />
                  <text x="12" y="75" fill="#0369a1" fontSize="10.5" fontWeight="bold">🔗 placa_vehiculo</text>
                  <text x="238" y="75" fill="#0284c7" fontSize="9.5" fontFamily="monospace" textAnchor="end">VARCHAR(8) [FK]</text>

                  <rect x="0" y="84" width="250" height="26" fill="#f0f9ff" />
                  <text x="12" y="101" fill="#0369a1" fontSize="10.5" fontWeight="bold">🔗 id_celda_asignada</text>
                  <text x="238" y="101" fill="#0284c7" fontSize="9.5" fontFamily="monospace" textAnchor="end">VARCHAR(10) [FK]</text>

                  <text x="12" y="127" fill="#334155" fontSize="10.5">fecha_hora_ingreso</text>
                  <text x="238" y="127" fill="#64748b" fontSize="9.5" fontFamily="monospace" textAnchor="end">TIMESTAMP</text>

                  <text x="12" y="153" fill="#334155" fontSize="10.5">fecha_hora_salida</text>
                  <text x="238" y="153" fill="#64748b" fontSize="9.5" fontFamily="monospace" textAnchor="end">TIMESTAMP</text>

                  <text x="12" y="179" fill="#334155" fontSize="10.5">tiempo_total_minutos</text>
                  <text x="238" y="179" fill="#64748b" fontSize="9.5" fontFamily="monospace" textAnchor="end">INT</text>

                  <text x="12" y="205" fill="#334155" fontSize="10.5">estado_estancia</text>
                  <text x="238" y="205" fill="#64748b" fontSize="9.5" fontFamily="monospace" textAnchor="end">VARCHAR(20)</text>

                  <text x="12" y="231" fill="#334155" fontSize="10.5">observaciones_ingreso</text>
                  <text x="238" y="231" fill="#64748b" fontSize="9.5" fontFamily="monospace" textAnchor="end">TEXT</text>
                </g>

                {/* ================= TABLA 4: CELDAS_PARQUEO ================= */}
                <g filter="url(#mr-view-shadow)" transform="translate(940, 90)">
                  <rect width="225" height="180" rx="6" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
                  <path d="M 0 6 Q 0 0 6 0 L 219 0 Q 225 0 225 6 L 225 32 L 0 32 Z" fill="#0f172a" />
                  <text x="15" y="21" fill="#ffffff" fontSize="12" fontWeight="bold">CELDAS_PARQUEO</text>

                  <rect x="0" y="32" width="225" height="26" fill="#fef3c7" />
                  <text x="12" y="49" fill="#92400e" fontSize="10.5" fontWeight="bold">🔑 id_celda</text>
                  <text x="213" y="49" fill="#78350f" fontSize="9.5" fontFamily="monospace" textAnchor="end">VARCHAR [PK]</text>

                  <text x="12" y="75" fill="#334155" fontSize="10.5">numero_celda</text>
                  <text x="213" y="75" fill="#64748b" fontSize="9.5" fontFamily="monospace" textAnchor="end">VARCHAR(10)</text>

                  <text x="12" y="101" fill="#334155" fontSize="10.5">tipo_permitido</text>
                  <text x="213" y="101" fill="#64748b" fontSize="9.5" fontFamily="monospace" textAnchor="end">VARCHAR(20)</text>

                  <text x="12" y="127" fill="#334155" fontSize="10.5">piso_zona</text>
                  <text x="213" y="127" fill="#64748b" fontSize="9.5" fontFamily="monospace" textAnchor="end">VARCHAR(20)</text>

                  <text x="12" y="153" fill="#334155" fontSize="10.5">estado_ocupacion</text>
                  <text x="213" y="153" fill="#64748b" fontSize="9.5" fontFamily="monospace" textAnchor="end">VARCHAR(20)</text>
                </g>

                {/* ================= TABLA 5: NOVEDADES_VEHICULOS ================= */}
                <g filter="url(#mr-view-shadow)" transform="translate(35, 470)">
                  <rect width="250" height="235" rx="6" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
                  <path d="M 0 6 Q 0 0 6 0 L 244 0 Q 250 0 250 6 L 250 32 L 0 32 Z" fill="#0f172a" />
                  <text x="15" y="21" fill="#ffffff" fontSize="12" fontWeight="bold">NOVEDADES_VEHICULOS</text>

                  <rect x="0" y="32" width="250" height="26" fill="#fef3c7" />
                  <text x="12" y="49" fill="#92400e" fontSize="10.5" fontWeight="bold">🔑 id_novedad</text>
                  <text x="238" y="49" fill="#78350f" fontSize="9.5" fontFamily="monospace" textAnchor="end">UUID [PK]</text>

                  <rect x="0" y="58" width="250" height="26" fill="#f0f9ff" />
                  <text x="12" y="75" fill="#0369a1" fontSize="10.5" fontWeight="bold">🔗 placa_vehiculo</text>
                  <text x="238" y="75" fill="#0284c7" fontSize="9.5" fontFamily="monospace" textAnchor="end">VARCHAR(8) [FK]</text>

                  <text x="12" y="101" fill="#334155" fontSize="10.5">tipo_novedad</text>
                  <text x="238" y="101" fill="#64748b" fontSize="9.5" fontFamily="monospace" textAnchor="end">VARCHAR(30)</text>

                  <text x="12" y="127" fill="#334155" fontSize="10.5">ubicacion_vehiculo</text>
                  <text x="238" y="127" fill="#64748b" fontSize="9.5" fontFamily="monospace" textAnchor="end">VARCHAR(50)</text>

                  <text x="12" y="153" fill="#334155" fontSize="10.5">descripcion_dano</text>
                  <text x="238" y="153" fill="#64748b" fontSize="9.5" fontFamily="monospace" textAnchor="end">TEXT</text>

                  <text x="12" y="179" fill="#334155" fontSize="10.5">foto_evidencia_url</text>
                  <text x="238" y="179" fill="#64748b" fontSize="9.5" fontFamily="monospace" textAnchor="end">VARCHAR(255)</text>

                  <text x="12" y="205" fill="#334155" fontSize="10.5">reportado_por</text>
                  <text x="238" y="205" fill="#64748b" fontSize="9.5" fontFamily="monospace" textAnchor="end">VARCHAR(100)</text>
                </g>

                {/* ================= TABLA 6: SUSCRIPCIONES_MENSUALES ================= */}
                <g filter="url(#mr-view-shadow)" transform="translate(350, 480)">
                  <rect width="250" height="225" rx="6" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
                  <path d="M 0 6 Q 0 0 6 0 L 244 0 Q 250 0 250 6 L 250 32 L 0 32 Z" fill="#0f172a" />
                  <text x="15" y="21" fill="#ffffff" fontSize="12" fontWeight="bold">SUSCRIPCIONES_MENSUALES</text>

                  <rect x="0" y="32" width="250" height="26" fill="#fef3c7" />
                  <text x="12" y="49" fill="#92400e" fontSize="10.5" fontWeight="bold">🔑 id_suscripcion</text>
                  <text x="238" y="49" fill="#78350f" fontSize="9.5" fontFamily="monospace" textAnchor="end">UUID [PK]</text>

                  <rect x="0" y="58" width="250" height="26" fill="#f0f9ff" />
                  <text x="12" y="75" fill="#0369a1" fontSize="10.5" fontWeight="bold">🔗 id_usuario</text>
                  <text x="238" y="75" fill="#0284c7" fontSize="9.5" fontFamily="monospace" textAnchor="end">UUID [FK]</text>

                  <text x="12" y="101" fill="#334155" fontSize="10.5">fecha_inicio</text>
                  <text x="238" y="101" fill="#64748b" fontSize="9.5" fontFamily="monospace" textAnchor="end">DATE</text>

                  <text x="12" y="127" fill="#334155" fontSize="10.5">fecha_fin</text>
                  <text x="238" y="127" fill="#64748b" fontSize="9.5" fontFamily="monospace" textAnchor="end">DATE</text>

                  <text x="12" y="153" fill="#334155" fontSize="10.5">valor_mensual</text>
                  <text x="238" y="153" fill="#64748b" fontSize="9.5" fontFamily="monospace" textAnchor="end">DECIMAL(12,2)</text>

                  <text x="12" y="179" fill="#334155" fontSize="10.5">estado_suscripcion</text>
                  <text x="238" y="179" fill="#64748b" fontSize="9.5" fontFamily="monospace" textAnchor="end">VARCHAR(20)</text>

                  <text x="12" y="205" fill="#334155" fontSize="10.5">renovacion_automatica</text>
                  <text x="238" y="205" fill="#64748b" fontSize="9.5" fontFamily="monospace" textAnchor="end">BOOLEAN</text>
                </g>

                {/* ================= TABLA 7: PAGOS ================= */}
                <g filter="url(#mr-view-shadow)" transform="translate(640, 480)">
                  <rect width="250" height="280" rx="6" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
                  <path d="M 0 6 Q 0 0 6 0 L 244 0 Q 250 0 250 6 L 250 32 L 0 32 Z" fill="#0f172a" />
                  <text x="15" y="21" fill="#ffffff" fontSize="12" fontWeight="bold">PAGOS</text>

                  <rect x="0" y="32" width="250" height="26" fill="#fef3c7" />
                  <text x="12" y="49" fill="#92400e" fontSize="10.5" fontWeight="bold">🔑 id_pago</text>
                  <text x="238" y="49" fill="#78350f" fontSize="9.5" fontFamily="monospace" textAnchor="end">UUID [PK]</text>

                  <text x="12" y="75" fill="#334155" fontSize="10.5">numero_factura</text>
                  <text x="238" y="75" fill="#64748b" fontSize="9.5" fontFamily="monospace" textAnchor="end">VARCHAR(30)</text>

                  <rect x="0" y="84" width="250" height="26" fill="#f0f9ff" />
                  <text x="12" y="101" fill="#0369a1" fontSize="10.5" fontWeight="bold">🔗 id_entrada</text>
                  <text x="238" y="101" fill="#0284c7" fontSize="9.5" fontFamily="monospace" textAnchor="end">UUID [FK]</text>

                  <rect x="0" y="110" width="250" height="26" fill="#f0f9ff" />
                  <text x="12" y="127" fill="#0369a1" fontSize="10.5" fontWeight="bold">🔗 id_suscripcion</text>
                  <text x="238" y="127" fill="#0284c7" fontSize="9.5" fontFamily="monospace" textAnchor="end">UUID [FK]</text>

                  <rect x="0" y="136" width="250" height="26" fill="#f0f9ff" />
                  <text x="12" y="153" fill="#0369a1" fontSize="10.5" fontWeight="bold">🔗 id_tarifa_aplicada</text>
                  <text x="238" y="153" fill="#0284c7" fontSize="9.5" fontFamily="monospace" textAnchor="end">VARCHAR(20) [FK]</text>

                  <text x="12" y="179" fill="#334155" fontSize="10.5">monto_total</text>
                  <text x="238" y="179" fill="#64748b" fontSize="9.5" fontFamily="monospace" textAnchor="end">DECIMAL(12,2)</text>

                  <text x="12" y="205" fill="#334155" fontSize="10.5">metodo_pago</text>
                  <text x="238" y="205" fill="#64748b" fontSize="9.5" fontFamily="monospace" textAnchor="end">VARCHAR(30)</text>

                  <text x="12" y="231" fill="#334155" fontSize="10.5">estado_pago</text>
                  <text x="238" y="231" fill="#64748b" fontSize="9.5" fontFamily="monospace" textAnchor="end">VARCHAR(20)</text>

                  <text x="12" y="257" fill="#334155" fontSize="10.5">fecha_hora_pago</text>
                  <text x="238" y="257" fill="#64748b" fontSize="9.5" fontFamily="monospace" textAnchor="end">TIMESTAMP</text>
                </g>

                {/* ================= TABLA 8: TARIFAS_PARQUEO ================= */}
                <g filter="url(#mr-view-shadow)" transform="translate(940, 480)">
                  <rect width="225" height="210" rx="6" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
                  <path d="M 0 6 Q 0 0 6 0 L 219 0 Q 225 0 225 6 L 225 32 L 0 32 Z" fill="#0f172a" />
                  <text x="15" y="21" fill="#ffffff" fontSize="12" fontWeight="bold">TARIFAS_PARQUEO</text>

                  <rect x="0" y="32" width="225" height="26" fill="#fef3c7" />
                  <text x="12" y="49" fill="#92400e" fontSize="10.5" fontWeight="bold">🔑 id_tarifa</text>
                  <text x="213" y="49" fill="#78350f" fontSize="9.5" fontFamily="monospace" textAnchor="end">VARCHAR [PK]</text>

                  <text x="12" y="75" fill="#334155" fontSize="10.5">tipo_vehiculo</text>
                  <text x="213" y="75" fill="#64748b" fontSize="9.5" fontFamily="monospace" textAnchor="end">VARCHAR(20)</text>

                  <text x="12" y="101" fill="#334155" fontSize="10.5">tarifa_por_minuto</text>
                  <text x="213" y="101" fill="#64748b" fontSize="9.5" fontFamily="monospace" textAnchor="end">DECIMAL(10,2)</text>

                  <text x="12" y="127" fill="#334155" fontSize="10.5">tarifa_por_hora</text>
                  <text x="213" y="127" fill="#64748b" fontSize="9.5" fontFamily="monospace" textAnchor="end">DECIMAL(10,2)</text>

                  <text x="12" y="153" fill="#334155" fontSize="10.5">tarifa_plena_dia</text>
                  <text x="213" y="153" fill="#64748b" fontSize="9.5" fontFamily="monospace" textAnchor="end">DECIMAL(10,2)</text>

                  <text x="12" y="179" fill="#334155" fontSize="10.5">tarifa_mensualidad</text>
                  <text x="213" y="179" fill="#64748b" fontSize="9.5" fontFamily="monospace" textAnchor="end">DECIMAL(10,2)</text>
                </g>

                {/* Leyenda Inferior */}
                <rect x="35" y="795" width="1130" height="40" rx="6" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
                <rect x="55" y="809" width="14" height="12" fill="#fef3c7" stroke="#d97706" />
                <text x="75" y="819" fill="#78350f" fontSize="11" fontWeight="bold">Clave Primaria [PK]</text>

                <rect x="235" y="809" width="14" height="12" fill="#f0f9ff" stroke="#0284c7" />
                <text x="255" y="819" fill="#0369a1" fontSize="11" fontWeight="bold">Clave Foránea [FK]</text>

                <line x1="415" y1="815" x2="455" y2="815" stroke="#0284c7" strokeWidth="2" markerEnd="url(#mr-fk-arrow)" />
                <text x="465" y="819" fill="#334155" fontSize="11">Flecha de Integridad Referencial (FK &rarr; PK)</text>

                <text x="820" y="819" fill="#059669" fontSize="11" fontWeight="bold">Normalizado en Tercera Forma Normal (3FN)</text>
              </svg>
            </div>

            {/* Tarjeta de ayuda rápida para el trabajo de grado / informe de la IU Digital */}
            <div className="p-4 bg-sky-50 border border-sky-200 rounded-lg text-xs space-y-2">
              <div className="flex items-center gap-2 text-sky-900 font-semibold text-xs">
                <HelpCircle className="w-4 h-4 text-sky-700" />
                <span>¿Cómo usar el Modelo Relacional (MR) en tu informe de la IU Digital?</span>
              </div>
              <ul className="text-sky-950 space-y-1 list-disc list-inside text-[11px] leading-relaxed">
                <li>
                  <strong>Descarga con 1 Clic (Imagen):</strong> Pulsa el botón azul <strong>"Descargar Esquema MR (PNG)"</strong> para guardar el diagrama con las 8 tablas, sus columnas y flechas FK en tu carpeta de Descargas.
                </li>
                <li>
                  <strong>Descarga en Texto (.txt):</strong> Si tu profesor pide la lista formal escrita de tablas con sus claves primarias y foráneas, usa el botón <strong>"Esquema (.txt)"</strong> o pulsa <strong>"Copiar 3FN"</strong>.
                </li>
                <li>
                  <strong>Criterios Académicos 3FN:</strong> Cumple con 1FN (atributos atómicos), 2FN (dependencia funcional completa de la PK) y 3FN (sin dependencias transitivas).
                </li>
              </ul>
            </div>
          </div>

          {/* Tarjetas individuales de cada tabla con notación formal */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {RELATIONAL_TABLES.map((t) => (
              <div key={t.tableName} className="bg-white border border-slate-200 rounded-lg p-5 space-y-3 shadow-xs">
                <div className="flex items-center justify-between border-b pb-2">
                  <div>
                    <span className="font-mono font-bold text-slate-900 text-sm block">
                      {t.tableName}
                    </span>
                    <span className="text-[11px] text-slate-500">{t.logicalName}</span>
                  </div>
                  <span className="text-[10px] font-mono bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">
                    {t.columns.length} atributos
                  </span>
                </div>

                <p className="text-[11px] text-slate-600">
                  {t.description}
                </p>

                {/* Relational Notation Row */}
                <div className="p-2.5 bg-slate-50 rounded border border-slate-200 font-mono text-[11px] text-slate-800 break-words leading-relaxed">
                  <span className="font-bold text-indigo-700">{t.tableName}</span> (
                  {t.columns.map((c, i) => (
                    <span key={c.name}>
                      {c.isPk ? (
                        <span className="font-bold underline text-amber-700" title="Clave Primaria">{c.name}</span>
                      ) : c.isFk ? (
                        <span className="font-semibold text-sky-700 italic" title={`FK -> ${c.fkTarget}`}>{c.name}*</span>
                      ) : (
                        <span>{c.name}</span>
                      )}
                      {i < t.columns.length - 1 ? ', ' : ''}
                    </span>
                  ))}
                  )
                </div>

                {/* FK targets */}
                {t.foreignKeys.length > 0 && (
                  <div className="pt-1 space-y-1">
                    <span className="text-[10px] font-bold text-slate-500 uppercase block">Claves Foráneas (FK):</span>
                    {t.foreignKeys.map((fk, idx) => (
                      <div key={idx} className="text-[10px] font-mono text-sky-700 flex items-center gap-1">
                        <span>&bull; {fk.column} &rarr; {fk.targetTable}({fk.targetColumn})</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= 3. MODELO FÍSICO (SQL DDL) ================= */}
      {activeSubTab === 'fisico' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-white border border-slate-200 rounded-lg p-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Script SQL DDL de Creación de Tablas (DDL Script)
              </h3>
              <p className="text-xs text-slate-500">
                Compatible con PostgreSQL 14+, MySQL 8.0+, MariaDB, SQLite y Supabase.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopySql}
                className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                {copiedSql ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSql ? 'Copiado' : 'Copiar SQL'}</span>
              </button>
              <button
                onClick={handleDownloadSql}
                className="px-3 py-1.5 text-xs font-semibold text-white bg-slate-950 hover:bg-slate-800 rounded transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Descargar .sql</span>
              </button>
            </div>
          </div>

          <div className="bg-slate-950 text-slate-100 rounded-lg p-5 font-mono text-xs overflow-x-auto shadow-inner border border-slate-800 max-h-[600px]">
            <pre className="leading-relaxed">
              <code>{SQL_PHYSICAL_DDL}</code>
            </pre>
          </div>
        </div>
      )}

      {/* ================= 4. DICCIONARIO DE DATOS ================= */}
      {activeSubTab === 'diccionario' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Table Selector Sidebar */}
          <div className="bg-white border border-slate-200 rounded-lg p-4 space-y-2">
            <span className="text-xs font-bold text-slate-900 uppercase tracking-wide block mb-2">
              Seleccionar Tabla:
            </span>
            <div className="space-y-1">
              {RELATIONAL_TABLES.map(t => (
                <button
                  key={t.tableName}
                  onClick={() => setSelectedTable(t.tableName)}
                  className={`w-full text-left p-2.5 rounded text-xs transition-colors cursor-pointer flex items-center justify-between ${
                    selectedTable === t.tableName
                      ? 'bg-slate-900 text-white font-bold'
                      : 'hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <span className="font-mono">{t.tableName}</span>
                  <span className="text-[10px] opacity-75">{t.columns.length} col</span>
                </button>
              ))}
            </div>
          </div>

          {/* Table Inspector */}
          <div className="lg:col-span-3 bg-white border border-slate-200 rounded-lg p-6 space-y-4">
            <div className="border-b pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-lg font-mono font-bold text-slate-900">
                  {currentTableData.tableName}
                </h3>
                <p className="text-xs text-slate-600 mt-0.5">
                  {currentTableData.description}
                </p>
              </div>
              <span className="text-xs font-mono text-slate-500 bg-slate-50 px-2.5 py-1 rounded border border-slate-200">
                PK: {currentTableData.primaryKey.join(', ')}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-slate-700">
                    <th className="py-2.5 px-3 font-semibold">Campo</th>
                    <th className="py-2.5 px-3 font-semibold">Tipo de Dato</th>
                    <th className="py-2.5 px-3 font-semibold text-center">Clave</th>
                    <th className="py-2.5 px-3 font-semibold text-center">Nulo</th>
                    <th className="py-2.5 px-3 font-semibold">Valor Defecto</th>
                    <th className="py-2.5 px-3 font-semibold">Descripción Funcional</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                  {currentTableData.columns.map((c, i) => (
                    <tr key={i} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-2.5 px-3 font-bold text-slate-900">{c.name}</td>
                      <td className="py-2.5 px-3 text-indigo-700">{c.type}</td>
                      <td className="py-2.5 px-3 text-center">
                        {c.isPk && (
                          <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-1.5 py-0.5 rounded">
                            PK
                          </span>
                        )}
                        {c.isFk && (
                          <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-1.5 py-0.5 rounded ml-1" title={c.fkTarget}>
                            FK
                          </span>
                        )}
                        {!c.isPk && !c.isFk && <span className="text-slate-300">-</span>}
                      </td>
                      <td className="py-2.5 px-3 text-center text-slate-600">
                        {c.nullable ? 'SÍ' : 'NO'}
                      </td>
                      <td className="py-2.5 px-3 text-slate-500">
                        {c.defaultValue || '-'}
                      </td>
                      <td className="py-2.5 px-3 font-sans text-slate-600 text-xs">
                        {c.description}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
