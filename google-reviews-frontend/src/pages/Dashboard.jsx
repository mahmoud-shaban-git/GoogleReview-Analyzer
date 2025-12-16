import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Loader2, AlertCircle, Radio, Sparkles, Download, ShieldCheck, Clock, Lightbulb, CheckCircle } from 'lucide-react';
import { loadAnalysis, loadTrends, loadReviews, importReviews } from '../api/reviews';

import PlaceHeader from '../components/PlaceHeader';
import AISummary from '../components/AISummary';
import TrendView from '../components/TrendView';
import ReviewExplorer from '../components/ReviewExplorer';
import KeywordGalaxy from '../components/KeywordGalaxy';
import FakeReviewDetector from '../components/FakeReviewDetector';
import ParticleBackground from '../components/ParticleBackground';

// Animation Variants
const containerVariants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.15 }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: {
        opacity: 1,
        y: 0,
        transition: { type: "spring", stiffness: 50 }
    }
};

export default function Dashboard() {
    const [placeId, setPlaceId] = useState('');
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [needsImport, setNeedsImport] = useState(false);
    const [importStatus, setImportStatus] = useState(''); // 'importing', 'success', ''

    const isHeroState = !data && !loading && !needsImport;

    const handleSearch = async (e) => {
        if (e) e.preventDefault();
        if (!placeId.trim()) {
            setError('Bitte gib eine gültige Place-ID ein.');
            return;
        }

        setLoading(true);
        setError(null);
        setData(null);
        setNeedsImport(false);

        try {
            console.log('Starting import and analysis for:', placeId);

            // Step 1: Import (this should save to DB in backend)
            const importResult = await importReviews(placeId);
            console.log('Import completed:', importResult);

            // Step 2: Wait a moment for backend to process
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Step 3: Load analysis data
            const info = {
                name: 'Google Place',
                address: placeId,
                rating: 'Analyze to see',
                totalReviews: '?',
                photoUrl: null
            };

            const [analysis, trends, reviews] = await Promise.all([
                loadAnalysis(placeId),
                loadTrends(placeId),
                loadReviews(placeId)
            ]);

            if (analysis && analysis.reviewCount) {
                info.totalReviews = analysis.reviewCount;
                info.analyzedCount = analysis.reviewCount;
            }

            setData({ info, analysis, trends, reviews });

        } catch (err) {
            console.error('Error:', err);

            // Provide helpful error messages
            if (err.message && err.message.toLowerCase().includes('keine reviews')) {
                setError('❌ Keine Bewertungen gefunden. Mögliche Ursachen:\n\n1. Google API Key fehlt im Backend\n2. Die Place-ID ist ungültig\n3. Das Geschäft hat keine Bewertungen\n\nBitte prüfe die Backend-Konfiguration.');
            } else if (err.message.includes('404') || err.message.includes('Error 404')) {
                setError('Die Daten konnten nicht geladen werden. Das Backend hat möglicherweise noch nicht alle Daten verarbeitet. Bitte versuche es in einem Moment erneut.');
            } else {
                setError(err.message || 'Fehler beim Laden der Daten.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleImport = async () => {
        if (!placeId.trim()) {
            setError('Bitte gib eine gültige Place-ID ein.');
            return;
        }

        setImportStatus('importing');
        setError(null);

        try {
            console.log('Starting import for:', placeId);
            const importResult = await importReviews(placeId);
            console.log('Import result:', importResult);

            setImportStatus('success');

            // Wait longer to give backend time to process and analyze
            setTimeout(async () => {
                setImportStatus('');
                setNeedsImport(false);

                // Retry logic: try to load analysis up to 5 times with delays
                let attempts = 0;
                const maxAttempts = 5;

                while (attempts < maxAttempts) {
                    try {
                        console.log(`Attempt ${attempts + 1} to load analysis...`);
                        await handleSearch();
                        break; // Success, exit loop
                    } catch (err) {
                        attempts++;
                        if (attempts < maxAttempts) {
                            console.log(`Retrying in 3 seconds...`);
                            await new Promise(resolve => setTimeout(resolve, 3000));
                        } else {
                            console.error('All attempts failed');
                            setError('⚠️ Import war erfolgreich, aber die Daten sind noch nicht analysiert. Das Backend muss die Daten erst in der Datenbank speichern und verarbeiten. Bitte warte 10-20 Sekunden und klicke dann oben auf "Starten".');
                            setNeedsImport(false); // Allow user to try search again
                        }
                    }
                }
            }, 3000); // Wait 3 seconds before first attempt

        } catch (err) {
            console.error('Import failed:', err);
            setImportStatus('');

            // Provide helpful error messages
            if (err.message && err.message.toLowerCase().includes('keine reviews')) {
                setError('❌ Das Backend konnte keine Bewertungen von Google abrufen. Mögliche Ursachen:\n\n1. Google API Key fehlt oder ist ungültig im Backend\n2. Die Place-ID ist falsch\n3. Das Geschäft hat keine Bewertungen\n\nBitte prüfe das Backend (application.properties → google.api.key)');
            } else {
                setError(err.message || 'Import fehlgeschlagen. Stelle sicher, dass die Place-ID korrekt ist.');
            }
        }
    };

    return (
        <div className="min-h-screen font-sans selection:bg-pink-300 selection:text-pink-900 overflow-x-hidden relative">

            {/* --- PARTICLE NETWORK BACKGROUND --- */}
            <ParticleBackground />

            {/* Light overlay for readability */}
            <div className="fixed inset-0 bg-gradient-to-b from-transparent via-white/5 to-white/20 -z-40 pointer-events-none"></div>

            {/* --- TOP NAVIGATION --- */}
            <AnimatePresence>
                {!isHeroState && (
                    <motion.nav
                        initial={{ y: -100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-white/40 shadow-sm transition-all"
                    >
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
                            <div className="flex items-center gap-3 cursor-pointer" onClick={() => { setData(null); setNeedsImport(false); setError(null); }}>
                                <Radio size={24} className="text-fuchsia-600" />
                                <span className="font-extrabold text-2xl tracking-tighter text-slate-800">Review<span className="text-fuchsia-600">Radar</span></span>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="relative group">
                                    <input
                                        type="text"
                                        value={placeId}
                                        onChange={(e) => setPlaceId(e.target.value)}
                                        placeholder="Google Place ID..."
                                        className="relative w-64 bg-white/80 border border-slate-200 backdrop-blur-md rounded-full py-2 pl-5 pr-10 text-sm focus:ring-2 focus:ring-fuchsia-400 focus:border-transparent outline-none"
                                    />
                                    <button onClick={(e) => handleSearch(e)} className="absolute right-1 top-1 p-1.5 bg-slate-900 text-white rounded-full hover:bg-black transition">
                                        <Search size={14} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.nav>
                )}
            </AnimatePresence>

            {/* Error Toast Notification */}
            <AnimatePresence>
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -100 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -100 }}
                        className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] max-w-md w-full mx-4"
                    >
                        <div className="bg-red-500/95 backdrop-blur-xl text-white rounded-2xl p-4 shadow-2xl border border-red-400/50 flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                            <div className="flex-1">
                                <p className="font-semibold text-sm leading-relaxed">{error}</p>
                            </div>
                            <button
                                onClick={() => setError(null)}
                                className="text-white/80 hover:text-white transition-colors flex-shrink-0"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative">

                {/* --- HERO SECTION --- */}
                {isHeroState && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex flex-col items-center justify-center min-h-[85vh] relative z-10"
                    >
                        <div className="mb-10 relative text-center">
                            <div className="absolute inset-0 bg-fuchsia-200 blur-[60px] opacity-40 rounded-full animate-pulse"></div>
                            <div className="relative flex flex-col items-center">
                                <div className="bg-gradient-to-tr from-violet-600 to-fuchsia-600 text-white p-6 rounded-[2rem] shadow-2xl shadow-fuchsia-500/30 mb-6 transform hover:scale-105 transition-transform duration-500">
                                    <Radio size={48} className="animate-pulse" />
                                </div>
                                <h1 className="text-6xl font-black tracking-tighter text-white mb-4" style={{ textShadow: '0 2px 10px rgba(0,0,0,0.3)' }}>
                                    Review<span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-violet-400">Radar</span>
                                </h1>
                                <p className="text-xl text-white/90 font-medium tracking-wide max-w-2xl leading-relaxed" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.3)' }}>
                                    <span className="text-white font-bold">Spare Stunden an Lesezeit.</span><br />
                                    Wir fassen dein Feedback zusammen und zeigen dir konkrete Verbesserungsvorschläge.
                                </p>
                            </div>
                        </div>

                        {/* BIG CENTRAL SEARCH BAR */}
                        <div className="w-full max-w-2xl relative group mb-12">
                            <div className="absolute -inset-1 bg-gradient-to-r from-violet-500 via-fuchsia-500 to-orange-500 rounded-full opacity-30 group-hover:opacity-60 blur-lg transition duration-500"></div>
                            <div className="relative flex items-center bg-white rounded-full shadow-2xl shadow-indigo-200/40 p-2 transition-transform duration-300 focus-within:scale-105">
                                <Search className="ml-4 text-slate-400 w-6 h-6" />
                                <input
                                    type="text"
                                    value={placeId}
                                    onChange={(e) => setPlaceId(e.target.value)}
                                    placeholder="Google Place ID hier einfügen..."
                                    className="w-full bg-transparent border-none focus:ring-0 text-lg px-4 py-3 text-slate-700 placeholder:text-slate-300 font-medium h-14"
                                    onKeyDown={(e) => e.key === 'Enter' && handleSearch(e)}
                                />
                                <button
                                    onClick={(e) => handleSearch(e)}
                                    className="bg-slate-900 hover:bg-black text-white px-8 py-3 rounded-full font-bold text-lg transition-all shadow-lg hover:shadow-xl active:scale-95 flex items-center gap-2"
                                >
                                    <span>Starten</span>
                                    <Sparkles className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* VALUE PROPOSITION */}
                        <div className="flex flex-wrap justify-center gap-8 md:gap-16">
                            <div className="flex flex-col items-center gap-2 group cursor-default">
                                <div className="p-3 bg-white/10 backdrop-blur-sm text-indigo-300 rounded-2xl group-hover:scale-110 transition-transform shadow-lg border border-white/20">
                                    <Clock size={24} />
                                </div>
                                <span className="font-semibold text-sm text-white" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.5)' }}>Zeit sparen</span>
                            </div>

                            <div className="flex flex-col items-center gap-2 group cursor-default">
                                <div className="p-3 bg-white/10 backdrop-blur-sm text-amber-300 rounded-2xl group-hover:scale-110 transition-transform shadow-lg border border-white/20">
                                    <Lightbulb size={24} />
                                </div>
                                <span className="font-semibold text-sm text-white" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.5)' }}>Verbesserungen</span>
                            </div>

                            <div className="flex flex-col items-center gap-2 group cursor-default">
                                <div className="p-3 bg-white/10 backdrop-blur-sm text-fuchsia-300 rounded-2xl group-hover:scale-110 transition-transform shadow-lg border border-white/20">
                                    <ShieldCheck size={24} />
                                </div>
                                <span className="font-semibold text-sm text-white" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.5)' }}>Fake-Erkennung</span>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* --- IMPORT NEEDED STATE --- */}
                {needsImport && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col items-center justify-center min-h-[70vh] relative z-10"
                    >
                        <div className="max-w-xl w-full bg-white/80 backdrop-blur-xl rounded-[2.5rem] shadow-2xl shadow-indigo-200/40 border border-white/60 p-12 text-center">

                            {importStatus === 'importing' && (
                                <>
                                    <div className="w-20 h-20 mx-auto mb-6 relative">
                                        <div className="absolute inset-0 border-t-4 border-violet-500 rounded-full animate-spin"></div>
                                        <div className="absolute inset-2 border-r-4 border-fuchsia-500 rounded-full animate-spin animation-delay-2000"></div>
                                    </div>
                                    <h3 className="text-2xl font-bold text-slate-800 mb-2">Importiere Bewertungen...</h3>
                                    <p className="text-slate-500">Das kann einen Moment dauern.</p>
                                </>
                            )}

                            {importStatus === 'success' && (
                                <>
                                    <div className="w-20 h-20 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
                                        <CheckCircle className="w-12 h-12 text-green-600" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-slate-800 mb-2">Import erfolgreich!</h3>
                                    <p className="text-slate-500">Starte Analyse...</p>
                                </>
                            )}

                            {importStatus === '' && (
                                <>
                                    <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-violet-100 to-fuchsia-100 rounded-full flex items-center justify-center">
                                        <Download className="w-10 h-10 text-violet-600" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-slate-800 mb-3">Daten noch nicht verfügbar</h3>
                                    <p className="text-slate-600 mb-8 leading-relaxed">
                                        Für diese Place-ID <span className="font-mono text-sm bg-slate-100 px-2 py-1 rounded">{placeId}</span> wurden noch keine Bewertungen importiert.
                                    </p>

                                    <button
                                        onClick={handleImport}
                                        className="bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 text-white px-10 py-4 rounded-full font-bold text-lg transition-all shadow-xl hover:shadow-2xl active:scale-95 flex items-center gap-3 mx-auto"
                                    >
                                        <Download size={24} />
                                        <span>Jetzt importieren</span>
                                    </button>

                                    <p className="text-xs text-slate-400 mt-6">
                                        Der Import lädt alle Google-Bewertungen und analysiert sie mit KI.
                                    </p>
                                </>
                            )}
                        </div>
                    </motion.div>
                )}

                {/* Loading State */}
                {loading && !data && (
                    <div className="flex flex-col items-center justify-center min-h-[60vh] relative">
                        <div className="relative w-24 h-24 mb-6">
                            <div className="absolute inset-0 border-t-4 border-fuchsia-500 rounded-full animate-spin"></div>
                            <div className="absolute inset-2 border-r-4 border-violet-500 rounded-full animate-spin animation-delay-2000"></div>
                        </div>
                        <h3 className="text-xl font-bold text-slate-700 animate-pulse">Analysiere Bewertungen...</h3>
                    </div>
                )}

                {/* Data Display */}
                {data && (
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="show"
                    >
                        <motion.div variants={itemVariants}>
                            <PlaceHeader {...data.info} analyzedCount={data.info.analyzedCount} />
                        </motion.div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2 space-y-8">
                                <motion.div variants={itemVariants}>
                                    <AISummary analysis={data.analysis} />
                                </motion.div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <motion.div variants={itemVariants} className="h-full">
                                        <FakeReviewDetector analysis={data.analysis} />
                                    </motion.div>
                                    <motion.div variants={itemVariants} className="h-full">
                                        <KeywordGalaxy analysis={data.analysis} />
                                    </motion.div>
                                </div>

                                <motion.div variants={itemVariants}>
                                    <TrendView trends={data.trends} />
                                </motion.div>
                            </div>

                            <motion.div variants={itemVariants} className="lg:col-span-1">
                                <ReviewExplorer
                                    initialReviews={data.reviews}
                                    onFilterChange={async (cat) => {
                                        const newReviews = await loadReviews(placeId, cat);
                                        setData(prev => ({ ...prev, reviews: newReviews }));
                                    }}
                                />
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </main>

            {/* --- FOOTER --- */}
            <footer className="relative z-10 py-3 border-t border-white/10 backdrop-blur-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <p className="text-white/60 text-sm" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.5)' }}>
                        © {new Date().getFullYear()} <span className="font-semibold text-white/80">Mahmoud Shaban</span>. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    );
}
