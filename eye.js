// ── CURSOR ──
const cur = document.getElementById('cursor');
document.addEventListener('mousemove', e => {
  cur.style.left = e.clientX + 'px';
  cur.style.top  = e.clientY + 'px';
});
document.querySelectorAll('a,button,.shard').forEach(el => {
  el.addEventListener('mouseenter', () => document.body.classList.add('hovering'));
  el.addEventListener('mouseleave', () => document.body.classList.remove('hovering'));
});

// ── IRIS CENTRE ──
const IRIS_CX = 96.0447 / 200;
const IRIS_CY = 51.2039 / 105;
let PX = 0, PY = 0;

function placePupil() {
  const wrap = document.getElementById('eye-wrap');
  const btn = document.getElementById('pupil-btn');
  
  // 直接让圆圈去到眼睛 SVG 定义的中心比例位置
  // 这样无论眼睛在哪，圆圈都会在瞳孔位置
  btn.style.left = (IRIS_CX * 100) + '%';
  btn.style.top  = (IRIS_CY * 100) + '%';

  // 更新 PX 和 PY 供睫毛使用
  const r = btn.getBoundingClientRect();
  PX = r.left + r.width / 2;
  PY = r.top + r.height / 2;

  SHARDS.forEach(cfg => anchorShard(cfg));
}

const SHARDS = [
  { id:'s0', nw:174, nh:168, sc:0.80, dx:-185, dy:-190, rot:-22, d:0   },
  { id:'s1', nw:248, nh:261, sc:0.72, dx: -48, dy:-220, rot:  6, d:48  },
  { id:'s2', nw:214, nh:195, sc:0.74, dx: 108, dy:-215, rot: 21, d:88  },
  { id:'s3', nw:222, nh:183, sc:0.70, dx: 245, dy:-190, rot: 37, d:122 },
  { id:'s4', nw:138, nh: 97, sc:1.23, dx: 330, dy:-20, rot:0 },
];

function anchorShard(cfg) {
  const el = document.getElementById(cfg.id);
  const w = cfg.nw * cfg.sc;
  const h = cfg.nh * cfg.sc;
  el.style.width = w + 'px';
  el.style.height = h + 'px';
  el.style.left = (PX - w / 2) + 'px';

  // 原来是 (PY - h)，现在改为下面这样，45 是下沉像素值
  // 数值越大，睫毛离眼球中心越近
  el.style.top = (PY - h + 45) + 'px'; 
}

function openShard(cfg) {
  const el = document.getElementById(cfg.id);
  el.style.transition = `opacity .45s cubic-bezier(.16,1,.3,1) ${cfg.d}ms, transform .58s cubic-bezier(.16,1,.3,1) ${cfg.d}ms`;
  el.style.opacity = '1';
  el.style.transform = `translate(${cfg.dx}px,${cfg.dy}px) rotate(${cfg.rot}deg)`;
  el.style.pointerEvents = 'auto';
}

function closeShard(cfg, idx) {
  const el = document.getElementById(cfg.id);
  const closeDelay = (SHARDS.length - 1 - idx) * 28;
  el.style.transition = `opacity .28s ease ${closeDelay}ms, transform .38s cubic-bezier(.7,0,1,1) ${closeDelay}ms`;
  el.style.opacity = '0';
  el.style.transform = 'translate(0,0) rotate(0deg) scale(0)'; 
  el.style.pointerEvents = 'none';
}

// ── TOGGLE ──
let isOpen = false;
function toggle() {
  isOpen = !isOpen;
  document.body.classList.toggle('open', isOpen);
  if (isOpen) {
    SHARDS.forEach(cfg => openShard(cfg));
  } else {
    SHARDS.forEach((cfg, i) => closeShard(cfg, i));
  }
}

window.addEventListener('load', () => {
  placePupil();
  SHARDS.forEach(cfg => {
    const el = document.getElementById(cfg.id);
    el.style.transition = 'none';
    el.style.opacity = '0';
    el.style.transform = 'translate(0,0) rotate(0deg) scale(0.08)';
  });
});
window.addEventListener('resize', placePupil);