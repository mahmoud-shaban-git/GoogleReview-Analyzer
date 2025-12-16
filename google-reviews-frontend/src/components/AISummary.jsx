import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Utensils, HeartHandshake, Armchair, AlertCircle, Sparkles } from 'lucide-react';

const SUMMARY_CARDS = [
    {
        key: 'food',
        title: 'Essen',
        icon: Utensils,
        gradient: 'from-orange-400 to-pink-500',
        shadow: 'shadow-orange-200',
        text: 'text-white'
    },
    {
        key: 'service',
        title: 'Service',
        icon: HeartHandshake,
        gradient: 'from-blue-400 to-indigo-500',
        shadow: 'shadow-blue-200',
        text: 'text-white'
    },
    {
        key: 'ambience',
        title: 'Ambiente',
        icon: Armchair,
        gradient: 'from-fuchsia-400 to-purple-600',
        shadow: 'shadow-purple-200',
        text: 'text-white'
    },
    {
        key: 'issues',
        title: 'Kritik',
        icon: AlertCircle,
        gradient: 'from-red-400 to-rose-600',
        shadow: 'shadow-red-200',
        text: 'text-white'
    }
];

// Typewriter Component
const TypewriterText = ({ text }) => {
    const [displayedText, setDisplayedText] = useState('');

    useEffect(() => {
        setDisplayedText(''); // Reset on new text
        if (!text) return;

        let i = 0;
        const speed = 15; // ms per char
        const interval = setInterval(() => {
            if (i < text.length) {
                setDisplayedText((prev) => prev + text.charAt(i));
                i++;
            } else {
                clearInterval(interval);
            }
        }, speed);

        return () => clearInterval(interval);
    }, [text]);

    return (
        <span>
            {displayedText}
            <span className="inline-block w-0.5 h-5 bg-fuchsia-500 ml-1 animate-pulse align-middle"></span>
        </span>
    );
};

export default function AISummary({ analysis }) {
    if (!analysis) return null;
    const { categories, negative_keywords, summary } = analysis;

    const getContent = (key) => {
        if (key === 'issues') {
            return negative_keywords?.slice(0, 3).map(k => `Beschwerden über "${k}"`) || ['Keine gröberen Probleme'];
        }
        if (categories && categories[key]) {
            const cat = categories[key];
            const result = [];
            if (cat.positive > 0) result.push(`${cat.positive}x Positiv`);
            if (cat.negative > 0) result.push(`${cat.negative}x Negativ`);
            return result.length ? result : ['Keine Daten'];
        }
        return ['Keine Daten'];
    };

    return (
        <div className="mb-8">
            <h2 className="text-2xl font-black text-slate-800 mb-6 flex items-center tracking-tight">
                <Sparkles className="w-6 h-6 mr-2 text-fuchsia-500 animate-pulse" />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-600 to-orange-500">
                    KI Insights
                </span>
            </h2>

            {/* Main AI Summary Text */}
            <motion.div
                whileHover={{ scale: 1.01 }}
                className="bg-white/80 backdrop-blur-xl p-8 rounded-[2rem] border border-white/50 shadow-xl shadow-indigo-100/40 mb-8 relative overflow-hidden group"
            >
                {/* Animated Gradient Border Overlay */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-violet-500 via-fuchsia-500 to-orange-500"></div>

                <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-fuchsia-200 rounded-full blur-3xl opacity-30 group-hover:scale-150 transition-transform duration-700"></div>
                <div className="absolute -left-10 -top-10 w-40 h-40 bg-violet-200 rounded-full blur-3xl opacity-30 group-hover:scale-150 transition-transform duration-700"></div>

                <p className="text-slate-700 leading-relaxed text-lg font-medium relative z-10 italic min-h-[80px]">
                    <span className="text-indigo-400 font-bold not-italic mr-2">AI:</span>
                    <TypewriterText text={summary || 'Keine Zusammenfassung verfügbar.'} />
                </p>
            </motion.div>

            {/* Vibrant Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                {SUMMARY_CARDS.map((card, idx) => (
                    <motion.div
                        key={card.key}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 + (idx * 0.1) }} // Wait for typo effect start
                        whileHover={{ y: -8, scale: 1.02 }}
                        className={`p-6 rounded-[2rem] bg-gradient-to-br ${card.gradient} shadow-xl ${card.shadow} text-white relative overflow-hidden`}
                    >
                        {/* Background Decor */}
                        <div className="absolute top-0 right-0 w-24 h-24 bg-white opacity-10 rounded-bl-full transform translate-x-8 -translate-y-8"></div>
                        <div className="absolute bottom-0 left-0 w-16 h-16 bg-black opacity-5 rounded-tr-full transform -translate-x-4 translate-y-4"></div>

                        <div className="flex items-center gap-3 mb-4 relative z-10">
                            <div className="p-2 bg-white/20 backdrop-blur-sm rounded-xl">
                                <card.icon size={22} className="stroke-2" />
                            </div>
                            <span className="font-bold text-lg tracking-wide">{card.title}</span>
                        </div>

                        <ul className="space-y-2 relative z-10">
                            {getContent(card.key).map((item, i) => (
                                <li key={i} className="text-sm font-medium flex items-center gap-2 opacity-90">
                                    <div className="w-1.5 h-1.5 bg-white rounded-full shadow-sm"></div>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
