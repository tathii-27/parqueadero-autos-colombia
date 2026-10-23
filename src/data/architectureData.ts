export interface UMLClass {
  name: string;
  stereotype?: string;
  package: string;
  description: string;
  attributes: {
    visibility: '+' | '-' | '#';
    name: string;
    type: string;
    description: string;
  }[];
  methods: {
    visibility: '+' | '-' | '#';
    name: string;
    params: string;
    returnType: string;
    description: string;
  }[];
  relationships: {
    type: 'Composición' | 'Agregación' | 'Asociación' | 'Generalización' | 'Dependencia';
    target: string;
    multiplicity: string;
    description: string;
  }[];
}

export const ARCHITECTURE_LAYERS = [
  {
    id: 'PRESENTATION',
    name: '1. Capa de Presentación (UI & Componentes React)',
    description: 'Interfaces de usuario ergonómicas, modales interactivos y visualizadores adaptativos.',
    elements: [
      { name: 'LiveOperationsView', type: 'View Component', desc: 'Monitoreo de vehículos activos en patio y contador de aforo.' },
      { name: 'EntryModal', type: 'Form Controller Component', desc: 'Captura y validación de placas, selección de celda e inspección inicial.' },
      { name: 'ExitModal', type: 'Form Controller Component', desc: 'Búsqueda de vehículo, liquidación de tiempos, cobro y devuelta.' },
      { name: 'CellsView', type: 'Interactive Bay Map Component', desc: 'Mapa topográfico de celdas por zonas (A, B y C) y estados.' },
      { name: 'UsersView', type: 'Master-Detail View', desc: 'Directorio de mensualistas, contratos y renovación de suscripciones.' },
      { name: 'IncidentsView', type: 'Log & Resolution View', desc: 'Registro y seguimiento del libro de novedades e incidencias de patio.' },
      { name: 'PaymentsView', type: 'Cashier View', desc: 'Libro diario contable, arqueo de caja y reimpresión de comprobantes.' },
      { name: 'TicketPrintModal', type: 'ESC/POS Print Component', desc: 'Plantilla de impresión térmica conforme a la Ley 1480 de 2011.' }
    ]
  },
  {
    id: 'SERVICES',
    name: '2. Capa de Lógica de Negocio y Controladores (Business & Service Layer)',
    description: 'Servicios de dominio que orquestan las transacciones, validaciones de reglas de negocio y cálculo tarifario.',
    elements: [
      { name: 'ParkingController', type: 'Facade / Controller', desc: 'Punto de entrada unificado para operaciones vehiculares.' },
      { name: 'VehicleEntryService', type: 'Domain Service', desc: 'Valida reglas RN-01 a RN-03, unicidad de placa y emite tickets.' },
      { name: 'VehicleExitService', type: 'Domain Service', desc: 'Calcula permanencia, evalúa tiempo de gracia y orquesta la liberación.' },
      { name: 'BillingRateService', type: 'Domain Service', desc: 'Calcula montos a cobrar por horas, fracciones o aplica tarifa $0 a mensualistas.' },
      { name: 'CellAllocationService', type: 'Domain Service', desc: 'Algoritmo de asignación inteligente de celdas según dimensiones y reservas.' },
      { name: 'SubscriptionManager', type: 'Domain Service', desc: 'Gestor del ciclo de vida de contratos mensuales, fechas de corte y renovaciones.' },
      { name: 'IncidentManager', type: 'Domain Service', desc: 'Registra novedades de custodia, severidad y acuerdos de resolución.' }
    ]
  },
  {
    id: 'DOMAIN',
    name: '3. Capa de Dominio y Entidades (Domain Entity Layer)',
    description: 'Entidades y objetos de valor del negocio con identidad y estados.',
    elements: [
      { name: 'Vehiculo (Entity)', type: 'Class', desc: 'Representa el automotor con placa, marca, modelo, color y tipología.' },
      { name: 'EntradaVehiculo (Entity)', type: 'Class', desc: 'Registro de ingreso con ticket consecutivo, timestamp y notas de inspección.' },
      { name: 'CeldaParqueo (Entity)', type: 'Class', desc: 'Espacio físico con código, zona, tipo permitido y estado operativo.' },
      { name: 'UsuarioMensualista (Entity)', type: 'Class', desc: 'Cliente abonado con datos fiscales, contrato y celda reservada.' },
      { name: 'SuscripcionMensual (Value Object)', type: 'Class', desc: 'Vigencia de contrato, canon pactado y estado (Al Día / Vencida).' },
      { name: 'NovedadVehiculo (Entity)', type: 'Class', desc: 'Incidencia ocurrida sobre un vehículo con código NOV, severidad y estado.' },
      { name: 'Pago (Entity)', type: 'Class', desc: 'Transacción financiera con consecutivo REC, medio de pago y monto en COP.' },
      { name: 'ConfiguracionTarifas (Entity)', type: 'Class', desc: 'Tarifario de horas, mensualidades y periodo de gracia institucional.' }
    ]
  },
  {
    id: 'PERSISTENCE',
    name: '4. Capa de Persistencia y Acceso a Datos (Data Access / Repository)',
    description: 'Adaptadores de almacenamiento inmutable, repositorios y exportadores.',
    elements: [
      { name: 'IParkingRepository', type: 'Interface', desc: 'Contrato abstracto para operaciones CRUD y consultas transaccionales.' },
      { name: 'LocalStorageAdapter', type: 'Repository Implementation', desc: 'Persistencia reactiva en navegador con serialización JSON.' },
      { name: 'AuditLogManager', type: 'Repository Service', desc: 'Trazabilidad y registro cronológico inmutable de caja y movimientos.' }
    ]
  }
];

