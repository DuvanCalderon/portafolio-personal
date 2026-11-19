"use strict";
(() => {
  const data = window.portfolioContent;
  if (!data) return;
  const $ = (id) => document.getElementById(id);
  const setText = (id, value) => { const node = $(id); if (node && typeof value === "string") node.textContent = value; };
  const el = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  };
  const safeLink = (url) => {
    if (typeof url !== "string" || !url.trim()) return null;
    try {
      const parsed = new URL(url, window.location.href);
      if (parsed.protocol === "https:" || parsed.protocol === "http:") return parsed.href;
      if (parsed.origin === window.location.origin && parsed.protocol === "file:") return parsed.href;
    } catch (_) { /* Invalid URL omitted. */ }
    return null;
  };
  const addExternalLink = (container, label, href, className) => {
    const safe = safeLink(href);
    if (!safe) return;
    const anchor = el("a", className, label);
    anchor.href = safe;
    anchor.target = "_blank";
    anchor.rel = "noopener noreferrer";
    container.append(anchor);
  };

  document.title = `${data.name} | Desarrollo web`;
  setText("hero-name", `${data.firstName}.`);
  setText("hero-location", data.location.toUpperCase());
  const heroTitle = $("hero-title");
  heroTitle.textContent = data.hero.titleFirst + " ";
  heroTitle.append(el("span", "", data.hero.titleHighlight));
  setText("hero-description", data.hero.description);
  setText("hero-tagline", data.hero.tagline);
  setText("about-lead", data.about.lead);
  setText("about-detail", data.about.detail);
  setText("education-program", data.education.program);
  setText("education-school", data.education.school);
  setText("education-description", data.education.description);
  setText("contact-description", data.contactDescription);
  setText("copyright-year", String(new Date().getFullYear()));
  const heroGithub = safeLink(data.links.github);
  if (heroGithub) $("github-hero").href = heroGithub;

  data.about.principles.forEach((item) => $("about-principles").append(el("span", "principle", item)));
  data.skills.practice.forEach((item) => $("skills-practice").append(el("span", "skill-tag", item)));
  data.skills.learning.forEach((item) => $("skills-learning").append(el("span", "skill-tag learning", item)));
  (data.skills.tools || []).forEach((item) => $("skills-tools")?.append(el("span", "skill-tag", item)));
  data.languages.forEach((language) => {
    const card = el("div", "language-item");
    card.append(el("strong", "", language.name), el("span", "", language.level));
    $("languages-list").append(card);
  });

  if (!data.projects.length) {
    const message = el("div", "projects-empty");
    message.append(
      el("div", "projects-empty-icon", "</>"),
      el("h3", "", "Próximamente: mis proyectos destacados"),
      el("p", "", "Estoy preparando casos con sus objetivos, decisiones técnicas, resultados y enlaces para que puedas explorar el trabajo detrás de cada solución.")
    );
    $("projects-list").append(message);
  }
  data.projects.forEach((project, index) => {
    const card = el("article", "project-card");
    const visual = el("div", `project-visual ${project.theme || ""}`);
    visual.setAttribute("aria-hidden", "true");
    visual.append(el("span", "project-number", String(index + 1).padStart(2, "0")), el("span", "project-symbol", project.symbol || "</>"));
    const body = el("div", "project-body");
    body.append(el("div", "project-category", project.category), el("h3", "", project.name), el("p", "", project.description));
    const tags = el("div", "project-tech");
    project.tech.forEach((item) => tags.append(el("span", "", item)));
    body.append(tags);
    const links = el("div", "project-links");
    addExternalLink(links, "Ver proyecto ↗", project.live);
    addExternalLink(links, "Código ↗", project.repo);
    body.append(links); card.append(visual, body); $("projects-list").append(card);
  });

  const contact = $("contact-actions");
  addExternalLink(contact, "GitHub ↗", data.links.github, "button button-primary");
  addExternalLink(contact, "LinkedIn ↗", data.links.linkedin, "button button-secondary");
  const email = typeof data.links.email === "string" ? data.links.email.trim() : "";
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    const a = el("a", "button button-secondary", "Enviar correo ↗");
    a.href = "mailto:" + email;
    contact.append(a);
  }
  const cv = data.links.cv;
  if (typeof cv === "string" && cv.trim() && !cv.startsWith("javascript:")) {
    const a = el("a", "button button-secondary", "Descargar CV ↗");
    a.href = cv; a.download = "CV-Duvan-Calderon";
    contact.append(a);
  }

  const toggle = $("nav-links");
  const button = document.querySelector(".menu-toggle");
  button.addEventListener("click", () => {
    const open = button.getAttribute("aria-expanded") === "true";
    button.setAttribute("aria-expanded", String(!open));
    button.setAttribute("aria-label", open ? "Abrir menú" : "Cerrar menú");
    toggle.classList.toggle("is-open", !open);
  });
  toggle.querySelectorAll("a").forEach((anchor) => anchor.addEventListener("click", () => {
    toggle.classList.remove("is-open");
    button.setAttribute("aria-expanded", "false");
    button.setAttribute("aria-label", "Abrir menú");
  }));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      toggle.classList.remove("is-open");
      button.setAttribute("aria-expanded", "false");
      button.setAttribute("aria-label", "Abrir menú");
    }
  });
})();
