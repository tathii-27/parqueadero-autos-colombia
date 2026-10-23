export interface FunctionalRequirement {
  id: string; // e.g. RF-ES-01
  title: string;
  priority: 'ALTA' | 'MEDIA' | 'BAJA';
  category: 'ENTRADA' | 'SALIDA' | 'TARIFACIÓN' | 'AUDITORÍA' | 'MENSUALISTAS' | 'CELDAS';
  actor: string;
  description: string;
  preconditions: string[];
  workflow: string[];
  postconditions: string[];
  businessRules: string[];
  testScenario: string;
}

export interface NonFunctionalRequirement {
  id: string; // e.g. RNF-01
  category: 'RENDIMIENTO' | 'SEGURIDAD' | 'DISPONIBILIDAD' | 'USABILIDAD' | 'INTEGRIDAD' | 'LEGAL';
  title: string;
  metric: string;
  description: string;
  complianceStrategy: string;
}

export interface TraceabilityItem {
  id: string;
  rfId: string;
  rfTitle: string;
  userStoryId: string;
  userStoryTitle: string;
  useCaseId: string;
  useCaseName: string;
  testCaseId: string;
  testCaseName: string;
  testScenario: string;
  systemModule: string;
  verificationMethod: 'Prueba Unitaria' | 'Prueba de Integración' | 'Prueba de Sistema / E2E' | 'Inspección';
  status: 'IMPLEMENTADO Y VALIDADO';
}

