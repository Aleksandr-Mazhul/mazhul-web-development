const projects = [
  {
    title: "Neural Analytics",
    category: "interfaces",
    image: "images/works/video-player.png",
    link: "works/video-player/index.html",
    description: "Интерфейс аналитики с акцентом на иерархию данных и читаемость.",
    featured: true
  },
  {
    title: "Aurora Landing",
    category: "web",
    image: "images/works/moon.png",
    link: "works/moon/index.html",
    description: "Промо-страница с атмосферным светом, крупной типографикой и ритмом блоков."
  },
  {
    title: "Motion UI Concept",
    category: "concepts",
    image: "images/works/gallery.png",
    link: "works/gallery/index.html",
    description: "Концепт motion-переходов и анимированной композиции интерфейса."
  },
  {
    title: "Interactive Dashboard",
    category: "ui",
    image: "images/works/map.png",
    link: "works/map/index.html",
    description: "UI-макет панели мониторинга с картами, метриками и карточной системой."
  },
  {
    title: "Cinematic Commerce",
    category: "interfaces",
    image: "images/works/pigfly.png",
    link: "works/pigfly/index.html",
    description: "Экранные композиции для e-commerce с кинематографичным контрастом."
  },
  {
    title: "Glass Portfolio",
    category: "web",
    image: "images/works/table.png",
    link: "works/table/index.html",
    description: "Исследование стеклянной эстетики в портфолио-структуре и сетках."
  },
  {
    title: "Form UX Flow",
    category: "interfaces",
    image: "images/works/Form5.png",
    link: "works/Form5/index.html",
    description: "Формы с фокусом на структуру полей, контрасты и понятные состояния ввода."
  },
  {
    title: "Business Card",
    category: "ui",
    image: "images/works/businessСard.png",
    link: "works/businessСard/index.html",
    description: "Мини-проект о композиции визитки: типографика, отступы и баланс блоков."
  }
];

const initReveal = () => {
  const revealItems = Array.from(document.querySelectorAll('[data-reveal]'));
  if (revealItems.length === 0) {
    return;
  }

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {threshold: 0.15},
    );

    revealItems.forEach((item) => observer.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add('is-visible'));
  }
};

const initActiveNav = () => {
  const page = document.body?.dataset?.page;
  if (!page) {
    return;
  }

  document.querySelectorAll('[data-nav]').forEach((link) => {
    if (link.dataset.nav === page) {
      link.classList.add('is-active');
    }
  });
};

const createWorkCard = (project) => {
  const card = document.createElement('article');
  card.className = 'work-card glass';
  if (project.featured) {
    card.classList.add('is-featured');
  }
  card.dataset.category = project.category;

  card.innerHTML = `
    <a class="work-link" href="${project.link}">
      <div class="browser-frame">
        <div class="browser-top">
          <span class="browser-dot"></span>
          <span class="browser-dot"></span>
          <span class="browser-dot"></span>
        </div>
        <div class="browser-preview">
          <img src="${project.image}" alt="${project.title}">
        </div>
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

const applyFilter = (filterValue) => {
  const cards = document.querySelectorAll('.work-card');
  cards.forEach((card) => {
    const matches = filterValue === 'all' || card.dataset.category === filterValue;
    card.classList.toggle('is-filtered', !matches);
    card.classList.toggle('is-hidden', !matches);
  });
};

const initWorks = () => {
  const grid = document.getElementById('worksGrid');
  if (!grid) {
    return;
  }

  grid.innerHTML = '';
  projects.forEach((project) => {
    grid.appendChild(createWorkCard(project));
  });

  const filterButtons = document.querySelectorAll('[data-filter]');
  filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      filterButtons.forEach((btn) => btn.classList.remove('is-active'));
      button.classList.add('is-active');
      applyFilter(button.dataset.filter);
    });
  });
};

const initPage = () => {
  initReveal();
  initActiveNav();
  initWorks();
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initPage);
} else {
  initPage();
}
