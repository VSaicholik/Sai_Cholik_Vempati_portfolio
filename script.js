const root = document.documentElement;
const themeBtn = document.getElementById("themeBtn");
const themeIcon = document.getElementById("themeIcon");
const themeText = document.getElementById("themeText");
const revealNodes = document.querySelectorAll(".reveal");
const skillFills = document.querySelectorAll(".skill-fill");
const tiltCard = document.getElementById("tiltCard");
const yearNode = document.getElementById("year");
const scrollProgress = document.getElementById("scrollProgress");
const popupForm = document.getElementById("hirePopupForm");
const headerContactBtn = document.getElementById("headerContactBtn");
const hirePopup = document.getElementById("hirePopup");
const hirePopupClose = document.getElementById("hirePopupClose");
const hirePopupBackdrop = document.getElementById("hirePopupBackdrop");
const emailOptions = document.getElementById("emailOptions");
const emailOptionsClose = document.getElementById("emailOptionsClose");
const emailOptionsBackdrop = document.getElementById("emailOptionsBackdrop");
const emailOptionsTriggers = document.querySelectorAll(".email-options-trigger");
const assistantFab = document.getElementById("assistantFab");
const assistantPanel = document.getElementById("assistantPanel");
const assistantClose = document.getElementById("assistantClose");
const assistantForm = document.getElementById("assistantForm");
const assistantInput = document.getElementById("assistantInput");
const assistantChat = document.getElementById("assistantChat");
const assistantSuggestions = document.getElementById("assistantSuggestions");
const navPill = document.getElementById("navPill");
const navLinks = document.querySelectorAll(".main-nav a[href^='#']");
const heroCycle = document.getElementById("heroCycle");
const statValues = document.querySelectorAll(".stat-value");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (yearNode) {
  yearNode.textContent = new Date().getFullYear();
}

function applyTheme(theme) {
  root.setAttribute("data-theme", theme);
  localStorage.setItem("theme", theme);
  if (themeIcon) {
    themeIcon.innerHTML = theme === "light"
      ? '<i class="fa-solid fa-moon"></i>'
      : '<i class="fa-solid fa-sun"></i>';
  }
  if (themeText) {
    themeText.textContent = theme === "light" ? "Dark" : "Light";
  }
}

const storedTheme = localStorage.getItem("theme");
applyTheme(storedTheme === "light" ? "light" : "dark");

if (themeBtn) {
  themeBtn.addEventListener("click", () => {
    const current = root.getAttribute("data-theme");
    applyTheme(current === "light" ? "dark" : "light");
  });
}

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      el.classList.add("is-visible");

      const fill = el.querySelector(".skill-fill");
      if (fill && !fill.dataset.done) {
        fill.style.width = `${fill.dataset.fill}%`;
        fill.dataset.done = "1";
      }

      revealObserver.unobserve(el);
    });
  },
  { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
);

revealNodes.forEach((node) => revealObserver.observe(node));

if (tiltCard) {
  tiltCard.addEventListener("mousemove", (event) => {
    const rect = tiltCard.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;

    const rotateY = (x - 0.5) * 10;
    const rotateX = (0.5 - y) * 10;

    tiltCard.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  });

  tiltCard.addEventListener("mouseleave", () => {
    tiltCard.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg)";
  });
}

function movePill(link) {
  if (!navPill || !link) return;
  navPill.style.width = `${link.offsetWidth}px`;
  navPill.style.transform = `translateX(${link.offsetLeft}px)`;
  navPill.style.opacity = "1";
}

function setActiveNavLink(link) {
  navLinks.forEach((l) => l.classList.remove("active"));
  if (!link) return;
  link.classList.add("active");
  movePill(link);
}

