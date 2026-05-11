const projects = [
  {
    title: "Neural Analytics",
    category: "interfaces",
    image: "images/works/work-01.svg",
    link: "works/video-player/index.html",
    description: "Интерфейс аналитики с акцентом на иерархию данных и читаемость.",
    featured: true
  },
  {
    title: "Aurora Landing",
    category: "web",
    image: "images/works/work-02.svg",
    link: "works/moon/index.html",
    description: "Промо-страница с атмосферным светом, крупной типографикой и ритмом блоков."
  },
  {
    title: "Motion UI Concept",
    category: "concepts",
    image: "images/works/work-03.svg",
    link: "works/gallery/index.html",
    description: "Концепт motion-переходов и анимированной композиции интерфейса."
  },
  {
    title: "Interactive Dashboard",
    category: "ui",
    image: "images/works/work-04.svg",
    link: "works/map/index.html",
    description: "UI-макет панели мониторинга с картами, метриками и карточной системой."
  },
  {
    title: "Cinematic Commerce",
    category: "interfaces",
    image: "images/works/work-05.svg",
    link: "works/pigfly/index.html",
    description: "Экранные композиции для e-commerce с кинематографичным контрастом."
  },
  {
    title: "Glass Portfolio",
    category: "web",
    image: "images/works/work-06.svg",
    link: "works/table/index.html",
    description: "Исследование стеклянной эстетики в портфолио-структуре и сетках."
  }
];

const setActiveNav = () => {
  const page = document.body.dataset.page;
  document.querySelectorAll("[data-nav]").forEach((link) => {
    link.classList.toggle("is-active", link.dataset.nav === page);
  });
};

const setupReveal = () => {
  const revealEls = document.querySelectorAll("[data-reveal]");
  if (!revealEls.length || !("IntersectionObserver" in window)) {
    revealEls.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      obs.unobserve(entry.target);
    });
  }, { threshold: 0.16 });

  revealEls.forEach((el, index) => {
    el.style.transitionDelay = `${Math.min(index * 70, 320)}ms`;
    observer.observe(el);
  });
};

const setupTilt = () => {
  document.querySelectorAll(".tilt-card").forEach((card) => {
    card.addEventListener("mousemove", (event) => {
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(900px) rotateX(${(-y * 4).toFixed(2)}deg) rotateY(${(x * 6).toFixed(2)}deg) translateY(-4px)`;
    });
    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
    });
  });
};

const createWorkCard = (project) => {
  const card = document.createElement("article");
  card.className = "work-card glass";
  if (project.featured) card.classList.add("is-featured");
  card.dataset.category = project.category;
  card.setAttribute("data-reveal", "");

  card.innerHTML = `
    <a class="work-link" href="${project.link}" target="_blank" rel="noopener noreferrer" aria-label="Open ${project.title} in a new tab">
      <div class="browser-frame">
        <div class="browser-top" aria-hidden="true">
          <span class="browser-dot"></span>
          <span class="browser-dot"></span>
          <span class="browser-dot"></span>
        </div>
        <figure class="browser-preview">
          <img src="${project.image}" alt="Preview of ${project.title}" loading="lazy">
        </figure>
      </div>
      <div class="work-content">
        <span class="work-category">${project.category}</span>
        <h3 class="work-title">${project.title}</h3>
        <p class="work-description">${project.description}</p>
      </div>
    </a>
  `;

  return card;
};

const renderWorks = () => {
  const grid = document.getElementById("worksGrid");
  if (!grid) return;

  const fragment = document.createDocumentFragment();
  projects.forEach((project) => {
    fragment.append(createWorkCard(project));
  });
  grid.append(fragment);

  const filterButtons = document.querySelectorAll(".filter-btn");
  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const selected = button.dataset.filter;
      filterButtons.forEach((btn) => btn.classList.remove("is-active"));
      button.classList.add("is-active");

      const cards = grid.querySelectorAll(".work-card");
      cards.forEach((card, index) => {
        const show = selected === "all" || card.dataset.category === selected;
        if (show) {
          card.classList.remove("is-hidden");
          requestAnimationFrame(() => {
            card.style.transitionDelay = `${Math.min(index * 30, 180)}ms`;
            card.classList.remove("is-filtered");
          });
          return;
        }

        card.style.transitionDelay = "0ms";
        card.classList.add("is-filtered");
        setTimeout(() => {
          if (card.classList.contains("is-filtered")) card.classList.add("is-hidden");
        }, 260);
      });
    });
  });
};

const init = () => {
  setActiveNav();
  renderWorks();
  setupReveal();
  setupTilt();
};

document.addEventListener("DOMContentLoaded", init);
