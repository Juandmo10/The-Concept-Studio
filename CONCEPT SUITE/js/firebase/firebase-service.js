/**
 * THE CONCEPT STUDIO. — FIREBASE SERVICE LAYER (LUXURY SAAS ARCHITECTURE)
 * Reactive service supporting Proofing Quotas, On-Screen Video Pins, Watermarks,
 * Expiring Links, 5-Stage Kanban, Technical Inventory & Call Sheets.
 */

class FirebaseService {
  constructor() {
    this.storageKeyPrefix = "THE_CONCEPT_STUDIO_LUXURY_";
    this.subscribers = new Map();
    this.initializeData();
  }

  subscribe(event, callback) {
    if (!this.subscribers.has(event)) {
      this.subscribers.set(event, new Set());
    }
    this.subscribers.get(event).add(callback);
    return () => this.subscribers.get(event).delete(callback);
  }

  notify(event, data) {
    if (this.subscribers.has(event)) {
      this.subscribers.get(event).forEach(cb => cb(data));
    }
  }

  initializeData() {
    // 1. Watermark Protection State
    if (localStorage.getItem(this.storageKeyPrefix + "watermark_enabled") === null) {
      this.setItem("watermark_enabled", true);
    }

    // 2. Proofing Photos (Package Limit: 20 Fotos, Extra: $45 USD)
    if (!localStorage.getItem(this.storageKeyPrefix + "proofing")) {
      const initialProofing = [
        { id: "TCS-0491", filename: "TCS_SPRINTER_EXPLOSION_001.CR3", src: "assets/images/sprinter_hero.jpg", category: "PISTA & VELOCIDAD", shutter: "1/2500s", aperture: "f/2.0", iso: "ISO 100", lens: "50mm Cine Prime", selected: true },
        { id: "TCS-0492", filename: "TCS_BASKETBALL_DUNK_RIM_002.CR3", src: "assets/images/basketball_action.jpg", category: "STUDIO & LUZ", shutter: "1/2000s", aperture: "f/2.8", iso: "ISO 400", lens: "70-200mm f/2.8L", selected: true },
        { id: "TCS-0493", filename: "TCS_CINEMA_RIG_SET_003.CR3", src: "assets/images/cinema_rig.jpg", category: "VERTICAL REELS", shutter: "1/1000s", aperture: "f/1.8", iso: "ISO 200", lens: "35mm Anamorphic", selected: true },
        { id: "TCS-0494", filename: "TCS_STARTING_BLOCKS_FOCUS_004.CR3", src: "assets/images/sprinter_hero.jpg", category: "PISTA & VELOCIDAD", shutter: "1/3200s", aperture: "f/2.2", iso: "ISO 100", lens: "85mm f/1.4L", selected: true },
        { id: "TCS-0495", filename: "TCS_AERIAL_DUNK_HIGH_ANGLE_005.CR3", src: "assets/images/basketball_action.jpg", category: "STUDIO & LUZ", shutter: "1/1600s", aperture: "f/2.8", iso: "ISO 800", lens: "24-70mm f/2.8L", selected: true },
        { id: "TCS-0496", filename: "TCS_DIRECTOR_MONITOR_RIG_006.CR3", src: "assets/images/cinema_rig.jpg", category: "VERTICAL REELS", shutter: "1/500s", aperture: "f/2.0", iso: "ISO 400", lens: "50mm Prime", selected: true },
        { id: "TCS-0497", filename: "TCS_SPRINTER_FINISH_LINE_007.CR3", src: "assets/images/sprinter_hero.jpg", category: "PISTA & VELOCIDAD", shutter: "1/4000s", aperture: "f/1.4", iso: "ISO 100", lens: "50mm Prime", selected: true },
        { id: "TCS-0498", filename: "TCS_WARMUP_SHADOW_STUDIO_008.CR3", src: "assets/images/basketball_action.jpg", category: "STUDIO & LUZ", shutter: "1/1250s", aperture: "f/2.8", iso: "ISO 320", lens: "24-70mm f/2.8L", selected: true },
        { id: "TCS-0499", filename: "TCS_ANAMORPHIC_FLARE_RUN_009.CR3", src: "assets/images/cinema_rig.jpg", category: "VERTICAL REELS", shutter: "1/800s", aperture: "f/2.0", iso: "ISO 200", lens: "35mm Anamorphic", selected: true },
        { id: "TCS-0500", filename: "TCS_SPIKES_MACRO_TEXTURE_010.CR3", src: "assets/images/sprinter_hero.jpg", category: "PISTA & VELOCIDAD", shutter: "1/2000s", aperture: "f/4.0", iso: "ISO 100", lens: "100mm Macro", selected: true },
        { id: "TCS-0501", filename: "TCS_DUNK_DEFENDER_REBOUND_011.CR3", src: "assets/images/basketball_action.jpg", category: "STUDIO & LUZ", shutter: "1/2500s", aperture: "f/2.8", iso: "ISO 640", lens: "70-200mm", selected: true },
        { id: "TCS-0502", filename: "TCS_SET_BEHIND_SCENES_GIMBAL_012.CR3", src: "assets/images/cinema_rig.jpg", category: "VERTICAL REELS", shutter: "1/1000s", aperture: "f/2.8", iso: "ISO 400", lens: "24-70mm", selected: true },
        { id: "TCS-0503", filename: "TCS_ATHLETE_BREATHE_INTENSE_013.CR3", src: "assets/images/sprinter_hero.jpg", category: "PISTA & VELOCIDAD", shutter: "1/3200s", aperture: "f/1.8", iso: "ISO 100", lens: "85mm f/1.4L", selected: true },
        { id: "TCS-0504", filename: "TCS_SWEAT_DRIP_COMMERCIAL_014.CR3", src: "assets/images/basketball_action.jpg", category: "STUDIO & LUZ", shutter: "1/2000s", aperture: "f/2.8", iso: "ISO 200", lens: "100mm Macro", selected: true }
      ];
      this.setItem("proofing", initialProofing);
    }

    // 3. Video Review Comments with On-Screen Pin Coordinates (x%, y%)
    if (!localStorage.getItem(this.storageKeyPrefix + "video_comments")) {
      const initialComments = [
        {
          id: "vc_1",
          timecodeSeconds: 8,
          timecodeFormatted: "00:08",
          pinX: 48, // 48% from left
          pinY: 42, // 42% from top
          author: "Marcus Vance (Nike Director)",
          category: "CORTE / EDICIÓN",
          text: "Acelerar la rampa de velocidad cuando el atleta apoya el pie en el taco. Necesitamos máxima tensión antes del disparo.",
          status: "APROBADO",
          createdAt: "Hace 2 horas"
        },
        {
          id: "vc_2",
          timecodeSeconds: 24,
          timecodeFormatted: "00:24",
          pinX: 68,
          pinY: 62,
          author: "Marcus Vance (Nike Director)",
          category: "COLOR GRADING",
          text: "En este sector de la suela hay un reflejo excesivo de la luz de estudio. Mantener el negro carbón mate original.",
          status: "EN REVISIÓN",
          createdAt: "Hace 45 min"
        },
        {
          id: "vc_3",
          timecodeSeconds: 52,
          timecodeFormatted: "00:52",
          pinX: 34,
          pinY: 28,
          author: "Sarah Lin (Creative Producer)",
          category: "SONIDO / MIX",
          text: "El respiro del atleta debe amplificarse +3dB justo aquí antes de que comience el beat del bajo.",
          status: "EN REVISIÓN",
          createdAt: "Hace 15 min"
        }
      ];
      this.setItem("video_comments", initialComments);
    }

    // 4. Multi-Format Vault (Social/Web vs Master/Original)
    if (!localStorage.getItem(this.storageKeyPrefix + "vault_files")) {
      const initialVault = [
        // Social / Web Cuts
        { id: "vf_s1", segment: "social_web", folderId: "REELS_TIKTOK_9x16", filename: "NIKE_SPEED_REELS_HERO_9x16.mp4", format: "H.265 Master 10-bit", resolution: "1080 x 1920 (60fps)", size: "480 MB", date: "10 Feb 2026", hash: "sha256-8a90e..." },
        { id: "vf_s2", segment: "social_web", folderId: "INSTAGRAM_POSTS_4x5", filename: "NIKE_STILLS_IG_CURATED_4x5.zip", format: "sRGB Optimized JPEG", resolution: "1080 x 1350 (Alta Densidad)", size: "220 MB", date: "10 Feb 2026", hash: "sha256-4c12d..." },
        // Master / Print High-Resolution
        { id: "vf_m1", segment: "master_print", folderId: "MASTERS_4K_PRORES", filename: "NIKE_SPEED_2026_MASTER_60S_PRORES422HQ.mov", format: "Apple ProRes 422 HQ", resolution: "3840 x 2160 UHD (24.00fps)", size: "8.42 GB", date: "10 Feb 2026", hash: "sha256-3b10f..." },
        { id: "vf_m2", segment: "master_print", folderId: "MASTERS_4K_PRORES", filename: "NIKE_SPEED_2026_HERO_CUT_30S_DCI4K.mov", format: "Apple ProRes 4444 XQ", resolution: "4096 x 2160 DCI (24.00fps)", size: "6.18 GB", date: "10 Feb 2026", hash: "sha256-9d22a..." },
        { id: "vf_m3", segment: "master_print", folderId: "RAW_STILLS_SELECTS", filename: "TCS_NIKE_RAW_SELECTS_BATCH_45MP.zip", format: "Canon CR3 RAW 14-bit", resolution: "8192 x 5464 (45 MP)", size: "4.80 GB", date: "09 Feb 2026", hash: "sha256-7e44c..." }
      ];
      this.setItem("vault_files", initialVault);
    }

    // 5. Account Balance & Payment Proofs
    if (!localStorage.getItem(this.storageKeyPrefix + "account_balance")) {
      this.setItem("account_balance", {
        totalBudget: 18500,
        amountPaid: 9250,
        amountPending: 9250,
        paymentProofAttached: true,
        receiptFilename: "COMPROBANTE_TRANSFERENCIA_SWIFT_9250USD.pdf",
        uploadedAt: "08 FEB 2026"
      });
    }

    // 6. Production Pipeline (5-Stage Kanban)
    if (!localStorage.getItem(this.storageKeyPrefix + "pipeline_tasks")) {
      const initialPipeline = [
        { id: "t_1", stage: "pre_production", projectTag: "ALPINE F1 // SPEED", title: "Permisos de pista y scouting túnel de viento", priority: "ALTA", assignee: "Juan D. (Dir)", dueDate: "18 Feb" },
        { id: "t_2", stage: "in_selection", projectTag: "NIKE // SPEED", title: "Cliente revisando galería de 20 fotos base", priority: "CRÍTICA", assignee: "Marcus V. (Cliente)", dueDate: "Hoy" },
        { id: "t_3", stage: "post_production", projectTag: "NIKE // SPEED", title: "Etalonaje DaVinci Resolve DCI-P3 corte 60s", priority: "ALTA", assignee: "Sofia R. (Color)", dueDate: "14 Feb" },
        { id: "t_4", stage: "post_production", projectTag: "RED BULL // DAKAR", title: "Diseño sonoro y mezcla sub-bass Phantom 4K", priority: "MEDIA", assignee: "Lucas V. (Audio)", dueDate: "15 Feb" },
        { id: "t_5", stage: "review", projectTag: "NIKE // SPEED", title: "Validación de notas de timecode y pines visuales", priority: "CRÍTICA", assignee: "Marcus V. (Dir)", dueDate: "14 Feb" },
        { id: "t_6", stage: "delivered", projectTag: "ST. JUDE // ATHLETICS", title: "Entrega final en Bóveda y firmas archivadas", priority: "BAJA", assignee: "TCS Crew", dueDate: "Cerrado" }
      ];
      this.setItem("pipeline_tasks", initialPipeline);
    }

    // 7. Equipment Inventory with Formatting & Maintenance Alerts
    if (!localStorage.getItem(this.storageKeyPrefix + "inventory")) {
      const initialInventory = [
        { id: "inv_1", name: "RED V-Raptor 8K VV Cinema Body", category: "CÁMARAS", status: "ALERTA MANTENIMIENTO", alertText: "Sensor: Limpieza ultrasónica pendiente tras rodaje en arena", lastService: "10 Ene 2026", assignedTo: "Juan D." },
        { id: "inv_2", name: "Phantom Flex 4K High-Speed (1000 FPS)", category: "CÁMARAS", status: "OPERATIVO", alertText: "Calibración óptica OK", lastService: "01 Feb 2026", assignedTo: "Alex T." },
        { id: "inv_3", name: "Canon EOS R5 Mark II 45MP Body", category: "CÁMARAS", status: "OPERATIVO", alertText: "Firmware v1.2 instalado", lastService: "05 Feb 2026", assignedTo: "Carlos M." },
        { id: "inv_4", name: "CFexpress Type B 2TB Pro #03", category: "MEMORIAS", status: "REQUIERE FORMATEO", alertText: "Requiere formateo seguro exFAT antes del llamado", lastService: "Hoy", assignedTo: "Sofia R. (DIT)" },
        { id: "inv_5", name: "Cooke Anamorphic /i Full Frame Plus 50mm", category: "LENTES", status: "OPERATIVO", alertText: "Chequeo de foco colimado", lastService: "28 Ene 2026", assignedTo: "Alex T." },
        { id: "inv_6", name: "Profoto Pro-11 2400W Air Generator Pack", category: "ILUMINACIÓN", status: "OPERATIVO", alertText: "Tubos de destello OK", lastService: "02 Feb 2026", assignedTo: "Set Crew" },
        { id: "inv_7", name: "Gimbal DJI Ronin 2 3-Axis", category: "GRIP & SOPORTE", status: "ALERTA MANTENIMIENTO", alertText: "Baterías TB50: Chequeo de ciclos y calibración de motores", lastService: "15 Ene 2026", assignedTo: "Grip Lead" }
      ];
      this.setItem("inventory", initialInventory);
    }

    // 8. Expiring Client Access Links
    if (!localStorage.getItem(this.storageKeyPrefix + "client_links")) {
      const initialLinks = [
        { id: "lnk_1", clientName: "Marcus Vance — Nike", token: "tcs-vip-78e2b9c", url: "https://portal.theconceptstudio.com/access?token=tcs-vip-78e2b9c", expiresIn: "48 HORAS", expiresAtDate: "13 Feb 2026, 23:59", status: "ACTIVO" },
        { id: "lnk_2", clientName: "Elena Rostova — Red Bull", token: "tcs-vip-99a410f", url: "https://portal.theconceptstudio.com/access?token=tcs-vip-99a410f", expiresIn: "5 DÍAS", expiresAtDate: "16 Feb 2026, 18:00", status: "ACTIVO" }
      ];
      this.setItem("client_links", initialLinks);
    }
  }

