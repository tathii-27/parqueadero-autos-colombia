export interface UseCaseItem {
  id: string;
  name: string;
  module: 'Acceso y Celdas' | 'Facturación y Cobro' | 'Mensualistas' | 'Administración';
  primaryActor: string;
  secondaryActors: string[];
  description: string;
  includes?: string[];
  extendedBy?: string[];
  extendsFrom?: string;
  extensionPoint?: string;
  preconditions: string;
  mainFlow: string[];
  alternativeFlows: string[];
  postconditions: string;
}

export interface UseCaseActor {
  id: string;
  name: string;
  type: 'Humano Principal' | 'Humano Secundario / Supervisor' | 'Externo' | 'Sistema Externo';
  description: string;
  inheritsFrom?: string;
  associatedUseCases: string[];
}

export const USE_CASE_ACTORS: UseCaseActor[] = [
  {
    id: 'ACT_OPERARIO',
    name: 'Operario de Caseta / Cajero',
    type: 'Humano Principal',
    description: 'Personal responsable de registrar el ingreso, asignar celdas, documentar novedades o daños iniciales del vehículo, liquidar tiempos y recibir el pago en taquilla.',
    associatedUseCases: ['CU-01', 'CU-02', 'CU-03', 'CU-04', 'CU-05', 'CU-06', 'CU-07', 'CU-08', 'CU-10']
  },
  {
    id: 'ACT_ADMINISTRADOR',
    name: 'Administrador del Parqueadero',
    type: 'Humano Secundario / Supervisor',
    inheritsFrom: 'ACT_OPERARIO',
    description: 'Supervisor con privilegios elevados. Hereda las funciones operativas y además configura tarifas, audita arqueos de caja, administra mensualistas y supervisa reportes gerenciales.',
    associatedUseCases: ['CU-11', 'CU-12', 'CU-13', 'CU-14', 'CU-15', 'CU-16']
  },
  {
    id: 'ACT_CLIENTE',
    name: 'Cliente Conductor / Mensualista',
    type: 'Externo',
    description: 'Usuario del servicio de estacionamiento que solicita acceso, presenta su vehículo, contrata o renueva abonos mensuales y cancela la tarifa correspondiente.',
    associatedUseCases: ['CU-01', 'CU-06', 'CU-11', 'CU-12']
  },
  {
    id: 'ACT_PASARELA',
    name: 'Pasarela de Pagos / Facturación DIAN',
    type: 'Sistema Externo',
    description: 'Servicio telemático externo que autoriza cobros mediante datáfono/código QR y emite la validación de comprobante fiscal electrónico.',
    associatedUseCases: ['CU-07', 'CU-08']
  }
];

