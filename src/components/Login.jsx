import { useEffect, useState } from 'react';

export default function Login({ onAuth, currentUser }) {
  const [email, setEmail] = useState('');
  const [pwd, setPwd] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (currentUser) {
      setEmail(currentUser.email || '');
    }
  }, [currentUser]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      setError('Please enter a valid email.');
      return;
    }
    if (pwd.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    const user = { email };
    localStorage.setItem('user', JSON.stringify(user));
    if (onAuth) onAuth(user);
  };

  const handleSignOut = () => {
    localStorage.removeItem('user');
    if (onAuth) onAuth(null);
  };

  return (
    <section className="max-w-md mx-auto px-4 py-12">
      <h3 className="text-xl font-semibold">Login</h3>
      <p className="text-sm text-slate-400 mb-4">Simple local login stored in your browser only.</p>

      {currentUser ? (
        <div className="bg-white/5 border border-white/10 rounded-xl p-5">
          <div className="text-sm">Signed in as <span className="font-medium">{currentUser.email}</span></div>
          <button onClick={handleSignOut} className="mt-4 px-4 py-2 rounded-md bg-white/10 hover:bg-white/20">Sign out</button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white/5 border border-white/10 rounded-xl p-5 space-y-4">
          <div>
            <label className="block text-sm mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={e=>setEmail(e.target.value)}
              className="w-full bg-black/40 rounded-md border border-white/10 p-3 text-sm outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="you@example.com"
              required
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Password</label>
            <input
              type="password"
              value={pwd}
              onChange={e=>setPwd(e.target.value)}
              className="w-full bg-black/40 rounded-md border border-white/10 p-3 text-sm outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Minimum 6 characters"
              required
              minLength={6}
            />
          </div>
          {error && <div className="text-sm text-red-400">{error}</div>}
          <button type="submit" className="w-full px-4 py-2 rounded-md bg-gradient-to-r from-purple-600 to-blue-600">Sign in</button>
        </form>
      )}

      <div className="mt-6 text-xs text-slate-400">
        This login is purely client-side for demonstration. No data is sent to a server. You can clear it anytime from your browser storage.
      </div>
    </section>
  );
}
