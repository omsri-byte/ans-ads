/* =========================================
   AOS — Animate On Scroll
========================================= */
AOS.init({
  duration: 700,
  easing: "ease-out-quart",
  once: false,
  mirror: true
});


/* =========================================
   Mobile Menu
========================================= */
const burger = document.getElementById("burger");
const panel = document.getElementById("mobile-panel");

burger.addEventListener("click", () => {
  panel.classList.toggle("open");
  // optional: lock body scroll when mobile menu open
  if (panel.classList.contains("open")) {
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "";
  }
});

panel.querySelectorAll("a").forEach((a) => {
  a.addEventListener("click", () => {
    panel.classList.remove("open");
    document.body.style.overflow = "";
  });
});


/* =========================================
   Smooth Scroll + ScrollSpy
========================================= */
const links = document.querySelectorAll(
  ".menu a, .mobile-menu a, .hero-cta a, .btn-outline, .btn"
);
const sections = Array.from(document.querySelectorAll("section, header")).filter(
  (x) => x.id
);

links.forEach((l) => {
  l.addEventListener("click", (e) => {
    const href = l.getAttribute("href");
    if (href && href.startsWith("#")) {
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  });
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        document
          .querySelectorAll(".menu a")
          .forEach((a) => a.classList.remove("active"));

        const active = document.querySelector(
          `.menu a[href="#${entry.target.id}"]`
        );
        if (active) active.classList.add("active");
      }
    });
  },
  { threshold: 0.6 }
);

sections.forEach((s) => observer.observe(s));


/* =========================================
   Stats Counter
========================================= */
const counters = document.querySelectorAll("[data-count]");

const onView = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const end = parseInt(el.getAttribute("data-count"), 10);

        let cur = 0;
        const inc = Math.ceil(end / 60);

        const tick = () => {
          cur += inc;
          if (cur >= end) {
            el.textContent = end.toLocaleString();
            return;
          }
          el.textContent = cur.toLocaleString();
          requestAnimationFrame(tick);
        };

        tick();
        onView.unobserve(el);
      }
    });
  },
  { threshold: 0.6 }
);

counters.forEach((c) => onView.observe(c));


/* =========================================
   Contact Form (Fake Async)
========================================= */
const form = document.getElementById("contactForm");
const statusMsg = document.getElementById("formStatus");

if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    statusMsg.textContent = "Sending...";

    try {
      await new Promise((r) => setTimeout(r, 900));
      statusMsg.textContent = "Thanks! We will contact you shortly.";
      form.reset();
    } catch (err) {
      statusMsg.textContent = "Something went wrong. Please try again.";
    }
  });
}


/* =========================================
   Footer Year
========================================= */
document.getElementById("year").textContent = new Date().getFullYear();


/* =========================================
   Hero Video Parallax
========================================= */
(function () {
  const video = document.getElementById("heroVideo");
  if (!video) return;

  const prefersReduced = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;
  if (prefersReduced) return;

  let ticking = false;

  function onScroll() {
    if (ticking) return;

    window.requestAnimationFrame(() => {
      const y = window.scrollY || window.pageYOffset;
      const translate = Math.min(40, y * 0.06);
      video.style.transform = `translateY(${translate}px) scale(1.02)`;
      ticking = false;
    });

    ticking = true;
  }

  window.addEventListener("scroll", onScroll, { passive: true });
})();


/* =========================
   AD TYPES — middle-scroll UX
   ========================= */
