/**
 * THE CONCEPT STUDIO. — ADMIN DASHBOARD (CENTRO DE COMANDO & FINANZAS)
 * High-impact typography stat cards, revenue metrics, active shoots & quick dispatches.
 */

export function initDashboard() {
  const quickActionBtns = document.querySelectorAll("[data-admin-action]");

  quickActionBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const action = btn.dataset.adminAction;
      if (action === "new-shoot") {
        window.switchSubTab?.("admin-calendar");
        window.showAppToast?.("Navegando a Calendario de Producción.");
      } else if (action === "upload-vault") {
        window.switchSubTab?.("admin-uploads");
        window.showAppToast?.("Navegando a Gestor de Subidas de Alta Resolución.");
      } else if (action === "new-invoice") {
        window.switchSubTab?.("admin-crm");
        window.showAppToast?.("Navegando a CRM de Clientes.");
      }
    });
  });
}