export const USE_CASES_LIST: UseCaseItem[] = [
  // --- MÓDULO 1: ACCESO Y CELDAS ---
  {
    id: 'CU-01',
    name: 'Registrar Ingreso de Vehículo',
    module: 'Acceso y Celdas',
    primaryActor: 'Operario de Caseta / Cajero',
    secondaryActors: ['Cliente Conductor / Mensualista'],
    description: 'Permite registrar la llegada de un vehículo al parqueadero validando placa colombiana, tipología (Carro/Moto) y disponibilidad de aforo.',
    includes: ['CU-02'],
    extendedBy: ['CU-03'],
    preconditions: 'El sistema debe estar en línea y debe existir al menos una celda libre para la tipología del vehículo.',
    mainFlow: [
      '1. El operario ingresa la placa del vehículo (e.g. AAA123).',
      '2. El sistema valida la sintaxis de la placa y verifica que no figure con estancia activa no cerrada.',
      '3. El sistema invoca automáticamente el CU-02 (Asignar Celda de Estacionamiento).',
      '4. El operario confirma el ingreso del automotor.',
      '5. El sistema genera el consecutivo de ticket con fecha, hora exacta y código de barras/QR.',
      '6. Se imprime el ticket de entrada para entrega al conductor.'
    ],
    alternativeFlows: [
      '2a. Placa con estancia previa sin liquidar: El sistema alerta al operario y bloquea el nuevo ingreso hasta auditar el registro anterior.',
      '3a. Aforo al 100% (sin celdas disponibles): El sistema emite advertencia de capacidad colmada y sugiere derivar a lista de espera.',
      '4a. El vehículo presenta golpes, rayones o abolladuras: Se dispara la extensión hacia CU-03 (Registrar Novedad / Daño Previo).'
    ],
    postconditions: 'El vehículo queda registrado con estado EN_CURSO y la celda seleccionada cambia su estado a OCUPADA.'
  },
  {
    id: 'CU-02',
    name: 'Asignar Celda de Estacionamiento',
    module: 'Acceso y Celdas',
    primaryActor: 'Operario de Caseta / Cajero',
    secondaryActors: [],
    description: 'Selecciona una celda física disponible acorde al tipo de vehículo (Zona A para Automóviles, Zona B para Motos o Zona C para Camionetas). Relación <<include>> desde CU-01.',
    preconditions: 'Vehículo en proceso de ingreso con tipología definida.',
    mainFlow: [
      '1. El sistema consulta las celdas disponibles filtradas por tipología y zona.',
      '2. El sistema sugiere la celda óptima más cercana a la bahía de acceso.',
      '3. El operario confirma la celda sugerida o selecciona manualmente una celda alternativa.',
      '4. El sistema vincula la celda al registro de ingreso.'
    ],
    alternativeFlows: [
      '2a. Mensualista con celda reservada: El sistema asigna automáticamente la celda fija contratada.'
    ],
    postconditions: 'La celda queda bloqueada temporalmente para el ingreso en curso.'
  },
  {
    id: 'CU-03',
    name: 'Registrar Novedad / Daño Previo con Fotografía',
    module: 'Acceso y Celdas',
    primaryActor: 'Operario de Caseta / Cajero',
    secondaryActors: [],
    description: 'Permite documentar rayones, golpes, espejos rotos o faltantes preexistentes en el vehículo con foto y descripción pericial. Relación <<extend>> hacia CU-01.',
    extensionPoint: 'Punto de Extensión: Inspección visual al ingresar si se detecta daño físico.',
    extendsFrom: 'CU-01',
    preconditions: 'El vehículo está físicamente en la caseta de acceso y el operario detecta una imperfección.',
    mainFlow: [
      '1. El operario activa la casilla "Registrar Novedad / Daño Previo".',
      '2. Selecciona la zona anatómica del vehículo (Lateral Izquierdo, Frontal, Posterior, etc.).',
      '3. Describe detalladamente la novedad (e.g., "Abolladura de 10cm en puerta delantera izquierda").',
      '4. Adjunta o captura fotografía de respaldo como evidencia digital.',
      '5. El sistema genera el código de novedad NOV-XXXX y lo anexa al ticket de entrada.'
    ],
    alternativeFlows: [
      '4a. Sin cámara digital disponible: El operario registra la descripción textual firmada en observación.'
    ],
    postconditions: 'Queda deslindada la responsabilidad del parqueadero sobre el daño previo reportado.'
  },
  {
    id: 'CU-04',
    name: 'Registrar Salida y Calcular Tiempo Transcurrido',
    module: 'Acceso y Celdas',
    primaryActor: 'Operario de Caseta / Cajero',
    secondaryActors: ['Cliente Conductor / Mensualista'],
    description: 'Localiza el vehículo por placa o ticket, calcula los minutos totales de permanencia y valida si aplica periodo de gracia institucional.',
    includes: ['CU-06'],
    preconditions: 'Vehículo registrado en el sistema con estado EN_CURSO.',
    mainFlow: [
      '1. El operario escanea el ticket o digita la placa del vehículo que egresa.',
      '2. El sistema recupera la fecha y hora de ingreso.',
      '3. El sistema calcula la diferencia horaria en minutos transcurridos.',
      '4. El sistema evalúa si el tiempo es inferior a 15 minutos (Periodo de gracia: costo $0).',
      '5. Si supera el periodo de gracia, se deriva al CU-06 (Liquidar Cobro de Estancia).',
      '6. Una vez completado el pago, el sistema marca la salida y libera la celda.'
    ],
    alternativeFlows: [
      '1a. Ticket extraviado: El operario busca por placa en el padrón activo y aplica procedimiento de validación de propiedad según RN-08.'
    ],
    postconditions: 'La celda queda con estado DISPONIBLE y la estancia se cierra con estado FINALIZADA.'
  },
  {
    id: 'CU-05',
    name: 'Monitorear Celdas en Tiempo Real',
    module: 'Acceso y Celdas',
    primaryActor: 'Operario de Caseta / Cajero',
    secondaryActors: ['Administrador del Parqueadero'],
    description: 'Permite visualizar el mapa topográfico de todas las celdas del parqueadero organizadas por zonas, indicando ocupación y aforo porcentual.',
    preconditions: 'El usuario debe haber iniciado sesión en el sistema.',
    mainFlow: [
      '1. El usuario accede a la pestaña de Celdas.',
      '2. El sistema muestra la grilla con estados (Libre, Ocupada, Reservada, Mantenimiento).',
      '3. El usuario puede filtrar por zona (A, B, C) o tipología permitida (Carros, Motos).'
    ],
    alternativeFlows: [],
    postconditions: 'Visualización actualizada del aforo general.'
  },

  // --- MÓDULO 2: FACTURACIÓN Y COBRO ---
  {
    id: 'CU-06',
    name: 'Liquidar Cobro de Estancia',
    module: 'Facturación y Cobro',
    primaryActor: 'Operario de Caseta / Cajero',
    secondaryActors: [],
    description: 'Aplica el tarifario vigente según tipología vehicular (Tarifa minuto, hora o día completo). Relación <<include>> hacia CU-07 y extensible por CU-09.',
    includes: ['CU-07'],
    extendedBy: ['CU-09'],
    preconditions: 'Tiempo de permanencia calculado superior al periodo de gracia.',
    mainFlow: [
      '1. El sistema consulta la tarifa horaria/minuto según el tipo de vehículo.',
      '2. Calcula el subtotal, redondeo y monto total en pesos colombianos (COP).',
      '3. El sistema invoca al CU-07 (Procesar Transacción de Pago).',
      '4. Se aprueba la liquidación.'
    ],
    alternativeFlows: [
      '2a. Conductor con convenio o mensualidad: Se dispara extensión CU-09 (Aplicar Tarifa Preferencial / Descuento).'
    ],
    postconditions: 'Monto a pagar liquidado y listo para cobro.'
  },
  {
    id: 'CU-07',
    name: 'Procesar Transacción de Pago',
    module: 'Facturación y Cobro',
    primaryActor: 'Operario de Caseta / Cajero',
    secondaryActors: ['Pasarela de Pagos / Facturación DIAN', 'Cliente Conductor / Mensualista'],
    description: 'Recibe el importe pactado a través de Efectivo, Datáfono (Tarjeta Débito/Crédito) o Transferencia QR (Bancolombia/Nequi/Daviplata). Relación <<include>> hacia CU-08.',
    includes: ['CU-08'],
    preconditions: 'Monto liquidado pendiente de pago.',
    mainFlow: [
      '1. El operario consulta el medio de pago al cliente.',
      '2. Si es efectivo: registra valor recibido y el sistema calcula la devuelta exacta.',
      '3. Si es tarjeta: envía monto al datáfono/pasarela externa (ACT_PASARELA) y recibe confirmación.',
      '4. Si es transferencia QR: verifica el comprobante digital bancario.',
      '5. El sistema registra el pago con consecutivo REC-XXXX.',
      '6. Se invoca automáticamente el CU-08 (Emitir Ticket / Factura Electrónica).'
    ],
    alternativeFlows: [
      '3a. Transacción rechazada por el banco: El sistema alerta al operario y solicita un medio de pago alternativo.'
    ],
    postconditions: 'Transacción almacenada en el libro contable de caja con estado PAGADO.'
  },
  {
    id: 'CU-08',
    name: 'Emitir Ticket de Salida / Factura Electrónica',
    module: 'Facturación y Cobro',
    primaryActor: 'Operario de Caseta / Cajero',
    secondaryActors: ['Pasarela de Pagos / Facturación DIAN'],
    description: 'Genera el comprobante físico o electrónico de pago conforme a la Ley 1480 de 2011 con desglose de IVA, tiempos, placa y resolución fiscal. Relación <<include>> desde CU-07.',
    preconditions: 'Pago exitosamente registrado.',
    mainFlow: [
      '1. El sistema compone los datos fiscales del recibo (NIT, Consecutivo, Placa, Minutos, Tarifa, Medio de Pago).',
      '2. Si aplica factura electrónica, se envía el XML timbrado a la DIAN mediante la pasarela.',
      '3. Se imprime el comprobante térmico o se envía al correo del cliente.'
    ],
    alternativeFlows: [],
    postconditions: 'Cliente en posesión del soporte de pago para levantar la barrera de salida.'
  },
  {
    id: 'CU-09',
    name: 'Aplicar Tarifa Preferencial / Descuento Mensualista',
    module: 'Facturación y Cobro',
    primaryActor: 'Operario de Caseta / Cajero',
    secondaryActors: [],
    description: 'Aplica canon de $0 a mensualistas al día o descuentos institucionales. Extensión opcional de CU-06.',
    extensionPoint: 'Punto de Extensión: Cuando el vehículo pertenece a un mensualista activo o convenio.',
    extendsFrom: 'CU-06',
    preconditions: 'Vehículo identificado con suscripción mensual vigente.',
    mainFlow: [
      '1. El sistema detecta que la placa tiene contrato mensual activo.',
      '2. Aplica cobro de $0 en la liquidación.',
      '3. Registra la salida como servicio cubierto por suscripción mensual.'
    ],
    alternativeFlows: [
      '1a. Mensualidad vencida o en mora: El sistema notifica al operario y liquida como cliente rotativo normal.'
    ],
    postconditions: 'Liquidación ajustada con tarifa preferencial.'
  },
  {
    id: 'CU-10',
    name: 'Realizar Arqueo y Cierre Diario de Caja',
    module: 'Facturación y Cobro',
    primaryActor: 'Operario de Caseta / Cajero',
    secondaryActors: ['Administrador del Parqueadero'],
    description: 'Consolida todos los ingresos recaudados en el turno divididos por medio de pago (Efectivo, Tarjeta, Transferencia) y genera el acta de cierre.',
    preconditions: 'Turno operativo en curso.',
    mainFlow: [
      '1. El operario solicita el arqueo de turno.',
      '2. El sistema suma todos los cobros del turno por método de pago.',
      '3. El operario ingresa el dinero físico contado en caja.',
      '4. El sistema calcula sobrante o faltante.',
      '5. El administrador valida y firma el acta de cierre.'
    ],
    alternativeFlows: [],
    postconditions: 'Caja del turno cerrada e inmutable en auditoría.'
  },

  // --- MÓDULO 3: MENSUALISTAS Y SUSCRIPCIONES ---
  {
    id: 'CU-11',
    name: 'Registrar Cliente Mensualista',
    module: 'Mensualistas',
    primaryActor: 'Administrador del Parqueadero',
    secondaryActors: ['Cliente Conductor / Mensualista'],
    description: 'Registra a clientes frecuentes con nombre, cédula/NIT, teléfono, correo electrónico y vinculación de uno o más vehículos autorizados.',
    preconditions: 'Cliente no registrado previamente en el padrón de mensualistas.',
    mainFlow: [
      '1. El administrador ingresa los datos personales y fiscales del cliente.',
      '2. Ingresa la(s) placa(s) autorizadas del cliente.',
      '3. El sistema valida la unicidad del documento y crea el perfil del cliente.'
    ],
    alternativeFlows: [
      '3a. Cédula ya registrada: El sistema ofrece actualizar datos o asociar nuevo vehículo.'
    ],
    postconditions: 'Cliente registrado como usuario mensualista activo.'
  },
  {
    id: 'CU-12',
    name: 'Suscribir Cupo Fijo Mensual',
    module: 'Mensualistas',
    primaryActor: 'Administrador del Parqueadero',
    secondaryActors: ['Cliente Conductor / Mensualista'],
    description: 'Genera el contrato mensual con fecha de inicio, corte, canon pactado y celda fija asignada.',
    preconditions: 'Cliente previamente registrado y celda fija disponible.',
    mainFlow: [
      '1. El administrador selecciona el cliente mensualista.',
      '2. Define periodo de vigencia (e.g. 1 mes, 3 meses, 1 año).',
      '3. Asigna una celda reservada fija.',
      '4. Cobra el valor de la suscripción y genera el contrato.'
    ],
    alternativeFlows: [],
    postconditions: 'Suscripción activa y celda marcada como RESERVADA.'
  },
  {
    id: 'CU-13',
    name: 'Renovar o Suspender Suscripción',
    module: 'Mensualistas',
    primaryActor: 'Administrador del Parqueadero',
    secondaryActors: [],
    description: 'Gestiona la renovación de periodo mensual o suspende temporalmente por mora en el pago.',
    preconditions: 'Existe una suscripción previa.',
    mainFlow: [
      '1. El administrador busca la suscripción por cliente o placa.',
      '2. Selecciona la opción Renovar periodo y confirma pago.',
      '3. El sistema extiende la fecha de corte por 30 días adicionales.'
    ],
    alternativeFlows: [
      '2a. Cliente solicita cancelación: Se libera la celda reservada y se archiva el contrato.'
    ],
    postconditions: 'Fecha de vigencia actualizada o suscripción finalizada.'
  },
  {
    id: 'CU-14',
    name: 'Consultar Historial y Estado de Cuenta',
    module: 'Mensualistas',
    primaryActor: 'Administrador del Parqueadero',
    secondaryActors: ['Cliente Conductor / Mensualista'],
    description: 'Emite el extracto de pagos, entradas realizadas por el mensualista y estado contable (Al Día o En Mora).',
    preconditions: 'Usuario registrado.',
    mainFlow: [
      '1. Se consulta el perfil del cliente.',
      '2. El sistema despliega el histórico de entradas y recibos de pago emitidos.'
    ],
    alternativeFlows: [],
    postconditions: 'Informe de estado de cuenta generado.'
  },

  // --- MÓDULO 4: ADMINISTRACIÓN Y PARÁMETROS ---
  {
    id: 'CU-15',
    name: 'Configurar Parámetros de Tarifas y Fracciones',
    module: 'Administración',
    primaryActor: 'Administrador del Parqueadero',
    secondaryActors: [],
    description: 'Permite actualizar el valor por minuto, valor por hora, día pleno y minutos de gracia institucional para Automóviles, Motos y Camionetas.',
    preconditions: 'Privilegios de Administrador autenticado.',
    mainFlow: [
      '1. El administrador accede al módulo de Configuración de Tarifas.',
      '2. Modifica los importes para cada categoría vehicular.',
      '3. Guarda los cambios con fecha de inicio de vigencia.',
      '4. El sistema audita el cambio en el log del sistema.'
    ],
    alternativeFlows: [],
    postconditions: 'Nuevos cobros se liquidarán con el tarifario actualizado.'
  },
  {
    id: 'CU-16',
    name: 'Generar Reportes de Ocupación e Ingresos',
    module: 'Administración',
    primaryActor: 'Administrador del Parqueadero',
    secondaryActors: [],
    description: 'Genera estadísticas de rotación vehicular, horas pico, vehículos atendidos, recaudos por medio de pago y exporta en formatos ejecutables.',
    preconditions: 'Datos históricos almacenados en el sistema.',
    mainFlow: [
      '1. El administrador selecciona el rango de fechas (Día, Semana, Mes).',
      '2. El sistema procesa los totales y grafica las métricas.',
      '3. El administrador exporta el informe consolidado.'
    ],
    alternativeFlows: [],
    postconditions: 'Reporte gerencial generado para toma de decisiones.'
  }
];

