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

  /* ---------------------------------- Lightbox ------------------------------------ */
  const galleryButtons = Array.from(
    document.querySelectorAll("[data-lightbox-trigger]")
  );
  const lightbox = document.querySelector(".lightbox");

  if (galleryButtons.length && lightbox) {
    const lightboxImg = lightbox.querySelector("img");
    const lightboxCaption = lightbox.querySelector(".lightbox__caption");
    const closeBtn = lightbox.querySelector(".lightbox__close");
    const prevBtn = lightbox.querySelector(".lightbox__nav--prev");
    const nextBtn = lightbox.querySelector(".lightbox__nav--next");
    let currentIndex = 0;
    let lastFocused = null;

    const showAt = (index) => {
      currentIndex = (index + galleryButtons.length) % galleryButtons.length;
      const btn = galleryButtons[currentIndex];
      const src = btn.getAttribute("data-full") || btn.querySelector("img").src;
      const caption = btn.getAttribute("data-caption") || "";
      lightboxImg.src = src;
      lightboxImg.alt = caption;
      lightboxCaption.textContent = caption;
    };

    const openLightbox = (index) => {
      lastFocused = document.activeElement;
      showAt(index);
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

    galleryButtons.forEach((btn, index) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        openLightbox(index);
      });
    });

    closeBtn.addEventListener("click", closeLightbox);
    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) closeLightbox();
    });
    prevBtn?.addEventListener("click", () => showAt(currentIndex - 1));
    nextBtn?.addEventListener("click", () => showAt(currentIndex + 1));

    document.addEventListener("keydown", (e) => {
      if (!lightbox.classList.contains("is-open")) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") showAt(currentIndex - 1);
      if (e.key === "ArrowRight") showAt(currentIndex + 1);
    });
  }

  /* -------------------------------- Gallery filters -------------------------------- */
  const filterButtons = document.querySelectorAll("[data-filter]");
  const galleryItems = document.querySelectorAll("[data-category]");

  if (filterButtons.length && galleryItems.length) {
    filterButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const filter = btn.getAttribute("data-filter");

        filterButtons.forEach((b) => b.classList.remove("is-active"));
        btn.classList.add("is-active");

        galleryItems.forEach((item) => {
          const matches =
            filter === "all" || item.getAttribute("data-category") === filter;
          item.style.display = matches ? "" : "none";
        });
      });
    });
  }

  /* ----------------------------- Menu tab active state ------------------------------ */
  const menuTabs = document.querySelectorAll(".menu-tabs a");
  const menuSections = document.querySelectorAll(".menu-category");

  if (menuTabs.length && menuSections.length && "IntersectionObserver" in window) {
    const tabObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute("id");
            menuTabs.forEach((tab) => {
              tab.classList.toggle(
                "is-active",
                tab.getAttribute("href") === `#${id}`
              );
            });
          }
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );

    menuSections.forEach((section) => tabObserver.observe(section));
  }

  /* ------------------------------------ Forms --------------------------------------- */
  const forms = document.querySelectorAll("[data-validate]");

  forms.forEach((form) => {
    const status = form.querySelector(".form-status");

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      let isValid = true;

      form.querySelectorAll("[required]").forEach((field) => {
        const wrapper = field.closest(".form-field") || field.closest(".waitlist-form");
        const value = field.value.trim();
        let fieldValid = value.length > 0;

        if (fieldValid && field.type === "email") {
          fieldValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        }
        if (fieldValid && field.type === "tel") {
          fieldValid = value.replace(/\D/g, "").length >= 7;
        }

        if (wrapper) wrapper.classList.toggle("has-error", !fieldValid);
        if (!fieldValid) isValid = false;
      });

      if (!status) return;

      status.classList.remove("form-status--success", "form-status--error");

      if (!isValid) {
        status.textContent =
          "Please fill in the highlighted fields before submitting.";
        status.classList.add("form-status--error", "is-visible");
        return;
      }

      // No backend is wired up in this build. Replace this block with a real
      // submission (e.g. Formspree, Netlify Forms, or your own endpoint)
      // before launch.
      const submitBtn = form.querySelector('[type="submit"]');
      if (submitBtn) submitBtn.setAttribute("disabled", "true");

      window.setTimeout(() => {
        status.textContent =
          form.getAttribute("data-success-message") ||
          "Thank you — your request has been received. Our team will confirm by phone or email shortly.";
        status.classList.add("form-status--success", "is-visible");
        form.reset();
        if (submitBtn) submitBtn.removeAttribute("disabled");
      }, 600);
    });

    form.querySelectorAll("[required]").forEach((field) => {
      field.addEventListener("input", () => {
        const wrapper = field.closest(".form-field") || field.closest(".waitlist-form");
        if (wrapper) wrapper.classList.remove("has-error");
      });
    });
  });

  /* -------------------------------------- Footer year -------------------------------- */
  document.querySelectorAll("[data-year]").forEach((el) => {
    el.textContent = new Date().getFullYear();
  });
})();
