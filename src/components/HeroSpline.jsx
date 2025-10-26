import Spline from '@splinetool/react-spline';

export default function HeroSpline() {
  return (
    <section className="relative h-[78vh] w-full overflow-hidden">
      <div className="absolute inset-0">
        <Spline scene="https://prod.spline.design/4cHQr84zOGAHOehh/scene.splinecode" style={{ width: '100%', height: '100%' }} />
      </div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/30 via-black/10 to-black/60" />

      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-7xl mx-auto w-full px-6">
          <div className="max-w-2xl">
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight">
              Multi‑Agent Intelligence, Locally.
            </h2>
            <p className="mt-4 text-slate-300">
              Problem solving, visual creation, and image understanding without external APIs. Orchestrated agents collaborate to plan, analyze, and design — all in your browser.
            </p>
            <ul className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-slate-300">
              <li className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-purple-400"/>Planner, Researcher, Coder, Designer agents</li>
              <li className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-blue-400"/>Procedural logo & "Ghibli"-style generator</li>
              <li className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-orange-400"/>Image upload with color & edge analysis</li>
              <li className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-emerald-400"/>Local logging & cost estimator</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