export const FUNCTIONAL_REQUIREMENTS: FunctionalRequirement[] = [
  {
    id: 'RF-ES-01',
    title: 'Registro y Validación de Entrada de Vehículo',
    priority: 'ALTA',
    category: 'ENTRADA',
    actor: 'Operador de Entrada / Sistema',
    description: 'El sistema debe permitir registrar el ingreso de cualquier vehículo ingresando su placa, detectando automáticamente el tipo de vehículo y determinando si cuenta con un contrato de mensualidad activo o si ingresa bajo modalidad ocasional.',
    preconditions: [
      'El operador debe haber iniciado sesión con permisos operativos.',
      'Debe existir al menos una celda compatible disponible en el parqueadero.'
    ],
    workflow: [
      '1. El operador ingresa o escanea la placa del vehículo (formato colombiano AAA-123 o AAA-12D).',
      '2. El sistema normaliza la placa y consulta en la base de datos de abonados (mensualistas).',
      '3. Si la placa pertenece a un usuario con mensualidad activa, asocia automáticamente el registro con costo liquidable de $0 COP.',
      '4. Si no es mensualista o la suscripción está vencida, asigna la modalidad ocasional aplicando la tarifa horaria correspondiente.',
      '5. El operador selecciona o confirma la celda asignada sugerida por el sistema.',
      '6. El operador registra novedades u observaciones iniciales del estado del vehículo (opcional).',
      '7. El sistema guarda el registro de entrada con timestamp exacto y emite el ticket numerado.'
    ],
    postconditions: [
      'La celda asignada cambia su estado a "OCUPADA".',
      'Se genera un registro activo en el patio con número de ticket único.',
      'Se imprime o visualiza el comprobante de ingreso con código de barras o QR.'
    ],
    businessRules: [
      'RN-01: No se permite registrar el ingreso de un vehículo cuya placa ya figure como ACTIVA dentro del parqueadero.',
      'RN-02: Las placas deben cumplir con el estándar RUNT / Ministerio de Transporte de Colombia.',
      'RN-03: Si el mensualista tiene mensualidad vencida, el sistema debe alertar al operador y permitir registrar como ocasional o cobrar la renovación.'
    ],
    testScenario: 'Ingresar la placa "HNE612". El sistema debe reconocer inmediatamente que pertenece al abonado Carlos Restrepo, asociar su celda A-01 y marcar servicio MENSUALIDAD.'
  },
  {
    id: 'RF-ES-02',
    title: 'Asignación Inteligente de Celda de Parqueo',
    priority: 'ALTA',
    category: 'ENTRADA',
    actor: 'Sistema / Operador',
    description: 'El sistema debe recomendar y reservar de forma automática la celda más adecuada según el tipo de vehículo (Automóvil en Zona A, Motocicleta en Zona B, Camioneta/SUV en Zona C), priorizando celdas exclusivas para abonados o celdas libres más cercanas a la entrada.',
    preconditions: [
      'El inventario de celdas debe estar configurado en el sistema con sus zonas y dimensiones.'
    ],
    workflow: [
      '1. Al seleccionar el tipo de vehículo, el sistema filtra únicamente las celdas disponibles para esa categoría.',
      '2. Si el vehículo pertenece a un mensualista con celda fija asignada, el sistema selecciona automáticamente dicha celda.',
      '3. El operador puede aceptar la sugerencia o seleccionar otra celda libre en el mapa interactivo.',
      '4. El sistema bloquea la celda para prevenir doble asignación concurrente.'
    ],
    postconditions: [
      'La celda seleccionada queda asociada a la placa durante toda la permanencia del vehículo.'
    ],
    businessRules: [
      'RN-04: Un vehículo tipo Automóvil o Camioneta no puede ocupar una celda exclusiva de Motocicleta.',
      'RN-05: Las celdas en estado MANTENIMIENTO quedan inhabilitadas para asignación.'
    ],
    testScenario: 'Seleccionar tipo "MOTO" al registrar entrada. El selector de celdas debe desplegar únicamente celdas disponibles de la Zona B.'
  },
  {
    id: 'RF-ES-03',
    title: 'Inspección de Ingreso y Registro de Estado Físico',
    priority: 'MEDIA',
    category: 'ENTRADA',
    actor: 'Operador de Entrada',
    description: 'El sistema debe permitir documentar el estado físico de recepción del vehículo al momento del ingreso, incluyendo rayones previos, golpes, accesorios dejados (cascos, chaquetas) y condiciones mecánicas para salvaguardar la responsabilidad civil del parqueadero.',
    preconditions: [
      'Formulario de registro de entrada abierto.'
    ],
    workflow: [
      '1. El operador inspecciona visualmente el vehículo.',
      '2. Marca casillas rápidas (rayones, accesorios en custodia, llaves entregadas) o escribe texto descriptivo.',
      '3. La novedad queda anexada al ticket de ingreso y se indexa en el módulo de novedades.'
    ],
    postconditions: [
      'El ticket de entrada imprime o almacena las notas de recepción.',
      'Se genera un registro auditable para cotejar en caso de reclamo al momento de la salida.'
    ],
    businessRules: [
      'RN-06: El parqueadero solo responde por daños ocurridos durante la custodia si no fueron reportados en la inspección de ingreso.'
    ],
    testScenario: 'Ingresar notas: "Rayón superficial en puerta delantera derecha". Verificar que aparezca en el detalle del vehículo activo y en el ticket impreso.'
  },
  {
    id: 'RF-ES-04',
    title: 'Generación y Emisión de Ticket de Ingreso',
    priority: 'ALTA',
    category: 'ENTRADA',
    actor: 'Sistema',
    description: 'El sistema debe generar un comprobante físico o digital de ingreso que contenga: nombre del establecimiento, NIT, fecha y hora exacta de entrada, placa, tipo de vehículo, celda asignada, tipo de servicio y código único de ticket.',
    preconditions: [
      'Registro de entrada completado exitosamente.'
    ],
    workflow: [
      '1. El sistema consolida los datos de la transacción de entrada.',
      '2. Asigna un número consecutivo estructurado (ej. PAC-2026-XXXX).',
      '3. Renderiza el ticket en pantalla con opción de impresión térmica o visualización digital.'
    ],
    postconditions: [
      'Ticket generado y disponible para consulta o reimpresión en cualquier momento.'
    ],
    businessRules: [
      'RN-07: Cada ticket debe ser único e irrepetible dentro del ejercicio fiscal del parqueadero.'
    ],
    testScenario: 'Finalizar entrada y pulsar "Ver Ticket". Debe mostrar placa en tipografía destacada, celda, timestamp y datos fiscales de Autos Colombia.'
  },
  {
    id: 'RF-ES-05',
    title: 'Búsqueda y Localización Ágil para Salida',
    priority: 'ALTA',
    category: 'SALIDA',
    actor: 'Operador de Salida / Cajero',
    description: 'El sistema debe permitir localizar instantáneamente cualquier vehículo activo en patio ingresando la placa, el número de ticket o la celda en un campo de búsqueda predictivo en tiempo real.',
    preconditions: [
      'Debe haber vehículos con estado ACTIVO en el parqueadero.'
    ],
    workflow: [
      '1. El cliente presenta su ticket o menciona su placa en la cabina de salida.',
      '2. El operador escribe 2 o más caracteres de la placa o ticket.',
      '3. El sistema filtra en tiempo real y muestra la tarjeta del vehículo con tiempo transcurrido y celda ocupada.',
      '4. El operador presiona "Liquidar Salida".'
    ],
    postconditions: [
      'Se abre la ventana de liquidación y cobro de salida.'
    ],
    businessRules: [
      'RN-08: La búsqueda debe ignorar guiones, espacios y mayúsculas/minúsculas para máxima agilidad operativa.'
    ],
    testScenario: 'Escribir "612" en el buscador. El sistema debe listar inmediatamente el vehículo HNE612 en la celda A-01.'
  },
  {
    id: 'RF-ES-06',
    title: 'Cálculo y Liquidación Automatizada de Tarifas',
    priority: 'ALTA',
    category: 'TARIFACIÓN',
    actor: 'Sistema',
    description: 'El sistema debe calcular de manera exacta el tiempo de permanencia transcurrido entre la hora de entrada y la hora actual, aplicando las reglas tarifarias vigentes según tipo de vehículo, periodo de gracia y estado de mensualidad.',
    preconditions: [
      'Vehículo activo seleccionado para salida.'
    ],
    workflow: [
      '1. El sistema obtiene el timestamp de salida (momento actual).',
      '2. Calcula la diferencia en minutos y horas exactas.',
      '3. Evalúa si el vehículo cuenta con mensualidad activa. Si es afirmativo, el valor a cobrar es $0 COP.',
      '4. Si es ocasional, verifica si la permanencia es menor al tiempo de gracia (ej. 15 minutos). Si es menor, valor $0 COP.',
      '5. Si supera el tiempo de gracia, calcula las horas o fracciones a cobrar según la tarifa configurada para su categoría.',
      '6. Muestra subtotal, posibles descuentos y total a cancelar en COP.'
    ],
    postconditions: [
      'Monto total a pagar claramente desglosado ante el operador y el cliente.'
    ],
    businessRules: [
      'RN-09: El tiempo de gracia estándar es de 15 minutos sin costo.',
      'RN-10: Fracción de hora posterior a la hora base se liquida según la política parametrizada (fracción u hora completa).'
    ],
    testScenario: 'Vehículo ocasional con 2 horas y 10 minutos de permanencia de tipo Automóvil ($4.000/hora). Total liquidado debe ser $12.000 COP (3 horas facturables).'
  },
  {
    id: 'RF-ES-07',
    title: 'Gestión de Cobro y Medios de Pago en Salida',
    priority: 'ALTA',
    category: 'SALIDA',
    actor: 'Cajero / Operador',
    description: 'El sistema debe registrar la transacción de pago admitiendo múltiples medios de pago comunes en Colombia (Efectivo, Nequi, Daviplata, Tarjetas Débito/Crédito y Transferencia Bancaria), calculando automáticamente el cambio o devuelta en caso de pago en efectivo.',
    preconditions: [
      'Total a pagar liquidado por el sistema.'
    ],
    workflow: [
      '1. El cajero selecciona el medio de pago acordado con el cliente.',
      '2. Si es Efectivo, digita el monto recibido y el sistema calcula la devuelta exacta.',
      '3. Si es Nequi o Daviplata, registra el código de referencia o comprobante digital.',
      '4. El cajero confirma la transacción.'
    ],
    postconditions: [
      'Se genera un registro inmutable en la tabla de Pagos con número de recibo consecutivo.',
      'El monto ingresa al arqueo de caja del turno actual.'
    ],
    businessRules: [
      'RN-11: No se permite finalizar la salida de un vehículo con saldo pendiente a menos que cuente con exoneración autorizada por administración.'
    ],
    testScenario: 'Cobro de $8.000 en efectivo con billete de $20.000. El sistema debe calcular una devuelta de $12.000 COP y habilitar el botón de confirmar salida.'
  },
  {
    id: 'RF-ES-08',
    title: 'Liberación de Celda y Cierre de Salida',
    priority: 'ALTA',
    category: 'SALIDA',
    actor: 'Sistema',
    description: 'Una vez confirmado el cobro o la validación del mensualista, el sistema debe cambiar el estado del vehículo a "FINALIZADO", registrar la hora de salida, liberar la celda ocupada (dejándola en estado "DISPONIBLE" o "RESERVADA_MENSUAL") y actualizar el aforo en tiempo real.',
    preconditions: [
      'Pago registrado exitosamente o exonerado por mensualidad.'
    ],
    workflow: [
      '1. El sistema actualiza el registro de vehículo: estado FINALIZADO y timestamp de salida.',
      '2. La celda correspondiente es liberada de la placa actual.',
      '3. Si la celda tiene asignación permanente a un abonado, regresa a estado RESERVADA_MENSUAL; de lo contrario, regresa a DISPONIBLE.',
      '4. El aforo y contador de vehículos en patio se actualiza inmediatamente sin necesidad de recargar la página.'
    ],
    postconditions: [
      'La celda queda libre para recibir un nuevo vehículo.',
      'El registro histórico queda archivado para reportes y auditoría.'
    ],
    businessRules: [
      'RN-12: Una celda liberada debe estar disponible inmediatamente para la siguiente entrada.'
    ],
    testScenario: 'Finalizar salida de vehículo en celda A-06. La celda A-06 debe cambiar a color verde (DISPONIBLE) y el total de celdas ocupadas debe decrementar en 1.'
  },
  {
    id: 'RF-ES-09',
    title: 'Emisión de Factura / Recibo de Caja de Salida',
    priority: 'ALTA',
    category: 'SALIDA',
    actor: 'Sistema',
    description: 'El sistema debe generar un comprobante fiscal / recibo de caja de salida con todos los requerimientos comerciales: número de recibo consecutivo, datos del parqueadero (NIT, dirección, teléfono), datos del cliente, placa del vehículo, celda, hora de entrada, hora de salida, tiempo total, tarifa aplicada, medio de pago y valor total cancelado.',
    preconditions: [
      'Salida registrada y pago asentado en base de datos.'
    ],
    workflow: [
      '1. El sistema genera el documento imprimible estructurado.',
      '2. Presenta vista previa con botón de impresión y opción de descarga.',
      '3. Asocia el ID del recibo con la salida del vehículo para trazabilidad contable.'
    ],
    postconditions: [
      'El cliente recibe su soporte físico o digital de pago.'
    ],
    businessRules: [
      'RN-13: Todo recibo debe contener la leyenda de régimen tributario y datos de contacto de Parqueadero Autos Colombia.'
    ],
    testScenario: 'Visualizar recibo de salida REC-008920. Verificar que contenga NIT 900.842.125-4, placa, horas facturadas y total en COP.'
  },
  {
    id: 'RF-ES-10',
    title: 'Manejo de Novedades e Incidencias en Salida',
    priority: 'MEDIA',
    category: 'SALIDA',
    actor: 'Operador / Supervisor',
    description: 'El sistema debe alertar al operador al momento de la salida si el vehículo tiene novedades abiertas (luces encendidas, fugas reportadas o reclamos de daños) para verificar con el cliente antes de la apertura de talanquera.',
    preconditions: [
      'Vehículo con una o más novedades asociadas en el módulo de Novedades.'
    ],
    workflow: [
      '1. Al seleccionar el vehículo para salida, el sistema verifica si existen registros en la tabla de Novedades.',
      '2. Si hay novedades pendientes o resueltas, muestra una alerta visible con el detalle de la incidencia.',
      '3. El operador confirma que el cliente fue enterado de la novedad antes de autorizar la salida.'
    ],
    postconditions: [
      'Se deja constancia en el historial de que la novedad fue revisada a la salida.'
    ],
    businessRules: [
      'RN-14: No se debe permitir la salida sin antes acusar recibo de novedades de severidad ALTA.'
    ],
    testScenario: 'Registrar salida del vehículo HNE612 que tiene la novedad NOV-101 (Luces encendidas). La interfaz debe advertir la novedad al cajero.'
  }
];

