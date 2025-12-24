
import React, { useState } from 'react';

interface LandingPageProps {
  onStart: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  const [showGuide, setShowGuide] = useState(false);

  return (
    <div className="relative overflow-hidden selection:bg-red-500/30">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 glass px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2 group cursor-pointer" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
            <div className="bg-yt-red p-1.5 rounded-lg group-hover:scale-110 transition-transform shadow-lg shadow-red-500/20">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
              </svg>
            </div>
            <span className="text-xl font-bold tracking-tighter">SpamGuard<span className="text-yt-red">AI</span></span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">Features</a>
            <button 
              onClick={() => setShowGuide(true)}
              className="text-sm font-medium text-gray-400 hover:text-white transition-colors"
            >
              How it Works
            </button>
          </div>
          <button 
            onClick={onStart}
            className="bg-yt-red hover:bg-red-700 text-white px-6 py-2.5 rounded-xl font-bold text-sm transition-all shadow-lg shadow-red-500/20 active:scale-95"
          >
            Launch Detector
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-48 pb-32 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-8 animate-in fade-in slide-in-from-bottom duration-700">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            Next-Gen Moderation Engine
          </div>
          <h1 className="text-6xl md:text-8xl font-black mb-8 leading-[0.9] tracking-tighter">
            Eradicate Spam with <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-yt-red to-orange-500">Neural Precision</span>
          </h1>
          <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto font-medium leading-relaxed">
            The ultimate security layer for creators. Identify crypto scams, bot networks, and toxic actors in real-time using Gemini 3 Pro intelligence.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-5">
            <button 
              onClick={onStart}
              className="bg-white text-black hover:bg-gray-200 px-10 py-5 rounded-2xl text-lg font-black transition-all shadow-2xl shadow-white/5 flex items-center justify-center gap-3 active:scale-[0.98]"
            >
              Start Detection Now
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            </button>
            <button 
              onClick={() => setShowGuide(true)}
              className="glass px-10 py-5 rounded-2xl text-lg font-bold hover:bg-white/10 transition-all border border-white/10 flex items-center justify-center gap-3"
            >
              How It Works
            </button>
          </div>
        </div>
      </section>

      {/* Steps Section */}
      <section id="how-to-use" className="py-32 px-6 bg-gradient-to-b from-transparent to-black/40">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">4 Steps to a <span className="text-yt-red">Clean Channel</span></h2>
            <p className="text-gray-500 font-medium">SpamGuard AI makes professional moderation accessible to everyone.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
            <div className="hidden md:block absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-y-1/2" />
            
            <StepItem num="01" title="Input Source" desc="Enter a YouTube Video URL or paste individual suspicious comments manually." icon={<InputIcon />} />
            <StepItem num="02" title="AI Analysis" desc="Gemini 3 Pro scans for Telegram links, sub4sub begging, and bot behavior patterns." icon={<AiIcon />} />
            <StepItem num="03" title="Risk Scoring" desc="Review confidence metrics and detailed reasoning for every flagged item." icon={<StatsIcon />} />
            <StepItem num="04" title="Moderate" desc="Export findings and clean your community based on high-confidence alerts." icon={<TrashIcon />} />
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-32 px-6 border-y border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<ShieldCheckIcon />}
              title="Scam Detection"
              description="Instantly flag Telegram/WhatsApp redirects and crypto investment 'opportunities' that plague your channel."
            />
            <FeatureCard 
              icon={<BotIcon />}
              title="Bot Recognition"
              description="Identify patterns common to bot networks, like repetitive generic praise or sub-for-sub requests."
            />
            <FeatureCard 
              icon={<ZapIcon />}
              title="Real-time Analysis"
              description="Powered by Gemini 3 Flash for near-instant results, allowing you to moderate at the speed of internet."
            />
          </div>
        </div>
      </section>

