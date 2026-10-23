import React, { useState } from 'react';
import { X, Github, Download, Copy, Check, ExternalLink, Terminal, Globe, FolderGit2, AlertCircle } from 'lucide-react';

interface GitHubModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GitHubModal: React.FC<GitHubModalProps> = ({ isOpen, onClose }) => {
  const [githubUser, setGithubUser] = useState('tathii-27');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'terminal' | 'web'>('terminal');

  if (!isOpen) return null;

  const repoName = 'parqueadero-autos-colombia';
  const effectiveUser = githubUser.trim() || 'tu-usuario-github';
  const repoUrl = `https://github.com/${effectiveUser}/${repoName}.git`;

  const commands = [
    `git remote add origin ${repoUrl}`,
    `git branch -M main`,
    `git push -u origin main`,
  ];

  const fullCommandBlock = `# 1. Vincular el repositorio remoto en GitHub
git remote add origin ${repoUrl}

# 2. Asegurar la rama principal
git branch -M main

# 3. Subir todos los archivos y ramas
git push -u origin main`;

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header del Modal */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-900 text-white">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-slate-800 rounded-lg">
              <Github className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                Subir Código Fuente a GitHub
              </h2>
              <p className="text-xs text-slate-300">
                Tatiana Gallego • IU Digital de Antioquia
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Contenido scrolleable */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm text-slate-700">
          
          {/* Card Descarga Inmediata ZIP */}
          <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-200 text-amber-900">
                Recomendado para entrega rápida
              </span>
              <h3 className="font-bold text-slate-900 text-sm">
                Descargar Código Fuente Completo (.ZIP)
              </h3>
              <p className="text-xs text-slate-600">
                Incluye todo el código React/TypeScript, configuración, diagramas StarUML (.mdj) y modelo de datos.
              </p>
            </div>
            <a
              href="/parqueadero_autos_colombia_codigo_fuente.zip"
              download="parqueadero_autos_colombia_codigo_fuente.zip"
              className="inline-flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors shrink-0 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Descargar .ZIP</span>
            </a>
          </div>

