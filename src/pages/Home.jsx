import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { planAPI, reviewAPI } from '../services/api';
import './Home.css';

const Home = () => {
  const [topPlans, setTopPlans] = useState([]);
  const [topReviews, setTopReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [plansRes, reviewsRes] = await Promise.all([
        planAPI.getTop3Plans(),
        reviewAPI.getTop3Reviews(),
      ]);
      setTopPlans(plansRes.data || []);
      setTopReviews(reviewsRes.data || []);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home">
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">
              Discover Your Perfect
              <span className="gradient-text"> Meal Plan</span>
            </h1>
            <p className="hero-description">
              Choose from our curated selection of delicious meal plans designed
              to fit your lifestyle and taste preferences.
            </p>
            <div className="hero-actions">
              <Link to="/plans">
                <button className="btn-hero-primary">Explore Plans</button>
              </Link>
              <Link to="/signup">
                <button className="btn-hero-secondary">Get Started</button>
              </Link>
            </div>
          </div>
          <div className="hero-image">
            <div className="image-placeholder">
              <span className="image-icon">🍽️</span>
            </div>
          </div>
        </div>
      </section>

      <section className="features">
        <div className="container">
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">⭐</div>
              <h3>Top Quality</h3>
              <p>Hand-picked ingredients and recipes from expert chefs</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🚚</div>
              <h3>Fast Delivery</h3>
              <p>Get your meals delivered fresh to your doorstep</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💰</div>
              <h3>Great Value</h3>
              <p>Affordable pricing with flexible subscription plans</p>
            </div>
          </div>
        </div>
      </section>

      {topPlans.length > 0 && (
        <section className="top-plans">
          <div className="container">
            <div className="section-header">
              <h2>Popular Meal Plans</h2>
              <Link to="/plans" className="view-all-link">
                View All →
              </Link>
            </div>
            <div className="plans-grid">
              {topPlans.map((plan) => (
                <Link to={`/plans/${plan._id}`} key={plan._id} className="plan-card">
                  <div className="plan-image">
                    <span className="plan-icon">🍱</span>
                  </div>
                  <div className="plan-content">
                    <h3 className="plan-name">{plan.name}</h3>
                    <div className="plan-meta">
                      <span className="plan-duration">{plan.duration} days</span>
                      {plan.ratingAverage && (
                        <span className="plan-rating">
                          ⭐ {plan.ratingAverage.toFixed(1)}
                        </span>
                      )}
                    </div>
                    <div className="plan-footer">
                      <div className="plan-price">
                        <span className="price-amount">${plan.price}</span>
                        {plan.discount > 0 && (
                          <span className="discount-badge">-{plan.discount}%</span>
                        )}
                      </div>
                      <span className="review-count">
                        {plan.reviewcount} reviews
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {topReviews.length > 0 && (
        <section className="testimonials">
          <div className="container">
            <h2 className="section-title">What Our Customers Say</h2>
            <div className="testimonials-grid">
              {topReviews.map((review) => (
                <div key={review._id} className="testimonial-card">
                  <div className="testimonial-header">
                    <div className="user-avatar">
                      {review.user?.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div>
                      <h4>{review.user?.name || 'Anonymous'}</h4>
                      <div className="rating">
                        {'⭐'.repeat(Math.min(review.rating, 10))}
                      </div>
                    </div>
                  </div>
                  <p className="testimonial-text">{review.review}</p>
                  {review.plan && (
                    <Link
                      to={`/plans/${review.plan._id}`}
                      className="plan-link"
                    >
                      {review.plan.name} →
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="cta">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Start Your Journey?</h2>
            <p>Join thousands of satisfied customers enjoying delicious meals</p>
            <Link to="/signup">
              <button className="btn-cta">Sign Up Now</button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