(function() {

  /* DOM ELEMENTS */
  const items = Array.from(document.querySelectorAll(".adtypes-item"));
  const titleBox = document.getElementById("adtypesTitle");
  const descBox = document.getElementById("adtypesDesc");
  const tagsBox = document.getElementById("adtypesTags");
  const imageBox = document.getElementById("adtypesImage");
  const contentBox = document.querySelector(".adtypes-card-content");

  if (!items.length || !titleBox || !descBox || !imageBox || !contentBox) {
    return;
  }

  /* AD DATA */
  const adData = {
    tbi: {
      title: "Tickey Banner Interstitial",
      desc: "High-impact fullscreen transitions for awareness. CLS-safe with frequency controls and optimized triggers.",
      tags: ["Awareness", "CLS-safe", "High Visibility"],
      img: "images/tbi.png"
    },
    rewarded: {
      title: "Rewarded Video Ads",
      desc: "Users opt-in to watch a video for a reward. High engagement — perfect for apps and games.",
      tags: ["Opt-in", "High Completion", "Gaming"],
      img: "images/rewarded.png"
    },
    video: {
      title: "Video Ads",
      desc: "Auto-play or click-to-play video units for brand lift and performance.",
      tags: ["VAST", "Brand Lift", "High CTR"],
      img: "images/video.png"
    },
    sidebanner: {
      title: "Side Banner",
      desc: "Static or rich media sidebar banners with guaranteed visibility.",
      tags: ["Non-intrusive", "Reliable CPM", "Brand Safe"],
      img: "images/sidebanner.png"
    }
  };

  /* STATE */
  let currentIndex = 0;
  let busy = false;

  /* LEFT ITEM ACTIVE UNDERLINE */
  function updateLeftList(i) {
    items.forEach((it, idx) => {
      it.classList.toggle("active", idx === i);

      const fill = it.querySelector(".adtypes-underline-fill");
      if (!fill) return;

      fill.style.transitionDuration = "0ms";
      fill.style.width = "0%";

      if (idx === i) {
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            fill.style.transitionDuration = "3000ms";
            fill.style.width = "100%";
          });
        });
      }
    });
  }

  /* MAIN SWITCH FUNCTION */
  function showIndex(i) {
    if (busy || i === currentIndex) return;

    busy = true;
    currentIndex = i;

    const key = items[i].dataset.key;
    const data = adData[key];

    updateLeftList(i);

    /* EXIT ANIMATION */
    contentBox.classList.remove("enter");
    imageBox.classList.remove("enter");

    contentBox.classList.add("exit");
    imageBox.classList.add("exit");

    /* UPDATE DATA */
    setTimeout(() => {

      titleBox.textContent = data.title;
      descBox.textContent = data.desc;

      tagsBox.innerHTML = "";
      data.tags.forEach(t => {
        const tag = document.createElement("span");
        tag.className = "tag";
        tag.textContent = t;
        tagsBox.appendChild(tag);
      });

      imageBox.src = data.img;

      /* ENTER ANIMATION */
      setTimeout(() => {
        contentBox.classList.remove("exit");
        imageBox.classList.remove("exit");

        void imageBox.offsetWidth;

        contentBox.classList.add("enter");
        imageBox.classList.add("enter");

        busy = false;

      }, 40);

    }, 150);
  }

  /* CLICK HANDLERS */
  items.forEach((it, idx) => {
    it.addEventListener("click", () => {
      showIndex(idx);
      clearInterval(autoTimer);
      autoTimer = setInterval(autoRotate, 4000);
    });
  });

  /* AUTO ROTATE */
  let autoIndex = 0;

  function autoRotate() {
    autoIndex = (autoIndex + 1) % items.length;
    showIndex(autoIndex);
  }

  let autoTimer = setInterval(autoRotate, 4000);

})();

