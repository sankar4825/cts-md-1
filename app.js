/**
 * app.js — Local Community Event Portal
 * Covers HTML5 Tasks: 6 (events), 7 (media), 8 (storage), 9 (geolocation), 10 (debug)
 */

/* ============================================================
   HTML Task 8 – localStorage: restore saved preference on load
   ============================================================ */
window.addEventListener('DOMContentLoaded', () => {
  console.log('[Portal] DOM ready — restoring preferences…');

  const saved = localStorage.getItem('preferredEvent');
  if (saved) {
    const sel = document.getElementById('eventType');
    if (sel) {
      sel.value = saved;
      console.log('[Storage] Restored preferred event:', saved);
    }
  }
});

/* ──────────────────────────────────────────────
   HTML Task 8 – Save preference on dropdown change
   ────────────────────────────────────────────── */
function savePreference() {
  const sel   = document.getElementById('eventType');
  const value = sel.value;
  if (value) {
    localStorage.setItem('preferredEvent', value);
    console.log('[Storage] Saved preference:', value);
  }
}

/* ──────────────────────────────────────────────
   HTML Task 8 – Clear localStorage & sessionStorage
   ────────────────────────────────────────────── */
function clearPreferences() {
  localStorage.clear();
  sessionStorage.clear();
  const sel = document.getElementById('eventType');
  if (sel) sel.value = '';
  alert('✅ Preferences cleared!');
  console.log('[Storage] localStorage and sessionStorage cleared.');
}

/* ============================================================
   HTML Task 5 – Form submission: show <output> confirmation
   ============================================================ */
function handleSubmit(event) {
  event.preventDefault();

  const name  = document.getElementById('fullName').value.trim();
  const email = document.getElementById('email').value.trim();
  const date  = document.getElementById('eventDate').value;
  const type  = document.getElementById('eventType').value;

  const output = document.getElementById('confirmationOutput');
  if (name && email && date && type) {
    output.value = `🎉 Thank you, ${name}! You've successfully registered for "${type}" on ${date}. Confirmation sent to ${email}.`;
    output.style.display = 'block';
    console.log('[Form] Registration submitted:', { name, email, date, type });

    // Save to sessionStorage as well
    sessionStorage.setItem('lastRegistration', JSON.stringify({ name, email, date, type }));
  } else {
    output.value = '⚠️ Please fill in all required fields.';
    output.style.display = 'block';
    output.style.background = '#fef9e7';
    output.style.borderLeftColor = '#e67e22';
    output.style.color = '#7d5a00';
  }
}

/* ──────────────────────────────────────────────
   HTML Task 6 – onclick: confirm submit button
   ────────────────────────────────────────────── */
function confirmSubmit() {
  console.log('[Event] Submit button clicked.');
  // The actual confirmation is shown via handleSubmit's <output>
}

/* ============================================================
   HTML Task 6 – onblur: validate phone number
   ============================================================ */
function validatePhone(input) {
  const phone   = input.value.trim();
  const errSpan = document.getElementById('phoneError');
  const regex   = /^[6-9]\d{9}$/;  // Indian mobile format

  if (phone.length === 0) {
    errSpan.textContent = '';
    return;
  }

  if (!regex.test(phone)) {
    errSpan.textContent = '⚠️ Enter a valid 10-digit mobile number (starts with 6–9).';
    input.style.borderColor = '#e74c3c';
    console.warn('[Validation] Invalid phone:', phone);
  } else {
    errSpan.textContent = '✔ Valid phone number.';
    errSpan.style.color = '#2ecc71';
    input.style.borderColor = '#2ecc71';
    console.log('[Validation] Phone OK:', phone);
  }
}

/* ============================================================
   HTML Task 6 – onchange: show event fee from dropdown
   ============================================================ */
function showEventFee(select) {
  const feeDisplay = document.getElementById('feeDisplay');
  if (select.value) {
    feeDisplay.textContent = '💰 Selected: ' + select.value;
    console.log('[Event] Fee selected:', select.value);
  } else {
    feeDisplay.textContent = '';
  }
}

