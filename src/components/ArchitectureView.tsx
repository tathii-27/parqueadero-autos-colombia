import React, { useState } from 'react';
import { 
  ARCHITECTURE_LAYERS, 
  PLANTUML_CLASS_CODE, 
  SEQUENCE_ENTRADA_CODE, 
  SEQUENCE_SALIDA_CODE, 
  STARUML_MDJ_JSON, 
  UML_CLASSES 
} from '../data/architectureData';
import { 
  ArrowRight, 
  Check, 
  Code, 
  Copy, 
  Cpu, 
  Database, 
  Download, 
  ExternalLink, 
  FileCode, 
  FolderTree, 
  GitMerge, 
  Layers, 
  Maximize2, 
  Network, 
  Server, 
  Share2,
  Users,
  Package as PackageIcon
} from 'lucide-react';
import { UmlDiagramCanvas } from './UmlDiagramCanvas';
import { UseCaseDiagramView } from './UseCaseDiagramView';
import { PackageDiagramView } from './PackageDiagramView';

export const ArchitectureView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'conexiones' | 'paquetes' | 'casos_uso' | 'clases' | 'capas' | 'secuencia' | 'staruml'>('conexiones');
  const [selectedClass, setSelectedClass] = useState<string>(UML_CLASSES[0].name);
  const [copiedNotification, setCopiedNotification] = useState(false);
  const [selectedSequence, setSelectedSequence] = useState<'ENTRADA' | 'SALIDA'>('ENTRADA');

  const currentClassData = UML_CLASSES.find(c => c.name === selectedClass) || UML_CLASSES[0];

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 3000);
  };

  const handleDownloadMdj = () => {
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', '/ParqueaderoAutosColombia_StarUML.mdj');
    downloadAnchor.setAttribute('download', 'ParqueaderoAutosColombia_StarUML.mdj');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 rounded-lg p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-semibold tracking-wider text-indigo-700 uppercase mb-1">
              Diseño y Arquitectura de Software · StarUML (UML 2.5)
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Arquitectura del Sistema en StarUML
            </h1>
            <p className="mt-1 text-sm text-slate-600 max-w-3xl">
              Modelado arquitectural por capas (N-Tier), Diagrama de Clases del Dominio con atributos, métodos y multiplicidades, y Diagramas de Secuencia para los flujos de Entrada y Salida vehicular.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={handleDownloadMdj}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-md transition-colors shadow-xs cursor-pointer"
              title="Descargar archivo .mdj nativo para abrir en StarUML"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Descargar Proyecto StarUML (.mdj)</span>
            </button>
          </div>
        </div>

        {/* SubTabs */}
        <div className="flex items-center gap-2 mt-6 border-b border-slate-200 pb-2 text-xs font-medium overflow-x-auto">
          <button
            onClick={() => setActiveTab('conexiones')}
            className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'conexiones'
                ? 'bg-emerald-600 text-white font-semibold shadow-xs'
                : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <GitMerge className="w-3.5 h-3.5" />
            <span>Diagrama Completo con Conexiones</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
              activeTab === 'conexiones' ? 'bg-emerald-700 text-white' : 'bg-emerald-100 text-emerald-800'
            }`}>
              PNG / SVG
            </span>
          </button>
          <button
            onClick={() => setActiveTab('paquetes')}
            className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'paquetes'
                ? 'bg-indigo-600 text-white font-semibold shadow-xs'
                : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <PackageIcon className="w-3.5 h-3.5" />
            <span>Paquetes StarUML</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
              activeTab === 'paquetes' ? 'bg-indigo-700 text-white' : 'bg-indigo-100 text-indigo-800'
            }`}>
              6 Paquetes
            </span>
          </button>
          <button
            onClick={() => setActiveTab('casos_uso')}
            className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'casos_uso'
                ? 'bg-sky-600 text-white font-semibold shadow-xs'
                : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Casos de Uso StarUML</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
              activeTab === 'casos_uso' ? 'bg-sky-700 text-white' : 'bg-sky-100 text-sky-800'
            }`}>
              16 Casos
            </span>
          </button>
          <button
            onClick={() => setActiveTab('clases')}
            className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'clases'
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Detalle de Clases UML ({UML_CLASSES.length})
          </button>
          <button
            onClick={() => setActiveTab('capas')}
            className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'capas'
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Arquitectura por Capas
          </button>
          <button
            onClick={() => setActiveTab('secuencia')}
            className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'secuencia'
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Diagramas de Secuencia
          </button>
          <button
            onClick={() => setActiveTab('staruml')}
            className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'staruml'
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Exportar StarUML & PlantUML
          </button>
        </div>
      </div>

      {/* 0. DIAGRAMA COMPLETO CON CONEXIONES */}
      {activeTab === 'conexiones' && (
        <UmlDiagramCanvas onDownloadMdj={handleDownloadMdj} />
      )}

      {/* DIAGRAMA DE PAQUETES STARUML */}
      {activeTab === 'paquetes' && (
        <PackageDiagramView />
      )}

      {/* CASOS DE USO STARUML */}
      {activeTab === 'casos_uso' && (
        <UseCaseDiagramView />
      )}

      {/* 1. ARQUITECTURA POR CAPAS */}
      {activeTab === 'capas' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ARCHITECTURE_LAYERS.map(layer => (
              <div
                key={layer.id}
                className="bg-white border border-slate-200 rounded-lg p-5 space-y-3"
              >
                <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                  <Layers className="w-4 h-4 text-indigo-600" />
                  <h3 className="text-sm font-bold text-slate-900">{layer.name}</h3>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {layer.description}
                </p>

                <div className="space-y-2 pt-2">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide block">
                    Componentes del Paquete:
                  </span>
                  <div className="grid grid-cols-1 gap-2">
                    {layer.elements.map((elem, i) => (
                      <div
                        key={i}
                        className="p-2.5 bg-slate-50 rounded border border-slate-200/70 text-xs flex flex-col justify-between"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono font-bold text-slate-900">
                            {elem.name}
                          </span>
                          <span className="text-[10px] bg-slate-200/80 px-1.5 py-0.5 rounded text-slate-700">
                            {elem.type}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500 mt-1">
                          {elem.desc}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. DIAGRAMA DE CLASES UML */}
      {activeTab === 'clases' && (
        <div className="space-y-6">
          {/* Troubleshooting Callout for StarUML */}
          <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-lg text-xs space-y-2">
            <div className="flex items-center gap-2 text-indigo-900 font-bold text-sm">
              <span>💡 ¿Cómo hacer que aparezca el diagrama dibujado en StarUML?</span>
            </div>
            <p className="text-indigo-800 leading-relaxed">
              En StarUML, cuando abres un proyecto, el centro queda gris hasta que abres un <strong>Diagrama</strong> en <em>Working Diagrams</em>. Para visualizarlo en tu pantalla de StarUML sigue estos <strong>2 sencillos pasos</strong>:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
              <div className="p-2.5 bg-white rounded border border-indigo-100 text-slate-800">
                <span className="font-bold text-indigo-700 block mb-0.5">Paso 1: Crear o abrir el lienzo</span>
                <span>En el menú superior de StarUML, haz clic en: <strong>Model &gt; Add Diagram &gt; Class Diagram</strong> (o clic derecho en <em>Modelo Arquitectural</em> &gt; <em>Add Diagram</em> &gt; <em>Class Diagram</em>).</span>
              </div>
              <div className="p-2.5 bg-white rounded border border-indigo-100 text-slate-800">
                <span className="font-bold text-indigo-700 block mb-0.5">Paso 2: Arrastrar las clases</span>
                <span>Desde el panel derecho (<strong>Model Explorer</strong>), haz clic y <strong>arrastra con el mouse</strong> las clases (<em>Vehiculo</em>, <em>EntradaVehiculo</em>, <em>CeldaParqueo</em>, etc.) hacia el lienzo central blanco. ¡StarUML dibuja las cajas y atributos automáticamente!</span>
              </div>
            </div>
          </div>

          {/* Full Visual Graphical Map of Classes */}
          <div className="bg-white border border-slate-200 rounded-lg p-5 space-y-4">
            <div className="flex items-center justify-between border-b pb-2">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Mapa Visual del Diagrama de Clases (Autos Colombia)
                </h3>
                <p className="text-[11px] text-slate-500">
                  Visualización gráfica directa de todas las entidades, compartimentos y tipos de datos.
                </p>
              </div>
              <span className="text-[11px] font-mono text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200 font-semibold">
                7 Clases del Dominio
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {UML_CLASSES.map(cls => (
                <div
                  key={cls.name}
                  onClick={() => setSelectedClass(cls.name)}
                  className={`border-2 rounded-md bg-white overflow-hidden transition-all cursor-pointer text-xs ${
                    selectedClass === cls.name
                      ? 'border-indigo-600 shadow-md ring-2 ring-indigo-100'
                      : 'border-slate-300 hover:border-slate-400'
                  }`}
                >
                  {/* Class Header */}
                  <div className="bg-slate-100 p-2 text-center border-b border-slate-300 font-mono">
                    {cls.stereotype && (
                      <div className="text-[10px] text-slate-500 italic">&lt;&lt;{cls.stereotype}&gt;&gt;</div>
                    )}
                    <div className="font-bold text-slate-900 text-sm">{cls.name}</div>
                  </div>

                  {/* Attributes Compartment */}
                  <div className="p-2.5 border-b border-slate-200 bg-white font-mono text-[10px] space-y-1">
                    {cls.attributes.map((a, i) => (
                      <div key={i} className="text-slate-800 truncate" title={`${a.name}: ${a.type}`}>
                        <span className="font-bold text-slate-400 mr-1">{a.visibility}</span>
                        <span className="font-semibold text-slate-900">{a.name}</span> : <span className="text-indigo-700">{a.type}</span>
                      </div>
                    ))}
                  </div>

                  {/* Operations Compartment */}
                  <div className="p-2.5 bg-slate-50/50 font-mono text-[10px] space-y-1">
                    {cls.methods.map((m, i) => (
                      <div key={i} className="text-slate-800 truncate" title={`${m.name}(${m.params}): ${m.returnType}`}>
                        <span className="font-bold text-slate-400 mr-1">{m.visibility}</span>
                        <span className="font-semibold text-emerald-800">{m.name}</span>() : <span className="text-indigo-700">{m.returnType}</span>
                      </div>
                    ))}
                  </div>

                  {/* Relationships tag */}
                  <div className="p-2 bg-slate-50 border-t border-slate-200 text-[10px] text-slate-500 flex items-center justify-between">
                    <span>{cls.relationships.length} relaciones</span>
                    <span className="text-indigo-600 font-medium">Ver detalle &rarr;</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Class Selector Sidebar */}
          <div className="bg-white border border-slate-200 rounded-lg p-4 space-y-3">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
              Entidades y Clases del Dominio
            </h3>
            <div className="space-y-1 text-xs">
              {UML_CLASSES.map(cls => (
                <button
                  key={cls.name}
                  onClick={() => setSelectedClass(cls.name)}
                  className={`w-full text-left p-2.5 rounded-md transition-colors flex items-center justify-between cursor-pointer ${
                    selectedClass === cls.name
                      ? 'bg-slate-900 text-white font-semibold'
                      : 'hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <span className="font-mono">{cls.name}</span>
                  {cls.stereotype && (
                    <span className="text-[10px] opacity-75">&lt;&lt;{cls.stereotype}&gt;&gt;</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Detailed StarUML Class Inspector */}
          <div className="lg:col-span-2 bg-white border border-slate-200 rounded-lg p-6 space-y-6">
            <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
              <div>
                <div className="text-[11px] font-mono text-slate-500">
                  {currentClassData.package}
                </div>
                <h2 className="text-xl font-mono font-bold text-slate-900 flex items-center gap-2">
                  <span>{currentClassData.name}</span>
                  {currentClassData.stereotype && (
                    <span className="text-xs text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200 font-sans font-medium">
                      &lt;&lt;{currentClassData.stereotype}&gt;&gt;
                    </span>
                  )}
                </h2>
              </div>
              <span className="text-xs text-slate-500 font-mono">UML 2.5 Class</span>
            </div>

            <p className="text-xs text-slate-600">
              {currentClassData.description}
            </p>

            {/* Attributes Section */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide flex items-center justify-between">
                <span>Atributos / Propiedades ({currentClassData.attributes.length})</span>
                <span className="text-[10px] font-normal text-slate-500 font-mono">- privado, + público</span>
              </h4>
              <div className="bg-slate-50 border border-slate-200 rounded-md p-3 font-mono text-xs space-y-1.5">
                {currentClassData.attributes.map((attr, idx) => (
                  <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[11px]">
                    <div className="text-slate-900">
                      <span className="font-bold text-slate-500 mr-1.5">{attr.visibility}</span>
                      <span className="font-semibold">{attr.name}</span> : <span className="text-indigo-700">{attr.type}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-sans">{attr.description}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Methods Section */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide flex items-center justify-between">
                <span>Métodos / Operaciones ({currentClassData.methods.length})</span>
                <span className="text-[10px] font-normal text-slate-500 font-mono">+ público</span>
              </h4>
              <div className="bg-slate-50 border border-slate-200 rounded-md p-3 font-mono text-xs space-y-1.5">
                {currentClassData.methods.map((met, idx) => (
                  <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[11px]">
                    <div className="text-slate-900">
                      <span className="font-bold text-slate-500 mr-1.5">{met.visibility}</span>
                      <span className="font-semibold text-emerald-800">{met.name}</span>({met.params}) : <span className="text-indigo-700">{met.returnType}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-sans">{met.description}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Relationships Section */}
            {currentClassData.relationships.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                  Relaciones y Multiplicidad UML
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {currentClassData.relationships.map((rel, idx) => (
                    <div key={idx} className="p-2.5 bg-indigo-50/50 border border-indigo-100 rounded text-[11px]">
                      <div className="flex items-center justify-between font-mono font-bold text-slate-900 mb-1">
                        <span>{rel.type} &rarr; {rel.target}</span>
                        <span className="text-indigo-700">{rel.multiplicity}</span>
                      </div>
                      <div className="text-slate-600">{rel.description}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      )}

      {/* 3. DIAGRAMAS DE SECUENCIA */}
      {activeTab === 'secuencia' && (
        <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Diagramas de Secuencia UML (Interacción Dinámica)
              </h3>
              <p className="text-xs text-slate-600">
                Llamadas sincrónicas entre Actores, Vistas, Controladores, Servicios y Capa de Persistencia.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setSelectedSequence('ENTRADA')}
                className={`px-3 py-1.5 text-xs font-semibold rounded transition-colors ${
                  selectedSequence === 'ENTRADA'
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                1. Flujo de Entrada (RF-ES-01)
              </button>
              <button
                onClick={() => setSelectedSequence('SALIDA')}
                className={`px-3 py-1.5 text-xs font-semibold rounded transition-colors ${
                  selectedSequence === 'SALIDA'
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                2. Flujo de Salida y Cobro (RF-ES-06/07)
              </button>
            </div>
          </div>

          {/* Sequence visual step by step narrative */}
          {selectedSequence === 'ENTRADA' ? (
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-3 text-xs">
                <div className="font-bold text-slate-900 text-sm">
                  Traza de Mensajes: Registro de Entrada Vehicular
                </div>
                <div className="space-y-2 font-mono text-[11px] text-slate-700">
                  <div className="p-2 bg-white rounded border border-slate-200 flex items-center justify-between">
                    <span>1. Operador &rarr; EntryModalUI : Digita placa ("HNE612")</span>
                    <span className="text-slate-400">Captura de input</span>
                  </div>
                  <div className="p-2 bg-white rounded border border-slate-200 flex items-center justify-between">
                    <span>2. EntryModalUI &rarr; ParkingController : verificarPlaca("HNE612")</span>
                    <span className="text-indigo-600">Invocación sincrónica</span>
                  </div>
                  <div className="p-2 bg-white rounded border border-slate-200 flex items-center justify-between">
                    <span>3. ParkingController &rarr; SubscriptionService : consultarAbonado("HNE612")</span>
                    <span className="text-emerald-700">Comprobación de contrato</span>
                  </div>
                  <div className="p-2 bg-white rounded border border-slate-200 flex items-center justify-between">
                    <span>4. ParkingController &rarr; CellAllocationService : reservarCelda("A-01")</span>
                    <span className="text-amber-700">Asignación inteligente</span>
                  </div>
                  <div className="p-2 bg-white rounded border border-slate-200 flex items-center justify-between">
                    <span>5. ParkingController &rarr; Storage : guardarEntrada(PAC-2026-1042)</span>
                    <span className="text-slate-600">Commit transaccional</span>
                  </div>
                  <div className="p-2 bg-emerald-50 rounded border border-emerald-200 flex items-center justify-between font-bold text-emerald-900">
                    <span>6. EntryModalUI &rarr; Impresora : Emite Ticket Térmico con QR</span>
                    <span>Salida Física / Digital</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                  <span>Código PlantUML / StarUML de la Secuencia:</span>
                  <button
                    onClick={() => handleCopyCode(SEQUENCE_ENTRADA_CODE)}
                    className="text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copiar Diagrama</span>
                  </button>
                </div>
                <pre className="p-4 bg-slate-900 text-slate-100 rounded-lg font-mono text-[11px] overflow-x-auto max-h-60">
                  {SEQUENCE_ENTRADA_CODE}
                </pre>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-3 text-xs">
                <div className="font-bold text-slate-900 text-sm">
                  Traza de Mensajes: Liquidación de Salida y Cobro Multimedio
                </div>
                <div className="space-y-2 font-mono text-[11px] text-slate-700">
                  <div className="p-2 bg-white rounded border border-slate-200 flex items-center justify-between">
                    <span>1. Cajero &rarr; ExitModalUI : Selecciona vehículo activo ("UQU391")</span>
                    <span className="text-slate-400">Búsqueda reactiva</span>
                  </div>
                  <div className="p-2 bg-white rounded border border-slate-200 flex items-center justify-between">
                    <span>2. ExitModalUI &rarr; BillingRateService : calcularPermanenciaYTarifa()</span>
                    <span className="text-indigo-600">Tiempo de gracia y horas</span>
                  </div>
                  <div className="p-2 bg-white rounded border border-slate-200 flex items-center justify-between">
                    <span>3. Cajero &rarr; ExitModalUI : Selecciona medio de pago (Efectivo/Nequi)</span>
                    <span className="text-emerald-700">Cálculo de devuelta</span>
                  </div>
                  <div className="p-2 bg-white rounded border border-slate-200 flex items-center justify-between">
                    <span>4. ParkingController &rarr; CeldaParqueo : liberarCelda()</span>
                    <span className="text-amber-700">Estado DISPONIBLE</span>
                  </div>
                  <div className="p-2 bg-emerald-50 rounded border border-emerald-200 flex items-center justify-between font-bold text-emerald-900">
                    <span>5. ParkingController &rarr; Storage : registrarPago(REC-XXXXXX)</span>
                    <span>Comprobante de Caja</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                  <span>Código PlantUML / StarUML de la Secuencia:</span>
                  <button
                    onClick={() => handleCopyCode(SEQUENCE_SALIDA_CODE)}
                    className="text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copiar Diagrama</span>
                  </button>
                </div>
                <pre className="p-4 bg-slate-900 text-slate-100 rounded-lg font-mono text-[11px] overflow-x-auto max-h-60">
                  {SEQUENCE_SALIDA_CODE}
                </pre>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 4. EXPORTAR STARUML (.mdj) & PLANTUML */}
      {activeTab === 'staruml' && (
        <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Archivo de Proyecto Nativo de StarUML (.mdj)
              </h3>
              <p className="text-xs text-slate-600">
                Descargue el archivo de proyecto JSON para abrirlo directamente en la aplicación de escritorio StarUML.
              </p>
            </div>
            <button
              onClick={handleDownloadMdj}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-md transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Descargar ParqueaderoAutosColombia.mdj</span>
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-2">
                <span>Código Fuente Completo para StarUML / PlantUML (Diagrama de Clases):</span>
                <button
                  onClick={() => handleCopyCode(PLANTUML_CLASS_CODE)}
                  className="text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copiedNotification ? '¡Copiado!' : 'Copiar PlantUML'}</span>
                </button>
              </div>
              <pre className="p-4 bg-slate-900 text-slate-100 rounded-lg font-mono text-[11px] overflow-x-auto max-h-96">
                {PLANTUML_CLASS_CODE}
              </pre>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-2">
              <span className="font-bold text-slate-900 block">
                Instrucciones para abrir en StarUML:
              </span>
              <ol className="list-decimal list-inside space-y-1 text-slate-600">
                <li>Descargue el archivo haciendo clic en el botón superior <strong>"Descargar Proyecto StarUML (.mdj)"</strong>.</li>
                <li>Abra su software <strong>StarUML</strong> en su computador.</li>
                <li>Haga clic en <strong>File &gt; Open...</strong> y seleccione el archivo <code className="bg-slate-200 px-1 py-0.5 rounded">ParqueaderoAutosColombia_StarUML.mdj</code>.</li>
                <li>También puede copiar el bloque PlantUML con el botón <strong>"Copiar PlantUML"</strong> e importarlo mediante el plugin PlantUML de StarUML o en planttext.com para renderizado vectorial inmediato.</li>
              </ol>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
