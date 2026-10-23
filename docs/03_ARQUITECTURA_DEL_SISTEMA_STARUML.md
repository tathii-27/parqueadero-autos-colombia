# 🏛️ ARQUITECTURA DEL SISTEMA EN STARUML (MODELO MULTICAPA N-TIER)
## PROYECTO: SISTEMA DE GESTIÓN PARQUEADERO AUTOS COLOMBIA
**Institución:** Institución Universitaria Digital de Antioquia (IU Digital)  
**Estudiante / Autora:** Tatiana Gallego (`tatiana.gallegog@est.iudigital.edu.co`)  
**Estándar Aplicado:** UML 2.5 / StarUML 5.x / Arquitectura en 4 Capas Desacopladas  
**Fecha:** Octubre 2026  

---

### 1. DISTINCIÓN METODOLÓGICA ENTRE DIAGRAMAS
Es fundamental clarificar las diferencias entre los diferentes diagramas del proyecto para responder con rigor técnico a la evaluación:

1. **Diagrama de Procesos o Flujo (BPMN / Actividades):** Modela la secuencia temporal del negocio (e.g., el carro entra, se valida la placa, se asigna celda, se imprime el ticket).
2. **Diagrama de Clases del Dominio:** Modela las entidades del modelo conceptual (atributos, operaciones, herencia y multiplicidades).
3. **Diagrama de Paquetes:** Agrupa clases afines en módulos lógicos de organización de código.
4. **DIAGRAMA DE ARQUITECTURA DEL SISTEMA (Presente Documento):**  
   Modela la **estructura física y lógica de componentes**, organizada en **niveles de abstracción (capas)**, especificando:
   * Las interfaces de usuario de entrada y salida.
   * Los servicios de lógica de negocio y motores de validación/cálculo.
   * Los componentes de acceso a datos (DAOs / Repositorios).
   * Las tablas físicas de almacenamiento persistente.
   * Los canales y contratos de comunicación y dependencia entre capas (`«use»`, `«read/write»`).

---

### 2. ESTRUCTURA DE LAS 4 CAPAS DEL SISTEMA

```
+---------------------------------------------------------------------------------------------------------+
|                        CAPA 1: PRESENTACIÓN (INTERFACES DE USUARIO / FRONTEND)                          |
+---------------------------------------------------+-----------------------------------------------------+
|         OPERADOR DE ENTRADA (CASETA)              |            CAJERO DE SALIDA (TAQUILLA)              |
|  - ModalRegistroEntrada (Captura placa RUNT)      |  - ModalLiquidacionSalida (Búsqueda reactiva)       |
|  - VistaMapaCeldas (Topografía en tiempo real)    |  - CalculadoraCobroPago (Efectivo/Digital/Cambio)   |
|  - TicketPrintModal (Comprobante térmico con QR)  |  - ReciboFiscalSalida (Comprobante Ley 1480 / DIAN) |
+---------------------------------------------------+-----------------------------------------------------+
                                 |  «use» / Solicitud de Operación
                                 v
+---------------------------------------------------------------------------------------------------------+
|                 CAPA 2: LÓGICA DE NEGOCIO (APPLICATION & DOMAIN SERVICES - BACKEND)                     |
+---------------------------------------------------------------------------------------------------------+
|  - ValidadorEntradaVehicular: Comprueba formato RUNT y rechaza duplicados activos en patio (Regla RN-01)|
|  - GestorAsignacionCeldas: Sugiere bahía por tipo (A: Autos, B: Motos, C: Pesados) con bloqueo atómico  |
|  - MotorTarifasLiquidacion: Calcula permanencia exacta, aplica gracia 15 min (RN-09) y fracción horaria |
|  - GestorSalidaCobro: Verifica novedades abiertas (RN-14), valida pago completo y libera celda (RN-12)  |
|  - ServicioMensualistas: Evalúa vigencia de contratos, aplica tarifa $0 COP y alerta cortes de mora     |
+---------------------------------------------------------------------------------------------------------+
                                 |  «use» / Inversión de Dependencias (Interfaces)
                                 v
+---------------------------------------------------------------------------------------------------------+
|                  CAPA 3: ACCESO A DATOS (DATA ACCESS OBJECTS - DAO / REPOSITORIOS)                      |
+---------------------------------------------------------------------------------------------------------+
|  - VehiculoRepository: Consultas findByPlaca(), save(), existsByPlaca()                                 |
|  - EntradaVehiculoRepository: Transacciones concurrentes crearEntrada(), registrarSalidaYPago()         |
|  - CeldaParqueoRepository: Bloqueo pesimista findDisponiblesPorZona(), actualizarEstado(), liberar()     |
|  - TarifaRepository: Lectura en caché de tablas de precios vigentes por categoría vehicular             |
|  - PagoRepository: Inserción inmutable de transacciones de caja y consolidación de arqueo diario       |
|  - MensualistaRepository: JOIN de usuarios mensualistas y contratos de suscripción activa               |
+---------------------------------------------------------------------------------------------------------+
                                 |  «SQL Driver / Connection Pool» Consultas ACID DML
                                 v
+---------------------------------------------------------------------------------------------------------+
|               CAPA 4: BASE DE DATOS RELACIONAL (PERSISTENCIA FÍSICA SQL - POSTGRESQL / MYSQL)           |
+--------------------+--------------------+--------------------+--------------------+---------------------+
|  VEHICULOS         | ENTRADAS_VEHICULOS | CELDAS_PARQUEO     | TARIFAS            | PAGOS               |
|  (Placas, Marca,   | (Ticket, Placa,    | (Zona, Estado,     | (Valor hora,       | (Recibo, Entrada,   |
|   Tipo, Modelo)    |  Entrada, Salida)  |  Tipo, Placa)      |  Fracción, Mes)    |  Medio, Devuelta)   |
+--------------------+--------------------+--------------------+--------------------+---------------------+
|  USUARIOS_MENSUALISTAS                  | SUSCRIPCIONES_MENSUALES                 | NOVEDADES_VEHICULOS |
|  (Documento, Nombres, Tel, Ley 1581)    | (Usuario, Celda, Vigencia, Canon)       | (Daños, Custodia)   |
+-----------------------------------------+-----------------------------------------+---------------------+
```

