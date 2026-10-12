/**
 * THE CONCEPT STUDIO. — ASYNCHRONOUS VIDEO REVIEW (REVISIÓN DE VIDEO CON FEEDBACK PUNTUAL)
 * Stylized video player, frame timestamps & interactive on-screen spatial pin markers.
 */
import { firebaseService } from "./firebase/firebase-service.js";

export function initVideoReview() {
  const videoScreenWrapper = document.getElementById("video-screen-wrapper");
  const playBtn = document.getElementById("video-play-btn");
  const scrubberTrack = document.getElementById("video-scrubber-track");
  const scrubberFill = document.getElementById("video-scrubber-fill");
  const timecodeDisplay = document.getElementById("video-timecode-display");
  const overlayTimecode = document.getElementById("overlay-timecode");
  const commentInput = document.getElementById("video-comment-text");
  const anchorTimeChip = document.getElementById("anchor-time-chip");
  const submitCommentBtn = document.getElementById("submit-video-comment");
  const commentsList = document.getElementById("video-comments-list");
  const captureFrameBtn = document.getElementById("capture-current-frame-btn");
  const tagPills = document.querySelectorAll(".tag-pill");

  let currentPlaybackSeconds = 8;
  const totalDurationSeconds = 120; // 2 minutes reel
  let isPlaying = false;
  let playInterval = null;
  let anchoredSeconds = 8;
  let activePinCoords = { x: 48, y: 42 };
  let selectedCategory = "CORTE / EDICIÓN";

  function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }

  function updatePlayerUI() {
    const formatted = formatTime(currentPlaybackSeconds);
    const totalFormatted = formatTime(totalDurationSeconds);
    
    if (timecodeDisplay) {
      timecodeDisplay.textContent = `${formatted} / ${totalFormatted}`;
    }
    if (overlayTimecode) {
      overlayTimecode.textContent = `TC 01:00:${formatted}:12`;
    }
    if (scrubberFill) {
      const percentage = (currentPlaybackSeconds / totalDurationSeconds) * 100;
      scrubberFill.style.width = `${percentage}%`;
    }

    if (anchorTimeChip && !anchorTimeChip.dataset.locked) {
      anchoredSeconds = currentPlaybackSeconds;
      anchorTimeChip.textContent = `FRAME [${formatTime(anchoredSeconds)}] (X: ${activePinCoords.x}%, Y: ${activePinCoords.y}%)`;
    }
  }

  // Play / Pause simulation
  function togglePlay() {
    isPlaying = !isPlaying;
    if (playBtn) {
      playBtn.innerHTML = isPlaying 
        ? `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>`
        : `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>`;
    }

    if (isPlaying) {
      playInterval = setInterval(() => {
        currentPlaybackSeconds++;
        if (currentPlaybackSeconds >= totalDurationSeconds) currentPlaybackSeconds = 0;
        updatePlayerUI();
      }, 1000);
    } else {
      clearInterval(playInterval);
    }
  }

  if (playBtn) playBtn.addEventListener("click", togglePlay);

  // Click on Scrubber
  if (scrubberTrack) {
    scrubberTrack.addEventListener("click", (e) => {
      const rect = scrubberTrack.getBoundingClientRect();
      const clickPos = (e.clientX - rect.left) / rect.width;
      currentPlaybackSeconds = Math.floor(clickPos * totalDurationSeconds);
      updatePlayerUI();
    });
  }

  // ON-SCREEN SPATIAL PIN PLACEMENT (Feedback Puntual en Coordenadas)
  if (videoScreenWrapper) {
    videoScreenWrapper.addEventListener("click", (e) => {
      const rect = videoScreenWrapper.getBoundingClientRect();
      const xPct = Math.round(((e.clientX - rect.left) / rect.width) * 100);
      const yPct = Math.round(((e.clientY - rect.top) / rect.height) * 100);

      activePinCoords = { x: xPct, y: yPct };
      anchoredSeconds = currentPlaybackSeconds;

      if (anchorTimeChip) {
        anchorTimeChip.textContent = `PIN FIJADO [${formatTime(anchoredSeconds)}] (X: ${xPct}%, Y: ${yPct}%)`;
        anchorTimeChip.dataset.locked = "true";
      }

      // Render temporary draft pin on video frame
      renderDraftPin(xPct, yPct);

      if (commentInput) {
        commentInput.focus();
        commentInput.placeholder = `Escribe tu nota específica para la zona marcada en (${xPct}%, ${yPct}%)...`;
      }

      window.showAppToast?.(`Marcador fijado en pantalla (${xPct}%, ${yPct}%) a los [${formatTime(anchoredSeconds)}].`);
    });
  }

  function renderDraftPin(x, y) {
    document.querySelectorAll(".draft-spot-pin").forEach(p => p.remove());
    const pin = document.createElement("div");
    pin.className = "video-spot-pin draft-spot-pin";
    pin.style.left = `${x}%`;
    pin.style.top = `${y}%`;
    pin.innerHTML = `★`;
    pin.title = `Nuevo pin en (${x}%, ${y}%)`;
    videoScreenWrapper?.appendChild(pin);
  }

  // Capture Frame Button
  if (captureFrameBtn) {
    captureFrameBtn.addEventListener("click", () => {
      anchoredSeconds = currentPlaybackSeconds;
      if (anchorTimeChip) {
        anchorTimeChip.textContent = `FRAME [${formatTime(anchoredSeconds)}] (X: ${activePinCoords.x}%, Y: ${activePinCoords.y}%)`;
        anchorTimeChip.dataset.locked = "true";
      }
      if (commentInput) commentInput.focus();
      window.showAppToast?.(`Código de tiempo fijado en [${formatTime(anchoredSeconds)}].`);
    });
  }

  // Category tags
  tagPills.forEach(pill => {
    pill.addEventListener("click", () => {
      tagPills.forEach(p => p.classList.remove("active"));
      pill.classList.add("active");
      selectedCategory = pill.dataset.tag;
    });
  });

  // Render comments and on-screen pins
  function renderCommentsAndPins() {
    if (!commentsList) return;
    const comments = firebaseService.getVideoComments();
    commentsList.innerHTML = "";

    // Clear existing pins & markers
    document.querySelectorAll(".video-spot-pin:not(.draft-spot-pin)").forEach(p => p.remove());
    document.querySelectorAll(".scrubber-marker").forEach(m => m.remove());

    comments.forEach((c, index) => {
      // 1. On-Screen Pin
      if (videoScreenWrapper && c.pinX !== undefined && c.pinY !== undefined) {
        const pin = document.createElement("div");
        pin.className = "video-spot-pin";
        pin.style.left = `${c.pinX}%`;
        pin.style.top = `${c.pinY}%`;
        pin.textContent = `${index + 1}`;
        pin.title = `[${c.timecodeFormatted}] ${c.category}: ${c.text}`;
        pin.addEventListener("click", (e) => {
          e.stopPropagation();
          jumpToTimestamp(c.timecodeSeconds, c.pinX, c.pinY);
        });
        videoScreenWrapper.appendChild(pin);
      }

      // 2. Scrubber Marker
      if (scrubberTrack) {
        const marker = document.createElement("div");
        marker.className = "scrubber-marker";
        const markerPos = (c.timecodeSeconds / totalDurationSeconds) * 100;
        marker.style.left = `${markerPos}%`;
        marker.title = `[${c.timecodeFormatted}] ${c.category}`;
        marker.addEventListener("click", (e) => {
          e.stopPropagation();
          jumpToTimestamp(c.timecodeSeconds, c.pinX, c.pinY);
        });
        scrubberTrack.appendChild(marker);
      }

      // 3. Comment Card
      const card = document.createElement("div");
      card.className = "comment-card";
      card.dataset.time = c.timecodeSeconds;

      card.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.5rem;">
          <div style="display:flex; align-items:center; gap:0.5rem;">
            <span class="comment-timestamp-badge" style="cursor:pointer;" data-action="seek">
              ⏱ ${c.timecodeFormatted} · PIN #${index + 1}
            </span>
            <span style="font-size:0.65rem; font-weight:800; color:var(--white-70); text-transform:uppercase;">${c.author}</span>
          </div>
          <span class="badge ${c.status === 'APROBADO' ? 'badge-gold' : 'badge-outline'}" style="font-size:0.55rem;">${c.status}</span>
        </div>
        <p style="font-size:var(--text-xs); color:var(--white-bone); line-height:1.45; margin-bottom:0.4rem;">${c.text}</p>
        <div style="font-size:0.6rem; color:var(--gold-primary); font-family:var(--font-mono);">
          ZONA PANTALLA: X ${c.pinX}% / Y ${c.pinY}% · CATEGORÍA: ${c.category}
        </div>
      `;

      card.addEventListener("click", () => {
        jumpToTimestamp(c.timecodeSeconds, c.pinX, c.pinY);
      });

      commentsList.appendChild(card);
    });
  }

  function jumpToTimestamp(seconds, pinX, pinY) {
    currentPlaybackSeconds = seconds;
    updatePlayerUI();

    document.querySelectorAll(".comment-card").forEach(c => {
      c.classList.toggle("active", parseInt(c.dataset.time, 10) === seconds);
    });

    window.showAppToast?.(`Reproductor situado en [${formatTime(seconds)}] ${pinX ? `— Marcador en pantalla (${pinX}%, ${pinY}%)` : ''}`);
  }

  // Submit comment
  if (submitCommentBtn) {
    submitCommentBtn.addEventListener("click", () => {
      const text = commentInput?.value.trim();
      if (!text) {
        alert("Por favor escribe tu nota antes de enviar.");
        return;
      }

      const newComment = firebaseService.addVideoCommentWithPin({
        timecodeSeconds: anchoredSeconds,
        timecodeFormatted: formatTime(anchoredSeconds),
        pinX: activePinCoords.x,
        pinY: activePinCoords.y,
        category: selectedCategory,
        text: text,
        author: "Marcus Vance (Nike Director)"
      });

      if (commentInput) {
        commentInput.value = "";
        commentInput.placeholder = "Escribe el ajuste exacto o haz click en la pantalla para señalar...";
      }
      if (anchorTimeChip) delete anchorTimeChip.dataset.locked;
      document.querySelectorAll(".draft-spot-pin").forEach(p => p.remove());

      renderCommentsAndPins();
      window.showAppToast?.(`Nota al frame [${newComment.timecodeFormatted}] con pin visual registrada con éxito.`);
    });
  }

  firebaseService.subscribe("video_comments", () => renderCommentsAndPins());

  updatePlayerUI();
  renderCommentsAndPins();
}
