# 📋 MATRIZ DE TRAZABILIDAD DE REQUERIMIENTOS (RTM)
## PROYECTO: SISTEMA DE GESTIÓN PARQUEADERO AUTOS COLOMBIA
**Institución:** Institución Universitaria Digital de Antioquia (IU Digital)  
**Estudiante / Autora:** Tatiana Gallego (`tatiana.gallegog@est.iudigital.edu.co`)  
**Estándar Aplicado:** IEEE 830 / ISO/IEC/IEEE 29148 / Metodología Ágil Scrum (UML 2.5)  
**Versión del Documento:** 1.0.0  
**Fecha de Publicación:** Octubre 2026  

---

### 1. OBJETIVO Y JUSTIFICACIÓN METODOLÓGICA
La presente **Matriz de Trazabilidad de Requerimientos (Requirements Traceability Matrix - RTM)** establece un mapeo bidireccional exhaustivo entre los **Requerimientos Funcionales (RF)**, las **Historias de Usuario (HU)** priorizadas del Product Backlog, los **Casos de Uso (CU)** modelados formalmente en StarUML bajo UML 2.5, y los **Casos de Prueba (CP)** con sus correspondientes criterios de aceptación ejecutables.

El propósito fundamental de esta matriz es:
1. **Garantizar Cobertura Total (100%):** Asegurar que cada requerimiento de negocio cuente con especificación técnica, diseño funcional en casos de uso y batería de pruebas que certifique su correcto funcionamiento.
2. **Control de Cambios e Impacto:** Permitir evaluar el alcance y los componentes involucrados ante cualquier ajuste de reglas de negocio o marco legal colombiano (Ley 1480 de 2011 y Ley 1581 de 2012).
3. **Validación y Verificación (V&V):** Facilitar la auditoría académica y técnica demostrando que el código fuente desplegado satisface cabalmente las expectativas del cliente y del evaluador.

---

### 2. MATRIZ DE TRAZABILIDAD INTEGRAL (RF ⇄ HU ⇄ CU ⇄ CP)