export const NON_FUNCTIONAL_REQUIREMENTS: NonFunctionalRequirement[] = [
  {
    id: 'RNF-01',
    category: 'RENDIMIENTO',
    title: 'Tiempo de Respuesta en Operación de Entrada y Salida',
    metric: '< 500 ms por transacción',
    description: 'El sistema debe procesar el registro de entrada, la liquidación de salida y la generación del recibo en menos de 500 milisegundos para evitar congestión de vehículos en las bahías de acceso.',
    complianceStrategy: 'Optimización de consultas en memoria, debounce en búsquedas y persistencia reactiva sin recargas de página.'
  },
  {
    id: 'RNF-02',
    category: 'USABILIDAD',
    title: 'Eficiencia en Entrada Rápida (Teclado y Atajos)',
    metric: '< 15 segundos por ingreso de vehículo',
    description: 'La interfaz debe estar diseñada ergonómicamente para que un operador pueda registrar un vehículo en menos de 15 segundos, con foco automático en campos de placa, formato guiado y atajos de confirmación rápida.',
    complianceStrategy: 'Diseño accesible, formateo automático de placas colombianas (autocorrección a mayúsculas y sin caracteres inválidos), y sugerencia automática de celda.'
  },
  {
    id: 'RNF-03',
    category: 'DISPONIBILIDAD',
    title: 'Operación Continua 24/7 y Resiliencia Local',
    metric: '99.9% de operatividad',
    description: 'El software debe operar ininterrumpidamente las 24 horas del día. En caso de microcortes de red, el sistema debe mantener los datos en caché local persistente (localStorage / IndexedDB) sin pérdida de información de vehículos en patio.',
    complianceStrategy: 'Arquitectura offline-first con sincronización automática en almacenamiento persistente del navegador y exportación de respaldo en JSON.'
  },
  {
    id: 'RNF-04',
    category: 'SEGURIDAD',
    title: 'Inmutabilidad y Trazabilidad de Auditoría',
    metric: '100% de transacciones auditables',
    description: 'Cada ingreso, salida, cobro y novedad debe quedar registrado con timestamp inalterable, número de ticket/recibo consecutivo y nombre del operador o cajero responsable. Los cobros asentados no pueden ser eliminados sin registro de anulación.',
    complianceStrategy: 'Registros de caja numerados consecutivamente (PAC-XXXX / REC-XXXX), validación de integridad referencial y marcas de tiempo ISO 8601.'
  },
  {
    id: 'RNF-05',
    category: 'INTEGRIDAD',
    title: 'Consistencia Estricta de Celdas y Aforo',
    metric: 'Cero discrepancias entre celdas físicas y virtuales',
    description: 'El sistema debe garantizar que ninguna celda pueda ser asignada simultáneamente a dos vehículos distintos ni que un vehículo activo figure sin una celda válidamente identificada.',
    complianceStrategy: 'Bloqueo transaccional de celdas al registrar entrada y validación de unicidad de placa activa.'
  },
  {
    id: 'RNF-06',
    category: 'LEGAL',
    title: 'Cumplimiento Normativo Colombiano y Facturación',
    metric: 'Conformidad con estatuto del consumidor (Ley 1480 de 2011)',
    description: 'Los tickets y recibos emitidos deben cumplir con la normativa colombiana de parqueaderos comerciales: razón social, NIT visible, póliza de responsabilidad civil, detalle de tarifas visibles y desglose de IVA/régimen.',
    complianceStrategy: 'Plantilla estandarizada de recibos y tickets de caja con datos comerciales parametrizables en el módulo de configuración.'
  },
  {
    id: 'RNF-07',
    category: 'SEGURIDAD',
    title: 'Protección de Datos Personales (Ley 1581 de 2012 de Colombia)',
    metric: 'Confidencialidad de datos de abonados',
    description: 'La información de los usuarios mensualistas (cédula, dirección, teléfono, correo) debe estar protegida y accesible únicamente por el personal autorizado para gestión de cobranza y contacto operativo.',
    complianceStrategy: 'Encapsulamiento de módulos de clientes, exportaciones controladas y máscaras en vistas públicas.'
  },
  {
    id: 'RNF-08',
    category: 'USABILIDAD',
    title: 'Compatibilidad de Impresión Térmica y Dispositivos',
    metric: 'Soporte estándar de 58mm y 80mm ESC/POS y pantallas táctiles',
    description: 'Los comprobantes de entrada y salida deben contar con estilos de impresión optimizados tanto para impresoras térmicas de tickets (58mm/80mm) como para pantallas de computadores de escritorio o tablets de patio.',
    complianceStrategy: 'Hojas de estilo `@media print` dedicadas que aíslan exclusivamente el ticket eliminando márgenes, barras laterales y elementos de navegación.'
  }
];

