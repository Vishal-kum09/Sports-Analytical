// @ts-nocheck
"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import dynamic from 'next/dynamic';
import { Trophy, Activity, Target, PieChart, TrendingUp, Shield, BarChart3, Zap } from 'lucide-react';

// Plotly ko browser-only mode mein load karne ke liye
const Plot = dynamic(() => import('react-plotly.js'), { 
  ssr: false,
  loading: () => <div className="h-64 bg-slate-900 animate-pulse rounded-2xl flex items-center justify-center text-slate-500">Loading Chart...</div>
});

export default function SportsDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const API_URL = 'https://sports-analytical-2.onrender.com';

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get(`${API_URL}/stats`);
        if (res.data && res.data.summary) {
          setData(res.data);
          setError(false);
        } else {
          setError(true);
        }
      } catch (err) {
        console.error("API Error:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  // 1. Loading State
  if (loading) return (
    <div className="h-screen bg-slate-950 flex flex-col items-center justify-center text-white p-4">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-500 mb-4"></div>
      <p className="tracking-widest uppercase text-sm font-bold animate-pulse">Fetching Match Intelligence...</p>
    </div>
  );

  // 2. Error State (Agar Render so raha ho)
  if (error || !data) return (
    <div className="h-screen bg-slate-950 flex flex-col items-center justify-center text-white p-4 text-center">
      <p className="text-xl font-bold mb-4 text-rose-500">Backend is waking up...</p>
      <p className="text-slate-400 mb-6 text-sm">Render free tier takes 30-50 seconds to start. Please refresh.</p>
      <button onClick={() => window.location.reload()} className="bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-full font-bold transition-all shadow-lg shadow-blue-500/20">
        Retry Connection
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-10">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div>
                <h1 className="text-3xl font-black border-l-4 border-blue-600 pl-4 uppercase tracking-tighter">Elite Analytics Pro</h1>
                <p className="text-slate-500 text-sm pl-4 mt-1 font-medium italic">Professional Player Insights v2.5</p>
            </div>
            <div className="bg-blue-600/10 text-blue-400 px-4 py-2 rounded-full border border-blue-600/20 text-xs font-bold flex items-center gap-2 self-start md:self-center">
                <Zap size={14} className="animate-pulse"/> LIVE DATA STREAM ACTIVE
            </div>
        </header>

        {/* Top KPI Row - Safe access using optional chaining (?) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl">
                <Activity className="text-blue-500 mb-2" />
                <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Total Match Runs</p>
                <h2 className="text-4xl font-black">{data?.summary?.total_runs || 0}</h2>
            </div>
            <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl">
                <Target className="text-emerald-500 mb-2" />
                <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Control Factor</p>
                <h2 className="text-4xl font-black">{data?.summary?.control_pct || 0}%</h2>
            </div>
            <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl">
                <Trophy className="text-amber-500 mb-2" />
                <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Total Wickets</p>
                <h2 className="text-4xl font-black">{data?.summary?.total_wickets || 0}</h2>
            </div>
        </div>

        {/* Charts and Tables continue below... (Maine saare components mein safety checks add kar diye hain) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><TrendingUp size={18} className="text-emerald-400"/> Momentum</h3>
                <Plot
                    data={[{ 
                        x: data?.momentum_data ? Object.keys(data.momentum_data) : [], 
                        y: data?.momentum_data ? Object.values(data.momentum_data) : [], 
                        type: 'scatter', mode: 'lines+markers', 
                        line: {color: '#10b981'} 
                    }]}
                    layout={{ autosize: true, paper_bgcolor: 'rgba(0,0,0,0)', plot_bgcolor: 'rgba(0,0,0,0)', font: {color: '#94a3b8'} }}
                    style={{ width: "100%", height: "300px" }}
                    config={{ responsive: true }}
                />
            </div>
            
            <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><BarChart3 size={18} className="text-purple-400"/> Pitch Analysis</h3>
                <Plot
                    data={[{ 
                        labels: data?.length_data ? Object.keys(data.length_data) : [], 
                        values: data?.length_data ? Object.values(data.length_data) : [], 
                        type: 'pie', hole: 0.4
                    }]}
                    layout={{ autosize: true, paper_bgcolor: 'rgba(0,0,0,0)', font: {color: '#94a3b8'} }}
                    style={{ width: "100%", height: "300px" }}
                />
            </div>
        </div>
        
        <p className="text-center text-slate-600 text-xs italic mt-10">Data synchronized with Render Cloud Engine</p>
      </div>
    </div>
  );
}
