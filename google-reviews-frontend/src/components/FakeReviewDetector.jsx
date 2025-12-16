import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, AlertTriangle, UserX, ShieldCheck } from 'lucide-react';

export default function FakeReviewDetector({ analysis }) {
    // Use fakeReviewDetails preferably, fallback to fake_reviews simple list
    const fakeReviews = analysis?.fakeReviewDetails || analysis?.fake_reviews || [];

    if (fakeReviews.length === 0) {
        return (
            <div className="bg-white/60 backdrop-blur-md rounded-3xl shadow-sm border border-slate-100 p-8 h-full flex flex-col items-center justify-center text-center">
                <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mb-6 shadow-emerald-100/50 shadow-lg">
                    <ShieldCheck className="w-10 h-10 text-emerald-500" />
                </div>
                <h3 className="text-xl font-bold text-slate-800">Keine Auffälligkeiten</h3>
                <p className="text-slate-500 mt-2 leading-relaxed">Unser Algorithmus hat keine gefälschten Bewertungen erkannt. Alles sieht sauber aus.</p>
            </div>
        );
    }

    return (
        <div className="bg-gradient-to-br from-white/80 to-red-50/30 backdrop-blur-md rounded-3xl shadow-sm border border-red-100/50 p-6 h-full overflow-hidden flex flex-col">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-red-700 flex items-center">
                    <div className="p-2 bg-red-100 rounded-lg mr-3 animate-pulse-soft">
                        <AlertTriangle className="w-5 h-5 text-red-600" />
                    </div>
                    Verdächtige Aktivität
                </h3>
                <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-red-200 shadow-lg animate-bounce">
                    {fakeReviews.length} Markiert
                </span>
            </div>

            <div className="space-y-4 overflow-y-auto pr-2 custom-scrollbar flex-1 -mr-2">
                <AnimatePresence>
                    {fakeReviews.map((review, idx) => {
                        const probability = review.probability || 0;
                        const isHighRisk = probability > 0.9;

                        return (
                            <motion.div
                                key={review.id || idx}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className={`rounded-2xl p-4 border transition-all hover:scale-[1.02] ${isHighRisk
                                        ? 'bg-white border-red-200 shadow-lg shadow-red-100/50'
                                        : 'bg-white/50 border-red-100/50'
                                    }`}
                            >
                                <div className="flex justify-between items-start mb-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 font-bold text-xs uppercase shadow-inner">
                                            {review.author?.charAt(0) || <UserX size={14} />}
                                        </div>
                                        <div>
                                            <div className="font-bold text-slate-800 text-sm">{review.author || 'Anonym'}</div>
                                            <div className="flex text-amber-400 text-[10px] gap-0.5 pt-0.5">
                                                {[...Array(5)].map((_, i) => (
                                                    <span key={i} className={i < (review.rating || 0) ? "opacity-100 drop-shadow-sm" : "opacity-20"}>★</span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${isHighRisk ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'}`}>
                                            {(probability * 100).toFixed(0)}% Fake
                                        </span>
                                    </div>
                                </div>

                                <div className="bg-slate-50/50 p-3 rounded-xl text-sm text-slate-600 italic border border-slate-100/50 relative">
                                    <p className="line-clamp-3 relative z-10 leading-relaxed text-xs">
                                        "{review.text}"
                                    </p>
                                </div>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>
        </div>
    );
}
