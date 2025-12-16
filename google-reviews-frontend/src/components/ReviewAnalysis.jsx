import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid } from 'recharts';
import { AlertTriangle, ThumbsUp, ThumbsDown, MessageSquare, BarChart3, ShieldAlert } from 'lucide-react';

export default function ReviewAnalysis({ analysis }) {
    if (!analysis) return null;

    const { summary, negative_keywords, positive_keywords, categories, fake_reviews, top_keywords } = analysis;

    // Transform categories used for the sentiment bars
    const categoryData = categories ? Object.entries(categories).map(([key, value]) => ({
        name: key.charAt(0).toUpperCase() + key.slice(1),
        positive: value.positive,
        negative: value.negative
    })) : [];

    // Transform top_keywords for the bar chart
    const keywordData = top_keywords ? Object.entries(top_keywords)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 10) // Top 10
        .map(([key, count]) => ({
            name: key,
            count
        })) : [];

    return (
        <div className="space-y-6">
            {/* Summary Section */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5">
                    <MessageSquare className="w-24 h-24" />
                </div>
                <h2 className="text-xl font-semibold mb-4 flex items-center text-slate-800">
                    <MessageSquare className="w-5 h-5 mr-2 text-brand-600" />
                    AI Summary
                </h2>
                <p className="text-slate-600 leading-relaxed bg-slate-50 p-5 rounded-xl border border-slate-100 text-lg">
                    {summary || "No summary available."}
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Categories Sentiment */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                    <h3 className="text-lg font-semibold mb-6 text-slate-800 flex items-center">
                        <BarChart3 className="w-5 h-5 mr-2 text-slate-400" />
                        Topic Sentiment
                    </h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={categoryData} layout="vertical" margin={{ left: 20, right: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
                                <XAxis type="number" hide />
                                <YAxis dataKey="name" type="category" width={80} tick={{ fontSize: 13, fill: '#64748b' }} tickLine={false} axisLine={false} />
                                <Tooltip
                                    cursor={{ fill: '#f8fafc' }}
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Bar dataKey="positive" fill="#22c55e" radius={[0, 4, 4, 0]} name="Positive" stackId="a" barSize={20} />
                                <Bar dataKey="negative" fill="#ef4444" radius={[0, 4, 4, 0]} name="Negative" stackId="a" barSize={20} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Top Keywords Chart */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                    <h3 className="text-lg font-semibold mb-6 text-slate-800 flex items-center">
                        <MessageSquare className="w-5 h-5 mr-2 text-slate-400" />
                        Top Keywords
                    </h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={keywordData} layout="vertical" margin={{ left: 10, right: 30 }}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
                                <XAxis type="number" hide />
                                <YAxis dataKey="name" type="category" width={90} tick={{ fontSize: 13, fill: '#64748b' }} tickLine={false} axisLine={false} />
                                <Tooltip
                                    cursor={{ fill: '#f8fafc' }}
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Bar dataKey="count" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={20}>
                                    {keywordData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={index < 3 ? '#0ea5e9' : '#94a3b8'} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Keywords Cloud / Chips */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                <h3 className="text-lg font-semibold mb-4 text-slate-800">Keyword Analysis</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <h4 className="text-sm uppercase tracking-wider text-green-600 font-bold mb-3 flex items-center gap-2">
                            <ThumbsUp className="w-4 h-4" /> Positives
                        </h4>
                        <div className="flex flex-wrap gap-2">
                            {positive_keywords && positive_keywords.map(k => (
                                <span key={k} className="px-3 py-1.5 bg-green-50 text-green-700 rounded-lg text-sm font-medium border border-green-100 transition-colors hover:bg-green-100">
                                    {k}
                                </span>
                            ))}
                            {(!positive_keywords || positive_keywords.length === 0) && <span className="text-slate-400 italic text-sm">No specific positive keywords found.</span>}
                        </div>
                    </div>
                    <div>
                        <h4 className="text-sm uppercase tracking-wider text-red-600 font-bold mb-3 flex items-center gap-2">
                            <ThumbsDown className="w-4 h-4" /> Negatives
                        </h4>
                        <div className="flex flex-wrap gap-2">
                            {negative_keywords && negative_keywords.map(k => (
                                <span key={k} className="px-3 py-1.5 bg-red-50 text-red-700 rounded-lg text-sm font-medium border border-red-100 transition-colors hover:bg-red-100">
                                    {k}
                                </span>
                            ))}
                            {(!negative_keywords || negative_keywords.length === 0) && <span className="text-slate-400 italic text-sm">No specific negative keywords found.</span>}
                        </div>
                    </div>
                </div>
            </div>

            {/* Fake Reviews */}
            {fake_reviews && fake_reviews.length > 0 && (
                <div className="bg-white p-6 rounded-xl shadow-sm border border-red-100 ring-1 ring-red-50">
                    <h3 className="text-lg font-semibold mb-6 text-red-700 flex items-center">
                        <ShieldAlert className="w-6 h-6 mr-2" />
                        Detected Suspicious Reviews
                    </h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead>
                                <tr className="border-b border-slate-100 text-slate-500">
                                    <th className="pb-3 pl-2 font-medium">Risk</th>
                                    <th className="pb-3 font-medium">Author</th>
                                    <th className="pb-3 font-medium">Content</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {fake_reviews.map((review, idx) => (
                                    <tr key={idx} className="group hover:bg-red-50/30 transition-colors">
                                        <td className="py-4 pl-2 font-medium align-top w-32">
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700">
                                                {(review.probability * 100).toFixed(0)}% Fake
                                            </span>
                                        </td>
                                        <td className="py-4 font-medium text-slate-900 align-top w-48">
                                            {review.author}
                                        </td>
                                        <td className="py-4 text-slate-600 leading-relaxed align-top">
                                            {review.text}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