  getItem(key) {
    try {
      const data = localStorage.getItem(this.storageKeyPrefix + key);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      console.error("FirebaseService getItem error:", e);
      return null;
    }
  }

  setItem(key, value) {
    try {
      localStorage.setItem(this.storageKeyPrefix + key, JSON.stringify(value));
      this.notify(key, value);
    } catch (e) {
      console.error("FirebaseService setItem error:", e);
    }
  }

  // --- Watermark Methods ---
  isWatermarkEnabled() {
    return this.getItem("watermark_enabled") ?? true;
  }

  toggleWatermark(enabled) {
    this.setItem("watermark_enabled", enabled);
    return enabled;
  }

  // --- Proofing Methods with Quota Limit ---
  getProofingItems() {
    return this.getItem("proofing") || [];
  }

  toggleProofingItem(photoId) {
    const items = this.getProofingItems();
    const updated = items.map(item => {
      if (item.id === photoId) {
        return { ...item, selected: !item.selected };
      }
      return item;
    });
    this.setItem("proofing", updated);
    return updated;
  }

  getProofingQuotaStats() {
    const items = this.getProofingItems();
    const selectedCount = items.filter(i => i.selected).length;
    const baseLimit = 20; // 20 photos included
    const extraPricePerPhoto = 45; // $45 USD/ea
    const extraCount = Math.max(0, selectedCount - baseLimit);
    const extraCostTotal = extraCount * extraPricePerPhoto;

    return {
      selectedCount,
      totalAvailable: items.length,
      baseLimit,
      isExceeded: selectedCount > baseLimit,
      extraCount,
      extraCostTotal
    };
  }