export const TRACEABILITY_MATRIX: TraceabilityItem[] = [
  {
    id: 'TR-01',
    rfId: 'RF-ES-01',
    rfTitle: 'Registro y Validación de Entrada de Vehículo',
    userStoryId: 'HU-01 / HU-02',
    userStoryTitle: 'Registro ágil de entrada con validación de placa / Detección de mensualistas',
    useCaseId: 'CU-01',
    useCaseName: 'Registrar Ingreso de Vehículo',
    testCaseId: 'CP-ENT-01',
    testCaseName: 'Validación de placa colombiana y bloqueo de duplicados',
    testScenario: 'Ingresar placa válida "HNE612". El sistema valida formato RUNT, detecta contrato activo de abonado y asigna tarifa $0 COP. Si se reingresa placa activa "KLY872", rechaza con error RN-01.',
    systemModule: 'Operaciones / Modal Entrada',
    verificationMethod: 'Prueba de Integración',
    status: 'IMPLEMENTADO Y VALIDADO'
  },
  {
    id: 'TR-02',
    rfId: 'RF-ES-02',
    rfTitle: 'Asignación Inteligente de Celda de Parqueo',
    userStoryId: 'HU-03 / HU-11',
    userStoryTitle: 'Asignación y reserva inteligente de celda según tipología / Mapa de celdas',
    useCaseId: 'CU-02',
    useCaseName: 'Asignar Celda de Estacionamiento',
    testCaseId: 'CP-CEL-01',
    testCaseName: 'Filtro por tipología y bloqueo de concurrencia',
    testScenario: 'Al seleccionar tipo "MOTO", el selector despliega únicamente celdas disponibles de Zona B (B-01 a B-06). Excluye celdas ocupadas y en mantenimiento.',
    systemModule: 'Mapa de Celdas / Bahías',
    verificationMethod: 'Prueba Unitaria',
    status: 'IMPLEMENTADO Y VALIDADO'
  },
  {
    id: 'TR-03',
    rfId: 'RF-ES-03',
    rfTitle: 'Inspección de Ingreso y Registro de Estado Físico',
    userStoryId: 'HU-04 / HU-15',
    userStoryTitle: 'Inspección de ingreso y custodia de pertenencias / Registro de novedades',
    useCaseId: 'CU-03',
    useCaseName: 'Registrar Inspección Física y Daños Previos',
    testCaseId: 'CP-NOV-01',
    testCaseName: 'Persistencia de inspección previa en ticket',
    testScenario: 'Ingresar observación "Rayón preexistente en puerta derecha y casco en custodia". Verificar que se graba en base de datos y se imprime en el comprobante.',
    systemModule: 'Novedades / Inspección',
    verificationMethod: 'Prueba de Sistema / E2E',
    status: 'IMPLEMENTADO Y VALIDADO'
  },
  {
    id: 'TR-04',
    rfId: 'RF-ES-04',
    rfTitle: 'Generación y Emisión de Ticket de Ingreso',
    userStoryId: 'HU-05',
    userStoryTitle: 'Emisión e impresión de ticket de ingreso físico y digital',
    useCaseId: 'CU-04',
    useCaseName: 'Emitir Ticket de Estacionamiento',
    testCaseId: 'CP-TCK-01',
    testCaseName: 'Consecutivo fiscal y metadatos obligatorios',
    testScenario: 'Confirmar entrada de vehículo. Se valida generación de consecutivo PAC-2026-XXXX, fecha/hora ISO, celda, tipología, código de barras y datos fiscales del parqueadero.',
    systemModule: 'TicketPrintModal / Impresión',
    verificationMethod: 'Prueba de Sistema / E2E',
    status: 'IMPLEMENTADO Y VALIDADO'
  },
  {
    id: 'TR-05',
    rfId: 'RF-ES-05',
    rfTitle: 'Búsqueda y Localización Ágil para Salida',
    userStoryId: 'HU-06',
    userStoryTitle: 'Búsqueda predictiva instantánea de vehículos en patio',
    useCaseId: 'CU-05',
    useCaseName: 'Buscar y Localizar Vehículo en Patio',
    testCaseId: 'CP-BUS-01',
    testCaseName: 'Búsqueda reactiva insensibilizada a caracteres',
    testScenario: 'Escribir subcadena "612" en buscador. El sistema localiza en <100ms el registro del vehículo HNE612, mostrando celda ocupada A-01 y horas acumuladas.',
    systemModule: 'LiveOperationsView / Búsqueda',
    verificationMethod: 'Prueba Unitaria',
    status: 'IMPLEMENTADO Y VALIDADO'
  },
  {
    id: 'TR-06',
    rfId: 'RF-ES-06',
    rfTitle: 'Cálculo y Liquidación Automatizada de Tarifas',
    userStoryId: 'HU-07 / HU-18',
    userStoryTitle: 'Liquidación automática de tiempo con tarifas y gracia / Gestión tarifaria',
    useCaseId: 'CU-06',
    useCaseName: 'Liquidar Tiempo y Tarifa de Estacionamiento',
    testCaseId: 'CP-TAR-01',
    testCaseName: 'Liquidación con periodo de gracia y fracciones horarias',
    testScenario: 'Estancia menor a 15 min liquida $0 COP (tiempo de gracia). Estancia de 2h 10min en Automóvil liquida 3 horas exactas a $4.000 = $12.000 COP conforme a política tarifaria.',
    systemModule: 'ExitModal / Motor de Tarifas',
    verificationMethod: 'Prueba Unitaria',
    status: 'IMPLEMENTADO Y VALIDADO'
  },
  {
    id: 'TR-07',
    rfId: 'RF-ES-07',
    rfTitle: 'Gestión de Cobro y Medios de Pago en Salida',
    userStoryId: 'HU-08',
    userStoryTitle: 'Procesamiento de pagos multicanal y cálculo de devuelta',
    useCaseId: 'CU-07',
    useCaseName: 'Registrar Pago del Servicio',
    testCaseId: 'CP-PAG-01',
    testCaseName: 'Multicanal de pago y cálculo de cambio',
    testScenario: 'Cobro de $8.000 recibiendo billete de $20.000 en Efectivo; sistema calcula devuelta de $12.000 COP. Permite seleccionar Nequi, Daviplata o Tarjeta con registro de transacción.',
    systemModule: 'PaymentsView / Cobro',
    verificationMethod: 'Prueba de Integración',
    status: 'IMPLEMENTADO Y VALIDADO'
  },
  {
    id: 'TR-08',
    rfId: 'RF-ES-08',
    rfTitle: 'Liberación de Celda y Cierre de Salida',
    userStoryId: 'HU-09',
    userStoryTitle: 'Liberación instantánea de celda y actualización de aforo',
    useCaseId: 'CU-08',
    useCaseName: 'Liberar Celda y Cerrar Salida',
    testCaseId: 'CP-SAL-01',
    testCaseName: 'Actualización reactiva de aforo y estado de celda',
    testScenario: 'Completar pago de vehículo en celda A-06. La celda A-06 cambia inmediatamente a "DISPONIBLE" (verde), el contador de ocupados decrece en 1 y el histórico pasa a FINALIZADO.',
    systemModule: 'CellsView / Operaciones',
    verificationMethod: 'Prueba de Sistema / E2E',
    status: 'IMPLEMENTADO Y VALIDADO'
  },
  {
    id: 'TR-09',
    rfId: 'RF-ES-09',
    rfTitle: 'Emisión de Factura / Recibo de Caja de Salida',
    userStoryId: 'HU-10',
    userStoryTitle: 'Generación e impresión de recibo de caja de salida fiscal',
    useCaseId: 'CU-09',
    useCaseName: 'Generar Factura / Recibo de Caja',
    testCaseId: 'CP-REC-01',
    testCaseName: 'Validación de campos normativos Ley 1480',
    testScenario: 'Imprimir recibo consecutivo REC-008920. Comprobar NIT 900.842.125-4, hora entrada, hora salida, minutos liquidados, medio de pago e identificación del cajero.',
    systemModule: 'TicketPrintModal / Recibos',
    verificationMethod: 'Prueba de Sistema / E2E',
    status: 'IMPLEMENTADO Y VALIDADO'
  },
  {
    id: 'TR-10',
    rfId: 'RF-ES-10',
    rfTitle: 'Manejo de Novedades e Incidencias en Salida',
    userStoryId: 'HU-16',
    userStoryTitle: 'Alerta preventiva de novedades abiertas antes de autorizar salida',
    useCaseId: 'CU-10',
    useCaseName: 'Verificar Alertas y Novedades Pendientes',
    testCaseId: 'CP-NOV-02',
    testCaseName: 'Alerta obligatoria de novedad pendiente en liquidación',
    testScenario: 'Liquidar vehículo con novedad abierta NOV-101 ("Luces encendidas"). El modal de salida despliega advertencia ámbar requiriendo confirmación del operador antes de abrir talanquera.',
    systemModule: 'IncidentsView / ExitModal',
    verificationMethod: 'Prueba de Integración',
    status: 'IMPLEMENTADO Y VALIDADO'
  },
  {
    id: 'TR-11',
    rfId: 'RF-ADM-11',
    rfTitle: 'Gestión de Contratos de Mensualistas y Renovaciones',
    userStoryId: 'HU-13 / HU-14',
    userStoryTitle: 'Registro de abonados mensualistas / Control de vigencia y alertas de corte',
    useCaseId: 'CU-11',
    useCaseName: 'Administrar Suscripciones de Mensualistas',
    testCaseId: 'CP-MEN-01',
    testCaseName: 'Alta de suscriptor, reserva de celda fija y corte de fecha',
    testScenario: 'Registrar nuevo abonado con documento CC, placa y asignar celda A-01. La celda pasa a estado "RESERVADA_MENSUAL" y se calcula automáticamente la fecha de corte.',
    systemModule: 'UsersView / Mensualistas',
    verificationMethod: 'Prueba de Integración',
    status: 'IMPLEMENTADO Y VALIDADO'
  },
  {
    id: 'TR-12',
    rfId: 'RF-ADM-12',
    rfTitle: 'Cuadre y Arqueo Diario de Caja por Turnos',
    userStoryId: 'HU-19 / HU-20',
    userStoryTitle: 'Arqueo de caja por turnos / Exportación de reportes de auditoría financiera',
    useCaseId: 'CU-14',
    useCaseName: 'Realizar Cierre y Arqueo de Caja',
    testCaseId: 'CP-CAJ-01',
    testCaseName: 'Conciliación de pagos multicanal y balance de turno',
    testScenario: 'Consultar arqueo del turno actual. La suma de transacciones en Efectivo, Nequi, Daviplata y Tarjetas coincide exactamente con el monto total liquidado por los cajeros.',
    systemModule: 'PaymentsView / Arqueo',
    verificationMethod: 'Prueba de Integración',
    status: 'IMPLEMENTADO Y VALIDADO'
  }
];

