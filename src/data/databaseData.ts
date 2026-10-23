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
      { name: 'placa', type: 'VARCHAR(10)', isPk: true, isFk: false, nullable: false, description: 'Placa colombiana formato AAA000 / AAA00A o BICI-XXX' },
      { name: 'tipo_vehiculo', type: 'VARCHAR(20)', isPk: false, isFk: false, nullable: false, description: 'AUTOMOVIL, MOTOCICLETA, BICICLETA, PESADO' },
      { name: 'marca', type: 'VARCHAR(40)', isPk: false, isFk: false, nullable: false, description: 'Marca (Mazda, Chevrolet, Specialized, etc.)' },
      { name: 'modelo', type: 'VARCHAR(40)', isPk: false, isFk: false, nullable: false, description: 'Línea y año de fabricación' },
      { name: 'color', type: 'VARCHAR(30)', isPk: false, isFk: false, nullable: false, description: 'Color predominante de carrocería' },
      { name: 'id_usuario_propietario', type: 'VARCHAR(36)', isPk: false, isFk: true, fkTarget: 'USUARIOS_MENSUALISTAS.id_usuario', nullable: true, description: 'FK opcional si pertenece a un mensualista' },
      { name: 'creado_en', type: 'DATETIME', isPk: false, isFk: false, nullable: false, defaultValue: 'CURRENT_TIMESTAMP', description: 'Fecha de primer registro' }
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
      { name: 'id_celda', type: 'VARCHAR(10)', isPk: true, isFk: false, nullable: false, description: 'Código único de celda (ej: A-01, B-12, BICI-01, C-01)' },
      { name: 'zona', type: 'VARCHAR(30)', isPk: false, isFk: false, nullable: false, description: 'Zona A (Autos), Zona B (Motos), Zona Bici, Zona C (Pesados)' },
      { name: 'tipo_permitido', type: 'VARCHAR(20)', isPk: false, isFk: false, nullable: false, description: 'AUTOMOVIL, MOTOCICLETA, BICICLETA, PESADO' },
      { name: 'estado', type: 'VARCHAR(20)', isPk: false, isFk: false, nullable: false, defaultValue: "'DISPONIBLE'", description: 'DISPONIBLE, OCUPADA, RESERVADA, MANTENIMIENTO' },
      { name: 'placa_actual', type: 'VARCHAR(10)', isPk: false, isFk: false, nullable: true, description: 'Placa del vehículo que ocupa la celda en tiempo real' },
      { name: 'usuario_reservado_id', type: 'VARCHAR(36)', isPk: false, isFk: true, fkTarget: 'USUARIOS_MENSUALISTAS.id_usuario', nullable: true, description: 'FK si la celda es fija para un mensualista' }
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
      { name: 'id_tarifa', type: 'INT AUTO_INCREMENT', isPk: true, isFk: false, nullable: false, description: 'Identificador incremental' },
      { name: 'tipo_vehiculo', type: 'VARCHAR(20)', isPk: false, isFk: false, nullable: false, description: 'AUTOMOVIL, MOTOCICLETA, BICICLETA, PESADO' },
      { name: 'valor_hora', type: 'DECIMAL(10,2)', isPk: false, isFk: false, nullable: false, description: 'Tarifa por primera hora en COP' },
      { name: 'valor_fraccion_15min', type: 'DECIMAL(10,2)', isPk: false, isFk: false, nullable: false, description: 'Tarifa cada 15 minutos adicionales' },
      { name: 'valor_dia_completo', type: 'DECIMAL(10,2)', isPk: false, isFk: false, nullable: false, description: 'Tope máximo de 24 horas' },
      { name: 'valor_mensualidad', type: 'DECIMAL(12,2)', isPk: false, isFk: false, nullable: false, description: 'Tarifa mensual estándar' },
      { name: 'vigente_desde', type: 'DATE', isPk: false, isFk: false, nullable: false, description: 'Fecha de aprobación de tarifa' },
      { name: 'activo', type: 'TINYINT(1)', isPk: false, isFk: false, nullable: false, defaultValue: '1', description: 'Solo 1 tarifa activa por tipo de vehículo' }
    ]
  }
];

