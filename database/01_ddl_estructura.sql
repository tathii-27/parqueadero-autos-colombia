-- ========================================================================
-- SISTEMA DE GESTIÓN DE PARQUEADERO: PARQUEADERO AUTOS COLOMBIA
-- INSTITUCIÓN: IU DIGITAL DE ANTIOQUIA
-- AUTORA: TATIANA GALLEGO
-- MOTOR: PostgreSQL 14+ / Compatible con MySQL 8.0+
-- ARCHIVO: 01_ddl_estructura.sql
-- DESCRIPCIÓN: Definición del modelo físico (Tablas, Restricciones e Índices)
-- ========================================================================

-- Iniciar transacción para garantizar atomicidad
BEGIN;

-- Habilitar extensiones para UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ========================================================================
-- 1. CATÁLOGOS Y TABLAS INDEPENDIENTES
-- ========================================================================

-- 1.1 TABLA: TARIFAS
CREATE TABLE IF NOT EXISTS TARIFAS (
    id_tarifa SERIAL PRIMARY KEY,
    tipo_vehiculo VARCHAR(20) NOT NULL,
    valor_hora DECIMAL(10,2) NOT NULL CHECK (valor_hora >= 0),
    valor_fraccion_15min DECIMAL(10,2) NOT NULL CHECK (valor_fraccion_15min >= 0),
    valor_dia_completo DECIMAL(10,2) NOT NULL CHECK (valor_dia_completo >= 0),
    valor_mensualidad DECIMAL(12,2) NOT NULL CHECK (valor_mensualidad >= 0),
    vigente_desde DATE NOT NULL DEFAULT CURRENT_DATE,
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    CONSTRAINT chk_tipo_vehiculo_tarifa CHECK (
        tipo_vehiculo IN ('AUTOMOVIL', 'MOTOCICLETA', 'CAMIONETA', 'PESADO')
    )
);

-- 1.2 TABLA: USUARIOS_MENSUALISTAS
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

-- ========================================================================
-- 2. INFRAESTRUCTURA Y VEHÍCULOS
-- ========================================================================

-- 2.1 TABLA: CELDAS_PARQUEO
CREATE TABLE IF NOT EXISTS CELDAS_PARQUEO (
    id_celda VARCHAR(10) PRIMARY KEY,
    zona VARCHAR(20) NOT NULL,
    tipo_permitido VARCHAR(20) NOT NULL CHECK (
        tipo_permitido IN ('AUTOMOVIL', 'MOTOCICLETA', 'CAMIONETA', 'PESADO')
    ),
    estado VARCHAR(20) NOT NULL DEFAULT 'DISPONIBLE' CHECK (
        estado IN ('DISPONIBLE', 'OCUPADA', 'RESERVADA', 'MANTENIMIENTO')
    ),
    placa_actual VARCHAR(8) NULL,
    usuario_reservado_id UUID NULL,
    CONSTRAINT fk_celda_usuario_reserva FOREIGN KEY (usuario_reservado_id)
        REFERENCES USUARIOS_MENSUALISTAS (id_usuario)
        ON DELETE SET NULL
        ON UPDATE CASCADE
);

