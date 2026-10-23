# 🚀 HISTORIAS DE USUARIO Y DELIMITACIÓN DE ALCANCE POR ITERACIONES
## PROYECTO: SISTEMA DE GESTIÓN PARQUEADERO AUTOS COLOMBIA
**Institución:** Institución Universitaria Digital de Antioquia (IU Digital)  
**Estudiante / Autora:** Tatiana Gallego (`tatiana.gallegog@est.iudigital.edu.co`)  
**Asignatura:** Ingeniería de Software / Bases de Datos  
**Actividad:** Iteración 1: Gestión de la entrada y salida de vehículos  
**Metodología:** Marco Ágil Scrum & Definición de Hecho (DoD)  
**Fecha:** Octubre 2026  

---

### 1. DECLARACIÓN FORMAL DE ALCANCE DEL SPRINT 1
Con el fin de evitar ambigüedades en la evaluación del proyecto y dar estricto cumplimiento al título de la actividad formativa:  
**«Iteración 1: Gestión de la entrada y salida de vehículos»**,  
se establece formalmente la delimitación del alcance del sistema:

* **EN ALCANCE (Iteración 1):** Un total de **10 Historias de Usuario (HU-01 a HU-10)** con una estimación de **37 Story Points**, cubriendo de inicio a fin el flujo operativo de registro de acceso, validación de placas, liquidación automática de tiempo, medios de pago y expedición de comprobantes.
* **ROADMAP FUTURO (Iteraciones Posteriores):** Un total de **8 Historias de Usuario (HU-11 a HU-18)** pertenecientes al Product Backlog extendido, priorizadas para entregas subsecuentes correspondientes a la topografía de celdas, fidelización de mensualistas, libro de custodia de novedades y auditoría de caja.

```
+-----------------------------------------------------------------------------------+
|               PRODUCT BACKLOG GENERAL - PARQUEADERO AUTOS COLOMBIA               |
+---------------------------------------------------------+-------------------------+
| [ENTREGA ACTUAL] ITERACIÓN 1: ENTRADA Y SALIDA          | ITERACIONES POSTERIORES |
| (10 Historias de Usuario · 37 Story Points · 100% Hecho)| (8 Historias · Roadmap) |
| - HU-01: Registro ágil de entrada con placa RUNT        | - Iteración 2: Celdas   |
| - HU-02: Detección y exoneración de mensualistas        |   (HU-11, HU-12)        |
| - HU-03: Asignación inteligente de celda por tipología  | - Iteración 2: Mensual  |
| - HU-04: Inspección de ingreso y daños previos          |   (HU-13, HU-14)        |
| - HU-05: Emisión e impresión de ticket térmico          | - Iteración 3: Novedad  |
| - HU-06: Búsqueda predictiva de vehículo en patio       |   (HU-15, HU-16)        |
| - HU-07: Liquidación de tarifas y periodo de gracia     | - Iteración 4: Arqueo   |
| - HU-08: Cobro multicanal (Efectivo/Nequi/Daviplata/TC) |   (HU-17, HU-18)        |
| - HU-09: Liberación de celda y actualización de aforo   |                         |
| - HU-10: Emisión de recibo fiscal de caja de salida     |                         |
+---------------------------------------------------------+-------------------------+
```

---

### 2. PARTE A: HISTORIAS DE USUARIO DE LA ITERACIÓN 1 (EN ALCANCE ACTUAL)

#### [HU-01] Registro ágil de entrada de vehículos con validación de placa
* **Épica:** Gestión de Entrada y Salida
* **Prioridad:** ALTA | **Story Points:** 5 | **Requerimiento Asociado:** RF-ES-01
* **Narrativa:**
  * **Como:** Operador de entrada del parqueadero.
  * **Quiero:** Ingresar la placa del vehículo que arriba a la bahía de acceso en el sistema.
  * **Para:** Registrar su llegada con fecha y hora exactas, validar que no se encuentre previamente dentro del patio y habilitar su ingreso sin demoras en menos de 15 segundos.
