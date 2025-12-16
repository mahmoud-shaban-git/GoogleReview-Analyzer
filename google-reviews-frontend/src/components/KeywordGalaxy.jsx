import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

const COLORS = {
    positive: 'from-emerald-400 to-teal-500',
    negative: 'from-rose-500 to-red-600',
    neutral: 'from-slate-400 to-slate-500'
};

const SHADOWS = {
    positive: 'shadow-teal-200',
    negative: 'shadow-rose-200',
    neutral: 'shadow-slate-200'
};

export default function KeywordGalaxy({ analysis }) {
    if (!analysis) return null;
    const { top_keywords, negative_keywords, positive_keywords } = analysis;

    let data = [];
    if (top_keywords) {
        data = Object.entries(top_keywords).map(([word, count]) => {
            let sentiment = 'neutral';
            if (positive_keywords?.includes(word)) sentiment = 'positive';
            if (negative_keywords?.includes(word)) sentiment = 'negative';
            return { keyword: word, count, sentiment };
        });
    }

    data = data.sort((a, b) => b.count - a.count).slice(0, 18); // More bubbles

    return (
        <div className="bg-white/70 backdrop-blur-xl rounded-[2.5rem] shadow-2xl shadow-violet-100/50 border border-white/60 p-8 h-full relative overflow-hidden group">

            {/* Cosmic Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-violet-50/50 via-transparent to-fuchsia-50/50 opacity-50"></div>
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-violet-200/30 rounded-full blur-3xl animate-pulse"></div>

            <h3 className="text-xl font-black text-slate-800 mb-2 flex items-center relative z-10">
                <span className="p-2.5 bg-gradient-to-br from-violet-100 to-fuchsia-100 rounded-xl mr-3 shadow-inner">
                    <Sparkles className="w-5 h-5 text-violet-600" />
                </span>
                Keyword Galaxy
            </h3>
            <p className="text-slate-500 text-sm mb-8 font-medium relative z-10">Frequenz & Emotionaler Kontext</p>

            <div className="min-h-[350px] w-full rounded-3xl relative z-10 flex flex-wrap justify-center items-center gap-6 content-center perspective-1000">
                {data.map((item, idx) => {
                    // Randomize float duration slightly
                    const floatDuration = 3 + Math.random() * 4;

                    return (
                        <motion.div
                            key={item.keyword}
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{
                                scale: 1,
                                opacity: 1,
                                y: [0, -10, 0],
                            }}
                            transition={{
                                scale: { type: 'spring', delay: idx * 0.05 },
                                y: { duration: floatDuration, repeat: Infinity, ease: "easeInOut", delay: Math.random() * 2 }
                            }}
                            whileHover={{ scale: 1.25, zIndex: 50, rotate: 5 }}
                            className="relative group cursor-pointer"
                        >
                            <div
                                className={`rounded-full flex items-center justify-center text-white font-bold shadow-lg transition-all duration-300 group-hover:shadow-2xl border-2 border-white/30 backdrop-blur-sm bg-gradient-to-br ${COLORS[item.sentiment]} ${SHADOWS[item.sentiment]}`}
                                style={{
                                    width: Math.max(75, Math.min(140, item.count * 9)) + 'px',
                                    height: Math.max(75, Math.min(140, item.count * 9)) + 'px',
                                }}
                            >
                                <span className="text-sm text-center px-1 break-words leading-tight select-none drop-shadow-md brightness-110">
                                    {item.keyword}
                                </span>
                            </div>

                            {/* Space Tooltip */}
                            <div className="absolute -top-12 left-1/2 -translate-x-1/2 px-4 py-2 bg-slate-900/90 backdrop-blur-md text-white text-xs rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-200 whitespace-nowrap z-50 pointer-events-none shadow-xl transform scale-90 group-hover:scale-100">
                                <span className="font-bold text-sm block text-center text-cyan-300">{item.count}</span>
                                <span className="text-[10px] uppercase tracking-widest text-slate-400">Mentions</span>
                                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-900/90 rotate-45"></div>
                            </div>
                        </motion.div>
                    )
                })}
            </div>
        </div>
    );
}
