/**
 * THE CONCEPT STUDIO. — MAIN APPLICATION ORCHESTRATOR
 * Luxury SaaS Architecture supporting two independent platforms:
 * 1. portal.theconceptstudio.com (Portal del Cliente)
 * 2. app.theconceptstudio.com (Panel de Administración)
 */

import { initProofing } from "./proofing.js";
import { initVideoReview } from "./video-review.js";
import { initVault } from "./vault.js";
import { initContract } from "./contract.js";
import { initStatusTracker } from "./status-tracker.js";
import { initDashboard } from "./dashboard.js";
import { initCRM } from "./crm.js";
import { initCalendar } from "./calendar.js";
import { initKanban } from "./kanban.js";
import { initUploads } from "./uploads.js";
import { initAdminTools } from "./admin-tools.js";

// Global Toast System
window.showAppToast = function(message) {
  const container = document.getElementById("toast-container");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = "toast";
  toast.innerHTML = `
    <svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
    <span>${message}</span>
  `;

  container.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add("show"));

  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 300);
  }, 3800);
};

document.addEventListener("DOMContentLoaded", () => {
  // Elements
  const domainTabs = document.querySelectorAll(".domain-tab-btn");
  const platformBadge = document.getElementById("platform-badge");
  const activeDomainDisplay = document.getElementById("active-domain-display");
  const navSections = {
    client: document.getElementById("nav-client-section"),
    admin: document.getElementById("nav-admin-section")
  };
  const navItems = document.querySelectorAll(".nav-item");
  const pageViews = document.querySelectorAll(".page-view");
  const userRoleBadge = document.getElementById("user-role-badge");
  const userNameBadge = document.getElementById("user-name-badge");
  const projectSelector = document.getElementById("global-project-selector");
  const mobileMenuToggle = document.getElementById("mobile-menu-toggle");
  const sidebar = document.querySelector(".sidebar");

  let currentPlatform = "portal.theconceptstudio.com"; // 'portal.theconceptstudio.com' | 'app.theconceptstudio.com'

  function switchPlatform(domain) {
    currentPlatform = domain;

    domainTabs.forEach(tab => {
      tab.classList.toggle("active", tab.dataset.domain === domain);
    });

    if (activeDomainDisplay) activeDomainDisplay.textContent = domain;

    if (domain === "portal.theconceptstudio.com") {
      // Cliente VIP
      if (platformBadge) platformBadge.textContent = "PORTAL DEL CLIENTE // VIP ACCESS";
      if (navSections.client) navSections.client.style.display = "block";
      if (navSections.admin) navSections.admin.style.display = "none";
      if (userRoleBadge) userRoleBadge.textContent = "GLOBAL BRAND DIRECTOR";
      if (userNameBadge) userNameBadge.textContent = "MARCUS VANCE (NIKE)";
      switchView("client-proofing");
    } else {
      // Admin Studio
      if (platformBadge) platformBadge.textContent = "PANEL EJECUTIVO // DIRECCIÓN";
      if (navSections.client) navSections.client.style.display = "none";
      if (navSections.admin) navSections.admin.style.display = "block";
      if (userRoleBadge) userRoleBadge.textContent = "AGENCY DIRECTOR & FOUNDER";
      if (userNameBadge) userNameBadge.textContent = "JUAN D.";
      switchView("admin-dashboard");
    }

    window.showAppToast(`Plataforma activa: ${domain}`);
  }

  function switchView(viewId) {
    const proofingBar = document.getElementById("proofing-bottom-bar");
    if (proofingBar) {
      proofingBar.style.display = (viewId === "client-proofing") ? "flex" : "none";
    }

    pageViews.forEach(view => {
      view.classList.toggle("active", view.id === viewId);
    });

    navItems.forEach(item => {
      item.classList.toggle("active", item.dataset.view === viewId);
    });

    if (sidebar) sidebar.classList.remove("mobile-open");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  window.switchSubTab = switchView;

  // Domain Switcher Events
  domainTabs.forEach(tab => {
    tab.addEventListener("click", () => switchPlatform(tab.dataset.domain));
  });

  // Nav item clicks
  navItems.forEach(item => {
    item.addEventListener("click", (e) => {
      e.preventDefault();
      const viewId = item.dataset.view;
      if (viewId) switchView(viewId);
    });
  });

  // Mobile menu toggle
  if (mobileMenuToggle && sidebar) {
    mobileMenuToggle.addEventListener("click", () => {
      sidebar.classList.toggle("mobile-open");
    });
  }

  // Project selector cycling
  if (projectSelector) {
    const projects = [
      "NIKE TRAINING // ELITE SPEED 2026",
      "RED BULL MOTORSPORT // DAKAR PROMO",
      "ALPINE FORMULA // AERO TUNNEL 4K"
    ];
    let projectIdx = 0;
    projectSelector.addEventListener("click", () => {
      projectIdx = (projectIdx + 1) % projects.length;
      const nameEl = projectSelector.querySelector(".project-name");
      if (nameEl) nameEl.textContent = projects[projectIdx];
      window.showAppToast(`Contexto de proyecto: ${projects[projectIdx]}`);
    });
  }

  // Initialize all modular subsystems
  initProofing();
  initVideoReview();
  initVault();
  initContract();
  initStatusTracker();
  initDashboard();
  initCRM();
  initCalendar();
  initKanban();
  initUploads();
  initAdminTools();

  // Set initial platform
  switchPlatform("portal.theconceptstudio.com");
});