export const SQL_PHYSICAL_DDL = `-- ========================================================================
-- SISTEMA DE GESTIÓN PARQUEADERO AUTOS COLOMBIA
-- SCRIPT DE CREACIÓN FÍSICA DE BASE DE DATOS (DDL & DML)
-- MOTOR COMPATIBLE: MySQL 8.0+ / MySQL Workbench / MariaDB 10.5+
-- INSTITUCIÓN: IU DIGITAL DE ANTIOQUIA
-- ESTUDIANTE: TATIANA GALLEGO (tatiana.gallegog@est.iudigital.edu.co)
-- FECHA: OCTUBRE 2026 · ITERACIÓN 1
-- ========================================================================

-- 1. CONFIGURACIÓN DEL ESQUEMA
DROP DATABASE IF EXISTS autos_colombia_db;
CREATE DATABASE autos_colombia_db 
    CHARACTER SET utf8mb4 
    COLLATE utf8mb4_unicode_ci;

USE autos_colombia_db;

SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS PAGOS;
DROP TABLE IF EXISTS NOVEDADES_VEHICULOS;
DROP TABLE IF EXISTS ENTRADAS_VEHICULOS;
DROP TABLE IF EXISTS SUSCRIPCIONES_MENSUALES;
DROP TABLE IF EXISTS CELDAS_PARQUEO;
DROP TABLE IF EXISTS VEHICULOS;
DROP TABLE IF EXISTS USUARIOS_MENSUALISTAS;
DROP TABLE IF EXISTS TARIFAS;
SET FOREIGN_KEY_CHECKS = 1;

-- 2. TABLA: TARIFAS (Unifica AUTOMOVIL, MOTOCICLETA, BICICLETA, PESADO)
CREATE TABLE TARIFAS (
    id_tarifa INT AUTO_INCREMENT PRIMARY KEY,
    tipo_vehiculo VARCHAR(20) NOT NULL,
    valor_hora DECIMAL(10,2) NOT NULL,
    valor_fraccion_15min DECIMAL(10,2) NOT NULL,
    valor_dia_completo DECIMAL(10,2) NOT NULL,
    valor_mensualidad DECIMAL(12,2) NOT NULL,
    vigente_desde DATE NOT NULL DEFAULT (CURRENT_DATE),
    activo TINYINT(1) NOT NULL DEFAULT 1,
    CONSTRAINT chk_tarifa_tipo CHECK (tipo_vehiculo IN ('AUTOMOVIL', 'MOTOCICLETA', 'BICICLETA', 'PESADO')),
    CONSTRAINT chk_tarifa_hora CHECK (valor_hora >= 0),
    CONSTRAINT chk_tarifa_fraccion CHECK (valor_fraccion_15min >= 0),
    CONSTRAINT chk_tarifa_dia CHECK (valor_dia_completo >= 0),
    CONSTRAINT chk_tarifa_mensual CHECK (valor_mensualidad >= 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. TABLA: USUARIOS_MENSUALISTAS
CREATE TABLE USUARIOS_MENSUALISTAS (
    id_usuario VARCHAR(36) PRIMARY KEY,
    tipo_documento VARCHAR(10) NOT NULL,
    numero_documento VARCHAR(25) NOT NULL,
    nombres VARCHAR(60) NOT NULL,
    apellidos VARCHAR(60) NOT NULL,
    telefono VARCHAR(20) NOT NULL,
    email VARCHAR(100) NOT NULL,
    estado VARCHAR(20) NOT NULL DEFAULT 'ACTIVO',
    creado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_usuario_documento UNIQUE (numero_documento),
    CONSTRAINT uq_usuario_email UNIQUE (email),
    CONSTRAINT chk_usuario_doc_tipo CHECK (tipo_documento IN ('CC', 'CE', 'NIT', 'PAS')),
    CONSTRAINT chk_usuario_estado CHECK (estado IN ('ACTIVO', 'MOROSO', 'INACTIVO'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. TABLA: VEHICULOS
CREATE TABLE VEHICULOS (
    placa VARCHAR(10) PRIMARY KEY,
    tipo_vehiculo VARCHAR(20) NOT NULL,
    marca VARCHAR(40) NOT NULL,
    modelo VARCHAR(40) NOT NULL,
    color VARCHAR(30) NOT NULL,
    id_usuario_propietario VARCHAR(36) NULL,
    creado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_vehiculo_tipo CHECK (tipo_vehiculo IN ('AUTOMOVIL', 'MOTOCICLETA', 'BICICLETA', 'PESADO')),
    CONSTRAINT fk_vehiculo_usuario FOREIGN KEY (id_usuario_propietario)
        REFERENCES USUARIOS_MENSUALISTAS (id_usuario)
        ON DELETE SET NULL
        ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. TABLA: CELDAS_PARQUEO
CREATE TABLE CELDAS_PARQUEO (
    id_celda VARCHAR(10) PRIMARY KEY,
    zona VARCHAR(30) NOT NULL,
    tipo_permitido VARCHAR(20) NOT NULL,
    estado VARCHAR(20) NOT NULL DEFAULT 'DISPONIBLE',
    placa_actual VARCHAR(10) NULL,
    usuario_reservado_id VARCHAR(36) NULL,
    CONSTRAINT chk_celda_tipo CHECK (tipo_permitido IN ('AUTOMOVIL', 'MOTOCICLETA', 'BICICLETA', 'PESADO')),
    CONSTRAINT chk_celda_estado CHECK (estado IN ('DISPONIBLE', 'OCUPADA', 'RESERVADA', 'MANTENIMIENTO')),
    CONSTRAINT fk_celda_usuario_reserva FOREIGN KEY (usuario_reservado_id)
        REFERENCES USUARIOS_MENSUALISTAS (id_usuario)
        ON DELETE SET NULL
        ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. TABLA: SUSCRIPCIONES_MENSUALES
CREATE TABLE SUSCRIPCIONES_MENSUALES (
    id_suscripcion VARCHAR(36) PRIMARY KEY,
    id_usuario VARCHAR(36) NOT NULL,
    id_celda_asignada VARCHAR(10) NOT NULL,
    fecha_inicio DATE NOT NULL,
    fecha_vencimiento DATE NOT NULL,
    canon_mensual DECIMAL(12,2) NOT NULL,
    estado VARCHAR(20) NOT NULL DEFAULT 'VIGENTE',
    dia_corte SMALLINT NOT NULL DEFAULT 5,
    CONSTRAINT chk_suscripcion_canon CHECK (canon_mensual > 0),
    CONSTRAINT chk_suscripcion_estado CHECK (estado IN ('VIGENTE', 'VENCIDA', 'CANCELADA')),
    CONSTRAINT chk_suscripcion_corte CHECK (dia_corte BETWEEN 1 AND 28),
    CONSTRAINT chk_suscripcion_fechas CHECK (fecha_vencimiento >= fecha_inicio),
    CONSTRAINT fk_suscripcion_usuario FOREIGN KEY (id_usuario)
        REFERENCES USUARIOS_MENSUALISTAS (id_usuario)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,
    CONSTRAINT fk_suscripcion_celda FOREIGN KEY (id_celda_asignada)
        REFERENCES CELDAS_PARQUEO (id_celda)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. TABLA: ENTRADAS_VEHICULOS (Transaccional)
CREATE TABLE ENTRADAS_VEHICULOS (
    id_entrada VARCHAR(36) PRIMARY KEY,
    numero_ticket VARCHAR(20) NOT NULL,
    placa VARCHAR(10) NOT NULL,
    tipo_servicio VARCHAR(20) NOT NULL DEFAULT 'ROTATIVO',
    id_celda VARCHAR(10) NOT NULL,
    hora_entrada DATETIME NOT NULL,
    hora_salida DATETIME NULL,
    notas_inspeccion TEXT NULL,
    total_minutos INT NULL,
    monto_liquidado DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    estado VARCHAR(20) NOT NULL DEFAULT 'ACTIVO',
    operador_entrada VARCHAR(60) NOT NULL,
    CONSTRAINT uq_entrada_ticket UNIQUE (numero_ticket),
    CONSTRAINT chk_entrada_servicio CHECK (tipo_servicio IN ('ROTATIVO', 'MENSUALIDAD', 'CONVENIO')),
    CONSTRAINT chk_entrada_estado CHECK (estado IN ('ACTIVO', 'LIQUIDADO', 'ANULADO')),
    CONSTRAINT chk_entrada_minutos CHECK (total_minutos IS NULL OR total_minutos >= 0),
    CONSTRAINT chk_entrada_monto CHECK (monto_liquidado >= 0),
    CONSTRAINT chk_entrada_fechas CHECK (hora_salida IS NULL OR hora_salida >= hora_entrada),
    CONSTRAINT fk_entrada_vehiculo FOREIGN KEY (placa)
        REFERENCES VEHICULOS (placa)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,
    CONSTRAINT fk_entrada_celda FOREIGN KEY (id_celda)
        REFERENCES CELDAS_PARQUEO (id_celda)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. TABLA: NOVEDADES_VEHICULOS
CREATE TABLE NOVEDADES_VEHICULOS (
    id_novedad VARCHAR(36) PRIMARY KEY,
    codigo_novedad VARCHAR(20) NOT NULL,
    placa VARCHAR(10) NOT NULL,
    id_entrada VARCHAR(36) NULL,
    id_celda VARCHAR(10) NULL,
    tipo_novedad VARCHAR(30) NOT NULL,
    severidad VARCHAR(10) NOT NULL,
    descripcion TEXT NOT NULL,
    foto_evidencia_url VARCHAR(255) NULL,
    reportado_por VARCHAR(60) NOT NULL,
    fecha_reporte DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    estado VARCHAR(20) NOT NULL DEFAULT 'PENDIENTE',
    CONSTRAINT uq_novedad_codigo UNIQUE (codigo_novedad),
    CONSTRAINT chk_novedad_tipo CHECK (tipo_novedad IN ('RAYON_GOLPE', 'FUGA_LIQUIDOS', 'LUCES_ENCENDIDAS', 'ALARMA', 'OBJETOS_CUSTODIA', 'OTRO')),
    CONSTRAINT chk_novedad_severidad CHECK (severidad IN ('BAJA', 'MEDIA', 'ALTA')),
    CONSTRAINT chk_novedad_estado CHECK (estado IN ('PENDIENTE', 'NOTIFICADO', 'RESUELTA')),
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. TABLA: PAGOS
CREATE TABLE PAGOS (
    id_pago VARCHAR(36) PRIMARY KEY,
    numero_recibo VARCHAR(25) NOT NULL,
    id_entrada VARCHAR(36) NULL,
    id_suscripcion VARCHAR(36) NULL,
    fecha_pago DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    concepto VARCHAR(30) NOT NULL,
    monto DECIMAL(12,2) NOT NULL,
    medio_pago VARCHAR(25) NOT NULL,
    monto_recibido DECIMAL(12,2) NULL,
    cambio_entregado DECIMAL(12,2) NULL,
    cajero VARCHAR(60) NOT NULL,
    estado VARCHAR(20) NOT NULL DEFAULT 'PAGADO',
    CONSTRAINT uq_pago_recibo UNIQUE (numero_recibo),
    CONSTRAINT chk_pago_concepto CHECK (concepto IN ('PARQUEO_ROTATIVO', 'CANON_MENSUAL', 'RECARGO_NOVEDAD')),
    CONSTRAINT chk_pago_medio CHECK (medio_pago IN ('EFECTIVO', 'NEQUI', 'DAVIPLATA', 'TARJETA_DEBITO', 'TARJETA_CREDITO', 'TRANSFERENCIA')),
    CONSTRAINT chk_pago_monto CHECK (monto >= 0),
    CONSTRAINT chk_pago_estado CHECK (estado IN ('PAGADO', 'ANULADO')),
    CONSTRAINT fk_pago_entrada FOREIGN KEY (id_entrada)
        REFERENCES ENTRADAS_VEHICULOS (id_entrada)
        ON DELETE SET NULL
        ON UPDATE CASCADE,
    CONSTRAINT fk_pago_suscripcion FOREIGN KEY (id_suscripcion)
        REFERENCES SUSCRIPCIONES_MENSUALES (id_suscripcion)
        ON DELETE SET NULL
        ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 10. ÍNDICES DE ALTO RENDIMIENTO
CREATE INDEX idx_entradas_placa ON ENTRADAS_VEHICULOS (placa);
CREATE INDEX idx_entradas_estado ON ENTRADAS_VEHICULOS (estado);
CREATE INDEX idx_entradas_fechas ON ENTRADAS_VEHICULOS (hora_entrada, hora_salida);
CREATE INDEX idx_celdas_estado ON CELDAS_PARQUEO (estado);
CREATE INDEX idx_celdas_zona ON CELDAS_PARQUEO (zona);
CREATE INDEX idx_novedades_placa ON NOVEDADES_VEHICULOS (placa);
CREATE INDEX idx_pagos_fecha ON PAGOS (fecha_pago);
CREATE INDEX idx_suscripciones_usuario ON SUSCRIPCIONES_MENSUALES (id_usuario);
CREATE INDEX idx_suscripciones_vencimiento ON SUSCRIPCIONES_MENSUALES (fecha_vencimiento);

-- 11. POBLAMIENTO INICIAL (SEED DATA CON BICICLETAS)
INSERT INTO TARIFAS (tipo_vehiculo, valor_hora, valor_fraccion_15min, valor_dia_completo, valor_mensualidad, activo) VALUES
('AUTOMOVIL',   5000.00, 1500.00, 35000.00, 160000.00, 1),
('MOTOCICLETA', 2500.00,  800.00, 18000.00,  85000.00, 1),
('BICICLETA',   1000.00,  300.00,  8000.00,  30000.00, 1),
('PESADO',      9000.00, 2500.00, 65000.00, 280000.00, 1);

INSERT INTO USUARIOS_MENSUALISTAS (id_usuario, tipo_documento, numero_documento, nombres, apellidos, telefono, email, estado) VALUES
('usr-001', 'CC',  '1037654321',  'Carlos Alberto', 'Gómez Restrepo', '3004567890', 'carlos.gomez@empresa.com', 'ACTIVO'),
('usr-002', 'CC',  '43890123',    'Mariana Sofía',  'Zapata Ospina',  '3109876543', 'mariana.zapata@correo.co', 'ACTIVO'),
('usr-003', 'NIT', '901456789-1', 'Logística Express SAS', 'Comercial', '3201234567', 'contacto@logisticaexpress.co', 'MOROSO');

INSERT INTO CELDAS_PARQUEO (id_celda, zona, tipo_permitido, estado, placa_actual, usuario_reservado_id) VALUES
('A-01', 'Zona A (Autos)',      'AUTOMOVIL',   'DISPONIBLE', NULL, NULL),
('A-02', 'Zona A (Autos)',      'AUTOMOVIL',   'OCUPADA',    'HNE612', NULL),
('A-03', 'Zona A (Autos)',      'AUTOMOVIL',   'DISPONIBLE', NULL, NULL),
('A-04', 'Zona A (Autos)',      'AUTOMOVIL',   'RESERVADA',  NULL, 'usr-001'),
('B-01', 'Zona B (Motos)',      'MOTOCICLETA', 'DISPONIBLE', NULL, NULL),
('B-02', 'Zona B (Motos)',      'MOTOCICLETA', 'OCUPADA',    'XYZ789', NULL),
('BICI-01', 'Zona Bici (Movilidad)', 'BICICLETA', 'DISPONIBLE', NULL, NULL),
('BICI-02', 'Zona Bici (Movilidad)', 'BICICLETA', 'OCUPADA',    'BICI-044', NULL),
('C-01', 'Zona C (Pesados)',    'PESADO',      'DISPONIBLE', NULL, NULL);

INSERT INTO VEHICULOS (placa, tipo_vehiculo, marca, modelo, color, id_usuario_propietario) VALUES
('HNE612',   'AUTOMOVIL',   'Mazda',     'Mazda 3 2023',      'Gris Grafito', NULL),
('KLY872',   'AUTOMOVIL',   'Chevrolet', 'Onix Turbo 2022',   'Azul Zafiro',  'usr-001'),
('XYZ789',   'MOTOCICLETA', 'Yamaha',    'NMAX 155 2024',     'Negro Mate',   'usr-002'),
('BICI-044', 'BICICLETA',   'Specialized','Rockhopper Expert','Rojo Carrera', NULL),
('WFD310',   'PESADO',      'Hino',      'Dutro City 2021',   'Blanco',       'usr-003');

INSERT INTO SUSCRIPCIONES_MENSUALES (id_suscripcion, id_usuario, id_celda_asignada, fecha_inicio, fecha_vencimiento, canon_mensual, estado, dia_corte) VALUES
('sub-001', 'usr-001', 'A-04', DATE_SUB(CURDATE(), INTERVAL 10 DAY), DATE_ADD(CURDATE(), INTERVAL 20 DAY), 160000.00, 'VIGENTE', 5),
('sub-002', 'usr-002', 'B-02', DATE_SUB(CURDATE(), INTERVAL 35 DAY), DATE_SUB(CURDATE(), INTERVAL 5 DAY),   85000.00, 'VENCIDA', 10);

INSERT INTO ENTRADAS_VEHICULOS (id_entrada, numero_ticket, placa, tipo_servicio, id_celda, hora_entrada, hora_salida, notas_inspeccion, total_minutos, monto_liquidado, estado, operador_entrada) VALUES
('ent-001', 'PAC-2026-1042', 'HNE612',   'ROTATIVO', 'A-02',    DATE_SUB(NOW(), INTERVAL 2 HOUR), NULL, 'Vehículo ingresa con paquete declarado en maletero.', NULL, 0.00, 'ACTIVO', 'Camila Martínez'),
('ent-002', 'PAC-2026-1040', 'XYZ789',   'MENSUALIDAD', 'B-02', DATE_SUB(NOW(), INTERVAL 4 HOUR), NULL, 'Sin rayones visibles. Casco dejado en custodia.', NULL, 0.00, 'ACTIVO', 'Camila Martínez'),
('ent-003', 'PAC-2026-1038', 'BICI-044', 'ROTATIVO', 'BICI-02', DATE_SUB(NOW(), INTERVAL 1 HOUR), NULL, 'Bicicleta electro-asistida asegurada con candado en U.', NULL, 0.00, 'ACTIVO', 'Carlos Mendoza');

INSERT INTO NOVEDADES_VEHICULOS (id_novedad, codigo_novedad, placa, id_entrada, id_celda, tipo_novedad, severidad, descripcion, reportado_por, estado) VALUES
('nov-001', 'NOV-2026-001', 'HNE612', 'ent-001', 'A-02', 'RAYON_GOLPE', 'MEDIA', 'Rayón previo de 15 cm en guardabarros documentado.', 'Camila Martínez', 'NOTIFICADO');

INSERT INTO PAGOS (id_pago, numero_recibo, id_entrada, id_suscripcion, fecha_pago, concepto, monto, medio_pago, monto_recibido, cambio_entregado, cajero, estado) VALUES
`;