* **Criterios de Aceptación (Gherkin):**
  * *Escenario 1 (Ingreso Exitoso):* Dado que el operador se encuentra en el módulo de Registro de Entrada y el vehículo está en la bahía, cuando digita la placa "HNE612" y confirma la entrada, entonces el sistema guarda el timestamp exacto, asigna un número de ticket PAC-2026-XXXX y muestra la confirmación en pantalla.
  * *Escenario 2 (Detección de Duplicado):* Dado que la placa "KLY872" ya posee un estado ACTIVO en el parqueadero, cuando el operador intenta registrar un nuevo ingreso con la misma placa, entonces el sistema bloquea el registro arrojando una advertencia: "El vehículo ya se encuentra registrado actualmente dentro del parqueadero".

---

#### [HU-02] Detección automática y exoneración de mensualistas al ingresar
* **Épica:** Gestión de Entrada y Salida
* **Prioridad:** ALTA | **Story Points:** 5 | **Requerimiento Asociado:** RF-ES-01
* **Narrativa:**
  * **Como:** Operador de taquilla.
  * **Quiero:** Que el sistema reconozca automáticamente si la placa ingresada corresponde a un cliente con suscripción de mensualidad activa.
  * **Para:** Asociar el servicio a su contrato vigente, exonerarlo de la tarifa por horas ($0 COP) y agilizar el paso por la talanquera.
* **Criterios de Aceptación (Gherkin):**
  * *Escenario 1 (Abonado al Día):* Dado que el cliente Carlos Restrepo tiene un contrato activo con la placa "HNE612", cuando el operador digita "HNE612" en la casilla de entrada, entonces el sistema autocompleta el nombre del titular, marca el servicio como "MENSUALIDAD" y preselecciona su celda fija reservada.
  * *Escenario 2 (Abonado Vencido):* Dado que la placa "DSO704" pertenece a un contrato con fecha de vencimiento superada, cuando el operador ingresa la placa, entonces el sistema emite una alerta indicando que la mensualidad está vencida y ofrece registrar el paso como ocasional o cobrar la renovación.

---

#### [HU-03] Asignación y reserva inteligente de celda según tipología
* **Épica:** Gestión de Entrada y Salida
* **Prioridad:** ALTA | **Story Points:** 3 | **Requerimiento Asociado:** RF-ES-02
* **Narrativa:**
  * **Como:** Operador de patio.
  * **Quiero:** Que el sistema me filtre y sugiera las celdas disponibles compatibles con el tipo de vehículo (Automóvil, Moto, Camioneta o Bicicleta).
  * **Para:** Evitar que un vehículo grande ocupe un espacio reducido o que una moto ocupe una celda de automóvil, optimizando el aforo total.
* **Criterios de Aceptación (Gherkin):**
  * *Escenario 1 (Filtro para Motos):* Dado que se selecciona el tipo de vehículo "MOTO", cuando se despliega el listado de celdas disponibles, entonces únicamente se listan las celdas libres de la "Zona B · Motos" (ej. B-02, B-05).
  * *Escenario 2 (Aforo Completo):* Dado que todas las celdas de una zona se encuentran en estado OCUPADA o MANTENIMIENTO, cuando se intenta registrar un vehículo de ese tipo, entonces el sistema deshabilita el botón de confirmación y emite una alerta de aforo completo.

---

#### [HU-04] Inspección de ingreso y custodia de pertenencias
* **Épica:** Gestión de Entrada y Salida
* **Prioridad:** MEDIA | **Story Points:** 3 | **Requerimiento Asociado:** RF-ES-03
* **Narrativa:**
  * **Como:** Operador de recepción.
  * **Quiero:** Registrar observaciones sobre el estado físico inicial del automotor (rayones previos, golpes, llaves o cascos dejados en custodia).
  * **Para:** Dejar constancia escrita en el ticket de entrada y blindar al parqueadero frente a reclamaciones injustificadas al momento del retiro (Ley 1480 de 2011).
* **Criterios de Aceptación (Gherkin):**
  * *Escenario 1 (Registro de Daño Previo):* Dado que un automóvil ingresa con un raspón en el guardabarros trasero, cuando el operador escribe "Raspón en guardabarros trasero derecho" en el campo de inspección, entonces dicha anotación queda impresa en el ticket de entrada y vinculada al registro activo en patio.

---

