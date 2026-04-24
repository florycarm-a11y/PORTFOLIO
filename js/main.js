// ========================================
// MonPortfolio — Main JavaScript
// ========================================

// --- Theme toggle ---
const root = document.documentElement;
const themeToggle = document.querySelector('.nav__theme-toggle');

function setTheme(mode) {
    root.classList.toggle('light', mode === 'light');
    localStorage.setItem('theme', mode);
}

const saved = localStorage.getItem('theme');
if (saved) {
    setTheme(saved);
} else if (window.matchMedia('(prefers-color-scheme: light)').matches) {
    setTheme('light');
}

themeToggle.addEventListener('click', () => {
    const next = root.classList.contains('light') ? 'dark' : 'light';
    setTheme(next);
});

// --- Mobile nav toggle ---
const hamburger = document.querySelector('.nav__hamburger');
const navList = document.querySelector('.nav__list');

hamburger.addEventListener('click', () => {
    const isOpen = navList.classList.toggle('nav__list--open');
    hamburger.classList.toggle('nav__hamburger--active');
    hamburger.setAttribute('aria-expanded', isOpen);
});

// --- Fade-in on scroll ---
const sections = document.querySelectorAll('section');
sections.forEach(section => section.classList.add('fade-in'));

const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in--visible');
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.15 });

sections.forEach(section => observer.observe(section));

// --- Projects ---
const projectsGrid = document.querySelector('.projects__grid');

function renderProjects(projects) {
    projectsGrid.innerHTML = projects.map(p => {
        const tagsHtml = p.tags.map(t =>
            `<li class="project-card__tag">${t}</li>`
        ).join('');

        const githubLink = p.url
            ? `<a class="project-card__link" href="${p.url}" target="_blank" rel="noopener noreferrer">Voir sur GitHub</a>`
            : '';

        const homepageLink = p.homepage
            ? `<a class="project-card__link" href="${p.homepage}" target="_blank" rel="noopener noreferrer">Voir en ligne</a>`
            : '';

        const titleHtml = p.url
            ? `<a href="${p.url}" target="_blank" rel="noopener noreferrer">${p.name}</a>`
            : p.name;

        return `
            <article class="project-card">
                <div class="project-card__banner"></div>
                <div class="project-card__body">
                    <h3 class="project-card__title">${titleHtml}</h3>
                    <p class="project-card__desc">${p.description}</p>
                    <ul class="project-card__tags">${tagsHtml}</ul>
                    <div class="project-card__links">
                        ${githubLink}
                        ${homepageLink}
                    </div>
                </div>
            </article>
        `;
    }).join('');
}

fetch('data/projects.json')
    .then(res => res.json())
    .then(renderProjects)
    .catch(() => {
        projectsGrid.innerHTML = '<p class="project-card__desc">Impossible de charger les projets.</p>';
    });

// --- Contact form ---
const contactForm = document.getElementById('contact-form');
contactForm.addEventListener('submit', e => {
    e.preventDefault();
    const name = contactForm.querySelector('#name').value;
    const email = contactForm.querySelector('#email').value;
    const message = contactForm.querySelector('#message').value;
    const subject = encodeURIComponent(`Contact portfolio | ${name}`);
    const body = encodeURIComponent(`De : ${name} (${email})\n\n${message}`);
    window.location.href = `mailto:floryanleblancarm@gmail.com?subject=${subject}&body=${body}`;
});

// --- Close mobile nav on link click ---
navList.querySelectorAll('.nav__link').forEach(link => {
    link.addEventListener('click', () => {
        navList.classList.remove('nav__list--open');
        hamburger.classList.remove('nav__hamburger--active');
        hamburger.setAttribute('aria-expanded', 'false');
    });
});

// --- Dynamic title trait (grows/shrinks with scroll) ---
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!reduceMotion) {
    const titles = document.querySelectorAll(
        '.about__title, .projects__title, .blog__title, .contact__title'
    );
    const MIN_PX = 16;

    function updateTraits() {
        const vh = window.innerHeight;
        titles.forEach(t => {
            const rect = t.getBoundingClientRect();
            const progress = Math.max(0, Math.min(1, 1 - rect.top / vh));
            const maxPx = t.offsetWidth;
            const widthPx = MIN_PX + progress * (maxPx - MIN_PX);
            t.style.setProperty('--trait-w', `${widthPx.toFixed(1)}px`);
        });
    }

    let ticking = false;
    function onScroll() {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
            updateTraits();
            ticking = false;
        });
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    updateTraits();
}
