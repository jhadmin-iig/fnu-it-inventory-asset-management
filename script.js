const STORE_KEY = "fnuItamSystemV1";
const AUTH_KEY = "fnuItamAdminSession";
const ADMIN_USER = {
  username: "admin",
  password: "FNU@2026",
  name: "FNU IT Administrator"
};

const campuses = [
  "Nasinu", "Samabula", "Labasa", "Lautoka", "Natabua", "Namaka", "Ba", "Nadi", "Koronivia",
  "Derrick", "Nabua", "Tamavua", "Maritime Academy", "Nadroga", "Taveuni", "Savusavu", "Rakiraki", "Lakeba"
];

const statuses = [
  "Requested", "Approved", "Ordered", "Received", "Tagged", "Configured", "Available", "Assigned",
  "In Use", "In Repair", "Pending Warranty", "Loaned", "Reserved", "Transferred", "Missing",
  "Lost", "Stolen", "Damaged", "Obsolete", "End of Life", "Pending Disposal", "Disposed"
];

const seed = {
  assets: [
    asset("FNU-NAS-PRN-2026-0024", "HP LaserJet Enterprise M611", "Non-fixed serialised printer", "CNB9K42F7L", "Nasinu", "ICT Building", "Network Lab Row 2", "Division of IT Services", "Network Lab", "Assigned", "Good", "Datec Fiji", "PO-2026-0045", 4200, "2026-11-18", "2029-11-18", "2026-05-20"),
    asset("FNU-SAM-PC-2025-1842", "Dell OptiPlex 7010", "Fixed asset desktop", "7XJ82Z3", "Samabula", "Admin Block", "Finance Office", "Finance", "Mere Tawake", "In Use", "Good", "VirtualFlex", "PO-2025-0871", 2850, "2027-02-04", "2030-02-04", "2026-05-18"),
    asset("FNU-LBK-SW-2024-0217", "Cisco Catalyst 9300", "Fixed asset network equipment", "FOC2741Y8QM", "Labasa", "Main Building", "MDF Rack A RU 12", "Infrastructure", "Infrastructure Team", "Available", "New", "Vodafone Fiji", "PO-2024-0632", 17800, "2028-07-22", "2031-07-22", "2026-04-16"),
    asset("FNU-LTK-LAP-2023-1903", "Lenovo ThinkPad E14", "Non-fixed laptop or mobile kit", "PF4Z9F2M", "Lautoka", "ITS Office", "Loan Pool Shelf 3", "Student Support", "Student Loan Pool", "In Repair", "Damaged", "Datec Fiji", "PO-2023-0418", 3100, "2026-09-09", "2028-09-09", "2026-05-02"),
    asset("FNU-NAS-PRJ-2022-0774", "Epson EB-L260F Projector", "Fixed asset teaching equipment", "X8MZ021044", "Nasinu", "Lecture Theatre", "LT2 Ceiling Mount", "Teaching Spaces", "Estates and ITS", "Assigned", "Fair", "Office Products Fiji", "PO-2022-0129", 6900, "2026-01-31", "2027-01-31", "2026-03-12"),
    asset("FNU-NAT-AP-2026-0088", "Aruba AP-515", "Fixed asset network equipment", "TW6H3K2281", "Natabua", "Library", "Level 2 Ceiling Grid B", "Infrastructure", "Regional IT West", "Pending Warranty", "Faulty", "Blue Arc", "PO-2026-0028", 1900, "2028-06-02", "2030-06-02", "2026-06-02"),
    asset("FNU-NAM-SWLIC-2026-0041", "Adobe Creative Cloud Licence", "Software licence", "ADOBE-EDU-500", "Namaka", "Creative Media Lab", "Software Pool", "College of Humanities", "Creative Media Lab", "Assigned", "Compliant", "Adobe Education", "PO-2026-0175", 26000, "2026-11-30", "2026-11-30", "2026-05-30"),
    asset("FNU-NAS-CON-2026-0312", "HP 147A Toner", "Consumable or spare part", "BATCH-TN-147A-061", "Nasinu", "Central IT Store", "Shelf T2", "IT Stores", "IT Store Officer", "Reserved", "New", "Carpenters Office", "PO-2026-0204", 450, "2027-06-30", "2027-06-30", "2026-06-01")
  ],
  locations: [
    loc("Nasinu", "ICT Building", "Ground Floor", "Network Lab", "Lab"),
    loc("Nasinu", "Central IT Store", "Ground Floor", "Shelf T2", "Store"),
    loc("Samabula", "Admin Block", "Level 1", "Finance Office", "Office"),
    loc("Labasa", "Main Building", "Ground Floor", "MDF Rack A", "Network Room"),
    loc("Lautoka", "ITS Office", "Ground Floor", "Loan Pool Shelf 3", "Store")
  ],
  stock: [
    stock("Central IT Store", "Laptops", 28, 10),
    stock("Nasinu Store", "Toners", 7, 12),
    stock("West Store", "Wireless APs", 14, 6),
    stock("North Store", "SSD spare parts", 4, 8),
    stock("Maritime Store", "Portable projectors", 3, 2)
  ],
  licences: [
    licence("Microsoft 365", "Microsoft", 8500, 6970, "2026-09-30"),
    licence("Adobe Creative Cloud", "Adobe Education", 500, 318, "2026-11-30"),
    licence("Endpoint AV / EDR", "Security Vendor", 9200, 8874, "2027-03-31"),
    licence("Engineering Lab Software", "Autodesk", 120, 130, "2026-08-15")
  ],
  receiving: [
    rec("PO-2026-0045", "Datec Fiji", "HP LaserJet Enterprise M611", 1, "Allocated to Store"),
    rec("PO-2026-0028", "Blue Arc", "Aruba AP-515", 25, "Tagged")
  ],
  workflows: [],
  audits: [],
  storeMovements: [],
  systemLog: []
};

