const navbar = document.getElementById("navbar");
const navLinks = document.getElementById("navLinks");
const hamburger = document.getElementById("hamburger");

if (window.innerWidth > 480) {
  const cur = Object.assign(document.createElement("div"), { className: "cur" });
  const ring = Object.assign(document.createElement("div"), { className: "cur-ring" });
  document.body.append(cur, ring);
  const hideCursorSelector = [
    "nav",
    "nav *",
    "#nav",
    "#nav *",
    "#navbar",
    "#navbar *",
    ".navbar",
    ".navbar *",
    "a",
    "button",
    ".btn",
    "[role='button']",
    "[onclick]",
    "input",
    "select",
    "textarea",
    "label",
    "summary"
  ].join(", ");

  let mx = 0;
  let my = 0;
  let rx = 0;
  let ry = 0;

  document.addEventListener("mousemove", (e) => {
    mx = e.clientX;
    my = e.clientY;
    cur.style.left = `${mx}px`;
    cur.style.top = `${my}px`;
    const isInteractiveHover = Boolean(e.target && e.target.closest(hideCursorSelector));
    cur.style.opacity = isInteractiveHover ? "0" : "1";
    ring.style.opacity = isInteractiveHover ? "0" : "1";
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

const authToken = localStorage.getItem("sw_token");
let authUser = null;
try {
  authUser = JSON.parse(localStorage.getItem("sw_user") || "null");
} catch (error) {
  authUser = null;
}

const buildAuthLinks = () => {
  const navList = document.getElementById("navLinks") || document.getElementById("nl");
  if (!navList) return;

  const existingAuthNodes = navList.querySelectorAll(".auth-nav-item");
  existingAuthNodes.forEach((node) => node.remove());

  const user = authUser;
  if (authToken && user) {
    const profileItem = document.createElement("li");
    profileItem.className = "auth-nav-item";
    profileItem.innerHTML = `<a href="profile.html">${user.name}</a>`;
    navList.appendChild(profileItem);

  } else {
    const loginItem = document.createElement("li");
    loginItem.className = "auth-nav-item";
    loginItem.innerHTML = `<a href="login.html">Login</a>`;
    navList.appendChild(loginItem);

    const registerItem = document.createElement("li");
    registerItem.className = "auth-nav-item";
    registerItem.innerHTML = `<a href="register.html">Register</a>`;
    navList.appendChild(registerItem);
  }
};

const injectNewsletterForm = () => {
  const footerBrand = document.querySelector(".footer-brand") || document.querySelector(".fb");
  if (!footerBrand || document.getElementById("newsletterForm")) return;

  const wrapper = document.createElement("div");
  wrapper.style.marginTop = "16px";
  wrapper.innerHTML = `
    <form id="newsletterForm" style="display:flex;gap:8px;flex-wrap:wrap;">
      <input id="newsletterEmail" type="email" placeholder="Your email for updates" required
        style="flex:1;min-width:190px;background:rgba(255,255,255,0.03);border:1px solid var(--border);color:var(--white);padding:10px 12px;border-radius:10px;" />
      <button type="submit" class="btn btn-primary" style="padding:10px 14px;">Subscribe</button>
    </form>
    <p id="newsletterMessage" style="font-size:12px;color:var(--muted);margin-top:8px;"></p>
  `;
  footerBrand.appendChild(wrapper);

  const form = document.getElementById("newsletterForm");
  const emailInput = document.getElementById("newsletterEmail");
  const message = document.getElementById("newsletterMessage");
  if (!form || !emailInput || !message || typeof apiRequest !== "function") return;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    message.textContent = "";
    try {
      const data = await apiRequest("/api/newsletter/subscribe", {
        method: "POST",
        body: JSON.stringify({ email: emailInput.value.trim() })
      });
      message.textContent = data.message || "Subscribed successfully";
      emailInput.value = "";
    } catch (error) {
      message.textContent = error.message || "Subscription failed";
    }
  });
};

buildAuthLinks();
injectNewsletterForm();

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
