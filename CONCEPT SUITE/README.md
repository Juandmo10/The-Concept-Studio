# THE CONCEPT STUDIO. — LUXURY SAAS PLATFORMS

> **Suite web de dos plataformas independientes para "THE CONCEPT STUDIO.", agencia boutique de fotografía deportiva de alto impacto y producción audiovisual comercial de lujo.**

### Módulo Destacado: Sistema de Galerías, Selección de Pruebas y Pipeline de Retoque Automático
* **Panel del Fotógrafo**: [admin-app.html](file:///Users/juandmo1030/Documents/CONCEPT%20SUITE/admin-app.html) (Ajustes .XMP, creador de sesiones en 30s, tabla editorial sin datos mock y visualizador de pipeline).
* **Vista Pública del Cliente**: [gallery.html](file:///Users/juandmo1030/Documents/CONCEPT%20SUITE/gallery.html) / [galeria/](file:///Users/juandmo1030/Documents/CONCEPT%20SUITE/galeria/index.html) (Acceso directo mobile-first desde WhatsApp, logo en dos líneas, bloqueo por cupo, confirmación y entrega de revelado).
* **Preset Engine & Worker**: [js/pipeline-processor.js](file:///Users/juandmo1030/Documents/CONCEPT%20SUITE/js/pipeline-processor.js) y [js/gallery-manager.js](file:///Users/juandmo1030/Documents/CONCEPT%20SUITE/js/gallery-manager.js).

---

## 1. Dirección de Arte & Sistema de Diseño (Estética de Lujo / High-End Studio)

* **Identidad de Marca**: Tipografía sans-serif ultra gruesa en mayúsculas sostenidas, siempre finalizando con el punto de acento dorado: **`THE CONCEPT STUDIO.`**
* **Paleta de Colores**:
  * **Fondo Principal & Superficies Base**: Azul Navy muy oscuro / Midnight Navy (`#070D1E` y `#03060E`).
  * **Superficies Elevadas (Cards, Modales, Barras)**: Navy profundo con sutil transparencia y desenfoque (`#0F1A36` con `backdrop-filter: blur(12px)`).
  * **Tipografía & Elementos Base**: Blanco puro (`#FFFFFF`) y Blanco Hueso (`#F0F3F8`) para garantizar legibilidad y contraste total.
  * **Detalles y Acentos (Lujo Discreto)**: Dorado Suave / Champagne Mate (`#D4AF37` / `#E5C378` / `#C5A059`) empleado con estricta moderación: bordes finos de 1px, badges de estado premium, el punto final del logo en la interfaz, contadores de cupo activos y botones de confirmación clave.
* **Acabados Visuales**: Bordes nítidos con radio sutil de **6px a 8px**, microinteracciones refinadas, desenfoques de fondo y sombras profundas de baja opacidad.

---

## 2. Las Dos Plataformas Web Independientes

La interfaz cuenta con una barra superior de simulación de dominios que permite previsualizar e interactuar entre ambos entornos:

### PLATAFORMA 1: Portal del Cliente (`portal.theconceptstudio.com`)
Diseñado como una experiencia boutique inmersiva, sin fricción ni curvas de aprendizaje:
1. **Acceso VIP por Magic Link / Código**:
   * Pantalla de bienvenida minimalista personalizada con el nombre del cliente y su institución (`MARCUS VANCE // NIKE GLOBAL ATHLETICS`) y token verificado (`TCS-VIP-8842`).
2. **Hero Presentation / Cabecera Cinemática**:
   * Encabezado a pantalla ancha del reel principal de la sesión de rodaje con metadatos de cámaras de cine utilizadas (`RED V-Raptor 8K VV`, `Phantom Flex 4K`, `Canon R5 Mark II 45MP`).
3. **Galería de Selección Inteligente (Proofing)**:
   * Cuadrícula *masonry* fluida con visor *lightbox* de alta resolución.
   * Contador dinámico en dorado suave con límite de paquete contractual (`14 / 20 seleccionadas`).
   * **Detección de fotos adicionales**: Aviso visual animado si se supera el cupo base (`+$45 USD por foto adicional seleccionada`).
   * Botón flotante prominente: **"Confirmar y Enviar Selección"**.
4. **Reproductor de Video con Feedback Puntual & Pines en Pantalla**:
   * Reproductor integrado para piezas comerciales y reels de alta velocidad.
   * Caja de comentarios anclada a marcas de tiempo exactas (`00:01:24:18`).
   * **Marcador visual sobre el video**: El cliente puede hacer click directamente sobre cualquier coordenada del cuadro para fijar un pin dorado en pantalla y señalar elementos específicos (ej. texturas, destellos de luz, detalles en suelas).
5. **Bóveda de Descargas Multi-Formato**:
   * **Versión Web / Redes Sociales**: Optimizada para Instagram (4:5 vertical y 9:16 Reels a 1080p).
   * **Versión Master / Impresión**: Resolución original sin compresión (Apple ProRes 422 HQ, TIFF y Canon CR3 RAW de 45 Megapíxeles).
6. **Visor de Contratos y Pagos**:
   * Resumen formal de propuesta y desglose de servicios con firma digital integrada en canvas dorado.
   * Estado de cuenta del proyecto con métricas claras: Total Presupuestado ($18,500 USD), Anticipo Pagado ($9,250 USD) y Saldo Pendiente ($9,250 USD).
   * Zona de subida interactiva para **adjuntar comprobante de transferencia o pago bancario**.

---

### PLATAFORMA 2: Panel de Administración (`app.theconceptstudio.com`)
Centro de comando operativo para el director de la agencia:
1. **Navegación y Dashboard Ejecutivo**:
   * Menú lateral estructurado encabezado por el logo oficial: `THE CONCEPT STUDIO.`
   * Tarjetas de balance financiero con métricas clave:
     * Ingresos del Mes: **$148,500 USD** (+24.5%).
     * Cobros Pendientes: **$34,200 USD**.
     * Ticket Promedio Deportivo: **$22,400 USD** (Campañas atléticas high-speed).
     * Ticket Promedio Comercial: **$38,500 USD** (Comerciales y buyouts globales).
2. **Carga y Protección Automatizada**:
   * Zona de subida masiva conectada conceptualmente a Firebase Storage.
   * **Interruptor (Switch) para aplicar marca de agua central automática**: Estampa dinámicamente el sello `THE CONCEPT STUDIO.` en diagonal a todas las muestras de prueba del cliente.
3. **Generador de Enlaces con Expiración**:
   * Creación de accesos únicos por token para clientes con configuración de fecha límite (48 horas, 5 días o 14 días), con copia rápida de enlace VIP.
4. **Pipeline de Producción (Kanban de 5 Etapas)**:
   * 5 columnas operativas con arrastrar y soltar nativo (Drag and Drop):
     1. `Pre-producción / Por Rodar`
     2. `En Selección (Esperando cliente)`
     3. `Post-producción / Color`
     4. `Revisión`
     5. `Entregado / Cerrado`
5. **Call Sheet & Logística de Rodaje**:
   * Fichas de rodaje con horario de citación (`05:30 AM`), locación y coordenadas GPS, contactos de dirección/talento y checklist técnico interactivo de equipos en set.
6. **Inventario y Mantenimiento de Equipos**:
   * Registro de inventario técnico (Cuerpos de cámara, lentes anamórficos, generadores de flash, estabilizadores, memorias CFexpress).
   * **Alertas operativas**: Formateo seguro de tarjetas (`CFexpress 2TB: Requiere formateo seguro exFAT`) y alertas de servicio/limpieza ultrasónica de sensor.
7. **CRM de Clientes**:
   * Base de datos institucional con cajón lateral deslizable (*Slide Drawer*) para consultar y redactar notas privadas de producción.

---

## 3. Estructura de Datos (Emulación Firebase Firestore)

Los datos están estructurados en colecciones limpias y reactivas:

```javascript
// /users/{userId}
{ id, name, institution, role: 'client_vip' | 'agency_director', accessPin }

// /projects/{projectId}
{ id, title, category: 'COMMERCIAL' | 'SPORTS_HIGH_SPEED', basePackageLimit: 20, extraPhotoCostUsd: 45, watermarkEnabled: true }

// /video_reviews/{videoId}/comments/{commentId}
{ id, timecodeFormatted: "00:08", pinX: 48, pinY: 42, author, text, category, status }

// /inventory/{gearId}
{ id, name, category, status: 'OPERATIVO' | 'REQUIERE FORMATEO' | 'ALERTA MANTENIMIENTO', alertText }

// /client_links/{linkId}
{ id, clientName, token, expiresIn: "48 HORAS", expiresAtDate, status: "ACTIVO" }
```

---

## 4. Ejecución del Entorno Local

El servidor estático ya se encuentra activo en el puerto `3333`:
* **URL:** `http://localhost:3333`
