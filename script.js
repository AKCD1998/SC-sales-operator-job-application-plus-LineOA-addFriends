  // ====== CONFIG ======
  // 1) ใส่ลิงก์ add friend ของคุณ
  const LINE_OA_URL = "https://lin.ee/z2YHGcv";
  // 2) ใส่รูป QR ของคุณ (URL รูป)
  const LINE_QR_IMG = "https://qr-official.line.me/gs/M_086ommzx_GW.png?oat_content=qr";

  // ====== WIRE UI ======
  const overlay = document.getElementById('thankOverlay');
  const btnClose = document.getElementById('btnClose');
  const btnOpenThank = document.getElementById('btnOpenThank');
  const btnIveSent = document.getElementById('btnIveSent');

  const btnAddLine = document.getElementById('btnAddLine');
  const btnAddLineTop = document.getElementById('btnAddLineTop');
  const addLineLink = document.getElementById('addLineLink');
  const qrImg = document.getElementById('qrImg');

  // apply config
  btnAddLine.href = LINE_OA_URL;
  btnAddLineTop.href = LINE_OA_URL;
  addLineLink.href = LINE_OA_URL;
  addLineLink.textContent = LINE_OA_URL;
  qrImg.src = LINE_QR_IMG;

  function openThankYou(){
    overlay.classList.add('is-open');
    overlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }
  function closeThankYou(){
    overlay.classList.remove('is-open');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  btnClose.addEventListener('click', closeThankYou);
  overlay.addEventListener('click', (e) => { if(e.target === overlay) closeThankYou(); });
  btnOpenThank.addEventListener('click', openThankYou);
  btnIveSent.addEventListener('click', openThankYou);

  // ====== AUTO-DETECT “submitted” (best-effort) ======
  // Google Forms inside iframe is cross-origin, so we can't read DOM.
  // BUT: we can read iframe.contentWindow.location.href sometimes? (usually blocked)
  // So we do a safer trick: listen to iframe load events and check its src attribute changes.
  const gform = document.getElementById('gform');

  // heuristic: after submit, Google Forms often navigates to .../formResponse or includes "formResponse"
  // We cannot read inside location, but we CAN check if the iframe element's "src" gets updated (rare).
  // Another heuristic: user spends some time + iframe triggers load multiple times.
  let loadCount = 0;
  let armedAt = Date.now();

  gform.addEventListener('load', () => {
    loadCount++;

    // heuristic gate: ignore early loads during initial rendering
    const secondsSinceStart = (Date.now() - armedAt) / 1000;

    // If it loaded again after some time (user likely submitted) -> open thank you
    // This is a best-effort guess, hence we also provide manual "ฉันส่งแล้ว" button.
    if (secondsSinceStart > 8 && loadCount >= 2) {
      // open once only
      if (!overlay.classList.contains('is-open')) openThankYou();
    }
  });