import React, { useState } from 'react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, BarChart2 } from 'lucide-react';

export default function TrendView({ trends }) {
    const [viewMode, setViewMode] = useState('rating'); // rating, volume

    // Fallback if no trends logic provided
    if (!trends || (!trends.monthly_trend && !trends.trend_summary)) {
        return null;
    }

    const chartData = trends.monthly_trend || [];
    const trendSummary = trends.trend_summary;

    return (
        <div className="bg-white/70 backdrop-blur-md rounded-3xl shadow-lg shadow-indigo-100/30 border border-white/60 p-8 mb-8 relative overflow-hidden">
            {/* Glossy overlay */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-400/20 to-transparent"></div>

            <div className="md:flex items-center justify-between mb-8">
                <div>
                    <h3 className="text-xl font-bold text-slate-800 flex items-center">
                        <TrendingUp className="w-6 h-6 mr-3 text-indigo-500 p-1 bg-indigo-50 rounded-lg" />
                        Trendanalyse
                    </h3>
                    <p className="text-slate-500 text-sm mt-2 ml-9 max-w-lg leading-relaxed">{trendSummary || 'Historische Entwicklung über Zeit'}</p>
                </div>

                <div className="flex bg-slate-100/50 p-1.5 rounded-2xl mt-6 md:mt-0 border border-slate-200/50">
                    <button
                        onClick={() => setViewMode('rating')}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${viewMode === 'rating' ? 'bg-white text-indigo-600 shadow-md shadow-indigo-100' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50/50'}`}
                    >
                        <TrendingUp size={16} /> Bewertung
                    </button>
                    <button
                        onClick={() => setViewMode('volume')}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${viewMode === 'volume' ? 'bg-white text-purple-600 shadow-md shadow-purple-100' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50/50'}`}
                    >
                        <BarChart2 size={16} /> Volumen
                    </button>
                </div>
            </div>

            <div className="h-[400px] w-full bg-linear-to-b from-white/30 to-transparent rounded-2xl p-4 border border-white/40">
                <ResponsiveContainer width="100%" height="100%">
                    {viewMode === 'rating' ? (
                        <AreaChart data={chartData}>
                            <defs>
                                <linearGradient id="colorRating" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4} />
                                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" strokeOpacity={0.6} />
                            <XAxis
                                dataKey="month"
                                tick={{ fontSize: 12, fill: '#64748b', fontWeight: 500 }}
                                axisLine={false}
                                tickLine={false}
                                dy={15}
                            />
                            <YAxis
                                domain={[Math.min(...chartData.map(d => d.rating)) - 0.5, 5]}
                                tick={{ fontSize: 12, fill: '#64748b', fontWeight: 500 }}
                                axisLine={false}
                                tickLine={false}
                                dx={-15}
                            />
                            <Tooltip
                                contentStyle={{
                                    borderRadius: '16px',
                                    border: 'none',
                                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
                                    background: 'rgba(255, 255, 255, 0.95)',
                                    backdropFilter: 'blur(8px)',
                                    padding: '12px'
                                }}
                                cursor={{ stroke: '#8b5cf6', strokeWidth: 2, strokeDasharray: '4 4' }}
                            />
                            <Area
                                type="monotone"
                                dataKey="rating"
                                stroke="#8b5cf6"
                                strokeWidth={4}
                                fillOpacity={1}
                                fill="url(#colorRating)"
                                animationDuration={1500}
                            />
                        </AreaChart>
                    ) : (
                        <BarChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" strokeOpacity={0.6} />
                            <XAxis
                                dataKey="month"
                                tick={{ fontSize: 12, fill: '#64748b', fontWeight: 500 }}
                                axisLine={false}
                                tickLine={false}
                                dy={15}
                            />
                            <YAxis
                                tick={{ fontSize: 12, fill: '#64748b', fontWeight: 500 }}
                                axisLine={false}
                                tickLine={false}
                                dx={-15}
                            />
                            <Tooltip
                                cursor={{ fill: '#f1f5f9', radius: 8 }}
                                contentStyle={{
                                    borderRadius: '16px',
                                    border: 'none',
                                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
                                    background: 'rgba(255, 255, 255, 0.95)',
                                    backdropFilter: 'blur(8px)',
                                    padding: '12px'
                                }}
                            />
                            <Bar
                                dataKey="count"
                                fill="#06b6d4"
                                radius={[8, 8, 0, 0]}
                                animationDuration={1500}
                                maxBarSize={50}
                            />
                        </BarChart>
                    )}
                </ResponsiveContainer>
            </div>
        </div>
    );
}
