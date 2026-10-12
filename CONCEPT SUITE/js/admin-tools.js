/**
 * THE CONCEPT STUDIO. — ADMIN EXECUTIVE TOOLS
 * 1. Automated Central Watermark Switch
 * 2. Expiring Link Generator (48h / 5d / 14d)
 * 3. Call Sheet & Logistics Generator
 * 4. Equipment Inventory & Maintenance / Formatting Alerts
 */
import { firebaseService } from "./firebase/firebase-service.js";

export function initAdminTools() {
  // 1. Watermark Switch Toggle
  const watermarkToggle = document.getElementById("watermark-toggle-switch");
  if (watermarkToggle) {
    watermarkToggle.checked = firebaseService.isWatermarkEnabled();
    watermarkToggle.addEventListener("change", (e) => {
      const enabled = e.target.checked;
      firebaseService.toggleWatermark(enabled);
      window.showAppToast?.(
        enabled 
          ? "Marca de agua central [THE CONCEPT STUDIO.] ACTIVADA en todas las pruebas."
          : "Marca de agua DESACTIVADA en visualizaciones."
      );
    });
  }

  // 2. Expiring Client Link Generator
  const clientNameSelect = document.getElementById("link-client-select");
  const expiryHoursSelect = document.getElementById("link-expiry-select");
  const generateLinkBtn = document.getElementById("generate-link-btn");
  const activeLinksContainer = document.getElementById("active-links-list");

  function renderActiveLinks() {
    if (!activeLinksContainer) return;
    const links = firebaseService.getClientLinks();
    activeLinksContainer.innerHTML = "";

    links.forEach(l => {
      const item = document.createElement("div");
      item.className = "generated-link-display";

      item.innerHTML = `
        <div>
          <div style="display:flex; align-items:center; gap:0.5rem; margin-bottom:0.25rem;">
            <span class="badge badge-gold" style="font-size:0.6rem;">VIP LINK ACTIVO</span>
            <span style="font-weight:900; font-size:var(--text-xs); color:var(--white);">${l.clientName}</span>
          </div>
          <div class="mono-text" style="font-size:0.7rem; color:var(--gold-primary);">
            ${l.url}
          </div>
          <div style="font-size:0.65rem; color:var(--white-50); margin-top:2px;">
            VENCE EN: ${l.expiresIn} (EXPIRA: ${l.expiresAtDate})
          </div>
        </div>

        <button class="btn btn-secondary btn-sm" data-action="copy-link" data-url="${l.url}">
          COPIAR ACCESO VIP
        </button>
      `;

      activeLinksContainer.appendChild(item);
    });
  }

  if (generateLinkBtn) {
    generateLinkBtn.addEventListener("click", () => {
      const client = clientNameSelect?.value || "Marcus Vance (Nike)";
      const hours = parseInt(expiryHoursSelect?.value || "48", 10);

      const newLink = firebaseService.generateClientLink(client, hours);
      renderActiveLinks();
      window.showAppToast?.(`Enlace VIP único generado con vigencia de ${hours} horas.`);
    });
  }

  if (activeLinksContainer) {
    activeLinksContainer.addEventListener("click", (e) => {
      const copyBtn = e.target.closest('[data-action="copy-link"]');
      if (copyBtn) {
        navigator.clipboard?.writeText?.(copyBtn.dataset.url);
        window.showAppToast?.("Enlace de acceso de cliente copiado al portapapeles.");
      }
    });
  }

  // 3. Equipment Inventory & Maintenance Alerts
  const inventoryTbody = document.getElementById("inventory-table-tbody");

  function renderInventory() {
    if (!inventoryTbody) return;
    const items = firebaseService.getInventory();
    inventoryTbody.innerHTML = "";

    items.forEach(gear => {
      const tr = document.createElement("tr");
      const isFormatAlert = gear.status === "REQUIERE FORMATEO";
      const isMaintAlert = gear.status === "ALERTA MANTENIMIENTO";

      tr.innerHTML = `
        <td>
          <div style="font-weight:900; text-transform:uppercase; color:var(--white);">${gear.name}</div>
          <div class="mono-text" style="font-size:0.65rem; color:var(--white-40);">ID: ${gear.id}</div>
        </td>
        <td>
          <span class="badge badge-outline" style="font-size:0.6rem;">${gear.category}</span>
        </td>
        <td>
          ${isFormatAlert 
            ? `<span class="gear-alert-pill">⚠️ REQUIERE FORMATEO EXFAT</span>` 
            : isMaintAlert 
            ? `<span class="gear-alert-pill gold">🔧 MANTENIMIENTO PENDIENTE</span>` 
            : `<span class="badge badge-gold">✓ OPERATIVO</span>`
          }
        </td>
        <td style="font-size:0.75rem; color:${isFormatAlert || isMaintAlert ? 'var(--gold-light)' : 'var(--white-70)'};">
          ${gear.alertText}
        </td>
        <td class="mono-text" style="font-size:0.7rem; color:var(--white-50);">${gear.lastService}</td>
        <td>
          <button class="btn btn-secondary btn-sm" onclick="window.showAppToast?.('Check técnico registrado para: ${gear.name}')">
            VERIFICAR
          </button>
        </td>
      `;

      inventoryTbody.appendChild(tr);
    });
  }

  // 4. Call Sheet Logistics Checklist Toggle
  const checklistItems = document.querySelectorAll(".checklist-item input[type='checkbox']");
  checklistItems.forEach(ch => {
    ch.addEventListener("change", () => {
      window.showAppToast?.("Lista técnica de rodaje actualizada en tiempo real.");
    });
  });

  renderActiveLinks();
  renderInventory();
}
