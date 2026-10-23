import React, { useState } from 'react';
import { Plus, Github, Download } from 'lucide-react';
import { GitHubModal } from './GitHubModal';

export type ActiveTab = 'operaciones' | 'celdas' | 'usuarios' | 'novedades' | 'pagos' | 'requisitos' | 'arquitectura' | 'paquetes' | 'casos_uso' | 'mockups' | 'basedatos' | 'configuracion';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenNewEntry: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenNewEntry,
}) => {
  const [isGitHubModalOpen, setIsGitHubModalOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Single text element wordmark */}
          <div className="flex items-center gap-2 shrink-0">
            <span
              onClick={() => setActiveTab('operaciones')}
              className="text-lg font-bold tracking-tight text-slate-900 cursor-pointer whitespace-nowrap"
            >
              Autos Colombia
            </span>
          </div>

          {/* Zone 2: Single-line clean text navigation links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <button
              onClick={() => setActiveTab('operaciones')}
              className={`whitespace-nowrap transition-colors pb-1 border-b-2 ${
                activeTab === 'operaciones'
                  ? 'text-slate-950 border-slate-950 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 border-transparent'
              }`}
            >
              Operaciones
            </button>
            <button
              onClick={() => setActiveTab('celdas')}
              className={`whitespace-nowrap transition-colors pb-1 border-b-2 ${
                activeTab === 'celdas'
                  ? 'text-slate-950 border-slate-950 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 border-transparent'
              }`}
            >
              Celdas
            </button>
            <button
              onClick={() => setActiveTab('usuarios')}
              className={`whitespace-nowrap transition-colors pb-1 border-b-2 ${
                activeTab === 'usuarios'
                  ? 'text-slate-950 border-slate-950 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 border-transparent'
              }`}
            >
              Mensualistas
            </button>
            <button
              onClick={() => setActiveTab('novedades')}
              className={`whitespace-nowrap transition-colors pb-1 border-b-2 ${
                activeTab === 'novedades'
                  ? 'text-slate-950 border-slate-950 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 border-transparent'
              }`}
            >
              Novedades
            </button>
            <button
              onClick={() => setActiveTab('pagos')}
              className={`whitespace-nowrap transition-colors pb-1 border-b-2 ${
                activeTab === 'pagos'
                  ? 'text-slate-950 border-slate-950 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 border-transparent'
              }`}
            >
              Pagos y Caja
            </button>
            <button
              onClick={() => setActiveTab('requisitos')}
              className={`whitespace-nowrap transition-colors pb-1 border-b-2 ${
                activeTab === 'requisitos'
                  ? 'text-amber-800 border-amber-600 font-semibold'
                  : 'text-amber-700 hover:text-amber-900 border-transparent'
              }`}
            >
              Historias y Requisitos
            </button>
            <button
              onClick={() => setActiveTab('arquitectura')}
              className={`whitespace-nowrap transition-colors pb-1 border-b-2 ${
                activeTab === 'arquitectura'
                  ? 'text-indigo-800 border-indigo-600 font-semibold'
                  : 'text-indigo-700 hover:text-indigo-900 border-transparent'
              }`}
            >
              Clases StarUML
            </button>
            <button
              onClick={() => setActiveTab('paquetes')}
              className={`whitespace-nowrap transition-colors pb-1 border-b-2 ${
                activeTab === 'paquetes'
                  ? 'text-purple-800 border-purple-600 font-semibold'
                  : 'text-purple-700 hover:text-purple-900 border-transparent'
              }`}
            >
              Paquetes StarUML
            </button>
            <button
              onClick={() => setActiveTab('casos_uso')}
              className={`whitespace-nowrap transition-colors pb-1 border-b-2 ${
                activeTab === 'casos_uso'
                  ? 'text-sky-800 border-sky-600 font-semibold'
                  : 'text-sky-700 hover:text-sky-900 border-transparent'
              }`}
            >
              Casos de Uso StarUML
            </button>
            <button
              onClick={() => setActiveTab('mockups')}
              className={`whitespace-nowrap transition-colors pb-1 border-b-2 ${
                activeTab === 'mockups'
                  ? 'text-violet-900 border-violet-600 font-semibold'
                  : 'text-violet-700 hover:text-violet-900 border-transparent'
              }`}
            >
              Mockups Figma
            </button>
            <button
              onClick={() => setActiveTab('basedatos')}
              className={`whitespace-nowrap transition-colors pb-1 border-b-2 ${
                activeTab === 'basedatos'
                  ? 'text-emerald-900 border-emerald-600 font-semibold'
                  : 'text-emerald-700 hover:text-emerald-900 border-transparent'
              }`}
            >
              Base de Datos (MER/MR)
            </button>
            <button
              onClick={() => setActiveTab('configuracion')}
              className={`whitespace-nowrap transition-colors pb-1 border-b-2 ${
                activeTab === 'configuracion'
                  ? 'text-slate-950 border-slate-950 font-semibold'
                  : 'text-slate-500 hover:text-slate-800 border-transparent'
              }`}
            >
              Tarifas
            </button>
          </nav>

          {/* Zone 3: Actions */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={() => setIsGitHubModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-semibold text-slate-700 hover:text-slate-950 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-md transition-colors whitespace-nowrap cursor-pointer shadow-2xs"
              title="Subir a GitHub o descargar código completo"
            >
              <Github className="w-4 h-4 text-slate-800" />
              <span className="hidden sm:inline">GitHub / Código</span>
              <span className="sm:hidden">GitHub</span>
            </button>

            <button
              onClick={onOpenNewEntry}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-slate-950 hover:bg-slate-800 rounded-md transition-colors whitespace-nowrap shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Registrar Entrada</span>
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile nav bar row for small screens */}
      <div className="md:hidden flex items-center gap-4 px-4 py-2 border-t border-slate-100 overflow-x-auto text-xs font-medium">
        <button
          onClick={() => setActiveTab('operaciones')}
          className={`whitespace-nowrap py-1 ${activeTab === 'operaciones' ? 'text-slate-950 font-bold' : 'text-slate-600'}`}
        >
          Operaciones
        </button>
        <button
          onClick={() => setActiveTab('celdas')}
          className={`whitespace-nowrap py-1 ${activeTab === 'celdas' ? 'text-slate-950 font-bold' : 'text-slate-600'}`}
        >
          Celdas
        </button>
        <button
          onClick={() => setActiveTab('usuarios')}
          className={`whitespace-nowrap py-1 ${activeTab === 'usuarios' ? 'text-slate-950 font-bold' : 'text-slate-600'}`}
        >
          Mensualistas
        </button>
        <button
          onClick={() => setActiveTab('novedades')}
          className={`whitespace-nowrap py-1 ${activeTab === 'novedades' ? 'text-slate-950 font-bold' : 'text-slate-600'}`}
        >
          Novedades
        </button>
        <button
          onClick={() => setActiveTab('pagos')}
          className={`whitespace-nowrap py-1 ${activeTab === 'pagos' ? 'text-slate-950 font-bold' : 'text-slate-600'}`}
        >
          Pagos
        </button>
        <button
          onClick={() => setActiveTab('requisitos')}
          className={`whitespace-nowrap py-1 ${activeTab === 'requisitos' ? 'text-amber-800 font-bold' : 'text-amber-700'}`}
        >
          HU / RF / RNF
        </button>
        <button
          onClick={() => setActiveTab('arquitectura')}
          className={`whitespace-nowrap py-1 ${activeTab === 'arquitectura' ? 'text-indigo-800 font-bold' : 'text-indigo-700'}`}
        >
          Clases StarUML
        </button>
        <button
          onClick={() => setActiveTab('paquetes')}
          className={`whitespace-nowrap py-1 ${activeTab === 'paquetes' ? 'text-purple-800 font-bold' : 'text-purple-700'}`}
        >
          Paquetes StarUML
        </button>
        <button
          onClick={() => setActiveTab('casos_uso')}
          className={`whitespace-nowrap py-1 ${activeTab === 'casos_uso' ? 'text-sky-800 font-bold' : 'text-sky-700'}`}
        >
          Casos de Uso
        </button>
        <button
          onClick={() => setActiveTab('mockups')}
          className={`whitespace-nowrap py-1 ${activeTab === 'mockups' ? 'text-violet-800 font-bold' : 'text-violet-700'}`}
        >
          Mockups Figma
        </button>
        <button
          onClick={() => setActiveTab('basedatos')}
          className={`whitespace-nowrap py-1 ${activeTab === 'basedatos' ? 'text-emerald-800 font-bold' : 'text-emerald-700'}`}
        >
          MER / MR
        </button>
        <button
          onClick={() => setActiveTab('configuracion')}
          className={`whitespace-nowrap py-1 ${activeTab === 'configuracion' ? 'text-slate-950 font-bold' : 'text-slate-500'}`}
        >
          Tarifas
        </button>
      </div>

      {/* Modal de GitHub & Descarga */}
      <GitHubModal
        isOpen={isGitHubModalOpen}
        onClose={() => setIsGitHubModalOpen(false)}
      />
    </header>
  );
};
