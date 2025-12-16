import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Loader2, Star, X, MessageSquareDashed, Filter } from 'lucide-react';

export default function ReviewExplorer({ initialReviews, onFilterChange }) {
    const [query, setQuery] = useState('');
    const [reviews, setReviews] = useState(initialReviews || []);
    const [activeFilter, setActiveFilter] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    // Sync props change
    useEffect(() => {
        setReviews(initialReviews || []);
    }, [initialReviews]);

    // Client-side text filter on top of fetched results
    const displayedReviews = reviews.filter(r =>
        !query || (r.text?.toLowerCase().includes(query.toLowerCase()) ||
            r.author?.toLowerCase().includes(query.toLowerCase()))
    );

    const handleCategoryClick = async (category) => {
        setIsLoading(true);
        const newFilter = activeFilter === category ? null : category;
        setActiveFilter(newFilter);
        try {
            await onFilterChange(newFilter ? newFilter.toLowerCase() : null);
        } catch (e) {
            console.error("Filter error", e);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-lg shadow-indigo-100/20 border border-white/60 p-6 flex flex-col h-[650px] relative overflow-hidden">
            {/* Soft Background Decor */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-50 rounded-bl-full -z-10 opacity-50"></div>

            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-slate-800 flex items-center">
                    <div className="p-2 bg-indigo-50 rounded-xl mr-3 shadow-sm border border-indigo-100">
                        <Search className="w-5 h-5 text-indigo-600" />
                    </div>
                    Explorer
                </h3>
                <span className="text-xs font-bold bg-slate-100 text-slate-600 px-3 py-1.5 rounded-full border border-slate-200">
                    {displayedReviews.length} Ergebnisse
                </span>
            </div>

            {/* Search Input */}
            <div className="relative mb-6 group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-300 to-purple-300 rounded-2xl opacity-0 group-hover:opacity-40 transition duration-500 blur-sm"></div>
                <input
                    type="text"
                    placeholder="Suche nach Inhalten..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="relative w-full bg-white border border-slate-200 rounded-2xl pl-12 pr-4 py-3.5 text-sm focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all shadow-sm group-hover:shadow-md"
                />
                <Search className="absolute left-4 top-4 text-slate-400 w-5 h-5 group-hover:text-indigo-500 transition-colors z-10" />
                {query && (
                    <button
                        onClick={() => setQuery('')}
                        className="absolute right-4 top-3.5 p-1 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-500 transition-colors z-10"
                    >
                        <X size={14} />
                    </button>
                )}
            </div>

            {/* Categories (Backend Filter) */}
            <div className="mb-6">
                <div className="flex items-center gap-2 mb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider pl-1">
                    <Filter size={12} /> Filter
                </div>
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-1 px-1">
                    {['Food', 'Service', 'Ambience', 'Price'].map(tag => (
                        <motion.button
                            key={tag}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleCategoryClick(tag)}
                            disabled={isLoading}
                            className={`whitespace-nowrap px-4 py-2 rounded-xl text-xs font-bold transition-all flex-shrink-0 shadow-sm
                            ${activeFilter === tag
                                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-indigo-200 border border-transparent'
                                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300'}`}
                        >
                            {tag}
                        </motion.button>
                    ))}
                </div>
            </div>

            {/* Review List */}
            <div className="flex-1 overflow-y-auto pr-2 -mr-2 space-y-4 custom-scrollbar relative">
                <AnimatePresence mode="popLayout">
                    {isLoading && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-white/60 backdrop-blur-sm z-20 flex items-center justify-center rounded-2xl"
                        >
                            <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
                        </motion.div>
                    )}

                    {displayedReviews.length > 0 ? (
                        displayedReviews.map((review, idx) => (
                            <motion.div
                                key={review.id || idx}
                                layout
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.2, delay: idx * 0.05 }}
                                className="p-5 rounded-2xl bg-white border border-slate-100/80 shadow-sm hover:shadow-md hover:border-indigo-100 transition-all group"
                            >
                                <div className="flex justify-between items-start mb-3">
                                    <span className="font-bold text-slate-800 text-sm truncate max-w-[140px] group-hover:text-indigo-600 transition-colors">
                                        {review.author}
                                    </span>
                                    <div className="flex text-amber-400 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} size={10} className={i < review.rating ? "fill-current drop-shadow-sm" : "text-slate-200 fill-slate-200"} />
                                        ))}
                                    </div>
                                </div>
                                <p className="text-sm text-slate-600 leading-relaxed line-clamp-4 font-medium opacity-90">{review.text}</p>
                                <div className="mt-3 text-xs font-semibold text-slate-400 flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 bg-slate-300 rounded-full"></div>
                                    {review.reviewDate}
                                </div>
                            </motion.div>
                        ))
                    ) : (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex flex-col items-center justify-center h-full text-center py-10 opacity-60"
                        >
                            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 shadow-sm">
                                <MessageSquareDashed className="w-8 h-8 text-slate-400" />
                            </div>
                            <p className="text-sm font-medium text-slate-500">Keine passenden Reviews gefunden.</p>
                            <p className="text-xs text-slate-400 mt-1">Versuche eine andere Suche oder Filter.</p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
