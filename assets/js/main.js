"use strict";

(() => {
  const header = document.querySelector(".site-header");
  const button = header.querySelector(".menu-toggle");
  const nav = document.getElementById(button.getAttribute("aria-controls"));
  const mobileLayout = window.matchMedia("(max-width: 760px)");

  function setMenuOpen(open) {
    button.setAttribute("aria-expanded", String(open));
    nav.hidden = mobileLayout.matches && !open;
  }

  button.addEventListener("click", () => {
    setMenuOpen(button.getAttribute("aria-expanded") !== "true");
  });

  header.addEventListener("keydown", (event) => {
    if (
      event.key === "Escape" &&
      button.getAttribute("aria-expanded") === "true"
    ) {
      setMenuOpen(false);
      button.focus();
    }
  });

  header.addEventListener("focusout", (event) => {
    if (event.relatedTarget && !header.contains(event.relatedTarget)) {
      setMenuOpen(false);
    }
  });

  nav.addEventListener("click", (event) => {
    const link = event.target.closest('a[href^="#"]');
    if (
      !link ||
      !mobileLayout.matches ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    )
      return;

    const section = document.getElementById(link.hash.slice(1));
    setMenuOpen(false);
    section?.focus({ preventScroll: true });
  });

  function syncLayout() {
    const matches = mobileLayout.matches;
    const focused = document.activeElement;
    button.hidden = !matches;
    setMenuOpen(false);
    if (matches && nav.contains(focused)) button.focus();
    if (!matches && focused === button) nav.querySelector("a").focus();
  }

  mobileLayout.addEventListener("change", syncLayout);
  header.classList.add("has-menu-toggle");
  syncLayout();
})();
