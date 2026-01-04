// API Client for Spring Boot Backend Integration
import axios, { AxiosInstance, AxiosError } from 'axios';
import {
  MOCK_USERS,
  MOCK_CLUBS,
  MOCK_EVENTS,
  MOCK_REGISTRATIONS,
  MOCK_VENUES,
  MOCK_SCHEDULE_DATA,
  findUserByEmail,
  findClubById,
  findEventById,
  getEventsByClub,
  getRegistrationsByUser,
  getRegistrationsByEvent,
  MockUser,
  MockClub,
  MockEvent,
  MockRegistration,
  MockVenue
} from './mockData';

// API Configuration
const API_BASE_URL = 'http://localhost:8080/api/v1';
const USE_MOCK_DATA = true; // Default to mock until backend is ready

// Types
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
  pagination?: {
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
  };
}

export interface ApiError {
  success: false;
  message: string;
  error: string;
  timestamp: string;
  path: string;
}

// Create Axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add JWT token to requests
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors globally
apiClient.interceptors.response.use(
  (response) => response.data,
  (error: AxiosError<ApiError>) => {
    if (error.response) {
      // Server responded with error
      const apiError = error.response.data;
      
      // Handle unauthorized - redirect to login
      if (error.response.status === 401) {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_data');
        window.location.href = '/login';
      }
      
      return Promise.reject(apiError);
    } else if (error.request) {
      // Request made but no response
      return Promise.reject({
        success: false,
        message: 'Network error. Please check your connection.',
        error: 'NETWORK_ERROR',
      });
    } else {
      // Something else happened
      return Promise.reject({
        success: false,
        message: 'An unexpected error occurred.',
        error: 'UNKNOWN_ERROR',
      });
    }
  }
);

// ============================================================================
// API Methods
// ============================================================================

