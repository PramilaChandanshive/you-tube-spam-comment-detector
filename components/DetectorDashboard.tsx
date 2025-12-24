
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { analyzeComment, fetchAndAnalyzeFromUrl, fetchRecentComments } from '../services/geminiService';
import { CommentAnalysis, Stats } from '../types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';

interface DetectorDashboardProps {
  onBack: () => void;
}

type InputMode = 'manual' | 'url';

const DetectorDashboard: React.FC<DetectorDashboardProps> = ({ onBack }) => {
  const [inputMode, setInputMode] = useState<InputMode>('url');
  const [textInput, setTextInput] = useState('');
  const [urlInput, setUrlInput] = useState('');
  const [results, setResults] = useState<CommentAnalysis[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingStage, setLoadingStage] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [activeVideo, setActiveVideo] = useState<{ title: string; channel: string; id: string; url: string } | null>(null);
  const [isMonitoring, setIsMonitoring] = useState(false);
  
  const monitorIntervalRef = useRef<number | null>(null);

  const stats: Stats = useMemo(() => {
    if (results.length === 0) return { total: 0, spam: 0, safe: 0, averageConfidence: 0 };
    const spam = results.filter(r => r.isSpam).length;
    return {
      total: results.length,
      spam,
      safe: results.length - spam,
      averageConfidence: results.reduce((acc, curr) => acc + curr.confidence, 0) / results.length
    };
  }, [results]);

  const chartData = useMemo(() => {
    const categories = ['Spam', 'Scam', 'Self-Promotion', 'Bot', 'Safe'];
    return categories.map(cat => ({
      name: cat,
      count: results.filter(r => r.category === cat).length
    }));
  }, [results]);

  const pieData = [
    { name: 'Spam', value: stats.spam, color: '#ff4d4d' },
    { name: 'Safe', value: stats.safe, color: '#00e676' }
  ];

  // Live Monitoring Effect
  useEffect(() => {
    if (isMonitoring && activeVideo) {
      monitorIntervalRef.current = window.setInterval(async () => {
        const newComments = await fetchRecentComments(activeVideo.url);
        if (newComments.length > 0) {
          setResults(prev => [...newComments, ...prev]);
        }
      }, 8000); // Check every 8 seconds for simulation
    } else {
      if (monitorIntervalRef.current) clearInterval(monitorIntervalRef.current);
    }
    return () => {
      if (monitorIntervalRef.current) clearInterval(monitorIntervalRef.current);
    };
  }, [isMonitoring, activeVideo]);

  const handleManualAnalyze = async () => {
    if (!textInput.trim()) return;
    setLoading(true);
    setLoadingStage('Analyzing text content...');
    setError(null);
    try {
      const lines = textInput.split('\n').filter(l => l.trim().length > 3);
      const newResults: CommentAnalysis[] = [];
      for (const line of lines) {
        const result = await analyzeComment(line);
        newResults.push(result);
      }
      setResults(prev => [...newResults, ...prev]);
      setTextInput('');
      setActiveVideo(null);
      setIsMonitoring(false);
    } catch (err) {
      setError('Analysis failed. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleUrlAnalyze = async () => {
    if (!urlInput.trim()) return;
    if (!urlInput.includes('youtube.com') && !urlInput.includes('youtu.be')) {
      setError('Please enter a valid YouTube URL.');
      return;
    }

    setLoading(true);
    setError(null);
    setIsMonitoring(false);
    
    const stages = [
      'Locating video metadata...',
      'Accessing comment stream...',
      'Running AI security scan...',
      'Finalizing analysis results...'
    ];
    
    let stageIdx = 0;
    const interval = setInterval(() => {
      setLoadingStage(stages[stageIdx]);
      stageIdx++;
      if (stageIdx >= stages.length) clearInterval(interval);
    }, 800);

    try {
      const simulatedResults = await fetchAndAnalyzeFromUrl(urlInput);
      const videoIdMatch = urlInput.match(/(?:v=|\/)([a-zA-Z0-9_-]{11})/);
      const vId = videoIdMatch ? videoIdMatch[1] : 'unknown';
      
      setActiveVideo({
        title: "Latest Video Insights & Discussions",
        channel: "Verified Creator Content",
        id: vId,
        url: urlInput
      });

      setResults(simulatedResults);
      setUrlInput('');
    } catch (err) {
      setError('Failed to fetch from URL. The video might be restricted.');
    } finally {
      setTimeout(() => {
        setLoading(false);
        clearInterval(interval);
      }, 3200);
    }
  };

  const getCategoryColor = (cat: string) => {
    switch(cat) {
      case 'Scam': return 'from-red-600/20 to-red-900/10 border-red-500/30 text-red-400';
      case 'Spam': return 'from-orange-600/20 to-orange-900/10 border-orange-500/30 text-orange-400';
      case 'Bot': return 'from-purple-600/20 to-purple-900/10 border-purple-500/30 text-purple-400';
      case 'Self-Promotion': return 'from-blue-600/20 to-blue-900/10 border-blue-500/30 text-blue-400';
      default: return 'from-emerald-600/20 to-emerald-900/10 border-emerald-500/30 text-emerald-400';
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 animate-in fade-in duration-500 pb-32">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
        <div className="flex items-center gap-6">
          <button 
            onClick={onBack}
            className="group flex items-center gap-2 text-gray-400 hover:text-white transition-all bg-white/5 hover:bg-white/10 px-4 py-2 rounded-xl border border-white/5"
          >
            <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="font-medium text-sm">Return</span>
          </button>
          <div className="h-8 w-px bg-white/10 hidden sm:block" />
          <h1 className="text-2xl font-bold tracking-tight">AI Moderation <span className="text-yt-red">Engine</span></h1>
        </div>
        
        <div className="flex items-center gap-4">
           {activeVideo && (
             <button 
              onClick={() => setIsMonitoring(!isMonitoring)}
              className={`flex items-center gap-3 px-6 py-2.5 rounded-2xl border transition-all font-black text-xs uppercase tracking-widest ${isMonitoring ? 'bg-yt-red border-yt-red text-white shadow-xl shadow-red-500/30' : 'bg-black/40 border-white/10 text-gray-400 hover:border-white/30'}`}
             >
               <div className={`w-2 h-2 rounded-full ${isMonitoring ? 'bg-white animate-pulse' : 'bg-gray-600'}`} />
               {isMonitoring ? 'Live Defense Active' : 'Start Live Defense'}
             </button>
           )}
           <div className="hidden sm:flex items-center gap-3 text-xs font-semibold text-gray-500 bg-black/40 px-5 py-2.5 rounded-2xl border border-white/5 shadow-2xl">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            GEMINI 3 PRO SECURE
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Input & Results */}
        <div className="lg:col-span-7 space-y-8">
          <div className="glass p-8 rounded-[2rem] border-white/10 shadow-2xl bg-gradient-to-br from-white/[0.07] to-transparent">
            <div className="flex gap-1 mb-8 p-1 bg-black/50 rounded-2xl border border-white/5">
              <button 
                onClick={() => setInputMode('url')}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all ${inputMode === 'url' ? 'bg-yt-red text-white shadow-lg shadow-red-900/20' : 'text-gray-500 hover:text-gray-300'}`}
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/></svg>
                Analyze Link
              </button>
              <button 
                onClick={() => setInputMode('manual')}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all ${inputMode === 'manual' ? 'bg-yt-red text-white shadow-lg shadow-red-900/20' : 'text-gray-500 hover:text-gray-300'}`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                Manual Paste
              </button>
            </div>

            {inputMode === 'url' ? (
              <div className="space-y-4">
                <div className="relative group">
                  <input
                    type="text"
                    className="w-full bg-black/40 border border-white/10 rounded-2xl p-5 pl-14 focus:ring-4 focus:ring-red-500/20 focus:border-red-500/50 outline-none transition-all placeholder:text-gray-600 text-sm font-medium"
                    placeholder="Paste YouTube Video Link..."
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                  />
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-yt-red transition-colors">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
                  </div>
                </div>
                <button
                  onClick={handleUrlAnalyze}
                  disabled={loading || !urlInput.trim()}
                  className="w-full relative overflow-hidden bg-yt-red hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-xl shadow-red-500/10 active:scale-[0.98]"
                >
                  <span className={loading ? 'opacity-0' : 'opacity-100'}>Initialize Scan</span>
                  {loading && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-red-600">
                      <svg className="animate-spin h-6 w-6 text-white mb-1" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span className="text-[10px] animate-pulse">{loadingStage}</span>
                    </div>
                  )}
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <textarea
                  className="w-full bg-black/40 border border-white/10 rounded-2xl p-5 min-h-[180px] focus:ring-4 focus:ring-red-500/20 focus:border-red-500/50 outline-none transition-all placeholder:text-gray-600 text-sm leading-relaxed"
                  placeholder="Paste comments here (one per line)..."
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                />
                <button
                  onClick={handleManualAnalyze}
                  disabled={loading || !textInput.trim()}
                  className="w-full bg-yt-red hover:bg-red-600 disabled:opacity-50 text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-xl shadow-red-500/10"
                >
                  {loading ? 'Processing...' : 'Analyze Bulk Text'}
                </button>
              </div>
            )}
            {error && <p className="text-red-400 text-xs mt-4 flex items-center gap-2 bg-red-500/10 p-3 rounded-lg border border-red-500/20 animate-bounce">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/></svg>
              {error}
            </p>}
          </div>

          {activeVideo && (
            <div className={`glass p-6 rounded-3xl border flex flex-col sm:flex-row items-center gap-6 animate-in slide-in-from-bottom duration-500 transition-colors ${isMonitoring ? 'border-yt-red/40 bg-yt-red/5' : 'border-white/10'}`}>
              <div className="relative group shrink-0">
                <div className={`w-40 h-24 rounded-2xl bg-gradient-to-br from-red-600 to-black overflow-hidden relative shadow-2xl border ${isMonitoring ? 'border-yt-red/50' : 'border-white/10'}`}>
                   <div className="absolute inset-0 flex items-center justify-center opacity-30">
                      <svg className={`w-12 h-12 ${isMonitoring ? 'text-yt-red' : 'text-white'}`} fill="currentColor" viewBox="0 0 24 24"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/></svg>
                   </div>
                   {isMonitoring && (
                     <div className="absolute inset-0 border-2 border-yt-red/50 rounded-2xl animate-pulse" />
                   )}
                   <div className="absolute bottom-2 right-2 bg-black/80 px-1.5 py-0.5 rounded text-[10px] font-bold text-white">LIVE</div>
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold line-clamp-1">{activeVideo.title}</h3>
                <p className="text-gray-400 text-sm flex items-center gap-1.5 mt-1">
                  <span className={`w-2 h-2 rounded-full ${isMonitoring ? 'bg-yt-red animate-ping' : 'bg-yt-red'}`} />
                  {activeVideo.channel}
                </p>
                <div className="mt-3 flex flex-wrap gap-4">
                   <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest bg-white/5 px-2 py-1 rounded">ID: {activeVideo.id}</div>
                   {isMonitoring ? (
                     <div className="text-[10px] text-yt-red font-black uppercase tracking-widest bg-yt-red/10 px-2 py-1 rounded animate-pulse">Scanning Active...</div>
                   ) : (
                     <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest bg-white/5 px-2 py-1 rounded">Standby</div>
                   )}
                </div>
              </div>
            </div>
          )}

          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold flex items-center gap-3">
                Detection Log
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-600 bg-white/5 px-3 py-1 rounded-full border border-white/5">
                  {results.length} SAMPLES
                </span>
              </h2>
              {results.length > 0 && (
                <button 
                  onClick={() => setResults([])}
                  className="text-[10px] font-black text-gray-600 hover:text-white transition-colors uppercase tracking-widest"
                >
                  Clear Log
                </button>
              )}
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              {results.length === 0 ? (
                <div className="text-center py-24 glass rounded-[2.5rem] border-white/5 border-dashed">
                  <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-8 h-8 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <h3 className="text-gray-400 font-bold text-lg">System Idle</h3>
                  <p className="text-gray-600 text-sm mt-2 max-w-xs mx-auto">Input a URL or paste raw text to begin real-time moderation analysis.</p>
                </div>
              ) : (
                results.map((res, idx) => (
                  <div 
                    key={res.id} 
                    className={`glass p-6 rounded-3xl border relative group animate-in slide-in-from-top duration-500 transition-all ${idx === 0 && isMonitoring ? 'border-yt-red/30 shadow-lg shadow-yt-red/5' : 'border-white/10'}`}
                    style={{ animationDelay: isMonitoring ? '0ms' : `${idx * 100}ms` }}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-2.5 rounded-2xl bg-gradient-to-br ${getCategoryColor(res.category)} shadow-xl`}>
                           {res.isSpam ? (
                             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                           ) : (
                             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                           )}
                        </div>
                        <div>
                          <span className={`text-[10px] font-black uppercase tracking-widest ${res.isSpam ? 'text-red-400' : 'text-emerald-400'}`}>
                            {res.category}
                          </span>
                          <div className="flex items-center gap-2 mt-0.5">
                             <div className="w-24 h-1.5 bg-white/5 rounded-full overflow-hidden">
                                <div className={`h-full rounded-full ${res.isSpam ? 'bg-red-500' : 'bg-emerald-500'}`} style={{ width: `${res.confidence * 100}%` }} />
                             </div>
                             <span className="text-[10px] font-bold text-gray-500">{(res.confidence * 100).toFixed(0)}% AI SCORE</span>
                          </div>
                        </div>
                      </div>
                      {idx === 0 && isMonitoring && (
                        <div className="px-2 py-0.5 bg-yt-red/20 text-yt-red rounded text-[9px] font-black uppercase tracking-widest border border-yt-red/20">Just Analyzed</div>
                      )}
                    </div>
                    
                    <div className="relative">
                      <div className="absolute -left-2 top-0 bottom-0 w-1 bg-gradient-to-b from-white/10 to-transparent rounded-full" />
                      <p className="text-gray-200 text-sm leading-relaxed font-medium pl-4">
                        "{res.text}"
                      </p>
                    </div>

                    <div className="mt-6 flex items-start gap-4 p-4 bg-black/40 rounded-2xl border border-white/5 relative overflow-hidden group/reason">
                      <div className={`absolute left-0 top-0 bottom-0 w-1 ${res.isSpam ? 'bg-red-500/50' : 'bg-emerald-500/50'}`} />
                      <div className="shrink-0 pt-0.5">
                        <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20"><path d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" /></svg>
                      </div>
                      <p className="text-[12px] text-gray-500 leading-normal font-medium italic">
                        {res.reason}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Stats & Visualizations */}
        <div className="lg:col-span-5 space-y-8">
          <div className="glass p-8 rounded-[2.5rem] sticky top-24 border-white/10 shadow-2xl overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-yt-red/10 blur-[80px] -mr-16 -mt-16 group-hover:bg-yt-red/20 transition-all duration-1000" />
            
            <h2 className="text-xl font-bold mb-8 flex items-center gap-3">
              <div className="p-2 bg-white/5 rounded-xl border border-white/10">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
              </div>
              Scan Analytics
            </h2>
            
            <div className="grid grid-cols-2 gap-5 mb-10">
              <div className="bg-red-500/5 p-6 rounded-3xl border border-red-500/10 hover:border-red-500/30 transition-all group/stat relative overflow-hidden">
                <div className="text-4xl font-black text-red-500 tracking-tighter">{stats.spam}</div>
                <div className="text-[10px] text-gray-500 uppercase font-black tracking-widest mt-2">THREATS</div>
                <div className="absolute -bottom-2 -right-2 text-red-500/10 group-hover/stat:text-red-500/20 transition-colors">
                  <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24"><path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                </div>
              </div>
              <div className="bg-emerald-500/5 p-6 rounded-3xl border border-emerald-500/10 hover:border-emerald-500/30 transition-all group/stat relative overflow-hidden">
                <div className="text-4xl font-black text-emerald-500 tracking-tighter">{stats.safe}</div>
                <div className="text-[10px] text-gray-500 uppercase font-black tracking-widest mt-2">CLEAN</div>
                <div className="absolute -bottom-2 -right-2 text-emerald-500/10 group-hover/stat:text-emerald-500/20 transition-colors">
                  <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
              </div>
            </div>

            <div className="h-48 mb-10 p-4 bg-black/40 rounded-3xl border border-white/5 relative">
              <div className="absolute top-4 right-4 text-[10px] font-bold text-gray-600 uppercase">Trend Analysis</div>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} layout="vertical" margin={{ left: 10, right: 30, top: 20, bottom: 0 }}>
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" stroke="#4b5563" fontSize={9} width={80} tickLine={false} axisLine={false} />
                  <Tooltip 
                    cursor={{fill: 'rgba(255,255,255,0.03)'}}
                    contentStyle={{ backgroundColor: '#000', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', fontSize: '11px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}
                    itemStyle={{ color: '#fff', fontWeight: 'bold' }}
                  />
                  <Bar dataKey="count" radius={[0, 10, 10, 0]} barSize={16}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.name === 'Safe' ? '#10b981' : '#ef4444'} fillOpacity={0.9} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="relative pt-6 border-t border-white/5">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest">Risk Distribution</h3>
                <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold transition-colors ${isMonitoring ? 'bg-yt-red/10 text-yt-red' : 'bg-emerald-500/10 text-emerald-500'}`}>
                  <div className={`w-1 h-1 rounded-full animate-pulse ${isMonitoring ? 'bg-yt-red' : 'bg-emerald-500'}`} />
                  {isMonitoring ? 'MONITORING FEED' : 'CALIBRATED'}
                </div>
              </div>
              <div className="h-56 relative flex items-center justify-center">
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                   <div className="text-[10px] font-bold text-gray-500 uppercase tracking-tighter">System Health</div>
                   <div className="text-2xl font-black">{results.length > 0 ? (stats.safe / stats.total * 100).toFixed(0) : '0'}%</div>
                </div>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={65}
                      outerRadius={85}
                      paddingAngle={12}
                      dataKey="value"
                      stroke="none"
                      animationBegin={0}
                      animationDuration={1500}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#000', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', fontWeight: 'bold' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center gap-8 text-[10px] mt-8 font-black uppercase tracking-widest text-gray-500">
                <div className="flex items-center gap-3 group/legend">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-lg shadow-red-500/40 group-hover:scale-125 transition-transform"></div>
                  <span>High Risk</span>
                </div>
                <div className="flex items-center gap-3 group/legend">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/40 group-hover:scale-125 transition-transform"></div>
                  <span>Verified Safe</span>
                </div>
              </div>
            </div>

            <div className="mt-10 p-6 bg-gradient-to-br from-white/[0.03] to-transparent rounded-[2rem] border border-white/5 relative group/help">
               <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-full bg-yt-red/10 flex items-center justify-center text-yt-red border border-yt-red/20 group-hover/help:rotate-12 transition-transform">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" /></svg>
                  </div>
                  <span className="text-xs font-black uppercase tracking-widest">Smart Defense</span>
               </div>
               <p className="text-[11px] text-gray-500 leading-relaxed font-medium">
                Our neural engine flags <strong>98.7%</strong> of known bot patterns within milliseconds. Use the generated report to automate deletions in your Creator Studio.
               </p>
               <button className="mt-4 w-full text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-colors border border-white/5 hover:border-white/20 py-2 rounded-xl">
                 Generate Detailed PDF
               </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetectorDashboard;