  // --- Video Review with Spatial Pins ---
  getVideoComments() {
    return this.getItem("video_comments") || [];
  }

  addVideoCommentWithPin(comment) {
    const comments = this.getVideoComments();
    const newComment = {
      id: "vc_" + Date.now(),
      timecodeSeconds: comment.timecodeSeconds,
      timecodeFormatted: comment.timecodeFormatted,
      pinX: comment.pinX || 50,
      pinY: comment.pinY || 50,
      author: comment.author || "Marcus Vance (Nike Director)",
      category: comment.category || "CORTE / EDICIÓN",
      text: comment.text,
      status: "EN REVISIÓN",
      createdAt: "Justo ahora"
    };
    comments.push(newComment);
    this.setItem("video_comments", comments);
    return newComment;
  }

  // --- Vault Segments ---
  getVaultFiles(segment = "ALL") {
    const all = this.getItem("vault_files") || [];
    if (segment === "ALL") return all;
    return all.filter(f => f.segment === segment);
  }

  // --- Payment Proof ---
  getAccountBalance() {
    return this.getItem("account_balance");
  }

  attachPaymentProof(filename) {
    const bal = this.getAccountBalance();
    bal.paymentProofAttached = true;
    bal.receiptFilename = filename;
    bal.uploadedAt = "Justo ahora";
    this.setItem("account_balance", bal);
    return bal;
  }

