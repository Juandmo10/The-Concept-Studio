/**
 * THE CONCEPT STUDIO. — CALENDAR SERVICE (FIRESTORE)
 * Gestión modular de la colección 'calendario_sesiones'.
 */

const STORAGE_KEY = "TCS_FIRESTORE_CALENDARIO_SESIONES";

class StudioCalendarService {
  constructor() {
    this.listeners = [];
  }

  /**
   * Obtiene todas las sesiones registradas en Firestore.
   * @returns {Promise<Array<Object>>}
   */
  async getSesiones() {
    const local = localStorage.getItem(STORAGE_KEY);
    if (local) {
      try {
        return JSON.parse(local);
      } catch (e) {
        return [];
      }
    }
    return [];
  }

  /**
   * Crea una nueva sesión en la colección 'calendario_sesiones'.
   * @param {Object} data
   * @returns {Promise<Object>}
   */
  async crearSesion({
    titulo,
    clienteNombre = "",
    telefono = "",
    tipo = "Estudio",
    fechaInicio,
    hora = "",
    estado = "Confirmada",
    notas = ""
  }) {
    if (!titulo || !titulo.trim()) {
      throw new Error("El título de la sesión es requerido.");
    }

    const timestampMillis = fechaInicio ? new Date(fechaInicio).getTime() : Date.now();
    const id = "cal_" + Date.now() + "_" + Math.random().toString(36).substr(2, 6);

    const docData = {
      id,
      titulo: titulo.trim(),
      clienteNombre: clienteNombre.trim(),
      telefono: telefono.trim(),
      tipo: ["Estudio", "Exterior", "Cobertura"].includes(tipo) ? tipo : "Estudio",
      fechaInicio: {
        seconds: Math.floor(timestampMillis / 1000),
        nanoseconds: 0,
        isoString: new Date(timestampMillis).toISOString()
      },
      hora: hora.trim(),
      estado: ["Pendiente", "Confirmada", "Completada"].includes(estado) ? estado : "Confirmada",
      notas: notas.trim()
    };

    const sesiones = await this.getSesiones();
    sesiones.push(docData);
    this._persistAndNotify(sesiones);

    return docData;
  }

  /**
   * Actualiza una sesión existente en Firestore.
   * @param {string} id
   * @param {Object} updates
   */
  async actualizarSesion(id, updates) {
    let sesiones = await this.getSesiones();
    const idx = sesiones.findIndex(s => s.id === id);
    if (idx === -1) throw new Error("Sesión no encontrada.");

    sesiones[idx] = { ...sesiones[idx], ...updates };
    this._persistAndNotify(sesiones);
    return sesiones[idx];
  }

  /**
   * Elimina una sesión de Firestore.
   * @param {string} id
   */
  async eliminarSesion(id) {
    let sesiones = await this.getSesiones();
    sesiones = sesiones.filter(s => s.id !== id);
    this._persistAndNotify(sesiones);
    return true;
  }

  subscribe(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(cb => cb !== callback);
    };
  }

  _persistAndNotify(sesiones) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sesiones));
    this.listeners.forEach(cb => {
      try { cb(sesiones); } catch (e) {}
    });
  }
}

export const studioCalendarService = new StudioCalendarService();