export const PLANTUML_USE_CASE_CODE = `@startuml
title Sistema de Parqueadero Autos Colombia - Diagrama de Casos de Uso (UML 2.5)
left to right direction
skinparam packageStyle rectangle
skinparam shadowing false
skinparam actorStyle awesome

actor "Operario / Cajero" as Operario #0284c7
actor "Administrador" as Admin #4f46e5
actor "Cliente / Conductor" as Cliente #059669
actor "Pasarela Pagos / DIAN" as Pasarela #d97706

Admin --|> Operario : <<generalizes>>

rectangle "Sistema Parqueadero Autos Colombia" {
  package "Módulo 1: Control de Acceso y Celdas" {
    usecase "CU-01: Registrar Ingreso Vehicular" as CU01 #e0f2fe
    usecase "CU-02: Asignar Celda de Parqueo" as CU02 #e0f2fe
    usecase "CU-03: Registrar Novedad / Daño Previo" as CU03 #fef3c7
    usecase "CU-04: Registrar Salida y Tiempo" as CU04 #e0f2fe
    usecase "CU-05: Monitorear Celdas en Tiempo Real" as CU05 #e0f2fe

    CU01 .> CU02 : <<include>>
    CU03 .> CU01 : <<extend>>\\n(Si presenta daño)
    CU04 .> CU06 : <<include>>
  }

  package "Módulo 2: Facturación y Cobro" {
    usecase "CU-06: Liquidar Cobro de Estancia" as CU06 #dcfce7
    usecase "CU-07: Procesar Transacción de Pago" as CU07 #dcfce7
    usecase "CU-08: Emitir Ticket / Factura DIAN" as CU08 #dcfce7
    usecase "CU-09: Aplicar Tarifa Preferencial" as CU09 #fef3c7
    usecase "CU-10: Realizar Cierre / Arqueo Diario" as CU10 #dcfce7

    CU06 .> CU07 : <<include>>
    CU07 .> CU08 : <<include>>
    CU09 .> CU06 : <<extend>>\\n(Si es mensualista)
  }

  package "Módulo 3: Clientes Mensualistas" {
    usecase "CU-11: Registrar Cliente Mensualista" as CU11 #ede9fe
    usecase "CU-12: Suscribir Cupo Fijo Mensual" as CU12 #ede9fe
    usecase "CU-13: Renovar / Suspender Suscripción" as CU13 #ede9fe
    usecase "CU-14: Consultar Estado de Cuenta" as CU14 #ede9fe
  }

  package "Módulo 4: Configuración y Auditoría" {
    usecase "CU-15: Configurar Tarifas y Fracciones" as CU15 #fee2e2
    usecase "CU-16: Generar Reportes de Ocupación" as CU16 #fee2e2
  }
}

' Asociaciones de Actores
Operario --> CU01
Operario --> CU04
Operario --> CU05
Operario --> CU06
Operario --> CU10

Admin --> CU11
Admin --> CU12
Admin --> CU13
Admin --> CU14
Admin --> CU15
Admin --> CU16

Cliente --> CU01
Cliente --> CU04
Cliente --> CU07
Cliente --> CU11
Cliente --> CU12

CU07 --> Pasarela
CU08 --> Pasarela
@enduml
`;