let db = loadDb();
let activePage = "dashboard";
let activeAssetFilter = "All";
let selectedAssetId = db.assets[0]?.id || "";
let currentUser = loadSession();

function asset(tag, name, category, serial, campus, building, room, department, custodian, status, condition, supplier, po, cost, warrantyEnd, replacementDue, lastVerified) {
  return {
    id: uid(),
    tag, name, category, serial, campus, building, room, department, custodian, status, condition,
    supplier, po, cost, warrantyEnd, replacementDue, lastVerified,
    createdAt: today(),
    notes: "",
    archived: false
  };
}

function loc(campus, building, floor, room, type) {
  return { id: uid(), campus, building, floor, room, type };
}

function stock(store, item, quantity, minimum) {
  return { id: uid(), store, item, quantity, minimum };
}

function licence(name, vendor, purchased, assigned, expiry) {
  return { id: uid(), name, vendor, purchased, assigned, expiry };
}

function rec(po, supplier, item, quantity, status) {
  return { id: uid(), po, supplier, item, quantity, status, date: today() };
}

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

function loadDb() {
  const saved = localStorage.getItem(STORE_KEY);
  return saved ? JSON.parse(saved) : structuredClone(seed);
}

function loadSession() {
  const saved = sessionStorage.getItem(AUTH_KEY);
  return saved ? JSON.parse(saved) : null;
}

function saveSession(user) {
  currentUser = user;
  sessionStorage.setItem(AUTH_KEY, JSON.stringify(user));
}

function saveDb(message) {
  if (message) {
    db.systemLog.unshift({ id: uid(), date: new Date().toLocaleString(), message });
    db.systemLog = db.systemLog.slice(0, 80);
  }
  localStorage.setItem(STORE_KEY, JSON.stringify(db));
  renderAll();
}

function $(selector) {
  return document.querySelector(selector);
}

function $all(selector) {
  return Array.from(document.querySelectorAll(selector));
}

function showToast(message) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => toast.classList.remove("show"), 2800);
}

function setPage(page) {
  if (!currentUser) return;
  activePage = page;
  $all("[data-page-panel]").forEach((panel) => panel.classList.toggle("active", panel.dataset.pagePanel === page));
  $all("[data-page]").forEach((button) => button.classList.toggle("active", button.dataset.page === page));
  $("#pageTitle").textContent = $(`[data-page="${page}"]`)?.textContent || "Dashboard";
  window.location.hash = page;
}

function fillSelect(select, options, includeAll) {
  select.innerHTML = `${includeAll ? `<option>${includeAll}</option>` : ""}${options.map((item) => `<option>${item}</option>`).join("")}`;
}

function locationText(assetRecord) {
  return `${assetRecord.campus} / ${assetRecord.building} / ${assetRecord.room}`;
}