export const api = {
  // ------------------------------------------------------------------------
  // Authentication
  // ------------------------------------------------------------------------
  
  async register(data: {
    email: string;
    password: string;
    name: string;
    role: string;
    department?: string;
  }): Promise<ApiResponse<any>> {
    if (USE_MOCK_DATA) {
      return mockRegister(data);
    }
    return apiClient.post('/auth/register', data);
  },

  async login(data: {
    email: string;
    password: string;
    role: string;
  }): Promise<ApiResponse<any>> {
    if (USE_MOCK_DATA) {
      return mockLogin(data);
    }
    return apiClient.post('/auth/login', data);
  },

  async logout(): Promise<ApiResponse<void>> {
    if (USE_MOCK_DATA) {
      return mockLogout();
    }
    return apiClient.post('/auth/logout');
  },

  async getCurrentUser(): Promise<ApiResponse<any>> {
    if (USE_MOCK_DATA) {
      return mockGetCurrentUser();
    }
    return apiClient.get('/auth/me');
  },

  // ------------------------------------------------------------------------
  // Clubs
  // ------------------------------------------------------------------------

  async getAllClubs(params?: {
    category?: string;
    isActive?: boolean;
    page?: number;
    size?: number;
  }): Promise<ApiResponse<any[]>> {
    if (USE_MOCK_DATA) {
      return mockGetAllClubs(params);
    }
    return apiClient.get('/clubs', { params });
  },

  async getClubById(clubId: string): Promise<ApiResponse<any>> {
    if (USE_MOCK_DATA) {
      return mockGetClubById(clubId);
    }
    return apiClient.get(`/clubs/${clubId}`);
  },

  async createClub(data: any): Promise<ApiResponse<any>> {
    if (USE_MOCK_DATA) {
      return mockCreateClub(data);
    }
    return apiClient.post('/clubs', data);
  },

  async updateClub(clubId: string, data: any): Promise<ApiResponse<any>> {
    if (USE_MOCK_DATA) {
      return mockUpdateClub(clubId, data);
    }
    return apiClient.put(`/clubs/${clubId}`, data);
  },

  async deleteClub(clubId: string): Promise<ApiResponse<void>> {
    if (USE_MOCK_DATA) {
      return { success: true, message: 'Club deleted (mock)' };
    }
    return apiClient.delete(`/clubs/${clubId}`);
  },

  // ------------------------------------------------------------------------
  // Events
  // ------------------------------------------------------------------------

  async getAllEvents(params?: {
    clubId?: string;
    type?: string;
    upcoming?: boolean;
    startDate?: string;
    endDate?: string;
    page?: number;
    size?: number;
  }): Promise<ApiResponse<any[]>> {
    if (USE_MOCK_DATA) {
      return mockGetAllEvents(params);
    }
    return apiClient.get('/events', { params });
  },

  async getEventById(eventId: string): Promise<ApiResponse<any>> {
    if (USE_MOCK_DATA) {
      return mockGetEventById(eventId);
    }
    return apiClient.get(`/events/${eventId}`);
  },

  async getMyRegistrations(): Promise<ApiResponse<any[]>> {
    if (USE_MOCK_DATA) {
      return mockGetMyRegistrations();
    }
    return apiClient.get('/events/my-registrations');
  },

  async createEvent(data: any): Promise<ApiResponse<any>> {
    if (USE_MOCK_DATA) {
      return mockCreateEvent(data);
    }
    return apiClient.post('/events', data);
  },

  async updateEvent(eventId: string, data: any): Promise<ApiResponse<any>> {
    if (USE_MOCK_DATA) {
      return { success: true, message: 'Event updated (mock)' };
    }
    return apiClient.put(`/events/${eventId}`, data);
  },

  async deleteEvent(eventId: string): Promise<ApiResponse<void>> {
    if (USE_MOCK_DATA) {
      return { success: true, message: 'Event deleted (mock)' };
    }
    return apiClient.delete(`/events/${eventId}`);
  },

  // ------------------------------------------------------------------------
  // Event Registrations
  // ------------------------------------------------------------------------

  async registerForEvent(
    eventId: string,
    resumeFile?: File
  ): Promise<ApiResponse<any>> {
    if (USE_MOCK_DATA) {
      return mockRegisterForEvent(eventId, resumeFile);
    }

    if (resumeFile) {
      const formData = new FormData();
      formData.append('resumeFile', resumeFile);
      return apiClient.post(`/events/${eventId}/register`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    } else {
      return apiClient.post(`/events/${eventId}/register`, {});
    }
  },

  async cancelRegistration(eventId: string): Promise<ApiResponse<void>> {
    if (USE_MOCK_DATA) {
      return { success: true, message: 'Registration cancelled (mock)' };
    }
    return apiClient.delete(`/events/${eventId}/register`);
  },

  async getEventRegistrations(
    eventId: string,
    params?: {
      status?: string;
      page?: number;
      size?: number;
    }
  ): Promise<ApiResponse<any[]>> {
    if (USE_MOCK_DATA) {
      return mockGetEventRegistrations(eventId, params);
    }
    return apiClient.get(`/events/${eventId}/registrations`, { params });
  },

  async updateRegistrationStatus(
    eventId: string,
    registrationId: string,
    status: 'APPROVED' | 'REJECTED'
  ): Promise<ApiResponse<any>> {
    if (USE_MOCK_DATA) {
      return { success: true, message: `Registration ${status} (mock)` };
    }
    return apiClient.put(`/events/${eventId}/registrations/${registrationId}`, {
      status,
    });
  },

  // ------------------------------------------------------------------------
  // Club Memberships
  // ------------------------------------------------------------------------

  async joinClub(clubId: string): Promise<ApiResponse<any>> {
    if (USE_MOCK_DATA) {
      return { success: true, message: 'Joined club (mock)' };
    }
    return apiClient.post(`/clubs/${clubId}/join`);
  },

  async leaveClub(clubId: string): Promise<ApiResponse<void>> {
    if (USE_MOCK_DATA) {
      return { success: true, message: 'Left club (mock)' };
    }
    return apiClient.delete(`/clubs/${clubId}/leave`);
  },

  async getClubMembers(
    clubId: string,
    params?: {
      role?: string;
      page?: number;
      size?: number;
    }
  ): Promise<ApiResponse<any[]>> {
    if (USE_MOCK_DATA) {
      return { success: true, data: [] };
    }
    return apiClient.get(`/clubs/${clubId}/members`, { params });
  },

  // ------------------------------------------------------------------------
  // Venues and Schedule (New)
  // ------------------------------------------------------------------------

  async getSchedule(type: string, query: string): Promise<ApiResponse<any[]>> {
    if (USE_MOCK_DATA) {
      return mockGetSchedule(type, query);
    }
    return apiClient.get('/schedule', { params: { type, query } });
  },

  async getVenues(params?: {
    type?: string;
    capacity?: number;
    available?: boolean;
  }): Promise<ApiResponse<any[]>> {
    if (USE_MOCK_DATA) {
      return mockGetVenues(params);
    }
    return apiClient.get('/venues', { params });
  },

  async bookVenue(data: any): Promise<ApiResponse<any>> {
     if (USE_MOCK_DATA) {
      return { success: true, message: 'Venue booked successfully (mock)' };
     }
     return apiClient.post('/venues/book', data);
  },

  // ------------------------------------------------------------------------
  // File Uploads
  // ------------------------------------------------------------------------

  async uploadResume(file: File): Promise<ApiResponse<any>> {
    if (USE_MOCK_DATA) {
      return {
        success: true,
        message: 'Resume uploaded (mock)',
        data: {
          fileUrl: 'https://mock-storage.com/resume.pdf',
          fileName: file.name,
          fileSize: file.size,
          uploadedAt: new Date().toISOString(),
        },
      };
    }

    const formData = new FormData();
    formData.append('file', file);
    return apiClient.post('/files/upload/resume', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  async uploadClubLogo(file: File): Promise<ApiResponse<any>> {
    if (USE_MOCK_DATA) {
      return {
        success: true,
        message: 'Logo uploaded (mock)',
        data: {
          fileUrl: URL.createObjectURL(file),
          fileName: file.name,
          fileSize: file.size,
          uploadedAt: new Date().toISOString(),
        },
      };
    }

    const formData = new FormData();
    formData.append('file', file);
    return apiClient.post('/files/upload/club-logo', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // ------------------------------------------------------------------------
  // Dashboard
  // ------------------------------------------------------------------------

  async getStudentDashboard(): Promise<ApiResponse<any>> {
    if (USE_MOCK_DATA) {
      return mockGetStudentDashboard();
    }
    return apiClient.get('/dashboard/student');
  },

  async getFacultyDashboard(): Promise<ApiResponse<any>> {
    if (USE_MOCK_DATA) {
      return mockGetFacultyDashboard();
    }
    return apiClient.get('/dashboard/faculty');
  },

  async getAdminDashboard(): Promise<ApiResponse<any>> {
    if (USE_MOCK_DATA) {
      return mockGetAdminDashboard();
    }
    return apiClient.get('/dashboard/admin');
  },
};

// ============================================================================
// MOCK DATA RESPONSES (using unified mock data)
// ============================================================================

const mockRegister = async (data: any): Promise<ApiResponse<any>> => {
  await new Promise((resolve) => setTimeout(resolve, 500)); 
  return {
    success: true,
    message: 'Registration successful',
    data: {
      userId: 'mock-user-' + Date.now(),
      email: data.email,
      name: data.name,
      role: data.role,
      token: 'mock-jwt-token-' + Date.now(),
    },
  };
};

const mockLogin = async (data: any): Promise<ApiResponse<any>> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  
  // Try to find user in mock data
  const user = findUserByEmail(data.email);
  
  if (user) {
      const userData = {
        ...user,
        token: 'mock-jwt-token-' + Date.now()
      };
      localStorage.setItem('auth_token', userData.token);
      localStorage.setItem('user_data', JSON.stringify(userData));
      return {
        success: true,
        message: 'Login successful',
        data: userData,
      };
  }

  // Fallback for demo if user not in mock list
  const userData = {
    id: 'mock-user-123',
    email: data.email,
    name: 'Test User',
    role: data.role,
    department: 'Computer Science',
    token: 'mock-jwt-token-' + Date.now(),
  };

  localStorage.setItem('auth_token', userData.token);
  localStorage.setItem('user_data', JSON.stringify(userData));

  return {
    success: true,
    message: 'Login successful',
    data: userData,
  };
};

const mockLogout = async (): Promise<ApiResponse<void>> => {
  localStorage.removeItem('auth_token');
  localStorage.removeItem('user_data');
  return {
    success: true,
    message: 'Logout successful',
  };
};

const mockGetCurrentUser = async (): Promise<ApiResponse<any>> => {
  const userData = localStorage.getItem('user_data');
  if (!userData) {
    throw {
      success: false,
      message: 'Not authenticated',
      error: 'UNAUTHORIZED',
    };
  }
  return {
    success: true,
    data: JSON.parse(userData),
  };
};

const mockGetAllClubs = async (params?: any): Promise<ApiResponse<any[]>> => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  
  let filteredClubs = [...MOCK_CLUBS];
  if (params?.category) {
    filteredClubs = filteredClubs.filter((c) => c.category === params.category);
  }

  return {
    success: true,
    data: filteredClubs,
    pagination: {
      page: params?.page || 0,
      size: params?.size || 20,
      totalElements: filteredClubs.length,
      totalPages: 1,
    },
  };
};

const mockGetClubById = async (clubId: string): Promise<ApiResponse<any>> => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  const club = findClubById(clubId);
  
  if (!club) {
    throw {
      success: false,
      message: 'Club not found',
      error: 'NOT_FOUND',
    };
  }

  // Add upcoming events to detail view
  const upcomingEvents = getEventsByClub(clubId);

  return {
    success: true,
    data: {
      ...club,
      upcomingEvents: upcomingEvents
    },
  };
};

const mockCreateClub = async (data: any): Promise<ApiResponse<any>> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  const newClub = {
      id: 'mock-club-' + Date.now(),
      ...data,
      totalMembers: 0,
      achievements: 0,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
  };
  MOCK_CLUBS.push(newClub);
  return {
    success: true,
    message: 'Club created successfully',
    data: newClub,
  };
};

const mockUpdateClub = async (clubId: string, data: any): Promise<ApiResponse<any>> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return {
    success: true,
    message: 'Club updated successfully',
    data: {
      id: clubId,
      ...data,
      updatedAt: new Date().toISOString(),
    },
  };
};

