import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { planAPI } from '../services/api';
import './Plans.css';

const Plans = () => {
  const [plans, setPlans] = useState([]);
  const [filteredPlans, setFilteredPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('name');
  const [filterPrice, setFilterPrice] = useState('all');

  useEffect(() => {
    loadPlans();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [plans, sortBy, filterPrice]);

  const loadPlans = async () => {
    try {
      const response = await planAPI.getAllPlans();
      setPlans(response.data || []);
    } catch (error) {
      console.error('Error loading plans:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...plans];

    if (filterPrice !== 'all') {
      filtered = filtered.filter((plan) => {
        if (filterPrice === 'low') return plan.price < 200;
        if (filterPrice === 'medium') return plan.price >= 200 && plan.price < 400;
        if (filterPrice === 'high') return plan.price >= 400;
        return true;
      });
    }

    filtered.sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'rating') return (b.ratingAverage || 0) - (a.ratingAverage || 0);
      return 0;
    });

    setFilteredPlans(filtered);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">Loading plans...</div>
      </div>
    );
  }

  return (
    <div className="plans-page">
      <div className="container">
        <div className="plans-header">
          <h1>Meal Plans</h1>
          <p>Choose the perfect plan for your lifestyle</p>
        </div>

        <div className="filters-section">
          <div className="filter-group">
            <label htmlFor="sort">Sort By:</label>
            <select
              id="sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="filter-select"
            >
              <option value="name">Name</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="price">Price Range:</label>
            <select
              id="price"
              value={filterPrice}
              onChange={(e) => setFilterPrice(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Prices</option>
              <option value="low">Under $200</option>
              <option value="medium">$200 - $400</option>
              <option value="high">Above $400</option>
            </select>
          </div>
        </div>

        {filteredPlans.length === 0 ? (
          <div className="no-plans">
            <p>No plans found matching your criteria.</p>
          </div>
        ) : (
          <div className="plans-grid">
            {filteredPlans.map((plan) => (
              <Link to={`/plans/${plan._id}`} key={plan._id} className="plan-card">
                <div className="plan-image">
                  <span className="plan-icon">🍱</span>
                  {plan.discount > 0 && (
                    <div className="discount-badge">-{plan.discount}%</div>
                  )}
                </div>
                <div className="plan-content">
                  <h3 className="plan-name">{plan.name}</h3>
                  <p className="plan-duration">{plan.duration} days</p>

                  <div className="plan-stats">
                    {plan.ratingAverage && (
                      <div className="stat">
                        <span className="stat-icon">⭐</span>
                        <span>{plan.ratingAverage.toFixed(1)}</span>
                      </div>
                    )}
                    <div className="stat">
                      <span className="stat-icon">💬</span>
                      <span>{plan.reviewcount} reviews</span>
                    </div>
                  </div>

                  <div className="plan-footer">
                    <div className="plan-price">
                      <span className="price-label">From</span>
                      <span className="price-amount">${plan.price}</span>
                    </div>
                    <button className="btn-view">View Details</button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Plans;
