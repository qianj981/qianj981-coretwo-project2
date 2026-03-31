const cur = document.getElementById('cursor');
document.addEventListener('mousemove', e => {
  cur.style.left = e.clientX + 'px';
  cur.style.top = e.clientY + 'px';
});

const ELEMS_CONFIG = [
  { id:'e0', nw:227, nh:340, sc:1, dx:80,  dy:-220, ax:0, ay:1 },
  { id:'e1', nw:380, nh:240, sc:1, dx:130, dy:-220, ax:0, ay:0.5, bDx:70, bDy:-50 },
  { id:'e2', nw:410, nh:267, sc:1, dx:140, dy:-100, ax:0, ay:0.5 },
  { id:'e3', nw:330, nh:127, sc:1, dx:150, dy:85,   ax:0, ay:0.5 },
  { id:'e4', nw:363, nh:331, sc:1, dx:100,  dy:100,  ax:0.25, ay:0 }
];

let EBX, EBY, SCALE, isOpen = false, currentPlayingIdx = -1;

function layout() {
  const wrap = document.getElementById('ear-wrap');
  if (!wrap) return;
  const r = wrap.getBoundingClientRect();
  SCALE = r.height / 718;
  const isMobile = window.innerWidth < 600;
  EBX = r.left + r.width * (isMobile ? 0.50 : 0.52) + (15 * SCALE);
  EBY = r.top + r.height * (isMobile ? 0.52 : 0.55);

  const ebWrap = document.getElementById('earbud-wrap');
  const ebW = 153 * SCALE, ebH = 290 * SCALE;
  ebWrap.style.width = ebW + 'px'; ebWrap.style.height = ebH + 'px';
  ebWrap.style.left = (EBX - ebW * 0.47) + 'px';
  ebWrap.style.top = (EBY - ebH * 0.28) + 'px';

  const btn = document.getElementById('pupil-btn');
  btn.style.left = EBX + 'px'; btn.style.top = (EBY - 16) + 'px'; 

  ELEMS_CONFIG.forEach((cfg) => {
    const el = document.getElementById(cfg.id);
    const w = cfg.nw * cfg.sc * SCALE, h = cfg.nh * cfg.sc * SCALE;
    el.style.width = w + 'px'; el.style.height = h + 'px';
    el.style.left = (EBX - w * cfg.ax) + 'px';
    el.style.top = (EBY - h * cfg.ay) + 'px';
  });
}

function toggleMainEar() {
  isOpen = !isOpen;
  document.body.classList.toggle('open', isOpen);
  if (!isOpen && currentPlayingIdx !== -1) stopAudio(currentPlayingIdx);

  ELEMS_CONFIG.forEach((cfg, i) => {
    const el = document.getElementById(cfg.id);
    const detailBtn = el.querySelector('.detail-btn');
    if (isOpen) {
      el.style.transition = `opacity 0.6s ease ${i*40}ms, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${i*40}ms`;
      el.style.opacity = '1';
      const mob = window.innerWidth < 600 ? 0.55 : 1;
      el.style.transform = `translate(${cfg.dx * SCALE * mob}px, ${cfg.dy * SCALE * mob}px) scale(1)`;
      el.style.pointerEvents = 'auto';
      
      // 处理按钮额外偏移
      detailBtn.style.marginRight = cfg.bDx ? `-${cfg.bDx}px` : "0px";
      detailBtn.style.marginTop = cfg.bDy ? `${cfg.bDy}px` : "0px";
      
      detailBtn.style.opacity = '1';
      detailBtn.style.pointerEvents = 'auto';
    } else {
      el.style.transition = `all 0.4s ease`;
      el.style.opacity = '0';
      el.style.transform = `translate(0, 0) scale(0)`;
      el.style.pointerEvents = 'none';
      detailBtn.style.opacity = '0';
      detailBtn.style.pointerEvents = 'none';
    }
  });
}

function toggleDetail(idx) {
  const el = document.getElementById('e' + idx);
  const audio = el.querySelector('.detail-audio');
  if (currentPlayingIdx === idx) {
    stopAudio(idx);
  } else {
    if (currentPlayingIdx !== -1) stopAudio(currentPlayingIdx);
    audio.play();
    el.classList.add('playing');
    currentPlayingIdx = idx;
  }
}

function stopAudio(idx) {
  const el = document.getElementById('e' + idx);
  const audio = el.querySelector('.detail-audio');
  if(audio) {
    audio.pause();
    audio.currentTime = 0;
  }
  el.classList.remove('playing');
  currentPlayingIdx = -1;
}

window.addEventListener('load', () => {
  layout();
  document.querySelectorAll('a, button, .detail-btn').forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('hovering'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('hovering'));
  });
});
window.addEventListener('resize', layout);