/**
 * THE CONCEPT STUDIO. — FILE UPLOAD CENTER (GESTOR DE SUBIDAS)
 * High-speed master media uploader synchronized directly with the Client Vault.
 */
import { firebaseService } from "./firebase/firebase-service.js";

export function initUploads() {
  const dropzone = document.getElementById("file-upload-dropzone");
  const fileInput = document.getElementById("native-file-input");
  const folderSelect = document.getElementById("upload-target-folder");
  const queueContainer = document.getElementById("upload-queue-list");
  const browseBtn = document.getElementById("browse-files-btn");

  if (!dropzone) return;

  if (browseBtn && fileInput) {
    browseBtn.addEventListener("click", () => fileInput.click());
  }

  // Drag and drop events
  ['dragenter', 'dragover'].forEach(eventName => {
    dropzone.addEventListener(eventName, (e) => {
      e.preventDefault();
      dropzone.classList.add('dragover');
    }, false);
  });

  ['dragleave', 'drop'].forEach(eventName => {
    dropzone.addEventListener(eventName, (e) => {
      e.preventDefault();
      dropzone.classList.remove('dragover');
    }, false);
  });

  dropzone.addEventListener('drop', (e) => {
    const dt = e.dataTransfer;
    const files = dt.files;
    handleFiles(files);
  });

  if (fileInput) {
    fileInput.addEventListener('change', (e) => {
      handleFiles(e.target.files);
    });
  }

  function handleFiles(files) {
    if (!files || files.length === 0) return;

    Array.from(files).forEach(file => {
      simulateUpload(file.name, file.size);
    });
  }

  function simulateUpload(filename, rawSize = 2500000000) {
    const targetFolder = folderSelect ? folderSelect.value : "01_FINAL_MASTERS_4K_PRORES";
    const queueId = "uq_" + Date.now() + Math.random().toString(36).substring(2, 5);

    const sizeFormatted = rawSize > 1000000000 
      ? (rawSize / 1000000000).toFixed(2) + " GB" 
      : (rawSize / 1000000).toFixed(1) + " MB";

    const itemEl = document.createElement("div");
    itemEl.className = "upload-queue-item";
    itemEl.id = queueId;

    itemEl.innerHTML = `
      <div class="upload-file-header">
        <div>
          <span style="font-weight:900; font-size:var(--text-xs); text-transform:uppercase;">${filename}</span>
          <div style="font-size:0.65rem; color:var(--white-40); font-family:var(--font-mono);">
            DESTINO: ${targetFolder} · ${sizeFormatted}
          </div>
        </div>
        <span class="badge badge-outline progress-pct-badge" style="font-size:0.65rem;">0%</span>
      </div>
      <div class="progress-track">
        <div class="progress-bar-fill" style="width: 0%;"></div>
      </div>
    `;

    if (queueContainer) {
      queueContainer.prepend(itemEl);
    }

    // Simulate upload progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 15) + 10;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);

        const badge = itemEl.querySelector(".progress-pct-badge");
        if (badge) {
          badge.className = "badge badge-solid";
          badge.textContent = "SINCRONIZADO EN BÓVEDA ✓";
        }

        // Add file to Client Vault
        firebaseService.addVaultFile({
          id: "vf_" + Date.now(),
          folderId: targetFolder,
          filename: filename,
          format: filename.endsWith('.CR3') ? 'Canon CR3 RAW' : filename.endsWith('.mov') ? 'ProRes 422 HQ' : 'Master Media',
          resolution: '3840 x 2160 UHD',
          size: sizeFormatted,
          date: 'Hoy',
          sha256: 'a9f24c8b...31e0'
        });

        window.showAppToast?.(`Archivo [${filename}] procesado y publicado en la Bóveda del Cliente.`);
      }

      const fill = itemEl.querySelector(".progress-bar-fill");
      const badge = itemEl.querySelector(".progress-pct-badge");
      if (fill) fill.style.width = `${progress}%`;
      if (badge && progress < 100) badge.textContent = `${progress}%`;
    }, 350);
  }
}