const mockGetAllEvents = async (params?: any): Promise<ApiResponse<any[]>> => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  
  let filteredEvents = [...MOCK_EVENTS];
  if (params?.clubId) {
    filteredEvents = filteredEvents.filter((e) => e.clubId === params.clubId);
  }
  if (params?.type) {
    filteredEvents = filteredEvents.filter((e) => e.type === params.type);
  }

  return {
    success: true,
    data: filteredEvents,
    pagination: {
      page: params?.page || 0,
      size: params?.size || 20,
      totalElements: filteredEvents.length,
      totalPages: 1,
    },
  };
};

const mockGetEventById = async (eventId: string): Promise<ApiResponse<any>> => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  const event = findEventById(eventId);
  
  if (!event) {
    throw {
      success: false,
      message: 'Event not found',
      error: 'NOT_FOUND',
    };
  }

  return {
    success: true,
    data: event,
  };
};

const mockGetMyRegistrations = async (): Promise<ApiResponse<any[]>> => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  // Assume current user is the first student for mock purposes if no ID found
  // In real app, we get ID from token/session
  const registrations = MOCK_REGISTRATIONS;
  
  return {
    success: true,
    data: registrations,
  };
};

const mockCreateEvent = async (data: any): Promise<ApiResponse<any>> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  const newEvent = {
      id: 'mock-event-' + Date.now(),
      ...data,
      registeredCount: 0,
      isActive: true,
      createdAt: new Date().toISOString(),
  };
  MOCK_EVENTS.push(newEvent);
  return {
    success: true,
    message: 'Event created successfully',
    data: newEvent
  };
};