---

### 3. DESGLOSE DETALLADO DE COMPONENTES POR CAPA

#### Capa 1: Presentación (Frontend / Interfaces de Usuario)
Esta capa aísla completamente la interacción con el usuario de las reglas de cálculo del sistema:
* **Interfaces del Operador de Entrada:**
  1. `ModalRegistroEntrada`: Captura y normaliza la placa según estándar colombiano (AAA-123 para automóviles y AAA-12D para motocicletas). Identifica de forma inmediata si el vehículo cuenta con un contrato mensual vigente.
  2. `VistaMapaCeldas`: Visualizador interactivo de la distribución de bahías en patio agrupadas en Zona A (Automóviles), Zona B (Motos) y Zona C (Camionetas/Pesados), actualizando el aforo en tiempo real.
  3. `TicketPrintModal`: Generador del ticket térmico físico o digital con código QR, fecha y hora exacta de entrada, celda asignada y datos de contacto de Autos Colombia.
* **Interfaces del Cajero de Salida:**
  1. `ModalLiquidacionSalida`: Buscador predictivo que localiza el vehículo activo por placa o número de ticket, desplegando el tiempo acumulado de estancia y las novedades reportadas.
  2. `CalculadoraCobroPago`: Panel de recaudo multicanal que calcula automáticamente la devuelta en efectivo y recibe pagos electrónicos mediante Nequi, Daviplata, Tarjetas y transferencias.
  3. `ReciboFiscalSalida`: Renderizador del comprobante legal de caja con número consecutivo `REC-XXXXXX`, desglose de IVA y cumplimiento del Estatuto del Consumidor (Ley 1480 de 2011).

---

#### Capa 2: Lógica de Negocio (Domain & Application Services)
Contiene la inteligencia del negocio y las restricciones operativas sin depender de interfaces gráficas:
* **`ValidadorEntradaVehicular`:**
  * Valida sintácticamente la placa contra las normas del RUNT.
  * Ejecuta la **Regla RN-01**: Impide que un vehículo con estancia activa no liquidada ingrese nuevamente, evitando fraudes o inconsistencias de aforo.
  * Valida restricciones de acceso (pico y placa o tipología vehicular).
* **`GestorAsignacionCeldas`:**
  * Recomienda la celda óptima más cercana a los accesos.
  * Ejecuta la **Regla RN-04**: Prohíbe que un automóvil ocupe celdas exclusivas de motocicletas o celdas en mantenimiento.
  * Bloquea la celda transaccionalmente para evitar concurrencia de dos operarios.
