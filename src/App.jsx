import { useEffect, useMemo, useState } from 'react';
import HeroSpline from './components/HeroSpline';
import Studio from './components/Studio';
import CostPage from './components/CostPage';
import Login from './components/Login';

const tabs = [
  { key: 'home', label: 'Home' },
  { key: 'studio', label: 'Studio' },
  { key: 'costs', label: 'Costs' },
  { key: 'login', label: 'Login' },
];

export default function App() {
  const [active, setActive] = useState('home');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem('user');
    if (saved) setUser(JSON.parse(saved));
  }, []);

  const Content = useMemo(() => {
    if (active === 'home') return <HeroSpline />;
    if (active === 'studio') return <Studio user={user} />;
    if (active === 'costs') return <CostPage />;
    if (active === 'login') return <Login onAuth={setUser} currentUser={user} />;
    return null;
  }, [active, user]);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-950 via-slate-900 to-black text-slate-100">
      <header className="w-full sticky top-0 z-20 backdrop-blur bg-black/40 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-purple-500 via-blue-400 to-orange-400 animate-pulse" />
            <div>
              <h1 className="text-lg font-semibold">Aurora Multi‑Agent Studio</h1>
              <p className="text-xs text-slate-400">No‑API, on-device creative and analysis suite</p>
            </div>
          </div>
          <nav className="flex items-center gap-1">
            {tabs.map(t => (
              <button
                key={t.key}
                onClick={() => setActive(t.key)}
                className={`px-3 py-2 rounded-md text-sm transition-colors ${
                  active === t.key ? 'bg-white/10 text-white' : 'text-slate-300 hover:bg-white/5'
                }`}
              >
                {t.label}
              </button>
            ))}
            <div className="ml-3 text-xs text-slate-400">
              {user ? `Signed in as ${user.email}` : 'Guest'}
            </div>
          </nav>
        </div>
      </header>

      <main className="flex-1">{Content}</main>

      <footer className="border-t border-white/10 py-6 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4">
          Built with Vite + React + Tailwind. All processing runs locally in your browser. No API keys required.
        </div>
      </footer>
    </div>
  );
}
