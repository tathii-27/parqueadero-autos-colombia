import React, { useState } from 'react';
import { 
  FUNCTIONAL_REQUIREMENTS, 
  NON_FUNCTIONAL_REQUIREMENTS, 
  TRACEABILITY_MATRIX,
  FunctionalRequirement,
  TraceabilityItem 
} from '../data/requirementsData';
import { USER_STORIES, UserStory } from '../data/userStoriesData';
import { 
  BookOpen, 
  CheckCircle2, 
  ChevronDown, 
  ChevronUp, 
  Copy, 
  Download,
  FileCheck2,
  FileText, 
  Layers, 
  ListTodo, 
  Play, 
  Search,
  ShieldCheck, 
  Sparkles, 
  Tag, 
  TestTube2,
  User, 
  Zap 
} from 'lucide-react';

interface RequirementsViewProps {
  onNavigateToOperations: () => void;
  onOpenNewEntry: () => void;
}

export const RequirementsView: React.FC<RequirementsViewProps> = ({
  onNavigateToOperations,
  onOpenNewEntry,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'hu' | 'rf' | 'rnf' | 'matriz' | 'resumen'>('hu');
  const [selectedEpic, setSelectedEpic] = useState<string>('TODAS');
  const [selectedCategory, setSelectedCategory] = useState<string>('TODOS');
  const [expandedHuId, setExpandedHuId] = useState<string | null>('HU-01');
  const [expandedRfId, setExpandedRfId] = useState<string | null>('RF-ES-01');
  const [copiedNotification, setCopiedNotification] = useState(false);
  const [selectedIteration, setSelectedIteration] = useState<'TODAS' | 'ITERACION_1' | 'POSTERIORES'>('ITERACION_1');
  const [matrizSearch, setMatrizSearch] = useState('');
  const [copiedMatriz, setCopiedMatriz] = useState(false);
  const [matrizViewType, setMatrizViewType] = useState<'integral' | 'agil'>('integral');

  const filteredMatriz = TRACEABILITY_MATRIX.filter(item => {
    const q = matrizSearch.toLowerCase();
    return (
      item.rfId.toLowerCase().includes(q) ||
      item.rfTitle.toLowerCase().includes(q) ||
      item.userStoryId.toLowerCase().includes(q) ||
      item.userStoryTitle.toLowerCase().includes(q) ||
      item.useCaseId.toLowerCase().includes(q) ||
      item.useCaseName.toLowerCase().includes(q) ||
      item.testCaseId.toLowerCase().includes(q) ||
      item.testCaseName.toLowerCase().includes(q) ||
      item.testScenario.toLowerCase().includes(q) ||
      item.systemModule.toLowerCase().includes(q)
    );
  });

  const copyMatrizMarkdown = () => {
    const header = `| ID | Requerimiento Funcional (RF) | Historia de Usuario (HU) | Caso de Uso UML (CU) | Caso de Prueba (CP) / Escenario de Validación | Módulo Sistema | Método Verificación | Estado |\n| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |\n`;
    const rows = TRACEABILITY_MATRIX.map(item => 
      `| **${item.id}** | **[${item.rfId}]** ${item.rfTitle} | **[${item.userStoryId}]** ${item.userStoryTitle} | **[${item.useCaseId}]** ${item.useCaseName} | **[${item.testCaseId}]** ${item.testCaseName}: *${item.testScenario}* | ${item.systemModule} | ${item.verificationMethod} | ✅ ${item.status} |`
    ).join('\n');
    navigator.clipboard.writeText(header + rows);
    setCopiedMatriz(true);
    setTimeout(() => setCopiedMatriz(false), 3000);
  };

  const filteredHus = USER_STORIES.filter(hu => {
    const matchesEpic = selectedEpic === 'TODAS' || hu.epic === selectedEpic;
    const matchesIteration = 
      selectedIteration === 'TODAS' ? true :
      selectedIteration === 'ITERACION_1' ? hu.inScope :
      !hu.inScope;
    return matchesEpic && matchesIteration;
  });

  const filteredRfs = selectedCategory === 'TODOS'
    ? FUNCTIONAL_REQUIREMENTS
    : FUNCTIONAL_REQUIREMENTS.filter(rf => rf.category === selectedCategory);

  const toggleExpandHu = (id: string) => {
    setExpandedHuId(prev => (prev === id ? null : id));
  };

  const toggleExpandRf = (id: string) => {
    setExpandedRfId(prev => (prev === id ? null : id));
  };

  const copyFullDocumentation = () => {
    const text = `# INGENIERÍA DE SOFTWARE: HISTORIAS DE USUARIO Y ESPECIFICACIÓN DE REQUERIMIENTOS
Proyecto: Sistema de Gestión de Operaciones Diarias - Parqueadero Autos Colombia
Institución: Institución Universitaria Digital de Antioquia (IU Digital)
Estudiante: Tatiana Gallego (tatiana.gallegog@est.iudigital.edu.co)
Fecha: Octubre 2026
Estándar: Metodología Ágil (Scrum) y Estándar IEEE 830 (SRS)

================================================================================
PARTE 1: HISTORIAS DE USUARIO (USER STORIES CON CRITERIOS GHERKIN)
================================================================================

${USER_STORIES.map(hu => `
--------------------------------------------------------------------------------
[${hu.id}] ${hu.title}
Épica: ${hu.epicTitle}
Prioridad: ${hu.priority} | Story Points: ${hu.storyPoints}
Requerimientos Asociados: ${hu.relatedRF.join(', ')}

NARRATIVA:
- Como: ${hu.role}
- Quiero: ${hu.action}
- Para: ${hu.benefit}

CRITERIOS DE ACEPTACIÓN (FORMATO GHERKIN):
${hu.acceptanceCriteria.map(ac => `
* Escenario: ${ac.scenario}
  - Dado que ${ac.given}
  - Cuando ${ac.when}
  - Entonces ${ac.then}
`).join('\n')}

REGLAS DE NEGOCIO APLICABLES:
${hu.businessRules.map(br => `* ${br}`).join('\n')}
`).join('\n')}

================================================================================
PARTE 2: REQUERIMIENTOS FUNCIONALES (RF - IEEE 830)
================================================================================

${FUNCTIONAL_REQUIREMENTS.map(rf => `
--------------------------------------------------------------------------------
[${rf.id}] ${rf.title}
Prioridad: ${rf.priority} | Categoría: ${rf.category} | Actor: ${rf.actor}
Descripción: ${rf.description}

Precondiciones:
${rf.preconditions.map(p => `  * ${p}`).join('\n')}

Flujo de Trabajo:
${rf.workflow.map(w => `  ${w}`).join('\n')}

Postcondiciones:
${rf.postconditions.map(p => `  * ${p}`).join('\n')}

Reglas de Negocio:
${rf.businessRules.map(r => `  * ${r}`).join('\n')}

Caso de Prueba: ${rf.testScenario}
`).join('\n')}

================================================================================
PARTE 3: REQUERIMIENTOS NO FUNCIONALES (RNF)
================================================================================

${NON_FUNCTIONAL_REQUIREMENTS.map(rnf => `
--------------------------------------------------------------------------------
[${rnf.id}] ${rnf.title}
Categoría: ${rnf.category}
Métrica Objetivo: ${rnf.metric}
Descripción: ${rnf.description}
Estrategia de Cumplimiento: ${rnf.complianceStrategy}
`).join('\n')}
`;

    navigator.clipboard.writeText(text);
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Editorial Header */}
      <div className="bg-white border border-slate-200 rounded-lg p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-semibold tracking-wider text-amber-700 uppercase mb-1">
              Ingeniería de Software · Metodología Ágil (Scrum) & IEEE 830
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Historias de Usuario y Especificación de Requerimientos
            </h1>
            <p className="mt-1 text-sm text-slate-600 max-w-3xl">
              Modelado completo de Historias de Usuario (HU) con narrativa <em>Como / Quiero / Para</em>, criterios de aceptación en sintaxis Gherkin (<em>Dado / Cuando / Entonces</em>), y especificación formal de Requerimientos Funcionales y No Funcionales para el Parqueadero Autos Colombia.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={copyFullDocumentation}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-300 rounded-md transition-colors cursor-pointer"
              title="Copiar especificación completa de Historias de Usuario y Requerimientos"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>{copiedNotification ? '¡Copiado con Éxito!' : 'Copiar para Informe / Tesis'}</span>
            </button>
            <button
              onClick={onOpenNewEntry}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-md transition-colors cursor-pointer"
            >
              <Play className="w-3.5 h-3.5" />
              <span>Probar en el Sistema</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 mt-6 border-b border-slate-200 pb-2 text-xs font-medium overflow-x-auto">
          <button
            onClick={() => setActiveSubTab('hu')}
            className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap ${
              activeSubTab === 'hu'
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Historias de Usuario ({USER_STORIES.length})
          </button>
          <button
            onClick={() => setActiveSubTab('rf')}
            className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap ${
              activeSubTab === 'rf'
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Requerimientos Funcionales ({FUNCTIONAL_REQUIREMENTS.length})
          </button>
          <button
            onClick={() => setActiveSubTab('rnf')}
            className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap ${
              activeSubTab === 'rnf'
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Requerimientos No Funcionales ({NON_FUNCTIONAL_REQUIREMENTS.length})
          </button>
          <button
            onClick={() => setActiveSubTab('matriz')}
            className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap ${
              activeSubTab === 'matriz'
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Matriz de Trazabilidad (HU vs RF)
          </button>
          <button
            onClick={() => setActiveSubTab('resumen')}
            className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap ${
              activeSubTab === 'resumen'
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Alcance y Marco Legal
          </button>
        </div>
      </div>

      {/* SubTab: HISTORIAS DE USUARIO (SCRUM) */}
      {activeSubTab === 'hu' && (
        <div className="space-y-4">
          {/* Banner de Delimitación de Alcance por Iteración */}
          <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-slate-50 border border-emerald-200 rounded-lg p-4 space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-xs bg-emerald-800 text-white px-2.5 py-0.5 rounded shadow-sm">
                  ITERACIÓN 1
                </span>
                <span className="font-bold text-slate-900 text-sm">
                  Gestión de la Entrada y Salida de Vehículos (Alcance Oficial del Sprint 1)
                </span>
              </div>
              <span className="text-xs font-semibold text-emerald-800 bg-emerald-100/90 px-3 py-1 rounded-full border border-emerald-300 self-start sm:self-auto">
                10 Historias de Usuario Nucleares (HU-01 a HU-10) · 37 Story Points
              </span>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed">
              <strong>Delimitación Metodológica de Alcance:</strong> Conforme al título y objetivos de la actividad evaluativa (<em>"Iteración 1: Gestión de la entrada y salida de vehículos"</em>), las <strong>Historias de Usuario HU-01 a HU-10</strong> representan el alcance oficial y evaluable de esta entrega (captura de placa, validación de estado, asignación de celda, inspección, liquidación de tiempos, cobro multicanal y ticket fiscal). Las Historias HU-11 a HU-18 pertenecen al Product Backlog general planificadas para <strong>Iteraciones Posteriores</strong> (Celdas, Mensualistas, Novedades y Auditoría de Caja).
            </p>
          </div>

          {/* Selector de Iteración y Filtro de Épicas */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white p-3 rounded-lg border border-slate-200 text-xs">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-slate-600 font-bold">Alcance de Entrega:</span>
              <div className="flex bg-slate-100 p-0.5 rounded border border-slate-200">
                <button
                  onClick={() => setSelectedIteration('ITERACION_1')}
                  className={`px-3 py-1 rounded text-xs transition-colors ${
                    selectedIteration === 'ITERACION_1'
                      ? 'bg-emerald-700 text-white font-bold shadow-xs'
                      : 'text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  🎯 Iteración 1 · Entrada y Salida (10 HUs)
                </button>
                <button
                  onClick={() => setSelectedIteration('POSTERIORES')}
                  className={`px-3 py-1 rounded text-xs transition-colors ${
                    selectedIteration === 'POSTERIORES'
                      ? 'bg-slate-800 text-white font-bold shadow-xs'
                      : 'text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  📅 Iteraciones Posteriores (8 HUs)
                </button>
                <button
                  onClick={() => setSelectedIteration('TODAS')}
                  className={`px-3 py-1 rounded text-xs transition-colors ${
                    selectedIteration === 'TODAS'
                      ? 'bg-slate-900 text-white font-bold shadow-xs'
                      : 'text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  Ver Todas (18)
                </button>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="text-slate-500 font-medium">Épica:</span>
              {[
                { id: 'TODAS', label: 'Todas' },
                { id: 'ENTRADA_SALIDA', label: 'Entrada y Salida' },
                { id: 'CELDAS', label: 'Celdas' },
                { id: 'MENSUALISTAS', label: 'Mensualistas' },
                { id: 'NOVEDADES', label: 'Novedades' },
                { id: 'PAGOS', label: 'Pagos' },
              ].map(ep => (
                <button
                  key={ep.id}
                  onClick={() => setSelectedEpic(ep.id)}
                  className={`px-2 py-0.5 rounded text-[11px] transition-colors ${
                    selectedEpic === ep.id
                      ? 'bg-slate-900 text-white font-semibold'
                      : 'text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  {ep.label}
                </button>
              ))}
            </div>
          </div>

          {/* User Stories List */}
          <div className="space-y-3">
            {filteredHus.map(hu => {
              const isExpanded = expandedHuId === hu.id;
              return (
                <div
                  key={hu.id}
                  className={`bg-white border rounded-lg transition-all overflow-hidden ${
                    hu.inScope ? 'border-emerald-200 hover:border-emerald-300' : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div
                    onClick={() => toggleExpandHu(hu.id)}
                    className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-50 select-none"
                  >
                    <div className="flex items-center gap-3">
                      <span className={`font-mono text-xs font-bold px-2.5 py-1 rounded border ${
                        hu.inScope 
                          ? 'bg-emerald-50 text-emerald-900 border-emerald-300' 
                          : 'bg-slate-100 text-slate-800 border-slate-300'
                      }`}>
                        {hu.id}
                      </span>
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-sm font-semibold text-slate-900">
                            {hu.title}
                          </h3>
                          {hu.inScope ? (
                            <span className="inline-flex items-center gap-1 font-semibold text-[10px] text-emerald-800 bg-emerald-50 border border-emerald-300 px-2 py-0.2 rounded-full">
                              🎯 Iteración 1 · En Alcance
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 font-semibold text-[10px] text-slate-700 bg-slate-100 border border-slate-300 px-2 py-0.2 rounded-full">
                              📅 {hu.iteration === 'ITERACION_2' ? 'Iteración 2' : hu.iteration === 'ITERACION_3' ? 'Iteración 3' : 'Iteración 4'} · Roadmap
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          Épica: {hu.epicTitle} · Prioridad {hu.priority} · {hu.storyPoints} Story Points · Ref: {hu.relatedRF.join(', ')}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-slate-500 hidden sm:inline">
                        Rol: {hu.role}
                      </span>
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-slate-500" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-slate-500" />
                      )}
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="p-5 border-t border-slate-100 bg-slate-50/50 space-y-4 text-xs">
                      {/* Como / Quiero / Para Box */}
                      <div className="bg-white p-4 rounded-lg border border-slate-200 space-y-2">
                        <div className="text-xs font-bold text-slate-900 uppercase tracking-wide text-amber-800">
                          Narrativa de la Historia de Usuario
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1 text-slate-700">
                          <div className="p-2.5 bg-slate-50 rounded border border-slate-100">
                            <span className="font-bold text-slate-900 block mb-1">Como:</span>
                            <span>{hu.role}</span>
                          </div>
                          <div className="p-2.5 bg-slate-50 rounded border border-slate-100">
                            <span className="font-bold text-slate-900 block mb-1">Quiero:</span>
                            <span>{hu.action}</span>
                          </div>
                          <div className="p-2.5 bg-slate-50 rounded border border-slate-100">
                            <span className="font-bold text-slate-900 block mb-1">Para:</span>
                            <span>{hu.benefit}</span>
                          </div>
                        </div>
                      </div>

                      {/* Criterios de Aceptación (Gherkin) */}
                      <div className="bg-white p-4 rounded-lg border border-slate-200 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                            Criterios de Aceptación (Sintaxis Gherkin)
                          </div>
                          <span className="text-[11px] text-slate-500">
                            {hu.acceptanceCriteria.length} Escenarios de Prueba
                          </span>
                        </div>

                        <div className="space-y-3 font-mono text-[11px]">
                          {hu.acceptanceCriteria.map((ac, idx) => (
                            <div
                              key={idx}
                              className="p-3 bg-slate-50 rounded border border-slate-200 space-y-1.5"
                            >
                              <div className="font-bold text-slate-900 text-xs">
                                Escenario: {ac.scenario}
                              </div>
                              <div className="text-slate-700 pl-2">
                                <span className="font-bold text-indigo-700">Dado que</span> {ac.given}
                              </div>
                              <div className="text-slate-700 pl-2">
                                <span className="font-bold text-amber-700">Cuando</span> {ac.when}
                              </div>
                              <div className="text-slate-700 pl-2">
                                <span className="font-bold text-emerald-700">Entonces</span> {ac.then}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Business Rules & Verification CTA */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-amber-50/60 p-3 rounded-lg border border-amber-200">
                          <div className="font-semibold text-amber-900 mb-1">Reglas de Negocio Vinculadas:</div>
                          <ul className="space-y-1 text-amber-800 text-[11px]">
                            {hu.businessRules.map((br, i) => (
                              <li key={i}>• {br}</li>
                            ))}
                          </ul>
                        </div>

                        <div className="bg-slate-100 p-3 rounded-lg border border-slate-200 flex flex-col justify-between">
                          <div>
                            <div className="font-semibold text-slate-900 mb-1">Validación en el Sistema:</div>
                            <p className="text-slate-600 text-[11px]">
                              Esta historia de usuario se encuentra completamente codificada e integrada con el patio en vivo, la asignación de celdas y la liquidación en caja.
                            </p>
                          </div>
                          <div className="mt-3 pt-2 border-t border-slate-200 flex justify-end">
                            <button
                              onClick={() => {
                                if (hu.epic === 'ENTRADA_SALIDA') {
                                  onOpenNewEntry();
                                } else {
                                  onNavigateToOperations();
                                }
                              }}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded transition-colors cursor-pointer"
                            >
                              <Play className="w-3 h-3 text-emerald-400" />
                              <span>Ejecutar Flujo de esta HU</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SubTab: REQUERIMIENTOS FUNCIONALES (RF) */}
      {activeSubTab === 'rf' && (
        <div className="space-y-4">
          {/* Category Filter */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500 font-medium">Filtrar por etapa:</span>
            {['TODOS', 'ENTRADA', 'SALIDA', 'TARIFACIÓN', 'AUDITORÍA'].map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 rounded transition-colors ${
                  selectedCategory === cat
                    ? 'bg-slate-200 text-slate-900 font-semibold'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* List of RF items */}
          <div className="space-y-3">
            {filteredRfs.map(rf => {
              const isExpanded = expandedRfId === rf.id;
              return (
                <div
                  key={rf.id}
                  className="bg-white border border-slate-200 rounded-lg transition-all overflow-hidden"
                >
                  <div
                    onClick={() => toggleExpandRf(rf.id)}
                    className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-50 select-none"
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs font-bold text-slate-900 bg-slate-100 px-2 py-1 rounded border border-slate-200">
                        {rf.id}
                      </span>
                      <h3 className="text-sm font-semibold text-slate-900">
                        {rf.title}
                      </h3>
                      <span className="hidden sm:inline text-xs text-slate-500">
                        · {rf.category} · Prioridad {rf.priority}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-500 hidden md:inline">
                        Actor: {rf.actor}
                      </span>
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-slate-500" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-slate-500" />
                      )}
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="p-4 border-t border-slate-100 bg-slate-50/50 space-y-4 text-xs">
                      <div>
                        <div className="font-medium text-slate-900 mb-1">Descripción:</div>
                        <p className="text-slate-700 leading-relaxed">{rf.description}</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-white p-3 rounded border border-slate-200">
                          <div className="font-medium text-slate-900 mb-1 flex items-center gap-1.5">
                            <Layers className="w-3.5 h-3.5 text-slate-500" />
                            Precondiciones
                          </div>
                          <ul className="list-disc list-inside space-y-1 text-slate-600">
                            {rf.preconditions.map((p, i) => (
                              <li key={i}>{p}</li>
                            ))}
                          </ul>
                        </div>

                        <div className="bg-white p-3 rounded border border-slate-200">
                          <div className="font-medium text-slate-900 mb-1 flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            Postcondiciones
                          </div>
                          <ul className="list-disc list-inside space-y-1 text-slate-600">
                            {rf.postconditions.map((p, i) => (
                              <li key={i}>{p}</li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div className="bg-white p-3 rounded border border-slate-200">
                        <div className="font-medium text-slate-900 mb-2">Flujo de Trabajo Paso a Paso:</div>
                        <div className="space-y-1 text-slate-700 font-mono text-[11px]">
                          {rf.workflow.map((step, i) => (
                            <div key={i} className="pl-1">
                              {step}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-amber-50/60 p-3 rounded border border-amber-200">
                          <div className="font-medium text-amber-900 mb-1">Reglas de Negocio Aplicables:</div>
                          <ul className="space-y-1 text-amber-800 text-[11px]">
                            {rf.businessRules.map((br, i) => (
                              <li key={i}>• {br}</li>
                            ))}
                          </ul>
                        </div>

                        <div className="bg-slate-100 p-3 rounded border border-slate-200 flex flex-col justify-between">
                          <div>
                            <div className="font-medium text-slate-900 mb-1">Criterio de Aceptación / Prueba:</div>
                            <p className="text-slate-600 text-[11px] italic">{rf.testScenario}</p>
                          </div>
                          <div className="mt-3 pt-2 border-t border-slate-200 flex justify-end">
                            <button
                              onClick={() => {
                                if (rf.category === 'ENTRADA') {
                                  onOpenNewEntry();
                                } else {
                                  onNavigateToOperations();
                                }
                              }}
                              className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium text-slate-900 bg-white hover:bg-slate-50 border border-slate-300 rounded transition-colors cursor-pointer"
                            >
                              <Play className="w-3 h-3 text-emerald-600" />
                              <span>Validar en el Sistema</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SubTab: REQUERIMIENTOS NO FUNCIONALES (RNF) */}
      {activeSubTab === 'rnf' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {NON_FUNCTIONAL_REQUIREMENTS.map(rnf => (
              <div
                key={rnf.id}
                className="bg-white border border-slate-200 rounded-lg p-5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="font-mono text-xs font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                      {rnf.id}
                    </span>
                    <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                      {rnf.category}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 mb-2">
                    {rnf.title}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed mb-4">
                    {rnf.description}
                  </p>
                </div>

                <div className="space-y-2 pt-3 border-t border-slate-100 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 font-medium">Métrica Objetivo:</span>
                    <span className="font-mono font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                      {rnf.metric}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 font-medium block mb-1">Estrategia de Cumplimiento:</span>
                    <div className="text-[11px] text-slate-700 bg-slate-50 p-2 rounded border border-slate-100">
                      {rnf.complianceStrategy}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SubTab: MATRIZ DE TRAZABILIDAD (RF vs HU vs CU vs PRUEBAS) */}
      {activeSubTab === 'matriz' && (
        <div className="bg-white border border-slate-200 rounded-lg p-5 space-y-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full mb-1">
                <FileCheck2 className="w-3.5 h-3.5" />
                <span>Trazabilidad Bidireccional de Requerimientos (Criterio IEEE 830 / ISO/IEC/IEEE 29148)</span>
              </div>
              <h3 className="text-base font-bold text-slate-900">
                Matriz de Trazabilidad: Requerimientos Funcionales ⇄ Historias de Usuario ⇄ Casos de Uso ⇄ Pruebas
              </h3>
              <p className="text-xs text-slate-600 mt-0.5">
                Alineación total entre la especificación formal (RF), las Historias de Usuario (HU), los Casos de Uso en StarUML (CU) y los Casos de Prueba con criterios de aceptación ejecutables.
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <div className="flex bg-slate-100 p-0.5 rounded-md border border-slate-200 text-xs font-medium">
                <button
                  onClick={() => setMatrizViewType('integral')}
                  className={`px-3 py-1 rounded transition-colors ${
                    matrizViewType === 'integral'
                      ? 'bg-white text-slate-900 shadow-sm font-semibold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Matriz Integral (RF ⇄ HU ⇄ CU ⇄ Pruebas)
                </button>
                <button
                  onClick={() => setMatrizViewType('agil')}
                  className={`px-3 py-1 rounded transition-colors ${
                    matrizViewType === 'agil'
                      ? 'bg-white text-slate-900 shadow-sm font-semibold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Matriz Ágil (HU vs Épicas)
                </button>
              </div>

              <button
                onClick={copyMatrizMarkdown}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-800 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-md transition-colors cursor-pointer"
                title="Copiar tabla en formato Markdown para pegar directamente en Word o Google Docs"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{copiedMatriz ? '¡Copiada al Portapapeles!' : 'Copiar Matriz para Documento'}</span>
              </button>
            </div>
          </div>

          {/* Search bar and KPI summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 pt-2">
            <div className="md:col-span-2 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={matrizSearch}
                onChange={e => setMatrizSearch(e.target.value)}
                placeholder="Filtrar por RF, HU, CU, Caso de Prueba, Módulo..."
                className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-md bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all"
              />
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-md px-3 py-2 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">Requerimientos Mapeados:</span>
              <span className="font-mono font-bold text-slate-900">{TRACEABILITY_MATRIX.length} / 12 (100%)</span>
            </div>
            <div className="bg-emerald-50/70 border border-emerald-200 rounded-md px-3 py-2 flex items-center justify-between text-xs">
              <span className="text-emerald-700 font-medium">Cobertura de Pruebas:</span>
              <span className="font-mono font-bold text-emerald-800">100% Validado</span>
            </div>
          </div>

          {matrizViewType === 'integral' ? (
            <div className="overflow-x-auto border border-slate-200 rounded-lg">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-100 text-slate-800 font-semibold text-[11px] uppercase tracking-wider">
                    <th className="py-2.5 px-3">ID</th>
                    <th className="py-2.5 px-3 min-w-[180px]">Requerimiento Funcional (RF)</th>
                    <th className="py-2.5 px-3 min-w-[190px]">Historia de Usuario (HU)</th>
                    <th className="py-2.5 px-3 min-w-[170px]">Caso de Uso UML (CU)</th>
                    <th className="py-2.5 px-3 min-w-[280px]">Prueba Correspondiente (CP / Validación)</th>
                    <th className="py-2.5 px-3 min-w-[130px]">Módulo UI / Capa</th>
                    <th className="py-2.5 px-3 whitespace-nowrap">Método</th>
                    <th className="py-2.5 px-3 text-center whitespace-nowrap">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-normal">
                  {filteredMatriz.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-slate-500">
                        No se encontraron coincidencias para "{matrizSearch}".
                      </td>
                    </tr>
                  ) : (
                    filteredMatriz.map(item => (
                      <tr key={item.id} className="hover:bg-slate-50/90 transition-colors">
                        <td className="py-2.5 px-3 font-mono font-bold text-slate-700 whitespace-nowrap">
                          {item.id}
                        </td>
                        <td className="py-2.5 px-3">
                          <div className="font-mono font-bold text-indigo-700 text-[11px]">{item.rfId}</div>
                          <div className="font-semibold text-slate-900 mt-0.5">{item.rfTitle}</div>
                        </td>
                        <td className="py-2.5 px-3">
                          <div className="font-mono font-bold text-purple-700 text-[11px]">{item.userStoryId}</div>
                          <div className="text-slate-700 mt-0.5 line-clamp-2">{item.userStoryTitle}</div>
                        </td>
                        <td className="py-2.5 px-3">
                          <div className="font-mono font-bold text-blue-700 text-[11px]">{item.useCaseId}</div>
                          <div className="text-slate-800 font-medium mt-0.5">{item.useCaseName}</div>
                        </td>
                        <td className="py-2.5 px-3">
                          <div className="flex items-center gap-1.5 mb-1">
                            <span className="font-mono font-bold text-emerald-800 bg-emerald-100/70 px-1.5 py-0.2 rounded text-[10px]">
                              {item.testCaseId}
                            </span>
                            <span className="font-medium text-slate-900 text-[11px]">
                              {item.testCaseName}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-600 bg-slate-50 p-1.5 rounded border border-slate-100 leading-snug">
                            {item.testScenario}
                          </p>
                        </td>
                        <td className="py-2.5 px-3 text-slate-700 font-medium">
                          <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[11px] inline-block">
                            {item.systemModule}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 whitespace-nowrap">
                          <span className="text-[10px] text-slate-600 border border-slate-200 px-1.5 py-0.5 rounded bg-white">
                            {item.verificationMethod}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-center whitespace-nowrap">
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            Validado
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="overflow-x-auto border border-slate-200 rounded-lg">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-100 text-slate-800 font-semibold text-[11px] uppercase tracking-wider">
                    <th className="py-2.5 px-3">Historia de Usuario</th>
                    <th className="py-2.5 px-3">Épica</th>
                    <th className="py-2.5 px-3">RF Relacionado</th>
                    <th className="py-2.5 px-3">Rol / Actor</th>
                    <th className="py-2.5 px-3 text-center">Story Points</th>
                    <th className="py-2.5 px-3">Módulo UI</th>
                    <th className="py-2.5 px-3 text-center">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-normal">
                  {USER_STORIES.map(hu => (
                    <tr key={hu.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-2 px-3 font-mono font-bold text-slate-900 whitespace-nowrap">
                        {hu.id} · {hu.title}
                      </td>
                      <td className="py-2 px-3 text-slate-600">
                        {hu.epicTitle}
                      </td>
                      <td className="py-2 px-3 font-mono text-indigo-700 font-semibold">
                        {hu.relatedRF.join(', ') || '-'}
                      </td>
                      <td className="py-2 px-3 text-slate-500">
                        {hu.role}
                      </td>
                      <td className="py-2 px-3 font-mono text-slate-800 text-center font-bold">
                        {hu.storyPoints}
                      </td>
                      <td className="py-2 px-3 text-slate-600">
                        {hu.epic === 'ENTRADA_SALIDA' ? 'Operaciones / Modales' : hu.epic === 'CELDAS' ? 'Mapa de Celdas' : hu.epic === 'MENSUALISTAS' ? 'Mensualistas' : hu.epic === 'NOVEDADES' ? 'Novedades' : 'Pagos y Caja'}
                      </td>
                      <td className="py-2 px-3 text-center">
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          Completada
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* SubTab: RESUMEN Y ALCANCE */}
      {activeSubTab === 'resumen' && (
        <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-6">
          <div>
            <h3 className="text-base font-bold text-slate-900 mb-2">
              Alcance de la Metodología Ágil y Marco Legal Aplicable
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              El desarrollo de software para el Parqueadero Autos Colombia sigue el marco de trabajo Scrum, organizando las funcionalidades en 5 épicas de valor de negocio con estimación en Story Points y definición rigurosa de criterios de aceptación.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
              <div className="font-bold text-slate-900 text-sm">Épica 1: Entrada y Salida</div>
              <p className="text-slate-600">
                10 Historias de Usuario dedicadas a la captura de placa, discriminación de abonados mensualistas, cálculo de tiempo, liquidación de fracciones y emisión de tickets térmicos y recibos fiscales.
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
              <div className="font-bold text-slate-900 text-sm">Épica 2 y 3: Celdas y Mensualistas</div>
              <p className="text-slate-600">
                Control topográfico del parqueadero zonificado (Zona A, B y C), suscripción de abonados con control de vencimiento y renovación recurrente.
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
              <div className="font-bold text-slate-900 text-sm">Épica 4 y 5: Novedades y Pagos</div>
              <p className="text-slate-600">
                Libro de custodia para registro de incidencias en automotores y arqueo diario con medios de pago colombianos (Efectivo, Nequi, Daviplata, Tarjetas).
              </p>
            </div>
          </div>

          <div className="p-4 bg-amber-50 rounded-lg border border-amber-200 text-xs text-amber-900 space-y-1">
            <div className="font-bold">Regulaciones Colombianas Cumplidas:</div>
            <div>• <strong>Ley 1480 de 2011 (Estatuto del Consumidor):</strong> Emisión obligatoria de comprobante con fecha, hora, placa y condiciones de custodia.</div>
            <div>• <strong>Ley 1581 de 2012 (Habeas Data):</strong> Protección de datos personales de los usuarios mensualistas y conductores.</div>
            <div>• <strong>Decretos Municipales de Parqueaderos:</strong> Cobro por fracciones de tiempo y periodo de gracia.</div>
          </div>
        </div>
      )}
    </div>
  );
};