/* ============================================================
   HTML Task 6 – ondblclick: enlarge gallery image
   ============================================================ */
function enlargeImage(img) {
  const modal    = document.getElementById('imgModal');
  const modalImg = document.getElementById('modalImg');
  modalImg.src   = img.src;
  modalImg.alt   = img.alt;
  modal.classList.add('active');
  console.log('[Event] Image enlarged:', img.title);
}

function closeModal() {
  document.getElementById('imgModal').classList.remove('active');
}

// Keyboard: close modal with Escape
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
  console.log('[KeyEvent] Key pressed:', e.key);
});

/* ============================================================
   HTML Task 6 – onkeyup: character counter in feedback textarea
   ============================================================ */
function countChars(textarea) {
  const max     = textarea.maxLength;
  const current = textarea.value.length;
  const counter = document.getElementById('charCount');
  counter.textContent = `${current} / ${max}`;
  counter.style.color = current > max * 0.85 ? '#e74c3c' : '';
  console.log('[KeyEvent] Char count:', current);
}

/* ============================================================
   HTML Task 7 – oncanplay: video ready message
   ============================================================ */
function videoReady() {
  const status = document.getElementById('videoStatus');
  if (status) {
    status.textContent = '▶ Video ready to play!';
    console.log('[Media] Video can play.');
  }
}

/* ============================================================
   HTML Task 7 – onbeforeunload: warn user if form is unfinished
   ============================================================ */
function warnBeforeLeave() {
  const name  = document.getElementById('fullName');
  const email = document.getElementById('email');
  if ((name && name.value.trim()) || (email && email.value.trim())) {
    return 'You have unsaved registration details. Are you sure you want to leave?';
  }
}

/* ============================================================
   HTML Task 9 – Geolocation: Find Nearby Events
   ============================================================ */
function findNearbyEvents() {
  const result = document.getElementById('geoResult');
  result.textContent = '🔍 Detecting your location…';

  if (!navigator.geolocation) {
    result.textContent = '❌ Geolocation is not supported by your browser.';
    console.error('[Geo] Geolocation not supported.');
    return;
  }

  const options = {
    enableHighAccuracy: true,   // HTML Task 9: high accuracy
    timeout: 8000,
    maximumAge: 0
  };

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const lat = position.coords.latitude.toFixed(5);
      const lon = position.coords.longitude.toFixed(5);
      const acc = position.coords.accuracy.toFixed(0);

      result.textContent =
        `📍 Your location: Lat ${lat}, Lon ${lon} (±${acc}m). Showing events near you!`;

      console.log('[Geo] Position:', { lat, lon, acc });
    },
    (error) => {
      // HTML Task 9: error handling
      switch (error.code) {
        case error.PERMISSION_DENIED:
          result.textContent = '🚫 Location access denied. Please allow location in browser settings.';
          break;
        case error.POSITION_UNAVAILABLE:
          result.textContent = '⚠️ Location information unavailable.';
          break;
        case error.TIMEOUT:
          result.textContent = '⏱ Location request timed out. Try again.';
          break;
        default:
          result.textContent = '❓ An unknown error occurred.';
      }
      console.warn('[Geo] Error:', error.message);
    },
    options
  );
}

/* ============================================================
   HTML Task 10 – Console Logs for DevTools debugging
   ============================================================ */
console.log('%c[Portal] Community Event Portal loaded ✓', 'color:#1a3c5e; font-weight:bold; font-size:13px');
console.log('[Debug] localStorage keys:', Object.keys(localStorage));
console.log('[Debug] sessionStorage keys:', Object.keys(sessionStorage));

// Breakpoint-friendly named function for DevTools (Task 10)
function debugPortalState() {
  /* Set a breakpoint on the next line in Chrome DevTools → Sources */
  const state = {
    preferredEvent: localStorage.getItem('preferredEvent'),
    lastRegistration: sessionStorage.getItem('lastRegistration'),
    pageTitle: document.title,
    timestamp: new Date().toISOString()
  };
  console.table(state);
  return state;
}

// Expose to console for manual testing
window.debugPortalState = debugPortalState;