| Ítem | Requerimiento Funcional (RF) | Historia de Usuario (HU) | Caso de Uso StarUML (CU) | Caso de Prueba (CP) / Validación | Módulo del Sistema | Método de Verificación | Estado |
| :---: | :--- | :--- | :--- | :--- | :--- | :--- | :---: |
| **TR-01** | **[RF-ES-01]** Registro y Validación de Entrada de Vehículo (Placa RUNT, tipología y tipo servicio) | **[HU-01]** Registro ágil con validación de placa<br>**[HU-02]** Detección de mensualistas | **[CU-01]** Registrar Ingreso de Vehículo | **[CP-ENT-01]** Validación sintáctica de placas colombianas (AAA-123 y AAA-12D) y rechazo automático de placa activa duplicada (Regla RN-01). | Operaciones / Modal Entrada | Prueba de Integración | ✅ Validado 100% |
| **TR-02** | **[RF-ES-02]** Asignación Inteligente de Celda de Parqueo (Zonificación A, B, C) | **[HU-03]** Asignación y reserva por tipología<br>**[HU-11]** Mapa de celdas interactivo | **[CU-02]** Asignar Celda de Estacionamiento | **[CP-CEL-01]** Filtro estricto por categoría (Zona A: Carros, Zona B: Motos, Zona C: Pesados) y exclusión de celdas en mantenimiento o reservadas. | Mapa de Celdas / Bahías | Prueba Unitaria | ✅ Validado 100% |
| **TR-03** | **[RF-ES-03]** Inspección de Ingreso y Registro de Estado Físico (Custodia) | **[HU-04]** Inspección física y custodia<br>**[HU-15]** Libro de incidencias | **[CU-03]** Registrar Inspección Física y Daños Previos *(«extend» CU-01)* | **[CP-NOV-01]** Captura de rayones o accesorios dejados en custodia, vinculación inmutable al ticket y respaldo legal Ley 1480. | Novedades / Inspección | Prueba de Sistema / E2E | ✅ Validado 100% |
| **TR-04** | **[RF-ES-04]** Generación y Emisión de Ticket de Ingreso (Consecutivo fiscal y QR) | **[HU-05]** Emisión física y digital de ticket térmico | **[CU-04]** Emitir Ticket de Estacionamiento *(«include» CU-01)* | **[CP-TCK-01]** Asignación de consecutivo único `PAC-2026-XXXX`, timestamp de ingreso exacto, código de barras y datos fiscales del parqueadero. | TicketPrintModal / Impresión | Prueba de Sistema / E2E | ✅ Validado 100% |
| **TR-05** | **[RF-ES-05]** Búsqueda y Localización Ágil para Salida (Predictiva) | **[HU-06]** Búsqueda predictiva instantánea de vehículos en patio | **[CU-05]** Buscar y Localizar Vehículo en Patio | **[CP-BUS-01]** Filtrado reactivo en menos de 100 ms insensible a mayúsculas/minúsculas por placa o número de ticket con despliegue de horas transcurridas. | LiveOperationsView / Patio | Prueba Unitaria | ✅ Validado 100% |
| **TR-06** | **[RF-ES-06]** Cálculo y Liquidación Automatizada de Tarifas (Gracia y Fracciones) | **[HU-07]** Liquidación automática de tiempo<br>**[HU-18]** Parametrización tarifaria | **[CU-06]** Liquidar Tiempo y Tarifa de Estacionamiento | **[CP-TAR-01]** Liquidación exacta: Estancia < 15 min arroja $0 COP (tiempo de gracia); cálculo por fracción o bloque horario según categoría vehicular. | ExitModal / Motor Tarifario | Prueba Unitaria / Integración | ✅ Validado 100% |
| **TR-07** | **[RF-ES-07]** Gestión de Cobro y Medios de Pago en Salida (Multicanal) | **[HU-08]** Procesamiento de pagos multicanal y devuelta | **[CU-07]** Registrar Pago del Servicio | **[CP-PAG-01]** Conciliación de pago en Efectivo (cálculo automático de cambio) o plataformas electrónicas (Nequi, Daviplata, Tarjetas Débito/Crédito). | PaymentsView / Cobro | Prueba de Integración | ✅ Validado 100% |
| **TR-08** | **[RF-ES-08]** Liberación de Celda y Cierre de Salida | **[HU-09]** Liberación instantánea de celda y aforo | **[CU-08]** Liberar Celda y Cerrar Salida | **[CP-SAL-01]** Transición de vehículo a estado `FINALIZADO`, retorno de celda a `DISPONIBLE` (o `RESERVADA_MENSUAL`) y decremento inmediato de aforo en patio. | CellsView / Operaciones | Prueba de Sistema / E2E | ✅ Validado 100% |
| **TR-09** | **[RF-ES-09]** Emisión de Factura / Recibo de Caja de Salida | **[HU-10]** Generación de recibo fiscal de caja | **[CU-09]** Generar Factura / Recibo de Caja | **[CP-REC-01]** Comprobante consecutivo `REC-XXXX` con desglose de minutos facturados, valor liquidado, método de pago, NIT 900.842.125-4 y leyenda de garantía. | TicketPrintModal / Recibos | Prueba de Sistema / E2E | ✅ Validado 100% |
| **TR-10** | **[RF-ES-10]** Manejo de Novedades e Incidencias en Salida | **[HU-16]** Alerta preventiva de novedades abiertas | **[CU-10]** Verificar Alertas y Novedades Pendientes | **[CP-NOV-02]** Detección obligatoria de incidencias activas (ej. luces encendidas o daños) requiriendo acuse de recibo del operario antes de abrir talanquera. | IncidentsView / Salida | Prueba de Integración | ✅ Validado 100% |
| **TR-11** | **[RF-ADM-11]** Gestión de Contratos de Mensualistas y Renovaciones | **[HU-13]** Registro y contrato de abonados<br>**[HU-14]** Control de vigencia y alertas | **[CU-11]** Administrar Suscripciones de Mensualistas | **[CP-MEN-01]** Registro de cliente con documento CC/NIT, asignación de celda fija exclusiva, cálculo automático de fecha de corte y control de morosidad. | UsersView / Mensualistas | Prueba de Integración | ✅ Validado 100% |
| **TR-12** | **[RF-ADM-12]** Cuadre y Arqueo Diario de Caja por Turnos | **[HU-19]** Arqueo de caja por turnos<br>**[HU-20]** Exportación de balances contables | **[CU-14]** Realizar Cierre y Arqueo de Caja | **[CP-CAJ-01]** Consolidación de ingresos por taquilla, desglose discriminado por Efectivo / Nequi / Daviplata / Tarjetas y coincidencia del 100% con tickets liquidados. | PaymentsView / Arqueo | Prueba de Integración | ✅ Validado 100% |

