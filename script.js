
// hamburger menu toggle
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
const navClose = document.getElementById('navClose');

navToggle.addEventListener('click', () => {
  const open = navMenu.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', String(open));
});

navClose.addEventListener('click', () => {
  navMenu.classList.remove('open');
  navToggle.setAttribute('aria-expanded', 'false');
});

// Active link on scroll
const links = [...document.querySelectorAll('.nav-link')];
const sections = links.map(a => document.querySelector(a.getAttribute('href')));

const setActive = () => {
  const y = window.scrollY + 120;
  let activeId = '#top';
  for (const sec of sections) {
    if (sec && sec.offsetTop <= y) activeId = `#${sec.id}`;
  }
  links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === activeId));
};
window.addEventListener('scroll', setActive);
setActive();

// Footer year
document.getElementById('year').textContent = new Date().getFullYear();

// displayed stats
const stats = { hours: 287, members: 60, projects: 4 };

const animateCount = (el, target, duration = 900, plus = false) => {
  const start = performance.now();

  const step = now => {
    const p = Math.min(1, (now - start) / duration);
    el.textContent = Math.floor(p * target).toLocaleString() + (p === 1 && plus ? '+' : '');
    if (p < 1) requestAnimationFrame(step);
  };

  requestAnimationFrame(step);
};

animateCount(document.getElementById('hoursStat'), stats.hours);
animateCount(document.getElementById('membersStat'), stats.members, 900, true); // will show 60+
animateCount(document.getElementById('projectsStat'), stats.projects);


// FILTER / SEARCH FOR STATIC HTML EVENTS
const eventSearch = document.getElementById('eventSearch');
const eventFilter = document.getElementById('eventFilter');
const eventsGrid = document.getElementById('eventsGrid');
const eventsEmpty = document.getElementById('eventsEmpty');

const filterEvents = () => {
  const q = eventSearch.value.trim().toLowerCase();
  const type = eventFilter.value;
  const cards = [...eventsGrid.querySelectorAll('.card.event')];
  let anyVisible = false;

  cards.forEach(card => {
    const title = card.querySelector('h3').textContent.toLowerCase();
    const blurb = card.querySelector('p').textContent.toLowerCase();
    const location = card.querySelector('.meta').textContent.toLowerCase();

    // multiple types supported
    const cardTypes = card.dataset.type.split(" "); 

    const matches = 
      (type === 'all' || cardTypes.includes(type)) &&
      (q === '' || title.includes(q) || blurb.includes(q) || location.includes(q));

    card.style.display = matches ? '' : 'none';
    if (matches) anyVisible = true;
  });

  eventsEmpty.hidden = anyVisible;
};

eventSearch.addEventListener('input', filterEvents);
eventFilter.addEventListener('change', filterEvents);


// 2025-2026 officers
const OFFICERS = [
  { 
    name: "Ms. Rabalais", 
    role: "Advisor", 
    email: "lrabalais@medford.k12.ma.us",
    image: "/imgs/lmrab.jpeg"
  },
  
  { 
    name: "Victor Mendes", 
    role: "President", 
    email: "vmendes27@medford.k12.ma.us"
  },
  
  { 
    name: "Jayden Wu", 
    role: "Vice President", 
    email: "jwu27@medford.k12.ma.us" 
  },
  
  { name: "Owen Barczak-Kroll", 
    role: "Secretary", 
    email: "obarczakkroll27@medford.k12.ma.us" 
  },
  
  { name: "Andrew Huang", 
    role: "Treasurer", 
    email: "ahuang27@medford.k12.ma.us" 
  }
];

// officers cards
const officersGrid = document.getElementById('officersGrid');
OFFICERS.forEach(p => {
  const card = document.createElement('article');
  card.className = 'card person';

  // use image, if not, avaatar
  const photo = p.image 
    ? p.image 
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(p.name)}&background=2d87ff&color=ffffff&size=128`;

  card.innerHTML = `
    <img src="${photo}" alt="${p.name}" class="person-photo" />
    <h3>${p.name}</h3>
    <div class="meta">${p.role}</div>
    <a class="btn ghost" href="mailto:${p.email}">Contact</a>
  `;
  officersGrid.appendChild(card);
});

// join form
const form = document.getElementById('joinForm');
const showErr = (id, msg) => {
  const el = document.getElementById(id);
  el.textContent = msg || '';
};

form.addEventListener('submit', e => {
  e.preventDefault();
  const name = form.name.value.trim();
  const email = form.email.value.trim();
  const grad = form.grad.value.trim();
  let ok = true;

  if (!name) {
    showErr('nameError', 'Please enter your full name.');
    ok = false;
  } else showErr('nameError');

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    showErr('emailError', 'Enter a valid email.');
    ok = false;
  } else showErr('emailError');

  if (!grad) {
    showErr('gradError', 'Select your graduation year.');
    ok = false;
  } else showErr('gradError');

  if (ok) {
    // get existing signups (or an empty array if none yet)
    const existing = JSON.parse(localStorage.getItem('keyclub_signups') || "[]");

    // add the new signup
    existing.push({
      name,
      email,
      grad,
      interests: form.interests.value.trim(),
      ts: Date.now()
    });

    localStorage.setItem('keyclub_signups', JSON.stringify(existing));

    // reset and show success
    form.reset();
    document.getElementById('formSuccess').hidden = false;
    setTimeout(() => {
      document.getElementById('formSuccess').hidden = true;
    }, 4000);
  }
});


// form details:
// JSON.parse(localStorage.getItem('keyclub_signups') || "[]")