/* =========================
   WHO carousel + animations
========================= */
(function whoCarousel() {

  if (window.__whoCarouselInitialized) return;
  window.__whoCarouselInitialized = true;

  document.addEventListener('DOMContentLoaded', () => {

    /* --------------------
       CAROUSEL ELEMENTS
    ---------------------*/
    const whoImg    = document.getElementById('whoImage');
    const whoDesc   = document.getElementById('whoDesc');
    const prevBtn   = document.querySelector('.who-prev');
    const nextBtn   = document.querySelector('.who-next');
    const counter   = document.getElementById('whoCounter');
    const circleFG  = document.querySelector('.who-circle-fg');      // optional now
    const carouselRoot = document.querySelector('.who-carousel');    // right glass card

    /* -------------------------
       WHO SECTION — Fade Anim
    ------------------------- */
    const whoFadeItems = document.querySelectorAll('.who-fade-left, .who-fade-right');

    if (whoFadeItems.length) {
      const fadeObs = new IntersectionObserver((entries)=>{
        entries.forEach(entry=>{
          if (entry.isIntersecting) {
            entry.target.classList.add('show');
          }
        });
      }, { threshold: 0.4 });

      whoFadeItems.forEach(el => fadeObs.observe(el));
    }

    /* If key elements are missing, stop carousel logic */
    if (!whoImg || !whoDesc || !prevBtn || !nextBtn || !counter) {
      return;
    }

    /* SLIDES */
    const slides = [
      { img: 'images/who1.png', text: 'We help publishers scale ADX/MCM revenue with deep optimization across floors, bidders, and latency.' },
      { img: 'images/who2.png', text: 'We work for MCM companies to improve eCPM by optimizing revenue with proprietary tools.' },
      { img: 'images/who3.png', text: 'We provide DM services for e-commerce sites, improving ROAS and conversions.' },
      { img: 'images/who4.png', text: 'Our team specializes in Google Ads, native, and Facebook ad strategies.' }
    ];

    let idx = 0;
    const DURATION = 4000;
    let running = true;
    let startTs = null;
    let rafId = null;

    /* PROGRESS RING (safe if missing) */
    function setProgress(percentage) {
      if (!circleFG) return;  // prevent crash if SVG not present
      const offset = 100 - Math.min(100, percentage);
      circleFG.style.strokeDashoffset = String(offset);
    }

    /* SLIDE RENDERING */
    function renderSlide(newIdx, direction = 'next') {
      const s = slides[newIdx];

      whoImg.classList.remove('who-fade-slide-left', 'who-fade-slide-right', 'show');
      whoDesc.classList.remove('who-fade-slide-left', 'who-fade-slide-right', 'show');

      const imgClass  = (direction === 'next') ? 'who-fade-slide-right' : 'who-fade-slide-left';
      const descClass = (direction === 'next') ? 'who-fade-slide-left'  : 'who-fade-slide-right';

      setTimeout(() => {
        whoImg.src = s.img;
        whoDesc.textContent = s.text;

        whoImg.classList.add(imgClass);
        whoDesc.classList.add(descClass);

        void whoImg.offsetWidth;
        void whoDesc.offsetWidth;

        whoImg.classList.add('show');
        whoDesc.classList.add('show');
      }, 60);

      counter.textContent = `${newIdx + 1} / ${slides.length}`;
      setProgress(0);
      startTs = performance.now();
    }

    /* NEXT / PREV */
    function next() {
      idx = (idx + 1) % slides.length;
      renderSlide(idx, 'next');
    }
    function prev() {
      idx = (idx - 1 + slides.length) % slides.length;
      renderSlide(idx, 'prev');
    }

    /* AUTOPLAY LOOP */
    function step(ts) {
      if (!startTs) startTs = ts;
      const elapsed = ts - startTs;
      const pct = (elapsed / DURATION) * 100;

      setProgress(pct);

      if (elapsed >= DURATION) {
        startTs = ts;
        idx = (idx + 1) % slides.length;
        renderSlide(idx, 'next');
      }

      if (running) rafId = requestAnimationFrame(step);
    }

    renderSlide(idx);
    startTs = performance.now();
    rafId = requestAnimationFrame(step);

    /* BUTTONS */
    nextBtn.addEventListener('click', () => {
      running = false;
      next();
      setTimeout(() => {
        running = true;
        startTs = performance.now();
        rafId = requestAnimationFrame(step);
      }, 150);
    });

    prevBtn.addEventListener('click', () => {
      running = false;
      prev();
      setTimeout(() => {
        running = true;
        startTs = performance.now();
        rafId = requestAnimationFrame(step);
      }, 150);
    });

    /* HOVER PAUSE (only if root exists) */
    if (carouselRoot) {
      carouselRoot.addEventListener('mouseenter', () => running = false);
      carouselRoot.addEventListener('mouseleave', () => {
        if (!running) {
          running = true;
          startTs = performance.now();
          rafId = requestAnimationFrame(step);
        }
      });

      /* SWIPE */
      let touchStartX = 0;
      let touchEndX = 0;

      carouselRoot.addEventListener('touchstart', e => {
        if (e.touches?.[0]) touchStartX = e.touches[0].clientX;
        running = false;
      });

      carouselRoot.addEventListener('touchmove', e => {
        if (e.touches?.[0]) touchEndX = e.touches[0].clientX;
      });

      carouselRoot.addEventListener('touchend', () => {
        const dx = touchEndX - touchStartX;
        if (Math.abs(dx) > 40) dx < 0 ? next() : prev();

        setTimeout(() => {
          running = true;
          startTs = performance.now();
          rafId = requestAnimationFrame(step);
        }, 150);
      });
    }

  });
  document.addEventListener('DOMContentLoaded', () => {
  const whoFadeItems = document.querySelectorAll('.who-fade-left, .who-fade-right');

  if (!whoFadeItems.length) {
    console.warn('No WHO fade items found');
    return;
  }

  const fadeObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('show');
        // optional: stop observing after first reveal
        fadeObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  whoFadeItems.forEach(el => fadeObs.observe(el));
})


document.addEventListener("DOMContentLoaded", () => {

  const items = document.querySelectorAll(".who-fade-left, .who-fade-right");

  const observer = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
        entry.target.classList.remove("hide");
      } else {
        entry.target.classList.remove("show");
        entry.target.classList.add("hide");   // fade again on next scroll
      }
    });
  }, { threshold: 0.25 });

  items.forEach(el => observer.observe(el));
});



})();