* **`MotorTarifasLiquidacion`:**
  * **Cálculo de Permanencia:** Determina la diferencia exacta en minutos y horas entre la hora de entrada y la de salida.
  * **Regla RN-09 (Periodo de Gracia):** Si la permanencia es menor o igual a 15 minutos, el costo liquidado es `$0 COP`.
  * **Liquidación de Fracciones:** Aplica la tarifa base por hora y fracciona conforme a la política comercial parametrizada para cada tipo vehicular.
  * **Exoneración de Mensualistas:** Valida si el abonado está al día para aplicar costo `$0 COP`.
* **`GestorSalidaCobro`:**
  * Verifica si el vehículo tiene incidencias abiertas en el libro de custodia (**Regla RN-14**), requiriendo acuse de recibo del conductor antes de la salida.
  * Calcula el cambio exacto garantizando que el monto recibido sea mayor o igual al total liquidado (**Regla RN-11**).
  * Libera la celda en patio y actualiza el aforo global (**Regla RN-12**).

---

#### Capa 3: Acceso a Datos (DAOs / Repositorios)
Aísla la lógica de negocio de las peculiaridades del motor de base de datos SQL mediante el patrón Repository:
* `VehiculoRepository`: Encargado de la persistencia y consulta de automotores y su relación con propietarios mensualistas.
* `EntradaVehiculoRepository`: Maneja las transacciones críticas de inserción de tickets, consulta de vehículos activos en patio y asentamiento de salida.
* `CeldaParqueoRepository`: Controla la disponibilidad y el estado físico de las bahías (DISPONIBLE, OCUPADA, RESERVADA, MANTENIMIENTO) empleando sentencias con bloqueo pesimista (`SELECT ... FOR UPDATE`).
* `TarifaRepository`: Provee los valores vigentes de cobro con soporte de lectura en caché en memoria para tiempos de respuesta menores a 50 ms.
* `PagoRepository`: Registra los comprobantes de caja de manera inmutable, impidiendo la alteración de registros contables ya liquidados.

---

#### Capa 4: Base de Datos Relacional (Modelo Físico SQL)
Estructura en **Tercera Forma Normal (3FN)** implementada en **PostgreSQL 14+ / MySQL 8.0+**:
1. `TARIFAS`: Valores por hora, fracción de 15 minutos y mensualidades.
2. `USUARIOS_MENSUALISTAS`: Registro de clientes abonados amparados bajo la Ley 1581 de 2012 (Habeas Data).
3. `VEHICULOS`: Automotores identificados con su placa única.
4. `CELDAS_PARQUEO`: Inventario topográfico físico de espacios zonificados.
5. `SUSCRIPCIONES_MENSUALES`: Contratos de fidelización con celda asignada y fecha de corte.
6. `ENTRADAS_VEHICULOS`: Registro transaccional de estancias con marcas de tiempo ISO inalterables.
7. `NOVEDADES_VEHICULOS`: Libro de custodia para registrar rayones o pertenencias previas (Ley 1480 de 2011).
8. `PAGOS`: Transacciones fiscales de recaudo por turno de caja.

---

### 4. FLUJO DE COMUNICACIÓN Y DEPENDENCIAS ENTRE CAPAS
La arquitectura sigue el principio de **Inversión de Dependencias (DIP)** y flujo de llamada descendente:
1. **Presentación ➔ Negocio:** Los componentes React (Modales y Vistas) invocan servicios de negocio a través de controladores o hooks especializados, sin conocer las tablas SQL.
2. **Negocio ➔ Acceso a Datos:** Los servicios de negocio orquestan las operaciones solicitando entidades a través de las interfaces de los repositorios (`IRepository`), garantizando que la lógica de tarifas no dependa de la sintaxis del motor de base de datos.
3. **Acceso a Datos ➔ Base de Datos Relacional:** Los repositorios construyen y ejecutan consultas SQL seguras (evitando inyecciones SQL) sobre una conexión JDBC / PostgreSQL Client administrada por un Connection Pool.

---

### 5. CÓMO ABRIR EL MODELO EN STARUML
El proyecto incluye el archivo nativo de StarUML listo para ser descargado y abierto:
1. Ubica el archivo en tu repositorio o descárgalo desde la aplicación:  
   `/public/ParqueaderoAutosColombia_Arquitectura.mdj`
2. Abre la aplicación **StarUML** en tu computador.
3. Selecciona **File ➔ Open** y elige el archivo `ParqueaderoAutosColombia_Arquitectura.mdj`.
4. En el panel izquierdo de navegación (**Model Explorer**), despliega:  
   `Modelo Arquitectural del Sistema` ➔ `Diagrama de Arquitectura de 4 Capas`.
5. Verás los 4 paquetes estructurados con sus clases de interfaz, servicios, repositorios y tablas de base de datos con sus relaciones de dependencia.