          {/* Selector de Método */}
          <div>
            <div className="flex border-b border-slate-200">
              <button
                onClick={() => setActiveTab('terminal')}
                className={`flex items-center gap-2 py-2.5 px-4 font-semibold text-xs border-b-2 cursor-pointer transition-colors ${
                  activeTab === 'terminal'
                    ? 'border-slate-900 text-slate-900'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Terminal className="w-4 h-4" />
                <span>Método 1: Por Consola / Terminal (Git)</span>
              </button>
              <button
                onClick={() => setActiveTab('web')}
                className={`flex items-center gap-2 py-2.5 px-4 font-semibold text-xs border-b-2 cursor-pointer transition-colors ${
                  activeTab === 'web'
                    ? 'border-slate-900 text-slate-900'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Globe className="w-4 h-4" />
                <span>Método 2: Por la Web de GitHub (Sin comandos)</span>
              </button>
            </div>
          </div>

          {activeTab === 'terminal' ? (
            /* MÉTODO 1: TERMINAL */
            <div className="space-y-4">
              {/* Paso 1 */}
              <div className="flex gap-3">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-900 text-white font-bold text-xs shrink-0">
                  1
                </span>
                <div className="space-y-1.5 flex-1">
                  <h4 className="font-bold text-slate-900 text-sm">Crear el repositorio en GitHub</h4>
                  <p className="text-xs text-slate-600">
                    Ingresa a GitHub y crea un nuevo repositorio llamado <code className="bg-slate-100 text-slate-800 px-1 py-0.5 rounded font-mono font-bold">parqueadero-autos-colombia</code>.
                    <span className="text-amber-800 font-semibold block mt-0.5">⚠️ Importante: Deja desmarcada la opción "Add a README file".</span>
                  </p>
                  <a
                    href="https://github.com/new"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-800"
                  >
                    Abrir github.com/new <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* Paso 2 */}
              <div className="flex gap-3">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-900 text-white font-bold text-xs shrink-0">
                  2
                </span>
                <div className="space-y-2 flex-1">
                  <h4 className="font-bold text-slate-900 text-sm">Personaliza tus comandos con tu usuario</h4>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500 font-mono">github.com/</span>
                    <input
                      type="text"
                      placeholder="Escribe tu usuario de GitHub aquí (ej. tatianagallego)"
                      value={githubUser}
                      onChange={(e) => setGithubUser(e.target.value)}
                      className="px-3 py-1.5 border border-slate-300 rounded-lg text-xs font-mono w-full focus:outline-none focus:ring-2 focus:ring-slate-900"
                    />
                  </div>
                </div>
              </div>

              {/* Paso 3 */}
              <div className="flex gap-3">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-900 text-white font-bold text-xs shrink-0">
                  3
                </span>
                <div className="space-y-2 flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-slate-900 text-sm">Ejecuta los comandos en tu terminal</h4>
                    <button
                      onClick={() => copyToClipboard(fullCommandBlock, 999)}
                      className="inline-flex items-center gap-1 text-xs text-slate-700 bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-md transition-colors cursor-pointer"
                    >
                      {copiedIndex === 999 ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-700 font-bold">¡Copiado!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copiar todo</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="bg-slate-950 text-slate-100 p-3 rounded-lg font-mono text-xs space-y-1.5 overflow-x-auto border border-slate-800">
                    {commands.map((cmd, idx) => (
                      <div key={idx} className="flex items-center justify-between gap-4 hover:bg-slate-900/60 p-1 rounded">
                        <span className="text-emerald-400 select-all">$ {cmd}</span>
                        <button
                          onClick={() => copyToClipboard(cmd, idx)}
                          title="Copiar comando"
                          className="text-slate-400 hover:text-white shrink-0 cursor-pointer"
                        >
                          {copiedIndex === idx ? (
                            <Check className="w-3 h-3 text-emerald-400" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-600 space-y-1">
                    <p className="font-semibold text-slate-800 flex items-center gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                      ¿GitHub te pide contraseña en la terminal?
                    </p>
                    <p>
                      GitHub ya no acepta contraseñas normales. Debes usar un <strong>Personal Access Token (PAT)</strong>:
                    </p>
                    <ol className="list-decimal list-inside pl-1 text-[11px] space-y-0.5 text-slate-500">
                      <li>Ve a tu GitHub &gt; <strong>Settings</strong> &gt; <strong>Developer settings</strong> &gt; <strong>Personal access tokens</strong> &gt; <strong>Tokens (classic)</strong>.</li>
                      <li>Genera un token nuevo con la casilla <strong>repo</strong> marcada.</li>
                      <li>Pégalo en la terminal cuando te pida <em>Password</em>.</li>
                    </ol>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* MÉTODO 2: SUBIR POR LA WEB (SIN CONSOLA) */
            <div className="space-y-4">
              <div className="flex gap-3">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-900 text-white font-bold text-xs shrink-0">
                  1
                </span>
                <div className="space-y-1 flex-1">
                  <h4 className="font-bold text-slate-900 text-sm">Descarga y descomprime el archivo ZIP</h4>
                  <p className="text-xs text-slate-600">
                    Haz clic en el botón amarillo arriba para descargar el archivo <code className="bg-slate-100 text-slate-800 px-1 py-0.5 rounded font-mono">parqueadero_autos_colombia_codigo_fuente.zip</code> y descomprímelo en tu computador.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-900 text-white font-bold text-xs shrink-0">
                  2
                </span>
                <div className="space-y-1 flex-1">
                  <h4 className="font-bold text-slate-900 text-sm">Crea el repositorio en GitHub</h4>
                  <p className="text-xs text-slate-600">
                    Crea tu repositorio en <a href="https://github.com/new" target="_blank" rel="noreferrer" className="text-indigo-600 font-semibold underline">github.com/new</a> con el nombre <code className="bg-slate-100 text-slate-800 px-1 py-0.5 rounded font-mono font-bold">parqueadero-autos-colombia</code>.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-900 text-white font-bold text-xs shrink-0">
                  3
                </span>
                <div className="space-y-1.5 flex-1">
                  <h4 className="font-bold text-slate-900 text-sm">Usa la opción "uploading an existing file"</h4>
                  <p className="text-xs text-slate-600">
                    En la pantalla principal del repositorio recién creado, verás el enlace que dice:
                  </p>
                  <div className="p-2.5 bg-slate-100 border border-slate-300 rounded font-mono text-xs text-slate-800 font-semibold">
                    &quot;...or upload an existing file&quot;
                  </div>
                  <p className="text-xs text-slate-600">
                    Arrastra todos los archivos y carpetas de la carpeta descomprimida al navegador.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-900 text-white font-bold text-xs shrink-0">
                  4
                </span>
                <div className="space-y-1 flex-1">
                  <h4 className="font-bold text-slate-900 text-sm">Guardar cambios (Commit changes)</h4>
                  <p className="text-xs text-slate-600">
                    Escribe un mensaje de confirmación como <code className="bg-slate-100 text-slate-800 px-1 py-0.5 rounded font-mono">feat: Entrega Parqueadero Autos Colombia - IU Digital</code> y presiona el botón verde <strong>Commit changes</strong>.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Información del Proyecto */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Repositorio local listo en rama <strong className="text-slate-800">main</strong></span>
            <span>Institución Universitaria Digital de Antioquia</span>
          </div>

        </div>

        {/* Footer del Modal */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
          >
            Entendido / Cerrar
          </button>
        </div>

      </div>
    </div>
  );
};