#### [HU-05] Emisión e impresión de ticket de ingreso físico y digital
* **Épica:** Gestión de Entrada y Salida
* **Prioridad:** ALTA | **Story Points:** 3 | **Requerimiento Asociado:** RF-ES-04
* **Narrativa:**
  * **Como:** Cliente del parqueadero.
  * **Quiero:** Recibir un ticket de entrada físico o digital con los datos completos del establecimiento, fecha/hora y número de celda.
  * **Para:** Tener un comprobante legal de custodia de mi vehículo para reclamarlo a la salida y validar la hora exacta de ingreso.
* **Criterios de Aceptación (Gherkin):**
  * *Escenario 1 (Generación Inmediata):* Dado que se completa satisfactoriamente el formulario de entrada, cuando el sistema procesa la transacción, entonces se abre automáticamente la vista previa del ticket térmico con NIT, placa en tipografía destacada, celda, timestamp y código QR.

---

#### [HU-06] Búsqueda ágil y liquidación automática de tiempo para salida
* **Épica:** Gestión de Entrada y Salida
* **Prioridad:** ALTA | **Story Points:** 5 | **Requerimientos Asociados:** RF-ES-05, RF-ES-06
* **Narrativa:**
  * **Como:** Cajero de salida.
  * **Quiero:** Buscar rápidamente un vehículo por placa o ticket y que el sistema calcule el tiempo exacto transcurrido y la tarifa a cobrar.
  * **Para:** Eliminar errores humanos de cálculo manual, aplicar el tiempo de gracia y acelerar la atención en la cabina de salida.
* **Criterios de Aceptación (Gherkin):**
  * *Escenario 1 (Liquidación Estándar):* Dado un automóvil que ingresó hace 2 horas y 15 minutos con tarifa de $4.000 COP/hora, cuando el cajero selecciona la salida del vehículo, entonces el sistema liquida 3 horas facturables por un valor total de $12.000 COP.
  * *Escenario 2 (Periodo de Gracia):* Dado un vehículo que ingresó hace 10 minutos por equivocación o retiro rápido, cuando se consulta su salida, entonces el sistema marca $0 COP a pagar por concepto de periodo de gracia.

---

#### [HU-07] Cobro multimedio y cálculo automático de devuelta
* **Épica:** Gestión de Entrada y Salida
* **Prioridad:** ALTA | **Story Points:** 5 | **Requerimiento Asociado:** RF-ES-07
* **Narrativa:**
  * **Como:** Cajero del parqueadero.
  * **Quiero:** Registrar el pago seleccionando Efectivo, Nequi, Daviplata, Tarjetas o Transferencia y disponer de una calculadora automática de cambio.
  * **Para:** Agilizar la transacción monetaria, evitar descuadres de caja y brindar comodidad al cliente con medios de pago digitales.
* **Criterios de Aceptación (Gherkin):**
  * *Escenario 1 (Pago en Efectivo):* Dado un cobro de salida por $8.000 COP en efectivo, cuando el cajero ingresa un billete recibido de $20.000 COP, entonces el sistema calcula y resalta una devuelta de $12.000 COP.
  * *Escenario 2 (Billeteras Digitales):* Dado que el cliente transfiere desde su celular a la cuenta del parqueadero, cuando el cajero selecciona "Nequi" o "Daviplata", entonces el sistema registra el pago bajo dicho medio sin exigir ingreso de efectivo físico.

---

#### [HU-08] Liberación de celda y actualización del aforo en tiempo real
* **Épica:** Gestión de Entrada y Salida
* **Prioridad:** ALTA | **Story Points:** 3 | **Requerimiento Asociado:** RF-ES-08
* **Narrativa:**
  * **Como:** Sistema de control.
  * **Quiero:** Liberar automáticamente la celda ocupada tan pronto se confirme el pago o salida del vehículo.
  * **Para:** Reflejar la disponibilidad en el mapa de celdas y en el contador de aforo sin requerir recargar la pantalla.
* **Criterios de Aceptación (Gherkin):**
  * *Escenario 1 (Liberación General):* Dado que el vehículo en la celda A-06 finaliza su salida, cuando se confirma la transacción, entonces la celda A-06 cambia a color verde ("DISPONIBLE") y el contador de celdas libres se incrementa en 1.

