/**
 * THE CONCEPT STUDIO. — 5-STAGE PRODUCTION PIPELINE (TABLERO KANBAN)
 * 1. Pre-producción / Por Rodar
 * 2. En Selección (Esperando cliente)
 * 3. Post-producción / Color
 * 4. Revisión
 * 5. Entregado / Cerrado
 */
import { firebaseService } from "./firebase/firebase-service.js";

export function initKanban() {
  const columns = document.querySelectorAll(".kanban-cards-container");
  const newTaskBtn = document.getElementById("add-task-btn");
  const taskModal = document.getElementById("new-task-modal");
  const closeTaskModalBtn = document.getElementById("close-task-modal");
  const submitNewTaskBtn = document.getElementById("submit-new-task-btn");

  let draggedCardId = null;

  function renderKanban() {
    const tasks = firebaseService.getPipelineTasks();

    // Clear columns
    columns.forEach(col => col.innerHTML = "");

    // Count tracker
    const counts = {
      pre_production: 0,
      in_selection: 0,
      post_production: 0,
      review: 0,
      delivered: 0
    };

    tasks.forEach(task => {
      const colEl = document.querySelector(`.kanban-cards-container[data-stage="${task.stage}"]`);
      if (!colEl) return;

      counts[task.stage] = (counts[task.stage] || 0) + 1;

      const card = document.createElement("div");
      card.className = "kanban-card";
      card.draggable = true;
      card.dataset.id = task.id;

      card.innerHTML = `
        <div class="kanban-card-project">${task.projectTag}</div>
        <div class="kanban-card-title">${task.title}</div>
        <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid var(--white-08); padding-top:0.5rem; margin-top:0.5rem;">
          <span class="badge ${task.priority === 'CRÍTICA' ? 'badge-solid' : 'badge-gold'}" style="font-size:0.55rem; padding:0.1rem 0.35rem;">
            ${task.priority}
          </span>
          <div class="mono-text" style="font-size:0.65rem; color:var(--white-50);">${task.assignee} · ${task.dueDate}</div>
        </div>
      `;

      card.addEventListener("dragstart", (e) => {
        draggedCardId = task.id;
        card.classList.add("dragging");
        e.dataTransfer.setData("text/plain", task.id);
        e.dataTransfer.effectAllowed = "move";
      });

      card.addEventListener("dragend", () => {
        card.classList.remove("dragging");
        columns.forEach(c => c.classList.remove("drag-over"));
      });

      colEl.appendChild(card);
    });

    // Update counters
    for (const [stage, count] of Object.entries(counts)) {
      const counterEl = document.getElementById(`kanban-count-${stage}`);
      if (counterEl) counterEl.textContent = count;
    }
  }

  // Setup Drag & Drop
  columns.forEach(col => {
    col.addEventListener("dragover", (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = "move";
      col.classList.add("drag-over");
    });

    col.addEventListener("dragleave", () => {
      col.classList.remove("drag-over");
    });

    col.addEventListener("drop", (e) => {
      e.preventDefault();
      col.classList.remove("drag-over");
      const targetStage = col.dataset.stage;

      if (draggedCardId && targetStage) {
        firebaseService.updateTaskStage(draggedCardId, targetStage);
        renderKanban();
        window.showAppToast?.(`Tarea movida a fase: ${targetStage.replace('_', ' ').toUpperCase()}`);
      }
    });
  });

  // Modal Handlers
  if (newTaskBtn && taskModal) {
    newTaskBtn.addEventListener("click", () => taskModal.classList.add("active"));
  }

  if (closeTaskModalBtn && taskModal) {
    closeTaskModalBtn.addEventListener("click", () => taskModal.classList.remove("active"));
  }

  if (submitNewTaskBtn && taskModal) {
    submitNewTaskBtn.addEventListener("click", () => {
      const titleInput = document.getElementById("task-title-input");
      const projectInput = document.getElementById("task-project-select");
      const stageInput = document.getElementById("task-stage-select");
      const priorityInput = document.getElementById("task-priority-select");
      const assigneeInput = document.getElementById("task-assignee-input");

      const title = titleInput?.value.trim();
      if (!title) {
        alert("Por favor ingresa la descripción de la tarea.");
        return;
      }

      firebaseService.addPipelineTask({
        title,
        projectTag: projectInput?.value || "NIKE // SPEED",
        stage: stageInput?.value || "pre_production",
        priority: priorityInput?.value || "ALTA",
        assignee: assigneeInput?.value || "TCS Crew",
        dueDate: "18 Feb"
      });

      if (titleInput) titleInput.value = "";
      taskModal.classList.remove("active");
      renderKanban();
      window.showAppToast?.("Nueva tarea agregada al pipeline de producción.");
    });
  }

  firebaseService.subscribe("pipeline_tasks", () => renderKanban());

  renderKanban();
}
