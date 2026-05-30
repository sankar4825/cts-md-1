/* ================================================================
   main.js — Community Event Portal
   All 14 JavaScript Tasks Implemented
   ================================================================ */

// ─────────────────────────────────────────────────────────────────
// TASK 1: JavaScript Basics & Setup
// console.log on load + alert on DOMContentLoaded
// ─────────────────────────────────────────────────────────────────
console.log("Welcome to the Community Portal");

window.addEventListener("DOMContentLoaded", () => {
  alert("Welcome! The Community Event Portal has fully loaded.");
  initPortal();
});


// ─────────────────────────────────────────────────────────────────
// TASK 2: Syntax, Data Types, Operators
// const for event name/date, let for seats, template literals, ++/--
// ─────────────────────────────────────────────────────────────────

// Task 5: Event constructor / class + prototype
class Event {
  constructor({ id, name, date, location, category, seats, emoji }) {
    this.id       = id;
    this.name     = name;
    this.date     = new Date(date);
    this.location = location;
    this.category = category;
    this.seats    = seats;         // let-like: mutable
    this.maxSeats = seats;
    this.emoji    = emoji || "📅";
    this.registered = false;
  }

  // Task 5: method on prototype
  checkAvailability() {
    return this.seats > 0;
  }

  // Task 2: template literal info string
  getSummary() {
    return `${this.name} | ${this.category} | ${this.date.toDateString()} | Seats: ${this.seats}`;
  }
}

// Task 5: add checkAvailability to prototype explicitly (as required)
Event.prototype.checkAvailability = function () {
  return this.seats > 0;
};


// ─────────────────────────────────────────────────────────────────
// TASK 4: Closures — track total registrations per category
// ─────────────────────────────────────────────────────────────────
function makeCategoryTracker() {
  const counts = {};   // closure variable
  return {
    register(category) {
      counts[category] = (counts[category] || 0) + 1;
    },
    getCount(category) {
      return counts[category] || 0;
    },
    getAll() {
      return { ...counts };
    }
  };
}
const categoryTracker = makeCategoryTracker();


// ─────────────────────────────────────────────────────────────────
// SEED DATA — Task 6: events array
// ─────────────────────────────────────────────────────────────────

// Task 6: use .push() to build array
const eventsArray = [];

// Task 4: addEvent() function
function addEvent(eventData) {
  eventsArray.push(new Event(eventData));
}

// Seed events (mix of past and future for Task 3 filtering)
const today = new Date();
const future = (days) => new Date(today.getTime() + days * 86400000).toISOString().split("T")[0];
const past   = (days) => new Date(today.getTime() - days * 86400000).toISOString().split("T")[0];

addEvent({ id: 1,  name: "Jazz Night at the Park",      date: future(3),  location: "Central Park",       category: "Music",    seats: 40, emoji: "🎷" });
addEvent({ id: 2,  name: "Bread Baking Workshop",        date: future(5),  location: "Community Hall",     category: "Workshop", seats: 15, emoji: "🍞" });
addEvent({ id: 3,  name: "5K Fun Run",                   date: future(7),  location: "Riverside Trail",    category: "Sports",   seats: 100,emoji: "🏃" });
addEvent({ id: 4,  name: "Street Food Festival",         date: future(10), location: "Town Square",        category: "Food",     seats: 200,emoji: "🌮" });
addEvent({ id: 5,  name: "React Workshop for Beginners", date: future(12), location: "Tech Hub",           category: "Tech",     seats: 30, emoji: "⚛️" });
addEvent({ id: 6,  name: "Mural Painting Day",           date: future(14), location: "Arts Quarter",       category: "Art",      seats: 20, emoji: "🎨" });
addEvent({ id: 7,  name: "Acoustic Open Mic",            date: future(18), location: "The Rooftop Bar",    category: "Music",    seats: 60, emoji: "🎤" });
addEvent({ id: 8,  name: "Python for Data Science",      date: future(20), location: "Tech Hub",           category: "Tech",     seats: 25, emoji: "🐍" });
addEvent({ id: 9,  name: "Yoga in the Garden",           date: future(22), location: "Botanical Garden",   category: "Sports",   seats: 0,  emoji: "🧘" }); // full
addEvent({ id: 10, name: "Summer Pottery Class",         date: past(2),    location: "Studio North",       category: "Art",      seats: 10, emoji: "🏺" }); // past
addEvent({ id: 11, name: "Chess Tournament",             date: future(25), location: "Library Hall",       category: "Workshop", seats: 32, emoji: "♟️" });
addEvent({ id: 12, name: "Salsa Dance Night",            date: future(30), location: "Dance Studio",       category: "Music",    seats: 5,  emoji: "💃" });