      {/* Instructional Modal (How It Works Information) */}
      {showGuide && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" onClick={() => setShowGuide(false)} />
          <div className="relative glass w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-[3rem] border-white/10 p-8 md:p-12 shadow-2xl animate-in zoom-in-95 duration-300">
            <button 
              onClick={() => setShowGuide(false)}
              className="absolute top-8 right-8 p-2 hover:bg-white/10 rounded-full transition-colors text-gray-500 hover:text-white"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l18 18" /></svg>
            </button>

            <div className="space-y-12">
              <header className="text-center">
                <div className="w-20 h-20 bg-yt-red/10 rounded-3xl flex items-center justify-center mx-auto mb-6 text-yt-red border border-yt-red/20 shadow-xl shadow-yt-red/5">
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <h2 className="text-4xl font-black tracking-tighter mb-4">How SpamGuard <span className="text-yt-red">Operates</span></h2>
                <p className="text-gray-400 max-w-xl mx-auto font-medium">A technical breakdown of our detection engine and AI simulation protocols.</p>
              </header>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-6">
                  <div className="p-6 bg-white/5 rounded-3xl border border-white/5">
                    <h3 className="text-lg font-bold mb-3 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-yt-red/20 flex items-center justify-center text-yt-red">1</div>
                      The Neural Core
                    </h3>
                    <p className="text-sm text-gray-500 leading-relaxed">
                      At its heart, we utilize <strong>Gemini 3 Pro</strong>. Unlike simple keyword blockers, our AI understands context. It recognizes that "Contact me on TG" is almost always a scam, even if the scammer uses symbols like "T.e.l.e.g.r.a.m" to bypass basic filters.
                    </p>
                  </div>
                  <div className="p-6 bg-white/5 rounded-3xl border border-white/5">
                    <h3 className="text-lg font-bold mb-3 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-yt-red/20 flex items-center justify-center text-yt-red">2</div>
                      Simulation Engine
                    </h3>
                    <p className="text-sm text-gray-500 leading-relaxed">
                      When you paste a YouTube link, we use a <strong>Generative Simulation Engine</strong> to retrieve and analyze typical engagement patterns for that specific video style, identifying bot swarms that generic tools miss.
                    </p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="p-6 bg-white/5 rounded-3xl border border-white/5">
                    <h3 className="text-lg font-bold mb-3 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-yt-red/20 flex items-center justify-center text-yt-red">3</div>
                      Risk Calibration
                    </h3>
                    <p className="text-sm text-gray-500 leading-relaxed">
                      Every comment receives a <strong>Confidence Score (0-100%)</strong>. Items over 85% are marked for immediate deletion, while lower scores might represent borderline cases like aggressive self-promotion or repetitive generic praise.
                    </p>
                  </div>
                  <div className="p-6 bg-white/5 rounded-3xl border border-white/5">
                    <h3 className="text-lg font-bold mb-3 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-yt-red/20 flex items-center justify-center text-yt-red">4</div>
                      Community Impact
                    </h3>
                    <p className="text-sm text-gray-500 leading-relaxed">
                      By cleaning your comments, you improve your video's <strong>SEO Performance</strong>. YouTube's algorithm favors videos with high-quality, genuine human interaction over those littered with bot spam and malicious links.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-8 border-t border-white/5 flex flex-col items-center">
                <button 
                  onClick={onStart}
                  className="bg-yt-red hover:bg-red-600 text-white px-12 py-4 rounded-2xl font-black uppercase tracking-widest transition-all shadow-xl shadow-red-500/20 active:scale-95"
                >
                  Got it, Start Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <footer className="py-20 text-center border-t border-white/5 bg-black">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-10">
            <div className="text-left">
              <span className="text-2xl font-black tracking-tighter">SpamGuard<span className="text-yt-red">AI</span></span>
              <p className="text-gray-600 mt-2 text-sm">Empowering creators with industrial-grade AI moderation.</p>
            </div>
            <div className="flex gap-10 text-xs font-bold uppercase tracking-widest text-gray-500">
               <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
               <a href="#" className="hover:text-white transition-colors">API Status</a>
               <a href="#" className="hover:text-white transition-colors">Contact</a>
            </div>
          </div>
          <div className="mt-20 pt-10 border-t border-white/5 text-[10px] text-gray-700 uppercase tracking-widest">
            © 2024 SpamGuard AI. All rights reserved. Not affiliated with Google or YouTube.
          </div>
        </div>
      </footer>
    </div>
  );
};

const StepItem: React.FC<{ num: string, title: string, desc: string, icon: React.ReactNode }> = ({ num, title, desc, icon }) => (
  <div className="relative z-10 p-8 glass rounded-[2.5rem] border-white/5 group hover:border-yt-red/30 transition-all duration-500">
    <div className="absolute top-6 right-8 text-4xl font-black text-white/5 group-hover:text-yt-red/10 transition-colors">{num}</div>
    <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform group-hover:bg-yt-red/10 group-hover:text-yt-red">
      {icon}
    </div>
    <h3 className="text-xl font-bold mb-3">{title}</h3>
    <p className="text-gray-500 text-sm leading-relaxed font-medium">{desc}</p>
  </div>
);

const FeatureCard: React.FC<{ icon: React.ReactNode, title: string, description: string }> = ({ icon, title, description }) => (
  <div className="glass p-10 rounded-[3rem] hover:border-yt-red/30 transition-all group relative overflow-hidden">
    <div className="absolute top-0 right-0 w-32 h-32 bg-yt-red/5 blur-3xl -mr-16 -mt-16 group-hover:bg-yt-red/10 transition-all" />
    <div className="w-16 h-16 bg-yt-red/10 rounded-[1.5rem] flex items-center justify-center mb-8 group-hover:rotate-12 transition-all">
      {icon}
    </div>
    <h3 className="text-2xl font-bold mb-4">{title}</h3>
    <p className="text-gray-400 leading-relaxed font-medium">{description}</p>
  </div>
);

// Icons components for cleaner JSX
const InputIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
);
const AiIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.673.337a4 4 0 01-2.509.371l-3.397-.485a2 2 0 01-1.414-1.414l-.485-3.397a4 4 0 01.371-2.509l.337-.673a6 6 0 00.517-3.86l-.477-2.387a2 2 0 00-.547-1.022L7.428 2.572" /></svg>
);
const StatsIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
);
const TrashIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
);
const ShieldCheckIcon = () => (
  <svg className="w-8 h-8 yt-red" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
);
const BotIcon = () => (
  <svg className="w-8 h-8 yt-red" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>
);
const ZapIcon = () => (
  <svg className="w-8 h-8 yt-red" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
);

export default LandingPage;
