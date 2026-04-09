const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const animatePageIn = () => {
  if (prefersReducedMotion) return;
  document.body.classList.add("page-enter");
  requestAnimationFrame(() => {
    document.body.classList.remove("page-enter");
  });
};

const setupPageTransitions = () => {
  const links = Array.from(document.querySelectorAll("a[href]"));

  links.forEach((link) => {
    const href = link.getAttribute("href");
    if (!href) return;
    if (href.startsWith("#")) return;
    if (link.target === "_blank") return;
    if (href.startsWith("http") || href.startsWith("mailto") || href.startsWith("tel")) return;
    if (!href.endsWith(".html") && !href.startsWith("./")) return;
    if (prefersReducedMotion) return;

    link.addEventListener("click", (event) => {
      event.preventDefault();
      document.body.classList.add("page-leave");
      setTimeout(() => {
        window.location.href = href;
      }, 350);
    });
  });
};

animatePageIn();
setupPageTransitions();

const revealItems = Array.from(document.querySelectorAll("[data-reveal]"));

if (revealItems.length) {
  if (prefersReducedMotion) {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  } else {
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        });
      },
      { threshold: 0.2 }
    );

    revealItems.forEach((item) => observer.observe(item));
  }
}

const track = document.querySelector(".carousel__track");
const viewport = document.querySelector(".carousel__viewport");

if (track) {
  const items = Array.from(track.children);
  let index = 0;
  let paused = false;

  const getVisibleCount = () => {
    if (window.innerWidth < 720) return 1;
    if (window.innerWidth < 1024) return 2;
    if (window.innerWidth < 1200) return 3;
    return 4;
  };

  const getIntervalMs = (visible) => {
    if (visible <= 1) return prefersReducedMotion ? 12000 : 5200;
    if (visible === 2) return prefersReducedMotion ? 12000 : 6000;
    if (visible === 3) return prefersReducedMotion ? 12000 : 7200;
    return prefersReducedMotion ? 12000 : 8600;
  };

  const getStep = () => {
    const item = items[0];
    if (!item) return 0;
    const gap = parseFloat(getComputedStyle(track).gap) || 0;
    return item.getBoundingClientRect().width + gap;
  };

  const updateTransform = () => {
    const step = getStep();
    if (!step) return;
    track.style.transform = `translateX(${-index * step}px)`;
  };

  const clampIndex = () => {
    const visible = getVisibleCount();
    const maxIndex = Math.max(0, items.length - visible);
    if (index > maxIndex) index = 0;
    updateTransform();
  };

  const next = () => {
    const visible = getVisibleCount();
    const maxIndex = Math.max(0, items.length - visible);
    if (maxIndex === 0) return;
    index = index >= maxIndex ? 0 : index + 1;
    updateTransform();
  };

  let timerId = null;

  const scheduleNext = () => {
    if (paused || items.length <= getVisibleCount()) {
      index = 0;
      updateTransform();
      return;
    }
    const delay = getIntervalMs(getVisibleCount());
    timerId = setTimeout(() => {
      next();
      scheduleNext();
    }, delay);
  };

  const resetTimer = () => {
    if (timerId) clearTimeout(timerId);
    if (paused) return;
    scheduleNext();
  };

  const pause = () => {
    paused = true;
    if (timerId) clearTimeout(timerId);
  };

  const resume = () => {
    if (!paused) return;
    paused = false;
    resetTimer();
  };

  window.addEventListener("resize", () => {
    clampIndex();
    resetTimer();
  });
  window.addEventListener("load", () => {
    clampIndex();
    resetTimer();
  });
  clampIndex();
  resetTimer();

  if (viewport) {
    viewport.addEventListener("mouseenter", pause);
    viewport.addEventListener("mouseleave", resume);
    viewport.addEventListener("focusin", pause);
    viewport.addEventListener("focusout", resume);
  }
}
