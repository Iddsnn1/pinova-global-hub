import React, { useState } from 'react';
import { 
  Star, 
  ShieldCheck, 
  ThumbsUp, 
  AlertCircle, 
  CheckCircle2, 
  MessageSquare, 
  Send,
  Flag
} from 'lucide-react';
import { Product, Order } from '../../types';
import { trustModule, ReviewItem } from '../../modules/trust';

interface ProductReviewsSectionProps {
  product: Product;
  userOrders?: Order[];
  currentUsername?: string;
}

export const ProductReviewsSection: React.FC<ProductReviewsSectionProps> = ({
  product,
  userOrders = [],
  currentUsername = 'pioneer_alex'
}) => {
  const [reviews, setReviews] = useState<ReviewItem[]>(
    trustModule.reviewEngine.getReviewsForProduct(product.id)
  );

  const [showWriteModal, setShowWriteModal] = useState(false);
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const canReview = trustModule.reviewEngine.canUserReviewProduct(currentUsername, product.id, userOrders);

  const handleHelpfulVote = (reviewId: string) => {
    setReviews((prev) =>
      prev.map((r) => (r.id === reviewId ? { ...r, helpfulVotes: r.helpfulVotes + 1 } : r))
    );
  };

  const handleReportReview = (reviewId: string) => {
    alert('Thank you. This review has been flagged for PSTP Community Moderation.');
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    const result = trustModule.reviewEngine.submitReview(
      currentUsername,
      product,
      rating,
      title,
      comment,
      userOrders
    );

    if (!result.success) {
      setErrorMsg(result.message);
      return;
    }

    setSuccessMsg(result.message);
    setReviews(trustModule.reviewEngine.getReviewsForProduct(product.id));

    setTimeout(() => {
      setSuccessMsg(null);
      setShowWriteModal(false);
      setTitle('');
      setComment('');
    }, 2000);
  };

  const averageRating = reviews.length > 0
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : product.rating.toFixed(1);

  return (
    <div className="space-y-6 pt-4 border-t border-slate-200 dark:border-slate-800">
      {/* Reviews Summary Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-center min-w-[80px]">
            <span className="text-3xl font-black text-amber-500">{averageRating}</span>
            <div className="flex items-center text-amber-400 mt-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className={`w-3 h-3 ${i < Math.round(Number(averageRating)) ? 'fill-amber-400 text-amber-400' : 'text-slate-300 dark:text-slate-700'}`} />
              ))}
            </div>
            <span className="text-[9px] text-slate-400 font-bold mt-1">{reviews.length} Verified Reviews</span>
          </div>

          <div>
            <h3 className="font-extrabold text-base text-slate-900 dark:text-slate-100">Verified Purchaser Reviews</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Reviews are strictly restricted to pioneers who have completed orders for this item.
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowWriteModal(true)}
          className="px-4 py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-purple-500/20 transition-all shrink-0"
        >
          <MessageSquare className="w-4 h-4" />
          <span>Write Verified Review</span>
        </button>
      </div>

      {/* Reviews List */}
      <div className="space-y-3">
        {reviews.length === 0 ? (
          <div className="p-8 text-center rounded-3xl bg-slate-50 dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-800 text-slate-400 text-xs">
            No reviews yet for this product. Be the first verified purchaser to leave a review!
          </div>
        ) : (
          reviews.map((rev) => (
            <div key={rev.id} className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-xs text-slate-900 dark:text-slate-100">@{rev.buyerUsername}</span>
                  {rev.isVerifiedPurchase && (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold flex items-center gap-1 border border-emerald-500/20">
                      <ShieldCheck className="w-3 h-3" />
                      <span>Verified Purchase</span>
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1 text-amber-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`w-3.5 h-3.5 ${i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300 dark:text-slate-700'}`} />
                  ))}
                </div>
              </div>

              <h4 className="font-extrabold text-xs text-slate-900 dark:text-slate-100">{rev.title}</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400">{rev.comment}</p>

              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                <span>{new Date(rev.createdAt).toLocaleDateString()}</span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleHelpfulVote(rev.id)}
                    className="flex items-center gap-1 text-slate-500 hover:text-purple-600 dark:hover:text-purple-400 font-bold transition-all"
                  >
                    <ThumbsUp className="w-3 h-3" />
                    <span>Helpful ({rev.helpfulVotes})</span>
                  </button>
                  <button
                    onClick={() => handleReportReview(rev.id)}
                    className="text-slate-400 hover:text-rose-500 transition-all"
                  >
                    <Flag className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* WRITE REVIEW MODAL */}
      {showWriteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <form onSubmit={handleSubmitReview} className="w-full max-w-lg p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                <span>Write Verified Product Review</span>
              </h3>
              <button type="button" onClick={() => setShowWriteModal(false)} className="text-slate-400 hover:text-slate-200 font-bold">✕</button>
            </div>

            {!canReview && (
              <div className="p-3.5 rounded-2xl bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20 text-xs font-bold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-amber-500" />
                <span>Only pioneers who have purchased and received this product can publish reviews.</span>
              </div>
            )}

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Select Star Rating:</label>
                <div className="flex items-center gap-2 text-amber-400 cursor-pointer">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      onClick={() => setRating(s)}
                      className={`w-6 h-6 transition-all ${s <= rating ? 'fill-amber-400 text-amber-400 scale-110' : 'text-slate-300 dark:text-slate-700'}`}
                    />
                  ))}
                  <span className="font-bold text-slate-900 dark:text-slate-100 ml-2">{rating} / 5 Stars</span>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Review Headline:</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Excellent build quality and instant delivery!"
                  required
                  className="w-full p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-bold outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Review Feedback:</label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Describe your experience with this item..."
                  required
                  className="w-full p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-xs outline-none h-24"
                />
              </div>

              {errorMsg && (
                <div className="p-3 rounded-2xl bg-rose-500/10 text-rose-500 border border-rose-500/20 font-bold text-xs">
                  {errorMsg}
                </div>
              )}

              {successMsg && (
                <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 font-bold text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{successMsg}</span>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={!canReview}
              className={`w-full py-3 rounded-2xl font-black text-xs shadow-lg transition-all flex items-center justify-center gap-2 ${
                canReview
                  ? 'bg-purple-600 hover:bg-purple-700 text-white shadow-purple-500/20'
                  : 'bg-slate-300 dark:bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              <Send className="w-4 h-4" />
              <span>Publish Verified Review</span>
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
