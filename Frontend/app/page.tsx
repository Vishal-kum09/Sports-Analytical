"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import dynamic from 'next/dynamic';
import { Trophy, Activity, Target, PieChart, TrendingUp, Shield, BarChart3 } from 'lucide-react';

const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });

export default function SportsDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/stats').then(res => {
      setData(res.data);
      setLoading(false);
    });
  }, []);

  if (loading) return (
    <div className="h-screen bg-slate-950 flex flex-col items-center justify-center text-white italic">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-500 mb-4"></div>
      COMPILING MATCH INTELLIGENCE...
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-10">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-black mb-8 border-l-4 border-blue-600 pl-4 uppercase tracking-tighter">
          Pro-Level Match Analytics
        </h1>

        {/* Top KPI Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-lg">
                <Activity className="text-blue-500 mb-2" />
                <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Total Runs</p>
                <h2 className="text-4xl font-black">{data.summary.total_runs}</h2>
            </div>
            <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-lg">
                <Target className="text-emerald-500 mb-2" />
                <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Control %</p>
                <h2 className="text-4xl font-black">{data.summary.control_pct}%</h2>
            </div>
            <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-lg">
                <Trophy className="text-amber-500 mb-2" />
                <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Wickets</p>
                <h2 className="text-4xl font-black">{data.summary.total_wickets}</h2>
            </div>
        </div>

        {/* Row 1: Batting vs Bowling Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Batter Bar Chart */}
            <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><Activity size={18} className="text-blue-400"/> Batter Performance</h3>
                <Plot
                    data={[{ x: Object.keys(data.batter_data), y: Object.values(data.batter_data), type: 'bar', marker: {color: '#3b82f6'} }]}
                    layout={{ autosize: true, paper_bgcolor: 'rgba(0,0,0,0)', plot_bgcolor: 'rgba(0,0,0,0)', font: {color: '#94a3b8'}, margin: {t:10, b:30, l:40, r:10}, xaxis: {gridcolor: '#1e293b'}, yaxis: {gridcolor: '#1e293b'} }}
                    style={{ width: "100%", height: "300px" }}
                    config={{ responsive: true, displayModeBar: false }}
                />
            </div>

            {/* NEW: Bowler Economy Chart */}
            <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><Shield size={18} className="text-red-400"/> Bowler Impact (Runs Conceded)</h3>
                <Plot
                    data={[{ 
                        y: Object.keys(data.bowler_data), 
                        x: Object.values(data.bowler_data), 
                        type: 'bar', 
                        orientation: 'h', 
                        marker: {color: '#ef4444'} 
                    }]}
                    layout={{ autosize: true, paper_bgcolor: 'rgba(0,0,0,0)', plot_bgcolor: 'rgba(0,0,0,0)', font: {color: '#94a3b8'}, margin: {t:10, b:30, l:80, r:10}, xaxis: {gridcolor: '#1e293b'} }}
                    style={{ width: "100%", height: "300px" }}
                    config={{ responsive: true, displayModeBar: false }}
                />
            </div>
        </div>

        {/* Row 2: Momentum & Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
             {/* Match Momentum */}
             <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><TrendingUp size={18} className="text-emerald-400"/> Scoring Momentum</h3>
                <Plot
                    data={[{ x: Object.keys(data.momentum_data), y: Object.values(data.momentum_data), type: 'scatter', mode: 'lines+markers', line: {color: '#10b981', width: 3}, marker: {size: 8} }]}
                    layout={{ autosize: true, paper_bgcolor: 'rgba(0,0,0,0)', plot_bgcolor: 'rgba(0,0,0,0)', font: {color: '#94a3b8'}, margin: {t:10, b:30, l:40, r:10}, xaxis: {gridcolor: '#1e293b'}, yaxis: {gridcolor: '#1e293b'} }}
                    style={{ width: "100%", height: "300px" }}
                    config={{ responsive: true }}
                />
            </div>

            {/* NEW: Bowling Length (Pitch Map) */}
            <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><BarChart3 size={18} className="text-purple-400"/> Bowling Length Analysis</h3>
                <Plot
                    data={[{ 
                        labels: Object.keys(data.length_data), 
                        values: Object.values(data.length_data), 
                        type: 'pie', 
                        hole: 0.6, 
                        marker: {colors: ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b']} 
                    }]}
                    layout={{ autosize: true, paper_bgcolor: 'rgba(0,0,0,0)', plot_bgcolor: 'rgba(0,0,0,0)', font: {color: '#94a3b8'}, margin: {t:20, b:20, l:20, r:20}, showlegend: true, legend: {orientation: 'h', y: -0.2} }}
                    style={{ width: "100%", height: "300px" }}
                    config={{ responsive: true }}
                />
            </div>
        </div>

        {/* Bottom Row: Shot Analysis */}
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><PieChart size={18} className="text-amber-400"/> Shot Selection Distribution</h3>
            <Plot
                data={[{ labels: Object.keys(data.shot_data), values: Object.values(data.shot_data), type: 'pie', hole: 0.4, marker: {colors: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444']} }]}
                layout={{ autosize: true, paper_bgcolor: 'rgba(0,0,0,0)', plot_bgcolor: 'rgba(0,0,0,0)', font: {color: '#94a3b8'}, margin: {t:10, b:10, l:10, r:10} }}
                style={{ width: "100%", height: "350px" }}
                config={{ responsive: true }}
            />
        </div>
      </div>
    </div>
  );
}