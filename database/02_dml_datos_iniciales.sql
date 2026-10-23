-- ========================================================================
-- SISTEMA DE GESTIÓN DE PARQUEADERO: PARQUEADERO AUTOS COLOMBIA
-- INSTITUCIÓN: IU DIGITAL DE ANTIOQUIA
-- AUTORA: TATIANA GALLEGO
-- MOTOR: PostgreSQL 14+ / Compatible con MySQL 8.0+
-- ARCHIVO: 02_dml_datos_iniciales.sql
-- DESCRIPCIÓN: Inserción de datos semilla (Seed Data) ordenados por integridad referencial
-- ========================================================================

BEGIN;

-- 1. TARIFAS BASE VIGENTES
INSERT INTO TARIFAS (tipo_vehiculo, valor_hora, valor_fraccion_15min, valor_dia_completo, valor_mensualidad, vigente_desde, activo) VALUES
('AUTOMOVIL', 5000.00, 1500.00, 35000.00, 160000.00, CURRENT_DATE, TRUE),
('MOTOCICLETA', 2500.00, 800.00, 18000.00, 85000.00, CURRENT_DATE, TRUE),
('CAMIONETA', 6000.00, 1800.00, 42000.00, 190000.00, CURRENT_DATE, TRUE),
('PESADO', 10000.00, 3000.00, 75000.00, 320000.00, CURRENT_DATE, TRUE)
ON CONFLICT DO NOTHING;

-- 2. CLIENTES / USUARIOS MENSUALISTAS
INSERT INTO USUARIOS_MENSUALISTAS (id_usuario, tipo_documento, numero_documento, nombres, apellidos, telefono, email, estado) VALUES
('11111111-1111-1111-1111-111111111111', 'CC', '1037654321', 'Carlos', 'Gómez Restrepo', '3004567890', 'carlos.gomez@empresa.com', 'ACTIVO'),
('22222222-2222-2222-2222-222222222222', 'CC', '43890123', 'Mariana', 'Zapata Ospina', '3109876543', 'mariana.zapata@correo.co', 'ACTIVO'),
('33333333-3333-3333-3333-333333333333', 'NIT', '901456789-1', 'Logística del Café SAS', 'Representante', '3201234567', 'contacto@logisticacafe.com', 'MOROSO')
ON CONFLICT (numero_documento) DO NOTHING;

-- 3. VEHÍCULOS (Se insertan antes de asignar a celdas para mantener integridad)
INSERT INTO VEHICULOS (placa, tipo_vehiculo, marca, modelo, color, id_usuario_propietario) VALUES
('HNE612', 'AUTOMOVIL', 'Mazda', 'Mazda 3 2023', 'Gris Grafito', NULL),
('KLY872', 'AUTOMOVIL', 'Chevrolet', 'Onix Sedan 2022', 'Azul Eléctrico', '11111111-1111-1111-1111-111111111111'),
('XYZ789', 'MOTOCICLETA', 'Yamaha', 'NMAX 155 2024', 'Negro Mate', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (placa) DO NOTHING;

-- 4. CELDAS DE PARQUEO
INSERT INTO CELDAS_PARQUEO (id_celda, zona, tipo_permitido, estado, placa_actual, usuario_reservado_id) VALUES
('A-01', 'Zona A (Piso 1)', 'AUTOMOVIL', 'DISPONIBLE', NULL, NULL),
('A-02', 'Zona A (Piso 1)', 'AUTOMOVIL', 'OCUPADA', 'HNE612', NULL),
('A-03', 'Zona A (Piso 1)', 'AUTOMOVIL', 'DISPONIBLE', NULL, NULL),
('A-04', 'Zona A (Piso 1)', 'AUTOMOVIL', 'RESERVADA', NULL, '11111111-1111-1111-1111-111111111111'),
('M-01', 'Zona M (Motos)', 'MOTOCICLETA', 'DISPONIBLE', NULL, NULL),
('M-02', 'Zona M (Motos)', 'MOTOCICLETA', 'OCUPADA', 'XYZ789', NULL)
ON CONFLICT (id_celda) DO NOTHING;

-- 5. SUSCRIPCIONES MENSUALES
-- Nota: Usamos cálculo de fecha estándar compatible para campos de tipo DATE
INSERT INTO SUSCRIPCIONES_MENSUALES (id_suscripcion, id_usuario, id_celda_asignada, fecha_inicio, fecha_vencimiento, canon_mensual, estado, dia_corte) VALUES
('44444444-4444-4444-4444-444444444444', '11111111-1111-1111-1111-111111111111', 'A-04', (CURRENT_DATE - 15), (CURRENT_DATE + 15), 160000.00, 'VIGENTE', 5),
('55555555-5555-5555-5555-555555555555', '22222222-2222-2222-2222-222222222222', 'M-02', (CURRENT_DATE - 40), (CURRENT_DATE - 10), 85000.00, 'VENCIDA', 10)
ON CONFLICT (id_suscripcion) DO NOTHING;

COMMIT;
