/* Site da psicóloga · JS puro, sem dependências */
(function () {
  "use strict";

  // ------------------------------------------------------------------
  // Configuração: preencha conforme o SPEC.md / especificação técnica
  // ------------------------------------------------------------------
  var CONFIG = {
    // Link da página de agendamento do Google Agenda
    // (Google Calendar → Criar → "Agenda de agendamentos" → Compartilhar → link da página).
    // Enquanto estiver vazio, os botões "Agendar" levam ao WhatsApp.
    bookingUrl: "https://calendar.google.com/calendar/appointments/schedules/AcZssZ3OBY522Q-NhXajxx3u5cHGHqn6351RfYizsw-eUtHr87Z4yVezA2y3Tklm42J8Ii1VbYC-NGgc",

    // ID de medição do Google Analytics 4 (ex.: "G-XXXXXXXXXX").
    // Vazio = Analytics desligado e nenhum aviso de cookies aparece.
    gaId: ""
  };

  var STORAGE_KEY = "consent-analytics";

  // ---------- Agendamento ----------
  if (CONFIG.bookingUrl) {
    document.querySelectorAll("[data-booking]").forEach(function (el) {
      el.setAttribute("href", CONFIG.bookingUrl);
      el.setAttribute("target", "_blank");
      el.setAttribute("rel", "noopener");
    });
  }

  // ---------- Menu mobile ----------
  var toggle = document.querySelector(".nav__toggle");
  var list = document.getElementById("nav-list");

  function setMenu(open) {
    if (!toggle || !list) return;
    toggle.setAttribute("aria-expanded", String(open));
    list.classList.toggle("is-open", open);
  }

  if (toggle && list) {
    toggle.addEventListener("click", function () {
      setMenu(toggle.getAttribute("aria-expanded") !== "true");
    });
    list.addEventListener("click", function (e) {
      if (e.target.closest("a")) setMenu(false);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") setMenu(false);
    });
  }

  // ---------- Header com borda ao rolar ----------
  var header = document.querySelector(".header");
  if (header) {
    var onScroll = function () {
      header.classList.toggle("is-scrolled", window.scrollY > 8);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  // ---------- Ano no rodapé ----------
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  // ---------- Google Analytics com consentimento (LGPD) ----------
  function readConsent() {
    try { return localStorage.getItem(STORAGE_KEY); } catch (e) { return null; }
  }
  function saveConsent(value) {
    try { localStorage.setItem(STORAGE_KEY, value); } catch (e) { /* ignore */ }
  }
  function loadAnalytics() {
    var s = document.createElement("script");
    s.async = true;
    s.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(CONFIG.gaId);
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag("js", new Date());
    window.gtag("config", CONFIG.gaId, { anonymize_ip: true });
  }

  if (CONFIG.gaId) {
    var consent = readConsent();
    var banner = document.getElementById("consent");
    if (consent === "granted") {
      loadAnalytics();
    } else if (consent !== "denied" && banner) {
      banner.hidden = false;
      banner.addEventListener("click", function (e) {
        var btn = e.target.closest("[data-consent]");
        if (!btn) return;
        var value = btn.getAttribute("data-consent");
        saveConsent(value);
        banner.hidden = true;
        if (value === "granted") loadAnalytics();
      });
    }
  }
})();
