import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Star, MessageCircle, Info } from 'lucide-react';

export default function PlaceHeader({ placeInfo }) {
    if (!placeInfo) return null;

    const { name, address, rating, totalReviews, photoUrl, category, analyzedCount } = placeInfo;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative w-full bg-white rounded-3xl shadow-lg border border-slate-100 overflow-hidden mb-8"
        >
            {/* Background Header Area */}
            <div className="h-32 bg-gradient-to-r from-indigo-600 to-violet-600 relative">
                <div className="absolute inset-0 opacity-10"
                    style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }}>
                </div>
            </div>

            {/* Content Area - pushed up slightly to overlap background */}
            <div className="px-8 pb-8 relative z-10">
                <div className="flex flex-col md:flex-row items-center md:items-end -mt-12 gap-6 text-center md:text-left">
                    {/* Photo / Icon Box */}
                    <div className="w-24 h-24 rounded-2xl bg-white p-1 shadow-lg ring-1 ring-slate-100 flex-shrink-0">
                        {photoUrl ? (
                            <img src={photoUrl} alt={name} className="w-full h-full object-cover rounded-xl" />
                        ) : (
                            <div className="w-full h-full bg-slate-50 rounded-xl flex items-center justify-center text-slate-300">
                                <MapPin size={32} />
                            </div>
                        )}
                    </div>

                    {/* Title & Info */}
                    <div className="flex-1 pt-2 min-w-0">
                        <h1 className="text-3xl font-bold text-slate-900 leading-tight truncate">{name || 'Unbekannter Ort'}</h1>
                        <p className="text-slate-500 flex items-center justify-center md:justify-start gap-2 mt-1 truncate">
                            <MapPin size={14} /> {address || 'Keine Adresse'}
                        </p>
                    </div>

                    {/* Stats Cards */}
                    <div className="flex gap-4 mt-4 md:mt-0 flex-shrink-0">
                        <div className="bg-slate-50 px-5 py-3 rounded-2xl border border-slate-100 flex flex-col items-center justify-center min-w-[100px]">
                            <div className="flex items-center gap-1 text-slate-900 font-bold text-xl">
                                {rating === '?' || !rating ? '-' : rating}
                                {rating && rating !== '?' && <Star size={18} className="text-amber-400 fill-current" />}
                            </div>
                            <div className="text-xs text-slate-500 font-medium uppercase tracking-wider">Bewertung</div>
                        </div>
                        <div className="bg-slate-50 px-5 py-3 rounded-2xl border border-slate-100 flex flex-col items-center justify-center min-w-[100px]">
                            <div className="flex items-center justify-center gap-1 text-slate-900 font-bold text-xl">
                                {totalReviews}
                            </div>
                            <div className="text-xs text-slate-500 font-medium uppercase tracking-wider">Reviews</div>
                        </div>
                        <div className="bg-indigo-50 px-5 py-3 rounded-2xl border border-indigo-100 flex flex-col items-center justify-center min-w-[100px]">
                            <div className="flex items-center justify-center gap-1 text-indigo-700 font-bold text-xl">
                                {analyzedCount || (totalReviews !== '?' ? totalReviews : 0)}
                            </div>
                            <div className="text-xs text-indigo-600 font-medium uppercase tracking-wider">Analysiert</div>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
