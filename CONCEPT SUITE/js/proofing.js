/**
 * THE CONCEPT STUDIO. — SMART PROOFING GALLERY (GALERÍAS DE SELECCIÓN INTELIGENTE)
 * Package quota (20 photos included), extra photo cost warning ($45 USD/ea),
 * dynamic gold counter, automated central watermark & selection manifest.
 */
import { firebaseService } from "./firebase/firebase-service.js";

export function initProofing() {
  const gridContainer = document.getElementById("proofing-masonry-grid");
  const filterBtns = document.querySelectorAll(".proofing-filter-btn");
  const countBadge = document.getElementById("proofing-selected-count");
  const quotaCounterGold = document.getElementById("quota-counter-gold");
  const extraWarningPill = document.getElementById("extra-photo-warning-pill");
  const clearSelectionBtn = document.getElementById("clear-selection-btn");
  const confirmSelectionBtn = document.getElementById("confirm-selection-btn");
  const confirmModal = document.getElementById("proofing-confirm-modal");
  const closeModalBtn = document.getElementById("close-proofing-modal");
  const submitSelectionBtn = document.getElementById("submit-proofing-final");

  let currentFilter = "ALL";

  function renderGallery() {
    if (!gridContainer) return;
    const items = firebaseService.getProofingItems();
    const isWatermarkOn = firebaseService.isWatermarkEnabled();

    let filtered = items;
    if (currentFilter === "FAVORITES") {
      filtered = items.filter(i => i.selected);
    } else if (currentFilter !== "ALL") {
      filtered = items.filter(i => i.category === currentFilter);
    }

    gridContainer.innerHTML = "";

    filtered.forEach((item) => {
      const card = document.createElement("div");
      card.className = `masonry-item ${item.selected ? "selected" : ""}`;
      card.dataset.id = item.id;

      card.innerHTML = `
        <div class="masonry-img-wrapper" data-action="view" data-id="${item.id}">
          <span class="photo-badge-index">#${item.id}</span>
          
          <!-- Central Brand Watermark (Controlled by Admin Switch) -->
          <div class="watermark-overlay ${isWatermarkOn ? 'active' : ''}">
            <div class="watermark-text">THE CONCEPT STUDIO.</div>
          </div>

          <button class="photo-select-btn" data-action="toggle" data-id="${item.id}" title="${item.selected ? 'Desmarcar' : 'Seleccionar como favorita'}" aria-label="Seleccionar foto">
            ${item.selected 
              ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>`
              : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>`
            }
          </button>
          <img src="${item.src}" alt="${item.filename}" class="masonry-img" loading="lazy" />
        </div>
        <div class="photo-meta-bar">
          <div>
            <div style="font-size:var(--text-xs); font-weight:800; color:var(--white);">${item.filename}</div>
            <div class="mono-text" style="font-size:0.65rem; color:var(--white-50); margin-top:2px;">${item.shutter} · ${item.aperture} · ${item.iso}</div>
          </div>
          <span class="badge ${item.selected ? 'badge-gold' : 'badge-outline'}">${item.selected ? 'SELECCIONADA' : 'DISPONIBLE'}</span>
        </div>
      `;

      gridContainer.appendChild(card);
    });

    updateQuotaIndicators();
  }

  function updateQuotaIndicators() {
    const stats = firebaseService.getProofingQuotaStats();

    if (quotaCounterGold) {
      quotaCounterGold.textContent = `${stats.selectedCount} / ${stats.baseLimit} SELECCIONADAS`;
    }

    if (countBadge) {
      countBadge.textContent = `${stats.selectedCount} DE ${stats.totalAvailable} FOTOS SELECCIONADAS`;
    }

    // Extra photo warning badge
    if (extraWarningPill) {
      if (stats.isExceeded) {
        extraWarningPill.style.display = "inline-flex";
        extraWarningPill.textContent = `+${stats.extraCount} FOTO EXTRA (+$${stats.extraCostTotal} USD EN CONTRATO)`;
      } else {
        extraWarningPill.style.display = "none";
      }
    }

    const favoritesFilterBtn = document.querySelector('[data-filter="FAVORITES"]');
    if (favoritesFilterBtn) {
      favoritesFilterBtn.textContent = `★ FAVORITAS (${stats.selectedCount})`;
    }
  }

  // Event Delegation
  if (gridContainer) {
    gridContainer.addEventListener("click", (e) => {
      const toggleBtn = e.target.closest('[data-action="toggle"]');
      if (toggleBtn) {
        e.stopPropagation();
        const photoId = toggleBtn.dataset.id;
        firebaseService.toggleProofingItem(photoId);
        renderGallery();
        return;
      }

      const imgWrapper = e.target.closest('[data-action="view"]');
      if (imgWrapper) {
        const photoId = imgWrapper.dataset.id;
        openLightbox(photoId);
      }
    });
  }

  // Filters
  filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      filterBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      currentFilter = btn.dataset.filter;
      renderGallery();
    });
  });

  // Clear Selection
  if (clearSelectionBtn) {
    clearSelectionBtn.addEventListener("click", () => {
      const items = firebaseService.getProofingItems();
      items.forEach(i => i.selected = false);
      firebaseService.setItem("proofing", items);
      renderGallery();
      window.showAppToast?.("Selección de prueba reiniciada.");
    });
  }

  // Confirmation Modal
  if (confirmSelectionBtn) {
    confirmSelectionBtn.addEventListener("click", () => {
      const stats = firebaseService.getProofingQuotaStats();
      const items = firebaseService.getProofingItems();
      const selected = items.filter(i => i.selected);
      const modalList = document.getElementById("proofing-modal-manifest");
      const modalWarning = document.getElementById("modal-extra-cost-notice");

      if (modalList) {
        modalList.innerHTML = selected.map(s => `
          <div style="display:flex; justify-content:space-between; align-items:center; padding:0.5rem 0; border-bottom:1px solid var(--white-08); font-size:var(--text-xs);">
            <span class="mono-text" style="color:var(--white);">${s.filename}</span>
            <span class="badge badge-gold">${s.category}</span>
          </div>
        `).join("") || "<p style='color:var(--white-50); padding:1rem 0;'>No hay fotos seleccionadas.</p>";
      }

      if (modalWarning) {
        if (stats.isExceeded) {
          modalWarning.style.display = "block";
          modalWarning.innerHTML = `
            <div style="background:rgba(212, 175, 55, 0.12); border:1px solid var(--gold-primary); padding:0.75rem 1rem; border-radius:var(--radius-sm); margin-bottom:1rem; font-size:var(--text-xs); color:var(--gold-light);">
              <strong>AVISO DE CUPO ADICIONAL:</strong> Has seleccionado ${stats.selectedCount} fotos (${stats.extraCount} fotos por encima de tu paquete base de ${stats.baseLimit}). Se adicionarán <strong>+$${stats.extraCostTotal} USD</strong> a la factura final de liquidación.
            </div>
          `;
        } else {
          modalWarning.style.display = "none";
        }
      }

      if (confirmModal) confirmModal.classList.add("active");
    });
  }

  if (closeModalBtn && confirmModal) {
    closeModalBtn.addEventListener("click", () => confirmModal.classList.remove("active"));
  }

  if (submitSelectionBtn && confirmModal) {
    submitSelectionBtn.addEventListener("click", () => {
      const stats = firebaseService.getProofingQuotaStats();
      confirmModal.classList.remove("active");
      window.showAppToast?.(`¡SELECCIÓN DE ${stats.selectedCount} FOTOS ENVIADA AL DIRECTOR DEL ESTUDIO!`);
    });
  }

  function openLightbox(photoId) {
    const items = firebaseService.getProofingItems();
    const item = items.find(i => i.id === photoId);
    if (!item) return;

    const lightboxModal = document.getElementById("lightbox-modal");
    const lightboxImg = document.getElementById("lightbox-image");
    const lightboxTitle = document.getElementById("lightbox-title");
    const lightboxMeta = document.getElementById("lightbox-meta");

    if (lightboxModal && lightboxImg) {
      lightboxImg.src = item.src;
      if (lightboxTitle) lightboxTitle.textContent = item.filename;
      if (lightboxMeta) lightboxMeta.textContent = `${item.lens} · ${item.shutter} · ${item.aperture} · ${item.iso}`;
      lightboxModal.classList.add("active");
    }
  }

  const closeLightbox = document.getElementById("close-lightbox-modal");
  if (closeLightbox) {
    closeLightbox.addEventListener("click", () => {
      document.getElementById("lightbox-modal")?.classList.remove("active");
    });
  }

  // Subscribe to changes (including admin watermark toggle)
  firebaseService.subscribe("proofing", () => renderGallery());
  firebaseService.subscribe("watermark_enabled", () => renderGallery());

  renderGallery();
}
