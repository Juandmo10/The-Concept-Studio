/**
 * THE CONCEPT STUDIO. — GESTOR DE SESIONES Y GALERÍAS
 * Estado de sesiones: Esperando selección / En fila de retoque automático / Procesando / Listo para entrega
 * Cero datos mock en estado inicial: Estado limpio ("Sin sesiones activas")
 */

import { studioPresetEngine, studioPipelineProcessor } from "./pipeline-processor.js";

export class GalleryManager {
  constructor() {
    this.storageKey = "TCS_GALLERIES_DB_V1";
    this.activeKey = "TCS_CURRENT_ACTIVE_SESSION_ID";
    this.listeners = new Set();
    this._initStorageListener();
  }

  _initStorageListener() {
    window.addEventListener("storage", (e) => {
      if (e.key === this.storageKey || e.key === this.activeKey) {
        this._notify();
      }
    });
  }

  subscribe(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  _notify() {
    const sessions = this.getSessions();
    const active = this.getActiveSession();
    this.listeners.forEach(cb => {
      try { cb(sessions, active); } catch (e) { console.error(e); }
    });
  }

  setActiveSessionId(id) {
    localStorage.setItem(this.activeKey, id);
    this._notify();
  }

  getActiveSessionId() {
    return localStorage.getItem(this.activeKey);
  }

  getActiveSession(preferredId) {
    const sessions = this.getSessions();
    if (sessions.length === 0) return null;

    if (preferredId) {
      const match = sessions.find(s => s.id === preferredId);
      if (match) return match;
    }

    const savedId = this.getActiveSessionId();
    if (savedId) {
      const match = sessions.find(s => s.id === savedId);
      if (match) return match;
    }

    return sessions[0];
  }

  getSessions() {
    try {
      const data = localStorage.getItem(this.storageKey);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {}
    return []; // Estado inicial estrictamente limpio
  }

  getSessionById(id) {
    const sessions = this.getSessions();
    return sessions.find(s => s.id === id) || null;
  }

  _saveSessions(sessions) {
    localStorage.setItem(this.storageKey, JSON.stringify(sessions));
    this._notify();
  }

  /**
   * Crea una nueva sesión de galería
   */
  createSession({ clientName, phone, date, quota = 10, autoProcess = true, uploadedFiles = [] }) {
    const id = "gal_" + Math.random().toString(36).substring(2, 8);
    const createdAt = new Date().toISOString();

    // Si el fotógrafo no arrastró archivos, proveer fotos estándar de la agencia
    let photos = [];
    if (uploadedFiles && uploadedFiles.length > 0) {
      photos = uploadedFiles.map((f, idx) => ({
        id: `DSC${(1200 + idx).toString()}`,
        filename: f.name || `DSC${(1200 + idx)}.JPG`,
        rawFilename: f.rawName || `DSC${(1200 + idx)}.CR3`,
        src: f.src || "assets/images/sprinter_hero.jpg",
        selected: false
      }));
    } else {
      // Banco de tomas del estudio para sesiones creadas directamente
      const stockImages = [
        "assets/images/sprinter_hero.jpg",
        "assets/images/basketball_action.jpg",
        "assets/images/cinema_rig.jpg"
      ];
      const count = Math.max(quota * 2, 16);
      for (let i = 0; i < count; i++) {
        const num = 1240 + i;
        photos.push({
          id: `DSC${num}`,
          filename: `DSC0${num}.JPG`,
          rawFilename: `DSC0${num}.ARW`,
          src: stockImages[i % stockImages.length],
          selected: false
        });
      }
    }

    const newSession = {
      id,
      clientName: clientName.trim(),
      phone: phone.trim(),
      date: date || new Date().toISOString().split("T")[0],
      quota: parseInt(quota, 10) || 10,
      autoProcess: Boolean(autoProcess),
      status: "WAITING_SELECTION", // 'WAITING_SELECTION' | 'QUEUED' | 'PROCESSING' | 'READY'
      statusLabel: "Esperando selección",
      createdAt,
      photos,
      selectedPhotoIds: [],
      processingLog: [],
      processedResult: null,
      publicUrl: `gallery.html?id=${id}`
    };

    const sessions = this.getSessions();
    sessions.unshift(newSession);
    this._saveSessions(sessions);
    this.setActiveSessionId(id);

    return newSession;
  }

  /**
   * Registra la confirmación de selección del cliente y activa el pipeline si aplica
   */
  async confirmClientSelection(sessionId, selectedIds) {
    const sessions = this.getSessions();
    const sessionIndex = sessions.findIndex(s => s.id === sessionId);
    if (sessionIndex === -1) throw new Error("Sesión no encontrada");

    const session = sessions[sessionIndex];
    session.selectedPhotoIds = selectedIds;
    session.photos.forEach(p => {
      p.selected = selectedIds.includes(p.id);
    });

    if (session.autoProcess) {
      session.status = "QUEUED";
      session.statusLabel = "En fila de retoque automático";
      this._saveSessions(sessions);

      // Iniciar pipeline en segundo plano
      this._runPipelineForSession(sessionId, selectedIds);
    } else {
      session.status = "WAITING_REVIEW";
      session.statusLabel = "Selección lista para revisión manual";
      this._saveSessions(sessions);
    }

    return session;
  }

  async _runPipelineForSession(sessionId, selectedIds) {
    try {
      const result = await studioPipelineProcessor.processSession(
        { id: sessionId },
        selectedIds,
        (progress) => {
          const sessions = this.getSessions();
          const sess = sessions.find(s => s.id === sessionId);
          if (sess) {
            if (progress.step === "QUEUED") {
              sess.status = "QUEUED";
              sess.statusLabel = progress.label;
            } else if (progress.step === "COMPLETED") {
              sess.status = "READY";
              sess.statusLabel = "Listo para entrega";
              sess.processedResult = progress.result;
            } else {
              sess.status = "PROCESSING";
              sess.statusLabel = progress.label;
            }
            sess.processingProgress = progress.percent;
            sess.processingDetail = progress.description;
            this._saveSessions(sessions);
          }
        }
      );
      return result;
    } catch (err) {
      console.error("Error en pipeline desatendido:", err);
    }
  }

  deleteSession(sessionId) {
    const sessions = this.getSessions().filter(s => s.id !== sessionId);
    this._saveSessions(sessions);
  }

  resetAllForCleanTesting() {
    this._saveSessions([]);
  }
}

export const studioGalleryManager = new GalleryManager();
