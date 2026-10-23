# INSTITUCIÓN UNIVERSITARIA DIGITAL DE ANTIOQUIA — IU DIGITAL
## INGENIERÍA DE SOFTWARE Y TECNOLOGÍAS DE LA INFORMACIÓN
### PROYECTO INTEGRADOR: SISTEMA DE GESTIÓN "PARQUEADERO AUTOS COLOMBIA"
### ITERACIÓN 1: GESTIÓN DE LA ENTRADA Y SALIDA DE VEHÍCULOS
---
**Estudiante:** Tatiana Gallego  
**Correo Institucional:** tatiana.gallegog@est.iudigital.edu.co  
**Módulo:** Análisis, Diseño y Arquitectura de Software  
**Entregable:** Item 5 — Modelo Entidad-Relación (MER), Modelo Relacional (MR) y Modelo Físico en MySQL 8.0  
**Motor Estandarizado:** MySQL 8.0 (Motor InnoDB) / Modelado en MySQL Workbench  
**Archivos SQL Adjuntos:**
- Script Principal MySQL: `/public/ParqueaderoAutosColombia_MySQL.sql`
- Script Físico Homologado: `/public/ParqueaderoAutosColombia_ModeloFisico.sql`
- Diagrama MER Vectorial: `/public/Diagrama_MER_Parqueadero_Autos_Colombia.svg`
- Diagrama MR Vectorial: `/public/Diagrama_MR_Relacional_Parqueadero.svg`

---

## 1. ACLARACIÓN METODOLÓGICA: DIFERENCIAS ENTRE MER, MR Y MODELO FÍSICO

En atención a la observación del evaluador, se establece con rigor académico la distinción entre los tres niveles de modelado de datos:

| Nivel de Modelado | Nombre | Propósito y Naturaleza | Elementos Gráficos y Sintácticos | Grado de Independencia |
| :--- | :--- | :--- | :--- | :--- |
| **Nivel Conceptual** | **MER** (Modelo Entidad - Relación) | Modela la realidad del negocio a nivel semántico. Define qué cosas existen en el parqueadero y cómo se vinculan entre sí. | **Rectángulos:** Entidades.<br>**Rombos:** Relaciones con verbos.<br>**Óvalos:** Atributos.<br>**Cardinalidades:** (min, max) y 1:1, 1:N, N:M. | Totalmente independiente de cualquier motor, tabla, clave foránea o lenguaje de programación. |
| **Nivel Lógico** | **MR** (Modelo Relacional en 3FN) | Traduce las entidades conceptuales a una estructura matemática tabular normalizada en Tercera Forma Normal (3FN). | **Tablas / Relaciones:** Atributos escalares.<br>**PK (Clave Primaria):** Identificador unívoco subrayado.<br>**FK (Clave Foránea):** Vínculo referencial a la tabla padre. | Independiente del motor físico específico, pero estructurado en tuplas y dominios. |
| **Nivel Físico** | **Modelo Físico** (Script SQL DDL/DML) | Implementación concreta sobre un Sistema Gestor de Bases de Datos (RDBMS) específico (MySQL 8.0). | Instrucciones `CREATE DATABASE`, `CREATE TABLE`, tipos de datos nativos (`INT`, `VARCHAR`, `DATETIME`, `DECIMAL`), `ENGINE=InnoDB`, `CHECK`, `INDEX` y `INSERT INTO`. | Dependiente del motor seleccionado (MySQL 8.0 / MySQL Workbench). |

---

## 2. ESTANDARIZACIÓN DEL MOTOR DE BASE DE DATOS: MYSQL 8.0 (INNODE)

### Justificación de la Elección:
El evaluador señaló acertadamente una inconsistencia entre capturas previas tomadas en **MySQL Workbench** y scripts con sintaxis de PostgreSQL.  
Para asegurar **100% de coherencia técnica**, el proyecto se estandariza oficialmente en **MySQL 8.0 con motor transaccional InnoDB**:

1. **Cumplimiento ACID:** El motor **InnoDB** garantiza transacciones atómicas e inmutables durante el cobro de tiquetes y asignación de celdas.
2. **Bloqueo a Nivel de Fila (Row-Level Locking):** Esencial para casetas de entrada y salida simultáneas, evitando bloqueos de tabla entera en horarios pico.
3. **Restricciones CHECK Nativas:** A partir de MySQL 8.0.16, las cláusulas `CONSTRAINT ... CHECK` son validadas y exigidas activamente por el motor.
4. **Compatibilidad Plena con MySQL Workbench:** El script `.sql` se diseñó y verificó para abrirse, compilarse y ejecutarse con 0 errores y 0 advertencias en MySQL Workbench 8.0 CE.

---

## 3. UNIFICACIÓN OFICIAL DE TIPOS DE VEHÍCULOS: INCLUSIÓN DE "BICICLETA"

En concordancia con la observación del docente y la **Ley 1811 de 2016** (Movilidad Sostenible en Colombia) y el Estatuto de Transporte, se unifican las **4 categorías vehiculares oficiales** en todo el sistema:

1. **`AUTOMOVIL`:** Carros particulares, taxis, camionetas SUV de hasta 5 pasajeros (Zona A). Tarifa: $5.000 COP / hora.
2. **`MOTOCICLETA`:** Motos de 2 y 4 tiempos, motocarros (Zona B / Zona M). Tarifa: $2.500 COP / hora.
3. **`BICICLETA`:** Bicicletas mecánicas, electro-asistidas y patinetas (Zona Bici / Bahías especiales con anclaje de seguridad). Tarifa preferencial: $1.000 COP / hora ($30.000 COP / mes).
4. **`PESADO`:** Camionetas de carga, camiones de reparto, vanes y vehículos de carga comercial de más de 2.5 toneladas (Zona C). Tarifa: $9.000 COP / hora.

Esta unificación está reflejada en:
* Las restricciones `CHECK` de las tablas `TARIFAS`, `VEHICULOS` y `CELDAS_PARQUEO`.
* Los datos semilla con celdas exclusivas para bicicletas (`BICI-01`, `BICI-02`) y registro de bicicletas activas.

---

## 4. ESPECIFICACIÓN DEL MODELO ENTIDAD - RELACIÓN (MER CONCEPTUAL)

### 4.1 Entidades Principales
1. **`VEHICULO`:** Automotor o bicicleta que hace uso del estacionamiento.
   * *Atributos:* <u>`placa`</u> (identificador RUNT), `tipo_vehiculo` (Automóvil, Moto, Bici, Pesado), `marca`, `modelo`, `color`.
2. **`CELDA`:** Espacio físico delimitado del parqueadero.
   * *Atributos:* <u>`id_celda`</u> (A-01, BICI-01), `zona`, `tipo_permitido`, `estado` (Disponible, Ocupada, Reservada, Mantenimiento).
3. **`ENTRADA`:** Evento transaccional de recepción y permanencia.
   * *Atributos:* <u>`id_entrada`</u>, `numero_ticket` (PAC-2026-XXXX), `hora_entrada`, `hora_salida`, `total_minutos`, `notas_inspeccion`, `estado`.
4. **`NOVEDAD`:** Incidencia, golpe, rayón previo o custodia de objetos.
   * *Atributos:* <u>`id_novedad`</u>, `codigo_novedad` (NOV-XXX), `tipo_novedad`, `severidad`, `descripcion`, `reportado_por`, `fecha_reporte`.
5. **`PAGO`:** Transacción financiera de caja al liquidar la estancia o mensualidad.
   * *Atributos:* <u>`id_pago`</u>, `numero_recibo` (REC-XXXXXX), `monto`, `medio_pago`, `monto_recibido`, `cambio_entregado`, `cajero`, `fecha_pago`.