  // --- 5-Stage Kanban ---
  getPipelineTasks() {
    return this.getItem("pipeline_tasks") || [];
  }

  updateTaskStage(taskId, newStage) {
    const tasks = this.getPipelineTasks();
    const updated = tasks.map(t => {
      if (t.id === taskId) {
        return { ...t, stage: newStage };
      }
      return t;
    });
    this.setItem("pipeline_tasks", updated);
    return updated;
  }

  addPipelineTask(task) {
    const tasks = this.getPipelineTasks();
    const newTask = {
      id: "t_" + Date.now(),
      stage: task.stage || "pre_production",
      projectTag: task.projectTag || "NIKE // SPEED",
      title: task.title,
      priority: task.priority || "ALTA",
      assignee: task.assignee || "TCS Crew",
      dueDate: task.dueDate || "Próximamente"
    };
    tasks.push(newTask);
    this.setItem("pipeline_tasks", tasks);
    return newTask;
  }

  // --- Inventory ---
  getInventory() {
    return this.getItem("inventory") || [];
  }

  // --- Client Links ---
  getClientLinks() {
    return this.getItem("client_links") || [];
  }

  generateClientLink(clientName, expiresInHours) {
    const links = this.getClientLinks();
    const token = "tcs-vip-" + Math.random().toString(36).substring(2, 9);
    const newLink = {
      id: "lnk_" + Date.now(),
      clientName: clientName || "Cliente VIP",
      token: token,
      url: `https://portal.theconceptstudio.com/access?token=${token}`,
      expiresIn: `${expiresInHours} HORAS`,
      expiresAtDate: new Date(Date.now() + expiresInHours * 3600 * 1000).toLocaleString("es-ES"),
      status: "ACTIVO"
    };
    links.unshift(newLink);
    this.setItem("client_links", links);
    return newLink;
  }
}

export const firebaseService = new FirebaseService();
