/* nose.js — Scent page */

const cur = document.getElementById('cursor');
document.addEventListener('mousemove', e => {
  cur.style.left = e.clientX + 'px';
  cur.style.top  = e.clientY + 'px';
});
document.querySelectorAll('a, button').forEach(el => {
  el.addEventListener('mouseenter', () => document.body.classList.add('hovering'));
  el.addEventListener('mouseleave', () => document.body.classList.remove('hovering'));
});

const VB_W = 534, VB_H = 735;

const SHAPES = [
  { id: 'heart',    svgX:  -20, svgY: 180, natW: 251, natH: 321 },
  { id: 'nosering', svgX: 268, svgY: 738, natW: 177, natH:  79 },
  { id: 'tissue',   svgX: 105, svgY: 760, natW: 163, natH: 284 },
  { id: 'stud',     svgX: 440, svgY: 530, natW:  40, natH:  40 },
  { id: 'note',     svgX: 650, svgY: 100, natW: 343, natH: 132 },
];

let SCALE = 1, WRAP_LEFT = 0, WRAP_TOP = 0;
let openId = null;

function layout() {
  const wrap = document.getElementById('nose-wrap');
  const r    = wrap.getBoundingClientRect();
  SCALE     = r.height / VB_H;
  WRAP_LEFT = r.left;
  WRAP_TOP  = r.top;

  const isMob = window.innerWidth <= 768;

  SHAPES.forEach(sh => {
    const sx = WRAP_LEFT + sh.svgX * SCALE;
    const sy = WRAP_TOP  + sh.svgY * SCALE;
    const btn = document.getElementById('btn-' + sh.id);
    if (btn) {
      btn.style.left = sx + 'px';
      btn.style.top  = sy + 'px';
      const img = btn.querySelector('img');
      if (img) {
        img.style.width  = (sh.natW * SCALE) + 'px';
        img.style.height = (sh.natH * SCALE) + 'px';
      }
    }
    if (!isMob) positionPanel(sh.id, sx, sy, sh);
  });
}

function positionPanel(id, sx, sy, sh) {
  const panel = document.getElementById('panel-' + id);
  if (!panel) return;
  const W = window.innerWidth, H = window.innerHeight;
  const M = 0.6; // size multiplier — smaller than before

  if (id === 'heart') {
    // heart rain is full-screen, no positioning needed

  } else if (id === 'nosering') {
    const pw = Math.round(200 * SCALE * M * 2.8);
    const ph = Math.round(150 * SCALE * M * 2.8);
    panel.style.width  = pw + 'px';
    panel.style.height = ph + 'px';
    const left = Math.min(sx + sh.natW*SCALE*0.5 + 16, W - pw - 20);
    panel.style.left = left + 'px';
    panel.style.top  = Math.max(20, sy - ph/2) + 'px';

  } else if (id === 'tissue') {
    // Big drop panel sits directly above the tissue button, horizontally centred
    panel.style.left = (sx - 50) + 'px';  // ~centred (big drop ~100px wide)
    requestAnimationFrame(() => {
      const ph = panel.offsetHeight;
      panel.style.top = Math.max(20, sy - sh.natH * SCALE * 0.5 - ph - 12) + 'px';
    });

  } else if (id === 'stud') {
    const left = Math.min(sx + sh.natW*SCALE*0.5 + 16, W - 280);
    panel.style.left = left + 'px';
    panel.style.top  = Math.max(20, sy - 50) + 'px';

  } else if (id === 'note') {
    // sticky-scene is anchored at note button; note falls from there
    const scene = document.getElementById('sticky-scene');
    if (scene) {
      scene.style.left = sx + 'px';
      scene.style.top  = sy + 'px';
    }
  }
}

window.addEventListener('load', layout);
window.addEventListener('resize', layout);

/* ── Heart: sequential animation ── */
function togglePanel(id) {
  if (id === 'heart') {
    if (openId !== 'heart') {
      closeAll();
      openId = 'heart';
      document.getElementById('btn-heart').classList.add('open');
      launchHeartRain();
    } else {
      closeAll();
    }
    return;
  }

  if (id === 'tissue') {
    if (openId !== 'tissue') {
      closeAll();
      openId = 'tissue';
      document.getElementById('btn-tissue').classList.add('open');
      document.getElementById('panel-tissue').classList.add('open');
    } else {
      closeAll();
    }
    return;
  }

  if (id === 'note') {
    if (openId !== 'note') {
      closeAll();
      openId = 'note';
      document.getElementById('btn-note').classList.add('open');
      if (window.innerWidth <= 768) {
        document.getElementById('mobile-sticky')?.classList.add('open');
      } else {
        launchStickyNote();
      }
    } else {
      closeAll();
    }
    return;
  }

  if (openId === id) {
    closeAll();
  } else {
    closeAll();
    openId = id;
    document.getElementById('btn-' + id).classList.add('open');
    document.getElementById('panel-' + id).classList.add('open');
  }
}

/* ── Tissue drop chain ── */
function triggerDropChain() {
  const chain = document.getElementById('drop-chain');
  if (!chain) return;
  chain.innerHTML = '';
  chain.classList.remove('dropping');
  // re-trigger animation by cloning
  const clone = chain.cloneNode(true);
  // add drops
  for (let i = 0; i < 8; i++) {
    const span = document.createElement('span');
    span.textContent = '💧';
    span.style.animationDelay = (i * 0.12) + 's';
    clone.appendChild(span);
  }
  chain.parentNode.replaceChild(clone, chain);
  clone.classList.add('dropping');
}