// ─────────────────────────────────────────────────────────────────
// TASK 3: Conditionals — filter only valid (future + seats > 0)
// ─────────────────────────────────────────────────────────────────
function isValidEvent(event) {
  const isUpcoming = event.date >= new Date();
  const hasSeats   = event.seats > 0;
  return isUpcoming && hasSeats;
}

// Task 10: spread operator to clone before filtering
function getFilteredEvents(filterFn = null) {
  const cloned = [...eventsArray];   // Task 10: spread clone
  return cloned.filter(filterFn || isValidEvent);
}


// ─────────────────────────────────────────────────────────────────
// TASK 4: filterEventsByCategory — higher-order with callback
// ─────────────────────────────────────────────────────────────────
function filterEventsByCategory(events, category, filterCallback) {
  return events.filter(e => filterCallback(e, category));
}

// Task 4: callback used by filter
const categoryMatchCallback = (event, category) =>
  category === "all" ? isValidEvent(event) : (isValidEvent(event) && event.category === category);


// ─────────────────────────────────────────────────────────────────
// TASK 4: registerUser function
// TASK 3: try-catch error handling inside
// ─────────────────────────────────────────────────────────────────
function registerUser(eventId, userName) {
  try {
    const event = eventsArray.find(e => e.id === eventId);
    if (!event)            throw new Error(`Event with ID ${eventId} not found.`);
    if (!isValidEvent(event)) throw new Error(`Event "${event.name}" is not available.`);
    if (event.registered)  throw new Error(`You are already registered for "${event.name}".`);

    event.seats--;          // Task 2: -- operator
    event.registered = true;
    categoryTracker.register(event.category);  // Task 4: closure tracker

    debugLog(`✔ Registered "${userName}" for "${event.name}"`, "log-ok");
    debugLog(`  Seats remaining: ${event.seats}`, "log-info");
    debugLog(`  Category "${event.category}" total registrations: ${categoryTracker.getCount(event.category)}`, "log-info");

    return { success: true, event };
  } catch (err) {
    debugLog(`✖ Error: ${err.message}`, "log-error");
    return { success: false, message: err.message };
  }
}

function cancelRegistration(eventId) {
  try {
    const event = eventsArray.find(e => e.id === eventId);
    if (!event)           throw new Error("Event not found.");
    if (!event.registered) throw new Error("Not registered for this event.");

    event.seats++;          // Task 2: ++ operator
    event.registered = false;

    debugLog(`↩ Cancelled registration for "${event.name}"`, "log-warn");
    return { success: true, event };
  } catch (err) {
    debugLog(`✖ Cancel error: ${err.message}`, "log-error");
    return { success: false, message: err.message };
  }
}


// ─────────────────────────────────────────────────────────────────
// TASK 7: DOM Manipulation — render event cards
// ─────────────────────────────────────────────────────────────────
function renderEvents(events) {
  // Task 7: querySelector
  const container = document.querySelector("#events-container");
  const noMsg     = document.querySelector("#no-events-msg");

  container.innerHTML = "";

  if (events.length === 0) {
    noMsg.classList.remove("hidden");
    return;
  }
  noMsg.classList.add("hidden");

  // Task 3: forEach loop
  events.forEach((event, index) => {
    // Task 6: .map() to format display card title
    const cardTitle = [event.emoji, event.name]
      .map(s => s)
      .join(" ");

    // Task 7: createElement
    const card = document.createElement("div");
    card.className = "event-card";
    card.dataset.id = event.id;
    card.style.animationDelay = `${index * 0.05}s`;

    const seatsPercent = Math.round((event.seats / event.maxSeats) * 100);
    const isLow = seatsPercent <= 25;

    // Task 5: Object.entries() to show event properties
    const entryLines = Object.entries({
      Date:     event.date.toDateString(),
      Location: event.location,
      Seats:    `${event.seats} / ${event.maxSeats}`
    }).map(([k, v]) => `<span>📌 <strong>${k}:</strong> ${v}</span>`).join("");

    card.innerHTML = `
      <span class="card-category">${event.category}</span>
      <div class="card-title">${cardTitle}</div>
      <div class="card-meta">${entryLines}</div>
      <div class="card-seats">
        <small style="color:var(--muted);font-size:.78rem;">${event.seats} seats left</small>
        <div class="seats-bar-wrap">
          <div class="seats-bar ${isLow ? "low" : ""}" style="width:${seatsPercent}%"></div>
        </div>
        ${event.registered ? '<span class="card-registered-badge">✓ Registered</span>' : ""}
      </div>
      <div class="card-actions">
        <button class="btn-register" ${event.registered ? "disabled" : ""}
          onclick="handleRegister(${event.id})">
          ${event.registered ? "Registered ✓" : "Register"}
        </button>
        ${event.registered ? `<button class="btn-cancel" onclick="handleCancel(${event.id})">Cancel</button>` : ""}
      </div>
    `;

    container.appendChild(card);
  });

  updateStats();
  populateEventDropdown();
}


