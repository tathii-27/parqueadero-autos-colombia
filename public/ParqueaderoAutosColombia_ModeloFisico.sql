-- ========================================================================
-- SISTEMA DE GESTIÓN PARQUEADERO AUTOS COLOMBIA
-- SCRIPT DE CREACIÓN FÍSICA DE BASE DE DATOS (DDL & DML)
-- MOTOR COMPATIBLE: MySQL 8.0+ / MySQL Workbench / MariaDB 10.5+
-- INSTITUCIÓN: IU DIGITAL DE ANTIOQUIA
-- ESTUDIANTE: TATIANA GALLEGO (tatiana.gallegog@est.iudigital.edu.co)
-- FECHA: OCTUBRE 2026
-- ITERACIÓN 1: GESTIÓN DE ENTRADA Y SALIDA DE VEHÍCULOS
-- ========================================================================

-- 1. CONFIGURACIÓN INICIAL DEL ESQUEMA
DROP DATABASE IF EXISTS autos_colombia_db;
CREATE DATABASE autos_colombia_db 
    CHARACTER SET utf8mb4 
    COLLATE utf8mb4_unicode_ci;

USE autos_colombia_db;

-- Desactivar temporalmente revisión de claves foráneas para creación limpia
SET FOREIGN_KEY_CHECKS = 0;

-- Eliminar tablas si existieran previamente (orden inverso de dependencias)
DROP TABLE IF EXISTS PAGOS;
DROP TABLE IF EXISTS NOVEDADES_VEHICULOS;
DROP TABLE IF EXISTS ENTRADAS_VEHICULOS;
DROP TABLE IF EXISTS SUSCRIPCIONES_MENSUALES;
DROP TABLE IF EXISTS CELDAS_PARQUEO;
DROP TABLE IF EXISTS VEHICULOS;
DROP TABLE IF EXISTS USUARIOS_MENSUALISTAS;
DROP TABLE IF EXISTS TARIFAS;

SET FOREIGN_KEY_CHECKS = 1;

-- ========================================================================
-- 2. DEFINICIÓN DE TABLAS (DDL)
-- ========================================================================

-- TABLA 1: TARIFAS
-- Define la parametrización de cobro por horas, fracciones y mensualidades.
-- Se unifican los tipos de vehículos: AUTOMOVIL, MOTOCICLETA, BICICLETA, PESADO.
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

-- TABLA 2: USUARIOS_MENSUALISTAS
-- Clientes con contrato de estacionamiento prolongado (Abonados).
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

-- TABLA 3: VEHICULOS
-- Automotores y bicicletas que ingresan a las instalaciones.
-- Tipos permitidos unificados: AUTOMOVIL, MOTOCICLETA, BICICLETA, PESADO.
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

-- TABLA 4: CELDAS_PARQUEO
-- Plazas físicas delimitadas organizadas por zonas (A: Autos, B: Motos, C: Pesados, BICI: Bicicletas).
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

-- TABLA 5: SUSCRIPCIONES_MENSUALES
-- Contratos mensuales celebrados entre mensualistas y el parqueadero.
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

-- TABLA 6: ENTRADAS_VEHICULOS (TABLA PRINCIPAL TRANSACCIONAL)
-- Registra cada ingreso vehicular, emite tiquete consecutivo y calcula permanencia al salir.
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

-- TABLA 7: NOVEDADES_VEHICULOS
-- Registro de incidentes físicos, rayones, fugas o daños preexistentes (Ley 1480 / SIC).
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

-- TABLA 8: PAGOS
-- Asiento contable del cobro de estadía o canon mensual conforme a la DIAN.
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

-- ========================================================================
-- 3. ÍNDICES DE RENDIMIENTO (OPTIMIZACIÓN MYSQL WORKBENCH)
-- ========================================================================
CREATE INDEX idx_entradas_placa ON ENTRADAS_VEHICULOS (placa);
CREATE INDEX idx_entradas_estado ON ENTRADAS_VEHICULOS (estado);
CREATE INDEX idx_entradas_fechas ON ENTRADAS_VEHICULOS (hora_entrada, hora_salida);
CREATE INDEX idx_celdas_estado ON CELDAS_PARQUEO (estado);
CREATE INDEX idx_celdas_zona ON CELDAS_PARQUEO (zona);
CREATE INDEX idx_novedades_placa ON NOVEDADES_VEHICULOS (placa);
CREATE INDEX idx_pagos_fecha ON PAGOS (fecha_pago);
CREATE INDEX idx_suscripciones_usuario ON SUSCRIPCIONES_MENSUALES (id_usuario);
CREATE INDEX idx_suscripciones_vencimiento ON SUSCRIPCIONES_MENSUALES (fecha_vencimiento);

-- ========================================================================
-- 4. POBLAMIENTO INICIAL / DATOS SEMILLA (SEED DATA)
-- ========================================================================

-- Inserción 1: Tarifario Vigente (Incluye Bicicletas Ley 1811)
INSERT INTO TARIFAS (tipo_vehiculo, valor_hora, valor_fraccion_15min, valor_dia_completo, valor_mensualidad, activo) VALUES
('AUTOMOVIL',   5000.00, 1500.00, 35000.00, 160000.00, 1),
('MOTOCICLETA', 2500.00,  800.00, 18000.00,  85000.00, 1),
('BICICLETA',   1000.00,  300.00,  8000.00,  30000.00, 1),
('PESADO',      9000.00, 2500.00, 65000.00, 280000.00, 1);