function filteredAssets() {
  const term = $("#searchInput").value.trim().toLowerCase();
  const campus = $("#campusFilter").value;
  const status = $("#statusFilter").value;
  return db.assets.filter((item) => {
    const haystack = Object.values(item).join(" ").toLowerCase();
    const campusOk = campus === "All campuses" || item.campus === campus;
    const statusOk = status === "All statuses" || item.status === status;
    const typeOk = activeAssetFilter === "All"
      || (activeAssetFilter === "Serialised" && item.serial && item.category !== "Software licence")
      || item.category.toLowerCase().includes(activeAssetFilter.toLowerCase());
    return !item.archived && campusOk && statusOk && typeOk && haystack.includes(term);
  });
}

function statusClass(status) {
  if (["In Repair", "Pending Warranty", "Damaged"].includes(status)) return "repair";
  if (["Available", "Reserved"].includes(status)) return "stock";
  if (["Missing", "Lost", "Stolen", "Disposed", "Pending Disposal"].includes(status)) return "risk";
  return "";
}

function renderDashboard() {
  const total = db.assets.filter((item) => !item.archived).length;
  const assigned = db.assets.filter((item) => ["Assigned", "In Use"].includes(item.status)).length;
  const exceptions = db.assets.filter((item) => ["Missing", "Damaged", "Pending Warranty", "In Repair"].includes(item.status)).length;
  const warranty = db.assets.filter((item) => daysUntil(item.warrantyEnd) <= 90).length;
  const lowStock = db.stock.filter((item) => Number(item.quantity) < Number(item.minimum)).length;
  const pending = db.workflows.filter((item) => item.status !== "Approved" && item.status !== "Closed").length;

  $("#metricsGrid").innerHTML = [
    ["Total assets", total, "Fixed, non-fixed, serialised, software, spares"],
    ["Assigned / in use", assigned, "Staff, labs, departments, projects"],
    ["Audit exceptions", exceptions, "Missing, damaged, warranty, repair"],
    ["Warranty due", warranty, "Within 90 days or expired"],
    ["Low stock", lowStock, "Stores below minimum level"],
    ["Pending approvals", pending, "Transfers, repair, disposal"]
  ].map(([label, value, note], index) => `
    <article class="metric ${index === 2 ? "alert" : index === 3 || index === 4 ? "warning" : ""}">
      <span>${label}</span><strong>${value}</strong><small>${note}</small>
    </article>
  `).join("");

  $("#recentActivity").innerHTML = db.systemLog.slice(0, 8).map((item) => `
    <div><strong>${item.date}</strong><span>${item.message}</span></div>
  `).join("") || `<div><strong>Ready</strong><span>No activity recorded yet.</span></div>`;

  const campusCounts = campuses.map((campus) => [campus, db.assets.filter((assetItem) => assetItem.campus === campus && !assetItem.archived).length]);
  const max = Math.max(...campusCounts.map(([, count]) => count), 1);
  $("#campusBars").innerHTML = campusCounts.map(([campus, count]) => `
    <div class="bar-row"><span>${campus}</span><div><i style="width:${(count / max) * 100}%"></i></div><b>${count}</b></div>
  `).join("");
}

function daysUntil(dateText) {
  return Math.ceil((new Date(dateText) - new Date()) / 86400000);
}

function renderAssets() {
  const items = filteredAssets();
  $("#assetRows").innerHTML = items.map((item) => `
    <tr class="${item.id === selectedAssetId ? "selected-row" : ""}">
      <td><strong>${item.tag}</strong><span>${item.name}</span></td>
      <td>${item.category}</td>
      <td>${item.serial}</td>
      <td>${locationText(item)}</td>
      <td>${item.custodian}</td>
      <td><span class="badge ${statusClass(item.status)}">${item.status}</span></td>
      <td>${item.condition}</td>
      <td>${item.warrantyEnd}</td>
      <td class="row-actions">
        <button data-asset-action="view" data-id="${item.id}">View</button>
        <button data-asset-action="edit" data-id="${item.id}">Edit</button>
        <button data-asset-action="transfer" data-id="${item.id}">Transfer</button>
        <button data-asset-action="dispose" data-id="${item.id}">Dispose</button>
      </td>
    </tr>
  `).join("") || `<tr><td class="empty-row" colspan="9">No matching assets.</td></tr>`;

  renderProfile();
  syncAssetSelects();
}

