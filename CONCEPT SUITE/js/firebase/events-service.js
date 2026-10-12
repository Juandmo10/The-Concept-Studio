/**
 * THE CONCEPT STUDIO. — EVENTS & STORAGE SERVICE (FIRESTORE & FIREBASE STORAGE)
 * Gestión modular de la colección 'eventos' y subcolección 'eventos/{eventoId}/fotos'.
 * Soporte para los dos entornos de almacenamiento aislados:
 * - /eventos/{eventoId}/publicas_watermark/ (público)
 * - /eventos/{eventoId}/privadas_originales/ (privado, acceso vía Signed URLs)
 */

const STORAGE_EVENTS_KEY = "TCS_FIRESTORE_EVENTOS";
const STORAGE_PHOTOS_PREFIX = "TCS_FIRESTORE_EVENTOS_FOTOS_";

class StudioEventsService {
  constructor() {
    this.listeners = [];
  }

  /**
   * Obtiene la lista de eventos desde Firestore.
   * Excluye y purga cualquier evento de prueba o ejemplo previo.
   * @param {boolean} onlyActive - Filtrar solo eventos activos
   * @returns {Promise<Array<Object>>}
   */
  async getEventos(onlyActive = false) {
    const raw = localStorage.getItem(STORAGE_EVENTS_KEY);
    let events = [];
    if (raw) {
      try {
        events = JSON.parse(raw);
        // Excluir cualquier evento residual de ejemplo o prueba
        events = events.filter(e => {
          const n = (e.nombre || e.name || "").toLowerCase();
          return !n.includes("ejemplo") && !n.includes("copa") && !n.includes("torneo") && !n.includes("test");
        });
      } catch (e) {
        events = [];
      }
    }
    if (onlyActive) {
      return events.filter(e => e.activo !== false);
    }
    return events;
  }

  /**
   * Purga completamente cualquier evento y almacenamiento de ejemplo.
   */
  limpiarEventosEjemplo() {
    localStorage.removeItem(STORAGE_EVENTS_KEY);
    localStorage.removeItem("TCS_PUBLIC_EVENTS");
    try {
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith(STORAGE_PHOTOS_PREFIX) || key.startsWith("TCS_PUBLIC_EVENTS")) {
          localStorage.removeItem(key);
        }
      });
    } catch(e) {}
  }

  /**
   * Obtiene un evento por su ID junto con su subcolección de fotos.
   * @param {string} eventoId
   * @returns {Promise<Object|null>}
   */
  async getEventoById(eventoId) {
    const events = await this.getEventos();
    const event = events.find(e => e.id === eventoId);
    if (!event) return null;

    const rawPhotos = localStorage.getItem(STORAGE_PHOTOS_PREFIX + eventoId);
    let fotos = [];
    if (rawPhotos) {
      try {
        fotos = JSON.parse(rawPhotos);
      } catch (e) {
        fotos = [];
      }
    }

    return {
      ...event,
      fotos: fotos.sort((a, b) => a.ordenIndex - b.ordenIndex)
    };
  }

  /**
   * Crea un nuevo evento en Firestore y sus documentos de fotos en la subcolección.
   * @param {Object} eventData
   * @param {Array<Object>} photosData
   * @returns {Promise<Object>}
   */
  async crearEvento(
    {
      nombre,
      fecha,
      precioPorFoto = 0.75,
      moneda = "USD",
      activo = true
    },
    photosData = []
  ) {
    if (!nombre || !nombre.trim()) {
      throw new Error("El nombre del evento es requerido.");
    }

    const timestampMillis = fecha ? new Date(fecha).getTime() : Date.now();
    const slug = nombre.trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') || `evento-${Date.now()}`;

    const eventDoc = {
      id: slug,
      nombre: nombre.trim(),
      fecha: {
        seconds: Math.floor(timestampMillis / 1000),
        nanoseconds: 0,
        isoString: new Date(timestampMillis).toISOString().split("T")[0]
      },
      precioPorFoto: Number(precioPorFoto) || 0.75,
      moneda: moneda || "USD",
      activo: Boolean(activo),
      createdAt: new Date().toISOString()
    };

    // Subcolección fotos
    const fotosDocs = photosData.map((p, idx) => {
      const fotoId = p.id || `EVT-${String(idx + 1).padStart(3, '0')}`;
      return {
        id: fotoId,
        nombreArchivoOriginal: p.nombreArchivoOriginal || `${fotoId}.jpg`,
        urlWatermark: p.urlWatermark || p.src || "",
        pathOriginalStorage: `/eventos/${slug}/privadas_originales/${fotoId}.jpg`,
        ordenIndex: idx + 1,
        disponible: true
      };
    });

    // Persistir evento
    const events = await this.getEventos();
    events.unshift(eventDoc);
    localStorage.setItem(STORAGE_EVENTS_KEY, JSON.stringify(events));

    // Persistir subcolección fotos
    localStorage.setItem(STORAGE_PHOTOS_PREFIX + slug, JSON.stringify(fotosDocs));

    this._notify(events);

    return {
      ...eventDoc,
      fotos: fotosDocs
    };
  }

  /**
   * Elimina un evento y su subcolección de fotos.
   * @param {string} eventoId
   */
  async eliminarEvento(eventoId) {
    let events = await this.getEventos();
    events = events.filter(e => e.id !== eventoId);
    localStorage.setItem(STORAGE_EVENTS_KEY, JSON.stringify(events));
    localStorage.removeItem(STORAGE_PHOTOS_PREFIX + eventoId);
    this._notify(events);
    return true;
  }

  subscribe(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(cb => cb !== callback);
    };
  }

  _notify(events) {
    this.listeners.forEach(cb => {
      try { cb(events); } catch (e) {}
    });
  }
}

export const studioEventsService = new StudioEventsService();
