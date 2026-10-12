/**
 * THE CONCEPT STUDIO. — PRODUCTION CALENDAR (CALENDARIO DE PRODUCCIÓN)
 * Shoot schedules, scouting days, post-production milestones & Call Sheet viewer.
 */

export function initCalendar() {
  const calendarGrid = document.getElementById("calendar-days-grid");
  const callSheetDetails = document.getElementById("call-sheet-content");

  const events = [
    { day: 14, title: "RODAJE: NIKE SPEED DÍA 1", type: "shoot", location: "Estadio Olímpico Pista 1", callTime: "05:30 AM", gear: "RED V-Raptor 8K + Phantom Flex 4K" },
    { day: 15, title: "RODAJE: NIKE SPEED DÍA 2", type: "shoot", location: "Estadio Olímpico Pista 1", callTime: "06:00 AM", gear: "Canon R5 II Stills + Profoto Pro-11" },
    { day: 16, title: "RODAJE: NIKE SPEED DÍA 3", type: "shoot", location: "Estudio Black Box B", callTime: "07:30 AM", gear: "Gimbal Ronin 2 + Master Anamorphics" },
    { day: 19, title: "SCOUTING: VELÓDROMO NACIONAL", type: "scout", location: "Velódromo Central", callTime: "09:00 AM", gear: "Director Viewfinder + Drone Mavic 3 Cine" },
    { day: 24, title: "ENTREGA MASTER PRORES 4K", type: "deadline", location: "Bóveda Cloud TCS", callTime: "18:00 PM", gear: "Master DaVinci Resolve DCI-P3" },
    { day: 26, title: "POST: COLOR GRADING SUITE", type: "scout", location: "Suite DaVinci TCS", callTime: "10:00 AM", gear: "Monitores Flanders Scientific OLED" }
  ];

  function renderCalendar() {
    if (!calendarGrid) return;
    calendarGrid.innerHTML = "";

    // February 2026 starts on Sunday (1)
    // 28 days total
    const totalDays = 28;

    for (let d = 1; d <= totalDays; d++) {
      const dayCell = document.createElement("div");
      dayCell.className = `calendar-day-cell ${d === 11 ? "today" : ""}`;
      dayCell.dataset.day = d;

      const dayEvents = events.filter(e => e.day === d);

      dayCell.innerHTML = `
        <span class="day-number">${d < 10 ? "0" + d : d}</span>
        ${dayEvents.map(ev => `
          <div class="calendar-event-pill ${ev.type === 'scout' ? 'event-scout' : ev.type === 'deadline' ? 'event-deadline' : ''}" data-event-day="${ev.day}">
            ${ev.title}
          </div>
        `).join("")}
      `;

      dayCell.addEventListener("click", () => {
        if (dayEvents.length > 0) {
          showCallSheet(dayEvents[0]);
        }
      });

      calendarGrid.appendChild(dayCell);
    }
  }

  function showCallSheet(ev) {
    if (!callSheetDetails) return;
    callSheetDetails.innerHTML = `
      <div style="background:var(--navy-black); border:1px solid var(--white-30); padding:1.5rem; margin-top:1rem;">
        <div class="section-label">ORDEN DE RODAJE // CALL SHEET</div>
        <h3 style="font-size:1.1rem; font-weight:900; letter-spacing:var(--tracking-wide); text-transform:uppercase; margin-bottom:1rem; color:var(--white);">
          ${ev.title}
        </h3>
        
        <div style="display:flex; flex-direction:column; gap:0.75rem; font-size:var(--text-xs);">
          <div>
            <span style="color:var(--white-40); font-weight:800; text-transform:uppercase; letter-spacing:var(--tracking-wide); display:block; margin-bottom:2px;">HORA DE LLAMADO (CREW CALL):</span>
            <span class="mono-text" style="font-size:1rem; font-weight:900; color:var(--white);">${ev.callTime}</span>
          </div>

          <div>
            <span style="color:var(--white-40); font-weight:800; text-transform:uppercase; letter-spacing:var(--tracking-wide); display:block; margin-bottom:2px;">LOCACIÓN CONFIRMADA:</span>
            <span style="color:var(--white); font-weight:700;">${ev.location}</span>
          </div>

          <div>
            <span style="color:var(--white-40); font-weight:800; text-transform:uppercase; letter-spacing:var(--tracking-wide); display:block; margin-bottom:2px;">PAQUETE DE CÁMARA & ILUMINACIÓN:</span>
            <span class="mono-text" style="color:var(--white-80);">${ev.gear}</span>
          </div>

          <div>
            <span style="color:var(--white-40); font-weight:800; text-transform:uppercase; letter-spacing:var(--tracking-wide); display:block; margin-bottom:2px;">CREW PRINCIPAL:</span>
            <span style="color:var(--white);">Juan D. (Dir), Alex T. (DP), Carlos M. (Stills), Sofia R. (DIT)</span>
          </div>
        </div>

        <button class="btn btn-primary btn-sm" style="width:100%; margin-top:1.5rem;" onclick="window.showAppToast?.('Orden de llamado (Call Sheet) enviada al equipo por canal seguro.')">
          ENVIAR CALL SHEET A CREW
        </button>
      </div>
    `;
    window.showAppToast?.(`Mostrando detalles de producción: ${ev.title}`);
  }

  renderCalendar();
}