export const UML_CLASSES: UMLClass[] = [
  {
    name: 'Vehiculo',
    package: 'com.autoscolombia.domain',
    description: 'Representa cualquier vehículo que ingresa o se registra en el parqueadero.',
    attributes: [
      { visibility: '-', name: 'placa', type: 'String', description: 'Placa en formato colombiano AAA123 o AAA12D (Identificador único)' },
      { visibility: '-', name: 'tipo', type: 'TipoVehiculo', description: 'AUTOMOVIL | MOTO | CAMIONETA | BICICLETA' },
      { visibility: '-', name: 'marca', type: 'String', description: 'Marca del fabricante' },
      { visibility: '-', name: 'modelo', type: 'String', description: 'Línea y año de fabricación' },
      { visibility: '-', name: 'color', type: 'String', description: 'Color predominante de la carrocería' },
    ],
    methods: [
      { visibility: '+', name: 'validarFormatoPlaca', params: 'placa: String', returnType: 'Boolean', description: 'Valida sintaxis según RUNT' },
      { visibility: '+', name: 'esParticular', params: '', returnType: 'Boolean', description: 'Indica si es servicio particular o público' },
    ],
    relationships: [
      { type: 'Asociación', target: 'EntradaVehiculo', multiplicity: '1..*', description: 'Un vehículo puede tener múltiples registros históricos de entrada' },
      { type: 'Asociación', target: 'NovedadVehiculo', multiplicity: '0..*', description: 'Un vehículo puede tener novedades asociadas' }
    ]
  },
  {
    name: 'EntradaVehiculo',
    package: 'com.autoscolombia.domain',
    description: 'Representa la sesión activa o histórica de permanencia de un vehículo dentro de las instalaciones.',
    attributes: [
      { visibility: '-', name: 'id', type: 'String', description: 'Identificador único' },
      { visibility: '-', name: 'numeroTicket', type: 'String', description: 'Consecutivo fiscal PAC-2026-XXXX' },
      { visibility: '-', name: 'placa', type: 'String', description: 'Placa del vehículo en custodia' },
      { visibility: '-', name: 'tipoVehiculo', type: 'TipoVehiculo', description: 'Tipología para liquidación' },
      { visibility: '-', name: 'tipoServicio', type: 'TipoServicio', description: 'MENSUALIDAD | OCASIONAL' },
      { visibility: '-', name: 'celdaId', type: 'String', description: 'Código de la celda ocupada (ej. A-01)' },
      { visibility: '-', name: 'horaEntrada', type: 'DateTime', description: 'Marca temporal exacta de ingreso' },
      { visibility: '-', name: 'horaSalida', type: 'DateTime?', description: 'Marca temporal de salida (null mientras esté activo)' },
      { visibility: '-', name: 'notasInspeccion', type: 'String?', description: 'Rayones previos o cascos dejados' },
      { visibility: '-', name: 'estado', type: 'EstadoEntrada', description: 'ACTIVO | FINALIZADO' },
      { visibility: '-', name: 'totalMinutos', type: 'Integer?', description: 'Minutos totales calculados al salir' },
      { visibility: '-', name: 'montoLiquidado', type: 'Double?', description: 'Valor total en pesos colombianos' }
    ],
    methods: [
      { visibility: '+', name: 'calcularMinutosTranscurridos', params: 'horaActual: DateTime', returnType: 'Integer', description: 'Calcula tiempo de permanencia' },
      { visibility: '+', name: 'finalizarEstadia', params: 'horaSalida: DateTime, monto: Double', returnType: 'Void', description: 'Cierra el registro y libera celda' },
    ],
    relationships: [
      { type: 'Composición', target: 'Pago', multiplicity: '0..1', description: 'Una salida finalizada genera a lo sumo un registro de Pago' },
      { type: 'Asociación', target: 'CeldaParqueo', multiplicity: '1', description: 'Ocupa exactamente una celda durante su estadía' }
    ]
  },
  {
    name: 'CeldaParqueo',
    package: 'com.autoscolombia.domain',
    description: 'Espacio físico delimitado y demarcado para estacionar un automotor.',
    attributes: [
      { visibility: '-', name: 'id', type: 'String', description: 'Código identificador (ej. A-01, B-03)' },
      { visibility: '-', name: 'zona', type: 'ZonaParqueo', description: 'ZONA_A_AUTOS | ZONA_B_MOTOS | ZONA_C_ESPECIALES' },
      { visibility: '-', name: 'tipoPermitido', type: 'TipoVehiculo', description: 'Tipo de vehículo admitido' },
      { visibility: '-', name: 'estado', type: 'EstadoCelda', description: 'DISPONIBLE | OCUPADA | RESERVADA_MENSUAL | MANTENIMIENTO' },
      { visibility: '-', name: 'placaActual', type: 'String?', description: 'Placa del vehículo que la ocupa actualmente' },
      { visibility: '-', name: 'usuarioReservadoId', type: 'String?', description: 'Id del mensualista con reserva fija' },
      { visibility: '-', name: 'observaciones', type: 'String?', description: 'Motivo de mantenimiento o especificación' }
    ],
    methods: [
      { visibility: '+', name: 'ocupar', params: 'placa: String', returnType: 'Boolean', description: 'Cambia estado a OCUPADA' },
      { visibility: '+', name: 'liberar', params: '', returnType: 'Void', description: 'Retorna a DISPONIBLE o RESERVADA' },
      { visibility: '+', name: 'inhabilitarPorMantenimiento', params: 'motivo: String', returnType: 'Void', description: 'Bloquea la celda para reparaciones' },
    ],
    relationships: [
      { type: 'Asociación', target: 'UsuarioMensualista', multiplicity: '0..1', description: 'Puede estar asignada en exclusividad a un abonado' }
    ]
  },
  {
    name: 'UsuarioMensualista',
    package: 'com.autoscolombia.domain',
    description: 'Cliente abonado titular de un contrato de mensualidad recurrente.',
    attributes: [
      { visibility: '-', name: 'id', type: 'String', description: 'Identificador del cliente' },
      { visibility: '-', name: 'nombreCompleto', type: 'String', description: 'Nombre o razón social' },
      { visibility: '-', name: 'tipoDocumento', type: 'TipoDoc', description: 'CC | CE | NIT | PASAPORTE' },
      { visibility: '-', name: 'numeroDocumento', type: 'String', description: 'Cédula de ciudadanía o NIT' },
      { visibility: '-', name: 'telefono', type: 'String', description: 'Número celular de contacto' },
      { visibility: '-', name: 'email', type: 'String', description: 'Correo electrónico' },
      { visibility: '-', name: 'direccion', type: 'String', description: 'Dirección física de residencia/oficina' },
      { visibility: '-', name: 'celdaAsignadaId', type: 'String?', description: 'Celda fija exclusiva asignada' }
    ],
    methods: [
      { visibility: '+', name: 'tieneMensualidadAlDia', params: '', returnType: 'Boolean', description: 'Verifica si fecha fin >= fecha actual' },
      { visibility: '+', name: 'vincularVehiculo', params: 'v: Vehiculo', returnType: 'Void', description: 'Registra vehículo amparado' },
      { visibility: '+', name: 'renovarContrato', params: 'meses: Integer', returnType: 'Void', description: 'Extiende fecha de corte' }
    ],
    relationships: [
      { type: 'Composición', target: 'SuscripcionMensual', multiplicity: '1', description: 'Posee exactamente un plan de suscripción' },
      { type: 'Agregación', target: 'Vehiculo', multiplicity: '1..*', description: 'Tiene uno o más vehículos matriculados' }
    ]
  },
  {
    name: 'SuscripcionMensual',
    package: 'com.autoscolombia.domain',
    stereotype: 'Value Object',
    description: 'Especificación contractual del plan mensual contratado por el cliente.',
    attributes: [
      { visibility: '-', name: 'fechaInicio', type: 'Date', description: 'Fecha de inicio del periodo' },
      { visibility: '-', name: 'fechaVencimiento', type: 'Date', description: 'Fecha de corte mensual' },
      { visibility: '-', name: 'canonMensual', type: 'Double', description: 'Tarifa acordada en pesos COP' },
      { visibility: '-', name: 'estado', type: 'EstadoSuscripcion', description: 'ACTIVA | POR_VENCER | VENCIDA' },
      { visibility: '-', name: 'nombrePlan', type: 'String', description: 'Ej. Mensualidad 24/7 Carro' }
    ],
    methods: [
      { visibility: '+', name: 'diasParaVencimiento', params: '', returnType: 'Integer', description: 'Retorna días restantes para el corte' },
      { visibility: '+', name: 'estaVencida', params: '', returnType: 'Boolean', description: 'Retorna true si superó fecha corte' }
    ],
    relationships: []
  },
  {
    name: 'NovedadVehiculo',
    package: 'com.autoscolombia.domain',
    description: 'Registro formal de incidencias ocurridas sobre un automotor dentro de las instalaciones.',
    attributes: [
      { visibility: '-', name: 'id', type: 'String', description: 'Identificador único' },
      { visibility: '-', name: 'codigo', type: 'String', description: 'Consecutivo NOV-XXX' },
      { visibility: '-', name: 'placa', type: 'String', description: 'Placa del vehículo afectado' },
      { visibility: '-', name: 'celdaId', type: 'String?', description: 'Celda donde ocurrió la novedad' },
      { visibility: '-', name: 'tipo', type: 'TipoNovedad', description: 'RAYON_GOLPE | FUGA_LIQUIDOS | LUCES_ENCENDIDAS | ALARMA_ACTIVA | etc.' },
      { visibility: '-', name: 'severidad', type: 'Severidad', description: 'BAJA | MEDIA | ALTA' },
      { visibility: '-', name: 'descripcion', type: 'String', description: 'Detalle circunstancial del hecho' },
      { visibility: '-', name: 'reportadoPor', type: 'String', description: 'Nombre del operador o vigilante' },
      { visibility: '-', name: 'fechaReporte', type: 'DateTime', description: 'Timestamp del suceso' },
      { visibility: '-', name: 'estado', type: 'EstadoNovedad', description: 'PENDIENTE | NOTIFICADO | RESUELTA' },
      { visibility: '-', name: 'notasResolucion', type: 'String?', description: 'Acción tomada o acuerdo con el cliente' }
    ],
    methods: [
      { visibility: '+', name: 'notificarPropietario', params: 'telefono: String', returnType: 'Void', description: 'Registra aviso al dueño' },
      { visibility: '+', name: 'resolver', params: 'solucion: String', returnType: 'Void', description: 'Cierra formalmente la novedad' }
    ],
    relationships: []
  },
  {
    name: 'Pago',
    package: 'com.autoscolombia.domain',
    description: 'Asiento contable inmutable de un recaudo de dinero en caja.',
    attributes: [
      { visibility: '-', name: 'id', type: 'String', description: 'Identificador único' },
      { visibility: '-', name: 'numeroRecibo', type: 'String', description: 'Consecutivo fiscal REC-XXXXXX' },
      { visibility: '-', name: 'fecha', type: 'DateTime', description: 'Momento de la transacción' },
      { visibility: '-', name: 'concepto', type: 'ConceptoPago', description: 'MENSUALIDAD | PARQUEO_OCASIONAL | SERVICIO_EXTRA' },
      { visibility: '-', name: 'monto', type: 'Double', description: 'Valor recaudado en COP' },
      { visibility: '-', name: 'medioPago', type: 'MedioPago', description: 'EFECTIVO | NEQUI | DAVIPLATA | TARJETA_DEBITO | TARJETA_CREDITO | TRANSFERENCIA' },
      { visibility: '-', name: 'placa', type: 'String?', description: 'Vehículo asociado si aplica' },
      { visibility: '-', name: 'nombreCliente', type: 'String', description: 'Pagador o Consumidor Final' },
      { visibility: '-', name: 'documentoCliente', type: 'String', description: 'C.C. o NIT' },
      { visibility: '-', name: 'cajero', type: 'String', description: 'Operador responsable de turno' }
    ],
    methods: [
      { visibility: '+', name: 'generarComprobanteImprimible', params: '', returnType: 'String', description: 'Formatea ticket térmico' }
    ],
    relationships: []
  }
];