---

### 3. ESPECIFICACIÓN DETALLADA DE LOS CASOS DE PRUEBA (TEST CASES)

#### Caso de Prueba CP-ENT-01: Validación de Placa y Detección de Duplicados
* **Requerimiento Asociado:** RF-ES-01 | **Historia de Usuario:** HU-01
* **Precondición:** El usuario operador tiene la vista de registro abierta.
* **Paso 1:** Ingresar la placa en minúsculas con caracteres inválidos: `  hne-612  `.
* **Resultado Esperado 1:** El sistema normaliza automáticamente a `HNE612` (mayúsculas sin espacios).
* **Paso 2:** Intentar registrar un vehículo cuya placa figure como ACTIVA en patio (ej. `KLY872`).
* **Resultado Esperado 2:** El sistema bloquea la acción arrojando la alerta: *"El vehículo ya se encuentra registrado actualmente dentro del parqueadero (Regla RN-01)"*.
* **Estado:** ✅ APROBADO.

#### Caso de Prueba CP-CEL-01: Asignación y Compatibilidad de Celdas
* **Requerimiento Asociado:** RF-ES-02 | **Historia de Usuario:** HU-03
* **Precondición:** Existen celdas de diferentes zonas (A: Autos, B: Motos, C: Camionetas).
* **Paso 1:** Seleccionar tipología "MOTOCICLETA".
* **Resultado Esperado 1:** El selector de celdas únicamente muestra disponibles las celdas de la Zona B (B-01 a B-06). Las celdas de Zona A y C quedan deshabilitadas para prevenir desperdicio de espacio.
* **Paso 2:** Verificar una celda en estado `MANTENIMIENTO`.
* **Resultado Esperado 2:** La celda no puede ser seleccionada bajo ninguna circunstancia.
* **Estado:** ✅ APROBADO.

#### Caso de Prueba CP-TAR-01: Motor de Liquidación y Periodo de Gracia
* **Requerimiento Asociado:** RF-ES-06 | **Historia de Usuario:** HU-07
* **Precondición:** Vehículo ocasional registrado en el sistema.
* **Escenario A (Periodo de Gracia):** Vehículo con 12 minutos de permanencia.
  * **Cálculo:** Tiempo transcurrido ≤ 15 minutos de gracia pactados.
  * **Resultado Esperado:** Monto liquidado = `$0 COP`.
* **Escenario B (Liquidación Horaria Estándar):** Automóvil con 2 horas y 14 minutos.
  * **Cálculo:** 2 horas completas + 14 minutos (aplica fracción u hora adicional según tarifa vigente de $4.000/hora).
  * **Resultado Esperado:** Monto liquidado = `$12.000 COP`.
* **Escenario C (Vehículo Mensualista al día):** Automóvil con contrato activo.
  * **Resultado Esperado:** Monto liquidado = `$0 COP` (Exonerado por suscripción mensual).
* **Estado:** ✅ APROBADO.

