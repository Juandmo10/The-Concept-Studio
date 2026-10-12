/**
 * THE CONCEPT STUDIO. — DELIVERABLES VAULT (BÓVEDA MULTI-FORMATO)
 * Segmented downloads: Web/Social Media optimized vs Master/Print original resolution.
 */
import { firebaseService } from "./firebase/firebase-service.js";

export function initVault() {
  const segmentTabs = document.querySelectorAll(".vault-tab-btn");
  const filesContainer = document.getElementById("vault-files-grid");
  const downloadAllBtn = document.getElementById("download-entire-vault-btn");

  let currentSegment = "ALL";

  function renderVault() {
    if (!filesContainer) return;
    const files = firebaseService.getVaultFiles(currentSegment);

    filesContainer.innerHTML = "";

    if (files.length === 0) {
      filesContainer.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 1rem; color: var(--white-50); background: var(--navy-850); border: 1px solid var(--white-15); border-radius: var(--radius-md);">
          NO HAY ARCHIVOS DISPONIBLES EN ESTE SEGMENTO
        </div>
      `;
      return;
    }

    files.forEach(file => {
      const isSocial = file.segment === "social_web";
      const card = document.createElement("div");
      card.className = "vault-file-card";

      card.innerHTML = `
        <div>
          <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:1rem;">
            <span class="badge ${isSocial ? 'badge-solid' : 'badge-gold'}">
              ${isSocial ? '📱 REDES SOCIALES / WEB' : '💎 MÁSTER / IMPRESIÓN'}
            </span>
            <span class="mono-text" style="font-size:0.65rem; color:var(--white-50);">${file.date}</span>
          </div>

          <h4 style="font-size:var(--text-sm); font-weight:900; text-transform:uppercase; color:var(--white); line-height:1.3; margin-bottom:0.5rem;">
            ${file.filename}
          </h4>

          <div style="display:flex; flex-direction:column; gap:0.25rem; font-size:0.7rem; color:var(--white-70); margin-bottom:1.5rem;">
            <div><strong>FORMATO:</strong> ${file.format}</div>
            <div><strong>ESPECIFICACIONES:</strong> <span class="mono-text">${file.resolution}</span></div>
            <div><strong>PESO:</strong> <span class="mono-text" style="color:var(--gold-primary); font-weight:800;">${file.size}</span></div>
            <div class="mono-text" style="font-size:0.6rem; color:var(--white-30);">HASH: ${file.hash}</div>
          </div>
        </div>

        <div style="display:flex; gap:0.5rem; border-top:1px solid var(--white-08); padding-top:1rem;">
          <button class="btn btn-gold btn-sm" style="flex:1;" data-action="download" data-filename="${file.filename}">
            DESCARGAR
          </button>
          <button class="btn btn-secondary btn-sm" data-action="copy-token" data-filename="${file.filename}">
            ENLACE VIP
          </button>
        </div>
      `;

      filesContainer.appendChild(card);
    });
  }

  // Segment Tab Buttons
  segmentTabs.forEach(tab => {
    tab.addEventListener("click", () => {
      segmentTabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      currentSegment = tab.dataset.segment;
      renderVault();
    });
  });

  // Action Click Delegation
  if (filesContainer) {
    filesContainer.addEventListener("click", (e) => {
      const downloadBtn = e.target.closest('[data-action="download"]');
      if (downloadBtn) {
        const fname = downloadBtn.dataset.filename;
        window.showAppToast?.(`Iniciando descarga segura de alta velocidad: ${fname}`);
        return;
      }

      const copyBtn = e.target.closest('[data-action="copy-token"]');
      if (copyBtn) {
        const fname = copyBtn.dataset.filename;
        navigator.clipboard?.writeText?.(`https://vault.theconceptstudio.com/dl/${encodeURIComponent(fname)}?auth=vip-token`);
        window.showAppToast?.(`Enlace seguro de descarga copiado al portapapeles.`);
      }
    });
  }

  if (downloadAllBtn) {
    downloadAllBtn.addEventListener("click", () => {
      window.showAppToast?.("Generando archivo ZIP consolidado con todos los entregables (24.8 GB)...");
    });
  }

  renderVault();
}