export const STARUML_MDJ_JSON = {
  "_type": "Project",
  "_id": "AAAAAAF8AutosColombiaProj",
  "name": "Parqueadero Autos Colombia - Arquitectura del Sistema",
  "ownedElements": [
    {
      "_type": "UMLModel",
      "_id": "AAAAAAF8ModelArchitecture",
      "_parent": { "$ref": "AAAAAAF8AutosColombiaProj" },
      "name": "Modelo Arquitectural del Sistema",
      "ownedElements": [
        {
          "_type": "UMLClassDiagram",
          "_id": "AAAAAAF8DiagramClasesPrincipal",
          "_parent": { "$ref": "AAAAAAF8ModelArchitecture" },
          "name": "Diagrama de Clases del Dominio",
          "visible": true,
          "defaultDiagram": true
        },
        {
          "_type": "UMLClass",
          "_id": "AAAAAAF8ClassVehiculo",
          "_parent": { "$ref": "AAAAAAF8ModelArchitecture" },
          "name": "Vehiculo",
          "attributes": [
            { "_type": "UMLAttribute", "_id": "A1_placa", "name": "placa", "visibility": "private", "type": "String" },
            { "_type": "UMLAttribute", "_id": "A1_tipo", "name": "tipo", "visibility": "private", "type": "TipoVehiculo" },
            { "_type": "UMLAttribute", "_id": "A1_marca", "name": "marca", "visibility": "private", "type": "String" },
            { "_type": "UMLAttribute", "_id": "A1_modelo", "name": "modelo", "visibility": "private", "type": "String" },
            { "_type": "UMLAttribute", "_id": "A1_color", "name": "color", "visibility": "private", "type": "String" }
          ],
          "operations": [
            { "_type": "UMLOperation", "_id": "O1_val", "name": "validarFormatoPlaca", "parameters": [{ "_type": "UMLParameter", "name": "placa", "type": "String" }], "returnType": "Boolean" },
            { "_type": "UMLOperation", "_id": "O1_part", "name": "esParticular", "returnType": "Boolean" }
          ]
        },
        {
          "_type": "UMLClass",
          "_id": "AAAAAAF8ClassEntrada",
          "_parent": { "$ref": "AAAAAAF8ModelArchitecture" },
          "name": "EntradaVehiculo",
          "attributes": [
            { "_type": "UMLAttribute", "_id": "A2_id", "name": "id", "visibility": "private", "type": "String" },
            { "_type": "UMLAttribute", "_id": "A2_ticket", "name": "numeroTicket", "visibility": "private", "type": "String" },
            { "_type": "UMLAttribute", "_id": "A2_placa", "name": "placa", "visibility": "private", "type": "String" },
            { "_type": "UMLAttribute", "_id": "A2_tipoV", "name": "tipoVehiculo", "visibility": "private", "type": "TipoVehiculo" },
            { "_type": "UMLAttribute", "_id": "A2_tipoS", "name": "tipoServicio", "visibility": "private", "type": "TipoServicio" },
            { "_type": "UMLAttribute", "_id": "A2_celda", "name": "celdaId", "visibility": "private", "type": "String" },
            { "_type": "UMLAttribute", "_id": "A2_hEnt", "name": "horaEntrada", "visibility": "private", "type": "DateTime" },
            { "_type": "UMLAttribute", "_id": "A2_hSal", "name": "horaSalida", "visibility": "private", "type": "DateTime" },
            { "_type": "UMLAttribute", "_id": "A2_notas", "name": "notasInspeccion", "visibility": "private", "type": "String" },
            { "_type": "UMLAttribute", "_id": "A2_est", "name": "estado", "visibility": "private", "type": "String" },
            { "_type": "UMLAttribute", "_id": "A2_min", "name": "totalMinutos", "visibility": "private", "type": "Integer" },
            { "_type": "UMLAttribute", "_id": "A2_monto", "name": "montoLiquidado", "visibility": "private", "type": "Double" }
          ],
          "operations": [
            { "_type": "UMLOperation", "_id": "O2_calc", "name": "calcularMinutosTranscurridos", "parameters": [{ "_type": "UMLParameter", "name": "horaActual", "type": "DateTime" }], "returnType": "Integer" },
            { "_type": "UMLOperation", "_id": "O2_fin", "name": "finalizarEstadia", "parameters": [{ "_type": "UMLParameter", "name": "horaSalida", "type": "DateTime" }, { "_type": "UMLParameter", "name": "monto", "type": "Double" }], "returnType": "Void" }
          ]
        },
        {
          "_type": "UMLClass",
          "_id": "AAAAAAF8ClassCelda",
          "_parent": { "$ref": "AAAAAAF8ModelArchitecture" },
          "name": "CeldaParqueo",
          "attributes": [
            { "_type": "UMLAttribute", "_id": "A3_id", "name": "id", "visibility": "private", "type": "String" },
            { "_type": "UMLAttribute", "_id": "A3_zona", "name": "zona", "visibility": "private", "type": "String" },
            { "_type": "UMLAttribute", "_id": "A3_tipo", "name": "tipoPermitido", "visibility": "private", "type": "TipoVehiculo" },
            { "_type": "UMLAttribute", "_id": "A3_est", "name": "estado", "visibility": "private", "type": "EstadoCelda" },
            { "_type": "UMLAttribute", "_id": "A3_placa", "name": "placaActual", "visibility": "private", "type": "String" },
            { "_type": "UMLAttribute", "_id": "A3_res", "name": "usuarioReservadoId", "visibility": "private", "type": "String" }
          ],
          "operations": [
            { "_type": "UMLOperation", "_id": "O3_oc", "name": "ocupar", "parameters": [{ "_type": "UMLParameter", "name": "placa", "type": "String" }], "returnType": "Boolean" },
            { "_type": "UMLOperation", "_id": "O3_lib", "name": "liberar", "returnType": "Void" },
            { "_type": "UMLOperation", "_id": "O3_mant", "name": "inhabilitarPorMantenimiento", "parameters": [{ "_type": "UMLParameter", "name": "motivo", "type": "String" }], "returnType": "Void" }
          ]
        },
        {
          "_type": "UMLClass",
          "_id": "AAAAAAF8ClassUsuario",
          "_parent": { "$ref": "AAAAAAF8ModelArchitecture" },
          "name": "UsuarioMensualista",
          "attributes": [
            { "_type": "UMLAttribute", "_id": "A4_id", "name": "id", "visibility": "private", "type": "String" },
            { "_type": "UMLAttribute", "_id": "A4_nom", "name": "nombreCompleto", "visibility": "private", "type": "String" },
            { "_type": "UMLAttribute", "_id": "A4_docT", "name": "tipoDocumento", "visibility": "private", "type": "String" },
            { "_type": "UMLAttribute", "_id": "A4_docN", "name": "numeroDocumento", "visibility": "private", "type": "String" },
            { "_type": "UMLAttribute", "_id": "A4_tel", "name": "telefono", "visibility": "private", "type": "String" },
            { "_type": "UMLAttribute", "_id": "A4_email", "name": "email", "visibility": "private", "type": "String" },
            { "_type": "UMLAttribute", "_id": "A4_celda", "name": "celdaAsignadaId", "visibility": "private", "type": "String" }
          ],
          "operations": [
            { "_type": "UMLOperation", "_id": "O4_dia", "name": "tieneMensualidadAlDia", "returnType": "Boolean" },
            { "_type": "UMLOperation", "_id": "O4_vinc", "name": "vincularVehiculo", "parameters": [{ "_type": "UMLParameter", "name": "v", "type": "Vehiculo" }], "returnType": "Void" },
            { "_type": "UMLOperation", "_id": "O4_ren", "name": "renovarContrato", "parameters": [{ "_type": "UMLParameter", "name": "meses", "type": "Integer" }], "returnType": "Void" }
          ]
        },
        {
          "_type": "UMLClass",
          "_id": "AAAAAAF8ClassSuscripcion",
          "_parent": { "$ref": "AAAAAAF8ModelArchitecture" },
          "name": "SuscripcionMensual",
          "attributes": [
            { "_type": "UMLAttribute", "_id": "A5_ini", "name": "fechaInicio", "visibility": "private", "type": "Date" },
            { "_type": "UMLAttribute", "_id": "A5_venc", "name": "fechaVencimiento", "visibility": "private", "type": "Date" },
            { "_type": "UMLAttribute", "_id": "A5_canon", "name": "canonMensual", "visibility": "private", "type": "Double" },
            { "_type": "UMLAttribute", "_id": "A5_est", "name": "estado", "visibility": "private", "type": "String" }
          ],
          "operations": [
            { "_type": "UMLOperation", "_id": "O5_dias", "name": "diasParaVencimiento", "returnType": "Integer" },
            { "_type": "UMLOperation", "_id": "O5_venc", "name": "estaVencida", "returnType": "Boolean" }
          ]
        },
        {
          "_type": "UMLClass",
          "_id": "AAAAAAF8ClassNovedad",
          "_parent": { "$ref": "AAAAAAF8ModelArchitecture" },
          "name": "NovedadVehiculo",
          "attributes": [
            { "_type": "UMLAttribute", "_id": "A6_id", "name": "id", "visibility": "private", "type": "String" },
            { "_type": "UMLAttribute", "_id": "A6_cod", "name": "codigo", "visibility": "private", "type": "String" },
            { "_type": "UMLAttribute", "_id": "A6_placa", "name": "placa", "visibility": "private", "type": "String" },
            { "_type": "UMLAttribute", "_id": "A6_tipo", "name": "tipo", "visibility": "private", "type": "String" },
            { "_type": "UMLAttribute", "_id": "A6_sev", "name": "severidad", "visibility": "private", "type": "String" },
            { "_type": "UMLAttribute", "_id": "A6_desc", "name": "descripcion", "visibility": "private", "type": "String" },
            { "_type": "UMLAttribute", "_id": "A6_est", "name": "estado", "visibility": "private", "type": "String" }
          ],
          "operations": [
            { "_type": "UMLOperation", "_id": "O6_not", "name": "notificarPropietario", "parameters": [{ "_type": "UMLParameter", "name": "telefono", "type": "String" }], "returnType": "Void" },
            { "_type": "UMLOperation", "_id": "O6_res", "name": "resolver", "parameters": [{ "_type": "UMLParameter", "name": "solucion", "type": "String" }], "returnType": "Void" }
          ]
        },
        {
          "_type": "UMLClass",
          "_id": "AAAAAAF8ClassPago",
          "_parent": { "$ref": "AAAAAAF8ModelArchitecture" },
          "name": "Pago",
          "attributes": [
            { "_type": "UMLAttribute", "_id": "A7_id", "name": "id", "visibility": "private", "type": "String" },
            { "_type": "UMLAttribute", "_id": "A7_rec", "name": "numeroRecibo", "visibility": "private", "type": "String" },
            { "_type": "UMLAttribute", "_id": "A7_fec", "name": "fecha", "visibility": "private", "type": "DateTime" },
            { "_type": "UMLAttribute", "_id": "A7_con", "name": "concepto", "visibility": "private", "type": "String" },
            { "_type": "UMLAttribute", "_id": "A7_mon", "name": "monto", "visibility": "private", "type": "Double" },
            { "_type": "UMLAttribute", "_id": "A7_med", "name": "medioPago", "visibility": "private", "type": "String" },
            { "_type": "UMLAttribute", "_id": "A7_caj", "name": "cajero", "visibility": "private", "type": "String" }
          ],
          "operations": [
            { "_type": "UMLOperation", "_id": "O7_comp", "name": "generarComprobanteImprimible", "returnType": "String" }
          ]
        }
      ]
    }
  ]
};

