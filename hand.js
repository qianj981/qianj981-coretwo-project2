const cur = document.getElementById('cursor');
document.addEventListener('mousemove', e => {
  cur.style.left = e.clientX + 'px';
  cur.style.top  = e.clientY + 'px';
});
document.querySelectorAll('a, button').forEach(el => {
  el.addEventListener('mouseenter', () => document.body.classList.add('hovering'));
  el.addEventListener('mouseleave', () => document.body.classList.remove('hovering'));
});


const VB_W = 1039, VB_H = 700;

const NAILS = [
  { svgX: 306, svgY:  29, wordX: 359, wordY:  45, wordW:  97, wordH: 62 },
  { svgX: 173, svgY:  71, wordX: 269, wordY: 114, wordW:  65, wordH: 56 },
  { svgX:  50, svgY: 152, wordX: 120, wordY: 203, wordW: 101, wordH: 73 },
  { svgX:  42, svgY: 330, wordX: 119, wordY: 374, wordW:  96, wordH: 64 },
  { svgX: 316, svgY: 621, wordX: 429, wordY: 627, wordW:  97, wordH: 32 },
];

let SCALE = 1, IMG_LEFT = 0, IMG_TOP = 0;


function layout() {
  const wrap = document.getElementById('hand-wrap');
  const r    = wrap.getBoundingClientRect();
  const rendH = r.height;
  const rendW = rendH * (VB_W / VB_H);
  SCALE    = rendH / VB_H;
  IMG_LEFT = window.innerWidth - rendW;
  IMG_TOP  = r.top;

  NAILS.forEach((nail, i) => {
    // Nail button
    const sx = IMG_LEFT + nail.svgX * SCALE;
    const sy = IMG_TOP  + nail.svgY * SCALE;
    const btn = document.getElementById('nail' + i);
    btn.style.left = sx + 'px';
    btn.style.top  = sy + 'px';

    
    const box = document.getElementById('box' + i);
    if (window.innerWidth > 768) {
      box.style.left          = (sx - 318) + 'px';
      box.style.top           = (sy -  24) + 'px';
      box.style.transformOrigin = 'top right';
    }
    // on mobile, CSS positions the box as a bottom sheet

    
    const word = document.getElementById('word' + i);
    word.style.left   = (IMG_LEFT + nail.wordX * SCALE) + 'px';
    word.style.top    = (IMG_TOP  + nail.wordY * SCALE) + 'px';
    word.style.width  = (nail.wordW * SCALE) + 'px';
    word.style.height = (nail.wordH * SCALE) + 'px';
  });
}

document.addEventListener('DOMContentLoaded', () => {
  layout();
  // click title to replay its animation
  [0,1,2,3,4].forEach(idx => {
    const title = document.querySelector('#box' + idx + ' .text-box-title');
    if (title) {
      title.style.cursor = 'none';
      title.addEventListener('click', () => replayTitleAnim(idx));
      title.addEventListener('mouseenter', () => document.body.classList.add('hovering'));
      title.addEventListener('mouseleave', () => document.body.classList.remove('hovering'));
    }
  });
});
window.addEventListener('resize', layout);



let openIdx = -1;

function toggleDetail(idx) {
  if (openIdx === idx) {
    closeBox(idx);
    openIdx = -1;
  } else {
    if (openIdx !== -1) closeBox(openIdx);
    openBox(idx);
    openIdx = idx;
  }
}

function openBox(idx) {
  document.getElementById('nail' + idx).classList.add('open');
  document.getElementById('box'  + idx).classList.add('open');
  document.getElementById('word' + idx).classList.add('hidden');
  // replay title animation on open
  replayTitleAnim(idx);
}

function replayTitleAnim(idx) {
  const title = document.querySelector('#box' + idx + ' .text-box-title');
  if (!title) return;
  // force reflow to restart animation
  title.style.animation = 'none';
  void title.offsetWidth;
  title.style.animation = '';
}

function closeBox(idx) {
  document.getElementById('nail' + idx).classList.remove('open');
  document.getElementById('box'  + idx).classList.remove('open');
  document.getElementById('word' + idx).classList.remove('hidden');
}