<script>
/* IPv4 DFA animated final — glow dot inside main SVG (works now) */

const inputEl = document.getElementById('inputStr');
const autoBtn = document.getElementById('autoBtn');
const nextBtn = document.getElementById('nextBtn');
const resetBtn = document.getElementById('resetBtn');
const stepMode = document.getElementById('stepMode');

const traceLines = document.getElementById('traceLines');
const curStateEl = document.getElementById('curState');
const curCharEl = document.getElementById('curChar');
const curOctEl = document.getElementById('curOct');

const glow = document.getElementById('glow');

const pathIds = ['p_digit_q1','p_dot_1','p_digit_q3','p_dot_2','p_invalid_down','loop_q1','loop_q3','loop_dead'];
const paths = {};
pathIds.forEach(id => paths[id] = document.getElementById(id));

const nodes = {
  q0: document.getElementById('q0'),
  q1: document.getElementById('q1'),
  q2: document.getElementById('q2'),
  q3: document.getElementById('q3'),
  q4: document.getElementById('q4'),
  dead: document.getElementById('dead'),
};

let P = null;
let autoRunning = false;

function addTrace(text, cls='') {
  const el = document.createElement('div');
  el.className = 'line ' + (cls||'');
  el.textContent = text;
  traceLines.appendChild(el);
  traceLines.parentElement.scrollTop = traceLines.parentElement.scrollHeight;
  return el;
}

function setState(id) {
  Object.values(nodes).forEach(n => n.classList.remove('active','pulse','flash'));
  if (nodes[id]) {
    nodes[id].classList.add('active','pulse');
    if (id === 'dead') nodes[id].classList.add('flash');
  }
  curStateEl.textContent = id;
}
function setChar(c){ curCharEl.textContent = c ?? '-'; }
function setOct(o){ curOctEl.textContent = o; }

function animateAlong(pathEl, duration = 500) {
  return new Promise(resolve => {
    if (!pathEl) { resolve(); return; }
    const len = pathEl.getTotalLength();
    let start = null;
    glow.style.opacity = 1;
    function frame(ts) {
      if (!start) start = ts;
      const t = Math.min(1, (ts - start) / duration);
      const pt = pathEl.getPointAtLength(len * t);
      // pt.x, pt.y are in SVG coordinates — glow is also inside SVG so they match
      glow.setAttribute('cx', pt.x);
      glow.setAttribute('cy', pt.y);
      if (t < 1) requestAnimationFrame(frame);
      else { setTimeout(()=>{ glow.style.opacity = 0; resolve(); }, 80); }
    }
    requestAnimationFrame(frame);
  });
}

async function pulseArrow(pathEl) {
  if (!pathEl) return;
  pathEl.classList.add('active');
  await animateAlong(pathEl, 500);
  pathEl.classList.remove('active');
}

// reset
function resetProgram() {
  traceLines.innerHTML = '';
  const s = (inputEl.value || '').trim();
  P = { s, i:0, oct:1, val:0, digits:0, state:'q0', done:false };
  setState('q0'); setChar('-'); setOct(1);
  addTrace('Reset. Ready to validate. Step Mode: ' + (stepMode.checked ? 'ON' : 'OFF'), 'info');
}
resetProgram();

