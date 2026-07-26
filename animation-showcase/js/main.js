(() => {
  "use strict";

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  /* ============================================================
     1. Waitlist morph: idle -> loading -> success (ring + confetti)
     ============================================================ */
  const waitlistForm = document.querySelector("[data-demo='waitlist']");
  if (waitlistForm) {
    const pill = waitlistForm.querySelector(".waitlist__pill");
    const input = waitlistForm.querySelector(".waitlist__input");
    const ring = waitlistForm.querySelector(".waitlist__ring");
    const confettiRoot = waitlistForm.querySelector(".waitlist__confetti");
    const status = waitlistForm.querySelector(".waitlist__status");

    const colors = ["#8b5cf6", "#3b82f6", "#22c55e", "#f59e0b", "#ec4899"];

    const spawnConfetti = () => {
      confettiRoot.innerHTML = "";
      const count = prefersReducedMotion ? 0 : 16;
      for (let i = 0; i < count; i++) {
        const piece = document.createElement("span");
        const angle = Math.random() * Math.PI * 2;
        const distance = 40 + Math.random() * 50;
        piece.style.setProperty("--x", `${40 + Math.random() * 20}%`);
        piece.style.setProperty("--tx", `${Math.cos(angle) * distance}px`);
        piece.style.setProperty("--ty", `${Math.sin(angle) * distance - 20}px`);
        piece.style.setProperty("--r", `${Math.random() * 360}deg`);
        piece.style.setProperty("--d", `${Math.random() * 120}ms`);
        piece.style.setProperty("--c", colors[i % colors.length]);
        confettiRoot.appendChild(piece);
      }
      window.setTimeout(() => {
        confettiRoot.innerHTML = "";
      }, 1000);
    };

    const pulseRing = () => {
      ring.classList.remove("is-pulsing");
      // force reflow so the animation can restart
      void ring.offsetWidth;
      ring.classList.add("is-pulsing");
    };

    const resetToIdle = () => {
      pill.dataset.state = "idle";
      input.disabled = false;
      input.value = "";
      status.textContent = "";
    };

    waitlistForm.addEventListener("submit", (e) => {
      e.preventDefault();
      if (pill.dataset.state !== "idle") return;

      const value = input.value.trim();
      const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      if (!isValid) {
        status.textContent = "Введите корректный email.";
        input.focus();
        return;
      }

      pill.dataset.state = "loading";
      input.disabled = true;
      status.textContent = "";

      window.setTimeout(() => {
        pill.dataset.state = "success";
        pulseRing();
        spawnConfetti();
        status.textContent = "Нажмите на капсулу, чтобы попробовать ещё раз.";
      }, 1400);
    });

    // Handled on the button itself (not the pill) with preventDefault:
    // in the success state the button visually fills the whole pill, and
    // since it's type="submit", a plain click would both reset the form
    // AND immediately re-submit it (now empty), producing a false
    // validation error. Intercepting the click stops that native submit.
    const btn = waitlistForm.querySelector(".waitlist__btn");
    btn.addEventListener("click", (e) => {
      if (pill.dataset.state === "success") {
        e.preventDefault();
        resetToIdle();
      }
    });
  }

  /* ============================================================
     2. Magnetic tilt card
     ============================================================ */
  const tiltCard = document.querySelector("[data-demo='tilt']");
  if (tiltCard && !prefersReducedMotion) {
    const maxTilt = 12;

    tiltCard.addEventListener("mousemove", (e) => {
      const rect = tiltCard.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width;
      const py = (e.clientY - rect.top) / rect.height;

      const rotateY = (px - 0.5) * maxTilt * 2;
      const rotateX = (0.5 - py) * maxTilt * 2;

      tiltCard.classList.add("is-tilting");
      tiltCard.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      tiltCard.style.setProperty("--mx", `${px * 100}%`);
      tiltCard.style.setProperty("--my", `${py * 100}%`);
    });

    tiltCard.addEventListener("mouseleave", () => {
      tiltCard.classList.remove("is-tilting");
      tiltCard.style.transform = "rotateX(0deg) rotateY(0deg)";
    });
  }

  /* ============================================================
     3. Sliding tabs
     ============================================================ */
  const tabsRoot = document.querySelector("[data-demo='tabs']");
  if (tabsRoot) {
    const nav = tabsRoot.querySelector(".tabs__nav");
    const buttons = Array.from(tabsRoot.querySelectorAll(".tabs__btn"));
    const indicator = tabsRoot.querySelector(".tabs__indicator");
    const panels = Array.from(tabsRoot.querySelectorAll(".tabs__panel"));

    const moveIndicatorTo = (btn) => {
      indicator.style.width = `${btn.offsetWidth}px`;
      indicator.style.transform = `translateX(${btn.offsetLeft - 5}px)`;
    };

    const activate = (btn, { focus = false } = {}) => {
      buttons.forEach((b) => {
        b.classList.toggle("is-active", b === btn);
        b.setAttribute("aria-selected", String(b === btn));
        b.tabIndex = b === btn ? 0 : -1;
      });
      panels.forEach((p) => {
        p.classList.toggle("is-active", p.dataset.panel === btn.dataset.tab);
      });
      moveIndicatorTo(btn);
      if (focus) btn.focus();
    };

    buttons.forEach((btn, i) => {
      btn.addEventListener("click", () => activate(btn));
      btn.addEventListener("keydown", (e) => {
        if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
        e.preventDefault();
        const next = e.key === "ArrowRight" ? (i + 1) % buttons.length : (i - 1 + buttons.length) % buttons.length;
        activate(buttons[next], { focus: true });
      });
    });

    // initialize indicator position once layout is ready
    requestAnimationFrame(() => {
      const active = tabsRoot.querySelector(".tabs__btn.is-active") || buttons[0];
      indicator.style.transition = "none";
      moveIndicatorTo(active);
      requestAnimationFrame(() => {
        indicator.style.transition = "";
      });
    });

    window.addEventListener("resize", () => {
      const active = tabsRoot.querySelector(".tabs__btn.is-active") || buttons[0];
      moveIndicatorTo(active);
    });
  }

  /* ============================================================
     4. Modal / sheet
     ============================================================ */
  const modalTrigger = document.querySelector("[data-modal-trigger]");
  const modalBackdrop = document.querySelector("[data-modal-root]");
  if (modalTrigger && modalBackdrop) {
    const modalCard = modalBackdrop.querySelector(".modal-card");
    const closeBtn = modalBackdrop.querySelector(".modal-close");
    let lastFocused = null;

    const openModal = () => {
      lastFocused = document.activeElement;
      modalBackdrop.classList.add("is-open");
      document.documentElement.style.overflow = "hidden";
      closeBtn.focus();
    };

    const closeModal = () => {
      modalBackdrop.classList.remove("is-open");
      document.documentElement.style.overflow = "";
      if (lastFocused) lastFocused.focus();
    };

    modalTrigger.addEventListener("click", openModal);
    closeBtn.addEventListener("click", closeModal);
    modalBackdrop.addEventListener("click", (e) => {
      if (e.target === modalBackdrop) closeModal();
    });
    modalCard.querySelectorAll("[data-modal-close]").forEach((el) => {
      el.addEventListener("click", closeModal);
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && modalBackdrop.classList.contains("is-open")) {
        closeModal();
      }
    });
  }

  /* ============================================================
     5. Accordion (single-open, CSS grid-rows height animation)
     ============================================================ */
  const accordion = document.querySelector("[data-demo='accordion']");
  if (accordion) {
    const items = Array.from(accordion.querySelectorAll(".accordion__item"));

    items.forEach((item) => {
      const trigger = item.querySelector(".accordion__trigger");
      trigger.addEventListener("click", () => {
        const isOpen = item.classList.contains("is-open");
        items.forEach((other) => {
          other.classList.remove("is-open");
          other.querySelector(".accordion__trigger").setAttribute("aria-expanded", "false");
        });
        if (!isOpen) {
          item.classList.add("is-open");
          trigger.setAttribute("aria-expanded", "true");
        }
      });
    });
  }
})();