// ─────────────────────────────────────────────────────────────────
// TASK 8: Event Handling — onclick register button
// ─────────────────────────────────────────────────────────────────
function handleRegister(eventId) {
  const result = registerUser(eventId, "Portal User");
  if (result.success) {
    renderCurrentView();
  }
}

function handleCancel(eventId) {
  const result = cancelRegistration(eventId);
  if (result.success) {
    renderCurrentView();
  }
}


// ─────────────────────────────────────────────────────────────────
// TASK 8: onchange filter by category
// ─────────────────────────────────────────────────────────────────
let currentCategory = "all";
let currentSearch   = "";

function filterByCategory(category) {
  currentCategory = category;
  renderCurrentView();
}

function resetFilters() {
  currentCategory = "all";
  currentSearch   = "";
  document.querySelector("#category-filter").value = "all";
  document.querySelector("#search-input").value    = "";
  renderCurrentView();
}

function renderCurrentView() {
  let events = filterEventsByCategory(eventsArray, currentCategory, categoryMatchCallback);

  // apply search
  if (currentSearch.trim()) {
    const q = currentSearch.toLowerCase();
    events = events.filter(e => e.name.toLowerCase().includes(q) || e.location.toLowerCase().includes(q));
  }
  renderEvents(events);
}


// ─────────────────────────────────────────────────────────────────
// TASK 8: keydown — live search
// ─────────────────────────────────────────────────────────────────
document.addEventListener("keydown", (e) => {
  const input = document.querySelector("#search-input");
  if (document.activeElement === input) {
    setTimeout(() => {
      currentSearch = input.value;
      renderCurrentView();
    }, 0);
  }
  // Escape clears search
  if (e.key === "Escape") {
    resetFilters();
  }
});

function handleSearchBtn() {
  currentSearch = document.querySelector("#search-input").value;
  renderCurrentView();
}


// ─────────────────────────────────────────────────────────────────
// TASK 9: Async JS — fetch mock API with Promise + async/await
// Simulates fetching from a JSON endpoint
// ─────────────────────────────────────────────────────────────────

// Simulated mock API (returns a promise like a real fetch)
function mockFetchEvents() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ status: 200, data: eventsArray.map(e => e.getSummary()) });
    }, 800);
  });
}

// Promise chain style (.then/.catch)
function loadEventsWithPromise() {
  const spinner = document.querySelector("#loading-spinner");
  spinner.classList.remove("hidden");

  mockFetchEvents()
    .then((response) => {
      debugLog(`API response (Promise): ${response.data.length} events loaded.`, "log-info");
      renderCurrentView();
    })
    .catch((err) => {
      debugLog(`Fetch error: ${err}`, "log-error");
    })
    .finally(() => {
      spinner.classList.add("hidden");
    });
}

// Async/Await rewrite + loading spinner
async function loadEventsAsync() {
  const spinner = document.querySelector("#loading-spinner");
  spinner.classList.remove("hidden");
  debugLog("⏳ Fetching events from mock API…", "log-info");

  try {
    const response = await mockFetchEvents();   // await the promise
    debugLog(`✔ Events loaded via async/await: ${response.data.length} events`, "log-ok");
    renderCurrentView();
  } catch (err) {
    debugLog(`Async fetch error: ${err}`, "log-error");
  } finally {
    spinner.classList.add("hidden");
  }
}


// ─────────────────────────────────────────────────────────────────
// TASK 10: Modern JS — destructuring, default params, spread
// ─────────────────────────────────────────────────────────────────

// Destructuring event details
function displayEventDetails(event) {
  const { name, category, location, seats } = event;   // destructuring
  return `${name} (${category}) at ${location} — ${seats} seats`;
}

// Default parameters
function greetUser(name = "Guest", role = "Visitor") {
  return `Hello, ${name}! Role: ${role}`;
}

