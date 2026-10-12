/**
 * THE CONCEPT STUDIO. — CRM DE CLIENTES (DATABASE & CLIENT NOTES DRAWER)
 * Client database table, search filtering, and client notes slide-out drawer.
 */
import { firebaseService } from "./firebase/firebase-service.js";

export function initCRM() {
  const tableBody = document.getElementById("crm-clients-tbody");
  const searchInput = document.getElementById("crm-search-input");
  const drawerOverlay = document.getElementById("crm-drawer-overlay");
  const closeDrawerBtn = document.getElementById("close-crm-drawer");
  const drawerClientName = document.getElementById("drawer-client-name");
  const drawerClientCompany = document.getElementById("drawer-client-company");
  const drawerClientEmail = document.getElementById("drawer-client-email");
  const drawerClientPhone = document.getElementById("drawer-client-phone");
  const notesContainer = document.getElementById("drawer-notes-list");
  const noteTextInput = document.getElementById("new-client-note-input");
  const addNoteBtn = document.getElementById("submit-client-note-btn");

  let activeClientId = null;
  let searchTerm = "";

  function renderTable() {
    if (!tableBody) return;
    const clients = firebaseService.getClients();

    const filtered = clients.filter(c => 
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.company.toLowerCase().includes(searchTerm.toLowerCase())
    );

    tableBody.innerHTML = "";

    filtered.forEach(client => {
      const tr = document.createElement("tr");

      tr.innerHTML = `
        <td>
          <div class="client-name-bold">${client.name}</div>
          <div class="client-company-tag">${client.company}</div>
        </td>
        <td>
          <div style="font-size:var(--text-xs); color:var(--white);">${client.email}</div>
          <div style="font-size:0.65rem; color:var(--white-40); font-family:var(--font-mono);">${client.phone}</div>
        </td>
        <td class="mono-text">${client.projectsCount}</td>
        <td class="mono-text" style="font-weight:900;">${client.totalBilled}</td>
        <td>
          <span class="badge ${client.status === 'ACTIVO' ? 'badge-solid' : 'badge-outline'}">${client.status}</span>
        </td>
        <td>
          <button class="btn btn-secondary btn-sm" data-action="view-notes" data-id="${client.id}">
            VER NOTAS & EXPEDIENTE
          </button>
        </td>
      `;

      tableBody.appendChild(tr);
    });
  }

  // Search input
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      searchTerm = e.target.value.trim();
      renderTable();
    });
  }

  // Table click event delegation
  if (tableBody) {
    tableBody.addEventListener("click", (e) => {
      const btn = e.target.closest('[data-action="view-notes"]');
      if (btn) {
        const id = btn.dataset.id;
        openDrawer(id);
      }
    });
  }

  function openDrawer(clientId) {
    activeClientId = clientId;
    const clients = firebaseService.getClients();
    const client = clients.find(c => c.id === clientId);
    if (!client) return;

    if (drawerClientName) drawerClientName.textContent = client.name;
    if (drawerClientCompany) drawerClientCompany.textContent = client.company;
    if (drawerClientEmail) drawerClientEmail.textContent = client.email;
    if (drawerClientPhone) drawerClientPhone.textContent = client.phone;

    renderNotes(client);
    if (drawerOverlay) drawerOverlay.classList.add("active");
  }

  function renderNotes(client) {
    if (!notesContainer) return;
    notesContainer.innerHTML = "";

    if (!client.notes || client.notes.length === 0) {
      notesContainer.innerHTML = `<p style="color:var(--white-40); font-size:var(--text-xs); padding:1rem 0;">No hay notas registradas aún.</p>`;
      return;
    }

    client.notes.forEach((note, idx) => {
      const noteDiv = document.createElement("div");
      noteDiv.className = "note-item";
      noteDiv.innerHTML = `
        <div class="note-header">
          <span>ENTRADA #${idx + 1}</span>
          <span>THE CONCEPT STUDIO.</span>
        </div>
        <p style="font-size:var(--text-xs); color:var(--white); line-height:1.4;">${note}</p>
      `;
      notesContainer.appendChild(noteDiv);
    });
  }

  // Add Note Button
  if (addNoteBtn) {
    addNoteBtn.addEventListener("click", () => {
      const text = noteTextInput?.value.trim();
      if (!text || !activeClientId) {
        alert("Por favor escribe la nota del cliente.");
        return;
      }

      firebaseService.addClientNote(activeClientId, text);
      const clients = firebaseService.getClients();
      const updatedClient = clients.find(c => c.id === activeClientId);
      renderNotes(updatedClient);
      if (noteTextInput) noteTextInput.value = "";
      window.showAppToast?.("Nota de cliente archivada en el CRM.");
    });
  }

  if (closeDrawerBtn && drawerOverlay) {
    closeDrawerBtn.addEventListener("click", () => drawerOverlay.classList.remove("active"));
    drawerOverlay.addEventListener("click", (e) => {
      if (e.target === drawerOverlay) {
        drawerOverlay.classList.remove("active");
      }
    });
  }

  firebaseService.subscribe("clients", () => renderTable());

  renderTable();
}