export const PLANTUML_CLASS_CODE = `@startuml
title Parqueadero Autos Colombia - Diagrama de Clases del Dominio (StarUML)
skinparam classAttributeIconSize 0
skinparam monochrome false
skinparam roundcorner 8
skinparam shadowing true

package "com.autoscolombia.domain" {
  
  enum TipoVehiculo {
    AUTOMOVIL
    MOTO
    CAMIONETA
    BICICLETA
  }

  enum EstadoCelda {
    DISPONIBLE
    OCUPADA
    RESERVADA_MENSUAL
    MANTENIMIENTO
  }

  enum TipoServicio {
    MENSUALIDAD
    OCASIONAL
  }

  enum MedioPago {
    EFECTIVO
    NEQUI
    DAVIPLATA
    TARJETA_DEBITO
    TARJETA_CREDITO
    TRANSFERENCIA
  }

  class Vehiculo {
    - placa : String
    - tipo : TipoVehiculo
    - marca : String
    - modelo : String
    - color : String
    + validarFormatoPlaca(placa: String) : Boolean
    + esParticular() : Boolean
  }

  class EntradaVehiculo {
    - id : String
    - numeroTicket : String
    - placa : String
    - tipoVehiculo : TipoVehiculo
    - tipoServicio : TipoServicio
    - celdaId : String
    - horaEntrada : DateTime
    - horaSalida : DateTime
    - notasInspeccion : String
    - estado : String
    - totalMinutos : Integer
    - montoLiquidado : Double
    + calcularMinutosTranscurridos(horaActual: DateTime) : Integer
    + finalizarEstadia(horaSalida: DateTime, monto: Double) : Void
  }

  class CeldaParqueo {
    - id : String
    - zona : String
    - tipoPermitido : TipoVehiculo
    - estado : EstadoCelda
    - placaActual : String
    - usuarioReservadoId : String
    - observaciones : String
    + ocupar(placa: String) : Boolean
    + liberar() : Void
    + inhabilitarPorMantenimiento(motivo: String) : Void
  }

  class UsuarioMensualista {
    - id : String
    - nombreCompleto : String
    - tipoDocumento : String
    - numeroDocumento : String
    - telefono : String
    - email : String
    - direccion : String
    - celdaAsignadaId : String
    + tieneMensualidadAlDia() : Boolean
    + vincularVehiculo(v: Vehiculo) : Void
    + renovarContrato(meses: Integer) : Void
  }

  class SuscripcionMensual <<Value Object>> {
    - fechaInicio : Date
    - fechaVencimiento : Date
    - canonMensual : Double
    - estado : String
    - nombrePlan : String
    + diasParaVencimiento() : Integer
    + estaVencida() : Boolean
  }

  class NovedadVehiculo {
    - id : String
    - codigo : String
    - placa : String
    - celdaId : String
    - tipo : String
    - severidad : String
    - descripcion : String
    - reportadoPor : String
    - fechaReporte : DateTime
    - estado : String
    - notasResolucion : String
    + notificarPropietario(telefono: String) : Void
    + resolver(solucion: String) : Void
  }

  class Pago {
    - id : String
    - numeroRecibo : String
    - fecha : DateTime
    - concepto : String
    - monto : Double
    - medioPago : MedioPago
    - placa : String
    - nombreCliente : String
    - documentoCliente : String
    - cajero : String
    + generarComprobanteImprimible() : String
  }

  Vehiculo "1" <-- "1..*" EntradaVehiculo : registra ingreso
  Vehiculo "1" <-- "0..*" NovedadVehiculo : documenta
  UsuarioMensualista "1" *-- "1" SuscripcionMensual : posee
  UsuarioMensualista "1" o-- "1..*" Vehiculo : es propietario
  UsuarioMensualista "0..1" --> "0..1" CeldaParqueo : tiene asignada
  EntradaVehiculo "1" --> "1" CeldaParqueo : asigna espacio
  EntradaVehiculo "1" *-- "0..1" Pago : cancela al salir
}

@enduml`;

