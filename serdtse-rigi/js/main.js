(() => {
  "use strict";

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  /* ---------------------------- Header scroll state --------------------------- */
  const header = document.querySelector(".site-header");
  if (header) {
    const onScroll = () => {
      header.classList.toggle("is-scrolled", window.scrollY > 12);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* -------------------------------- Mobile nav --------------------------------- */
  const navToggle = document.querySelector(".nav-toggle");
  const navPrimary = document.querySelector(".nav-primary");
  if (navToggle && navPrimary) {
    navToggle.addEventListener("click", () => {
      const isOpen = document.body.classList.toggle("nav-open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
      document.documentElement.style.overflow = isOpen ? "hidden" : "";
    });

    navPrimary.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        document.body.classList.remove("nav-open");
        navToggle.setAttribute("aria-expanded", "false");
        document.documentElement.style.overflow = "";
      });
    });
  }

  /* ------------------------------ Scroll reveals -------------------------------- */
  const revealTargets = document.querySelectorAll(
    "[data-reveal], [data-reveal-group], .divider-line"
  );

  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    revealTargets.forEach((el) => el.classList.add("is-visible"));
  } else {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target;
            const delay = el.getAttribute("data-reveal-delay");
            if (delay) el.style.setProperty("--reveal-delay", `${delay}ms`);
            el.classList.add("is-visible");
            revealObserver.unobserve(el);
          }
        });
      },
      { threshold: 0.16, rootMargin: "0px 0px -60px 0px" }
    );

    revealTargets.forEach((el) => revealObserver.observe(el));
  }

  /* --------------------------------- Count-up ----------------------------------- */
  const countTargets = document.querySelectorAll("[data-count]");
  if (countTargets.length) {
    const animateCount = (el) => {
      const target = parseFloat(el.getAttribute("data-count"));
      const suffix = el.getAttribute("data-count-suffix") || "";
      const decimals = el.getAttribute("data-count-decimals")
        ? parseInt(el.getAttribute("data-count-decimals"), 10)
        : 0;

      if (prefersReducedMotion) {
        el.textContent = target.toFixed(decimals) + suffix;
        return;
      }

      const duration = 1400;
      const start = performance.now();

      const step = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const value = target * eased;
        el.textContent = value.toFixed(decimals) + suffix;
        if (progress < 1) requestAnimationFrame(step);
      };

      requestAnimationFrame(step);
    };

    if ("IntersectionObserver" in window) {
      const countObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              animateCount(entry.target);
              countObserver.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.5 }
      );
      countTargets.forEach((el) => countObserver.observe(el));
    } else {
      countTargets.forEach(animateCount);
    }
  }

  /* ---------------------------------- Lightbox (генплан) ------------------------------------ */
  const planTrigger = document.querySelector("[data-lightbox-trigger]");
  const lightbox = document.querySelector(".lightbox");

  if (planTrigger && lightbox) {
    const closeBtn = lightbox.querySelector(".lightbox__close");
    let lastFocused = null;

    const openLightbox = () => {
      lastFocused = document.activeElement;
      lightbox.classList.add("is-open");
      lightbox.setAttribute("aria-hidden", "false");
      document.documentElement.style.overflow = "hidden";
      closeBtn.focus();
    };

    const closeLightbox = () => {
      lightbox.classList.remove("is-open");
      lightbox.setAttribute("aria-hidden", "true");
      document.documentElement.style.overflow = "";
      if (lastFocused) lastFocused.focus();
    };

    planTrigger.addEventListener("click", (e) => {
      e.preventDefault();
      openLightbox();
    });

    closeBtn.addEventListener("click", closeLightbox);
    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener("keydown", (e) => {
      if (!lightbox.classList.contains("is-open")) return;
      if (e.key === "Escape") closeLightbox();
    });
  }

  /* ------------------------------------ Forms --------------------------------------- */
  const forms = document.querySelectorAll("[data-validate]");

  forms.forEach((form) => {
    const status = form.querySelector(".form-status");

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      let isValid = true;

      form.querySelectorAll("[required]").forEach((field) => {
        const wrapper = field.closest(".form-field");
        let fieldValid;

        if (field.type === "checkbox") {
          fieldValid = field.checked;
        } else {
          const value = field.value.trim();
          fieldValid = value.length > 0;
          if (fieldValid && field.type === "email") {
            fieldValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
          }
          if (fieldValid && field.type === "tel") {
            fieldValid = value.replace(/\D/g, "").length >= 10;
          }
        }

        if (wrapper) wrapper.classList.toggle("has-error", !fieldValid);
        if (!fieldValid) isValid = false;
      });

      if (!status) return;

      status.classList.remove("form-status--success", "form-status--error");

      if (!isValid) {
        status.textContent =
          "Пожалуйста, заполните выделенные поля и подтвердите согласие на обработку данных.";
        status.classList.add("form-status--error", "is-visible");
        return;
      }

      // В этой сборке форма не подключена к бэкенду. Перед запуском
      // подключите реальный обработчик (CRM, email-сервис, свой API).
      const submitBtn = form.querySelector('[type="submit"]');
      if (submitBtn) submitBtn.setAttribute("disabled", "true");

      window.setTimeout(() => {
        status.textContent =
          form.getAttribute("data-success-message") ||
          "Спасибо! Ваша заявка принята — менеджер свяжется с вами в ближайшее время.";
        status.classList.add("form-status--success", "is-visible");
        form.reset();
        if (submitBtn) submitBtn.removeAttribute("disabled");
      }, 600);
    });

    form.querySelectorAll("[required]").forEach((field) => {
      const evt = field.type === "checkbox" ? "change" : "input";
      field.addEventListener(evt, () => {
        const wrapper = field.closest(".form-field");
        if (wrapper) wrapper.classList.remove("has-error");
      });
    });
  });

  /* -------------------------------------- Footer year -------------------------------- */
  document.querySelectorAll("[data-year]").forEach((el) => {
    el.textContent = new Date().getFullYear();
  });
})();
