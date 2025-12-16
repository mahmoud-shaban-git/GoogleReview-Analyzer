import React from 'react';
import { Star, User } from 'lucide-react';

function StarRating({ rating }) {
    return (
        <div className="flex">
            {[...Array(5)].map((_, i) => (
                <Star
                    key={i}
                    className={`w-4 h-4 ${i < rating ? 'text-amber-400 fill-current' : 'text-slate-200'}`}
                />
            ))}
        </div>
    );
}

export default function ReviewList({ reviews }) {
    if (!reviews || reviews.length === 0) return null;

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <h2 className="text-xl font-semibold mb-6 text-slate-800">Recent Reviews</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {reviews.map((review) => (
                    <div key={review.id || Math.random()} className="p-4 border border-slate-100 rounded-lg bg-slate-50 hover:bg-white hover:shadow-md transition-all duration-200">
                        <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 font-bold">
                                    {review.author ? review.author.charAt(0).toUpperCase() : <User className="w-4 h-4" />}
                                </div>
                                <div>
                                    <h4 className="font-medium text-slate-900 text-sm">{review.author || 'Anonymous'}</h4>
                                    <p className="text-xs text-slate-500">{review.reviewDate}</p>
                                </div>
                            </div>
                            <StarRating rating={review.rating} />
                        </div>
                        <p className="text-slate-600 text-sm mt-2 line-clamp-4">{review.text}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
