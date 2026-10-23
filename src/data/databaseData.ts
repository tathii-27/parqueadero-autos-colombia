export interface TableColumn {
  name: string;
  type: string;
  isPk: boolean;
  isFk: boolean;
  fkTarget?: string;
  nullable: boolean;
  defaultValue?: string;
  description: string;
}

export interface RelationalTable {
  tableName: string;
  logicalName: string;
  description: string;
  columns: TableColumn[];
  primaryKey: string[];
  foreignKeys: {
    column: string;
    targetTable: string;
    targetColumn: string;
    onDelete: string;
    onUpdate: string;
  }[];
}

export const RELATIONAL_TABLES: RelationalTable[] = [
  {
    tableName: 'USUARIOS_MENSUALISTAS',
    logicalName: 'Usuario Mensualista (Abonado)',
    description: 'Registra a los clientes recurrentes que contratan servicio de estacionamiento por mensualidad.',
    primaryKey: ['id_usuario'],
    foreignKeys: [],
    columns: [
      { name: 'id_usuario', type: 'UUID', isPk: true, isFk: false, nullable: false, defaultValue: 'gen_random_uuid()', description: 'Clave primaria artificial' },
      { name: 'tipo_documento', type: 'VARCHAR(10)', isPk: false, isFk: false, nullable: false, description: 'CC, CE, NIT, PAS' },
      { name: 'numero_documento', type: 'VARCHAR(25)', isPk: false, isFk: false, nullable: false, description: 'Identificación fiscal única' },
      { name: 'nombres', type: 'VARCHAR(60)', isPk: false, isFk: false, nullable: false, description: 'Nombres del cliente' },
      { name: 'apellidos', type: 'VARCHAR(60)', isPk: false, isFk: false, nullable: false, description: 'Apellidos del cliente' },
      { name: 'telefono', type: 'VARCHAR(20)', isPk: false, isFk: false, nullable: false, description: 'Teléfono de contacto móvil' },
      { name: 'email', type: 'VARCHAR(100)', isPk: false, isFk: false, nullable: false, description: 'Correo para avisos y facturas' },
      { name: 'estado', type: 'VARCHAR(20)', isPk: false, isFk: false, nullable: false, defaultValue: "'ACTIVO'", description: 'ACTIVO, MOROSO, INACTIVO' },
      { name: 'creado_en', type: 'TIMESTAMP', isPk: false, isFk: false, nullable: false, defaultValue: 'CURRENT_TIMESTAMP', description: 'Fecha de alta' }
    ]
  },
  {
    tableName: 'VEHICULOS',
    logicalName: 'Vehículo (Automotor)',
    description: 'Catálogo de automotores que ingresan al parqueadero o pertenecen a mensualistas.',
    primaryKey: ['placa'],
    foreignKeys: [
      { column: 'id_usuario_propietario', targetTable: 'USUARIOS_MENSUALISTAS', targetColumn: 'id_usuario', onDelete: 'SET NULL', onUpdate: 'CASCADE' }
    ],
    columns: [
      { name: 'placa', type: 'VARCHAR(8)', isPk: true, isFk: false, nullable: false, description: 'Placa colombiana formato AAA000 / AAA00A' },
      { name: 'tipo_vehiculo', type: 'VARCHAR(20)', isPk: false, isFk: false, nullable: false, description: 'AUTOMOVIL, MOTOCICLETA, CAMIONETA, PESADO' },
      { name: 'marca', type: 'VARCHAR(40)', isPk: false, isFk: false, nullable: false, description: 'Marca (Mazda, Chevrolet, etc.)' },
      { name: 'modelo', type: 'VARCHAR(40)', isPk: false, isFk: false, nullable: false, description: 'Línea y año de fabricación' },
      { name: 'color', type: 'VARCHAR(30)', isPk: false, isFk: false, nullable: false, description: 'Color predominante de carrocería' },
      { name: 'id_usuario_propietario', type: 'UUID', isPk: false, isFk: true, fkTarget: 'USUARIOS_MENSUALISTAS.id_usuario', nullable: true, description: 'FK opcional si pertenece a un mensualista' },
      { name: 'creado_en', type: 'TIMESTAMP', isPk: false, isFk: false, nullable: false, defaultValue: 'CURRENT_TIMESTAMP', description: 'Fecha de primer registro' }
    ]
  },
  {
    tableName: 'CELDAS_PARQUEO',
    logicalName: 'Celda de Parqueo (Bahía)',
    description: 'Espacios físicos delimitados dentro de las instalaciones del parqueadero.',
    primaryKey: ['id_celda'],
    foreignKeys: [
      { column: 'usuario_reservado_id', targetTable: 'USUARIOS_MENSUALISTAS', targetColumn: 'id_usuario', onDelete: 'SET NULL', onUpdate: 'CASCADE' }
    ],
    columns: [
      { name: 'id_celda', type: 'VARCHAR(10)', isPk: true, isFk: false, nullable: false, description: 'Código único de celda (ej: A-01, B-12, M-05)' },
      { name: 'zona', type: 'VARCHAR(20)', isPk: false, isFk: false, nullable: false, description: 'Zona A (Piso 1), Zona B (Piso 2), Zona M (Motos)' },
      { name: 'tipo_permitido', type: 'VARCHAR(20)', isPk: false, isFk: false, nullable: false, description: 'AUTOMOVIL, MOTOCICLETA, CAMIONETA, PESADO' },
      { name: 'estado', type: 'VARCHAR(20)', isPk: false, isFk: false, nullable: false, defaultValue: "'DISPONIBLE'", description: 'DISPONIBLE, OCUPADA, RESERVADA, MANTENIMIENTO' },
      { name: 'placa_actual', type: 'VARCHAR(8)', isPk: false, isFk: false, nullable: true, description: 'Placa del vehículo que ocupa la celda en tiempo real' },
      { name: 'usuario_reservado_id', type: 'UUID', isPk: false, isFk: true, fkTarget: 'USUARIOS_MENSUALISTAS.id_usuario', nullable: true, description: 'FK si la celda es fija para un mensualista' }
    ]
  },
  {
    tableName: 'SUSCRIPCIONES_MENSUALES',
    logicalName: 'Suscripción Mensual (Contrato)',
    description: 'Contratos vigentes de estacionamiento mensual con fecha de corte.',
    primaryKey: ['id_suscripcion'],
    foreignKeys: [
      { column: 'id_usuario', targetTable: 'USUARIOS_MENSUALISTAS', targetColumn: 'id_usuario', onDelete: 'RESTRICT', onUpdate: 'CASCADE' },
      { column: 'id_celda_asignada', targetTable: 'CELDAS_PARQUEO', targetColumn: 'id_celda', onDelete: 'RESTRICT', onUpdate: 'CASCADE' }
    ],
    columns: [
      { name: 'id_suscripcion', type: 'UUID', isPk: true, isFk: false, nullable: false, defaultValue: 'gen_random_uuid()', description: 'Identificador único del contrato' },
      { name: 'id_usuario', type: 'UUID', isPk: false, isFk: true, fkTarget: 'USUARIOS_MENSUALISTAS.id_usuario', nullable: false, description: 'FK del mensualista' },
      { name: 'id_celda_asignada', type: 'VARCHAR(10)', isPk: false, isFk: true, fkTarget: 'CELDAS_PARQUEO.id_celda', nullable: false, description: 'FK de la celda fija pactada' },
      { name: 'fecha_inicio', type: 'DATE', isPk: false, isFk: false, nullable: false, description: 'Día de inicio del ciclo' },
      { name: 'fecha_vencimiento', type: 'DATE', isPk: false, isFk: false, nullable: false, description: 'Día límite de pago / vencimiento' },
      { name: 'canon_mensual', type: 'DECIMAL(12,2)', isPk: false, isFk: false, nullable: false, description: 'Valor del canon pactado en COP' },
      { name: 'estado', type: 'VARCHAR(20)', isPk: false, isFk: false, nullable: false, defaultValue: "'VIGENTE'", description: 'VIGENTE, VENCIDA, CANCELADA' },
      { name: 'dia_corte', type: 'SMALLINT', isPk: false, isFk: false, nullable: false, defaultValue: '5', description: 'Día del mes para corte' }
    ]
  },
  {
    tableName: 'ENTRADAS_VEHICULOS',
    logicalName: 'Entrada y Estadía Vehicular',
    description: 'Registro transaccional de ingresos y salidas con control de tiempo y tickets.',
    primaryKey: ['id_entrada'],
    foreignKeys: [
      { column: 'placa', targetTable: 'VEHICULOS', targetColumn: 'placa', onDelete: 'RESTRICT', onUpdate: 'CASCADE' },
      { column: 'id_celda', targetTable: 'CELDAS_PARQUEO', targetColumn: 'id_celda', onDelete: 'RESTRICT', onUpdate: 'CASCADE' }
    ],
    columns: [
      { name: 'id_entrada', type: 'UUID', isPk: true, isFk: false, nullable: false, defaultValue: 'gen_random_uuid()', description: 'Identificador transaccional' },
      { name: 'numero_ticket', type: 'VARCHAR(20)', isPk: false, isFk: false, nullable: false, description: 'Consecutivo térmico PAC-2026-XXXX' },
      { name: 'placa', type: 'VARCHAR(8)', isPk: false, isFk: true, fkTarget: 'VEHICULOS.placa', nullable: false, description: 'FK de la placa del vehículo' },
      { name: 'tipo_servicio', type: 'VARCHAR(20)', isPk: false, isFk: false, nullable: false, defaultValue: "'ROTATIVO'", description: 'ROTATIVO, MENSUALIDAD, CONVENIO' },
      { name: 'id_celda', type: 'VARCHAR(10)', isPk: false, isFk: true, fkTarget: 'CELDAS_PARQUEO.id_celda', nullable: false, description: 'FK de la celda ocupada' },
      { name: 'hora_entrada', type: 'TIMESTAMP', isPk: false, isFk: false, nullable: false, description: 'Marca de tiempo al ingresar' },
      { name: 'hora_salida', type: 'TIMESTAMP', isPk: false, isFk: false, nullable: true, description: 'Marca de tiempo al egresar' },
      { name: 'notas_inspeccion', type: 'TEXT', isPk: false, isFk: false, nullable: true, description: 'Observaciones al momento de entrar' },
      { name: 'total_minutos', type: 'INTEGER', isPk: false, isFk: false, nullable: true, description: 'Minutos liquidados de permanencia' },
      { name: 'monto_liquidado', type: 'DECIMAL(12,2)', isPk: false, isFk: false, nullable: false, defaultValue: '0.00', description: 'Valor total cobrado en COP' },
      { name: 'estado', type: 'VARCHAR(20)', isPk: false, isFk: false, nullable: false, defaultValue: "'ACTIVO'", description: 'ACTIVO, LIQUIDADO, ANULADO' },
      { name: 'operador_entrada', type: 'VARCHAR(60)', isPk: false, isFk: false, nullable: false, description: 'Usuario que recibió el carro' }
    ]
  },
  {
    tableName: 'NOVEDADES_VEHICULOS',
    logicalName: 'Novedad e Incidente Vehicular',
    description: 'Bitácora legal de daños, golpes, rayones preexistentes o percances en patio.',
    primaryKey: ['id_novedad'],
    foreignKeys: [
      { column: 'placa', targetTable: 'VEHICULOS', targetColumn: 'placa', onDelete: 'RESTRICT', onUpdate: 'CASCADE' },
      { column: 'id_entrada', targetTable: 'ENTRADAS_VEHICULOS', targetColumn: 'id_entrada', onDelete: 'SET NULL', onUpdate: 'CASCADE' },
      { column: 'id_celda', targetTable: 'CELDAS_PARQUEO', targetColumn: 'id_celda', onDelete: 'SET NULL', onUpdate: 'CASCADE' }
    ],
    columns: [
      { name: 'id_novedad', type: 'UUID', isPk: true, isFk: false, nullable: false, defaultValue: 'gen_random_uuid()', description: 'Clave primaria' },
      { name: 'codigo_novedad', type: 'VARCHAR(20)', isPk: false, isFk: false, nullable: false, description: 'Consecutivo NOV-XXX' },
      { name: 'placa', type: 'VARCHAR(8)', isPk: false, isFk: true, fkTarget: 'VEHICULOS.placa', nullable: false, description: 'FK del vehículo afectado' },
      { name: 'id_entrada', type: 'UUID', isPk: false, isFk: true, fkTarget: 'ENTRADAS_VEHICULOS.id_entrada', nullable: true, description: 'FK opcional de la estadía asociada' },
      { name: 'id_celda', type: 'VARCHAR(10)', isPk: false, isFk: true, fkTarget: 'CELDAS_PARQUEO.id_celda', nullable: true, description: 'FK de la celda donde ocurrió' },
      { name: 'tipo_novedad', type: 'VARCHAR(30)', isPk: false, isFk: false, nullable: false, description: 'RAYON_GOLPE, FUGA_LIQUIDOS, LUCES_ENCENDIDAS, ALARMA, OTRO' },
      { name: 'severidad', type: 'VARCHAR(10)', isPk: false, isFk: false, nullable: false, description: 'BAJA, MEDIA, ALTA' },
      { name: 'descripcion', type: 'TEXT', isPk: false, isFk: false, nullable: false, description: 'Relato circunstancial del hecho' },
      { name: 'foto_evidencia_url', type: 'VARCHAR(255)', isPk: false, isFk: false, nullable: true, description: 'Enlace a imagen de evidencia' },
      { name: 'reportado_por', type: 'VARCHAR(60)', isPk: false, isFk: false, nullable: false, description: 'Operador o vigilante' },
      { name: 'fecha_reporte', type: 'TIMESTAMP', isPk: false, isFk: false, nullable: false, defaultValue: 'CURRENT_TIMESTAMP', description: 'Fecha y hora del reporte' },
      { name: 'estado', type: 'VARCHAR(20)', isPk: false, isFk: false, nullable: false, defaultValue: "'PENDIENTE'", description: 'PENDIENTE, NOTIFICADO, RESUELTA' }
    ]
  },
  {
    tableName: 'PAGOS',
    logicalName: 'Pago y Recaudo de Caja',
    description: 'Asiento contable inmutable del dinero recaudado por estadías o mensualidades.',
    primaryKey: ['id_pago'],
    foreignKeys: [
      { column: 'id_entrada', targetTable: 'ENTRADAS_VEHICULOS', targetColumn: 'id_entrada', onDelete: 'SET NULL', onUpdate: 'CASCADE' },
      { column: 'id_suscripcion', targetTable: 'SUSCRIPCIONES_MENSUALES', targetColumn: 'id_suscripcion', onDelete: 'SET NULL', onUpdate: 'CASCADE' }
    ],
    columns: [
      { name: 'id_pago', type: 'UUID', isPk: true, isFk: false, nullable: false, defaultValue: 'gen_random_uuid()', description: 'Clave primaria inmutable' },
      { name: 'numero_recibo', type: 'VARCHAR(25)', isPk: false, isFk: false, nullable: false, description: 'Consecutivo fiscal REC-XXXXXX' },
      { name: 'id_entrada', type: 'UUID', isPk: false, isFk: true, fkTarget: 'ENTRADAS_VEHICULOS.id_entrada', nullable: true, description: 'FK si liquida parqueo rotativo' },
      { name: 'id_suscripcion', type: 'UUID', isPk: false, isFk: true, fkTarget: 'SUSCRIPCIONES_MENSUALES.id_suscripcion', nullable: true, description: 'FK si liquida canon mensual' },
      { name: 'fecha_pago', type: 'TIMESTAMP', isPk: false, isFk: false, nullable: false, defaultValue: 'CURRENT_TIMESTAMP', description: 'Timestamp exacto del cobro' },
      { name: 'concepto', type: 'VARCHAR(30)', isPk: false, isFk: false, nullable: false, description: 'PARQUEO_ROTATIVO, CANON_MENSUAL, RECARGO_NOVEDAD' },
      { name: 'monto', type: 'DECIMAL(12,2)', isPk: false, isFk: false, nullable: false, description: 'Total cobrado en COP' },
      { name: 'medio_pago', type: 'VARCHAR(25)', isPk: false, isFk: false, nullable: false, description: 'EFECTIVO, NEQUI, DAVIPLATA, TARJETA_DEBITO, TARJETA_CREDITO' },
      { name: 'monto_recibido', type: 'DECIMAL(12,2)', isPk: false, isFk: false, nullable: true, description: 'Billetes entregados por cliente' },
      { name: 'cambio_entregado', type: 'DECIMAL(12,2)', isPk: false, isFk: false, nullable: true, description: 'Devuelta calculada' },
      { name: 'cajero', type: 'VARCHAR(60)', isPk: false, isFk: false, nullable: false, description: 'Operador de caja responsable' },
      { name: 'estado', type: 'VARCHAR(20)', isPk: false, isFk: false, nullable: false, defaultValue: "'PAGADO'", description: 'PAGADO, ANULADO' }
    ]
  },
  {
    tableName: 'TARIFAS',
    logicalName: 'Tarifario del Parqueadero',
    description: 'Parámetros vigentes de precios por tipo de vehículo y tiempo.',
    primaryKey: ['id_tarifa'],
    foreignKeys: [],
    columns: [
      { name: 'id_tarifa', type: 'SERIAL', isPk: true, isFk: false, nullable: false, description: 'Identificador incremental' },
      { name: 'tipo_vehiculo', type: 'VARCHAR(20)', isPk: false, isFk: false, nullable: false, description: 'AUTOMOVIL, MOTOCICLETA, CAMIONETA, PESADO' },
      { name: 'valor_hora', type: 'DECIMAL(10,2)', isPk: false, isFk: false, nullable: false, description: 'Tarifa por primera hora en COP' },
      { name: 'valor_fraccion_15min', type: 'DECIMAL(10,2)', isPk: false, isFk: false, nullable: false, description: 'Tarifa cada 15 minutos adicionales' },
      { name: 'valor_dia_completo', type: 'DECIMAL(10,2)', isPk: false, isFk: false, nullable: false, description: 'Tope máximo de 24 horas' },
      { name: 'valor_mensualidad', type: 'DECIMAL(12,2)', isPk: false, isFk: false, nullable: false, description: 'Tarifa mensual estándar' },
      { name: 'vigente_desde', type: 'DATE', isPk: false, isFk: false, nullable: false, description: 'Fecha de aprobación de tarifa' },
      { name: 'activo', type: 'BOOLEAN', isPk: false, isFk: false, nullable: false, defaultValue: 'TRUE', description: 'Solo 1 tarifa activa por tipo de vehículo' }
    ]
  }
];

