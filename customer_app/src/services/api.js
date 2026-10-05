const API_BASE_URL = 'http://localhost:5000/api';

export const api = {
  // Health check
  async getHealth() {
    try {
      const res = await fetch(`${API_BASE_URL}/health`);
      return await res.json();
    } catch (e) {
      console.warn('Backend API connection fallback');
      return null;
    }
  },

  // Auth
  async login(email, password) {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      return await res.json();
    } catch (e) {
      return null;
    }
  },

  async register(userData) {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      return await res.json();
    } catch (e) {
      return null;
    }
  },

  // Dishes
  async getDishes() {
    try {
      const res = await fetch(`${API_BASE_URL}/dishes`);
      const data = await res.json();
      return data.success ? data.dishes : [];
    } catch (e) {
      return null;
    }
  },

  async addDish(dishData) {
    try {
      const res = await fetch(`${API_BASE_URL}/dishes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dishData)
      });
      return await res.json();
    } catch (e) {
      return null;
    }
  },

  async updateDish(id, dishData) {
    try {
      const res = await fetch(`${API_BASE_URL}/dishes/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dishData)
      });
      return await res.json();
    } catch (e) {
      return null;
    }
  },

  async deleteDish(id) {
    try {
      const res = await fetch(`${API_BASE_URL}/dishes/${id}`, {
        method: 'DELETE'
      });
      return await res.json();
    } catch (e) {
      return null;
    }
  },

  // Restaurant Status
  async getRestaurant() {
    try {
      const res = await fetch(`${API_BASE_URL}/restaurants`);
      const data = await res.json();
      return data.success ? data.restaurant : null;
    } catch (e) {
      return null;
    }
  },

  async updateRestaurant(restaurantData) {
    try {
      const res = await fetch(`${API_BASE_URL}/restaurants`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(restaurantData)
      });
      return await res.json();
    } catch (e) {
      return null;
    }
  },

  // Orders
  async getOrders() {
    try {
      const res = await fetch(`${API_BASE_URL}/orders`);
      const data = await res.json();
      return data.success ? data.orders : [];
    } catch (e) {
      return null;
    }
  },

  async createOrder(orderData) {
    try {
      const res = await fetch(`${API_BASE_URL}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });
      return await res.json();
    } catch (e) {
      return null;
    }
  },

  async updateOrderStatus(orderId, status) {
    try {
      const res = await fetch(`${API_BASE_URL}/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      return await res.json();
    } catch (e) {
      return null;
    }
  }
};