-- 2.2 TABLA: VEHICULOS
CREATE TABLE IF NOT EXISTS VEHICULOS (
    placa VARCHAR(8) PRIMARY KEY,
    tipo_vehiculo VARCHAR(20) NOT NULL CHECK (
        tipo_vehiculo IN ('AUTOMOVIL', 'MOTOCICLETA', 'CAMIONETA', 'PESADO')
    ),
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

-- ========================================================================
-- 3. CONTRATOS Y OPERACIONES DIARIAS
-- ========================================================================

-- 3.1 TABLA: SUSCRIPCIONES_MENSUALES
CREATE TABLE IF NOT EXISTS SUSCRIPCIONES_MENSUALES (
    id_suscripcion UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    id_usuario UUID NOT NULL,
    id_celda_asignada VARCHAR(10) NOT NULL,
    fecha_inicio DATE NOT NULL,
    fecha_vencimiento DATE NOT NULL,
    canon_mensual DECIMAL(12,2) NOT NULL CHECK (canon_mensual > 0),
    estado VARCHAR(20) NOT NULL DEFAULT 'VIGENTE' CHECK (
        estado IN ('VIGENTE', 'VENCIDA', 'CANCELADA')
    ),
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

-- 3.2 TABLA: ENTRADAS_VEHICULOS (Control de Flujo Rotativo)
CREATE TABLE IF NOT EXISTS ENTRADAS_VEHICULOS (
    id_entrada UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    numero_ticket VARCHAR(20) NOT NULL UNIQUE,
    placa VARCHAR(8) NOT NULL,
    tipo_servicio VARCHAR(20) NOT NULL DEFAULT 'ROTATIVO' CHECK (
        tipo_servicio IN ('ROTATIVO', 'MENSUALIDAD', 'CONVENIO')
    ),
    id_celda VARCHAR(10) NOT NULL,
    hora_entrada TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    hora_salida TIMESTAMP NULL,
    notas_inspeccion TEXT NULL,
    total_minutos INTEGER NULL CHECK (total_minutos IS NULL OR total_minutos >= 0),
    monto_liquidado DECIMAL(12,2) NOT NULL DEFAULT 0.00 CHECK (monto_liquidado >= 0),
    estado VARCHAR(20) NOT NULL DEFAULT 'ACTIVO' CHECK (
        estado IN ('ACTIVO', 'LIQUIDADO', 'ANULADO')
    ),
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

-- 3.3 TABLA: NOVEDADES_VEHICULOS (Inspecciones y Registro de Daños)
CREATE TABLE IF NOT EXISTS NOVEDADES_VEHICULOS (
    id_novedad UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    codigo_novedad VARCHAR(20) NOT NULL UNIQUE,
    placa VARCHAR(8) NOT NULL,
    id_entrada UUID NULL,
    id_celda VARCHAR(10) NULL,
    tipo_novedad VARCHAR(30) NOT NULL CHECK (
        tipo_novedad IN ('RAYON_GOLPE', 'FUGA_LIQUIDOS', 'LUCES_ENCENDIDAS', 'ALARMA', 'OTRO')
    ),
    severidad VARCHAR(10) NOT NULL CHECK (severidad IN ('BAJA', 'MEDIA', 'ALTA')),
    descripcion TEXT NOT NULL,
    foto_evidencia_url VARCHAR(255) NULL,
    reportado_por VARCHAR(60) NOT NULL,
    fecha_reporte TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    estado VARCHAR(20) NOT NULL DEFAULT 'PENDIENTE' CHECK (
        estado IN ('PENDIENTE', 'NOTIFICADO', 'RESUELTA')
    ),
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

-- ========================================================================
-- 4. CAJA Y LIQUIDACIÓN FINANCIERA
-- ========================================================================

-- 4.1 TABLA: PAGOS
CREATE TABLE IF NOT EXISTS PAGOS (
    id_pago UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    numero_recibo VARCHAR(25) NOT NULL UNIQUE,
    id_entrada UUID NULL,
    id_suscripcion UUID NULL,
    fecha_pago TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    concepto VARCHAR(30) NOT NULL CHECK (
        concepto IN ('PARQUEO_ROTATIVO', 'CANON_MENSUAL', 'RECARGO_NOVEDAD')
    ),
    monto DECIMAL(12,2) NOT NULL CHECK (monto >= 0),
    medio_pago VARCHAR(25) NOT NULL CHECK (
        medio_pago IN ('EFECTIVO', 'NEQUI', 'DAVIPLATA', 'TARJETA_DEBITO', 'TARJETA_CREDITO', 'TRANSFERENCIA')
    ),
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
-- 5. ÍNDICES DE RENDIMIENTO (OPTIMIZACIÓN DE BÚSQUEDAS)
-- ========================================================================
CREATE INDEX IF NOT EXISTS idx_entradas_placa ON ENTRADAS_VEHICULOS(placa);
CREATE INDEX IF NOT EXISTS idx_entradas_estado ON ENTRADAS_VEHICULOS(estado);
CREATE INDEX IF NOT EXISTS idx_entradas_ticket ON ENTRADAS_VEHICULOS(numero_ticket);
CREATE INDEX IF NOT EXISTS idx_celdas_estado ON CELDAS_PARQUEO(estado);
CREATE INDEX IF NOT EXISTS idx_novedades_placa ON NOVEDADES_VEHICULOS(placa);
CREATE INDEX IF NOT EXISTS idx_pagos_fecha ON PAGOS(fecha_pago);
CREATE INDEX IF NOT EXISTS idx_pagos_recibo ON PAGOS(numero_recibo);
CREATE INDEX IF NOT EXISTS idx_suscripciones_usuario ON SUSCRIPCIONES_MENSUALES(id_usuario);
CREATE INDEX IF NOT EXISTS idx_suscripciones_vencimiento ON SUSCRIPCIONES_MENSUALES(fecha_vencimiento);

COMMIT;
