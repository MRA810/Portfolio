// ===================== Custom cursor =====================
const cursor = document.getElementById("cursor");
const ring = document.getElementById("cursor-ring");
let mx = 0,
  my = 0,
  rx = 0,
  ry = 0;

if (cursor && ring) {
  document.addEventListener("mousemove", (e) => {
    mx = e.clientX;
    my = e.clientY;
  });
  (function animCursor() {
    rx += (mx - rx) * 0.14;
    ry += (my - ry) * 0.14;
    cursor.style.left = mx + "px";
    cursor.style.top = my + "px";
    ring.style.left = rx + "px";
    ring.style.top = ry + "px";
    requestAnimationFrame(animCursor);
  })();
  document
    .querySelectorAll(
      "a,button,.journey-card,.skill-cluster,.sc-tag,.proj-card,.cert-card",
    )
    .forEach((el) => {
      el.addEventListener("mouseenter", () => {
        cursor.style.width = "18px";
        cursor.style.height = "18px";
        ring.style.borderColor = "var(--green-sage)";
      });
      el.addEventListener("mouseleave", () => {
        cursor.style.width = "12px";
        cursor.style.height = "12px";
        ring.style.borderColor = "var(--sea-mint)";
      });
    });
}

// ===================== Scroll progress bar =====================
const bar = document.getElementById("progress-bar");
if (bar) {
  window.addEventListener("scroll", () => {
    const pct =
      (window.scrollY / (document.body.scrollHeight - window.innerHeight)) *
      100;
    bar.style.width = pct + "%";
  });
}

// ===================== Navbar scroll =====================
const nav = document.getElementById("navbar");
if (nav) {
  window.addEventListener("scroll", () => {
    nav.classList.toggle("scrolled", window.scrollY > 40);
  });
}

// ===================== Hamburger toggle (mobile) =====================
const navToggle = document.getElementById("nav-toggle");
const navLinks = document.getElementById("nav-links");
const navToggleIcon = document.getElementById("nav-toggle-icon");

if (navToggle && navLinks) {
  navToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");
    if (navToggleIcon) {
      navToggleIcon.className = isOpen ? "bi bi-x-lg" : "bi bi-list";
    }
    navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
  });

  // Close menu when a nav link is clicked
  navLinks.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", () => {
      if (navLinks.classList.contains("open")) {
        navLinks.classList.remove("open");
        if (navToggleIcon) navToggleIcon.className = "bi bi-list";
        navToggle.setAttribute("aria-expanded", "false");
      }
    });
  });

  // Close on resize to desktop
  window.addEventListener("resize", () => {
    if (window.innerWidth > 768 && navLinks.classList.contains("open")) {
      navLinks.classList.remove("open");
      if (navToggleIcon) navToggleIcon.className = "bi bi-list";
      navToggle.setAttribute("aria-expanded", "false");
    }
  });
}

// ===================== Scroll reveal =====================
const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) e.target.classList.add("visible");
    });
  },
  { threshold: 0.12 },
);

document
  .querySelectorAll(
    ".reveal, .tl-item, .journey-card, .skill-cluster, .cert-card, .proj-card",
  )
  .forEach((el) => io.observe(el));

// Stagger journey cards
document.querySelectorAll(".journey-card").forEach((c, i) => {
  c.style.transitionDelay = i * 0.08 + "s";
  c.style.transition =
    "opacity 0.55s ease, transform 0.55s ease, border-color 0.3s, box-shadow 0.3s";
});

// Stagger skill clusters
document.querySelectorAll(".skill-cluster").forEach((c, i) => {
  c.style.transitionDelay = i * 0.1 + "s";
});

// Stagger timeline items
document.querySelectorAll(".tl-item").forEach((c, i) => {
  c.style.transitionDelay = i * 0.15 + "s";
});

// Stagger project cards
document.querySelectorAll(".proj-card").forEach((c, i) => {
  c.style.transitionDelay = i * 0.12 + "s";
});