function renderProfile() {
  const item = db.assets.find((assetItem) => assetItem.id === selectedAssetId) || filteredAssets()[0];
  if (!item) {
    $("#assetProfile").innerHTML = `<p class="help-text">Select or create an asset record.</p>`;
    return;
  }
  selectedAssetId = item.id;
  const warrantyState = daysUntil(item.warrantyEnd) < 0 ? "Expired" : `${daysUntil(item.warrantyEnd)} days remaining`;
  $("#assetProfile").innerHTML = `
    <div class="profile-title"><strong>${item.tag}</strong><span>${item.name}</span></div>
    <dl>
      <dt>Serial</dt><dd>${item.serial}</dd>
      <dt>Category</dt><dd>${item.category}</dd>
      <dt>Location</dt><dd>${locationText(item)}</dd>
      <dt>Department</dt><dd>${item.department}</dd>
      <dt>Custodian</dt><dd>${item.custodian}</dd>
      <dt>Status</dt><dd>${item.status}</dd>
      <dt>Condition</dt><dd>${item.condition}</dd>
      <dt>Supplier / PO</dt><dd>${item.supplier} / ${item.po}</dd>
      <dt>Cost</dt><dd>FJD ${Number(item.cost).toLocaleString()}</dd>
      <dt>Warranty</dt><dd>${item.warrantyEnd} (${warrantyState})</dd>
      <dt>Last verified</dt><dd>${item.lastVerified}</dd>
      <dt>QR profile</dt><dd>${item.tag}</dd>
    </dl>
  `;
}

function renderLocations() {
  $("#locationList").innerHTML = db.locations.map((item) => `
    <div class="record-row"><strong>${item.campus} / ${item.building}</strong><span>${item.floor} / ${item.room} / ${item.type}</span></div>
  `).join("");
  $("#locationSummary").innerHTML = campuses.slice(0, 8).map((campus) => {
    const count = db.locations.filter((item) => item.campus === campus).length;
    return `<div><strong>${count}</strong><span>${campus}</span></div>`;
  }).join("");
}

function renderReceiving() {
  $("#receivingList").innerHTML = db.receiving.map((item) => `
    <div class="record-row"><strong>${item.po} - ${item.item}</strong><span>${item.supplier}, qty ${item.quantity}, ${item.status}, ${item.date}</span></div>
  `).join("");
  $("#receivingSteps").innerHTML = ["Purchase request approved", "PO matched", "Delivery checked", "Tags generated", "Warranty attached", "Configured", "Allocated to store"].map((step, index) => `
    <div class="step ${index < 5 ? "done" : ""}"><span>${index + 1}</span>${step}</div>
  `).join("");
}

function renderStores() {
  $("#stockList").innerHTML = db.stock.map((item) => `
    <div class="stock-row ${Number(item.quantity) < Number(item.minimum) ? "low" : ""}">
      <strong>${item.store}</strong><span>${item.item}</span><b>${item.quantity}</b><small>Min ${item.minimum}</small>
    </div>
  `).join("");
  $("#storeMovementForm select[name='stockId']").innerHTML = db.stock.map((item) => `<option value="${item.id}">${item.store} - ${item.item}</option>`).join("");
  $("#storeMovementList").innerHTML = db.storeMovements.slice(0, 10).map((item) => `
    <div class="record-row"><strong>${item.type}: ${item.item}</strong><span>${item.quantity} by ${item.receiver} on ${item.date}</span></div>
  `).join("") || `<p class="help-text">No store movements yet.</p>`;
}

function renderWorkflows() {
  $("#workflowList").innerHTML = db.workflows.map((item) => `
    <div class="record-row">
      <strong>${item.type}: ${item.assetTag}</strong>
      <span>${item.status} - ${item.detail} (${item.date})</span>
    </div>
  `).join("") || `<p class="help-text">No workflow records yet.</p>`;
}

function renderAudit() {
  $("#auditList").innerHTML = db.audits.slice(0, 20).map((item) => `
    <div class="record-row"><strong>${item.tag} - ${item.result}</strong><span>${item.auditor}, ${item.date}. ${item.notes || ""}</span></div>
  `).join("") || `<p class="help-text">No audit scans yet.</p>`;
  const verified = db.audits.filter((item) => item.result === "Verified").length;
  const exceptions = db.audits.filter((item) => item.result !== "Verified").length;
  $("#auditCards").innerHTML = [
    ["Verified scans", verified],
    ["Exceptions", exceptions],
    ["Assets not verified", db.assets.filter((item) => item.lastVerified < "2026-05-01").length],
    ["Total audit records", db.audits.length]
  ].map(([label, value]) => `<div><strong>${value}</strong><span>${label}</span></div>`).join("");
}

