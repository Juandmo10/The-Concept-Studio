/**
 * THE CONCEPT STUDIO. — VISOR DE CONTRATOS, ESTADO DE CUENTA Y COMPROBANTE DE PAGO
 * Proposal breakdown, digital canvas signature, account balance & payment receipt upload.
 */
import { firebaseService } from "./firebase/firebase-service.js";

export function initContract() {
  const canvas = document.getElementById("signature-canvas");
  const clearBtn = document.getElementById("clear-signature-btn");
  const signBtn = document.getElementById("sign-contract-btn");
  const legalCheckbox = document.getElementById("legal-consent-check");
  const signerNameInput = document.getElementById("signer-name-input");
  const signedStamp = document.getElementById("signed-verification-stamp");
  const signatureSection = document.getElementById("signature-active-form");

  const proofZone = document.getElementById("payment-proof-dropzone");
  const proofFileInput = document.getElementById("payment-proof-file-input");
  const proofStatusText = document.getElementById("payment-proof-status-text");

  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  let isDrawing = false;
  let hasDrawn = false;

  function resizeCanvas() {
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = rect.height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    ctx.strokeStyle = "#D4AF37"; // Soft gold signature stroke
    ctx.lineWidth = 2.5;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
  }

  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  function getPos(e) {
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  }

  function startDraw(e) {
    e.preventDefault();
    isDrawing = true;
    hasDrawn = true;
    const pos = getPos(e);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
  }

  function draw(e) {
    if (!isDrawing) return;
    e.preventDefault();
    const pos = getPos(e);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
  }

  function endDraw() {
    isDrawing = false;
  }

  canvas.addEventListener("mousedown", startDraw);
  canvas.addEventListener("mousemove", draw);
  canvas.addEventListener("mouseup", endDraw);
  canvas.addEventListener("mouseleave", endDraw);

  canvas.addEventListener("touchstart", startDraw, { passive: false });
  canvas.addEventListener("touchmove", draw, { passive: false });
  canvas.addEventListener("touchend", endDraw);

  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      hasDrawn = false;
    });
  }

  // Payment proof uploader
  if (proofZone && proofFileInput) {
    proofZone.addEventListener("click", () => proofFileInput.click());

    proofFileInput.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (file) {
        firebaseService.attachPaymentProof(file.name);
        if (proofStatusText) {
          proofStatusText.innerHTML = `
            <span style="color:var(--gold-primary); font-weight:800;">✓ COMPROBANTE ADJUNTO Y REGISTRADO:</span> ${file.name}
          `;
        }
        window.showAppToast?.(`Comprobante [${file.name}] adjuntado con éxito.`);
      }
    });
  }

  // Check if contract is signed
  function checkContractStatus() {
    const contract = firebaseService.getContractStatus?.() || { isSigned: false };
    if (contract && contract.isSigned) {
      if (signatureSection) signatureSection.style.display = "none";
      if (signedStamp) {
        signedStamp.classList.add("active");
        signedStamp.innerHTML = `
          <div style="border: 1px solid var(--gold-primary); border-radius:var(--radius-sm); padding: 1.5rem; text-align: center; background: var(--navy-900);">
            <div class="badge badge-gold" style="margin-bottom:0.75rem;">
              DOCUMENTO APROBADO & PROTOCOLIZADO
            </div>
            <h4 style="font-size:1.1rem; font-weight:900; letter-spacing:var(--tracking-wide); text-transform:uppercase; margin-bottom:0.5rem; color:var(--white);">
              FIRMADO POR: ${contract.signerName}
            </h4>
            <div class="mono-text" style="font-size:0.75rem; color:var(--white-70); margin-bottom:0.25rem;">
              FECHA DE PROTOCOLIZACIÓN: ${contract.signedAt}
            </div>
            <div class="mono-text" style="font-size:0.65rem; color:var(--gold-primary);">
              SELLO CRIPTOGRÁFICO SHA-256: ${contract.signatureHash}
            </div>
          </div>
        `;
      }
    }
  }

  if (signBtn) {
    signBtn.addEventListener("click", () => {
      const name = signerNameInput?.value.trim();
      if (!name) {
        alert("Por favor ingresa tu Nombre y Cargo oficial.");
        return;
      }
      if (!legalCheckbox?.checked) {
        alert("Debes marcar la casilla de aceptación legal de representación.");
        return;
      }
      if (!hasDrawn) {
        alert("Por favor traza tu firma digital en el recuadro superior.");
        return;
      }

      const sigUrl = canvas.toDataURL("image/png");
      const signed = firebaseService.signContract(name, sigUrl);

      checkContractStatus();
      window.showAppToast?.(`CONTRATO ${signed.contractNumber} FIRMADO Y PROTOCOLIZADO EN FIRESTORE.`);
    });
  }

  checkContractStatus();
}
