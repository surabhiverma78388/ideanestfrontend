// Club and Event Service - handles all club/event related API calls
import { Database, EventWithClub, ClubWithLeaders, EventWithRegistration } from '../types/database';
import { api } from './api';

type Club = Database['public']['Tables']['clubs']['Row'];
type Event = Database['public']['Tables']['events']['Row'];
type EventRegistration = Database['public']['Tables']['event_registrations']['Row'];

/**
 * Get all clubs by category
 */
export const getClubsByCategory = async (category?: string): Promise<any[]> => {
  try {
    const response = await api.getAllClubs({ category, isActive: true });
    return response.data || [];
  } catch (error) {
    console.error('Error fetching clubs:', error);
    return [];
  }
};

/**
 * Get club by ID with leader details
 */
export const getClubById = async (clubId: string): Promise<any | null> => {
  try {
    const response = await api.getClubById(clubId);
    return response.data || null;
  } catch (error) {
    console.error('Error fetching club:', error);
    return null;
  }
};

/**
 * Get all events with club information
 */
export const getAllEvents = async (): Promise<any[]> => {
  try {
    const response = await api.getAllEvents({ upcoming: true });
    return response.data || [];
  } catch (error) {
    console.error('Error fetching events:', error);
    return [];
  }
};

/**
 * Get events for a specific club
 */
export const getEventsByClubId = async (clubId: string): Promise<any[]> => {
  try {
    const response = await api.getAllEvents({ clubId });
    return response.data || [];
  } catch (error) {
    console.error('Error fetching events:', error);
    return [];
  }
};

/**
 * Get events with user registration status
 */
export const getEventsWithRegistration = async (userId: string): Promise<any[]> => {
  try {
    const response = await api.getMyRegistrations();
    return response.data || [];
  } catch (error) {
    console.error('Error fetching events with registration:', error);
    return [];
  }
};

/**
 * Register user for an event
 */
export const registerForEvent = async (
  eventId: string,
  userId: string,
  resumeFile?: File
): Promise<{ success: boolean; message: string; requiresApproval?: boolean }> => {
  try {
    const response = await api.registerForEvent(eventId, resumeFile);
    
    return {
      success: response.success,
      message: response.message || 'Registration successful!',
      requiresApproval: response.data?.status === 'PENDING'
    };
  } catch (error: any) {
    console.error('Error registering for event:', error);
    return {
      success: false,
      message: error.message || 'Registration failed. Please try again.'
    };
  }
};

/**
 * Get user's registrations
 */
export const getUserRegistrations = async (userId: string): Promise<any[]> => {
  try {
    const response = await api.getMyRegistrations();
    return response.data || [];
  } catch (error) {
    console.error('Error fetching user registrations:', error);
    return [];
  }
};

/**
 * Create a new event (faculty/admin only)
 */
export const createEvent = async (
  eventData: any
): Promise<{ success: boolean; message: string; eventId?: string }> => {
  try {
    const response = await api.createEvent(eventData);
    
    return {
      success: response.success,
      message: response.message || 'Event created successfully!',
      eventId: response.data?.id
    };
  } catch (error: any) {
    console.error('Error creating event:', error);
    return {
      success: false,
      message: error.message || 'Failed to create event. Please try again.'
    };
  }
};

/**
 * Subscribe to real-time updates for events
 * Note: Real-time updates would require WebSocket implementation in Spring Boot
 */
export const subscribeToEvents = (callback: (payload: any) => void) => {
  // This would be implemented with WebSocket when backend supports it
  console.log('Real-time subscriptions not yet implemented');
  return () => {};
};