const mockRegisterForEvent = async (
  eventId: string,
  resumeFile?: File
): Promise<ApiResponse<any>> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  
  const requiresApproval = !!resumeFile;
  const newReg = {
      registrationId: 'mock-reg-' + Date.now(),
      eventId,
      userId: 'user-student', // Mock user
      status: requiresApproval ? 'PENDING' : 'APPROVED',
      resumeUrl: resumeFile ? 'https://mock-storage.com/resume.pdf' : null,
      registeredAt: new Date().toISOString(),
  };
  // MOCK_REGISTRATIONS.push(newReg as any);
  
  return {
    success: true,
    message: requiresApproval
      ? 'Registration submitted! You will receive an email after faculty approval.'
      : 'Registration successful! Check your email for confirmation.',
    data: newReg,
  };
};

const mockGetEventRegistrations = async (
  eventId: string,
  params?: any
): Promise<ApiResponse<any[]>> => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  const regs = getRegistrationsByEvent(eventId);
  return {
    success: true,
    data: regs,
    pagination: {
      page: params?.page || 0,
      size: params?.size || 50,
      totalElements: regs.length,
      totalPages: 1,
    },
  };
};

const mockGetSchedule = async (type: string, query: string): Promise<ApiResponse<any[]>> => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  const data = MOCK_SCHEDULE_DATA[type] || [];
  // Simple filter
  const filtered = data.filter((item: any) => 
     !query || item.id.toLowerCase().includes(query.toLowerCase()) || 
     item.details.toLowerCase().includes(query.toLowerCase())
  );
  return {
    success: true,
    data: filtered
  };
};

