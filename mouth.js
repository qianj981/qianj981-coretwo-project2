const cur = document.getElementById('cursor');
document.addEventListener('mousemove', e => {
  if (cur) {
    cur.style.left = e.clientX + 'px';
    cur.style.top  = e.clientY + 'px';
  }
});

// 确保光标悬停在所有可交互元素上时都会变大
document.querySelectorAll('a, button, .shape-btn, #btn-audio').forEach(el => {
  el.addEventListener('mouseenter', () => document.body.classList.add('hovering'));
  el.addEventListener('mouseleave', () => document.body.classList.remove('hovering'));
});

const VB_W = 976, VB_H = 834;

const SHAPES = [
  { id: 'green', svgX: 380, svgY: 355, natW: 66,  natH: 113, panel: 'panel-green' },
  { id: 'red',   svgX: 545, svgY: 290, natW: 81,  natH: 58,  panel: 'panel-red'   },
  { id: 'star',  svgX: 438, svgY: 520, natW: 63,  natH: 90,  panel: 'panel-star'  },
  { id: 'ring',  svgX: 666, svgY: 665, natW: 98,  natH: 240, panel: 'panel-ring'  },
];

const AUDIO = { svgX: 602, svgY: 453, panel: 'panel-audio' };

let SCALE = 1, WRAP_LEFT = 0, WRAP_TOP = 0;
let openId = null;

function layout() {
  const wrap = document.getElementById('mouth-wrap');
  if (!wrap) return;
  const r    = wrap.getBoundingClientRect();
  const rendH = r.height;
  SCALE      = rendH / VB_H;
  WRAP_LEFT = r.left;
  WRAP_TOP  = r.top;

  const isMob = window.innerWidth <= 768;

  SHAPES.forEach(sh => {
    const sx = WRAP_LEFT + sh.svgX * SCALE;
    const sy = WRAP_TOP  + sh.svgY * SCALE;
    const btn = document.getElementById('btn-' + sh.id);
    if (!btn) return;
    btn.style.left   = sx + 'px';
    btn.style.top    = sy + 'px';
    const img = btn.querySelector('img');
    if (img) {
      img.style.width  = (sh.natW * SCALE) + 'px';
      img.style.height = (sh.natH * SCALE) + 'px';
    }
    if (!isMob) positionPanel(sh.id, sx, sy, sh);
  });

  const ax = WRAP_LEFT + AUDIO.svgX * SCALE;
  const ay = WRAP_TOP  + AUDIO.svgY * SCALE;
  const aBtn = document.getElementById('btn-audio');
  if (aBtn) { aBtn.style.left = ax + 'px'; aBtn.style.top = ay + 'px'; }
  if (!isMob) {
    const apanel = document.getElementById('panel-audio');
    if (apanel) { apanel.style.left = (ax + 40) + 'px'; apanel.style.top = (ay - 20) + 'px'; }
  }
}

function positionPanel(id, sx, sy, sh) {
  const panel = document.getElementById('panel-' + id);
  if (!panel) return;

  const sizeMultiplier = 1.6; 

  if (id === 'green') {
    const offsetLeft = 60; 
    const pw = Math.round(240 * SCALE * sizeMultiplier);
    const ph = Math.round(180 * SCALE * sizeMultiplier);
    panel.style.width  = pw + 'px';
    panel.style.height = 'auto';
    panel.style.left   = (sx - pw - offsetLeft) + 'px';
    panel.style.top    = (sy - ph / 2) + 'px';
  } else if (id === 'red') {
    const offsetTop = 15; 
    const pw = Math.round(160 * SCALE * sizeMultiplier);
    const ph = Math.round(200 * SCALE * sizeMultiplier);
    panel.style.width  = pw + 'px';
    panel.style.height = 'auto';
    panel.style.left   = (sx - pw / 2) + 'px';
    panel.style.top    = (sy - ph - offsetTop) + 'px';
  } else if (id === 'star') {
    const offsetLeft = 5; 
    const pw = Math.round(200 * SCALE * sizeMultiplier);
    panel.style.width  = pw + 'px';
    panel.style.height = 'auto';
    panel.style.left   = (sx - pw - offsetLeft) + 'px';
    panel.style.top    = sy + 'px'; 
  } else if (id === 'ring') {
    const offsetRight = 60;
    panel.style.width  = Math.round(260 * SCALE * sizeMultiplier) + 'px';
    panel.style.left   = (sx + (sh.natW * SCALE) + offsetRight) + 'px';
    panel.style.top    = (sy - 50) + 'px';
  }
}

window.addEventListener('load', layout);
window.addEventListener('resize', layout);

function toggleShape(id) {
  if (openId === id) {
    closeAll();
  } else {
    closeAll();
    openId = id;
    document.getElementById('btn-' + id).classList.add('open');
    document.getElementById('panel-' + id).classList.add('open');
  }
}

function toggleAudio() {
  const audio = document.getElementById('audio-el');
  const btn   = document.getElementById('btn-audio');
  const panel = document.getElementById('panel-audio');
  if (openId === 'audio') {
    audio.pause(); audio.currentTime = 0;
    btn.classList.remove('open');
    panel.classList.remove('open');
    openId = null;
  } else {
    closeAll();
    openId = 'audio';
    btn.classList.add('open');
    panel.classList.add('open');
    audio.play();
  }
}

function closeAll() {
  SHAPES.forEach(sh => {
    document.getElementById('btn-' + sh.id)?.classList.remove('open');
    document.getElementById('panel-' + sh.id)?.classList.remove('open');
  });
  const audio = document.getElementById('audio-el');
  if (audio) { audio.pause(); audio.currentTime = 0; }
  document.getElementById('btn-audio')?.classList.remove('open');
  document.getElementById('panel-audio')?.classList.remove('open');
  openId = null;
}