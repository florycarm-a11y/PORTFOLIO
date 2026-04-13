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

// --- Blog ---
let blogList = document.querySelector('.blog__list');
const blogSection = document.querySelector('.blog');

function formatDate(dateStr) {
    const [y, m, d] = dateStr.split('-');
    return `${d}/${m}/${y}`;
}

function renderBlogList(posts) {
    blogList.innerHTML = posts.map(post => `
        <article class="blog-card" data-slug="${post.slug}">
            <p class="blog-card__date">${formatDate(post.date)}</p>
            <h3 class="blog-card__title">${post.title}</h3>
            <p class="blog-card__excerpt">${post.excerpt}</p>
        </article>
    `).join('');

    blogList.querySelectorAll('.blog-card').forEach(card => {
        card.addEventListener('click', () => openArticle(card.dataset.slug));
    });
}

function renderArticle(post) {
    const tagsHtml = post.tags.map(t =>
        `<li class="blog-article__tag">${t}</li>`
    ).join('');

    const contentHtml = post.content.map(block => {
        if (block.type === 'heading') {
            return `<h3 class="blog-article__heading">${block.text}</h3>`;
        }
        return `<p class="blog-article__text">${block.text}</p>`;
    }).join('');

    return `
        <div class="blog-article blog-article--open">
            <button class="blog-article__back">&larr; Retour aux articles</button>
            <h2 class="blog__title">${post.title}</h2>
            <p class="blog-article__date">${formatDate(post.date)}</p>
            <ul class="blog-article__tags">${tagsHtml}</ul>
            ${contentHtml}
        </div>
    `;
}

async function openArticle(slug) {
    try {
        const res = await fetch(`blog/posts/${slug}.json`);
        const post = await res.json();
        blogSection.innerHTML = renderArticle(post);
        blogSection.querySelector('.blog-article__back').addEventListener('click', closeBlog);
        blogSection.scrollIntoView({ behavior: 'smooth' });
    } catch {
        blogList.innerHTML = '<p class="blog-card__excerpt">Impossible de charger l\'article.</p>';
    }
}

function closeBlog() {
    blogSection.innerHTML = '<h2 class="blog__title">Blog</h2><div class="blog__list"></div>';
    blogList = blogSection.querySelector('.blog__list');
    fetch('blog/index.json')
        .then(res => res.json())
        .then(posts => renderBlogList(posts));
    blogSection.scrollIntoView({ behavior: 'smooth' });
}

fetch('blog/index.json')
    .then(res => res.json())
    .then(posts => renderBlogList(posts))
    .catch(() => {
        blogList.innerHTML = '<p class="blog-card__excerpt">Impossible de charger les articles.</p>';
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
