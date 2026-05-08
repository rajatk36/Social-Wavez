const navbar = document.getElementById("navbar");
const navLinks = document.getElementById("navLinks");
const hamburger = document.getElementById("hamburger");

if (window.innerWidth > 480) {
  const cur = Object.assign(document.createElement("div"), { className: "cur" });
  const ring = Object.assign(document.createElement("div"), { className: "cur-ring" });
  document.body.append(cur, ring);
  const navHoverSelector = "nav, nav *, #nav, #nav *, #navbar, #navbar *, .navbar, .navbar *";

  let mx = 0;
  let my = 0;
  let rx = 0;
  let ry = 0;

  document.addEventListener("mousemove", (e) => {
    mx = e.clientX;
    my = e.clientY;
    cur.style.left = `${mx}px`;
    cur.style.top = `${my}px`;
    const isNavHover = Boolean(e.target && e.target.closest(navHoverSelector));
    cur.style.opacity = isNavHover ? "0" : "1";
    ring.style.opacity = isNavHover ? "0" : "1";
  });

  const animateRing = () => {
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    ring.style.left = `${rx}px`;
    ring.style.top = `${ry}px`;
    requestAnimationFrame(animateRing);
  };
  animateRing();
}

if (navbar) {
  const syncNavbarState = () => {
    navbar.classList.toggle("scrolled", window.scrollY > 16);
  };

  syncNavbarState();
  window.addEventListener("scroll", syncNavbarState, { passive: true });
}

if (hamburger && navLinks) {
  hamburger.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");
    hamburger.classList.toggle("open", isOpen);
  });

  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("open");
      hamburger.classList.remove("open");
    });
  });
}

const revealItems = document.querySelectorAll("[data-scroll-reveal]");

if (revealItems.length) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const delay = Number(entry.target.getAttribute("data-delay") || 0);
        window.setTimeout(() => entry.target.classList.add("revealed"), delay);
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -10% 0px" }
  );

  revealItems.forEach((item) => revealObserver.observe(item));
}

const counters = document.querySelectorAll(".counter[data-target]");
if (counters.length) {
  const counterObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const el = entry.target;
        const target = Number(el.getAttribute("data-target")) || 0;
        const duration = 1400;
        const startTime = performance.now();

        const tick = (time) => {
          const progress = Math.min((time - startTime) / duration, 1);
          const value = Math.floor(target * progress);
          el.textContent = String(value);
          if (progress < 1) requestAnimationFrame(tick);
          else el.textContent = String(target);
        };

        requestAnimationFrame(tick);
        observer.unobserve(el);
      });
    },
    { threshold: 0.4 }
  );

  counters.forEach((counter) => counterObserver.observe(counter));
}
