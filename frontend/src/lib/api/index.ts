import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('accessToken');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
    
    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;
      
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        try {
          const response = await axios.post(`${API_URL}/auth/refresh`, {
            refreshToken,
          });
          
          const { accessToken, refreshToken: newRefreshToken } = response.data;
          localStorage.setItem('accessToken', accessToken);
          localStorage.setItem('refreshToken', newRefreshToken);
          
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          }
          return api(originalRequest);
        } catch {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          window.location.href = '/login';
        }
      }
    }
    
    return Promise.reject(error);
  }
);

export const authApi = {
  register: async (data: { email: string; username: string; password: string; displayName?: string }) => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },
  
  login: async (data: { email: string; password: string; deviceInfo?: string }) => {
    const response = await api.post('/auth/login', data);
    return response.data;
  },
  
  logout: async (refreshToken?: string) => {
    const response = await api.post('/auth/logout', { refreshToken });
    return response.data;
  },
  
  refresh: async (refreshToken: string) => {
    const response = await api.post('/auth/refresh', { refreshToken });
    return response.data;
  },
};

export const usersApi = {
  getMe: async () => {
    const response = await api.get('/users/me');
    return response.data;
  },
  
  updateMe: async (data: { username?: string; displayName?: string; avatarUrl?: string }) => {
    const response = await api.patch('/users/me', data);
    return response.data;
  },
  
  searchUsers: async (query: string, limit = 20) => {
    const response = await api.get('/users/search', { params: { query, limit } });
    return response.data;
  },
};

export const conversationsApi = {
  getConversations: async (limit = 50, before?: string) => {
    const response = await api.get('/conversations', { params: { limit, before } });
    return response.data;
  },
  
  createConversation: async (data: { type: string; name?: string; participantIds: string[] }) => {
    const response = await api.post('/conversations', data);
    return response.data;
  },
  
  createDirectConversation: async (userId: string) => {
    const response = await api.post(`/conversations/direct/${userId}`);
    return response.data;
  },
  
  getConversation: async (id: string) => {
    const response = await api.get(`/conversations/${id}`);
    return response.data;
  },
};

export const messagesApi = {
  getMessages: async (conversationId: string, limit = 50, before?: string, after?: string) => {
    const response = await api.get(`/conversations/${conversationId}/messages`, {
      params: { limit, before, after },
    });
    return response.data;
  },
  
  sendMessage: async (conversationId: string, data: {
    content: string;
    type?: string;
    clientMessageId?: string;
    replyToId?: string;
    attachmentId?: string;
  }) => {
    const response = await api.post(`/conversations/${conversationId}/messages`, data);
    return response.data;
  },
  
  markAsRead: async (conversationId: string, messageId: string) => {
    const response = await api.post(`/conversations/${conversationId}/messages/${messageId}/read`);
    return response.data;
  },
};

export const attachmentsApi = {
  uploadAttachment: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await api.post('/attachments/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};

export default api;