function renderLicences() {
  $("#licenceList").innerHTML = db.licences.map((item) => `
    <div class="record-row"><strong>${item.name}</strong><span>${item.vendor}, ${item.assigned}/${item.purchased} assigned, expiry ${item.expiry}</span></div>
  `).join("");
  $("#licenceBars").innerHTML = db.licences.map((item) => {
    const use = Math.round((Number(item.assigned) / Math.max(Number(item.purchased), 1)) * 100);
    const label = use > 100 ? "Overused" : use > 85 ? "Tight" : "Compliant";
    return `<div><span>${item.name}</span><meter min="0" max="120" value="${use}"></meter><b>${use}%</b><small>${label}</small></div>`;
  }).join("");
}

function renderReports() {
  $("#reportGrid").innerHTML = [
    ["Asset Register", `${db.assets.length} records with tag, serial, custodian, warranty, PO, supplier, and lifecycle.`],
    ["Campus Inventory", "Assets grouped by campus, building, room, department, and custodian."],
    ["Warranty Expiry", `${db.assets.filter((item) => daysUntil(item.warrantyEnd) <= 90).length} assets due within 90 days or expired.`],
    ["Missing / Damaged", `${db.assets.filter((item) => ["Missing", "Damaged"].includes(item.status)).length} exception records.`],
    ["Disposal", `${db.workflows.filter((item) => item.type === "Disposal").length} disposal and write-off workflow records.`],
    ["Software Licence", `${db.licences.length} software entitlement records.`],
    ["Stock Level", `${db.stock.filter((item) => Number(item.quantity) < Number(item.minimum)).length} low-stock items.`],
    ["Audit Trail", `${db.systemLog.length} system activity log records.`]
  ].map(([title, detail]) => `<div><strong>${title}</strong><span>${detail}</span></div>`).join("");
}

function renderAdmin() {
  const roles = [
    ["System Administrator", "Full system configuration and data recovery"],
    ["Director IT Services", "University dashboards, disposal and write-off approvals"],
    ["Manager IT Client Services", "Operational visibility and approval oversight"],
    ["IT Inventory Officer", "Asset creation, update, barcode, import, reporting"],
    ["IT Store Officer", "Receiving, issuing, stock returns, consumables"],
    ["Regional IT Leader", "Region and campus transfer approvals"],
    ["Campus IT Technician", "Assigned campus updates and audit scans"],
    ["Auditor", "Read-only audit and exception reports"]
  ];
  $("#roleGrid").innerHTML = roles.map(([role, access]) => `<div><strong>${role}</strong><span>${access}</span></div>`).join("");
  $("#systemLog").innerHTML = db.systemLog.map((item) => `<div class="record-row"><strong>${item.date}</strong><span>${item.message}</span></div>`).join("") || `<p class="help-text">No activity recorded yet.</p>`;
}

function renderAll() {
  renderDashboard();
  renderAssets();
  renderLocations();
  renderReceiving();
  renderStores();
  renderWorkflows();
  renderAudit();
  renderLicences();
  renderReports();
  renderAdmin();
}

function syncAssetSelects() {
  const options = db.assets.filter((item) => !item.archived).map((item) => `<option value="${item.id}">${item.tag} - ${item.name}</option>`).join("");
  $all("select[name='assetId']").forEach((select) => {
    const old = select.value;
    select.innerHTML = options;
    if (old) select.value = old;
  });
}

