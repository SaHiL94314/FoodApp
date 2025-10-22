import React, { useState, useEffect } from 'react';
import { planAPI } from '../services/api';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    duration: '',
    price: '',
    discount: 0,
    ratingAverage: 0,
  });
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    loadPlans();
  }, []);

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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    try {
      if (editingPlan) {
        await planAPI.updatePlan(editingPlan._id, formData);
        setMessage({ type: 'success', text: 'Plan updated successfully!' });
      } else {
        await planAPI.createPlan(formData);
        setMessage({ type: 'success', text: 'Plan created successfully!' });
      }
      resetForm();
      loadPlans();
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'Operation failed' });
    }
  };

  const handleEdit = (plan) => {
    setEditingPlan(plan);
    setFormData({
      name: plan.name,
      duration: plan.duration,
      price: plan.price,
      discount: plan.discount || 0,
      ratingAverage: plan.ratingAverage || 0,
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this plan?')) return;

    try {
      await planAPI.deletePlan(id);
      setMessage({ type: 'success', text: 'Plan deleted successfully!' });
      loadPlans();
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'Delete failed' });
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      duration: '',
      price: '',
      discount: 0,
      ratingAverage: 0,
    });
    setEditingPlan(null);
    setShowForm(false);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="container">
        <div className="dashboard-header">
          <div>
            <h1>Admin Dashboard</h1>
            <p>Manage your meal plans</p>
          </div>
          <button
            className="btn-create"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? 'Cancel' : '+ Create New Plan'}
          </button>
        </div>

        {message.text && (
          <div className={`message ${message.type}`}>
            {message.text}
          </div>
        )}

        {showForm && (
          <div className="plan-form-card">
            <h2>{editingPlan ? 'Edit Plan' : 'Create New Plan'}</h2>
            <form onSubmit={handleSubmit} className="plan-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">Plan Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="e.g., Premium"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="duration">Duration (days)</label>
                  <input
                    type="number"
                    id="duration"
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    required
                    min="1"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="price">Price ($)</label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    required
                    min="0"
                    step="0.01"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="discount">Discount (%)</label>
                  <input
                    type="number"
                    id="discount"
                    name="discount"
                    value={formData.discount}
                    onChange={handleChange}
                    min="0"
                    max="100"
                  />
                </div>
              </div>

              <div className="form-actions">
                <button type="button" className="btn-cancel" onClick={resetForm}>
                  Cancel
                </button>
                <button type="submit" className="btn-submit">
                  {editingPlan ? 'Update Plan' : 'Create Plan'}
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="plans-table-container">
          <h2>All Plans</h2>
          {plans.length === 0 ? (
            <div className="no-plans">
              <p>No plans available. Create your first plan!</p>
            </div>
          ) : (
            <div className="table-wrapper">
              <table className="plans-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Duration</th>
                    <th>Price</th>
                    <th>Discount</th>
                    <th>Rating</th>
                    <th>Reviews</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {plans.map((plan) => (
                    <tr key={plan._id}>
                      <td className="plan-name">{plan.name}</td>
                      <td>{plan.duration} days</td>
                      <td className="price">${plan.price}</td>
                      <td>{plan.discount}%</td>
                      <td className="rating">
                        {plan.ratingAverage ? plan.ratingAverage.toFixed(1) : 'N/A'}
                      </td>
                      <td>{plan.reviewcount}</td>
                      <td>
                        <div className="action-buttons">
                          <button
                            className="btn-edit-small"
                            onClick={() => handleEdit(plan)}
                          >
                            Edit
                          </button>
                          <button
                            className="btn-delete-small"
                            onClick={() => handleDelete(plan._id)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