if (navLinks.length && navPill) {
  const sectionLinkMap = new Map();
  navLinks.forEach((link) => {
    const targetId = link.getAttribute("href").slice(1);
    const section = document.getElementById(targetId);
    if (section) sectionLinkMap.set(section, link);
  });

  const spyObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const link = sectionLinkMap.get(entry.target);
        if (link) setActiveNavLink(link);
      });
    },
    { rootMargin: "-40% 0px -50% 0px", threshold: 0 }
  );

  sectionLinkMap.forEach((_, section) => spyObserver.observe(section));

  window.addEventListener("resize", () => {
    const current = document.querySelector(".main-nav a.active");
    if (current) movePill(current);
  });
}

if (!prefersReducedMotion) {
  statValues.forEach((el) => {
    const match = el.textContent.trim().match(/^(\d+)(.*)$/);
    if (!match) return;
    const target = parseInt(match[1], 10);
    const suffix = match[2];
    const duration = 1400;
    let startTime = null;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = `${Math.round(eased * target)}${suffix}`;
      if (progress < 1) window.requestAnimationFrame(step);
    }

    window.requestAnimationFrame(step);
  });
}

if (heroCycle && !prefersReducedMotion) {
  const cyclePhrases = [
    "clear business actions",
    "confident decisions",
    "actionable insights",
    "data-driven strategy"
  ];
  const typeSpeed = 45;
  const deleteSpeed = 28;
  const holdTime = 1900;
  let phraseIndex = 0;
  let charIndex = cyclePhrases[0].length;
  let deleting = false;

  function tickHeroCycle() {
    const current = cyclePhrases[phraseIndex];

    if (!deleting) {
      charIndex += 1;
      if (charIndex >= current.length) {
        heroCycle.textContent = current;
        window.setTimeout(() => {
          deleting = true;
          tickHeroCycle();
        }, holdTime);
        return;
      }
      heroCycle.textContent = current.slice(0, charIndex);
      window.setTimeout(tickHeroCycle, typeSpeed);
    } else {
      charIndex -= 1;
      heroCycle.textContent = current.slice(0, Math.max(charIndex, 0));
      if (charIndex <= 0) {
        deleting = false;
        phraseIndex = (phraseIndex + 1) % cyclePhrases.length;
        window.setTimeout(tickHeroCycle, 400);
        return;
      }
      window.setTimeout(tickHeroCycle, deleteSpeed);
    }
  }

  window.setTimeout(() => {
    deleting = true;
    tickHeroCycle();
  }, 2600);
}

function attachSpotlight(el) {
  el.addEventListener("pointermove", (event) => {
    const rect = el.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    el.style.setProperty("--spot-x", `${x}%`);
    el.style.setProperty("--spot-y", `${y}%`);
  });
}

