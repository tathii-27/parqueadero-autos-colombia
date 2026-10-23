export interface UserStory {
  id: string; // e.g. HU-01
  epic: 'ENTRADA_SALIDA' | 'CELDAS' | 'MENSUALISTAS' | 'NOVEDADES' | 'PAGOS';
  epicTitle: string;
  title: string;
  role: string; // Como...
  action: string; // Quiero...
  benefit: string; // Para...
  priority: 'ALTA' | 'MEDIA' | 'BAJA';
  storyPoints: number;
  relatedRF: string[];
  acceptanceCriteria: {
    scenario: string;
    given: string;
    when: string;
    then: string;
  }[];
  businessRules: string[];
}

export const USER_STORIES: UserStory[] = [
  // --- ÉPICA: GESTIÓN DE ENTRADA Y SALIDA DE VEHÍCULOS ---
  {
    id: 'HU-01',
    epic: 'ENTRADA_SALIDA',
    epicTitle: 'Gestión de Entrada y Salida',
    title: 'Registro ágil de entrada de vehículos con validación de placa',
    role: 'Operador de entrada del parqueadero',
    action: 'ingresar la placa del vehículo que arriba a la bahía de acceso en el sistema',
    benefit: 'registrar su llegada con fecha y hora exactas, validar que no se encuentre previamente dentro del patio y habilitar su ingreso sin demoras en menos de 15 segundos.',
    priority: 'ALTA',
    storyPoints: 5,
    relatedRF: ['RF-ES-01'],
    acceptanceCriteria: [
      {
        scenario: 'Ingreso exitoso de vehículo particular con placa colombiana válida',
        given: 'que el operador se encuentra en el módulo de Registro de Entrada y el vehículo está en la bahía,',
        when: 'digita la placa "HNE612" y confirma la entrada,',
        then: 'el sistema guarda el timestamp exacto, asigna un número de ticket PAC-2026-XXXX y muestra la confirmación en pantalla.'
      },
      {
        scenario: 'Intento de registro de un vehículo que ya figura dentro del parqueadero',
        given: 'que la placa "KLY872" ya posee un estado ACTIVO en el parqueadero,',
        when: 'el operador intenta registrar un nuevo ingreso con la misma placa,',
        then: 'el sistema bloquea el registro y muestra un mensaje de advertencia: "El vehículo ya se encuentra registrado actualmente dentro del parqueadero".'
      }
    ],
    businessRules: [
      'La placa debe limpiarse de caracteres especiales y convertirse a mayúsculas automáticamente.',
      'No se permiten registros duplicados simultáneos para una misma placa.'
    ]
  },
  {
    id: 'HU-02',
    epic: 'ENTRADA_SALIDA',
    epicTitle: 'Gestión de Entrada y Salida',
    title: 'Detección automática y exoneración de mensualistas al ingresar',
    role: 'Operador de taquilla',
    action: 'que el sistema reconozca automáticamente si la placa ingresada corresponde a un cliente con suscripción de mensualidad activa',
    benefit: 'asociar el servicio a su contrato vigente, exonerarlo de la tarifa por horas ($0 COP) y agilizar el paso por la talanquera.',
    priority: 'ALTA',
    storyPoints: 5,
    relatedRF: ['RF-ES-01'],
    acceptanceCriteria: [
      {
        scenario: 'Abonado mensualista al día ingresa al parqueadero',
        given: 'que el cliente Carlos Restrepo tiene un contrato activo con la placa "HNE612",',
        when: 'el operador digita "HNE612" en la casilla de entrada,',
        then: 'el sistema autocompleta el nombre del titular, marca el servicio como "MENSUALIDAD" y preselecciona su celda fija reservada.'
      },
      {
        scenario: 'Abonado con mensualidad vencida intenta ingresar',
        given: 'que la placa "DSO704" pertenece a un contrato con fecha de vencimiento superada,',
        when: 'el operador ingresa la placa,',
        then: 'el sistema emite una alerta indicando que la mensualidad está vencida y ofrece registrar el paso como ocasional o cobrar la renovación.'
      }
    ],
    businessRules: [
      'Un contrato se considera ACTIVO hasta las 23:59 del día de su fecha de vencimiento pactada.'
    ]
  },
  {
    id: 'HU-03',
    epic: 'ENTRADA_SALIDA',
    epicTitle: 'Gestión de Entrada y Salida',
    title: 'Asignación y reserva inteligente de celda según tipología',
    role: 'Operador de patio',
    action: 'que el sistema me filtre y sugiera las celdas disponibles compatibles con el tipo de vehículo (Automóvil, Moto, Camioneta o Bicicleta)',
    benefit: 'evitar que un vehículo grande ocupe un espacio reducido o que una moto ocupe una celda de automóvil, optimizando el aforo total.',
    priority: 'ALTA',
    storyPoints: 3,
    relatedRF: ['RF-ES-02'],
    acceptanceCriteria: [
      {
        scenario: 'Filtro automático para motocicletas',
        given: 'que se selecciona el tipo de vehículo "MOTO",',
        when: 'se despliega el listado de celdas disponibles,',
        then: 'únicamente se listan las celdas libres de la "Zona B · Motos" (ej. B-02, B-05).'
      },
      {
        scenario: 'Aforo completo para una categoría',
        given: 'que todas las celdas de una zona se encuentran en estado OCUPADA o MANTENIMIENTO,',
        when: 'se intenta registrar un vehículo de ese tipo,',
        then: 'el sistema deshabilita el botón de confirmación y emite una alerta de aforo completo.'
      }
    ],
    businessRules: [
      'Automóviles no pueden ser asignados a Zona B.',
      'Celdas en estado MANTENIMIENTO quedan excluidas del selector.'
    ]
  },
  {
    id: 'HU-04',
    epic: 'ENTRADA_SALIDA',
    epicTitle: 'Gestión de Entrada y Salida',
    title: 'Inspección de ingreso y custodia de pertenencias',
    role: 'Operador de recepción',
    action: 'registrar observaciones sobre el estado físico inicial del automotor (rayones previos, golpes, llaves o cascos dejados en custodia)',
    benefit: 'dejar constancia escrita en el ticket de entrada y blindar al parqueadero frente a reclamaciones injustificadas al momento del retiro.',
    priority: 'MEDIA',
    storyPoints: 3,
    relatedRF: ['RF-ES-03'],
    acceptanceCriteria: [
      {
        scenario: 'Registro de novedad física previa en recepción',
        given: 'que un automóvil ingresa con un raspón en el guardabarros trasero,',
        when: 'el operador escribe "Raspón en guardabarros trasero derecho" en el campo de inspección,',
        then: 'dicha anotación queda impresa en el ticket de entrada y vinculada al registro activo en patio.'
      }
    ],
    businessRules: [
      'Conforme a la Ley 1480 de 2011, la empresa sólo responde por daños acaecidos bajo custodia que no consten en el ticket de ingreso.'
    ]
  },
  {
    id: 'HU-05',
    epic: 'ENTRADA_SALIDA',
    epicTitle: 'Gestión de Entrada y Salida',
    title: 'Emisión e impresión de ticket de ingreso físico y digital',
    role: 'Cliente del parqueadero',
    action: 'recibir un ticket de entrada físico o digital con los datos completos del establecimiento, fecha/hora y número de celda',
    benefit: 'tener un comprobante legal de custodia de mi vehículo para reclamarlo a la salida y validar la hora exacta de ingreso.',
    priority: 'ALTA',
    storyPoints: 3,
    relatedRF: ['RF-ES-04'],
    acceptanceCriteria: [
      {
        scenario: 'Generación inmediata del ticket',
        given: 'que se completa satisfactoriamente el formulario de entrada,',
        when: 'el sistema procesa la transacción,',
        then: 'se abre automáticamente la vista previa del ticket térmico con NIT, placa en tipografía destacada, celda, timestamp y código QR.'
      }
    ],
    businessRules: [
      'El número de ticket debe ser único e incremental con prefijo corporativo (PAC-2026-XXXX).'
    ]
  },
  {
    id: 'HU-06',
    epic: 'ENTRADA_SALIDA',
    epicTitle: 'Gestión de Entrada y Salida',
    title: 'Búsqueda ágil y liquidación automática de tiempo para salida',
    role: 'Cajero de salida',
    action: 'buscar rápidamente un vehículo por placa o ticket y que el sistema calcule el tiempo exacto transcurrido y la tarifa a cobrar',
    benefit: 'eliminar errores humanos de cálculo manual, aplicar el tiempo de gracia y acelerar la atención en la cabina de salida.',
    priority: 'ALTA',
    storyPoints: 5,
    relatedRF: ['RF-ES-05', 'RF-ES-06'],
    acceptanceCriteria: [
      {
        scenario: 'Liquidación de vehículo ocasional con permanencia superior a 1 hora',
        given: 'un automóvil que ingresó hace 2 horas y 15 minutos con tarifa de $4.000 COP/hora,',
        when: 'el cajero selecciona la salida del vehículo,',
        then: 'el sistema liquida 3 horas facturables por un valor total de $12.000 COP.'
      },
      {
        scenario: 'Salida de vehículo dentro del tiempo de gracia (15 minutos)',
        given: 'un vehículo que ingresó hace 10 minutos por equivocación o retiro rápido,',
        when: 'se consulta su salida,',
        then: 'el sistema marca $0 COP a pagar por concepto de periodo de gracia.'
      },
      {
        scenario: 'Salida de un cliente mensualista',
        given: 'un abonado mensualista con suscripción al día,',
        when: 'se registra su salida,',
        then: 'el sistema muestra tarifa $0 COP amparada en su plan de mensualidad.'
      }
    ],
    businessRules: [
      'El periodo de gracia estándar es de 15 minutos libres de costo.',
      'Las fracciones de hora posteriores a la base se liquidan conforme a la tarifa horaria parametrizada.'
    ]
  },
  {
    id: 'HU-07',
    epic: 'ENTRADA_SALIDA',
    epicTitle: 'Gestión de Entrada y Salida',
    title: 'Cobro multimedio y cálculo automático de devuelta',
    role: 'Cajero del parqueadero',
    action: 'registrar el pago seleccionando Efectivo, Nequi, Daviplata, Tarjetas o Transferencia y disponer de una calculadora automática de cambio',
    benefit: 'agilizar la transacción monetaria, evitar descuadres de caja y brindar comodidad al cliente con medios de pago digitales.',
    priority: 'ALTA',
    storyPoints: 5,
    relatedRF: ['RF-ES-07'],
    acceptanceCriteria: [
      {
        scenario: 'Pago en efectivo con cálculo de devuelta',
        given: 'un cobro de salida por $8.000 COP en efectivo,',
        when: 'el cajero ingresa un billete recibido de $20.000 COP,',
        then: 'el sistema calcula y resalta una devuelta de $12.000 COP.'
      },
      {
        scenario: 'Pago con billeteras digitales Nequi o Daviplata',
        given: 'que el cliente transfiere desde su celular a la cuenta del parqueadero,',
        when: 'el cajero selecciona "Nequi" o "Daviplata",',
        then: 'el sistema registra el pago bajo dicho medio sin exigir ingreso de efectivo.'
      }
    ],
    businessRules: [
      'El monto recibido en efectivo no puede ser inferior al total liquidado a pagar.'
    ]
  },
  {
    id: 'HU-08',
    epic: 'ENTRADA_SALIDA',
    epicTitle: 'Gestión de Entrada y Salida',
    title: 'Liberación de celda y actualización del aforo en tiempo real',
    role: 'Sistema de control',
    action: 'liberar automáticamente la celda ocupada tan pronto se confirme el pago o salida del vehículo',
    benefit: 'reflejar la disponibilidad en el mapa de celdas y en el contador de aforo sin requerir recargar la pantalla.',
    priority: 'ALTA',
    storyPoints: 3,
    relatedRF: ['RF-ES-08'],
    acceptanceCriteria: [
      {
        scenario: 'Liberación inmediata de celda general',
        given: 'que el vehículo en la celda A-06 finaliza su salida,',
        when: 'se confirma la transacción,',
        then: 'la celda A-06 cambia a color verde ("DISPONIBLE") y el contador de celdas libres se incrementa en 1.'
      },
      {
        scenario: 'Salida de vehículo en celda fija reservada a mensualista',
        given: 'que un abonado mensualista con celda exclusiva A-04 sale del parqueadero,',
        when: 'se registra la salida,',
        then: 'la celda A-04 retorna a estado "RESERVADA_MENSUAL" conservando la reserva para dicho titular.'
      }
    ],
    businessRules: [
      'Las celdas reservadas a mensualistas no deben quedar como libres generales al desocuparse.'
    ]
  },
  {
    id: 'HU-09',
    epic: 'ENTRADA_SALIDA',
    epicTitle: 'Gestión de Entrada y Salida',
    title: 'Emisión de recibo fiscal de caja de salida',
    role: 'Cliente y Administrador',
    action: 'emitir e imprimir un recibo oficial de caja con número consecutivo, placa, tiempo y medio de pago',
    benefit: 'entregar al cliente un soporte de su gasto y mantener un libro de transacciones inmutable para auditoría contable.',
    priority: 'ALTA',
    storyPoints: 3,
    relatedRF: ['RF-ES-09'],
    acceptanceCriteria: [
      {
        scenario: 'Impresión de recibo de caja',
        given: 'un cobro de salida finalizado por valor de $10.000 COP,',
        when: 'el cajero pulsa "Imprimir Recibo",',
        then: 'se genera el documento térmico REC-XXXXXX con los datos fiscales de Autos Colombia, placa y duración.'
      }
    ],
    businessRules: [
      'Todo recibo emitido queda asentado de forma inmutable en el historial de caja del turno.'
    ]
  },
  {
    id: 'HU-10',
    epic: 'ENTRADA_SALIDA',
    epicTitle: 'Gestión de Entrada y Salida',
    title: 'Alerta preventiva de novedades pendientes al registrar salida',
    role: 'Operador de salida',
    action: 'que el sistema me alerte visiblemente si el vehículo que va a salir tiene novedades registradas (luces encendidas, fugas de fluidos o daños reportados)',
    benefit: 'notificar oportunamente al conductor antes de que abandone las instalaciones y verificar el estado del vehículo en su presencia.',
    priority: 'MEDIA',
    storyPoints: 3,
    relatedRF: ['RF-ES-10'],
    acceptanceCriteria: [
      {
        scenario: 'Vehículo con novedad activa intenta salir',
        given: 'que el vehículo HNE612 tiene la novedad NOV-101 (Luces encendidas) en estado NOTIFICADO,',
        when: 'el cajero abre el modal de salida,',
        then: 'se despliega un banner de advertencia en color ámbar con el código y detalle de la novedad.'
      }
    ],
    businessRules: [
      'Las novedades de severidad ALTA deben ser verificadas verbalmente con el conductor antes de abrir la talanquera.'
    ]
  },

  // --- ÉPICA: GESTIÓN DE CELDAS Y CAPACIDAD ---
  {
    id: 'HU-11',
    epic: 'CELDAS',
    epicTitle: 'Gestión de Celdas',
    title: 'Visualización del mapa interactivo de celdas en tiempo real',
    role: 'Supervisor de patio',
    action: 'visualizar el mapa topográfico de celdas agrupadas por zonas (Autos, Motos, Camionetas) con códigos de colores',
    benefit: 'identificar de un vistazo el aforo general, ubicar celdas desocupadas y dirigir los vehículos entrantes con precisión.',
    priority: 'ALTA',
    storyPoints: 5,
    relatedRF: ['RF-ES-02'],
    acceptanceCriteria: [
      {
        scenario: 'Inspección de estado de celda desde el mapa',
        given: 'que el operador hace clic sobre la celda A-01 (OCUPADA),',
        when: 'se abre la ventana de detalle,',
        then: 'muestra la placa del vehículo estacionado, el tiempo de permanencia y el botón para liquidar salida directa.'
      }
    ],
    businessRules: [
      'Verde: Disponible, Azul Oscuro: Ocupada, Púrpura: Reservada Mensual, Ámbar: Mantenimiento.'
    ]
  },
  {
    id: 'HU-12',
    epic: 'CELDAS',
    epicTitle: 'Gestión de Celdas',
    title: 'Inhabilitación temporal de celdas por mantenimiento',
    role: 'Administrador de infraestructura',
    action: 'marcar una celda en estado MANTENIMIENTO con una nota explicativa',
    benefit: 'evitar que los operadores asignen vehículos a espacios en labores de pintura, reparación de sensores o filtraciones.',
    priority: 'MEDIA',
    storyPoints: 2,
    relatedRF: ['RF-ES-02'],
    acceptanceCriteria: [
      {
        scenario: 'Poner celda en mantenimiento',
        given: 'que la celda A-08 necesita pintura de piso,',
        when: 'se pulsa "Mantenimiento" en su detalle,',
        then: 'su estado cambia a MANTENIMIENTO y queda excluida del selector de nuevas entradas.'
      }
    ],
    businessRules: [
      'Solo se puede poner en mantenimiento una celda que no esté ocupada por un vehículo.'
    ]
  },

  // --- ÉPICA: GESTIÓN DE USUARIOS MENSUALISTAS ---
  {
    id: 'HU-13',
    epic: 'MENSUALISTAS',
    epicTitle: 'Usuarios y Mensualistas',
    title: 'Registro y suscripción de clientes mensualistas',
    role: 'Administrador del parqueadero',
    action: 'afiliar un nuevo cliente ingresando sus datos personales, vehículos vinculados, tipo de plan y celda asignada',
    benefit: 'establecer contratos de fidelización mensual, asegurar ingresos recurrentes y automatizar el control de acceso de sus automotores.',
    priority: 'ALTA',
    storyPoints: 5,
    relatedRF: ['RF-ES-01'],
    acceptanceCriteria: [
      {
        scenario: 'Creación de mensualista con pago inicial',
        given: 'un nuevo cliente con vehículo placa "ABC123" y canon de $185.000 COP,',
        when: 'se guarda el registro con opción de pago inicial activada,',
        then: 'el cliente queda en estado "Al Día", su vigencia inicia por 1 mes y se expide el recibo de caja de mensualidad.'
      }
    ],
    businessRules: [
      'Cada vehículo asociado al mensualista debe tener una placa única válida.',
      'Los datos se amparan bajo la Ley 1581 de 2012 (Habeas Data).'
    ]
  },
  {
    id: 'HU-14',
    epic: 'MENSUALISTAS',
    epicTitle: 'Usuarios y Mensualistas',
    title: 'Monitoreo de vencimientos y renovación periódica',
    role: 'Encargado de cobranzas',
    action: 'filtrar abonados por estado ("Por Vencer" y "Vencidas") y renovar contratos por 1 a 6 meses con un solo clic',
    benefit: 'realizar gestión oportuna de cobro, evitar cartera vencida y extender automáticamente la fecha de corte.',
    priority: 'ALTA',
    storyPoints: 3,
    relatedRF: ['RF-ES-01', 'RF-ES-07'],
    acceptanceCriteria: [
      {
        scenario: 'Renovación de mensualidad por 1 mes',
        given: 'un cliente cuya suscripción vence el 25 de octubre,',
        when: 'se procesa la renovación por 1 mes con pago por Transferencia Bancolombia,',
        then: 'la nueva fecha de corte se extiende automáticamente al 25 de noviembre y se genera el recibo REC-XXXXXX.'
      }
    ],
    businessRules: [
      'Un contrato se clasifica como "POR VENCER" si restan 5 o menos días para su fecha de corte.'
    ]
  },

  // --- ÉPICA: REGISTRO Y CUSTODIA DE NOVEDADES ---
  {
    id: 'HU-15',
    epic: 'NOVEDADES',
    epicTitle: 'Novedades e Incidencias',
    title: 'Registro formal de novedades ocurridas sobre vehículos',
    role: 'Supervisor o vigilante de turno',
    action: 'reportar una incidencia vinculada a una placa (fugas de líquidos, luces encendidas, alarma activada o rayones) indicando la severidad',
    benefit: 'mantener un libro de novedades auditable, contactar oportunamente al dueño y registrar las acciones tomadas para resolverla.',
    priority: 'ALTA',
    storyPoints: 3,
    relatedRF: ['RF-ES-03', 'RF-ES-10'],
    acceptanceCriteria: [
      {
        scenario: 'Reporte de luces encendidas en patio',
        given: 'que durante la ronda de vigilancia se detecta un carro con luces exploradoras activadas,',
        when: 'se ingresa la placa y se guarda la novedad con severidad MEDIA,',
        then: 'se le asigna el código NOV-XXX, se enlaza al vehículo activo y se notifica en el panel de patio.'
      }
    ],
    businessRules: [
      'Toda novedad debe incluir descripción, responsable que reporta y timestamp.'
    ]
  },
  {
    id: 'HU-16',
    epic: 'NOVEDADES',
    epicTitle: 'Novedades e Incidencias',
    title: 'Cierre y solución de incidencias con constancia de gestión',
    role: 'Operador de servicio',
    action: 'marcar una novedad como "RESUELTA" ingresando las notas de solución acordadas con el cliente',
    benefit: 'garantizar que ninguna incidencia quede sin atender y documentar la conformidad del propietario.',
    priority: 'MEDIA',
    storyPoints: 2,
    relatedRF: ['RF-ES-10'],
    acceptanceCriteria: [
      {
        scenario: 'Solución de novedad de objeto en custodia',
        given: 'una novedad de casco o impermeable dejado en moto,',
        when: 'el cliente reclama su pertenencia y el operador ingresa "Entregado a satisfacción",',
        then: 'la novedad pasa a estado "RESUELTA" con fecha y hora de solución.'
      }
    ],
    businessRules: [
      'Una novedad resuelta no puede ser eliminada del libro de custodia.'
    ]
  },

  // --- ÉPICA: CONTROL DE PAGOS Y CAJA DIARIA ---
  {
    id: 'HU-17',
    epic: 'PAGOS',
    epicTitle: 'Pagos y Caja',
    title: 'Arqueo de caja diario con desglose por medios de pago',
    role: 'Administrador de caja',
    action: 'consultar el consolidado de recaudo del día separado por Efectivo físico, Nequi, Daviplata, Tarjetas y Bancolombia',
    benefit: 'realizar el cierre de turno y cuadre de caja sin discrepancias y transferir los fondos correspondientes.',
    priority: 'ALTA',
    storyPoints: 3,
    relatedRF: ['RF-ES-07', 'RF-ES-09'],
    acceptanceCriteria: [
      {
        scenario: 'Consulta de arqueo al cierre de turno',
        given: 'que se han registrado 5 cobros de salida y 2 pagos de mensualidades en el día,',
        when: 'el administrador ingresa al módulo de Pagos,',
        then: 'los contadores de Efectivo, Billeteras digitales y Tarjetas reflejan exactamente la sumatoria de las transacciones asentadas.'
      }
    ],
    businessRules: [
      'Los totales se actualizan en tiempo real tras cada liquidación.'
    ]
  },
  {
    id: 'HU-18',
    epic: 'PAGOS',
    epicTitle: 'Pagos y Caja',
    title: 'Consulta histórica y reimpresión de recibos de caja',
    role: 'Auditor contable o cajero',
    action: 'filtrar el historial de recibos por número consecutivo, placa o fecha y reimprimir cualquier comprobante previo',
    benefit: 'atender solicitudes de clientes que requieren copia para legalización de viáticos o contabilidad empresarial.',
    priority: 'MEDIA',
    storyPoints: 2,
    relatedRF: ['RF-ES-09'],
    acceptanceCriteria: [
      {
        scenario: 'Reimpresión de recibo pasado',
        given: 'un pago registrado con número REC-008920,',
        when: 'se busca por "8920" y se presiona "Comprobante",',
        then: 'se renderiza el formato idéntico original listo para imprimir.'
      }
    ],
    businessRules: [
      'Los recibos archivados son de solo lectura para preservar la trazabilidad fiscal.'
    ]
  }
];