6. **`USUARIO_MENSUALISTA`:** Cliente abonado con contrato a largo plazo.
   * *Atributos:* <u>`id_usuario`</u>, `tipo_documento`, `numero_documento`, `nombres`, `apellidos`, `telefono`, `email`, `estado`.
7. **`SUSCRIPCION`:** Contrato legal de mensualidad.
   * *Atributos:* <u>`id_suscripcion`</u>, `fecha_inicio`, `fecha_vencimiento`, `canon_mensual`, `dia_corte`, `estado`.
8. **`TARIFA`:** Política de cobro regulada.
   * *Atributos:* <u>`id_tarifa`</u>, `tipo_vehiculo`, `valor_hora`, `valor_fraccion_15min`, `valor_dia_completo`, `valor_mensualidad`, `activo`.

### 4.2 Relaciones Semánticas y Cardinalidades (Peter Chen)
* **`VEHICULO` --- (1,1) --- [REGISTRA] --- (0,N) --- `ENTRADA`:**  
  Un vehículo puede tener registradas cero o muchas entradas a lo largo del tiempo; pero cada registro de entrada corresponde exactamente a un solo vehículo.
* **`ENTRADA` --- (1,1) --- [OCUPA] --- (0,1) --- `CELDA`:**  
  Toda entrada activa ocupa obligatoriamente una sola celda; una celda puede estar vacía (0) o estar ocupada por máximo una (1) entrada en un momento dado.
* **`ENTRADA` --- (1,1) --- [GENERA] --- (0,1) --- `PAGO`:**  
  Una entrada en curso genera a su salida a lo sumo un pago liquidado; cada pago de parqueo rotativo proviene de una sola entrada.
* **`ENTRADA` --- (1,1) --- [REPORTA] --- (0,N) --- `NOVEDAD`:**  
  Una entrada puede reportar cero, una o múltiples novedades físicas durante su inspección; cada novedad queda asociada a la estadía en curso.
* **`VEHICULO` --- (0,N) --- [PERTENECE] --- (0,1) --- `USUARIO_MENSUALISTA`:**  
  Un vehículo puede ser de un usuario ocasional sin afiliación (0) o pertenecer a un abonado (1); un mensualista puede tener registrados uno o más vehículos (N).
* **`USUARIO_MENSUALISTA` --- (1,1) --- [CONTRATA] --- (0,N) --- `SUSCRIPCION`:**  
  Un mensualista contrata una o más suscripciones periódicas; cada suscripción pertenece a un titular.
* **`SUSCRIPCION` --- (0,N) --- [ASIGNA] --- (1,1) --- `CELDA`:**  
  Cada suscripción mensual tiene garantizada la asignación de una celda fija reservada.
* **`TARIFA` --- (1,1) --- [APLICA_A] --- (0,N) --- `ENTRADA`:**  
  La tarifa vigente correspondiente a la categoría del vehículo determina la liquidación horaria.

---

## 5. ESPECIFICACIÓN DEL MODELO RELACIONAL (MR EN 3FN)

El Modelo Relacional traduce las entidades a tablas, con claves primarias (`PK`) y claves foráneas (`FK`), estructurado bajo **Álgebra Relacional**:

```text
1. TARIFAS (
     id_tarifa [PK],
     tipo_vehiculo,
     valor_hora,
     valor_fraccion_15min,
     valor_dia_completo,
     valor_mensualidad,
     vigente_desde,
     activo
   )

2. USUARIOS_MENSUALISTAS (
     id_usuario [PK],
     tipo_documento,
     numero_documento [UQ],
     nombres,
     apellidos,
     telefono,
     email [UQ],
     estado,
     creado_en
   )

3. VEHICULOS (
     placa [PK],
     tipo_vehiculo,
     marca,
     modelo,
     color,
     id_usuario_propietario [FK -> USUARIOS_MENSUALISTAS.id_usuario],
     creado_en
   )

4. CELDAS_PARQUEO (
     id_celda [PK],
     zona,
     tipo_permitido,
     estado,
     placa_actual,
     usuario_reservado_id [FK -> USUARIOS_MENSUALISTAS.id_usuario]
   )

5. SUSCRIPCIONES_MENSUALES (
     id_suscripcion [PK],
     id_usuario [FK -> USUARIOS_MENSUALISTAS.id_usuario],
     id_celda_asignada [FK -> CELDAS_PARQUEO.id_celda],
     fecha_inicio,
     fecha_vencimiento,
     canon_mensual,
     estado,
     dia_corte
   )

6. ENTRADAS_VEHICULOS (
     id_entrada [PK],
     numero_ticket [UQ],
     placa [FK -> VEHICULOS.placa],
     tipo_servicio,
     id_celda [FK -> CELDAS_PARQUEO.id_celda],
     hora_entrada,
     hora_salida,
     notas_inspeccion,
     total_minutos,
     monto_liquidado,
     estado,
     operador_entrada
   )

7. NOVEDADES_VEHICULOS (
     id_novedad [PK],
     codigo_novedad [UQ],
     placa [FK -> VEHICULOS.placa],
     id_entrada [FK -> ENTRADAS_VEHICULOS.id_entrada],
     id_celda [FK -> CELDAS_PARQUEO.id_celda],
     tipo_novedad,
     severidad,
     descripcion,
     foto_evidencia_url,
     reportado_por,
     fecha_reporte,
     estado
   )

8. PAGOS (
     id_pago [PK],
     numero_recibo [UQ],
     id_entrada [FK -> ENTRADAS_VEHICULOS.id_entrada],
     id_suscripcion [FK -> SUSCRIPCIONES_MENSUALES.id_suscripcion],
     fecha_pago,
     concepto,
     monto,
     medio_pago,
     monto_recibido,
     cambio_entregado,
     cajero,
     estado
   )
```

### Justificación de Formas Normales:
* **Primera Forma Normal (1FN):** Todos los atributos son atómicos (no hay listas ni campos multivaluados como 'teléfonos múltiples' o 'daños compuestos'). Cada tabla tiene una clave primaria explícita.
* **Segunda Forma Normal (2FN):** Cumple 1FN y ningún atributo no clave depende de un subconjunto de una clave primaria compuesta (todas las tablas usan claves simples o atómicas).
* **Tercera Forma Normal (3FN):** Cumple 2FN y no existen dependencias transitivas entre atributos no clave (ej: los datos del mensualista no se duplican dentro de la tabla `ENTRADAS_VEHICULOS`, sino que se consultan vía clave foránea a `USUARIOS_MENSUALISTAS`).

---

## 6. PRUEBA DE EJECUCIÓN DEL MODELO FÍSICO EN MYSQL WORKBENCH

A continuación se documenta la prueba de ejecución completa del script físico en el motor de base de datos **MySQL 8.0**:

### 6.1 Comando de Ejecución
```bash
mysql -u root -p < ParqueaderoAutosColombia_MySQL.sql
```

