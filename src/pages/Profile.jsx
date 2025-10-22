import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { userAPI } from '../services/api';
import './Profile.css';

const Profile = () => {
  const { user, logout } = useAuth();
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });
  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      await userAPI.updateUser(user._id, formData);
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      setEditing(false);
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'Failed to update profile' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-page">
      <div className="container">
        <div className="profile-container">
          <div className="profile-header">
            <div className="profile-avatar">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="profile-header-info">
              <h1>{user?.name}</h1>
              <span className="user-role">{user?.role}</span>
            </div>
          </div>

          <div className="profile-content">
            <div className="profile-card">
              <div className="card-header">
                <h2>Profile Information</h2>
                {!editing && (
                  <button
                    className="btn-edit"
                    onClick={() => setEditing(true)}
                  >
                    Edit Profile
                  </button>
                )}
              </div>

              {message.text && (
                <div className={`message ${message.type}`}>
                  {message.text}
                </div>
              )}

              {editing ? (
                <form onSubmit={handleSubmit} className="profile-form">
                  <div className="form-group">
                    <label htmlFor="name">Full Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="email">Email Address</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="form-actions">
                    <button
                      type="button"
                      className="btn-cancel"
                      onClick={() => {
                        setEditing(false);
                        setFormData({
                          name: user?.name || '',
                          email: user?.email || '',
                        });
                        setMessage({ type: '', text: '' });
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn-save"
                      disabled={loading}
                    >
                      {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="profile-info">
                  <div className="info-item">
                    <span className="info-label">Full Name</span>
                    <span className="info-value">{user?.name}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Email Address</span>
                    <span className="info-value">{user?.email}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Role</span>
                    <span className="info-value">{user?.role}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Member Since</span>
                    <span className="info-value">
                      {new Date().toLocaleDateString()}
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="profile-card">
              <div className="card-header">
                <h2>Account Settings</h2>
              </div>
              <div className="settings-section">
                <div className="setting-item">
                  <div>
                    <h4>Account Status</h4>
                    <p className="setting-description">Your account is active</p>
                  </div>
                  <span className="status-badge active">Active</span>
                </div>
                <div className="setting-item">
                  <div>
                    <h4>Two-Factor Authentication</h4>
                    <p className="setting-description">
                      Add an extra layer of security
                    </p>
                  </div>
                  <button className="btn-secondary">Enable</button>
                </div>
                <div className="setting-item">
                  <div>
                    <h4>Delete Account</h4>
                    <p className="setting-description">
                      Permanently delete your account and data
                    </p>
                  </div>
                  <button className="btn-danger">Delete</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
