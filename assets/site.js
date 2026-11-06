(() => {
  const root = document.documentElement;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const header = document.querySelector(".site-header");

  // Copy-email buttons
  document.querySelectorAll("[data-copy]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const text = btn.getAttribute("data-copy");
      const label = btn.textContent;
      try {
        await navigator.clipboard.writeText(text);
        btn.textContent = "Copied";
      } catch (e) {
        btn.textContent = "Select it above";
      }
      setTimeout(() => { btn.textContent = label; }, 1800);
    });
  });

  const onScrollHeader = () => header && header.classList.toggle("scrolled", window.scrollY > 8);
  onScrollHeader();
  window.addEventListener("scroll", onScrollHeader, { passive: true });

  if (reduce) return;
  root.classList.add("motion");

  // Reveal blocks as they enter
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
  }, { threshold: 0.2, rootMargin: "0px 0px -8% 0px" });
  document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

  // Scroll-linked motion
  const heroPhone = document.querySelector(".hero-phone");
  const story = document.querySelector(".story");
  const phoneA = document.querySelector(".story-phones .phone.a");
  const phoneB = document.querySelector(".story-phones .phone.b");
  const slogan = document.querySelector(".slogan");
  const sloganText = document.querySelector(".slogan-text");
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const progress = (el) => {
    const r = el.getBoundingClientRect();
    const vh = window.innerHeight;
    return clamp((vh - r.top) / (vh + r.height), 0, 1);
  };

  let ticking = false;
  const update = () => {
    ticking = false;
    if (heroPhone) {
      const y = clamp(window.scrollY / 700, 0, 1);
      heroPhone.style.transform = `perspective(1200px) rotateY(${y * -28}deg) rotateZ(${-4 + y * 10}deg) scale(${1 - y * 0.08})`;
    }
    if (story && phoneA && phoneB) {
      const p = progress(story);
      const t = (p - 0.5) * 2; // -1 .. 1 across the section
      phoneA.style.transform = `perspective(1200px) rotateY(${18 * t}deg) rotate(${-6 + 4 * t}deg) translateY(${30 - 40 * t}px)`;
      phoneB.style.transform = `perspective(1200px) rotateY(${-14 * t}deg) rotate(${5 - 4 * t}deg) translateY(${-30 + 50 * t}px)`;
      const g = clamp(p * 2.2, 0, 1);
      story.style.setProperty("--story-bg", `radial-gradient(ellipse 70% 80% at 65% 50%, rgb(${Math.round(6 + 9 * g)} ${Math.round(8 + 82 * g)} ${Math.round(7 + 52 * g)}), #062217 70%)`);
    }
    if (slogan && sloganText) {
      const p = progress(slogan);
      sloganText.style.transform = `translateX(${(0.5 - p) * 18}%) scale(${1.05 - p * 0.1})`;
    }
  };
  const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
  update();
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
})();