export const SEQUENCE_ENTRADA_CODE = `@startuml
title Secuencia: Registro y Validación de Entrada de Vehículo (RF-ES-01, HU-01, HU-02)
autonumber
actor Operador
boundary EntryModalUI as "UI Entrada (React)"
control ParkingController as "ParkingController"
participant SubscriptionService as "SubscriptionService"
participant CellAllocationService as "CellAllocationService"
entity EntradaVehiculo as "Entrada:EntradaVehiculo"
entity CeldaParqueo as "Celda:CeldaParqueo"
database Storage as "LocalStorage / DB"

Operador -> EntryModalUI : Digita placa del vehículo ("HNE612")
activate EntryModalUI
EntryModalUI -> ParkingController : verificarPlaca("HNE612")
activate ParkingController
ParkingController -> Storage : consultarVehiculoActivo("HNE612")
alt Vehículo ya está activo en patio
  Storage --> ParkingController : existe = true
  ParkingController --> EntryModalUI : Error: "Vehículo ya registrado en patio"
else Vehículo no está en patio
  ParkingController -> SubscriptionService : verificarAbonado("HNE612")
  activate SubscriptionService
  alt Es Mensualista Al Día
    SubscriptionService --> ParkingController : { esMensualista: true, cliente: CarlosRestrepo, celdaFija: "A-01" }
    ParkingController --> EntryModalUI : Sugerir Mensualidad ($0 COP) y Celda "A-01"
  else Es Ocasional
    SubscriptionService --> ParkingController : esMensualista = false
    ParkingController -> CellAllocationService : obtenerCeldasLibres(tipoVehiculo)
    activate CellAllocationService
    CellAllocationService --> ParkingController : listaCeldasDisponibles[]
    deactivate CellAllocationService
    ParkingController --> EntryModalUI : Mostrar celdas libres y tarifas por hora
  end
  deactivate SubscriptionService
end
deactivate ParkingController

Operador -> EntryModalUI : Confirma registro y añade notas de inspección
EntryModalUI -> ParkingController : registrarEntrada(datosEntrada)
activate ParkingController
ParkingController -> EntradaVehiculo : create(placa, celdaId, timestamp, notas)
activate EntradaVehiculo
EntradaVehiculo --> ParkingController : entradaInstancia
deactivate EntradaVehiculo

ParkingController -> CeldaParqueo : ocupar(placa)
activate CeldaParqueo
CeldaParqueo --> ParkingController : estado = "OCUPADA"
deactivate CeldaParqueo

ParkingController -> Storage : guardar(entradaInstancia, celdaActualizada)
Storage --> ParkingController : ok

ParkingController --> EntryModalUI : Ticket Generado (PAC-2026-XXXX)
deactivate ParkingController
EntryModalUI --> Operador : Muestra e imprime Ticket de Ingreso
deactivate EntryModalUI
@enduml`;