// process one character
async function processOne() {
  if (!P || P.done) return;
  const s = P.s;
  if (P.i >= s.length) {
    // end
    if (P.oct === 4 && P.digits > 0) {
      P.done = true; P.state = 'q4'; setState('q4'); addTrace('✅ Accepted — valid IPv4 address','ok');
    } else {
      P.done = true; P.state = 'dead'; setState('dead'); addTrace('❌ Rejected — incomplete address or trailing dot','err');
    }
    return;
  }

  const ch = s[P.i];
  setChar(ch);
  const curLine = addTrace(Read char '${ch}' at pos ${P.i}, 'info');
  curLine.classList.add('current');

  // digit
  if (/\d/.test(ch)) {
    let arrow = null;
    if (P.state === 'q0' || P.state === 'q1') arrow = paths['loop_q1'] || paths['p_digit_q1'];
    else if (P.state === 'q2' || P.state === 'q3') arrow = paths['loop_q3'] || paths['p_digit_q3'];
    else arrow = paths['p_invalid_down'];

    P.digits++;
    const firstIdx = P.i - (P.digits -1);
    const wouldBeLeadingZero = (P.digits > 1 && s[firstIdx] === '0');
    P.val = P.val * 10 + Number(ch);
    addTrace(` -> Octet ${P.oct} building value = ${P.val}`, 'info');

    await pulseArrow(arrow);

    if (wouldBeLeadingZero) {
      P.state = 'dead'; P.done = true; setState('dead');
      addTrace(❌ Rejected — leading zero in octet ${P.oct}, 'err');
      curLine.classList.remove('current'); return;
    }
    if (P.val > 255) {
      P.state = 'dead'; P.done = true; setState('dead');
      addTrace(❌ Rejected — octet ${P.oct} value ${P.val} > 255, 'err');
      curLine.classList.remove('current'); return;
    }

    if (P.state === 'q0') P.state = 'q1';
    else if (P.state === 'q2') P.state = 'q3';
    setState(P.state);
    P.i++;
    setOct(P.oct);
    curLine.classList.remove('current');
    return;
  }

  // dot
  if (ch === '.') {
    if (P.digits === 0) {
      P.state = 'dead'; P.done = true; setState('dead');
      addTrace(❌ Rejected — dot without digits at pos ${P.i}, 'err');
      curLine.classList.remove('current'); return;
    }

    const arrow = (P.state === 'q1' || P.state === 'q0') ? paths['p_dot_1'] : paths['p_dot_2'];
    addTrace(` -> Finished octet ${P.oct} value = ${P.val}`, 'info');
    await pulseArrow(arrow);

    if (P.oct >= 4) {
      P.state = 'dead'; P.done = true; setState('dead');
      addTrace('❌ Rejected — extra dot after 4th octet','err'); curLine.classList.remove('current'); return;
    }
    P.oct++; P.val = 0; P.digits = 0; P.state = 'q2'; setState('q2'); setOct(P.oct);
    P.i++;
    curLine.classList.remove('current');
    return;
  }

  // invalid
  await pulseArrow(paths['p_invalid_down']);
  P.state = 'dead'; P.done = true; setState('dead');
  addTrace(❌ Rejected — invalid character '${ch}' at pos ${P.i}, 'err');
  curLine.classList.remove('current');
  return;
}

// controls
nextBtn.addEventListener('click', async () => {
  if (!P) resetProgram();
  if (!stepMode.checked) { addTrace('Step Mode is OFF — toggle Step Mode to use Next Step','info'); return; }
  if (!P.done) await processOne();
});

autoBtn.addEventListener('click', async () => {
  if (!P) resetProgram();
  if (autoRunning) { autoRunning = false; autoBtn.textContent = 'Auto Run'; return; }
  autoRunning = true; autoBtn.textContent = 'Stop';
  while (autoRunning && !P.done) {
    await processOne();
    await new Promise(r => setTimeout(r, 600));
  }
  autoRunning = false; autoBtn.textContent = 'Auto Run';
});

resetBtn.addEventListener('click', () => { autoRunning = false; autoBtn.textContent = 'Auto Run'; resetProgram(); });

// keyboard shortcuts
document.addEventListener('keydown', (e) => {
  if (e.code === 'Space') { e.preventDefault(); nextBtn.click(); }
  if (e.key === 'Enter') { e.preventDefault(); autoBtn.click(); }
  if (e.key.toLowerCase() === 'r') { e.preventDefault(); resetBtn.click(); }
});

// populate a default
inputEl.value = '192.168.0.1';
resetProgram();

</script>

