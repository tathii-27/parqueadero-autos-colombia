export interface PackageElement {
  name: string;
  type: string;
  description: string;
}

export interface UmlPackage {
  id: string;
  name: string;
  qualifiedName: string;
  layer: string;
  stereotype: string;
  description: string;
  color: {
    bg: string;
    border: string;
    header: string;
    text: string;
    badge: string;
  };
  coords: {
    x: number;
    y: number;
    width: number;
    height: number;
    tabWidth: number;
    tabHeight: number;
  };
  elements: PackageElement[];
  dependencies: {
    targetId: string;
    targetName: string;
    stereotype: '«utiliza»' | '«importa»' | '«accede»';
    reason: string;
  }[];
}

export const UML_PACKAGES_ES: UmlPackage[] = [
  {
    id: 'pkg-presentacion',
    name: 'Presentacion',
    qualifiedName: 'com.autoscolombia.presentacion',
    layer: 'Capa de Presentación',
    stereotype: '«capa»',
    description: 'Interfaces gráficas de usuario, pantallas de patio, modales de ingreso y liquidación, y mapas de celdas.',
    color: {
      bg: '#f0fdf4',
      border: '#16a34a',
      header: '#dcfce7',
      text: '#14532d',
      badge: '#bbf7d0',
    },
    coords: {
      x: 40,
      y: 100,
      width: 300,
      height: 230,
      tabWidth: 140,
      tabHeight: 26,
    },
    elements: [
      { name: 'VistaOperacionesPatio', type: 'Componente Vista', description: 'Monitoreo de aforo, ingresos activos y salida vehicular' },
      { name: 'ModalRegistroIngreso', type: 'Formulario Vista', description: 'Registro de placa con auto-inspección de daños' },
      { name: 'ModalLiquidacionSalida', type: 'Formulario Vista', description: 'Liquidación de estadía, cálculo tarifario y devuelta' },
      { name: 'VistaMapaCeldas', type: 'Mapa Topográfico', description: 'Visualizador de bahías A, B y C con estados operativos' },
      { name: 'VistaGestionMensualistas', type: 'Directorio Vista', description: 'Gestión de abonados mensualistas y contratos' },
      { name: 'VistaLibroNovedades', type: 'Vista de Registro', description: 'Libro de novedades de patio y custodia de vehículos' },
      { name: 'VistaArqueoCajaDiaria', type: 'Vista de Caja', description: 'Arqueo de caja y libro contable de recaudos' },
      { name: 'ModalImpresionComprobante', type: 'Vista de Impresión', description: 'Comprobante térmico ESC/POS conforme a Ley 1480 de 2011' }
    ],
    dependencies: [
      { targetId: 'pkg-controladores', targetName: 'Controladores', stereotype: '«utiliza»', reason: 'Invoca fachadas de control para tramitar acciones del usuario' },
      { targetId: 'pkg-dominio', targetName: 'Dominio', stereotype: '«importa»', reason: 'Consume las entidades del negocio para renderizar tablas y estados' },
      { targetId: 'pkg-transversal', targetName: 'Transversal', stereotype: '«utiliza»', reason: 'Formatea moneda en pesos COP y valida sintaxis RUNT en formularios' }
    ]
  },
  {
    id: 'pkg-controladores',
    name: 'Controladores',
    qualifiedName: 'com.autoscolombia.controladores',
    layer: 'Capa de Controladores',
    stereotype: '«capa»',
    description: 'Fachadas de orquestación que desacoplan las pantallas de usuario de los servicios transaccionales del backend.',
    color: {
      bg: '#eff6ff',
      border: '#2563eb',
      header: '#dbeafe',
      text: '#1e3a8a',
      badge: '#bfdbfe',
    },
    coords: {
      x: 390,
      y: 100,
      width: 290,
      height: 230,
      tabWidth: 140,
      tabHeight: 26,
    },
    elements: [
      { name: 'ControladorParqueadero', type: 'Fachada Controladora', description: 'Punto de entrada unificado para operaciones operativas' },
      { name: 'ControladorCaja', type: 'Fachada Controladora', description: 'Orquestación de caja, pagos y comprobantes fiscales' },
      { name: 'ControladorMensualidades', type: 'Fachada Controladora', description: 'Altas, renovaciones y cancelaciones de contratos' },
      { name: 'ControladorNovedades', type: 'Fachada Controladora', description: 'Gestión del ciclo de vida de incidencias en custodia' },
      { name: 'ControladorAsignacionCeldas', type: 'Fachada Controladora', description: 'Asignación de espacios físicos según dimensiones' }
    ],
    dependencies: [
      { targetId: 'pkg-servicios', targetName: 'Servicios', stereotype: '«utiliza»', reason: 'Delega la ejecución de reglas de negocio en los servicios de dominio' },
      { targetId: 'pkg-dominio', targetName: 'Dominio', stereotype: '«importa»', reason: 'Manipula y retorna entidades del dominio hacia la presentación' },
      { targetId: 'pkg-transversal', targetName: 'Transversal', stereotype: '«utiliza»', reason: 'Aplica constantes de estado y validadores generales' }
    ]
  },
  {
    id: 'pkg-servicios',
    name: 'Servicios',
    qualifiedName: 'com.autoscolombia.servicios',
    layer: 'Capa de Lógica de Negocio',
    stereotype: '«capa»',
    description: 'Servicios de negocio que encapsulan las reglas tarifarias, tiempo de gracia institucional y asignación de celdas.',
    color: {
      bg: '#faf5ff',
      border: '#9333ea',
      header: '#f3e8ff',
      text: '#581c87',
      badge: '#e9d5ff',
    },
    coords: {
      x: 740,
      y: 100,
      width: 300,
      height: 230,
      tabWidth: 130,
      tabHeight: 26,
    },
    elements: [
      { name: 'ServicioIngresoVehiculo', type: 'Servicio de Dominio', description: 'Valida unicidad de placa en patio y asigna celda disponible' },
      { name: 'ServicioSalidaVehiculo', type: 'Servicio de Dominio', description: 'Calcula permanencia exacta, evalúa tiempo de gracia y libera celda' },
      { name: 'ServicioCalculoTarifas', type: 'Servicio de Dominio', description: 'Calcula cobro por minuto/fracción o tarifa $0 para mensualistas' },
      { name: 'ServicioAsignacionCeldas', type: 'Servicio de Dominio', description: 'Algoritmo de asignación según tipo (auto, moto, bici)' },
      { name: 'GestorSuscripciones', type: 'Servicio de Dominio', description: 'Control de fecha de corte y validación de mensualidad activa' },
      { name: 'GestorNovedades', type: 'Servicio de Dominio', description: 'Emisión de alertas por rayones o pertenencias reportadas' }
    ],
    dependencies: [
      { targetId: 'pkg-dominio', targetName: 'Dominio', stereotype: '«utiliza»', reason: 'Aplica métodos sobre entidades ricas del dominio' },
      { targetId: 'pkg-persistencia', targetName: 'Persistencia', stereotype: '«utiliza»', reason: 'Persiste y recupera datos mediante repositorios inmutables' },
      { targetId: 'pkg-transversal', targetName: 'Transversal', stereotype: '«utiliza»', reason: 'Utiliza utilitarios de cálculo y constantes globales' }
    ]
  },
  {
    id: 'pkg-dominio',
    name: 'Dominio',
    qualifiedName: 'com.autoscolombia.dominio',
    layer: 'Capa de Modelo de Dominio',
    stereotype: '«subsistema»',
    description: 'Núcleo del negocio independiente de librerías o bases de datos externas. Contiene entidades y objetos de valor.',
    color: {
      bg: '#fffbeb',
      border: '#d97706',
      header: '#fef3c7',
      text: '#78350f',
      badge: '#fde68a',
    },
    coords: {
      x: 210,
      y: 390,
      width: 320,
      height: 235,
      tabWidth: 130,
      tabHeight: 26,
    },
    elements: [
      { name: 'Vehiculo', type: 'Entidad', description: 'Placa, tipo, marca, modelo, color y validación RUNT' },
      { name: 'EntradaVehiculo', type: 'Raíz de Agregado', description: 'Ticket consecutivo, timestamps de estadía, celda y estado' },
      { name: 'CeldaParqueo', type: 'Entidad', description: 'Código, zona, tipo permitido, estado y reserva' },
      { name: 'UsuarioMensualista', type: 'Entidad', description: 'Documento, nombre, teléfono, correo y celda reservada' },
      { name: 'SuscripcionMensual', type: 'Entidad', description: 'Fechas de vigencia, canon pactado y estado de pago' },
      { name: 'NovedadVehiculo', type: 'Entidad', description: 'Código NOV, severidad, descripción fotográfica y estado' },
      { name: 'Pago', type: 'Objeto de Valor', description: 'Consecutivo REC, medio de pago, monto e IVA' },
      { name: 'ConfiguracionTarifas', type: 'Entidad', description: 'Tarifario de minutos, horas y periodo de gracia institucional' }
    ],
    dependencies: [
      { targetId: 'pkg-transversal', targetName: 'Transversal', stereotype: '«utiliza»', reason: 'Importa tipos enumerados fundamentales (TipoVehiculo, EstadoCelda)' }
    ]
  },
  {
    id: 'pkg-persistencia',
    name: 'Persistencia',
    qualifiedName: 'com.autoscolombia.persistencia',
    layer: 'Capa de Persistencia y Datos',
    stereotype: '«capa»',
    description: 'Adaptadores de almacenamiento persistente, consultas transaccionales ACID y repositorios de datos.',
    color: {
      bg: '#fdf2f8',
      border: '#db2777',
      header: '#fce7f3',
      text: '#831843',
      badge: '#fbcfe8',
    },
    coords: {
      x: 580,
      y: 390,
      width: 320,
      height: 235,
      tabWidth: 140,
      tabHeight: 26,
    },
    elements: [
      { name: '«interface» IRepositorioParqueadero', type: 'Contrato de Repositorio', description: 'Contrato abstracto CRUD para vehículos, entradas y celdas' },
      { name: 'AdaptadorAlmacenamientoLocal', type: 'Implementación Almacén', description: 'Persistencia reactiva en navegador con serialización JSON' },
      { name: 'AdaptadorBaseDatosSql', type: 'Implementación SQL', description: 'Adaptador de base de datos relacional para PostgreSQL 3FN' },
      { name: 'GestorAuditoriaTransaccional', type: 'Servicio de Auditoría', description: 'Trazabilidad inmutable de todas las transacciones de caja' },
      { name: 'CoordinadorTransacciones', type: 'Coordinador ACID', description: 'Garantiza atomicidad en cobro y liberación simultánea' }
    ],
    dependencies: [
      { targetId: 'pkg-dominio', targetName: 'Dominio', stereotype: '«importa»', reason: 'Mapea filas y registros persistentes hacia entidades del dominio' },
      { targetId: 'pkg-transversal', targetName: 'Transversal', stereotype: '«utiliza»', reason: 'Aplica utilidades de serialización y auditoría' }
    ]
  },
  {
    id: 'pkg-transversal',
    name: 'Transversal',
    qualifiedName: 'com.autoscolombia.transversal',
    layer: 'Capa Transversal / Común',
    stereotype: '«transversal»',
    description: 'Componentes transversales compartidos por todas las capas: enums, validadores, formateadores y excepciones.',
    color: {
      bg: '#f8fafc',
      border: '#475569',
      header: '#e2e8f0',
      text: '#0f172a',
      badge: '#cbd5e1',
    },
    coords: {
      x: 390,
      y: 675,
      width: 320,
      height: 165,
      tabWidth: 140,
      tabHeight: 26,
    },
    elements: [
      { name: 'TipoVehiculoEnum', type: 'Enumeración', description: 'AUTOMOVIL | MOTO | CAMIONETA | BICICLETA' },
      { name: 'EstadoCeldaEnum', type: 'Enumeración', description: 'DISPONIBLE | OCUPADA | RESERVADA | MANTENIMIENTO' },
      { name: 'TipoServicioEnum', type: 'Enumeración', description: 'HORAS_MINUTOS | MENSUALIDAD | CONVENIO' },
      { name: 'ValidadorPlacasRunt', type: 'Utilidad', description: 'Expresiones regulares para sintaxis vehicular colombiana' },
      { name: 'FormateadorMonedaCop', type: 'Utilidad', description: 'Formateo estándar de pesos colombianos ($ COP)' }
    ],
    dependencies: []
  }
];