export const SEQUENCE_SALIDA_CODE = `@startuml
title Secuencia: Registro de Salida, Liquidación y Cobro (RF-ES-06, RF-ES-07, RF-ES-08)
autonumber
actor Cajero
boundary ExitModalUI as "UI Salida (React)"
control ParkingController as "ParkingController"
participant BillingRateService as "BillingRateService"
entity EntradaVehiculo as "Entrada:EntradaVehiculo"
entity CeldaParqueo as "Celda:CeldaParqueo"
entity Pago as "Pago:Pago"
database Storage as "LocalStorage / DB"

Cajero -> ExitModalUI : Selecciona vehículo o busca placa ("UQU391")
activate ExitModalUI
ExitModalUI -> ParkingController : cotizarSalida(entryId)
activate ParkingController
ParkingController -> BillingRateService : calcularLiquidacion(horaEntrada, horaActual, tipoVehiculo, esMensualista)
activate BillingRateService

alt Es Mensualista Vigente
  BillingRateService --> ParkingController : { total: $0 COP, motivo: "Mensualidad Amparada" }
else Es Ocasional
  BillingRateService -> BillingRateService : verificarPeriodoGracia(minutos <= 15)
  alt Dentro del periodo de gracia
    BillingRateService --> ParkingController : { total: $0 COP, motivo: "Periodo de Gracia" }
  else Supera periodo de gracia
    BillingRateService -> BillingRateService : liquidarHoras(horasFacturables * tarifaHora)
    BillingRateService --> ParkingController : { total: $12.000 COP, horas: 3 }
  end
end
deactivate BillingRateService

ParkingController --> ExitModalUI : Desglose de cobro liquidado
deactivate ParkingController

Cajero -> ExitModalUI : Selecciona medio de pago (Efectivo/Nequi) y confirma
ExitModalUI -> ParkingController : procesarSalidaYCobro(entryId, medioPago, efectivoRecibido)
activate ParkingController

alt Total > 0
  ParkingController -> Pago : create(reciboConsecutivo, total, medioPago, placa)
  activate Pago
  Pago --> ParkingController : pagoInstancia
  deactivate Pago
end

ParkingController -> EntradaVehiculo : finalizarEstadia(horaSalida, total)
activate EntradaVehiculo
EntradaVehiculo --> ParkingController : estado = "FINALIZADO"
deactivate EntradaVehiculo

ParkingController -> CeldaParqueo : liberar()
activate CeldaParqueo
CeldaParqueo --> ParkingController : estado = "DISPONIBLE" / "RESERVADA"
deactivate CeldaParqueo

ParkingController -> Storage : actualizar(entrada, celda, pago)
Storage --> ParkingController : ok

ParkingController --> ExitModalUI : Salida Exitosa y Recibo de Caja (REC-XXXXXX)
deactivate ParkingController
ExitModalUI --> Cajero : Emite Comprobante Fiscal y abre talanquera
deactivate ExitModalUI
@enduml`;