function bindEvents() {
  $("#loginForm").addEventListener("submit", handleLogin);
  $("#logoutBtn").addEventListener("click", handleLogout);

  $all("[data-page]").forEach((button) => button.addEventListener("click", () => setPage(button.dataset.page)));
  $all("[data-page-jump]").forEach((button) => button.addEventListener("click", () => setPage(button.dataset.pageJump)));

  $("#newAssetBtn").addEventListener("click", () => {
    setPage("assets");
    clearAssetForm();
    $("#assetForm [name='tag']").focus();
  });

  $("#scanBtn").addEventListener("click", () => {
    const tag = prompt("Enter or scan asset tag / serial number");
    if (!tag) return;
    const item = db.assets.find((assetItem) => assetItem.tag.toLowerCase() === tag.toLowerCase() || assetItem.serial.toLowerCase() === tag.toLowerCase());
    if (!item) return showToast("No asset matched that tag or serial number.");
    selectedAssetId = item.id;
    $("#searchInput").value = item.tag;
    setPage("assets");
    renderAssets();
    showToast(`Opened ${item.tag}.`);
  });

  $("#importBtn").addEventListener("click", () => $("#fileInput").click());
  $("#fileInput").addEventListener("change", importFile);
  $("#exportAllBtn").addEventListener("click", downloadBackup);
  $("#downloadBackupBtn").addEventListener("click", downloadBackup);
  $("#exportAssetsBtn").addEventListener("click", () => exportCsv("fnu-assets.csv", db.assets));
  $("#exportAuditBtn").addEventListener("click", () => exportCsv("fnu-audit.csv", db.audits));
  $("#printBtn").addEventListener("click", () => window.print());
  $("#resetDemoBtn").addEventListener("click", () => {
    if (!confirm("Reset all local records to demo data?")) return;
    db = structuredClone(seed);
    saveDb("Demo data reset");
    showToast("Demo data restored.");
  });

  $("#assetTypeTabs").addEventListener("click", (event) => {
    if (!event.target.matches("button")) return;
    $all("#assetTypeTabs button").forEach((button) => button.classList.remove("selected"));
    event.target.classList.add("selected");
    activeAssetFilter = event.target.dataset.filter;
    renderAssets();
  });

  $("#searchInput").addEventListener("input", renderAssets);
  $("#campusFilter").addEventListener("change", renderAssets);
  $("#statusFilter").addEventListener("change", renderAssets);

  $("#assetRows").addEventListener("click", (event) => {
    const button = event.target.closest("button[data-asset-action]");
    if (!button) return;
    handleAssetAction(button.dataset.assetAction, button.dataset.id);
  });

  $("#assetForm").addEventListener("submit", saveAssetForm);
  $("#clearAssetFormBtn").addEventListener("click", clearAssetForm);
  $("#locationForm").addEventListener("submit", addLocation);
  $("#receivingForm").addEventListener("submit", addReceiving);
  $("#stockForm").addEventListener("submit", addStock);
  $("#storeMovementForm").addEventListener("submit", addStoreMovement);
  $("#transferForm").addEventListener("submit", addTransfer);
  $("#maintenanceForm").addEventListener("submit", addMaintenance);
  $("#disposalForm").addEventListener("submit", addDisposal);
  $("#auditForm").addEventListener("submit", addAudit);
  $("#licenceForm").addEventListener("submit", addLicence);
}

function handleLogin(event) {
  event.preventDefault();
  const data = Object.fromEntries(new FormData(event.target));
  const usernameOk = data.username.trim().toLowerCase() === ADMIN_USER.username;
  const passwordOk = data.password === ADMIN_USER.password;
  if (!usernameOk || !passwordOk) {
    showToast("Invalid admin username or password.");
    return;
  }
  saveSession({ username: ADMIN_USER.username, name: ADMIN_USER.name, role: "System Administrator", signedInAt: new Date().toISOString() });
  db.systemLog.unshift({ id: uid(), date: new Date().toLocaleString(), message: `${ADMIN_USER.name} signed in` });
  localStorage.setItem(STORE_KEY, JSON.stringify(db));
  applyAuthState();
  renderAll();
  setPage((window.location.hash || "#dashboard").replace("#", ""));
  showToast("Signed in as administrator.");
}

function handleLogout() {
  db.systemLog.unshift({ id: uid(), date: new Date().toLocaleString(), message: `${currentUser?.name || "Admin"} signed out` });
  localStorage.setItem(STORE_KEY, JSON.stringify(db));
  sessionStorage.removeItem(AUTH_KEY);
  currentUser = null;
  applyAuthState();
  showToast("Signed out.");
}

function applyAuthState() {
  const signedIn = Boolean(currentUser);
  $("#loginScreen").classList.toggle("hidden", signedIn);
  $("#appShell").classList.toggle("is-locked", !signedIn);
  $("#signedInUser").textContent = currentUser?.name || "Not signed in";
  document.body.classList.toggle("locked", !signedIn);
  if (!signedIn) {
    $("#loginForm [name='password']").value = "";
    $("#loginForm [name='username']").focus();
  }
}

function handleAssetAction(action, id) {
  const item = db.assets.find((assetItem) => assetItem.id === id);
  if (!item) return;
  selectedAssetId = id;
  if (action === "edit") fillAssetForm(item);
  if (action === "view") renderAssets();
  if (action === "transfer") {
    setPage("workflows");
    $("#transferForm [name='assetId']").value = id;
  }
  if (action === "dispose") {
    setPage("workflows");
    $("#disposalForm [name='assetId']").value = id;
  }
  renderProfile();
}

