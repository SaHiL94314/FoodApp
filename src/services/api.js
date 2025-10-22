const API_BASE_URL = '';

class ApiService {
  async request(endpoint, options = {}) {
    const config = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      credentials: 'include',
    };

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Request failed');
      }

      return data;
    } catch (error) {
      throw error;
    }
  }

  get(endpoint) {
    return this.request(endpoint, { method: 'GET' });
  }

  post(endpoint, body) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  patch(endpoint, body) {
    return this.request(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(body),
    });
  }

  delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }
}

export const api = new ApiService();

export const authAPI = {
  signup: (userData) => api.post('/user/signup', userData),
  login: (credentials) => api.post('/user/login', credentials),
  logout: () => api.get('/user/logout'),
  getProfile: () => api.get('/user/userProfile'),
  forgetPassword: (email) => api.post('/user/forgetpassword', { email }),
  resetPassword: (token, passwords) => api.post(`/user/resetpassword/${token}`, passwords),
};

export const userAPI = {
  getAllUsers: () => api.get('/user/'),
  updateUser: (id, data) => api.patch(`/user/${id}`, data),
  deleteUser: (id) => api.delete(`/user/${id}`),
};

export const planAPI = {
  getAllPlans: () => api.get('/plans/allPlans'),
  getPlan: (id) => api.get(`/plans/plan/${id}`),
  getTop3Plans: () => api.get('/plans/top3plans'),
  createPlan: (planData) => api.post('/plans/crudPlan', planData),
  updatePlan: (id, planData) => api.patch(`/plans/crudPlan/${id}`, planData),
  deletePlan: (id) => api.delete(`/plans/crudPlan/${id}`),
};

export const reviewAPI = {
  getAllReviews: () => api.get('/review/allReviews'),
  getTop3Reviews: () => api.get('/review/top3reviews'),
  getPlanReviews: (planId) => api.get(`/review/${planId}`),
  createReview: (planId, reviewData) => api.post(`/review/crud/${planId}`, reviewData),
  updateReview: (planId, reviewData) => api.patch(`/review/crud/${planId}`, reviewData),
  deleteReview: (planId, reviewId) => api.delete(`/review/crud/${planId}`, { body: JSON.stringify({ id: reviewId }) }),
};