function attachTilt(el, intensity) {
  el.addEventListener("mousemove", (event) => {
    const rect = el.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    const rotateY = (x - 0.5) * intensity;
    const rotateX = (0.5 - y) * intensity;
    el.style.transform = `translateY(-6px) perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  });
  el.addEventListener("mouseleave", () => {
    el.style.transform = "";
  });
}

if (!prefersReducedMotion) {
  document.querySelectorAll(".btn-primary, .ping-btn").forEach(attachSpotlight);
  document.querySelectorAll(".skill-card, .project-card, .cert-card").forEach((card) => attachTilt(card, 5));
}

function updateScrollProgress() {
  if (!scrollProgress) return;
  const total = document.documentElement.scrollHeight - window.innerHeight;
  const ratio = total > 0 ? (window.scrollY / total) * 100 : 0;
  scrollProgress.style.width = `${Math.min(Math.max(ratio, 0), 100)}%`;
}

window.addEventListener("scroll", updateScrollProgress, { passive: true });
updateScrollProgress();

function attachSubmitState(form) {
  if (!form) return;
  form.addEventListener("submit", () => {
    const submitBtn = form.querySelector("button[type='submit']");
    if (!submitBtn) return;
    submitBtn.textContent = "Sending...";
    submitBtn.disabled = true;
  });
}

attachSubmitState(popupForm);

function syncModalLock() {
  const isHireOpen = hirePopup && !hirePopup.hidden;
  const isEmailOpen = emailOptions && !emailOptions.hidden;
  document.body.classList.toggle("modal-open", Boolean(isHireOpen || isEmailOpen));
}

function openHirePopup() {
  if (!hirePopup || !hirePopupBackdrop) return;
  hirePopup.hidden = false;
  hirePopupBackdrop.hidden = false;
  syncModalLock();
}

function closeHirePopup() {
  if (!hirePopup || !hirePopupBackdrop) return;
  hirePopup.hidden = true;
  hirePopupBackdrop.hidden = true;
  syncModalLock();
}

function openEmailOptions() {
  if (!emailOptions || !emailOptionsBackdrop) return;
  emailOptions.hidden = false;
  emailOptionsBackdrop.hidden = false;
  syncModalLock();
}

function closeEmailOptions() {
  if (!emailOptions || !emailOptionsBackdrop) return;
  emailOptions.hidden = true;
  emailOptionsBackdrop.hidden = true;
  syncModalLock();
}

function openAssistant() {
  if (!assistantPanel) return;
  assistantPanel.hidden = false;
  if (assistantInput) assistantInput.focus();
}

function closeAssistant() {
  if (!assistantPanel) return;
  assistantPanel.hidden = true;
  if (assistantChat) {
    assistantChat.innerHTML = '<div class="assistant-msg assistant-msg-bot">Ask a question about my profile and I will answer instantly.</div>';
  }
  if (assistantInput) {
    assistantInput.value = "";
  }
}

function addAssistantMessage(text, type) {
  if (!assistantChat) return;
  const msg = document.createElement("div");
  msg.className = `assistant-msg ${type === "user" ? "assistant-msg-user" : "assistant-msg-bot"}`;
  msg.textContent = text;
  assistantChat.appendChild(msg);
  assistantChat.scrollTop = assistantChat.scrollHeight;
}

function routeToSection(sectionId, openContactPopup) {
  const section = document.getElementById(sectionId);
  if (section) {
    window.setTimeout(() => {
      const header = document.querySelector(".site-header");
      const headerOffset = header ? header.getBoundingClientRect().height + 18 : 18;
      const sectionTop = section.getBoundingClientRect().top + window.scrollY - headerOffset;
      window.scrollTo({ top: Math.max(sectionTop, 0), behavior: "smooth" });
    }, 80);
  }
  if (openContactPopup) {
    window.setTimeout(() => {
      openHirePopup();
    }, 500);
  }
}

function includesAny(text, phrases) {
  return phrases.some((phrase) => text.includes(phrase));
}

function detectSectionTarget(text) {
  if (includesAny(text, ["about", "intro", "introduction", "bio", "background", "profile"])) {
    return "about";
  }
  if (includesAny(text, ["skill", "skills", "skillset", "stack", "tech", "technology", "tools", "expertise", "strengths", "capabilities"])) {
    return "skills";
  }
  if (includesAny(text, ["experience", "work history", "employment", "jobs", "roles", "career"])) {
    return "experience";
  }
  if (includesAny(text, ["project", "projects", "portfolio", "work", "case study", "case studies", "work samples"])) {
    return "projects";
  }
  if (includesAny(text, ["certification", "certifications", "certificate", "certificates", "credential", "credentials", "course", "courses"])) {
    return "certifications";
  }
  if (includesAny(text, ["contact", "reach", "email", "linkedin", "hire", "message", "connect"])) {
    return "contact";
  }
  return "";
}

function getAssistantReply(question) {
  const q = question.toLowerCase();
  const clean = q.replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();

  const navigationPhrases = [
    "go to", "goto", "navigate", "take me", "take us", "bring me", "bring us",
    "show me", "let me see", "i want to see", "view", "open", "see", "jump to",
    "move to", "scroll to", "head to", "direct me", "land on", "lead me", "visit"
  ];
  const asksNavigation =
    includesAny(clean, navigationPhrases) ||
    includesAny(clean, ["section", "page", "tab", "menu"]);

  const target = detectSectionTarget(clean);
  if (asksNavigation && target) {
    routeToSection(target, target === "contact");
    if (target === "about") return "Taking you to the About section now.";
    if (target === "skills") return "Taking you to the Skills section now.";
    if (target === "experience") return "Taking you to the Experience section now.";
    if (target === "projects") return "Taking you to the Projects section now.";
    if (target === "certifications") return "Taking you to the Certifications section now.";
    return "Taking you to Contact now.";
  }

  if (includesAny(clean, ["skill", "tech", "tools", "stack", "expertise", "capabilities"])) {
    routeToSection("skills", false);
    return "Top skills: SQL, Python, Tableau, R, Excel, and business analytics storytelling. Taking you to the Skills section now.";
  }
  if (includesAny(clean, ["project", "portfolio", "best work", "work samples", "case studies"])) {
    routeToSection("projects", false);
    return "Start with Airbnb Market Analysis, Global Work Hours and Productivity, and VDI Log Analytics for strongest business-impact examples. Taking you to the Projects section now.";
  }
  if (includesAny(clean, ["experience", "work history", "employment", "jobs", "roles", "career"])) {
    routeToSection("experience", false);
    return "Sai's experience includes server testing, university operations reporting, data analysis, and Python full stack development. Taking you to the Experience section now.";
  }
  if (includesAny(clean, ["intern", "internship", "full time", "full-time", "available", "open to", "opportunity", "opportunities"])) {
    return "Yes. Sai is open to Data Analyst and BI opportunities, including internships and full-time roles, and is open to Remote, Hybrid, and Relocation options.";
  }
  if (includesAny(clean, ["location", "based", "where", "city", "state"])) {
    return "Sai is based in Michigan, United States.";
  }
  if (includesAny(clean, ["cert", "certificate", "certification", "credential", "course"])) {
    routeToSection("certifications", false);
    return "Certifications include Google Data Analytics, Excel Basics for Data Analysis, Google Cloud Data Analytics, Deloitte, Quantium, Tata GenAI, and Data Visualisation credentials. Taking you to the Certifications section now.";
  }
  if (includesAny(clean, ["contact", "email", "linkedin", "message", "connect"])) {
    routeToSection("contact", true);
    return "Taking you to Contact now. You can use email, LinkedIn, or the direct message form.";
  }

  routeToSection("contact", true);
  return "I do not have that exact detail here. Taking you to Contact so you can reach Sai directly for a quick response.";
}

if (headerContactBtn) {
  headerContactBtn.addEventListener("click", openHirePopup);
}

if (hirePopupClose) {
  hirePopupClose.addEventListener("click", closeHirePopup);
}

if (hirePopupBackdrop) {
  hirePopupBackdrop.addEventListener("click", closeHirePopup);
}

emailOptionsTriggers.forEach((trigger) => {
  trigger.addEventListener("click", openEmailOptions);
});

if (emailOptionsClose) {
  emailOptionsClose.addEventListener("click", closeEmailOptions);
}

if (emailOptionsBackdrop) {
  emailOptionsBackdrop.addEventListener("click", closeEmailOptions);
}

if (assistantFab) {
  assistantFab.addEventListener("click", openAssistant);
}

if (assistantClose) {
  assistantClose.addEventListener("click", closeAssistant);
}

if (assistantSuggestions) {
  assistantSuggestions.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    if (!target.classList.contains("assistant-chip")) return;
    const question = target.dataset.question;
    if (!question) return;
    addAssistantMessage(question, "user");
    addAssistantMessage(getAssistantReply(question), "bot");
  });
}

if (assistantForm) {
  assistantForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!assistantInput) return;
    const question = assistantInput.value.trim();
    if (!question) return;
    addAssistantMessage(question, "user");
    addAssistantMessage(getAssistantReply(question), "bot");
    assistantInput.value = "";
  });
}

window.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;
  if (emailOptions && !emailOptions.hidden) closeEmailOptions();
  if (hirePopup && !hirePopup.hidden) closeHirePopup();
  if (assistantPanel && !assistantPanel.hidden) closeAssistant();
});
