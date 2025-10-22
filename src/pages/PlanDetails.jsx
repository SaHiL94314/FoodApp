import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { planAPI, reviewAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import './PlanDetails.css';

const PlanDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [plan, setPlan] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewForm, setReviewForm] = useState({ review: '', rating: 5 });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadPlanDetails();
  }, [id]);

  const loadPlanDetails = async () => {
    try {
      const [planRes, reviewsRes] = await Promise.all([
        planAPI.getPlan(id),
        reviewAPI.getPlanReviews(id),
      ]);
      setPlan(planRes.data);
      setReviews(reviewsRes.data || []);
    } catch (error) {
      console.error('Error loading plan details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setSubmitting(true);
    try {
      await reviewAPI.createReview(id, {
        ...reviewForm,
        user: user._id,
        plan: id,
      });
      setShowReviewForm(false);
      setReviewForm({ review: '', rating: 5 });
      loadPlanDetails();
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Failed to submit review. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">Loading plan details...</div>
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="container">
        <div className="error-message">Plan not found</div>
      </div>
    );
  }

  return (
    <div className="plan-details-page">
      <div className="container">
        <div className="plan-details-grid">
          <div className="plan-main">
            <div className="plan-hero">
              <div className="plan-hero-image">
                <span className="hero-icon">🍱</span>
              </div>
              <div className="plan-hero-content">
                <h1 className="plan-title">{plan.name}</h1>
                <div className="plan-meta-info">
                  <div className="meta-item">
                    <span className="meta-icon">📅</span>
                    <span>{plan.duration} days</span>
                  </div>
                  {plan.ratingAverage && (
                    <div className="meta-item">
                      <span className="meta-icon">⭐</span>
                      <span>{plan.ratingAverage.toFixed(1)} rating</span>
                    </div>
                  )}
                  <div className="meta-item">
                    <span className="meta-icon">💬</span>
                    <span>{plan.reviewcount} reviews</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="plan-description-section">
              <h2>About This Plan</h2>
              <p>
                Experience a {plan.duration}-day culinary journey with our {plan.name} plan.
                Carefully curated meals designed to delight your taste buds and nourish your body.
              </p>
            </div>
          </div>

          <div className="plan-sidebar">
            <div className="price-card">
              <div className="price-header">
                <span className="price-label">Plan Price</span>
                <div className="price-amount">${plan.price}</div>
              </div>
              {plan.discount > 0 && (
                <div className="discount-info">
                  <span className="discount-text">Save {plan.discount}%</span>
                  <span className="original-price">
                    ${Math.round(plan.price / (1 - plan.discount / 100))}
                  </span>
                </div>
              )}
              <button className="btn-subscribe">Subscribe Now</button>
              <div className="plan-features">
                <div className="feature-item">✓ Daily fresh meals</div>
                <div className="feature-item">✓ Free delivery</div>
                <div className="feature-item">✓ Cancel anytime</div>
                <div className="feature-item">✓ Expert chefs</div>
              </div>
            </div>
          </div>
        </div>

        <div className="reviews-section">
          <div className="reviews-header">
            <h2>Customer Reviews</h2>
            {isAuthenticated && user?.role === 'user' && (
              <button
                className="btn-write-review"
                onClick={() => setShowReviewForm(!showReviewForm)}
              >
                {showReviewForm ? 'Cancel' : 'Write a Review'}
              </button>
            )}
          </div>

          {showReviewForm && (
            <form className="review-form" onSubmit={handleReviewSubmit}>
              <div className="form-group">
                <label htmlFor="rating">Rating (1-10)</label>
                <input
                  type="number"
                  id="rating"
                  min="1"
                  max="10"
                  value={reviewForm.rating}
                  onChange={(e) =>
                    setReviewForm({ ...reviewForm, rating: parseInt(e.target.value) })
                  }
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="review">Your Review</label>
                <textarea
                  id="review"
                  rows="4"
                  value={reviewForm.review}
                  onChange={(e) =>
                    setReviewForm({ ...reviewForm, review: e.target.value })
                  }
                  required
                  placeholder="Share your experience with this meal plan..."
                />
              </div>
              <button type="submit" className="btn-submit-review" disabled={submitting}>
                {submitting ? 'Submitting...' : 'Submit Review'}
              </button>
            </form>
          )}

          {reviews.length === 0 ? (
            <div className="no-reviews">
              <p>No reviews yet. Be the first to review this plan!</p>
            </div>
          ) : (
            <div className="reviews-list">
              {reviews.map((review) => (
                <div key={review._id} className="review-card">
                  <div className="review-header">
                    <div className="reviewer-info">
                      <div className="reviewer-avatar">
                        {review.user?.name?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <div>
                        <h4 className="reviewer-name">
                          {review.user?.name || 'Anonymous'}
                        </h4>
                        <div className="review-rating">
                          {'⭐'.repeat(Math.min(review.rating, 10))}
                          <span className="rating-number">({review.rating}/10)</span>
                        </div>
                      </div>
                    </div>
                    <div className="review-date">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <p className="review-text">{review.review}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlanDetails;