export const SQL_PHYSICAL_DDL = `-- ========================================================================
-- MODELO FÍSICO DE BASE DE DATOS (SQL DDL)
-- PROYECTO: PARQUEADERO AUTOS COLOMBIA
-- INSTITUCIÓN: IU DIGITAL DE ANTIOQUIA
-- AUTORA: TATIANA GALLEGO
-- MOTOR COMPATIBLE: PostgreSQL 14+ / MySQL 8.0+
-- ========================================================================

-- Habilitar extensión para UUIDs en PostgreSQL si aplica
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. TABLA: TARIFAS
CREATE TABLE IF NOT EXISTS TARIFAS (
    id_tarifa SERIAL PRIMARY KEY,
    tipo_vehiculo VARCHAR(20) NOT NULL,
    valor_hora DECIMAL(10,2) NOT NULL CHECK (valor_hora >= 0),
    valor_fraccion_15min DECIMAL(10,2) NOT NULL CHECK (valor_fraccion_15min >= 0),
    valor_dia_completo DECIMAL(10,2) NOT NULL CHECK (valor_dia_completo >= 0),
    valor_mensualidad DECIMAL(12,2) NOT NULL CHECK (valor_mensualidad >= 0),
    vigente_desde DATE NOT NULL DEFAULT CURRENT_DATE,
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    CONSTRAINT chk_tipo_vehiculo_tarifa CHECK (tipo_vehiculo IN ('AUTOMOVIL', 'MOTOCICLETA', 'CAMIONETA', 'PESADO'))
);

-- 2. TABLA: USUARIOS_MENSUALISTAS
CREATE TABLE IF NOT EXISTS USUARIOS_MENSUALISTAS (
    id_usuario UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tipo_documento VARCHAR(10) NOT NULL CHECK (tipo_documento IN ('CC', 'CE', 'NIT', 'PAS')),
    numero_documento VARCHAR(25) NOT NULL UNIQUE,
    nombres VARCHAR(60) NOT NULL,
    apellidos VARCHAR(60) NOT NULL,
    telefono VARCHAR(20) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    estado VARCHAR(20) NOT NULL DEFAULT 'ACTIVO' CHECK (estado IN ('ACTIVO', 'MOROSO', 'INACTIVO')),
    creado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 3. TABLA: VEHICULOS
CREATE TABLE IF NOT EXISTS VEHICULOS (
    placa VARCHAR(8) PRIMARY KEY,
    tipo_vehiculo VARCHAR(20) NOT NULL CHECK (tipo_vehiculo IN ('AUTOMOVIL', 'MOTOCICLETA', 'CAMIONETA', 'PESADO')),
    marca VARCHAR(40) NOT NULL,
    modelo VARCHAR(40) NOT NULL,
    color VARCHAR(30) NOT NULL,
    id_usuario_propietario UUID NULL,
    creado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_vehiculo_propietario FOREIGN KEY (id_usuario_propietario)
        REFERENCES USUARIOS_MENSUALISTAS (id_usuario)
        ON DELETE SET NULL
        ON UPDATE CASCADE
);

-- 4. TABLA: CELDAS_PARQUEO
CREATE TABLE IF NOT EXISTS CELDAS_PARQUEO (
    id_celda VARCHAR(10) PRIMARY KEY,
    zona VARCHAR(20) NOT NULL,
    tipo_permitido VARCHAR(20) NOT NULL CHECK (tipo_permitido IN ('AUTOMOVIL', 'MOTOCICLETA', 'CAMIONETA', 'PESADO')),
    estado VARCHAR(20) NOT NULL DEFAULT 'DISPONIBLE' CHECK (estado IN ('DISPONIBLE', 'OCUPADA', 'RESERVADA', 'MANTENIMIENTO')),
    placa_actual VARCHAR(8) NULL,
    usuario_reservado_id UUID NULL,
    CONSTRAINT fk_celda_usuario_reserva FOREIGN KEY (usuario_reservado_id)
        REFERENCES USUARIOS_MENSUALISTAS (id_usuario)
        ON DELETE SET NULL
        ON UPDATE CASCADE
);

-- 5. TABLA: SUSCRIPCIONES_MENSUALES
CREATE TABLE IF NOT EXISTS SUSCRIPCIONES_MENSUALES (
    id_suscripcion UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    id_usuario UUID NOT NULL,
    id_celda_asignada VARCHAR(10) NOT NULL,
    fecha_inicio DATE NOT NULL,
    fecha_vencimiento DATE NOT NULL,
    canon_mensual DECIMAL(12,2) NOT NULL CHECK (canon_mensual > 0),
    estado VARCHAR(20) NOT NULL DEFAULT 'VIGENTE' CHECK (estado IN ('VIGENTE', 'VENCIDA', 'CANCELADA')),
    dia_corte SMALLINT NOT NULL DEFAULT 5 CHECK (dia_corte BETWEEN 1 AND 28),
    CONSTRAINT fk_suscripcion_usuario FOREIGN KEY (id_usuario)
        REFERENCES USUARIOS_MENSUALISTAS (id_usuario)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,
    CONSTRAINT fk_suscripcion_celda FOREIGN KEY (id_celda_asignada)
        REFERENCES CELDAS_PARQUEO (id_celda)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,
    CONSTRAINT chk_fechas_suscripcion CHECK (fecha_vencimiento >= fecha_inicio)
);

-- 6. TABLA: ENTRADAS_VEHICULOS
CREATE TABLE IF NOT EXISTS ENTRADAS_VEHICULOS (
    id_entrada UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    numero_ticket VARCHAR(20) NOT NULL UNIQUE,
    placa VARCHAR(8) NOT NULL,
    tipo_servicio VARCHAR(20) NOT NULL DEFAULT 'ROTATIVO' CHECK (tipo_servicio IN ('ROTATIVO', 'MENSUALIDAD', 'CONVENIO')),
    id_celda VARCHAR(10) NOT NULL,
    hora_entrada TIMESTAMP NOT NULL,
    hora_salida TIMESTAMP NULL,
    notas_inspeccion TEXT NULL,
    total_minutos INTEGER NULL CHECK (total_minutos IS NULL OR total_minutos >= 0),
    monto_liquidado DECIMAL(12,2) NOT NULL DEFAULT 0.00 CHECK (monto_liquidado >= 0),
    estado VARCHAR(20) NOT NULL DEFAULT 'ACTIVO' CHECK (estado IN ('ACTIVO', 'LIQUIDADO', 'ANULADO')),
    operador_entrada VARCHAR(60) NOT NULL,
    CONSTRAINT fk_entrada_vehiculo FOREIGN KEY (placa)
        REFERENCES VEHICULOS (placa)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,
    CONSTRAINT fk_entrada_celda FOREIGN KEY (id_celda)
        REFERENCES CELDAS_PARQUEO (id_celda)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,
    CONSTRAINT chk_horas_entrada_salida CHECK (hora_salida IS NULL OR hora_salida >= hora_entrada)
);

-- 7. TABLA: NOVEDADES_VEHICULOS
CREATE TABLE IF NOT EXISTS NOVEDADES_VEHICULOS (
    id_novedad UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    codigo_novedad VARCHAR(20) NOT NULL UNIQUE,
    placa VARCHAR(8) NOT NULL,
    id_entrada UUID NULL,
    id_celda VARCHAR(10) NULL,
    tipo_novedad VARCHAR(30) NOT NULL CHECK (tipo_novedad IN ('RAYON_GOLPE', 'FUGA_LIQUIDOS', 'LUCES_ENCENDIDAS', 'ALARMA', 'OTRO')),
    severidad VARCHAR(10) NOT NULL CHECK (severidad IN ('BAJA', 'MEDIA', 'ALTA')),
    descripcion TEXT NOT NULL,
    foto_evidencia_url VARCHAR(255) NULL,
    reportado_por VARCHAR(60) NOT NULL,
    fecha_reporte TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    estado VARCHAR(20) NOT NULL DEFAULT 'PENDIENTE' CHECK (estado IN ('PENDIENTE', 'NOTIFICADO', 'RESUELTA')),
    CONSTRAINT fk_novedad_vehiculo FOREIGN KEY (placa)
        REFERENCES VEHICULOS (placa)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,
    CONSTRAINT fk_novedad_entrada FOREIGN KEY (id_entrada)
        REFERENCES ENTRADAS_VEHICULOS (id_entrada)
        ON DELETE SET NULL
        ON UPDATE CASCADE,
    CONSTRAINT fk_novedad_celda FOREIGN KEY (id_celda)
        REFERENCES CELDAS_PARQUEO (id_celda)
        ON DELETE SET NULL
        ON UPDATE CASCADE
);

-- 8. TABLA: PAGOS
CREATE TABLE IF NOT EXISTS PAGOS (
    id_pago UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    numero_recibo VARCHAR(25) NOT NULL UNIQUE,
    id_entrada UUID NULL,
    id_suscripcion UUID NULL,
    fecha_pago TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    concepto VARCHAR(30) NOT NULL CHECK (concepto IN ('PARQUEO_ROTATIVO', 'CANON_MENSUAL', 'RECARGO_NOVEDAD')),
    monto DECIMAL(12,2) NOT NULL CHECK (monto >= 0),
    medio_pago VARCHAR(25) NOT NULL CHECK (medio_pago IN ('EFECTIVO', 'NEQUI', 'DAVIPLATA', 'TARJETA_DEBITO', 'TARJETA_CREDITO', 'TRANSFERENCIA')),
    monto_recibido DECIMAL(12,2) NULL CHECK (monto_recibido IS NULL OR monto_recibido >= monto),
    cambio_entregado DECIMAL(12,2) NULL CHECK (cambio_entregado IS NULL OR cambio_entregado >= 0),
    cajero VARCHAR(60) NOT NULL,
    estado VARCHAR(20) NOT NULL DEFAULT 'PAGADO' CHECK (estado IN ('PAGADO', 'ANULADO')),
    CONSTRAINT fk_pago_entrada FOREIGN KEY (id_entrada)
        REFERENCES ENTRADAS_VEHICULOS (id_entrada)
        ON DELETE SET NULL
        ON UPDATE CASCADE,
    CONSTRAINT fk_pago_suscripcion FOREIGN KEY (id_suscripcion)
        REFERENCES SUSCRIPCIONES_MENSUALES (id_suscripcion)
        ON DELETE SET NULL
        ON UPDATE CASCADE,
    CONSTRAINT chk_pago_origen CHECK (id_entrada IS NOT NULL OR id_suscripcion IS NOT NULL)
);

-- ========================================================================
-- ÍNDICES DE ALTO RENDIMIENTO (OPTIMIZACIÓN DE CONSULTAS)
-- ========================================================================
CREATE INDEX idx_entradas_placa ON ENTRADAS_VEHICULOS(placa);
CREATE INDEX idx_entradas_estado ON ENTRADAS_VEHICULOS(estado);
CREATE INDEX idx_entradas_ticket ON ENTRADAS_VEHICULOS(numero_ticket);
CREATE INDEX idx_celdas_estado ON CELDAS_PARQUEO(estado);
CREATE INDEX idx_novedades_placa ON NOVEDADES_VEHICULOS(placa);
CREATE INDEX idx_pagos_fecha ON PAGOS(fecha_pago);
CREATE INDEX idx_pagos_recibo ON PAGOS(numero_recibo);
CREATE INDEX idx_suscripciones_usuario ON SUSCRIPCIONES_MENSUALES(id_usuario);
CREATE INDEX idx_suscripciones_vencimiento ON SUSCRIPCIONES_MENSUALES(fecha_vencimiento);

-- ========================================================================
-- DATOS SEMILLA DE PRUEBA (SEED DATA)
-- ========================================================================
INSERT INTO TARIFAS (tipo_vehiculo, valor_hora, valor_fraccion_15min, valor_dia_completo, valor_mensualidad, vigente_desde, activo) VALUES
('AUTOMOVIL', 5000.00, 1500.00, 35000.00, 160000.00, CURRENT_DATE, TRUE),
('MOTOCICLETA', 2500.00, 800.00, 18000.00, 85000.00, CURRENT_DATE, TRUE),
('CAMIONETA', 6000.00, 1800.00, 42000.00, 190000.00, CURRENT_DATE, TRUE),
('PESADO', 10000.00, 3000.00, 75000.00, 320000.00, CURRENT_DATE, TRUE);

INSERT INTO USUARIOS_MENSUALISTAS (id_usuario, tipo_documento, numero_documento, nombres, apellidos, telefono, email, estado) VALUES
('11111111-1111-1111-1111-111111111111', 'CC', '1037654321', 'Carlos', 'Gómez Restrepo', '3004567890', 'carlos.gomez@empresa.com', 'ACTIVO'),
('22222222-2222-2222-2222-222222222222', 'CC', '43890123', 'Mariana', 'Zapata Ospina', '3109876543', 'mariana.zapata@correo.co', 'ACTIVO'),
('33333333-3333-3333-3333-333333333333', 'NIT', '901456789-1', 'Logística del Café SAS', 'Representante', '3201234567', 'contacto@logisticacafe.com', 'MOROSO');

INSERT INTO CELDAS_PARQUEO (id_celda, zona, tipo_permitido, estado, placa_actual, usuario_reservado_id) VALUES
('A-01', 'Zona A (Piso 1)', 'AUTOMOVIL', 'DISPONIBLE', NULL, NULL),
('A-02', 'Zona A (Piso 1)', 'AUTOMOVIL', 'OCUPADA', 'HNE612', NULL),
('A-03', 'Zona A (Piso 1)', 'AUTOMOVIL', 'DISPONIBLE', NULL, NULL),
('A-04', 'Zona A (Piso 1)', 'AUTOMOVIL', 'RESERVADA', NULL, '11111111-1111-1111-1111-111111111111'),
('M-01', 'Zona M (Motos)', 'MOTOCICLETA', 'DISPONIBLE', NULL, NULL),
('M-02', 'Zona M (Motos)', 'MOTOCICLETA', 'OCUPADA', 'XYZ789', NULL);

INSERT INTO VEHICULOS (placa, tipo_vehiculo, marca, modelo, color, id_usuario_propietario) VALUES
('HNE612', 'AUTOMOVIL', 'Mazda', 'Mazda 3 2023', 'Gris Grafito', NULL),
('KLY872', 'AUTOMOVIL', 'Chevrolet', 'Onix Sedan 2022', 'Azul Eléctrico', '11111111-1111-1111-1111-111111111111'),
('XYZ789', 'MOTOCICLETA', 'Yamaha', 'NMAX 155 2024', 'Negro Mate', '22222222-2222-2222-2222-222222222222');

INSERT INTO SUSCRIPCIONES_MENSUALES (id_suscripcion, id_usuario, id_celda_asignada, fecha_inicio, fecha_vencimiento, canon_mensual, estado, dia_corte) VALUES
('44444444-4444-4444-4444-444444444444', '11111111-1111-1111-1111-111111111111', 'A-04', CURRENT_DATE - INTERVAL '15 day', CURRENT_DATE + INTERVAL '15 day', 160000.00, 'VIGENTE', 5),
('55555555-5555-5555-5555-555555555555', '22222222-2222-2222-2222-222222222222', 'M-02', CURRENT_DATE - INTERVAL '40 day', CURRENT_DATE - INTERVAL '10 day', 85000.00, 'VENCIDA', 10);
`;