function closeAll() {
  SHAPES.forEach(sh => {
    document.getElementById('btn-' + sh.id)?.classList.remove('open');
    document.getElementById('panel-' + sh.id)?.classList.remove('open');
  });
  stopHeartRain();
  hideStickyNote();
  document.getElementById('mobile-sticky')?.classList.remove('open');
  openId = null;
}

/* ── Heart Rain ── */
const HEARTS = ['🤍','🩷','❤️','🧡','💛','💚','💙','💜','🖤','❤️‍🔥','🩵'];
let rainInterval = null;

function launchHeartRain() {
  const container = document.getElementById('heart-rain');
  container.innerHTML = '';
  container.style.display = 'block';

  function spawnHeart() {
    const el = document.createElement('span');
    el.textContent = HEARTS[Math.floor(Math.random() * HEARTS.length)];
    const size = 28 + Math.random() * 28;          // 28–56px
    el.style.cssText = [
      'position:fixed',
      'pointer-events:none',
      'z-index:60',
      `font-size:${size}px`,
      `left:${Math.random() * 100}vw`,
      'top:-60px',
      `opacity:${0.7 + Math.random() * 0.3}`,
      `animation:heartFall ${1.6 + Math.random() * 1.8}s ease-in forwards`,
      `animation-delay:${Math.random() * 0.4}s`,
    ].join(';');
    container.appendChild(el);
    // remove after animation
    el.addEventListener('animationend', () => el.remove());
  }

  // burst on open
  for (let i = 0; i < 20; i++) setTimeout(spawnHeart, i * 60);
  // then keep dripping
  rainInterval = setInterval(spawnHeart, 180);
}

function stopHeartRain() {
  clearInterval(rainInterval);
  rainInterval = null;
  const container = document.getElementById('heart-rain');
  if (container) container.innerHTML = '';
}

/* ── 3D Sticky Note physics ── */
let stickyAnimFrame;
let stickyDragging = false;
let sPosX = 0, sPosY = -260;
let sVelX = 2, sVelY = 0;
let sRotZ = -4, sRotX = 0;
let sDragStartX, sDragStartY;
let sSettled = false;

function launchStickyNote() {
  const note = document.getElementById('sticky-note');
  note.classList.add('visible');
  sPosX = -120; sPosY = -20;   // start just above note button
  sVelX = 0.5; sVelY = 0;
  sRotZ = -4; sRotX = 0;
  sSettled = false;
  cancelAnimationFrame(stickyAnimFrame);

  note.addEventListener('mousedown', onStickyDown);
  document.addEventListener('mousemove', onStickyMove);
  document.addEventListener('mouseup', onStickyUp);

  dropSticky();
}

function hideStickyNote() {
  const note = document.getElementById('sticky-note');
  if (!note) return;
  note.classList.remove('visible');
  note.removeEventListener('mousedown', onStickyDown);
  document.removeEventListener('mousemove', onStickyMove);
  document.removeEventListener('mouseup', onStickyUp);
  cancelAnimationFrame(stickyAnimFrame);
}

function dropSticky() {
  const note = document.getElementById('sticky-note');
  const gravity = 0.65, bounce = 0.3, friction = 0.88;
  const floorY = 80;   // px below note button

  function step() {
    if (stickyDragging) { stickyAnimFrame = requestAnimationFrame(step); return; }
    sVelY += gravity;
    sPosY += sVelY;
    sPosX += sVelX * 0.25;
    sRotZ += sVelX * 0.15;

    if (sPosY >= floorY) {
      sPosY = floorY;
      sVelY *= -bounce;
      sVelX *= friction;
      sRotZ += sVelY * 0.4;
      if (Math.abs(sVelY) < 0.8) { sVelY = 0; sSettled = true; }
    }
    sRotZ = Math.max(-30, Math.min(30, sRotZ));
    note.style.transform = `translate(${sPosX}px,${sPosY}px) rotateX(${sRotX}deg) rotateZ(${sRotZ}deg)`;
    if (!sSettled || Math.abs(sVelY) > 0.1)
      stickyAnimFrame = requestAnimationFrame(step);
  }
  step();
}

function onStickyDown(e) {
  stickyDragging = true;
  sDragStartX = e.clientX - sPosX;
  sDragStartY = e.clientY - sPosY;
  cancelAnimationFrame(stickyAnimFrame);
  e.preventDefault();
}

function onStickyMove(e) {
  if (!stickyDragging) return;
  const nx = e.clientX - sDragStartX;
  const ny = e.clientY - sDragStartY;
  sVelX = nx - sPosX;
  sVelY = ny - sPosY;
  sPosX = nx; sPosY = ny;
  sRotZ += sVelX * 0.3;
  sRotX = Math.max(-20, Math.min(20, -sVelY * 0.4));
  const note = document.getElementById('sticky-note');
  note.style.transform = `translate(${sPosX}px,${sPosY}px) rotateX(${sRotX}deg) rotateZ(${sRotZ}deg)`;
}

function onStickyUp() {
  if (!stickyDragging) return;
  stickyDragging = false;
  sSettled = false;
  dropSticky();
}