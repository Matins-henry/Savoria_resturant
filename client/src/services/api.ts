import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add token to requests
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const menuService = {
    getAll: async (params?: any) => {
        const response = await api.get('/menu', { params });
        return response.data;
    },
    getById: async (id: string) => {
        const response = await api.get(`/menu/${id}`);
        return response.data;
    },
    create: async (data: any) => {
        const response = await api.post('/menu', data);
        return response.data;
    },
    update: async (id: string, data: any) => {
        const response = await api.put(`/menu/${id}`, data);
        return response.data;
    },
    delete: async (id: string) => {
        const response = await api.delete(`/menu/${id}`);
        return response.data;
    },
    toggleAvailability: async (id: string) => {
        const response = await api.patch(`/menu/${id}/availability`);
        return response.data;
    },
    addReview: async (id: string, data: { rating: number; comment: string }) => {
        const response = await api.post(`/menu/${id}/reviews`, data);
        return response.data;
    },
    uploadImage: async (formData: FormData) => {
        const response = await api.post('/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    }
};

export const authService = {
    login: async (credentials: any) => {
        const response = await api.post('/auth/login', credentials);
        return response.data;
    },
    register: async (userData: any) => {
        const response = await api.post('/auth/register', userData);
        return response.data;
    },
    getProfile: async () => {
        const response = await api.get('/auth/me');
        return response.data;
    },
    updateProfile: async (data: any) => {
        const response = await api.put('/auth/profile', data);
        return response.data;
    },
    addAddress: async (address: any) => {
        const response = await api.post('/auth/addresses', address);
        return response.data;
    },
    updateAddress: async (addressId: string, address: any) => {
        const response = await api.put(`/auth/addresses/${addressId}`, address);
        return response.data;
    },
    deleteAddress: async (addressId: string) => {
        const response = await api.delete(`/auth/addresses/${addressId}`);
        return response.data;
    },
    updatePassword: async (data: any) => {
        const response = await api.put('/auth/update-password', data);
        return response.data;
    },
    forgotPassword: async (email: string) => {
        const response = await api.post('/auth/forgot-password', { email });
        return response.data;
    },
    resetPassword: async (resetToken: string, password: string) => {
        const response = await api.put(`/auth/reset-password/${resetToken}`, { password });
        return response.data;
    }
};

export const orderService = {
    create: async (orderData: any) => {
        const response = await api.post('/orders', orderData);
        return response.data;
    },
    getMyOrders: async () => {
        const response = await api.get('/orders');
        return response.data;
    },
    updateStatus: async (orderId: string, status: string) => {
        const response = await api.patch(`/orders/${orderId}/status`, { status });
        return response.data;
    }
};

export const bookingService = {
    create: async (data: any) => {
        const response = await api.post('/bookings', data);
        return response.data;
    },
    getAll: async () => {
        const response = await api.get('/bookings');
        return response.data;
    },
    updateStatus: async (id: string, status: string) => {
        const response = await api.patch(`/bookings/${id}/status`, { status });
        return response.data;
    }
};

export const adminService = {
    getStats: async () => {
        const response = await api.get('/admin/stats');
        return response.data;
    },
    getUsers: async () => {
        const response = await api.get('/admin/users');
        return response.data;
    },
    toggleBlockUser: async (id: string, isBlocked: boolean) => {
        const response = await api.patch(`/admin/users/${id}/block`, { isBlocked });
        return response.data;
    }
};

export const settingsService = {
    getSettings: async () => {
        const response = await api.get('/settings');
        return response.data;
    },
    updateSettings: async (data: any) => {
        // Backend expects PUT /api/settings
        const response = await api.put('/settings', data);
        return response.data;
    }
};

export default api;