export const PLANTUML_PACKAGE_CODE_ES = `@startuml Diagrama_Paquetes_Parqueadero_Autos_Colombia
!theme plain
skinparam packageStyle rectangle
skinparam roundCorner 8
skinparam shadowing true
skinparam package {
  BackgroundColor<<Presentacion>> #DCFCE7
  BorderColor<<Presentacion>> #16A34A
  BackgroundColor<<Controladores>> #DBEAFE
  BorderColor<<Controladores>> #2563EB
  BackgroundColor<<Servicios>> #F3E8FF
  BorderColor<<Servicios>> #9333EA
  BackgroundColor<<Dominio>> #FEF3C7
  BorderColor<<Dominio>> #D97706
  BackgroundColor<<Persistencia>> #FCE7F3
  BorderColor<<Persistencia>> #DB2777
  BackgroundColor<<Transversal>> #F1F5F9
  BorderColor<<Transversal>> #475569
}

title SISTEMA DE GESTIÓN PARQUEADERO AUTOS COLOMBIA\\nDiagrama de Paquetes Arquitectural (UML 2.5 en Español)

package "com.autoscolombia" {

  package "Presentacion" <<Presentacion>> {
    class VistaOperacionesPatio
    class ModalRegistroIngreso
    class ModalLiquidacionSalida
    class VistaMapaCeldas
    class VistaGestionMensualistas
    class VistaLibroNovedades
    class VistaArqueoCajaDiaria
    class ModalImpresionComprobante
  }

  package "Controladores" <<Controladores>> {
    class ControladorParqueadero
    class ControladorCaja
    class ControladorMensualidades
    class ControladorNovedades
    class ControladorAsignacionCeldas
  }

  package "Servicios" <<Servicios>> {
    class ServicioIngresoVehiculo
    class ServicioSalidaVehiculo
    class ServicioCalculoTarifas
    class ServicioAsignacionCeldas
    class GestorSuscripciones
    class GestorNovedades
  }

  package "Dominio" <<Dominio>> {
    class Vehiculo
    class EntradaVehiculo
    class CeldaParqueo
    class UsuarioMensualista
    class SuscripcionMensual
    class NovedadVehiculo
    class Pago
    class ConfiguracionTarifas
  }

  package "Persistencia" <<Persistencia>> {
    interface IRepositorioParqueadero
    class AdaptadorAlmacenamientoLocal
    class AdaptadorBaseDatosSql
    class GestorAuditoriaTransaccional
    class CoordinadorTransacciones
  }

  package "Transversal" <<Transversal>> {
    enum TipoVehiculoEnum
    enum EstadoCeldaEnum
    enum TipoServicioEnum
    class ValidadorPlacasRunt
    class FormateadorMonedaCop
  }

  ' Dependencias entre paquetes (UML 2.5)
  Presentacion ..> Controladores : <<utiliza>>
  Presentacion ..> Dominio : <<importa>>
  Presentacion ..> Transversal : <<utiliza>>

  Controladores ..> Servicios : <<utiliza>>
  Controladores ..> Dominio : <<importa>>
  Controladores ..> Transversal : <<utiliza>>

  Servicios ..> Dominio : <<utiliza>>
  Servicios ..> Persistencia : <<utiliza>>
  Servicios ..> Transversal : <<utiliza>>

  Persistencia ..> Dominio : <<importa>>
  Persistencia ..> Transversal : <<utiliza>>

  Dominio ..> Transversal : <<utiliza>>
}

footer IU Digital de Antioquia · Estudiante: Tatiana Gallego · StarUML v5.x
@enduml`;

// Aliases
export const UML_PACKAGES = UML_PACKAGES_ES;
export const PLANTUML_PACKAGE_CODE = PLANTUML_PACKAGE_CODE_ES;
