import React, { useRef, useState } from 'react';
import { 
  Download, 
  Check, 
  Copy, 
  Layers, 
  Monitor, 
  Cpu, 
  Database, 
  ArrowDown, 
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  Code2,
  FileCode,
  CheckCircle2,
  HelpCircle,
  Eye
} from 'lucide-react';

export const LayeredArchitectureDiagramView: React.FC = () => {
  const [selectedLayer, setSelectedLayer] = useState<'TODAS' | 'PRESENTACION' | 'NEGOCIO' | 'ACCESO_DATOS' | 'BASE_DATOS'>('TODAS');
  const [copiedPlantUml, setCopiedPlantUml] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const plantUmlArchitectureCode = `@startuml ParqueaderoAutosColombia_Arquitectura
!theme plain
skinparam componentStyle uml2
skinparam linetype ortho
skinparam packageBackgroundColor #FAFAFA
skinparam packageBorderColor #334155

title ARQUITECTURA DE SOFTWARE N-TIER - PARQUEADERO AUTOS COLOMBIA\\nEstudiante: Tatiana Gallego - IU Digital de Antioquia

' ================= CAPA 1: PRESENTACIÓN =================
package "Capa 1: Presentación (Frontend / Interfaces)" #EBF5FF {
  package "Operador de Entrada (Caseta)" {
    [ModalRegistroEntrada] as UI_Entrada
    [VistaMapaCeldas] as UI_Mapa
    [TicketPrintModal] as UI_Ticket
  }

  package "Cajero de Salida (Taquilla)" {
    [ModalLiquidacionSalida] as UI_Salida
    [CalculadoraCobroPago] as UI_Pago
    [ReciboFiscalSalida] as UI_Recibo
  }
}

' ================= CAPA 2: LÓGICA DE NEGOCIO =================
package "Capa 2: Lógica de Negocio (Application & Domain Services)" #F5F3FF {
  [ValidadorEntradaVehicular] as Srv_Entrada
  [GestorAsignacionCeldas] as Srv_Celdas
  [MotorTarifasLiquidacion] as Srv_Tarifas
  [GestorSalidaCobro] as Srv_SalidaCobro
  [ServicioMensualistas] as Srv_Mensualistas
}

' ================= CAPA 3: ACCESO A DATOS =================
package "Capa 3: Acceso a Datos (DAOs / Repositorios)" #ECFDF5 {
  [VehiculoRepository] as Repo_Vehiculo
  [EntradaVehiculoRepository] as Repo_Entrada
  [CeldaParqueoRepository] as Repo_Celda
  [TarifaRepository] as Repo_Tarifa
  [PagoRepository] as Repo_Pago
  [MensualistaRepository] as Repo_Mensualista
}

' ================= CAPA 4: BASE DE DATOS =================
package "Capa 4: Base de Datos Relacional (PostgreSQL / MySQL)" #FEF3C7 {
  database "PostgreSQL 14+" {
    [VEHICULOS] as TBL_Vehiculos
    [ENTRADAS_VEHICULOS] as TBL_Entradas
    [CELDAS_PARQUEO] as TBL_Celdas
    [TARIFAS] as TBL_Tarifas
    [PAGOS] as TBL_Pagos
    [USUARIOS_MENSUALISTAS] as TBL_Usuarios
    [SUSCRIPCIONES_MENSUALES] as TBL_Suscripciones
    [NOVEDADES_VEHICULOS] as TBL_Novedades
  }
}

' ================= DEPENDENCIAS Y COMUNICACIÓN =================
UI_Entrada ..> Srv_Entrada : <<use>> normaliza placa / valida RUNT
UI_Entrada ..> Srv_Celdas : <<use>> solicita celda sugerida
UI_Ticket ..> Srv_Entrada : <<use>> genera consecutivo PAC

UI_Salida ..> Srv_Tarifas : <<use>> calcula permanencia y gracia
UI_Salida ..> Srv_SalidaCobro : <<use>> verifica novedades abiertas
UI_Pago ..> Srv_SalidaCobro : <<use>> asienta recaudo multicanal
UI_Recibo ..> Srv_SalidaCobro : <<use>> emite comprobante fiscal

Srv_Entrada ..> Repo_Vehiculo : <<use>> consulta / guarda vehículo
Srv_Entrada ..> Repo_Entrada : <<use>> crea estancia activa (RN-01)
Srv_Celdas ..> Repo_Celda : <<use>> bloquea y actualiza estado
Srv_Tarifas ..> Repo_Tarifa : <<use>> consulta tarifas vigentes
Srv_SalidaCobro ..> Repo_Pago : <<use>> inserta pago inmutable
Srv_SalidaCobro ..> Repo_Entrada : <<use>> cierra estancia y libera celda
Srv_Mensualistas ..> Repo_Mensualista : <<use>> verifica vigencia de abono

Repo_Vehiculo --> TBL_Vehiculos : SQL DML
Repo_Entrada --> TBL_Entradas : SQL DML
Repo_Celda --> TBL_Celdas : SQL DML
Repo_Tarifa --> TBL_Tarifas : SQL DML
Repo_Pago --> TBL_Pagos : SQL DML
Repo_Mensualista --> TBL_Usuarios : SQL DML
Repo_Mensualista --> TBL_Suscripciones : SQL DML
@enduml`;

  const handleCopyPlantUml = () => {
    navigator.clipboard.writeText(plantUmlArchitectureCode);
    setCopiedPlantUml(true);
    setTimeout(() => setCopiedPlantUml(false), 3000);
  };

  const handleDownloadSvg = () => {
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', '/Diagrama_Arquitectura_Capas_Parqueadero.svg');
    downloadAnchor.setAttribute('download', 'Diagrama_Arquitectura_Capas_Parqueadero.svg');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    setDownloadSuccess('¡Diagrama vectorial SVG descargado!');
    setTimeout(() => setDownloadSuccess(null), 4000);
  };

  const handleDownloadMdj = () => {
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', '/ParqueaderoAutosColombia_Arquitectura.mdj');
    downloadAnchor.setAttribute('download', 'ParqueaderoAutosColombia_Arquitectura.mdj');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    setDownloadSuccess('¡Proyecto nativo de StarUML (.mdj) descargado!');
    setTimeout(() => setDownloadSuccess(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Banner de Explicación de Arquitectura de Software */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-lg p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold">
              <Layers className="w-3.5 h-3.5" />
              <span>Arquitectura Multicapa (N-Tier Architecture Pattern) · Estándar StarUML</span>
            </div>
            <h2 className="text-xl font-bold tracking-tight text-white">
              Diagrama de Arquitectura del Sistema (4 Capas Desacopladas)
            </h2>
            <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
              Cumpliendo a cabalidad con la especificación de ingeniería de software, este diagrama no es un flujo de procesos ni un diagrama de clases del dominio: modela la <strong>estructura arquitectónica de componentes</strong> organizada en 4 niveles de abstracción con contratos unidireccionales de comunicación.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 self-start lg:self-auto">
            <button
              onClick={handleDownloadSvg}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-900 bg-white hover:bg-slate-100 rounded-md transition-colors shadow-xs cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-indigo-600" />
              <span>Descargar SVG Vectorial</span>
            </button>
            <button
              onClick={handleDownloadMdj}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-md transition-colors shadow-xs cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Descargar StarUML (.mdj)</span>
            </button>
          </div>
        </div>

        {downloadSuccess && (
          <div className="mt-4 p-2.5 bg-emerald-500/20 border border-emerald-400/40 rounded text-xs text-emerald-200 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{downloadSuccess}</span>
          </div>
        )}
      </div>

      {/* Rúbrica de los 5 Criterios de Arquitectura */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3.5 text-xs space-y-1">
          <div className="flex items-center gap-1.5 font-bold text-blue-900">
            <Monitor className="w-4 h-4 text-blue-600" />
            <span>1. Presentación</span>
          </div>
          <p className="text-blue-800 text-[11px] leading-snug">
            Interfaces gráficas del <strong>Operador</strong> (entrada, inspección, aforo) y del <strong>Cajero</strong> (salida, liquidación, recibos).
          </p>
        </div>

        <div className="bg-purple-50 border border-purple-200 rounded-lg p-3.5 text-xs space-y-1">
          <div className="flex items-center gap-1.5 font-bold text-purple-900">
            <Cpu className="w-4 h-4 text-purple-600" />
            <span>2. Lógica de Negocio</span>
          </div>
          <p className="text-purple-800 text-[11px] leading-snug">
            Validaciones RUNT, motor tarifario, <strong>cálculo de permanencia</strong>, gracia de 15 min y topografía de bahías.
          </p>
        </div>

        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3.5 text-xs space-y-1">
          <div className="flex items-center gap-1.5 font-bold text-emerald-900">
            <Layers className="w-4 h-4 text-emerald-600" />
            <span>3. Acceso a Datos</span>
          </div>
          <p className="text-emerald-800 text-[11px] leading-snug">
            Patrón <strong>Repository / DAO</strong> que aísla las consultas, transacciones ACID y mapeo relacional.
          </p>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3.5 text-xs space-y-1">
          <div className="flex items-center gap-1.5 font-bold text-amber-900">
            <Database className="w-4 h-4 text-amber-600" />
            <span>4. Base de Datos</span>
          </div>
          <p className="text-amber-800 text-[11px] leading-snug">
            8 Tablas físicas relacionales en <strong>PostgreSQL / MySQL</strong> con llaves primarias, foráneas e índices.
          </p>
        </div>

        <div className="bg-slate-100 border border-slate-300 rounded-lg p-3.5 text-xs space-y-1">
          <div className="flex items-center gap-1.5 font-bold text-slate-900">
            <ArrowDown className="w-4 h-4 text-slate-700" />
            <span>5. Comunicación</span>
          </div>
          <p className="text-slate-700 text-[11px] leading-snug">
            Dependencias unidireccionales <code>«use»</code> que evitan acoplamiento cíclico e inversión de control.
          </p>
        </div>
      </div>

      {/* Visor del Diagrama Vectorial SVG */}
      <div className="bg-white border border-slate-200 rounded-lg p-4 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-slate-500" />
            <h3 className="text-sm font-bold text-slate-900">
              Vista del Diagrama de Arquitectura Vectorial (Renderizado SVG en Alta Resolución)
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyPlantUml}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded transition-colors cursor-pointer"
              title="Copiar código fuente PlantUML compatible"
            >
              <Copy className="w-3 h-3" />
              <span>{copiedPlantUml ? '¡PlantUML Copiado!' : 'Copiar PlantUML'}</span>
            </button>
            <a
              href="/Diagrama_Arquitectura_Capas_Parqueadero.svg"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded transition-colors"
            >
              <ExternalLink className="w-3 h-3" />
              <span>Abrir en Pestaña Completa</span>
            </a>
          </div>
        </div>

        {/* Contenedor SVG Responsivo */}
        <div className="w-full overflow-x-auto bg-slate-50 border border-slate-200 rounded-lg p-2 flex justify-center">
          <img 
            src="/Diagrama_Arquitectura_Capas_Parqueadero.svg" 
            alt="Diagrama de Arquitectura del Sistema - Parqueadero Autos Colombia"
            className="w-full max-w-[1340px] h-auto rounded shadow-xs"
          />
        </div>
      </div>

      {/* Desglose Explicativo de Cada Capa */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Capa 1 y 2 */}
        <div className="bg-white border border-slate-200 rounded-lg p-5 space-y-3">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
            <Monitor className="w-4 h-4 text-blue-600" />
            <span>Capa 1: Presentación & Interfaces Humanas</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Aísla las interfaces de interacción directa con el personal de la empresa:
          </p>
          <ul className="text-xs text-slate-700 space-y-1.5 list-disc list-inside">
            <li><strong>Interfaces del Operador:</strong> Modal de captura de placa RUNT con formateo asistido, mapa visual de bahías zonificadas (Zona A, B y C) y emisión de ticket térmico numerado.</li>
            <li><strong>Interfaces del Cajero:</strong> Buscador reactivo por placa o consecutivo, visualizador de tiempo acumulado con desglose de liquidación y panel de cobro multicanal con calculadora de devuelta.</li>
          </ul>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-5 space-y-3">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
            <Cpu className="w-4 h-4 text-purple-600" />
            <span>Capa 2: Lógica de Negocio & Algoritmos</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Encapsula los algoritmos y las políticas legales y comerciales del negocio:
          </p>
          <ul className="text-xs text-slate-700 space-y-1.5 list-disc list-inside">
            <li><strong>ValidadorEntradaVehicular:</strong> Comprueba que no existan placas duplicadas activas en patio (Regla RN-01) y asocia contratos de mensualidad.</li>
            <li><strong>MotorTarifasLiquidacion:</strong> Calcula la permanencia exacta, aplica el periodo de gracia legal de 15 minutos (Regla RN-09) y liquida fracciones horarias según la tipología vehicular.</li>
            <li><strong>GestorSalidaCobro:</strong> Verifica novedades no atendidas y garantiza que el monto pagado cubra la estancia.</li>
          </ul>
        </div>

        {/* Capa 3 y 4 */}
        <div className="bg-white border border-slate-200 rounded-lg p-5 space-y-3">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
            <Layers className="w-4 h-4 text-emerald-600" />
            <span>Capa 3: Acceso a Datos (DAOs / Repositorios)</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Implementa el patrón Repository para desacoplar el dominio del motor de base de datos:
          </p>
          <ul className="text-xs text-slate-700 space-y-1.5 list-disc list-inside">
            <li><strong>EntradaVehiculoRepository:</strong> Administra las transacciones concurrentes de apertura y cierre de estancia.</li>
            <li><strong>CeldaParqueoRepository:</strong> Realiza bloqueos pesimistas para impedir que dos operadores asignen la misma bahía simultáneamente.</li>
            <li><strong>PagoRepository:</strong> Garantiza la inmutabilidad de los registros fiscales de caja para auditoría de recaudo.</li>
          </ul>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-5 space-y-3">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
            <Database className="w-4 h-4 text-amber-600" />
            <span>Capa 4: Base de Datos Relacional (Física)</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Almacena persistentemente los datos en tercera forma normal (3FN):
          </p>
          <ul className="text-xs text-slate-700 space-y-1.5 list-disc list-inside">
            <li><strong>Integridad Referencial:</strong> Llaves foráneas (`FOREIGN KEY`) entre estancias, pagos, celdas y vehículos.</li>
            <li><strong>Restricciones `CHECK`:</strong> Validaciones a nivel de motor (valores no negativos, fechas consistentes y estados finitos).</li>
            <li><strong>Índices B-Tree:</strong> Optimizaciones de búsqueda sobre placa, número de ticket y fechas de corte.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