// Spread: clone event list before filtering (already used in getFilteredEvents)


// ─────────────────────────────────────────────────────────────────
// TASK 11: Working with Forms — capture, validate, preventDefault
// ─────────────────────────────────────────────────────────────────
function populateEventDropdown() {
  const select = document.querySelector("#reg-event");
  const current = select.value;
  select.innerHTML = '<option value="">-- Choose an event --</option>';

  // Task 6: filter for valid events, map to option elements
  eventsArray
    .filter(isValidEvent)
    .map(e => {
      const opt = document.createElement("option");
      opt.value = e.id;
      opt.textContent = `${e.emoji} ${e.name} (${e.seats} seats)`;
      return opt;
    })
    .forEach(opt => select.appendChild(opt));

  if (current) select.value = current;
}

function submitRegistration() {
  // Task 11: capture using form.elements
  const form    = document.querySelector("#register-form");
  const name    = form.elements["reg-name"].value.trim();
  const email   = form.elements["reg-email"].value.trim();
  const eventId = parseInt(form.elements["reg-event"].value);

  // Task 11: Validate inputs inline
  let valid = true;

  const clearErr = (id) => document.querySelector(id).textContent = "";
  const setErr   = (id, msg) => { document.querySelector(id).textContent = msg; valid = false; };
  const setInputErr = (id) => document.querySelector(id).classList.add("error");
  const clearInputErr = (id) => document.querySelector(id).classList.remove("error");

  ["#reg-name","#reg-email","#reg-event"].forEach(id => clearInputErr(id));
  ["#err-name","#err-email","#err-event"].forEach(id => clearErr(id));

  if (!name)                              { setErr("#err-name",  "Name is required.");     setInputErr("#reg-name");  }
  if (!email || !email.includes("@"))     { setErr("#err-email", "Valid email required."); setInputErr("#reg-email"); }
  if (!eventId)                           { setErr("#err-event", "Please select an event."); setInputErr("#reg-event"); }

  if (!valid) {
    debugLog("⚠ Form validation failed. Please fix errors.", "log-warn");
    return;
  }

  // Simulate preventDefault (handled by type="button", not submit)
  debugLog(`📋 Form submitted — Name: ${name}, Email: ${email}, EventID: ${eventId}`, "log-info");

  // Task 12: POST to mock API
  sendRegistrationToAPI({ name, email, eventId });
}


// ─────────────────────────────────────────────────────────────────
// TASK 12: AJAX & Fetch API — POST user data to mock API
// ─────────────────────────────────────────────────────────────────
async function sendRegistrationToAPI({ name, email, eventId }) {
  const status = document.querySelector("#form-status");
  status.className = "form-status";
  status.classList.remove("hidden");
  status.textContent = "⏳ Submitting registration…";

  debugLog("→ Sending POST to /api/register …", "log-info");
  debugLog(`  Payload: { name: "${name}", email: "${email}", eventId: ${eventId} }`, "log-info");

  // Task 12: setTimeout to simulate delayed server response
  await new Promise(resolve => setTimeout(resolve, 1200));

  try {
    // Simulated fetch (real fetch is commented so it works offline)
    /* const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, eventId })
      }); */

    // Mock success
    const mockResponse = { ok: true, json: async () => ({ message: "Registered successfully!" }) };

    if (!mockResponse.ok) throw new Error("Server returned an error.");

    const data = await mockResponse.json();
    debugLog(`✔ Server response: ${data.message}`, "log-ok");

    const result = registerUser(eventId, name);
    if (result.success) {
      status.classList.add("success");
      status.textContent = `✓ ${name}, you're registered for "${result.event.name}"!`;
      document.querySelector("#register-form").reset();
      renderCurrentView();
    } else {
      throw new Error(result.message);
    }

  } catch (err) {
    status.classList.add("error");
    status.textContent = `✗ Registration failed: ${err.message}`;
    debugLog(`✖ Fetch error: ${err.message}`, "log-error");
  }
}


// ─────────────────────────────────────────────────────────────────
// TASK 13: Debug console helper
// ─────────────────────────────────────────────────────────────────
function debugLog(message, cls = "") {
  const log = document.querySelector("#debug-log");
  if (!log) return;
  const p = document.createElement("p");
  const ts = new Date().toLocaleTimeString();
  p.className = cls;
  p.textContent = `[${ts}] ${message}`;
  log.appendChild(p);
  log.scrollTop = log.scrollHeight;
  console.log(`[DEBUG] ${message}`);
}

function clearDebugLog() {
  document.querySelector("#debug-log").innerHTML = "";
}


