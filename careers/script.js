/* ==========================================================
   EXOTIC CARS — shared behaviour (About us + Careers)
   1. Mobile navigation
   2. Careers: role selection
   3. Careers: application form (validation, CV upload, submit)
   ========================================================== */
(function () {
  "use strict";

  /* ---------- 1. Mobile navigation ---------- */
  // The ☰ button shows/hides the navigation (same on every page)
  document.getElementById("menu-btn").addEventListener("click", function () {
    document.getElementById("nav").classList.toggle("open");
  });

  /* ---------- Careers page only below ---------- */
  var form = document.getElementById("apply-form");
  if (!form) return;

  var STORAGE_KEY = "exoticCarsApplications";
  var MAX_FILE_BYTES = 5 * 1024 * 1024;
  var ALLOWED_EXT = ["pdf", "doc", "docx"];

  var cards = document.querySelectorAll(".role");
  var radios = form.querySelectorAll('input[name="role"]');
  var chosenLabel = document.getElementById("chosen-role");
  var applyCard = document.getElementById("apply-card");
  var successBox = document.getElementById("success");
  var fileInput = document.getElementById("cv");
  var fileName = document.getElementById("file-name");
  var fileDrop = document.getElementById("file-drop");
  var DEFAULT_FILE_TEXT = fileName.textContent;

  /* Earliest start date cannot be in the past */
  var dateInput = document.getElementById("startDate");
  var today = new Date();
  dateInput.min = today.getFullYear() + "-" +
    String(today.getMonth() + 1).padStart(2, "0") + "-" +
    String(today.getDate()).padStart(2, "0");

  /* ---------- 2. Role selection ---------- */
  function selectRole(role) {
    cards.forEach(function (card) {
      card.classList.toggle("is-selected", card.dataset.role === role);
    });
    radios.forEach(function (r) { r.checked = (r.value === role); });
    chosenLabel.textContent = role ? "Applying for: " + role : "Choose a role to continue";
    if (role) clearError("role");
  }

  document.querySelectorAll("[data-apply]").forEach(function (btn) {
    btn.addEventListener("click", function (e) {
      e.stopPropagation();
      selectRole(btn.dataset.apply);
      var target = document.getElementById("apply");
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      // Move focus to the first empty field once the scroll has begun
      setTimeout(function () { document.getElementById("fullName").focus({ preventScroll: true }); }, 450);
    });
  });

  // Clicking anywhere on a card also selects it
  cards.forEach(function (card) {
    card.addEventListener("click", function () { selectRole(card.dataset.role); });
  });
  radios.forEach(function (r) {
    r.addEventListener("change", function () { selectRole(r.value); });
  });

  /* ---------- 3. Validation ---------- */
  function fieldWrap(name) { return form.querySelector('[data-field="' + name + '"]'); }

  function setError(name, message) {
    var wrap = fieldWrap(name);
    var out = document.getElementById("err-" + name);
    if (wrap) wrap.classList.add("has-error");
    if (out) out.textContent = message;
    var input = wrap && wrap.querySelector("input:not([type=radio]), select, textarea");
    if (input) input.setAttribute("aria-invalid", "true");
  }

  function clearError(name) {
    var wrap = fieldWrap(name);
    var out = document.getElementById("err-" + name);
    if (wrap) wrap.classList.remove("has-error");
    if (out) out.textContent = "";
    var input = wrap && wrap.querySelector("input, select, textarea");
    if (input) input.removeAttribute("aria-invalid");
  }

  function fileExtension(name) {
    var parts = name.toLowerCase().split(".");
    return parts.length > 1 ? parts.pop() : "";
  }

  function validate() {
    var data = new FormData(form);
    var errors = {};
    var v = function (k) { return String(data.get(k) || "").trim(); };

    if (!v("role")) errors.role = "Choose the role you are applying for.";

    if (v("fullName").length < 2) errors.fullName = "Enter your full name.";

    if (!v("email")) errors.email = "Enter your email address.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v("email"))) errors.email = "Enter a valid email address, like name@example.com.";

    var digits = v("phone").replace(/[\s\-()+]/g, "");
    if (!v("phone")) errors.phone = "Enter your phone number.";
    else if (!/^\d{10,14}$/.test(digits)) errors.phone = "Enter a valid phone number with 10 to 14 digits.";

    if (v("city").length < 2) errors.city = "Enter the city you live in.";

    if (!v("experience")) errors.experience = "Select your years of experience.";

    if (!v("startDate")) errors.startDate = "Choose your earliest start date.";
    else if (v("startDate") < dateInput.min) errors.startDate = "Choose today or a later date.";

    var file = fileInput.files[0];
    if (!file) errors.cv = "Attach your CV.";
    else if (ALLOWED_EXT.indexOf(fileExtension(file.name)) === -1) errors.cv = "Upload a PDF, DOC or DOCX file.";
    else if (file.size > MAX_FILE_BYTES) errors.cv = "This file is larger than 5 MB. Upload a smaller file.";

    if (!form.consent.checked) errors.consent = "Tick the box to confirm you agree.";

    return errors;
  }

  var ALL_FIELDS = ["role", "fullName", "email", "phone", "city", "experience", "startDate", "cv", "consent"];

  // Clear a field's error as soon as the person edits it
  ALL_FIELDS.forEach(function (name) {
    var wrap = fieldWrap(name);
    if (!wrap) return;
    wrap.addEventListener("input", function () { clearError(name); });
    wrap.addEventListener("change", function () { clearError(name); });
  });

  /* ---------- CV upload (click, keyboard and drag-and-drop) ---------- */
  fileInput.addEventListener("change", function () {
    fileName.textContent = fileInput.files[0] ? fileInput.files[0].name : DEFAULT_FILE_TEXT;
  });

  ["dragenter", "dragover"].forEach(function (evt) {
    fileDrop.addEventListener(evt, function (e) { e.preventDefault(); fileDrop.classList.add("is-over"); });
  });
  ["dragleave", "drop"].forEach(function (evt) {
    fileDrop.addEventListener(evt, function () { fileDrop.classList.remove("is-over"); });
  });
  fileDrop.addEventListener("drop", function (e) {
    e.preventDefault();
    if (e.dataTransfer.files.length) {
      fileInput.files = e.dataTransfer.files;
      fileInput.dispatchEvent(new Event("change", { bubbles: true }));
    }
  });

  /* ---------- Submit ---------- */
  function makeReference() {
    var stamp = Date.now().toString(36).toUpperCase().slice(-5);
    var rand = Math.random().toString(36).toUpperCase().slice(2, 5);
    return "EC-" + stamp + rand;
  }

  function loadApplications() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; }
    catch (err) { return []; }
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    ALL_FIELDS.forEach(clearError);

    var errors = validate();
    var names = Object.keys(errors);
    if (names.length) {
      names.forEach(function (n) { setError(n, errors[n]); });
      // Focus the first invalid control so the problem is obvious
      var first = fieldWrap(names[0]);
      var control = first.querySelector("input, select, textarea");
      if (control) control.focus();
      return;
    }

    var data = new FormData(form);
    var file = fileInput.files[0];
    var application = {
      reference: makeReference(),
      submittedAt: new Date().toISOString(),
      role: data.get("role"),
      fullName: data.get("fullName").trim(),
      email: data.get("email").trim(),
      phone: data.get("phone").trim(),
      city: data.get("city").trim(),
      experience: data.get("experience"),
      startDate: data.get("startDate"),
      message: (data.get("message") || "").trim(),
      cv: { name: file.name, size: file.size, type: file.type }
    };

    var submitBtn = document.getElementById("submit-btn");
    submitBtn.disabled = true;
    submitBtn.textContent = "Sending…";

    /* Demo storage: keeps the application in this browser so the form works
       without a server. To go live, replace this block with a request to
       your backend, for example:

         fetch("/api/applications", { method: "POST", body: data })
           .then(function (r) { if (!r.ok) throw new Error(); return r.json(); })
           .then(showSuccess)
           .catch(showFailure);
    */
    setTimeout(function () {
      try {
        var all = loadApplications();
        all.push(application);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
      } catch (err) { /* storage can be blocked; the confirmation still shows */ }
      showSuccess(application);
      submitBtn.disabled = false;
      submitBtn.textContent = "Submit application →";
    }, 700);
  });

  function showSuccess(app) {
    document.getElementById("success-text").textContent =
      "Thank you, " + app.fullName.split(" ")[0] + ". We received your application for " + app.role +
      " and will contact you at " + app.email + ".";
    document.getElementById("success-ref").textContent = "Reference " + app.reference;
    applyCard.classList.add("is-done");
    successBox.classList.add("is-visible");
    successBox.scrollIntoView({ behavior: "smooth", block: "center" });
    successBox.focus({ preventScroll: true });
  }

  /* Start another application */
  document.getElementById("apply-again").addEventListener("click", function () {
    form.reset();
    fileName.textContent = DEFAULT_FILE_TEXT;
    selectRole("");
    successBox.classList.remove("is-visible");
    applyCard.classList.remove("is-done");
    document.getElementById("apply").scrollIntoView({ behavior: "smooth", block: "start" });
  });

  /* Clear form button */
  form.addEventListener("reset", function () {
    ALL_FIELDS.forEach(clearError);
    fileName.textContent = DEFAULT_FILE_TEXT;
    selectRole("");
  });
})();
