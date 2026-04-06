import axios from 'axios';
import { api, authApi, usersApi, conversationsApi, messagesApi, attachmentsApi } from '@/lib/api';

jest.mock('axios', () => {
  const mockAxiosInstance = {
    interceptors: {
      request: { use: jest.fn() },
      response: { use: jest.fn() },
    },
    create: jest.fn(() => mockAxiosInstance),
    get: jest.fn(),
    post: jest.fn(),
    patch: jest.fn(),
    delete: jest.fn(),
  };
  return {
    create: jest.fn(() => mockAxiosInstance),
    default: mockAxiosInstance,
  };
});

describe('API Client', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('api instance', () => {
    it('should have correct baseURL', () => {
      expect(api.defaults.baseURL).toBe('http://localhost:3000/api/v1');
    });

    it('should have correct default headers', () => {
      expect(api.defaults.headers['Content-Type']).toBe('application/json');
    });
  });

  describe('authApi', () => {
    it('register should call POST /auth/register', async () => {
      const mockResponse = { data: { accessToken: 'token', refreshToken: 'refresh' } };
      (api.post as jest.Mock).mockResolvedValue(mockResponse);

      const result = await authApi.register({
        email: 'test@test.com',
        username: 'testuser',
        password: 'password123',
        displayName: 'Test User',
      });

      expect(api.post).toHaveBeenCalledWith('/auth/register', {
        email: 'test@test.com',
        username: 'testuser',
        password: 'password123',
        displayName: 'Test User',
      });
      expect(result).toEqual(mockResponse.data);
    });

    it('login should call POST /auth/login', async () => {
      const mockResponse = { data: { accessToken: 'token', refreshToken: 'refresh' } };
      (api.post as jest.Mock).mockResolvedValue(mockResponse);

      const result = await authApi.login({ email: 'test@test.com', password: 'password123' });

      expect(api.post).toHaveBeenCalledWith('/auth/login', {
        email: 'test@test.com',
        password: 'password123',
      });
      expect(result).toEqual(mockResponse.data);
    });

    it('logout should call POST /auth/logout', async () => {
      const mockResponse = { data: { success: true } };
      (api.post as jest.Mock).mockResolvedValue(mockResponse);

      await authApi.logout('refresh-token');

      expect(api.post).toHaveBeenCalledWith('/auth/logout', { refreshToken: 'refresh-token' });
    });

    it('refresh should call POST /auth/refresh', async () => {
      const mockResponse = { data: { accessToken: 'new-token', refreshToken: 'new-refresh' } };
      (api.post as jest.Mock).mockResolvedValue(mockResponse);

      const result = await authApi.refresh('old-refresh-token');

      expect(api.post).toHaveBeenCalledWith('/auth/refresh', { refreshToken: 'old-refresh-token' });
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('usersApi', () => {
    it('getMe should call GET /users/me', async () => {
      const mockUser = { id: 'user-1', email: 'test@test.com', username: 'testuser' };
      const mockResponse = { data: mockUser };
      (api.get as jest.Mock).mockResolvedValue(mockResponse);

      const result = await usersApi.getMe();

      expect(api.get).toHaveBeenCalledWith('/users/me');
      expect(result).toEqual(mockUser);
    });

    it('updateMe should call PATCH /users/me', async () => {
      const mockResponse = { data: { success: true } };
      (api.patch as jest.Mock).mockResolvedValue(mockResponse);

      await usersApi.updateMe({ displayName: 'New Name' });

      expect(api.patch).toHaveBeenCalledWith('/users/me', { displayName: 'New Name' });
    });

    it('searchUsers should call GET /users/search with params', async () => {
      const mockUsers = [{ id: 'user-1', username: 'testuser' }];
      const mockResponse = { data: mockUsers };
      (api.get as jest.Mock).mockResolvedValue(mockResponse);

      const result = await usersApi.searchUsers('test', 10);

      expect(api.get).toHaveBeenCalledWith('/users/search', { params: { query: 'test', limit: 10 } });
      expect(result).toEqual(mockUsers);
    });
  });

  describe('conversationsApi', () => {
    it('getConversations should call GET /conversations', async () => {
      const mockConversations = [{ id: 'conv-1' }];
      const mockResponse = { data: mockConversations };
      (api.get as jest.Mock).mockResolvedValue(mockResponse);

      const result = await conversationsApi.getConversations(50);

      expect(api.get).toHaveBeenCalledWith('/conversations', { params: { limit: 50 } });
      expect(result).toEqual(mockConversations);
    });

    it('createConversation should call POST /conversations', async () => {
      const mockResponse = { data: { id: 'conv-new' } };
      (api.post as jest.Mock).mockResolvedValue(mockResponse);

      await conversationsApi.createConversation({
        type: 'group',
        name: 'Test Group',
        participantIds: ['user-1', 'user-2'],
      });

      expect(api.post).toHaveBeenCalledWith('/conversations', {
        type: 'group',
        name: 'Test Group',
        participantIds: ['user-1', 'user-2'],
      });
    });

    it('createDirectConversation should call POST /conversations/direct/:userId', async () => {
      const mockResponse = { data: { id: 'conv-1' } };
      (api.post as jest.Mock).mockResolvedValue(mockResponse);

      await conversationsApi.createDirectConversation('user-2');

      expect(api.post).toHaveBeenCalledWith('/conversations/direct/user-2');
    });

    it('getConversation should call GET /conversations/:id', async () => {
      const mockConversation = { id: 'conv-1' };
      const mockResponse = { data: mockConversation };
      (api.get as jest.Mock).mockResolvedValue(mockResponse);

      const result = await conversationsApi.getConversation('conv-1');

      expect(api.get).toHaveBeenCalledWith('/conversations/conv-1');
      expect(result).toEqual(mockConversation);
    });
  });

  describe('messagesApi', () => {
    it('getMessages should call GET /conversations/:id/messages', async () => {
      const mockMessages = [{ id: 'msg-1' }];
      const mockResponse = { data: mockMessages };
      (api.get as jest.Mock).mockResolvedValue(mockResponse);

      const result = await messagesApi.getMessages('conv-1', 50);

      expect(api.get).toHaveBeenCalledWith('/conversations/conv-1/messages', {
        params: { limit: 50 },
      });
      expect(result).toEqual(mockMessages);
    });

    it('sendMessage should call POST /conversations/:id/messages', async () => {
      const mockMessage = { id: 'msg-1', content: 'Hello' };
      const mockResponse = { data: mockMessage };
      (api.post as jest.Mock).mockResolvedValue(mockResponse);

      await messagesApi.sendMessage('conv-1', { content: 'Hello' });

      expect(api.post).toHaveBeenCalledWith('/conversations/conv-1/messages', {
        content: 'Hello',
      });
    });

    it('markAsRead should call POST /conversations/:id/messages/:messageId/read', async () => {
      const mockResponse = { data: { success: true } };
      (api.post as jest.Mock).mockResolvedValue(mockResponse);

      await messagesApi.markAsRead('conv-1', 'msg-1');

      expect(api.post).toHaveBeenCalledWith('/conversations/conv-1/messages/msg-1/read');
    });
  });

  describe('attachmentsApi', () => {
    it('uploadAttachment should call POST /attachments/upload with FormData', async () => {
      const mockFile = new File(['test'], 'test.txt', { type: 'text/plain' });
      const mockResponse = { data: { id: 'att-1', url: 'https://example.com/file' } };
      (api.post as jest.Mock).mockResolvedValue(mockResponse);

      const result = await attachmentsApi.uploadAttachment(mockFile);

      expect(api.post).toHaveBeenCalledWith(
        '/attachments/upload',
        expect.any(FormData),
        expect.objectContaining({
          headers: expect.objectContaining({ 'Content-Type': 'multipart/form-data' }),
        })
      );
      expect(result).toEqual(mockResponse.data);
    });
  });
});

describe('Request Interceptor', () => {
  it('should add Authorization header with token', async () => {
    (localStorage.getItem as jest.Mock).mockReturnValue('test-token');
    
    const mockConfig = { headers: {} };
    const interceptor = (api.interceptors.request.use as jest.Mock).mock.calls[0][0];
    
    const result = await interceptor(mockConfig);
    
    expect(result.headers.Authorization).toBe('Bearer test-token');
  });

  it('should not add header when no token exists', async () => {
    (localStorage.getItem as jest.Mock).mockReturnValue(null);
    
    const mockConfig = { headers: {} };
    const interceptor = (api.interceptors.request.use as jest.Mock).mock.calls[0][0];
    
    const result = await interceptor(mockConfig);
    
    expect(result.headers.Authorization).toBeUndefined();
  });
});

describe('Response Interceptor - Token Refresh', () => {
  it('should attempt token refresh on 401', async () => {
    const mockRefreshResponse = { 
      data: { 
        accessToken: 'new-access-token', 
        refreshToken: 'new-refresh-token' 
      } 
    };
    
    (axios.post as jest.Mock).mockResolvedValueOnce(mockRefreshResponse);
    (localStorage.getItem as jest.Mock).mockReturnValue('old-refresh-token');
    
    const originalRequest = { 
      url: '/test', 
      headers: {}, 
      _retry: false 
    };
    
    const errorInterceptor = (api.interceptors.response.use as jest.Mock).mock.calls[0][1];
    
    await expect(errorInterceptor({ response: { status: 401 }, config: originalRequest })).rejects.toEqual(
      expect.objectContaining({ response: { status: 401 } })
    );
  });
});