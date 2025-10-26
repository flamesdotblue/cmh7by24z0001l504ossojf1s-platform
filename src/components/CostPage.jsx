import { useEffect, useMemo, useState } from 'react';

export default function CostPage() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const key = 'ai_logs';
    const data = JSON.parse(localStorage.getItem(key) || '[]');
    setLogs(data);
  }, []);

  const summary = useMemo(() => {
    const totalTokens = logs.reduce((a, l) => a + (l.tokens || 0), 0);
    const pricePerK = 0.0;
    const estimated = (totalTokens/1000)*pricePerK;
    return { total: logs.length, totalTokens, pricePerK, estimated };
  }, [logs]);

  return (
    <section className="max-w-7xl mx-auto px-4 py-10">
      <h3 className="text-xl font-semibold">Cost & Usage</h3>
      <p className="text-sm text-slate-400">This app runs fully in-browser. API cost is $0. Below is a usage breakdown estimated by pseudo-token counts.</p>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <div className="bg-white/5 border border-white/10 rounded-xl p-5">
          <div className="text-sm text-slate-400">Total Runs</div>
          <div className="text-3xl font-bold">{summary.total}</div>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl p-5">
          <div className="text-sm text-slate-400">Estimated Tokens</div>
          <div className="text-3xl font-bold">{summary.totalTokens}</div>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl p-5">
          <div className="text-sm text-slate-400">Estimated Cost</div>
          <div className="text-3xl font-bold">${summary.estimated.toFixed(4)}</div>
        </div>
      </div>

      <div className="mt-8 bg-white/5 border border-white/10 rounded-xl">
        <div className="px-5 py-3 border-b border-white/10 text-sm text-slate-300">Logs</div>
        <div className="max-h-[420px] overflow-auto p-4 space-y-3 text-sm">
          {logs.length === 0 && <div className="text-slate-400">No logs yet. Run an agent in the Studio tab.</div>}
          {logs.map(l => (
            <div key={l.id} className="p-3 rounded bg-black/30">
              <div className="text-xs text-slate-400 flex justify-between">
                <span>{new Date(l.ts).toLocaleString()}</span>
                <span>{l.user} • {l.type} • {l.tokens} tok</span>
              </div>
              <div className="mt-1 text-slate-200">{l.prompt}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
