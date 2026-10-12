/**
 * THE CONCEPT STUDIO. — PROJECT STATUS TRACKER (RASTREADOR DE PROYECTOS)
 * 4-Phase pipeline visualizer, production milestones & delivery schedule.
 */

export function initStatusTracker() {
  const milestoneChecks = document.querySelectorAll(".milestone-item");
  const overallBar = document.getElementById("overall-progress-bar");

  // Allow client or admin to click milestones to view details or toggle simulated state
  milestoneChecks.forEach(item => {
    item.addEventListener("click", () => {
      item.classList.toggle("done");
      const checkIcon = item.querySelector(".milestone-check");
      if (checkIcon) {
        checkIcon.innerHTML = item.classList.contains("done") 
          ? `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>`
          : "";
      }
      updateMilestonePercentage();
    });
  });

  function updateMilestonePercentage() {
    const total = milestoneChecks.length;
    const completed = document.querySelectorAll(".milestone-item.done").length;
    const pct = Math.round((completed / total) * 100);
    if (overallBar) {
      overallBar.style.width = `${pct}%`;
    }
  }
}
