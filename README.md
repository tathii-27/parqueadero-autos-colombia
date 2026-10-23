# 🚗 Sistema de Gestión Parqueadero Autos Colombia

> **Proyecto de Ingeniería de Software**  
> **Institución Universitaria Digital de Antioquia (IU Digital)**  
> **Autora:** Tatiana Gallego  
> **Correo Institucional:** `tatiana.gallegog@est.iudigital.edu.co`  
> **Versión:** 1.0.0  
> **Tecnologías:** React 19, TypeScript, Vite, Tailwind CSS, StarUML 5.x / PlantUML  

---

## 📌 Descripción del Proyecto

El **Sistema de Gestión Parqueadero Autos Colombia** es una plataforma integral desarrollada para modernizar el control operativo, financiero y de seguridad de parqueaderos en Colombia.

El sistema implementa la normativa colombiana de validación de placas vehiculares (RUNT), tarifas diferenciadas por categoría vehicular, liquidación de fracciones de tiempo, arqueo de caja y modelado formal de arquitectura de software bajo el estándar **UML 2.5** con compatibilidad nativa para **StarUML**.

---

## 🚀 Características Principales

1. **Gestión de Entradas y Salidas en Tiempo Real:**
   - Registro instantáneo con cálculo de bahía o celda asignada.
   - Validación colombiana de placas según formato vehicular (Automóvil `AAA-123`, Moto `AAA-12D`, Camión/Pesado `AAA-123`, Bicicleta `BIC-001`).
   - Verificación de estado de SOAT y Revisión Técnico-Mecánica (RTM).

2. **Tarifas y Liquidación Automatizada:**
   - Cálculo automático de cobro por minuto, hora, fracción, día y noche.
   - Generación de recibo de cobro con desglose detallado e IVA.

3. **Caja y Control Financiero (Arqueo):**
   - Apertura, balance en tiempo real y cierre de caja.
   - Reportes de ingresos por medios de pago (Efectivo, Nequi, Daviplata, Tarjetas).

4. **Gestión de Abonados y Mensualidades:**
   - Registro de clientes recurrentes con tarifas preferenciales y control de vigencia.

5. **Módulo de Arquitectura de Software y Modelado StarUML:**
   - **Diagrama de Paquetes UML 2.5 (100% en Español):**
     - Estructurado en capas: *Presentación*, *Controlador*, *Lógica de Negocio*, *Persistencia / Datos* y *Servicios Externos*.
     - Visualizador interactivo integrado en la aplicación web.
     - Matriz de trazabilidad y dependencias entre paquetes.
     - Código PlantUML editable y copiable al portapapeles.
     - Exportación a **SVG vectorial**, **imagen PNG** y archivo nativo de **StarUML (`.mdj`)**.
   - **Diagrama de Casos de Uso:** Modelado de actores (Cajero, Administrador, Validador RUNT, Cliente) y sus casos de uso.
   - **Diagrama de Clases:** Definición de entidades del dominio, atributos, operaciones y multiplicidades.

---

## 📁 Archivos de Modelado StarUML Incluidos

En el directorio `public/` se encuentran disponibles los archivos de diseño y modelado arquitectónico:

| Archivo | Formato | Descripción |
| :--- | :--- | :--- |
| `public/ParqueaderoAutosColombia_Paquetes.mdj` | StarUML v5.x | Archivo de proyecto nativo para abrir y editar directamente en StarUML. |
| `public/Diagrama_Paquetes_Parqueadero_Autos_Colombia.svg` | SVG Vectorial | Diagrama en alta resolución con estilos UML 2.5 estándar y textos en español. |

---

## 🛠️ Estructura del Código Fuente

```text
parqueadero-autos-colombia/
├── public/                                      # Recursos públicos y archivos StarUML (.mdj, .svg)
│   ├── ParqueaderoAutosColombia_Paquetes.mdj    # Archivo nativo StarUML
│   └── Diagrama_Paquetes_Parqueadero_Autos_Colombia.svg
├── src/
│   ├── components/
│   │   ├── PackageDiagramView.tsx               # Módulo interactivo del Diagrama de Paquetes
│   │   ├── CashierView.tsx                      # Arqueo y gestión de caja
│   │   ├── SubscriptionsView.tsx                # Control de mensualidades
│   │   └── ...                                  # Vistas de cobro, tickets y parqueadero
│   ├── data/
│   │   ├── packageDiagramData.ts                # Especificaciones UML en español y código PlantUML
│   │   └── ...
│   ├── types/                                   # Modelos y contratos de TypeScript
│   ├── App.tsx                                  # Componente raíz de la aplicación
│   └── main.tsx                                 # Punto de entrada de React
├── package.json                                 # Dependencias y scripts del proyecto
├── tsconfig.json                                # Configuración de TypeScript
├── vite.config.ts                               # Configuración del empaquetador Vite
└── README.md                                    # Documentación del proyecto
```

---

## 💻 Requisitos Previos

- **Node.js**: Versión 18.0 o superior ([Descargar Node.js](https://nodejs.org/))
- **npm** (o yarn / pnpm / bun)
- **Git** instalado en el equipo ([Descargar Git](https://git-scm.com/))
- *(Opcional)* **StarUML** v5.x o superior para abrir los archivos `.mdj` ([Descargar StarUML](https://staruml.io/))

---

## ⚙️ Instalación y Ejecución Local

1. **Clonar o descargar el repositorio:**
   ```bash
   git clone https://github.com/<tu-usuario-github>/parqueadero-autos-colombia.git
   cd parqueadero-autos-colombia
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Iniciar el servidor de desarrollo:**
   ```bash
   npm run dev
   ```
   La aplicación estará corriendo en `http://localhost:3000` (o el puerto indicado en la terminal).

4. **Compilar para producción:**
   ```bash
   npm run build
   ```

---

## 📤 Publicación y Sincronización con GitHub

Para sincronizar este código fuente con tu cuenta personal o institucional en GitHub (`tatiana.gallegog@est.iudigital.edu.co`):

1. **Crear un nuevo repositorio en GitHub:**
   - Ingresa a [https://github.com/new](https://github.com/new).
   - Asigna el nombre: `parqueadero-autos-colombia`.
   - Selecciona visibilidad **Pública** o **Privada**.
   - **Nota:** No marques la casilla "Initialize this repository with a README", ya que este repositorio ya lo incluye.
   - Haz clic en **Create repository**.

2. **Vincular y subir el código desde tu terminal:**
   ```bash
   # 1. Vincular el repositorio remoto de GitHub
   git remote add origin https://github.com/tathii-27/parqueadero-autos-colombia.git

   # 2. Asegurar que la rama principal sea main
   git branch -M main

   # 3. Subir todos los archivos y ramas a GitHub
   git push -u origin main
   ```

3. **Autenticación en GitHub:**
   - Si GitHub te solicita contraseña en la terminal, utiliza un **Personal Access Token (Classic)** con permisos de `repo` generado desde [GitHub Token Settings](https://github.com/settings/tokens).

---

## 📄 Créditos y Licencia

- **Proyecto Académico:** Institución Universitaria Digital de Antioquia (IU Digital).
- **Estudiante / Desarrolladora:** Tatiana Gallego (`tatiana.gallegog@est.iudigital.edu.co`).
- **Licencia:** MIT - Código abierto para fines académicos y formativos.