function fillAssetForm(item) {
  const form = $("#assetForm");
  Object.entries(item).forEach(([key, value]) => {
    if (form.elements[key]) form.elements[key].value = value;
  });
  $("#assetFormTitle").textContent = "Edit Asset";
}

function clearAssetForm() {
  $("#assetForm").reset();
  $("#assetForm [name='id']").value = "";
  $("#assetForm [name='tag']").value = nextTag();
  $("#assetForm [name='warrantyEnd']").value = "2029-12-31";
  $("#assetForm [name='replacementDue']").value = "2031-12-31";
  $("#assetForm [name='lastVerified']").value = today();
  $("#assetFormTitle").textContent = "Asset Capture";
}

function nextTag() {
  return `FNU-NAS-IT-2026-${String(db.assets.length + 1).padStart(4, "0")}`;
}

function saveAssetForm(event) {
  event.preventDefault();
  const data = Object.fromEntries(new FormData(event.target));
  const duplicateTag = db.assets.find((item) => item.tag === data.tag && item.id !== data.id);
  const duplicateSerial = db.assets.find((item) => item.serial === data.serial && item.id !== data.id);
  if (duplicateTag) return showToast("Asset tag must be unique.");
  if (duplicateSerial) return showToast("Serial number must be unique.");
  if (new Date(data.warrantyEnd) < new Date()) showToast("Warranty date is already expired. Record saved for planning.");

  const existing = db.assets.find((item) => item.id === data.id);
  if (existing) {
    Object.assign(existing, data, { cost: Number(data.cost) });
    selectedAssetId = existing.id;
    saveDb(`Updated asset ${existing.tag}`);
  } else {
    const item = { ...data, id: uid(), cost: Number(data.cost), archived: false, createdAt: today() };
    db.assets.unshift(item);
    selectedAssetId = item.id;
    saveDb(`Created asset ${item.tag}`);
  }
  clearAssetForm();
  showToast("Asset record saved.");
}

function addLocation(event) {
  event.preventDefault();
  const data = Object.fromEntries(new FormData(event.target));
  db.locations.unshift({ ...data, id: uid() });
  event.target.reset();
  saveDb(`Added location ${data.campus} / ${data.room}`);
}

function addReceiving(event) {
  event.preventDefault();
  const data = Object.fromEntries(new FormData(event.target));
  db.receiving.unshift({ ...data, id: uid(), quantity: Number(data.quantity), date: today() });
  event.target.reset();
  saveDb(`Received ${data.quantity} ${data.item} from ${data.supplier}`);
}

function addStock(event) {
  event.preventDefault();
  const data = Object.fromEntries(new FormData(event.target));
  db.stock.unshift({ ...data, id: uid(), quantity: Number(data.quantity), minimum: Number(data.minimum) });
  event.target.reset();
  saveDb(`Saved stock item ${data.item}`);
}

function addStoreMovement(event) {
  event.preventDefault();
  const data = Object.fromEntries(new FormData(event.target));
  const item = db.stock.find((stockItem) => stockItem.id === data.stockId);
  const amount = Number(data.quantity);
  if (!item) return;
  if (data.type === "Issue" && item.quantity < amount) return showToast("Insufficient stock for issue.");
  item.quantity += data.type === "Issue" ? -amount : amount;
  db.storeMovements.unshift({ id: uid(), type: data.type, item: item.item, quantity: amount, receiver: data.receiver, date: today() });
  event.target.reset();
  saveDb(`${data.type} posted for ${item.item}`);
}

function addTransfer(event) {
  event.preventDefault();
  const data = Object.fromEntries(new FormData(event.target));
  const item = db.assets.find((assetItem) => assetItem.id === data.assetId);
  item.campus = data.newCampus;
  item.building = data.newLocation;
  item.room = data.newLocation;
  item.custodian = data.newCustodian;
  item.status = "Transferred";
  db.workflows.unshift({ id: uid(), type: "Transfer", assetTag: item.tag, status: "Pending receiver confirmation", detail: data.reason, date: today() });
  selectedAssetId = item.id;
  event.target.reset();
  saveDb(`Transfer requested for ${item.tag}`);
}