// ─────────────────────────────────────────────────────────────────
// TASK 14: jQuery — click handler + fadeIn/fadeOut
// ─────────────────────────────────────────────────────────────────
function initJQuery() {
  if (typeof $ === "undefined") return;

  // jQuery click on category filter
  $("#category-filter").on("change", function () {
    const val = $(this).val();
    // fadeOut cards, then filter, then fadeIn
    $(".event-card").fadeOut(200, () => {
      filterByCategory(val);
      // fadeIn after re-render
      setTimeout(() => $(".event-card").fadeIn(300), 50);
    });
  });

  debugLog("jQuery initialized — using $('#category-filter') and .fadeIn/.fadeOut", "log-info");

  // jQuery benefit note logged to debug
  debugLog("ℹ jQuery reduces DOM boilerplate. React/Vue adds components, state, and reactivity for large apps.", "log-info");
}


// ─────────────────────────────────────────────────────────────────
// STATS UPDATE
// ─────────────────────────────────────────────────────────────────
function updateStats() {
  const valid = eventsArray.filter(isValidEvent);
  const registered = eventsArray.filter(e => e.registered).length;
  const categories = [...new Set(valid.map(e => e.category))].length;

  document.querySelector("#total-events").textContent    = valid.length;
  document.querySelector("#total-registered").textContent = registered;
  document.querySelector("#total-categories").textContent = categories;
}


// ─────────────────────────────────────────────────────────────────
// TASK PANEL — render task reference
// ─────────────────────────────────────────────────────────────────
const TASKS = [
  { n:"01", title:"Basics & Setup",           desc:"console.log, alert on DOMContentLoaded, external script" },
  { n:"02", title:"Data Types & Operators",   desc:"const/let, template literals, ++/-- seat management" },
  { n:"03", title:"Conditionals & Loops",     desc:"if-else date/seat filter, forEach loop, try-catch errors" },
  { n:"04", title:"Functions & Closures",     desc:"addEvent(), registerUser(), filterEvents(), closure tracker" },
  { n:"05", title:"Objects & Prototypes",     desc:"Event class, prototype.checkAvailability(), Object.entries()" },
  { n:"06", title:"Arrays & Methods",         desc:".push() to build list, .filter() for music, .map() for cards" },
  { n:"07", title:"DOM Manipulation",         desc:"querySelector, createElement, dynamic card rendering" },
  { n:"08", title:"Event Handling",           desc:"onclick register, onchange category, keydown live search" },
  { n:"09", title:"Async JS",                 desc:"Mock fetch, .then/.catch chain, async/await + spinner" },
  { n:"10", title:"Modern JS (ES6+)",         desc:"let/const, destructuring, default params, spread clone" },
  { n:"11", title:"Working with Forms",       desc:"form.elements capture, preventDefault, inline validation" },
  { n:"12", title:"AJAX & Fetch API",         desc:"POST to mock API, success/failure message, setTimeout delay" },
  { n:"13", title:"Debugging & Testing",      desc:"Debug console log panel, step-by-step fetch logging" },
  { n:"14", title:"jQuery & Frameworks",      desc:"$().click, .fadeIn/.fadeOut, React/Vue framework note" },
];

function renderTaskPanel() {
  const grid = document.querySelector("#task-grid");
  TASKS.forEach(t => {
    const div = document.createElement("div");
    div.className = "task-item";
    div.innerHTML = `
      <span class="task-num">${t.n}</span>
      <div class="task-info">
        <span class="task-title">${t.title}</span>
        <span class="task-desc">${t.desc}</span>
      </div>`;
    grid.appendChild(div);
  });
}


// ─────────────────────────────────────────────────────────────────
// INIT
// ─────────────────────────────────────────────────────────────────
function initPortal() {
  renderTaskPanel();
  populateEventDropdown();

  // Task 9: load events via async/await (simulated API)
  loadEventsAsync();

  // Task 14: jQuery init
  initJQuery();

  // Initial debug logs
  debugLog("Portal initialized. All 14 tasks active.", "log-ok");
  debugLog(`Loaded ${eventsArray.length} events (${eventsArray.filter(isValidEvent).length} active).`, "log-info");
  debugLog(`Task 5 — Event class with prototype.checkAvailability()`, "log-info");
  debugLog(`Task 10 — greetUser('Alex'): ${greetUser('Alex')}`, "log-info");
  debugLog(`Task 10 — Destructure first event: ${displayEventDetails(eventsArray[0])}`, "log-info");
}