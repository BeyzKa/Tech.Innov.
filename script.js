/* ================================================
   TASKAGE — script.js
   ================================================ */

// ---- THEME TOGGLE ----
const html        = document.documentElement;
const toggleBtn   = document.getElementById('theme-toggle');
const toggleIcon  = document.getElementById('toggle-icon');

function applyTheme(theme) {
  if (theme === 'light') {
    html.setAttribute('data-theme', 'light');
    toggleIcon.textContent = 'Light';
  } else {
    html.removeAttribute('data-theme');
    toggleIcon.textContent = 'Dark';
  }
  localStorage.setItem('taskage-theme', theme);
}

// Restore saved preference on load (default: dark)
applyTheme(localStorage.getItem('taskage-theme') || 'dark');

toggleBtn.addEventListener('click', () => {
  const current = html.getAttribute('data-theme');
  applyTheme(current === 'light' ? 'dark' : 'light');
});

// ---- NAV SCROLL STATE ----
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });


// ---- TERMINAL TYPEWRITER ----
const terminalBody = document.getElementById('terminal-body');

const termLines = [
  { text: '$ taskage join --meeting "Q3 Sprint Planning"', cls: 'cmd', delay: 400 },
  { text: 'Connecting to audio stream...', cls: 'mute', delay: 900 },
  { text: 'Speaker identification active.', cls: 'mute', delay: 1100 },
  { text: '[TRANSCRIPT] Beyza: "Omer, can you handle the auth module by Friday?"', cls: 'accent', delay: 1700 },
  { text: '[TASK DETECTED] "auth module"  ·  assignee: Omer Faruk  ·  due: Friday', cls: 'accent', delay: 2200 },
  { text: 'Validating clearance... PASS', cls: 'ok', delay: 2700 },
  { text: 'Checking workload... AVAILABLE', cls: 'ok', delay: 3000 },
  { text: '[JIRA] Task created → SPRINT-47 assigned to @omer.ekmekci', cls: 'accent', delay: 3400 },
  { text: '', cls: 'mute', delay: 3700 },
  { text: '[TRANSCRIPT] Manager: "Enis, deploy to staging once Omer\'s done."', cls: 'accent', delay: 4100 },
  { text: '[TASK DETECTED] "deploy to staging"  ·  assignee: Enis  ·  dependency: SPRINT-47', cls: 'accent', delay: 4600 },
  { text: 'Validating clearance... PASS', cls: 'ok', delay: 5100 },
  { text: 'Checking workload... AVAILABLE', cls: 'ok', delay: 5400 },
  { text: '[JIRA] Task created → SPRINT-48 assigned to @enis.otag · blocked by SPRINT-47', cls: 'accent', delay: 5800 },
  { text: '', cls: 'mute', delay: 6100 },
  { text: 'Session active — listening for next assignment...', cls: 'mute blink', delay: 6400 },
];

function renderTermLine(line) {
  const el = document.createElement('div');
  el.className = `tl ${line.cls}`;

  // Format special segments
  let content = line.text;

  if (line.cls === 'cmd') {
    const promptSpan = document.createElement('span');
    promptSpan.className = 't-prompt';
    promptSpan.textContent = '$';
    el.appendChild(promptSpan);
    el.appendChild(document.createTextNode(' ' + content.replace(/^\$ /, '')));
  } else if (line.cls === 'ok') {
    // highlight the status word
    const parts = content.split(/\b(PASS|AVAILABLE)\b/);
    parts.forEach(p => {
      if (p === 'PASS' || p === 'AVAILABLE') {
        const s = document.createElement('span');
        s.style.color = 'var(--green)';
        s.style.fontWeight = '500';
        s.textContent = p;
        el.appendChild(s);
      } else {
        el.appendChild(document.createTextNode(p));
      }
    });
  } else {
    el.textContent = content;
  }

  terminalBody.appendChild(el);
  // Scroll terminal
  terminalBody.scrollTop = terminalBody.scrollHeight;
}

function runTerminal() {
  termLines.forEach((line, i) => {
    setTimeout(() => {
      renderTermLine(line);
    }, line.delay);
  });

  // Loop after completion
  const totalDuration = termLines[termLines.length - 1].delay + 5000;
  setTimeout(() => {
    terminalBody.innerHTML = '';
    runTerminal();
  }, totalDuration);
}

// Start terminal when terminal is in view
const termObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      runTerminal();
      termObserver.disconnect();
    }
  });
}, { threshold: 0.3 });

if (terminalBody) termObserver.observe(terminalBody);


// ---- SCROLL REVEAL ----
function addRevealClasses() {
  // Section headers
  document.querySelectorAll('.section-header').forEach((el, i) => {
    el.classList.add('reveal');
  });

  // Problem cards
  document.querySelectorAll('.pcard').forEach((el, i) => {
    el.classList.add('reveal', `reveal-delay-${(i % 4) + 1}`);
  });

  // Steps
  document.querySelectorAll('.step').forEach((el, i) => {
    el.classList.add('reveal', `reveal-delay-${(i % 4) + 1}`);
  });

  // Feature items
  document.querySelectorAll('.feat-item').forEach((el, i) => {
    el.classList.add('reveal', `reveal-delay-${(i % 3) + 1}`);
  });

  // Feature anchor
  document.querySelectorAll('.feature-anchor').forEach(el => {
    el.classList.add('reveal');
  });

  // Pricing plans
  document.querySelectorAll('.plan').forEach((el, i) => {
    el.classList.add('reveal', `reveal-delay-${i + 1}`);
  });

  // Team members
  document.querySelectorAll('.tm').forEach((el, i) => {
    el.classList.add('reveal', `reveal-delay-${i + 1}`);
  });

  // Table
  document.querySelector('.table-wrap')?.classList.add('reveal');

  // Problem text
  document.querySelector('.problem-text')?.classList.add('reveal');
  document.querySelector('.problem-cards')?.classList.add('reveal', 'reveal-delay-2');

  // CTA inner
  document.querySelector('.cta-inner')?.classList.add('reveal');

  // Pricing note
  document.querySelector('.pricing-note')?.classList.add('reveal');
}

function observeReveals() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

addRevealClasses();
observeReveals();


// ---- CTA FORM SUBMIT ----
const ctaForm = document.getElementById('cta-form');
if (ctaForm) {
  ctaForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const input = ctaForm.querySelector('.cta-input');
    const btn = ctaForm.querySelector('button');
    const email = input.value.trim();

    if (!email) return;

    // Simulate submission
    btn.textContent = 'Joined!';
    btn.style.background = 'var(--green)';
    btn.style.color = '#0B0D10';
    btn.disabled = true;
    input.value = '';
    input.placeholder = 'You\'re on the list.';
    input.disabled = true;

    // Add a subtle confirmation line
    const note = document.querySelector('.cta-disclaimer');
    if (note) {
      note.style.color = 'var(--green)';
      note.textContent = 'You\'re on the early access list. We\'ll be in touch.';
    }
  });
}


// ---- SMOOTH ANCHOR SCROLL (offset for fixed nav) ----
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = 72;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});


// ---- TABLE ROW HIGHLIGHT ----
document.querySelectorAll('.compare-table tbody tr').forEach(row => {
  row.addEventListener('mouseenter', () => {
    row.querySelectorAll('td').forEach(td => {
      td.style.background = 'var(--bg-card)';
    });
  });
  row.addEventListener('mouseleave', () => {
    row.querySelectorAll('td').forEach(td => {
      td.style.background = '';
    });
  });
});
