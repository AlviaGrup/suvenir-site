/* ALVIA – deschide imaginile mari (agende, portofoliu)
   [data-zoom="img/...-xl.jpg"]  → click deschide imaginea mare
   [data-zoom-group]             → săgeți între imaginile din același grup
   [data-gallery] + [data-thumb] → miniaturile schimbă imaginea principală */
(function () {
  var box = document.createElement("div");
  box.className = "zbox";
  box.setAttribute("role", "dialog");
  box.setAttribute("aria-modal", "true");
  box.hidden = true;
  box.innerHTML =
    '<button class="zb-close" type="button" aria-label="Închide">&times;</button>' +
    '<button class="zb-prev" type="button" aria-label="Imaginea anterioară">&#8249;</button>' +
    '<figure><img alt=""><figcaption></figcaption></figure>' +
    '<button class="zb-next" type="button" aria-label="Imaginea următoare">&#8250;</button>';
  document.body.appendChild(box);
  var img = box.querySelector("img"), cap = box.querySelector("figcaption");
  var list = [], idx = 0, last = null;

  function show(i) {
    idx = (i + list.length) % list.length;
    var el = list[idx];
    img.src = el.getAttribute("data-zoom");
    var t = el.getAttribute("data-caption") || (el.querySelector("img") || el).getAttribute("alt") || "";
    cap.textContent = t;
    box.classList.toggle("single", list.length < 2);
  }
  function open(el) {
    var g = el.closest("[data-zoom-group]");
    list = g ? Array.prototype.slice.call(g.querySelectorAll("[data-zoom]")).filter(function (x) { return x.offsetParent !== null; }) : [el];
    if (list.indexOf(el) < 0) list = [el];
    last = el;
    show(list.indexOf(el));
    box.hidden = false;
    document.documentElement.style.overflow = "hidden";
    requestAnimationFrame(function () { box.classList.add("on"); });
    box.querySelector(".zb-close").focus();
  }
  function close() {
    box.classList.remove("on");
    document.documentElement.style.overflow = "";
    setTimeout(function () { box.hidden = true; img.removeAttribute("src"); }, 200);
    if (last) last.focus && last.focus();
  }

  document.addEventListener("click", function (e) {
    var th = e.target.closest("[data-thumb]");
    if (th) {
      var gal = th.closest("[data-gallery]"), main = gal.querySelector("[data-main]");
      var mi = main.querySelector("img");
      mi.src = th.getAttribute("data-thumb");
      mi.alt = th.querySelector("img").alt;
      main.setAttribute("data-zoom", th.getAttribute("data-zoom-src"));
      gal.querySelectorAll("[data-thumb]").forEach(function (x) { x.classList.toggle("on", x === th); });
      return;
    }
    var z = e.target.closest("[data-zoom]");
    if (z && !box.contains(z)) { e.preventDefault(); open(z); }
  });
  box.addEventListener("click", function (e) {
    if (e.target === box || e.target.tagName === "FIGURE") close();
  });
  box.querySelector(".zb-close").addEventListener("click", close);
  box.querySelector(".zb-prev").addEventListener("click", function () { show(idx - 1); });
  box.querySelector(".zb-next").addEventListener("click", function () { show(idx + 1); });
  document.addEventListener("keydown", function (e) {
    if (box.hidden) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowLeft") show(idx - 1);
    if (e.key === "ArrowRight") show(idx + 1);
  });
  var sx = null;
  box.addEventListener("touchstart", function (e) { sx = e.touches[0].clientX; }, { passive: true });
  box.addEventListener("touchend", function (e) {
    if (sx === null) return;
    var dx = e.changedTouches[0].clientX - sx;
    if (Math.abs(dx) > 50 && list.length > 1) show(idx + (dx < 0 ? 1 : -1));
    sx = null;
  });
  document.querySelectorAll("[data-zoom]").forEach(function (el) {
    if (!el.hasAttribute("tabindex") && el.tagName !== "BUTTON" && el.tagName !== "A") el.setAttribute("tabindex", "0");
    el.addEventListener("keydown", function (e) { if (e.key === "Enter") open(el); });
  });
})();
