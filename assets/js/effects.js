"use strict";

(() => {
  const motion = matchMedia("(prefers-reduced-motion: no-preference)");
  if (!("IntersectionObserver" in window) || !motion.addEventListener) return;

  function initSectionReveals() {
    if (!Element.prototype.animate) return;

    const sections = document.querySelectorAll("main > section:not(.hero)");
    const pending = new Set(sections);
    const active = new Map();
    const observer = new IntersectionObserver(
      (entries) => {
        if (!motion.matches || document.hidden) return;

        for (const { target, isIntersecting } of entries) {
          if (!isIntersecting || !pending.delete(target)) continue;
          observer.unobserve(target);
          if (target.matches(":focus-within")) continue;

          // A section's resting styles always display its content.
          const animation = target.animate(
            [
              { opacity: 0.88, transform: "translateY(12px)" },
              { opacity: 1, transform: "none" },
            ],
            { duration: 460, easing: "cubic-bezier(0.22, 1, 0.36, 1)" },
          );
          active.set(target, animation);
          animation.finished.then(
            () => active.delete(target),
            () => active.delete(target),
          );
        }
      },
      { threshold: 0.08 },
    );

    function syncReveals() {
      observer.disconnect();
      if (motion.matches && !document.hidden) {
        for (const section of pending) observer.observe(section);
      } else {
        for (const animation of active.values()) animation.cancel();
      }
    }

    for (const section of sections) {
      section.addEventListener("focusin", () => active.get(section)?.cancel());
    }
    motion.addEventListener("change", syncReveals);
    document.addEventListener("visibilitychange", syncReveals);
    syncReveals();
  }

  function initHeroEffects() {
    const hero = document.querySelector(".hero");
    const canvas = hero?.querySelector(".hero-particles");
    const editor = hero?.querySelector(".editor-card");
    if (!canvas || !editor || !("ResizeObserver" in window)) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    const finePointer = matchMedia("(hover: hover) and (pointer: fine)");
    const forcedColors = matchMedia("(forced-colors: active)");
    const particles = Array.from({ length: 34 }, () => ({
      x: Math.random(),
      y: Math.random(),
      phase: Math.random() * Math.PI * 2,
      size: 0.7 + Math.random() * 1.2,
    }));
    const introDuration = 4200;
    const pointerDuration = 480;
    let width = 0;
    let height = 0;
    let inView = false;
    let playedIntro = false;
    let frame = 0;
    let lastDraw = -Infinity;
    let animationEnd = 0;
    let pointerX = 0;
    let pointerY = 0;
    let targetX = 0;
    let targetY = 0;
    let pointerEvent;

    function canAnimate() {
      return (
        inView && motion.matches && !forcedColors.matches && !document.hidden
      );
    }

    function draw(time) {
      if (!width || !height) return;
      const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
      const pixelWidth = Math.round(width * ratio);
      const pixelHeight = Math.round(height * ratio);
      if (canvas.width !== pixelWidth || canvas.height !== pixelHeight) {
        canvas.width = pixelWidth;
        canvas.height = pixelHeight;
        context.setTransform(ratio, 0, 0, ratio, 0, 0);
      }
      context.clearRect(0, 0, width, height);
      const count = width < 600 ? 16 : particles.length;
      context.fillStyle = "#7dd3fc";

      for (let index = 0; index < count; index++) {
        const point = particles[index];
        const x = point.x * width + Math.sin(time * 0.0006 + point.phase) * 8;
        const y =
          point.y * height + Math.cos(time * 0.00055 + point.phase) * 10;
        context.globalAlpha =
          (0.15 + point.size * 0.15) * (0.42 + point.x * 0.58);
        context.beginPath();
        context.arc(
          x + pointerX * 10,
          y + pointerY * 8,
          point.size,
          0,
          Math.PI * 2,
        );
        context.fill();
      }
    }

    function animate(time) {
      frame = 0;
      if (!canAnimate()) return;

      if (time - lastDraw >= 31 || time >= animationEnd) {
        lastDraw = time;
        if (pointerEvent) {
          const bounds = hero.getBoundingClientRect();
          targetX =
            ((pointerEvent.clientX - bounds.left) / bounds.width - 0.5) * 2;
          targetY =
            ((pointerEvent.clientY - bounds.top) / bounds.height - 0.5) * 2;
          pointerEvent = undefined;
        }
        const settling = time >= animationEnd;
        if (pointerX !== targetX || pointerY !== targetY) {
          pointerX = settling
            ? targetX
            : pointerX + (targetX - pointerX) * 0.24;
          pointerY = settling
            ? targetY
            : pointerY + (targetY - pointerY) * 0.24;
          editor.style.setProperty(
            "--editor-pitch",
            `${(-pointerY * 4).toFixed(2)}deg`,
          );
          editor.style.setProperty(
            "--editor-yaw",
            `${(pointerX * 5).toFixed(2)}deg`,
          );
        }
        draw(time);
      }
      if (time < animationEnd) frame = requestAnimationFrame(animate);
    }

    function wake(duration) {
      if (!canAnimate()) return;
      animationEnd = Math.max(animationEnd, performance.now() + duration);
      if (!frame) frame = requestAnimationFrame(animate);
    }

    function clearPointer() {
      pointerEvent = undefined;
      pointerX = pointerY = targetX = targetY = 0;
      editor.style.removeProperty("--editor-pitch");
      editor.style.removeProperty("--editor-yaw");
    }

    function syncHero() {
      if (!canAnimate()) {
        cancelAnimationFrame(frame);
        frame = animationEnd = 0;
        clearPointer();
        context.clearRect(0, 0, width, height);
        return;
      }

      if (!playedIntro) {
        playedIntro = true;
        wake(introDuration);
      } else {
        draw(performance.now());
      }
    }

    const resizeObserver = new ResizeObserver(([{ contentRect }]) => {
      width = contentRect.width;
      height = contentRect.height;
      if (canAnimate()) draw(performance.now());
    });
    resizeObserver.observe(canvas);

    const visibilityObserver = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      syncHero();
    });
    visibilityObserver.observe(hero);

    hero.addEventListener(
      "pointermove",
      (event) => {
        if (
          !finePointer.matches ||
          event.pointerType !== "mouse" ||
          !canAnimate()
        )
          return;
        pointerEvent = event;
        wake(pointerDuration);
      },
      { passive: true },
    );
    hero.addEventListener("pointerleave", (event) => {
      if (event.pointerType !== "mouse" || !finePointer.matches) return;
      pointerEvent = undefined;
      targetX = targetY = 0;
      wake(pointerDuration);
    });
    finePointer.addEventListener("change", clearPointer);
    motion.addEventListener("change", syncHero);
    forcedColors.addEventListener("change", syncHero);
    document.addEventListener("visibilitychange", syncHero);
  }

  initSectionReveals();
  initHeroEffects();
})();
