import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid } from 'recharts';
import { TrendingUp, Activity } from 'lucide-react';

export default function TrendAnalysis({ trends }) {
    if (!trends) return null;

    const { averageRatingPerDate, reviewsCountPerDate, trendSummary } = trends;

    // Transform data
    // Assuming keys are dates "YYYY-MM-DD" and common across both maps generally, 
    // or we take all unique dates and merge.
    const allDates = new Set([
        ...Object.keys(averageRatingPerDate || {}),
        ...Object.keys(reviewsCountPerDate || {})
    ]);

    const chartData = Array.from(allDates).sort().map(date => ({
        date,
        rating: averageRatingPerDate[date] || 0,
        count: reviewsCountPerDate[date] || 0
    }));

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-slate-800 flex items-center">
                    <Activity className="w-5 h-5 mr-2 text-brand-600" />
                    Trend Analysis
                </h2>
                {trendSummary && (
                    <div className="bg-brand-50 text-brand-700 px-4 py-2 rounded-full text-sm font-medium border border-brand-100 flex items-center shadow-sm">
                        <TrendingUp className="w-4 h-4 mr-2" />
                        {trendSummary}
                    </div>
                )}
            </div>

            <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis
                            dataKey="date"
                            tick={{ fontSize: 12, fill: '#64748b' }}
                            tickLine={false}
                            axisLine={{ stroke: '#e2e8f0' }}
                        />
                        <YAxis
                            yAxisId="left"
                            domain={[0, 5]}
                            tick={{ fontSize: 12, fill: '#64748b' }}
                            tickLine={false}
                            axisLine={false}
                            label={{ value: 'Rating', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 12 }}
                        />
                        <YAxis
                            yAxisId="right"
                            orientation="right"
                            tick={{ fontSize: 12, fill: '#64748b' }}
                            tickLine={false}
                            axisLine={false}
                            label={{ value: 'Reviews', angle: 90, position: 'insideRight', fill: '#64748b', fontSize: 12 }}
                        />
                        <Tooltip
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        />
                        <Legend wrapperStyle={{ paddingTop: '20px' }} />
                        <Line
                            yAxisId="left"
                            type="monotone"
                            dataKey="rating"
                            stroke="#0ea5e9"
                            strokeWidth={3}
                            dot={{ r: 4, fill: '#0ea5e9', strokeWidth: 0 }}
                            activeDot={{ r: 6 }}
                            name="Average Rating"
                        />
                        <Line
                            yAxisId="right"
                            type="monotone"
                            dataKey="count"
                            stroke="#8b5cf6"
                            strokeWidth={2}
                            strokeDasharray="5 5"
                            dot={false}
                            name="Review Count"
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
