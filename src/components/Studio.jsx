import { useEffect, useMemo, useRef, useState } from 'react';

function saveLog(entry) {
  const key = 'ai_logs';
  const prev = JSON.parse(localStorage.getItem(key) || '[]');
  prev.unshift({ id: crypto.randomUUID(), ts: Date.now(), ...entry });
  localStorage.setItem(key, JSON.stringify(prev.slice(0, 2000)));
}

function tokenize(text) {
  return (text || '')
    .replace(/\s+/g, ' ')
    .trim()
    .split(' ')
    .filter(Boolean);
}

function pseudoTokensCount(text) {
  return Math.ceil(tokenize(text).length * 1.3);
}

function runAgents(prompt) {
  const history = [];

  const context = { prompt, notes: [], artifacts: {} };

  function push(role, content) {
    history.push({ role, content });
  }

  const planner = () => {
    const subtasks = [];
    if (/logo|brand|icon/i.test(prompt)) subtasks.push('Design a minimal vector logo concept');
    if (/ghibli|anime|scene|art/i.test(prompt)) subtasks.push('Generate a soft, pastel, Ghibli-like landscape');
    if (/solve|math|calculate|compute|equation|problem/i.test(prompt)) subtasks.push('Solve analytical or numeric problem');
    if (/analy(s|z)e|insight|explain|summary/i.test(prompt)) subtasks.push('Provide analysis and insights');
    if (subtasks.length === 0) subtasks.push('General reasoning and creative response');
    context.notes.push(...subtasks);
    push('planner', 'Subtasks: ' + subtasks.join(' • '));
  };

  const researcher = () => {
    const terms = Array.from(new Set(prompt.toLowerCase().match(/[a-z0-9]{3,}/g) || [])).slice(0, 15);
    context.notes.push('Keywords: ' + terms.join(', '));
    push('researcher', 'Keywords: ' + terms.join(', '));
  };

  const coder = () => {
    let result = '';
    try {
      const expr = (prompt.match(/[0-9+\-/*().^%\s]+/g) || []).join(' ').trim();
      if (expr && /\d/.test(expr)) {
        const val = Function('return (' + expr + ')')();
        if (typeof val === 'number' && isFinite(val)) {
          result = `Computed value for expression ≈ ${val}`;
        }
      }
    } catch {}
    push('coder', result || 'No direct computation extracted.');
  };

  const designer = () => {
    const palette = [
      '#7c3aed', '#22d3ee', '#f59e0b', '#10b981', '#ef4444', '#6366f1', '#14b8a6', '#f472b6'
    ];
    const pick = (seed => palette[Math.abs(seed) % palette.length])(
      Array.from(prompt).reduce((a, c) => a + c.charCodeAt(0), 0)
    );
    context.artifacts.palette = [pick, '#0ea5e9', '#f97316', '#eab308'];
    push('designer', 'Palette: ' + context.artifacts.palette.join(', '));
  };

  planner();
  researcher();
  coder();
  designer();

  const synthesis = [
    'Synthesis:\n',
    '- Tasks: ' + context.notes.filter(n => !n.startsWith('Keywords')).join(' | '),
    '\n- ' + context.notes.find(n => n.startsWith('Keywords')),
    '\n- See visual generators below for logo/Ghibli outputs.'
  ].join('');

  return { history, synthesis, context };
}

function LogoCanvas({ prompt, palette }) {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext('2d');
    const w = canvas.width, h = canvas.height;
    ctx.clearRect(0, 0, w, h);
    const [a,b,c,d] = palette || ['#7c3aed','#22d3ee','#f59e0b','#10b981'];

    const grad = ctx.createLinearGradient(0,0,w,h);
    grad.addColorStop(0, a);
    grad.addColorStop(1, b);
    ctx.fillStyle = grad;
    ctx.fillRect(0,0,w,h);

    ctx.save();
    ctx.translate(w/2, h/2);
    ctx.rotate((Math.abs(prompt.length)%360) * Math.PI/180);
    for (let i=0;i<6;i++) {
      ctx.rotate(Math.PI/3);
      ctx.beginPath();
      ctx.moveTo(0, -80);
      ctx.bezierCurveTo(40, -40, 40, 40, 0, 80);
      ctx.bezierCurveTo(-40, 40, -40, -40, 0, -80);
      ctx.closePath();
      ctx.fillStyle = i%2===0 ? c : d;
      ctx.globalAlpha = 0.6;
      ctx.fill();
    }
    ctx.restore();

    ctx.globalAlpha = 1;
    ctx.fillStyle = 'white';
    ctx.font = 'bold 28px Inter, system-ui, sans-serif';
    const text = (prompt || 'Aurora').slice(0, 18);
    const tw = ctx.measureText(text).width;
    ctx.fillText(text, (w - tw)/2, h - 24);
  }, [prompt, palette]);
  return <canvas ref={ref} width={480} height={300} className="rounded-xl shadow-lg border border-white/10"/>;
}

function GhibliCanvas({ seed = 'fields', palette }) {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext('2d');
    const w = canvas.width, h = canvas.height;
    ctx.clearRect(0,0,w,h);

    const [p1,p2,p3] = palette || ['#93c5fd','#fde68a','#86efac'];

    const sky = ctx.createLinearGradient(0,0,0,h);
    sky.addColorStop(0, '#c7d2fe');
    sky.addColorStop(1, p1);
    ctx.fillStyle = sky;
    ctx.fillRect(0,0,w,h);

    function puff(x,y,r,color){
      ctx.fillStyle = color;
      ctx.beginPath();
      for(let i=0;i<6;i++){
        const ang = (i/6)*Math.PI*2;
        ctx.moveTo(x+Math.cos(ang)*r, y+Math.sin(ang)*r);
        ctx.arc(x+Math.cos(ang)*r, y+Math.sin(ang)*r, r*0.6, 0, Math.PI*2);
      }
      ctx.fill();
    }
    puff(120, 90, 32, 'rgba(255,255,255,0.9)');
    puff(300, 70, 28, 'rgba(255,255,255,0.85)');

    ctx.fillStyle = '#94a3b8';
    ctx.beginPath();
    ctx.moveTo(0,h*0.55);
    for(let x=0;x<=w;x+=30){
      ctx.lineTo(x, h*0.55 - Math.sin((x+seed.length)*0.02)*20 - 20);
    }
    ctx.lineTo(w,h);
    ctx.lineTo(0,h);
    ctx.closePath();
    ctx.fill();

    const hill = (y, color) => {
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.moveTo(0,y);
      for(let x=0;x<=w;x+=20){
        ctx.lineTo(x, y - Math.sin((x+seed.length)*0.03)*12 - 10);
      }
      ctx.lineTo(w,h);
      ctx.lineTo(0,h);
      ctx.closePath();
      ctx.fill();
    };
    hill(h*0.7, p3);
    hill(h*0.82, '#4ade80');

    for(let i=0;i<80;i++){
      const x = Math.random()*w;
      const y = h*0.75 + Math.random()*h*0.22;
      ctx.fillStyle = i%3===0? '#fca5a5' : i%3===1? p2 : '#fde68a';
      ctx.beginPath();
      ctx.arc(x,y,2,0,Math.PI*2);
      ctx.fill();
    }
  }, [seed, palette]);
  return <canvas ref={ref} width={480} height={300} className="rounded-xl shadow-lg border border-white/10"/>;
}

function ImageAnalyzer() {
  const [file, setFile] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!file) return;
    const img = new Image();
    img.onload = () => {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      const w = 480, h = 300;
      ctx.clearRect(0,0,w,h);
      const ar = img.width / img.height;
      const cw = w, ch = h;
      let dw = cw, dh = cw / ar;
      if (dh < ch) { dh = ch; dw = dh * ar; }
      const dx = (cw - dw) / 2;
      const dy = (ch - dh) / 2;
      ctx.drawImage(img, dx, dy, dw, dh);

      const data = ctx.getImageData(0,0,w,h).data;
      const buckets = {};
      for (let i=0;i<data.length;i+=40) {
        const r = data[i], g = data[i+1], b = data[i+2];
        const key = `${Math.round(r/32)}-${Math.round(g/32)}-${Math.round(b/32)}`;
        buckets[key] = (buckets[key]||0)+1;
      }
      const top = Object.entries(buckets).sort((a,b)=>b[1]-a[1]).slice(0,5).map(([k])=>{
        const [rr,gg,bb] = k.split('-').map(v=>parseInt(v)*32);
        return `rgb(${rr},${gg},${bb})`;
      });

      let edges = 0, total = 0;
      const gray = new Uint8ClampedArray((w*h));
      const imgData = ctx.getImageData(0,0,w,h);
      for (let y=0;y<h;y++){
        for(let x=0;x<w;x++){
          const idx = (y*w + x)*4;
          const r=imgData.data[idx], g=imgData.data[idx+1], b=imgData.data[idx+2];
          gray[y*w+x] = (r*0.299 + g*0.587 + b*0.114)|0;
        }
      }
      for (let y=1;y<h-1;y++){
        for(let x=1;x<w-1;x++){
          const gx = -gray[(y-1)*w + (x-1)] -2*gray[y*w + (x-1)] - gray[(y+1)*w + (x-1)]
                    + gray[(y-1)*w + (x+1)] +2*gray[y*w + (x+1)] + gray[(y+1)*w + (x+1)];
          const gy = -gray[(y-1)*w + (x-1)] -2*gray[(y-1)*w + x] - gray[(y-1)*w + (x+1)]
                    + gray[(y+1)*w + (x-1)] +2*gray[(y+1)*w + x] + gray[(y+1)*w + (x+1)];
          const mag = Math.sqrt(gx*gx + gy*gy);
          if (mag > 180) edges++;
          total++;
        }
      }
      const edgeDensity = +(edges/total*100).toFixed(2);

      const cap = `An image with ${edgeDensity}% edge density and dominant colors: ${top.join(', ')}.`;
      setAnalysis({ colors: top, edgeDensity, caption: cap });
    };
    img.src = URL.createObjectURL(file);
  }, [file]);

  return (
    <div className="grid gap-4">
      <div className="flex items-center gap-3">
        <input
          type="file"
          accept="image/*"
          onChange={e => setFile(e.target.files?.[0] || null)}
          className="text-sm file:mr-4 file:rounded-md file:border-0 file:bg-white/10 file:px-3 file:py-2 file:text-slate-100 hover:file:bg-white/20"
        />
        <span className="text-xs text-slate-400">Your image never leaves the browser.</span>
      </div>
      <canvas ref={canvasRef} width={480} height={300} className="rounded-xl shadow-lg border border-white/10 bg-black/20" />
      {analysis && (
        <div className="text-sm text-slate-200 space-y-2">
          <div>Caption: <span className="text-slate-300">{analysis.caption}</span></div>
          <div>Edge density: <span className="text-slate-300">{analysis.edgeDensity}%</span></div>
          <div className="flex items-center gap-2">Colors:
            {analysis.colors.map((c,i)=> (
              <span key={i} className="inline-block w-5 h-5 rounded" style={{ background:c }} title={c} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function Studio({ user }) {
  const [prompt, setPrompt] = useState('Design a minimal logo for a fictional AI studio named Aurora, then solve 12*(5+3).');
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [palette, setPalette] = useState(['#7c3aed','#22d3ee','#f59e0b','#10b981']);

  const handleRun = () => {
    if (!prompt.trim()) return;
    setRunning(true);
    setTimeout(() => {
      const out = runAgents(prompt);
      setHistory(out.history);
      setResult(out.synthesis);
      if (out.context?.artifacts?.palette) setPalette(out.context.artifacts.palette);
      const tokens = pseudoTokensCount([prompt, out.synthesis, ...out.history.map(h=>h.content)].join(' '));
      saveLog({ user: user?.email || 'guest', type: 'multi-agent', prompt, tokens, meta: { roles: out.history.map(h=>h.role) } });
      setRunning(false);
    }, 300);
  };

  return (
    <section className="max-w-7xl mx-auto px-4 py-10">
      <div className="grid lg:grid-cols-2 gap-8">
        <div>
          <h3 className="text-xl font-semibold">Agent Console</h3>
          <p className="text-sm text-slate-400 mb-3">Planner, Researcher, Coder, and Designer collaborate on your query.</p>
          <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-3">
            <textarea
              value={prompt}
              onChange={e=>setPrompt(e.target.value)}
              rows={4}
              className="w-full bg-black/40 rounded-md border border-white/10 p-3 text-sm outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Ask anything: analysis, math, generate logo, Ghibli art, etc."
            />
            <div className="flex items-center gap-3">
              <button onClick={handleRun} disabled={running} className="px-4 py-2 rounded-md bg-gradient-to-r from-purple-600 to-blue-600 disabled:opacity-50">
                {running ? 'Running…' : 'Run Agents'}
              </button>
              <span className="text-xs text-slate-400">No API calls. Fully local.</span>
            </div>
          </div>

          <div className="mt-6 grid gap-4">
            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
              <h4 className="font-medium">Collaboration Trace</h4>
              <div className="mt-2 max-h-56 overflow-auto pr-2 space-y-2 text-sm">
                {history.length === 0 && <div className="text-slate-400">No runs yet.</div>}
                {history.map((h,i)=> (
                  <div key={i} className="p-2 rounded bg-black/30">
                    <div className="text-xs uppercase tracking-wider text-slate-400">{h.role}</div>
                    <div className="text-slate-200 whitespace-pre-wrap">{h.content}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
              <h4 className="font-medium">Synthesis</h4>
              <pre className="mt-2 text-sm text-slate-200 whitespace-pre-wrap">{result || 'Run the agents to see results.'}</pre>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-xl font-semibold">Creative Lab</h3>
          <p className="text-sm text-slate-400 mb-3">Generate vector-style logos and soft Ghibli-like scenes procedurally.</p>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
              <div className="text-sm text-slate-300 mb-2">Logo Generator</div>
              <LogoCanvas prompt={prompt} palette={palette} />
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
              <div className="text-sm text-slate-300 mb-2">Ghibli‑style Scene</div>
              <GhibliCanvas seed={prompt} palette={palette} />
            </div>
          </div>

          <div className="mt-6 bg-white/5 border border-white/10 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Image Understanding</h4>
              <span className="text-xs text-slate-400">Upload an image</span>
            </div>
            <div className="mt-3">
              <ImageAnalyzer />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