---

#### [HU-09] Emisión de recibo fiscal de caja de salida
* **Épica:** Gestión de Entrada y Salida
* **Prioridad:** ALTA | **Story Points:** 3 | **Requerimiento Asociado:** RF-ES-09
* **Narrativa:**
  * **Como:** Cliente y Administrador.
  * **Quiero:** Emitir e imprimir un recibo oficial de caja con número consecutivo, placa, tiempo y medio de pago.
  * **Para:** Entregar al cliente un soporte de su gasto y mantener un libro de transacciones inmutable para auditoría contable.
* **Criterios de Aceptación (Gherkin):**
  * *Escenario 1 (Impresión Térmica):* Dado un cobro de salida finalizado por valor de $10.000 COP, cuando el cajero pulsa "Imprimir Recibo", entonces se genera el documento térmico REC-XXXXXX con los datos fiscales de Autos Colombia, placa y duración.

---

#### [HU-10] Alerta preventiva de novedades pendientes al registrar salida
* **Épica:** Gestión de Entrada y Salida
* **Prioridad:** MEDIA | **Story Points:** 3 | **Requerimiento Asociado:** RF-ES-10
* **Narrativa:**
  * **Como:** Operador de salida.
  * **Quiero:** Que el sistema me alerte visiblemente si el vehículo que va a salir tiene novedades registradas (luces encendidas, fugas de fluidos o daños reportados).
  * **Para:** Notificar oportunamente al conductor antes de que abandone las instalaciones y verificar el estado del vehículo en su presencia.
* **Criterios de Aceptación (Gherkin):**
  * *Escenario 1 (Alerta Ámbar en Salida):* Dado que el vehículo HNE612 tiene la novedad NOV-101 (Luces encendidas) en estado NOTIFICADO, cuando el cajero abre el modal de salida, entonces se despliega un banner de advertencia en color ámbar con el código y detalle de la novedad.

---

### 3. PARTE B: PRODUCT BACKLOG PARA ITERACIONES POSTERIORES (ROADMAP FUTURO)

Las siguientes 8 historias de usuario se encuentran formalmente especificadas y priorizadas en el Backlog del producto, quedando programadas para sprints futuros tras culminar con éxito la Iteración 1:

| ID | Épica | Iteración Planificada | Título de la Historia de Usuario | Story Points |
| :---: | :--- | :---: | :--- | :---: |
| **HU-11** | Gestión de Celdas | **Iteración 2** | Visualización del mapa interactivo de celdas en tiempo real con zonificación | 5 SP |
| **HU-12** | Gestión de Celdas | **Iteración 2** | Inhabilitación temporal de celdas por mantenimiento o reparaciones | 2 SP |
| **HU-13** | Usuarios y Mensualistas | **Iteración 2** | Registro y suscripción de clientes mensualistas con asignación de celda fija | 5 SP |
| **HU-14** | Usuarios y Mensualistas | **Iteración 2** | Monitoreo de vencimientos, estados de cuenta y renovación periódica | 3 SP |
| **HU-15** | Novedades e Incidencias | **Iteración 3** | Registro formal de novedades ocurridas sobre automotores en patio | 3 SP |
| **HU-16** | Novedades e Incidencias | **Iteración 3** | Cierre y descargo de responsabilidades de incidencias resueltas | 2 SP |
| **HU-17** | Pagos y Caja | **Iteración 4** | Arqueo diario de caja con conciliación por medios de pago (Efectivo/Digital) | 3 SP |
| **HU-18** | Pagos y Caja | **Iteración 4** | Consulta histórica de comprobantes contables y reimpresión de recibos | 2 SP |

---

### 4. RESUMEN DE MÉTRICAS ÁGILES
* **Total Historias de Usuario:** 18
* **Historias Iteración 1 (Entrada y Salida - En Alcance):** 10 (55.5% del backlog total)
* **Story Points Iteración 1:** 37 SP
* **Cobertura de Criterios de Aceptación (Gherkin):** 100% de escenarios documentados
* **Estado de Cumplimiento:** ✅ Culminado y Desplegado en Aplicación Web y Repositorio GitHub