#### Caso de Prueba CP-PAG-01: Cobro Multicanal y Cálculo de Cambio
* **Requerimiento Asociado:** RF-ES-07 | **Historia de Usuario:** HU-08
* **Precondición:** Salida liquidada por un valor de `$8.000 COP`.
* **Paso 1:** Seleccionar medio de pago "EFECTIVO" e ingresar monto recibido de `$20.000 COP`.
* **Resultado Esperado 1:** El sistema calcula inmediatamente el cambio exacto de `$12.000 COP` y activa el botón de confirmación.
* **Paso 2:** Probar medio de pago "NEQUI" o "DAVIPLATA".
* **Resultado Esperado 2:** El campo de cambio se ajusta a $0 COP y solicita número de transacción/referencia para conciliación de caja.
* **Estado:** ✅ APROBADO.

#### Caso de Prueba CP-SAL-01: Liberación Reactiva de Celda y Aforo
* **Requerimiento Asociado:** RF-ES-08 | **Historia de Usuario:** HU-09
* **Precondición:** Celda A-06 ocupada por vehículo ocasional. Contador de patio en N vehículos.
* **Paso 1:** Confirmar cobro y dar salida al automotor.
* **Resultado Esperado:**
  1. El vehículo pasa a estado `FINALIZADO` con timestamp de salida.
  2. La celda A-06 se actualiza de inmediato al color verde `DISPONIBLE`.
  3. El contador de vehículos en patio se actualiza a N - 1 en tiempo real.
* **Estado:** ✅ APROBADO.

---

### 4. TRAZABILIDAD DE REQUERIMIENTOS NO FUNCIONALES (RNF)

| ID RNF | Categoría | Métrica Objetivo | Estrategia de Cumplimiento e Implementación | Verificación |
| :---: | :--- | :--- | :--- | :---: |
| **RNF-01** | **Rendimiento** | Tiempo de respuesta < 500 ms por operación | Procesamiento reactivo en el cliente con React 19 + TypeScript, consultas optimizadas e indexación en base de datos PostgreSQL. | ✅ Verificado |
| **RNF-02** | **Usabilidad** | Registro de entrada < 15 segundos | Interfaz ergonómica con auto-formato de placas colombianas, sugerencia automática de celda y navegación rápida por teclado. | ✅ Verificado |
| **RNF-03** | **Disponibilidad** | Operatividad continua 24/7 | Arquitectura tolerante a fallos, resiliencia con caché persistente y soporte offline-first. | ✅ Verificado |
| **RNF-04** | **Seguridad y Auditoría** | 100% de transacciones auditables | Números de ticket (`PAC-XXXX`) y recibo (`REC-XXXX`) estrictamente consecutivos, marcas de tiempo ISO inalterables y firma del cajero. | ✅ Verificado |
| **RNF-05** | **Integridad Referencial** | Cero inconsistencias físicas vs lógicas | Llaves foráneas (`FOREIGN KEY`), checks de validación y restricciones de unicidad en motor SQL PostgreSQL / MySQL. | ✅ Verificado |
| **RNF-06** | **Marco Legal Colombiano** | Ley 1480 de 2011 (Estatuto del Consumidor) | Comprobantes con NIT visible, fecha y hora de ingreso, identificación de celda, condiciones de custodia y póliza de responsabilidad civil. | ✅ Verificado |
| **RNF-07** | **Protección de Datos** | Ley 1581 de 2012 (Habeas Data) | Tratamiento seguro de datos de clientes mensualistas (cédula, placa, teléfono y dirección) con acceso restringido. | ✅ Verificado |
| **RNF-08** | **Compatibilidad de Impresión** | Formato estándar térmico ESC/POS (58mm/80mm) | Reglas `@media print` dedicadas que eliminan menús, cabeceras y márgenes, generando tickets térmicos impecables. | ✅ Verificado |

---

### 5. CONCLUSIÓN DEL APARTADO DE TRAZABILIDAD
Con la inclusión de esta matriz y sus 12 requerimientos completamente mapeados, se demuestra la coherencia total entre la etapa de análisis (Historias de Usuario y SRS IEEE 830), la etapa de diseño de arquitectura (Diagramas de Casos de Uso y Clases en StarUML) y la etapa de implementación y pruebas del software entregado.