const mockGetVenues = async (params?: any): Promise<ApiResponse<any[]>> => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  let venues = [...MOCK_VENUES];
  if (params?.type) {
     // If type is 'classroom', we might want multiple types like 'Lecture Hall', 'Lab'
     if (params.type === 'classroom') {
         venues = venues.filter(v => ['Lecture Hall', 'Lab'].includes(v.type));
     } else if (params.type === 'event') {
         venues = venues.filter(v => ['Auditorium', 'Seminar Hall'].includes(v.type));
     }
  }
  if (params?.capacity) {
      venues = venues.filter(v => v.capacity >= params.capacity);
  }
  return {
      success: true,
      data: venues
  };
};

const mockGetStudentDashboard = async (): Promise<ApiResponse<any>> => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return {
    success: true,
    data: {
      registeredEvents: MOCK_REGISTRATIONS.length,
      upcomingEvents: MOCK_EVENTS.length,
      clubMemberships: 3,
      recentRegistrations: MOCK_REGISTRATIONS.slice(0, 5),
      recommendedEvents: MOCK_EVENTS.slice(0, 3),
    },
  };
};

const mockGetFacultyDashboard = async (): Promise<ApiResponse<any>> => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return {
    success: true,
    data: {
      managedClubs: MOCK_CLUBS.filter(c => c.facultyAdvisor?.id === 'user-faculty'),
      totalEvents: 15,
      totalRegistrations: 450,
      pendingApprovals: 23,
      recentRegistrations: MOCK_REGISTRATIONS.slice(0, 5),
    },
  };
};

const mockGetAdminDashboard = async (): Promise<ApiResponse<any>> => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return {
    success: true,
    data: {
      totalClubs: MOCK_CLUBS.length,
      activeClubs: MOCK_CLUBS.filter(c => c.isActive).length,
      totalEvents: MOCK_EVENTS.length,
      upcomingEvents: MOCK_EVENTS.length,
      totalStudents: 3500,
      totalRegistrations: 8900,
      clubsByCategory: {
        Tech: 8,
        Cultural: 6,
        Sports: 5,
        Literature: 3,
        Social: 3,
      },
      recentActivity: [],
    },
  };
};

export default api;