-- Inserción 2: Usuarios Mensualistas (Abonados)
INSERT INTO USUARIOS_MENSUALISTAS (id_usuario, tipo_documento, numero_documento, nombres, apellidos, telefono, email, estado) VALUES
('usr-001', 'CC',  '1037654321',  'Carlos Alberto', 'Gómez Restrepo', '3004567890', 'carlos.gomez@empresa.com', 'ACTIVO'),
('usr-002', 'CC',  '43890123',    'Mariana Sofía',  'Zapata Ospina',  '3109876543', 'mariana.zapata@correo.co', 'ACTIVO'),
('usr-003', 'NIT', '901456789-1', 'Logística Express SAS', 'Comercial', '3201234567', 'contacto@logisticaexpress.co', 'MOROSO');

-- Inserción 3: Celdas de Parqueo Físicas por Zona
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

-- Inserción 4: Vehículos y Bicicletas
INSERT INTO VEHICULOS (placa, tipo_vehiculo, marca, modelo, color, id_usuario_propietario) VALUES
('HNE612',   'AUTOMOVIL',   'Mazda',     'Mazda 3 2023',      'Gris Grafito', NULL),
('KLY872',   'AUTOMOVIL',   'Chevrolet', 'Onix Turbo 2022',   'Azul Zafiro',  'usr-001'),
('XYZ789',   'MOTOCICLETA', 'Yamaha',    'NMAX 155 2024',     'Negro Mate',   'usr-002'),
('BICI-044', 'BICICLETA',   'Specialized','Rockhopper Expert','Rojo Carrera', NULL),
('WFD310',   'PESADO',      'Hino',      'Dutro City 2021',   'Blanco',       'usr-003');

-- Inserción 5: Suscripciones Mensuales
INSERT INTO SUSCRIPCIONES_MENSUALES (id_suscripcion, id_usuario, id_celda_asignada, fecha_inicio, fecha_vencimiento, canon_mensual, estado, dia_corte) VALUES
('sub-001', 'usr-001', 'A-04', DATE_SUB(CURDATE(), INTERVAL 10 DAY), DATE_ADD(CURDATE(), INTERVAL 20 DAY), 160000.00, 'VIGENTE', 5),
('sub-002', 'usr-002', 'B-02', DATE_SUB(CURDATE(), INTERVAL 35 DAY), DATE_SUB(CURDATE(), INTERVAL 5 DAY),   85000.00, 'VENCIDA', 10);

-- Inserción 6: Entradas de Vehículos (Estadías en Patio)
INSERT INTO ENTRADAS_VEHICULOS (id_entrada, numero_ticket, placa, tipo_servicio, id_celda, hora_entrada, hora_salida, notas_inspeccion, total_minutos, monto_liquidado, estado, operador_entrada) VALUES
('ent-001', 'PAC-2026-1042', 'HNE612',   'ROTATIVO', 'A-02',    DATE_SUB(NOW(), INTERVAL 2 HOUR), NULL, 'Vehículo ingresa con paquete declarado en maletero.', NULL, 0.00, 'ACTIVO', 'Camila Martínez'),
('ent-002', 'PAC-2026-1040', 'XYZ789',   'MENSUALIDAD', 'B-02', DATE_SUB(NOW(), INTERVAL 4 HOUR), NULL, 'Sin rayones visibles. Casco dejado en custodia.', NULL, 0.00, 'ACTIVO', 'Camila Martínez'),
('ent-003', 'PAC-2026-1038', 'BICI-044', 'ROTATIVO', 'BICI-02', DATE_SUB(NOW(), INTERVAL 1 HOUR), NULL, 'Bicicleta electro-asistida asegurada con candado en U.', NULL, 0.00, 'ACTIVO', 'Carlos Mendoza');

-- Inserción 7: Novedades e Inspecciones de Custodia
INSERT INTO NOVEDADES_VEHICULOS (id_novedad, codigo_novedad, placa, id_entrada, id_celda, tipo_novedad, severidad, descripcion, reportado_por, estado) VALUES
('nov-001', 'NOV-2026-001', 'HNE612', 'ent-001', 'A-02', 'RAYON_GOLPE', 'MEDIA', 'Rayón previo de 15 cm en guardabarros trasero izquierdo documentado al ingreso.', 'Camila Martínez', 'NOTIFICADO');

-- Inserción 8: Pagos y Recaudos Oficiales
INSERT INTO PAGOS (id_pago, numero_recibo, id_entrada, id_suscripcion, fecha_pago, concepto, monto, medio_pago, monto_recibido, cambio_entregado, cajero, estado) VALUES
('pag-001', 'REC-008915', NULL, 'sub-001', DATE_SUB(NOW(), INTERVAL 10 DAY), 'CANON_MENSUAL', 160000.00, 'TRANSFERENCIA', 160000.00, 0.00, 'Diana Restrepo', 'PAGADO');

-- ========================================================================
-- 5. CONSULTAS DE VALIDACIÓN Y VERIFICACIÓN DE EJECUCIÓN (DEMOSTRACIÓN)
-- ========================================================================
-- Comprobación 1: Tarifario Unificado con BICICLETA
SELECT id_tarifa, tipo_vehiculo, valor_hora, valor_dia_completo, valor_mensualidad, activo 
FROM TARIFAS;

-- Comprobación 2: Vehículos Activos en Patio y Celdas Ocupadas
SELECT 
    e.numero_ticket,
    e.placa,
    v.tipo_vehiculo,
    e.id_celda,
    c.zona,
    e.hora_entrada,
    e.estado,
    e.operador_entrada
FROM ENTRADAS_VEHICULOS e
JOIN VEHICULOS v ON e.placa = v.placa
JOIN CELDAS_PARQUEO c ON e.id_celda = c.id_celda
WHERE e.estado = 'ACTIVO';

-- Comprobación 3: Balance de Aforo por Estado de Celdas
SELECT estado, COUNT(*) AS total_celdas 
FROM CELDAS_PARQUEO 
GROUP BY estado;
