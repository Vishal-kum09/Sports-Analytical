//@ts-nocheck
"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import dynamic from 'next/dynamic';
import { Trophy, Activity, Target, PieChart, TrendingUp, Shield, BarChart3, Zap, Table as TableIcon, User } from 'lucide-react';

const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });

export default function SportsDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Note: Deployment ke waqt yahan apna Render URL dalna
  const API_URL = 'https://sports-analytical-2.onrender.com';

  useEffect(() => {
    axios.get(`${API_URL}/stats`).then(res => {
      setData(res.data);
      setLoading(false);
    }).catch(err => {
      console.error("Error fetching data:", err);
      setLoading(false);
    });
  }, []);

  if (loading) return (
    <div className="h-screen bg-slate-950 flex flex-col items-center justify-center text-white italic text-center p-4">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-500 mb-4"></div>
      <p className="tracking-widest uppercase text-sm font-bold">Compiling Elite Match Intelligence...</p>
    </div>
  );

  if (!data) return <div className="text-white text-center mt-20">No data found. Check Backend.</div>;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-10">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <header className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div>
                <h1 className="text-3xl font-black border-l-4 border-blue-600 pl-4 uppercase tracking-tighter">
                Elite Analytics Pro
                </h1>
                <p className="text-slate-500 text-sm pl-4 mt-1 font-medium italic">Professional Player Insights v2.5</p>
            </div>
            <div className="bg-blue-600/10 text-blue-400 px-4 py-2 rounded-full border border-blue-600/20 text-xs font-bold flex items-center gap-2 self-start md:self-center animate-pulse">
                <Zap size={14}/> LIVE DATA STREAM ACTIVE
            </div>
        </header>

        {/* Top KPI Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl group hover:border-blue-500/50 transition-all">
                <Activity className="text-blue-500 mb-2 group-hover:scale-110 transition-transform" />
                <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Total Match Runs</p>
                <h2 className="text-4xl font-black">{data.summary.total_runs}</h2>
            </div>
            <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl group hover:border-emerald-500/50 transition-all">
                <Target className="text-emerald-500 mb-2 group-hover:scale-110 transition-transform" />
                <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Control Factor</p>
                <h2 className="text-4xl font-black">{data.summary.control_pct}%</h2>
            </div>
            <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl group hover:border-amber-500/50 transition-all">
                <Trophy className="text-amber-500 mb-2 group-hover:scale-110 transition-transform" />
                <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Total Wickets</p>
                <h2 className="text-4xl font-black">{data.summary.total_wickets}</h2>
            </div>
        </div>

        {/* --- DUAL LEADERBOARDS --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            
            {/* Batting Efficiency Table */}
            <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden">
                <div className="flex items-center gap-2 mb-6 border-b border-slate-800 pb-4">
                    <Zap className="text-emerald-400" size={20}/>
                    <h3 className="text-xl font-bold uppercase tracking-tight">Batting Efficiency</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-slate-500 text-xs uppercase tracking-tighter">
                                <th className="py-2 px-2">Batter</th>
                                <th className="py-2 px-2 text-center">Runs</th>
                                <th className="py-2 px-2 text-right text-emerald-400">Strike Rate</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/50">
                            {data.batting_leaderboard.map((player: any) => (
                                <tr key={player.name} className="hover:bg-slate-800/30 transition group">
                                    <td className="py-4 px-2 font-bold text-slate-200 flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-emerald-500"></div> {player.name}
                                    </td>
                                    <td className="py-4 px-2 text-center font-mono">{player.runs}</td>
                                    <td className="py-4 px-2 text-right font-black text-emerald-400 font-mono">
                                        {player.sr}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Bowling Economy Table */}
            <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden">
                <div className="flex items-center gap-2 mb-6 border-b border-slate-800 pb-4">
                    <Shield className="text-rose-400" size={20}/>
                    <h3 className="text-xl font-bold uppercase tracking-tight">Bowling Economy</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-slate-500 text-xs uppercase tracking-tighter">
                                <th className="py-2 px-2">Bowler</th>
                                <th className="py-2 px-2 text-center">Overs</th>
                                <th className="py-2 px-2 text-right text-rose-400">Economy</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/50">
                            {data.bowling_leaderboard.map((player: any) => (
                                <tr key={player.name} className="hover:bg-slate-800/30 transition group">
                                    <td className="py-4 px-2 font-bold text-slate-200 flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-rose-500"></div> {player.name}
                                    </td>
                                    <td className="py-4 px-2 text-center font-mono">{player.overs}</td>
                                    <td className="py-4 px-2 text-right font-black text-rose-400 font-mono">
                                        {player.economy}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        {/* Row 1: Charts Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><TrendingUp size={18} className="text-emerald-400"/> Match Scoring Momentum</h3>
                // @ts-ignore
                <Plot
                    data={[{ x: Object.keys(data.momentum_data), y: Object.values(data.momentum_data), type: 'scatter', mode: 'lines+markers', line: {color: '#10b981', width: 3}, marker: {size: 8, color: '#059669'} }]}
                    layout={{ autosize: true, paper_bgcolor: 'rgba(0,0,0,0)', plot_bgcolor: 'rgba(0,0,0,0)', font: {color: '#94a3b8'}, margin: {t:10, b:40, l:40, r:10}, xaxis: {gridcolor: '#1e293b'}, yaxis: {gridcolor: '#1e293b'} }}
                    style={{ width: "100%", height: "300px" }}
                    config={{ responsive: true, displayModeBar: false }}
                />
            </div>

            <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><BarChart3 size={18} className="text-purple-400"/> Pitch Map Analysis</h3>
                <Plot
                    data={[{ 
                        labels: Object.keys(data.length_data), 
                        values: Object.values(data.length_data), 
                        type: 'pie', 
                        hole: 0.5, 
                        marker: {colors: ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444']} 
                    }]}
                    layout={{ autosize: true, paper_bgcolor: 'rgba(0,0,0,0)', plot_bgcolor: 'rgba(0,0,0,0)', font: {color: '#94a3b8'}, margin: {t:20, b:20, l:20, r:20}, showlegend: true, legend: {orientation: 'h', y: -0.2} }}
                    style={{ width: "100%", height: "300px" }}
                    config={{ responsive: true, displayModeBar: false }}
                />
            </div>
        </div>

        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><PieChart size={18} className="text-amber-400"/> Shot Selection distribution</h3>
            <Plot
                data={[{ 
                    labels: Object.keys(data.shot_data), 
                    values: Object.values(data.shot_data), 
                    type: 'pie', 
                    marker: {colors: ['#2563eb', '#059669', '#d97706', '#dc2626', '#7c3aed']} 
                }]}
                layout={{ autosize: true, paper_bgcolor: 'rgba(0,0,0,0)', plot_bgcolor: 'rgba(0,0,0,0)', font: {color: '#94a3b8'}, margin: {t:20, b:20, l:20, r:20}, showlegend: true, legend: {orientation: 'h', y: -0.2} }}
                style={{ width: "100%", height: "350px" }}
                config={{ responsive: true, displayModeBar: false }}
            />
        </div>
      </div>
    </div>
  );
}