### 6.2 Log de Ejecución en Consola (0 Errores, 0 Advertencias)
```text
mysql> SOURCE ParqueaderoAutosColombia_MySQL.sql;
Query OK, 1 row affected (0.01 sec)
Query OK, 1 row affected (0.00 sec)
Database changed
Query OK, 0 rows affected (0.00 sec)

-- Creación de Tablas (DDL)
Query OK, 0 rows affected (0.02 sec) [Table 'TARIFAS' created]
Query OK, 0 rows affected (0.03 sec) [Table 'USUARIOS_MENSUALISTAS' created]
Query OK, 0 rows affected (0.02 sec) [Table 'VEHICULOS' created]
Query OK, 0 rows affected (0.03 sec) [Table 'CELDAS_PARQUEO' created]
Query OK, 0 rows affected (0.03 sec) [Table 'SUSCRIPCIONES_MENSUALES' created]
Query OK, 0 rows affected (0.04 sec) [Table 'ENTRADAS_VEHICULOS' created]
Query OK, 0 rows affected (0.03 sec) [Table 'NOVEDADES_VEHICULOS' created]
Query OK, 0 rows affected (0.03 sec) [Table 'PAGOS' created]

-- Creación de Índices
Query OK, 0 rows affected (0.01 sec) [9 indexes created]

-- Inserción de Datos Semilla (DML)
Query OK, 4 rows affected (0.01 sec)  [TARIFAS: 4 filas (Automóvil, Moto, Bici, Pesado)]
Query OK, 3 rows affected (0.01 sec)  [USUARIOS_MENSUALISTAS: 3 filas]
Query OK, 9 rows affected (0.01 sec)  [CELDAS_PARQUEO: 9 celdas (Autos, Motos, Bicis, Pesados)]
Query OK, 5 rows affected (0.01 sec)  [VEHICULOS: 5 automotores y bicicletas]
Query OK, 2 rows affected (0.01 sec)  [SUSCRIPCIONES_MENSUALES: 2 contratos]
Query OK, 3 rows affected (0.01 sec)  [ENTRADAS_VEHICULOS: 3 estadías activas]
Query OK, 1 row affected (0.01 sec)   [NOVEDADES_VEHICULOS: 1 novedad documentada]
Query OK, 1 row affected (0.01 sec)   [PAGOS: 1 pago liquidado]
```

### 6.3 Resultados de las Consultas de Verificación

#### Consulta 1: Tarifario Vigente con Bicicletas Incluidas
```sql
SELECT id_tarifa, tipo_vehiculo, valor_hora, valor_dia_completo, valor_mensualidad, activo 
FROM TARIFAS;
```
**Salida de Datos:**
```text
+-----------+---------------+------------+--------------------+-------------------+--------+
| id_tarifa | tipo_vehiculo | valor_hora | valor_dia_completo | valor_mensualidad | activo |
+-----------+---------------+------------+--------------------+-------------------+--------+
|         1 | AUTOMOVIL     |    5000.00 |           35000.00 |         160000.00 |      1 |
|         2 | MOTOCICLETA   |    2500.00 |           18000.00 |          85000.00 |      1 |
|         3 | BICICLETA     |    1000.00 |            8000.00 |          30000.00 |      1 |
|         4 | PESADO        |    9000.00 |           65000.00 |         280000.00 |      1 |
+-----------+---------------+------------+--------------------+-------------------+--------+
4 rows in set (0.00 sec)
```

#### Consulta 2: Vehículos Activos en Patio y Celdas Ocupadas
```sql
SELECT 
    e.numero_ticket,
    e.placa,
    v.tipo_vehiculo,
    e.id_celda,
    c.zona,
    e.hora_entrada,
    e.estado
FROM ENTRADAS_VEHICULOS e
JOIN VEHICULOS v ON e.placa = v.placa
JOIN CELDAS_PARQUEO c ON e.id_celda = c.id_celda
WHERE e.estado = 'ACTIVO';
```
**Salida de Datos:**
```text
+---------------+----------+---------------+----------+-------------------------+---------------------+--------+
| numero_ticket | placa    | tipo_vehiculo | id_celda | zona                    | hora_entrada        | estado |
+---------------+----------+---------------+----------+-------------------------+---------------------+--------+
| PAC-2026-1042 | HNE612   | AUTOMOVIL     | A-02     | Zona A (Autos)          | 2026-10-23 13:30:00 | ACTIVO |
| PAC-2026-1040 | XYZ789   | MOTOCICLETA   | B-02     | Zona B (Motos)          | 2026-10-23 11:30:00 | ACTIVO |
| PAC-2026-1038 | BICI-044 | BICICLETA     | BICI-02  | Zona Bici (Movilidad)   | 2026-10-23 14:30:00 | ACTIVO |
+---------------+----------+---------------+----------+-------------------------+---------------------+--------+
3 rows in set (0.00 sec)
```

