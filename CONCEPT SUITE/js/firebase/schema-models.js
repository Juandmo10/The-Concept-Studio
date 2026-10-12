/**
 * THE CONCEPT STUDIO. — DATA ARCHITECTURE & FIRESTORE SCHEMAS
 * Production NoSQL Schemas for Sessions, Events, Photos, and Orders.
 */

/**
 * Collection: /calendario_sesiones/{sesionId}
 * Schema para la agenda operativa de rodajes y citas de estudio.
 * 
 * @typedef {Object} CalendarioSesion
 * @property {string} id - Identificador único de la sesión
 * @property {string} titulo - Título de la sesión
 * @property {string} clienteNombre - Nombre completo del cliente o agencia
 * @property {string} telefono - Teléfono de contacto
 * @property {"Estudio" | "Exterior" | "Cobertura"} tipo - Tipo de sesión
 * @property {Object} fechaInicio - Timestamp de inicio de la sesión
 * @property {string} hora - Hora de llamado en formato 24 horas
 * @property {"Pendiente" | "Confirmada" | "Completada"} estado - Estado de la cita
 * @property {string} notas - Notas técnicas, locación o requerimientos de equipo
 */
export const CalendarioSesionModel = {
  id: "",
  titulo: "",
  clienteNombre: "",
  telefono: "",
  tipo: "Estudio", // "Estudio" | "Exterior" | "Cobertura"
  fechaInicio: null, // Firestore Timestamp
  hora: "",
  estado: "Confirmada", // "Pendiente" | "Confirmada" | "Completada"
  notas: ""
};

/**
 * Collection: /eventos/{eventoId}
 * Schema para eventos públicos de cobertura y venta unitaria de fotografías.
 * 
 * @typedef {Object} EventoPublico
 * @property {string} id - Slug o identificador único del evento
 * @property {string} nombre - Nombre comercial del evento
 * @property {Object} fecha - Timestamp de la fecha del evento
 * @property {number} precioPorFoto - Precio por fotografía individual
 * @property {string} moneda - Moneda del evento ("USD")
 * @property {boolean} activo - Estado de publicación del evento
 */
export const EventoPublicoModel = {
  id: "",
  nombre: "",
  fecha: null, // Firestore Timestamp
  precioPorFoto: 0.75,
  moneda: "USD",
  activo: true
};

/**
 * Subcollection: /eventos/{eventoId}/fotos/{fotoId}
 * Schema de fotografías cargadas dentro de un evento de cobertura.
 * 
 * @typedef {Object} EventoFoto
 * @property {string} id - Identificador secuencial de la imagen
 * @property {string} nombreArchivoOriginal - Nombre de archivo original cargado
 * @property {string} urlWatermark - URL pública con marca de agua en baja resolución
 * @property {string} pathOriginalStorage - Ruta interna privada en Firebase Storage (/eventos/{eventoId}/privadas_originales/{id}.jpg)
 * @property {number} ordenIndex - Posición ordinal de visualización
 * @property {boolean} disponible - Disponibilidad para compra
 */
export const EventoFotoModel = {
  id: "",
  nombreArchivoOriginal: "",
  urlWatermark: "",
  pathOriginalStorage: "",
  ordenIndex: 0,
  disponible: true
};

/**
 * Collection: /ordenes/{ordenId}
 * Schema para transacciones de compra de fotografías. Cumple PCI-DSS.
 * 
 * @typedef {Object} OrdenCompra
 * @property {string} id - Identificador único de orden
 * @property {string} eventoId - Identificador del evento asociado
 * @property {string} clienteEmail - Correo electrónico para entrega de enlaces
 * @property {string} clienteTelefono - Teléfono de contacto
 * @property {Array<string>} fotosSeleccionadas - Lista de IDs de fotografías compradas
 * @property {number} totalMonto - Importe total liquidado
 * @property {"YAPPY" | "TARJETA"} metodoPago - Método de pago utilizado
 * @property {string} transaccionId - Identificador de transacción devuelto por la pasarela
 * @property {"PENDIENTE" | "APROBADO" | "RECHAZADO"} estadoPago - Estado de conciliación
 * @property {Object} fechaCreacion - Timestamp de creación de la orden
 */
export const OrdenCompraModel = {
  id: "",
  eventoId: "",
  clienteEmail: "",
  clienteTelefono: "",
  fotosSeleccionadas: [],
  totalMonto: 0,
  metodoPago: "TARJETA", // "YAPPY" | "TARJETA"
  transaccionId: "",
  estadoPago: "PENDIENTE", // "PENDIENTE" | "APROBADO" | "RECHAZADO"
  fechaCreacion: null // Firestore Timestamp
};