function addMaintenance(event) {
  event.preventDefault();
  const data = Object.fromEntries(new FormData(event.target));
  const item = db.assets.find((assetItem) => assetItem.id === data.assetId);
  item.status = data.status === "Returned" ? "In Use" : "In Repair";
  db.workflows.unshift({ id: uid(), type: "Maintenance", assetTag: item.tag, status: data.status, detail: `${data.ticket}: ${data.fault}`, date: today() });
  event.target.reset();
  saveDb(`Maintenance logged for ${item.tag}`);
}

function addDisposal(event) {
  event.preventDefault();
  const data = Object.fromEntries(new FormData(event.target));
  const item = db.assets.find((assetItem) => assetItem.id === data.assetId);
  item.status = data.approval === "Approved" ? "Disposed" : "Pending Disposal";
  item.archived = data.approval === "Approved";
  db.workflows.unshift({ id: uid(), type: "Disposal", assetTag: item.tag, status: data.approval, detail: `${data.reason}; ${data.method}`, date: today() });
  event.target.reset();
  saveDb(`Disposal workflow submitted for ${item.tag}`);
}

function addAudit(event) {
  event.preventDefault();
  const data = Object.fromEntries(new FormData(event.target));
  const item = db.assets.find((assetItem) => assetItem.tag.toLowerCase() === data.tag.toLowerCase() || assetItem.serial.toLowerCase() === data.tag.toLowerCase());
  if (item) {
    item.lastVerified = today();
    if (data.result === "Missing") item.status = "Missing";
    if (data.result === "Damaged") item.condition = "Damaged";
    if (data.result === "Verified" && item.status === "Missing") item.status = "In Use";
  }
  db.audits.unshift({ id: uid(), tag: data.tag, result: data.result, auditor: data.auditor, notes: data.notes, date: today() });
  event.target.reset();
  saveDb(`Audit result ${data.result} saved for ${data.tag}`);
}

function addLicence(event) {
  event.preventDefault();
  const data = Object.fromEntries(new FormData(event.target));
  db.licences.unshift({ ...data, id: uid(), purchased: Number(data.purchased), assigned: Number(data.assigned) });
  event.target.reset();
  saveDb(`Saved licence ${data.name}`);
}

function exportCsv(filename, records) {
  if (!records.length) return showToast("No records to export.");
  const headers = Object.keys(records[0]);
  const csv = [headers, ...records.map((record) => headers.map((key) => record[key] ?? ""))]
    .map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(","))
    .join("\n");
  download(filename, csv, "text/csv");
}

function downloadBackup() {
  download(`fnu-itam-backup-${today()}.json`, JSON.stringify(db, null, 2), "application/json");
}

function download(filename, content, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
  showToast(`Downloaded ${filename}`);
}

function importFile(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      if (file.name.endsWith(".json")) {
        db = JSON.parse(reader.result);
        saveDb("Imported JSON backup");
      } else {
        importCsvAssets(reader.result);
      }
      showToast("Import complete.");
    } catch (error) {
      showToast("Import failed. Check file format.");
    }
    event.target.value = "";
  };
  reader.readAsText(file);
}

function importCsvAssets(text) {
  const [headerLine, ...lines] = text.trim().split(/\r?\n/);
  const headers = headerLine.split(",").map((item) => item.trim());
  lines.forEach((line) => {
    const values = line.split(",").map((item) => item.trim());
    const record = Object.fromEntries(headers.map((key, index) => [key, values[index] || ""]));
    if (!record.tag || db.assets.some((item) => item.tag === record.tag)) return;
    db.assets.push({ ...asset(record.tag, record.name || "Imported asset", record.category || "Fixed asset desktop", record.serial || record.tag, record.campus || "Nasinu", record.building || "Imported", record.room || "Imported", record.department || "Imported", record.custodian || "Imported", record.status || "Received", record.condition || "Good", record.supplier || "Imported", record.po || "Imported", Number(record.cost || 0), record.warrantyEnd || "2029-12-31", record.replacementDue || "2031-12-31", record.lastVerified || today()), ...record });
  });
  saveDb("Imported CSV asset records");
}

function initialiseForms() {
  fillSelect($("#campusFilter"), campuses, "All campuses");
  fillSelect($("#statusFilter"), statuses, "All statuses");
  fillSelect($("#assetForm select[name='campus']"), campuses);
  fillSelect($("#assetForm select[name='status']"), statuses);
  clearAssetForm();
}

initialiseForms();
bindEvents();
applyAuthState();
renderAll();
if (currentUser) {
  setPage((window.location.hash || "#dashboard").replace("#", ""));
}