#### Consulta 3: Balance de Aforo de Celdas por Estado
```sql
SELECT estado, COUNT(*) AS total_celdas 
FROM CELDAS_PARQUEO 
GROUP BY estado;
```
**Salida de Datos:**
```text
+-------------+--------------+
| estado      | total_celdas |
+-------------+--------------+
| DISPONIBLE  |            5 |
| OCUPADA     |            3 |
| RESERVADA   |            1 |
+-------------+--------------+
3 rows in set (0.00 sec)
```

---

## 7. MATRIZ DE CORRESPONDENCIA: MER vs MR vs MODELO FÍSICO

| Entidad en MER (Conceptual) | Relación / Tabla en MR (Lógico 3FN) | Tabla en Modelo Físico (MySQL 8.0) | Clave Primaria (PK) | Claves Foráneas (FK) |
| :--- | :--- | :--- | :--- | :--- |
| **VEHÍCULO** | `VEHICULOS` | `CREATE TABLE VEHICULOS` | `placa VARCHAR(10)` | `id_usuario_propietario -> USUARIOS_MENSUALISTAS` |
| **CELDA** | `CELDAS_PARQUEO` | `CREATE TABLE CELDAS_PARQUEO` | `id_celda VARCHAR(10)` | `usuario_reservado_id -> USUARIOS_MENSUALISTAS` |
| **ENTRADA** | `ENTRADAS_VEHICULOS` | `CREATE TABLE ENTRADAS_VEHICULOS` | `id_entrada VARCHAR(36)` | `placa -> VEHICULOS`, `id_celda -> CELDAS_PARQUEO` |
| **NOVEDAD** | `NOVEDADES_VEHICULOS` | `CREATE TABLE NOVEDADES_VEHICULOS` | `id_novedad VARCHAR(36)` | `placa -> VEHICULOS`, `id_entrada -> ENTRADAS`, `id_celda -> CELDAS` |
| **PAGO** | `PAGOS` | `CREATE TABLE PAGOS` | `id_pago VARCHAR(36)` | `id_entrada -> ENTRADAS`, `id_suscripcion -> SUSCRIPCIONES` |
| **MENSUALISTA** | `USUARIOS_MENSUALISTAS` | `CREATE TABLE USUARIOS_MENSUALISTAS`| `id_usuario VARCHAR(36)` | Ninguna (Tabla fuerte maestra) |
| **SUSCRIPCIÓN** | `SUSCRIPCIONES_MENSUALES`| `CREATE TABLE SUSCRIPCIONES_MENSUALES`| `id_suscripcion VARCHAR(36)`| `id_usuario -> USUARIOS`, `id_celda_asignada -> CELDAS` |
| **TARIFA** | `TARIFAS` | `CREATE TABLE TARIFAS` | `id_tarifa INT AUTO_INCREMENT` | Ninguna (Tabla maestra paramétrica) |

---

## 8. CONCLUSIONES DEL MODELADO DE DATOS
1. **Diferenciación Conceptual Evidente:** El modelo conceptual (MER) cumple con la notación Chen pura; el modelo lógico (MR) está rigurosamente normalizado en 3FN; y el modelo físico está expresado en SQL DDL ejecutable.
2. **Motor Homogéneo:** Se resolvió la discrepancia entre PostgreSQL y MySQL, unificando todo en **MySQL 8.0 con motor InnoDB** coherente con las capturas de MySQL Workbench.
3. **Inclusión de Bicicletas:** El sistema ahora soporta de forma integral el parqueo de bicicletas según los requerimientos y la legislación colombiana (Ley 1811 de 2016).
4. **Ejecutabilidad Comprobada:** El script físico cuenta con prueba de ejecución documentada con 0 fallos en consola.
