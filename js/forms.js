/* ALVIA – formulare "Cere o ofertă"
   Cererile se trimit într-un Google Sheet (și pe email) prin Google Apps Script.
   După ce publicați scriptul, lipiți aici adresa lui (se termină cu /exec): */
var ALVIA_FORM_URL = "";

(function () {
  function digits(v) { return (v || "").replace(/\D/g, ""); }

  function message(form, text, ok) {
    var m = form.querySelector(".form-msg");
    if (!m) {
      m = document.createElement("p");
      m.className = "form-msg";
      m.setAttribute("role", "status");
      form.appendChild(m);
    }
    m.textContent = text;
    m.style.color = ok ? "#7EE08A" : "#FF8A80";
  }

  document.querySelectorAll("form").forEach(function (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var tel = form.querySelector('input[type="tel"]');
      if (!tel || digits(tel.value).length < 8) {
        message(form, "Introduceți un număr de telefon valid, de ex. 067 101 809.", false);
        if (tel) tel.focus();
        return;
      }
      var data = new URLSearchParams();
      form.querySelectorAll("input, textarea, select").forEach(function (el) {
        if (el.name) data.append(el.name, el.value.trim());
      });
      var sim = document.getElementById("similar");
      if (sim && form.contains(sim)) data.append("similar", sim.textContent.trim());
      data.append("pagina", document.title.replace("ALVIA · ", ""));

      var btn = form.querySelector('button[type="submit"]');
      if (!ALVIA_FORM_URL) {
        message(form, "Formularul nu este încă activ. Sunați-ne: 067 101 809.", false);
        return;
      }
      if (btn) { btn.disabled = true; btn.dataset.text = btn.textContent; btn.textContent = "Se trimite…"; }
      fetch(ALVIA_FORM_URL, { method: "POST", mode: "no-cors", body: data })
        .then(function () {
          form.reset();
          message(form, "Mulțumim! Am primit cererea și vă sunăm în curând.", true);
        })
        .catch(function () {
          message(form, "Nu s-a putut trimite. Sunați-ne: 067 101 809.", false);
        })
        .finally(function () {
          if (btn) { btn.disabled = false; btn.textContent = btn.dataset.text; }
        });
    });
  });
})();
