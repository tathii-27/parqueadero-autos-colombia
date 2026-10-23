# INSTITUCIÓN UNIVERSITARIA DIGITAL DE ANTIOQUIA — IU DIGITAL
## INGENIERÍA DE SOFTWARE Y TECNOLOGÍAS DE LA INFORMACIÓN
### PROYECTO INTEGRADOR: SISTEMA DE GESTIÓN "PARQUEADERO AUTOS COLOMBIA"
### ITERACIÓN 1: GESTIÓN DE LA ENTRADA Y SALIDA DE VEHÍCULOS
---
**Estudiante:** Tatiana Gallego  
**Correo Institucional:** tatiana.gallegog@est.iudigital.edu.co  
**Módulo:** Análisis, Diseño y Arquitectura de Software  
**Entregable:** Item 4 — Mockups y Prototipado de Interfaz de Usuario en Figma  
**Enlace al Prototipo Interactivo Oficial:** [Prototipo en Figma — Parqueadero Autos Colombia](https://www.figma.com/proto/KqmKxldrSK9RND8iz1Si8o/Parqueadero-Autos-Colombia?node-id=2011-3791&p=f&t=rAJnrMkW641cLTh8-1&scaling=scale-down&content-scaling=fixed&page-id=0%3A1)

---

## 1. INTRODUCCIÓN Y ENFOQUE METODOLÓGICO DE DISEÑO UI/UX

El diseño de interfaz de usuario (UI) y experiencia de usuario (UX) del sistema **"Parqueadero Autos Colombia"** se desarrolló siguiendo los principios del **Diseño Centrado en el Usuario (DCU)** y la metodología **Atomic Design**, adaptados a la realidad operativa de casetas de acceso y terminales de caja en Colombia.

### Objetivos de Usabilidad y Rendimiento:
1. **Velocidad de Operación:** Reducir el tiempo promedio de registro de entrada a menos de 10 segundos por vehículo, minimizando congestiones vehiculares en la vía pública.
2. **Cero Ambigüedad Cognitiva:** Uso estricto de códigos cromáticos estándar (Verde = Disponible, Rojo = Ocupado/Bloqueado, Ámbar = Novedad/Precaución, Azul = Búsqueda activa) con contraste certificado WCAG 2.1 nivel AA y AAA.
3. **Resiliencia Operativa:** Interfaces optimizadas tanto para monitores de escritorio (1440x900) como para terminales POS táctiles (1024x768) con teclados numéricos grandes y atajos de teclado (`Enter`, `Esc`, `F2`).
4. **Cumplimiento Legal Colombiano:** Integración visual obligatoria de datos fiscales según la **Ley 1480 de 2011 (Estatuto del Consumidor)**, el **Decreto 1074 de 2015** y la regulación de tiquetes de parqueadero en Colombia.

---

## 2. ENLACE DIRECTO AL PROTOTIPO EN FIGMA

El prototipo funcional navegable se encuentra alojado en la nube de Figma y cuenta con flujos interactivos, transiciones `Smart Animate` y microinteracciones de estado:

* **URL del Prototipo:** `https://www.figma.com/proto/KqmKxldrSK9RND8iz1Si8o/Parqueadero-Autos-Colombia?node-id=2011-3791&p=f&t=rAJnrMkW641cLTh8-1&scaling=scale-down&content-scaling=fixed&page-id=0%3A1`
* **Node ID Principal:** `2011-3791`
* **Página:** `0:1`
* **Dispositivo de Vista Previa:** Desktop / Terminal POS (Scaling: Scale down to fit).

---

## 3. ESPECIFICACIÓN DETALLADA DE LAS 5 PANTALLAS PRINCIPALES (REQUERIMIENTO EVALUADOR)

En atención a la retroalimentación del evaluador, a continuación se desglosan de manera exhaustiva las **cinco pantallas obligatorias del flujo nuclear de la Iteración 1**:

---

### PANTALLA 1: REGISTRO DE ENTRADA DE VEHÍCULOS
* **Frame en Figma:** `Frame 1: Caseta - Registro de Entrada`
* **Dispositivo Target:** Monitor de Caseta de Patio (1440 x 900 px)
* **Historias de Usuario Cubiertas:** `HU-01`, `HU-02`, `HU-03`, `HU-04`
* **Reglas de Negocio Implementadas:** `RN-01`, `RN-02`, `RN-03`, `RN-04`, `RN-05`

#### Descripción Funcional:
Es la pantalla de primera línea utilizada por el operador de acceso. Permite ingresar la placa del vehículo, realizar la validación sintáctica inmediata conforme al estándar RUNT, detectar automáticamente si la placa corresponde a un cliente con mensualidad vigente (exonerando el cobro rotativo), sugerir la celda libre más adecuada según la tipología vehicular y registrar novedades o inventario de accesorios recibidos.

#### Componentes Principales de Interfaz:
1. **Campo de Placa Asistido:** Input de alta visibilidad con autoformato en mayúsculas, soporte para vehículos particulares/públicos (ej. `HNE-612`) y motocicletas (ej. `ABC-12D`).
2. **Selector de Tipología Vehicular:** Tarjetas de selección con icono y tarifa base visible (Automóvil / SUV: $4.500/h; Motocicleta: $2.200/h; Pesado: $9.000/h).
3. **Detector Automático de Modalidad:**
   * Si la placa tiene contrato activo: Badge verde `Abonado Mensualista Activo · Tarifa $0 COP`.
   * Si es rotativo: Badge azul `Usuario Ocasional · Tarifa Plena por Horas/Fracción`.
4. **Selector Dinámico de Celdas:** Grilla desplegable filtrada por la zona correspondiente a la tipología (`Zona A: Autos`, `Zona B: Motos`, `Zona C: Pesados`), mostrando únicamente las celdas con estado `DISPONIBLE`.
5. **Panel de Inspección de Ingreso (Inventario Inicial):** Checkboxes y campo de texto libre para registrar rayones preexistentes, abolladuras o pertenencias especiales dejadas en custodia (cascos, maletines, herramientas).
6. **Botón de Acción Principal (CTA):** `CONFIRMAR INGRESO Y EMITIR TICKET` (Verde Esmeralda `#10B981`, accesible mediante la tecla `Enter`).

---

### PANTALLA 2: CONFIRMACIÓN DE INGRESO Y EMISIÓN DE TICKET
* **Frame en Figma:** `Frame 2: Terminal - Emisión de Ticket Térmico`
* **Dispositivo Target:** Terminal de Impresión Térmica ESC/POS (1024 x 768 px / Formato papel 58mm y 80mm)
* **Historias de Usuario Cubiertas:** `HU-04`, `HU-05`
* **Reglas de Negocio Implementadas:** `RN-04`, `RN-05`, `RN-06`, `RN-13`

#### Descripción Funcional:
Genera y presenta la vista previa del tiquete oficial de ingreso vehicular. Este documento constituye el contrato de depósito mercantil entre el usuario y el parqueadero, con plena validez legal ante la Superintendencia de Industria y Comercio de Colombia.

#### Componentes Principales de Interfaz:
1. **Encabezado Corporativo y Legal:** Razón Social: *Autos Colombia S.A.S.*, NIT: *900.842.125-4*, Régimen Común, Dirección y Teléfono de la sucursal.
2. **Número Consecutivo Único:** Identificador inmutable con formato `PAC-2026-XXXX` (ej. `PAC-2026-1042`).
3. **Bloque de Datos del Vehículo:** Placa tipificada en alta escala tipográfica (24pt monoespaciada), tipo de automotor y celda física asignada (ej. `Celda A-14`).
4. **Marca Temporal Exacta:** Fecha y hora exacta de captura de barrera (ej. `23/10/2026 - 15:24:18`).
5. **Código QR Bidimensional:** Código de alta densidad que encapsula el UUID del registro, la placa y el timestamp cifrado para escaneo instantáneo al momento de la salida.
6. **Cláusula Legal y Póliza:** Texto legal conforme a la Ley 1480 de 2011 sobre póliza de responsabilidad civil extracontractual y custodia de objetos declarados.
7. **Acciones Disponibles:** `IMPRIMIR TICKET TÉRMICO (Ctrl + P)`, `ENVIAR COPIA AL CORREO / WHATSAPP`, `NUEVO INGRESO`.

---

### PANTALLA 3: BÚSQUEDA Y MONITOREO DE VEHÍCULOS ACTIVOS
* **Frame en Figma:** `Frame 3: Patio - Búsqueda de Vehículos Activos`
* **Dispositivo Target:** Monitor de Administración / Caseta (1440 x 900 px)
* **Historias de Usuario Cubiertas:** `HU-06`, `HU-11`
* **Reglas de Negocio Implementadas:** `RN-06`, `RN-07`, `RN-11`

#### Descripción Funcional:
Tablero de mando reactivo que muestra el estado en tiempo real del patio de estacionamiento. Permite a los supervisores, operadores y personal de seguridad localizar en menos de 100 ms cualquier automotor que se encuentre dentro de las instalaciones.

#### Componentes Principales de Interfaz:
1. **Buscador Predictivo Omnicanal:** Campo de búsqueda en tiempo real capaz de filtrar instantáneamente por número de placa (coincidencia exacta o parcial), número de tiquete emitido o identificador de celda.
2. **Indicadores de Ocupación en Vivo (KPI Cards):**
   * *Celdas Libres:* 154 (Verde)
   * *Celdas Ocupadas:* 89 (Rojo)
   * *Celdas Reservadas:* 12 (Ámbar)
   * *Aforo Total:* 255 plazas (34.9% disponible)
3. **Filtros Rápidos por Categoría:** Botones tipo chip para conmutar rápidamente entre `Todos`, `Automóviles`, `Motocicletas`, `Camionetas` y `Pesados`.
4. **Listado / Grilla de Vehículos en Patio:** Cada tarjeta presenta:
   * Placa con bandera de tipo de usuario (Mensualista vs Rotativo).
   * Hora exacta de ingreso y celda asignada.
   * Contador reactivo de tiempo transcurrido (ej. `1h 45m`).
   * Valor acumulado estimado a la fecha.
   * Botón de acción contextual `LIQUIDAR SALIDA`.

---

### PANTALLA 4: REGISTRO DE SALIDA Y LIQUIDACIÓN DEL COBRO
* **Frame en Figma:** `Frame 4: Taquilla - Liquidación y Cobro de Salida`
* **Dispositivo Target:** Terminal POS de Caja (1024 x 768 px)
* **Historias de Usuario Cubiertas:** `HU-06`, `HU-07`, `HU-10`
* **Reglas de Negocio Implementadas:** `RN-06`, `RN-07`, `RN-08`, `RN-09`, `RN-14`

#### Descripción Funcional:
Pantalla crítica de la estación de cobro y salida. Realiza el cómputo exacto de la permanencia del automotor a partir del tiquete o placa, aplica las políticas comerciales de cobro por horas completas y fracciones autorizadas, gestiona el periodo de gracia y asiste al cajero en el recaudo multicanal.

#### Componentes Principales de Interfaz:
1. **Cronómetro de Permanencia:**
   * Hora de Ingreso: `14:05:00` | Hora de Salida: `16:22:15`
   * Tiempo Total Transcurrido: `2 horas 17 minutos`.
2. **Aplicación Automática del Periodo de Gracia:**
   * Regla de Gracia de 15 minutos: Si el automotor permanece ≤ 15 minutos desde el ingreso, la pantalla muestra una alerta verde `PERIODO DE GRACIA APLICADO: TARIFA $0 COP`.
3. **Desglose Tarifario Matemático:**
   * Cálculo de 2 horas completas + 1 fracción superior a 15 minutos = Liquidación sobre 3 horas ($13.500 COP).
4. **Módulo de Novedades e Inspección de Egreso:**
   * Panel de advertencia ámbar si el automotor registró alguna novedad o daño previo al ingresar, exigiendo validación antes de liberar la salida (garantía jurídica según RN-14).
5. **Selector Multicanal de Pago:**
   * `Efectivo` (con calculadora automática de billete recibido y devuelta exacta).
   * `Nequi / Daviplata` (con generación de QR de transferencia instantánea).
   * `Tarjeta Débito / Crédito` (con integración a datáfono).
6. **Botón de Liquidación:** `CONFIRMAR PAGO Y REGISTRAR SALIDA` (Botón amplio accesible vía pantalla táctil o tecla `F2`).

---

### PANTALLA 5: CONFIRMACIÓN DE SALIDA Y RECIBO FISCAL DE CAJA
* **Frame en Figma:** `Frame 5: Salida Exitosa y Recibo Fiscal`
* **Dispositivo Target:** Terminal POS de Caja y Pantalla de Conductor (1024 x 768 px)
* **Historias de Usuario Cubiertas:** `HU-08`, `HU-09`
* **Reglas de Negocio Implementadas:** `RN-09`, `RN-10`, `RN-12`

#### Descripción Funcional:
Culminación del ciclo operativo de salida. Garantiza el registro atómico de la transacción financiera en la base de datos, emite la factura o comprobante fiscal equivalente conforme a la DIAN, envía la instrucción de apertura de la talanquera de salida y actualiza de inmediato el mapa de celdas liberando la plaza a estado `DISPONIBLE`.

#### Componentes Principales de Interfaz:
1. **Banner de Confirmación de Apertura:** Indicador gráfico de gran escala: `SALIDA CONFIRMADA · TALANQUERA HABILITADA PARA PASO`.
2. **Comprobante Fiscal de Caja Oficial:**
   * Número de Recibo Consecutivo: `REC-008920`.
   * Datos del Cliente / Placa: `HNE-612`.
   * Medio de pago utilizado y referencia de transacción bancaria.
   * Desglose impositivo: Subtotal, Base imponible e IVA (19% régimen común / excluido régimen simple).
   * Identificador y nombre del cajero en turno.
3. **Notificación de Liberación de Celda:**
   * Mensaje en vivo: `Celda A-14 liberada exitosamente -> Estado: DISPONIBLE (Color Verde)`.
4. **Acciones de Cierre:**
   * `IMPRIMIR RECIBO FISCAL TÉRMICO`.
   * `ENVIAR COPIA AL CORREO DEL CLIENTE`.
   * `VOLVER AL PANEL DE PATIO (ESC)`.

---

## 4. SISTEMA DE DISEÑO (FIGMA DESIGN TOKENS)

Para garantizar consistencia estética, accesibilidad y escalabilidad, el prototipo en Figma fue construido con las siguientes variables de diseño compartidas con el código fuente en React y Tailwind CSS:

```css
/* PARQUEADERO AUTOS COLOMBIA - FIGMA DESIGN TOKENS */
/* 1. Paleta de Colores Corporativa */
--color-primary: #10B981;          /* Emerald 500 - Acciones principales y disponible */
--color-primary-dark: #059669;     /* Emerald 600 - Hover y botones de confirmación */
--color-surface-sidebar: #0F172A;  /* Slate 900 - Barra de navegación y terminal */
--color-surface-card: #FFFFFF;     /* Slate 0 - Contenedores y formularios */
--color-surface-bg: #F8FAFC;       /* Slate 50 - Fondo general de la aplicación */
--color-border: #E2E8F0;           /* Slate 200 - Líneas divisorias */
--color-status-available: #10B981; /* Verde - Celda libre */
--color-status-occupied: #EF4444;  /* Rojo - Celda ocupada / Deuda */
--color-status-reserved: #F59E0B;  /* Ámbar - Celda reservada / Novedad */
--color-accent-blue: #2563EB;      /* Azul - Búsqueda, mensualistas y RUNT */

/* 2. Escala Tipográfica (Tipografía Inter + JetBrains Mono) */
Display: 32px / Bold (Inter) — Titulares de cabina y aforo
H1: 24px / Bold (Inter) — Títulos de sección
H2: 18px / SemiBold (Inter) — Subsecciones y modales
Body: 14px / Regular (Inter) — Formularios y descripciones
Caption: 12px / Medium (Inter) — Metadatos y notas al pie
Mono/Plate: 16px / Bold (JetBrains Mono) — Placas vehiculares y códigos QR

/* 3. Rejilla y Espaciado (8-Point Grid System) */
Base Unit: 8px (8px, 16px, 24px, 32px, 48px, 64px)
Border Radius: Card (12px), Button (8px), Tag (6px), Input (8px)
Elevations: Soft Shadow (0 4px 6px -1px rgb(0 0 0 / 0.05))
```

---

## 5. MATRIZ DE TRAZABILIDAD ENTRE MOCKUPS Y REQUERIMIENTOS DE LA ITERACIÓN 1

| Pantalla en Figma | Frame de Figma | Historias de Usuario Asociadas | Requerimientos Funcionales | Casos de Prueba Validados |
| :--- | :--- | :--- | :--- | :--- |
| **Pantalla 1: Registro de Entrada** | `Frame 1: Caseta - Registro de Entrada` | `HU-01`, `HU-02`, `HU-03`, `HU-04` | `RF-01`, `RF-02`, `RF-03`, `RF-04` | `CP-01`, `CP-02`, `CP-03` |
| **Pantalla 2: Emisión de Ticket** | `Frame 2: Terminal - Ticket Térmico` | `HU-04`, `HU-05` | `RF-04`, `RF-05` | `CP-04` |
| **Pantalla 3: Búsqueda y Patio** | `Frame 3: Patio - Búsqueda Activos` | `HU-06`, `HU-11` | `RF-06`, `RF-11` | `CP-05`, `CP-07` |
| **Pantalla 4: Salida y Cobro** | `Frame 4: Taquilla - Liquidación Cobro` | `HU-06`, `HU-07`, `HU-10` | `RF-06`, `RF-07`, `RF-10` | `CP-05`, `CP-06` |
| **Pantalla 5: Confirmación y Recibo** | `Frame 5: Salida Exitosa y Recibo` | `HU-08`, `HU-09` | `RF-08`, `RF-09` | `CP-06` |

---

## 6. INSTRUCCIONES PARA EXPORTAR Y ANEXAR EN EL DOCUMENTO ESCRITO

1. **Acceso al Enlace:** Abra el enlace oficial de Figma proporcionado en la Sección 2.
2. **Exportar Pantallas en Alta Resolución:**
   * En Figma, seleccione los Frames nombrados `Frame 1` a `Frame 5`.
   * En el panel derecho, desplácese a la sección **Export**.
   * Seleccione formato `PNG` o `JPG` con escala `2x` para máxima nitidez de impresión.
   * Haga clic en `Export Selected`.
3. **Pegar en el Documento Académico:** Inserte cada captura de pantalla en la sección correspondiente del informe final, acompañada de la ficha descriptiva y la matriz de trazabilidad contenidas en este documento.
