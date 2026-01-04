import { UserRole, User } from '../App';

/**
 * Permission Hierarchy for InfoNest Platform
 * 
 * Admin → Can do everything (Admin + Faculty + Student work)
 * Faculty → Can do Faculty + Student work
 * Student → Can only do Student work
 * Office → Special permissions for venue/schedule management
 */

export const ROLE_HIERARCHY: Record<UserRole, number> = {
  'admin': 3,
  'faculty': 2,
  'student': 1,
  'office': 2, // Office has same level as faculty but different permissions
  null: 0
};

/**
 * Check if a user has permission for a specific role level
 * @param user - Current user object
 * @param requiredRole - Minimum role required
 * @returns boolean - true if user has permission
 */
export function hasPermission(user: User | null, requiredRole: UserRole): boolean {
  if (!user || !user.role) return false;
  
  const userLevel = ROLE_HIERARCHY[user.role];
  const requiredLevel = ROLE_HIERARCHY[requiredRole];
  
  return userLevel >= requiredLevel;
}

/**
 * Check if user can manage a specific club
 * @param user - Current user object
 * @param clubId - ID of the club to check
 * @returns boolean - true if user can manage the club
 */
export function canManageClub(user: User | null, clubId: string): boolean {
  if (!user) return false;
  
  // Admin can manage all clubs
  if (user.role === 'admin') return true;
  
  // Faculty can manage their assigned club
  if (user.role === 'faculty' && user.clubId === clubId) return true;
  
  return false;
}

/**
 * Check if user can view a feature
 * Features available to all roles inherit down the hierarchy
 */
export function canViewClubs(user: User | null): boolean {
  return user !== null; // All logged-in users can view clubs
}

export function canRegisterForEvents(user: User | null): boolean {
  return user !== null; // All logged-in users can register for events
}

export function canCreateEvents(user: User | null, clubId?: string): boolean {
  if (!user) return false;
  
  // Admin can create events for any club
  if (user.role === 'admin') return true;
  
  // Faculty can create events for their assigned club
  if (user.role === 'faculty' && clubId && user.clubId === clubId) return true;
  
  return false;
}

export function canManageEvents(user: User | null, clubId?: string): boolean {
  return canCreateEvents(user, clubId);
}

export function canViewApplications(user: User | null, clubId?: string): boolean {
  if (!user) return false;
  
  // Admin can view all applications
  if (user.role === 'admin') return true;
  
  // Faculty can view applications for their club
  if (user.role === 'faculty' && clubId && user.clubId === clubId) return true;
  
  return false;
}

export function canManageVenues(user: User | null): boolean {
  if (!user) return false;
  
  // Admin and Office can manage venues
  return user.role === 'admin' || user.role === 'office';
}

export function canViewSchedule(user: User | null): boolean {
  return user !== null; // All logged-in users can view schedule
}

export function canUpdateSchedule(user: User | null): boolean {
  if (!user) return false;
  
  // Admin, Faculty, and Office can update schedule
  return user.role === 'admin' || user.role === 'faculty' || user.role === 'office';
}

/**
 * Get appropriate dashboard for user role
 */
export function getDefaultDashboard(user: User | null): string {
  if (!user) return 'clubs-landing';
  
  switch (user.role) {
    case 'admin':
      return 'admin-dashboard';
    case 'faculty':
      return 'faculty-dashboard';
    case 'office':
      return 'venue-booking';
    case 'student':
    default:
      return 'clubs-landing';
  }
}

/**
 * Get available features for a user role
 */
export function getAvailableFeatures(user: User | null): string[] {
  if (!user) return [];
  
  const features: string[] = [];
  
  // Student features (available to all)
  if (hasPermission(user, 'student')) {
    features.push(
      'view-clubs',
      'register-events',
      'view-schedule',
      'view-venues'
    );
  }
  
  // Faculty features (available to faculty and admin)
  if (hasPermission(user, 'faculty')) {
    features.push(
      'manage-events',
      'review-applications',
      'update-schedule'
    );
  }
  
  // Admin features (only admin)
  if (user.role === 'admin') {
    features.push(
      'manage-all-clubs',
      'manage-users',
      'system-settings',
      'manage-venues'
    );
  }
  
  // Office features
  if (user.role === 'office') {
    features.push(
      'manage-venues',
      'update-schedule'
    );
  }
  
  return features;
}

/**
 * Check if user can access a specific dashboard
 */
export function canAccessDashboard(user: User | null, dashboard: string): boolean {
  if (!user) return false;
  
  switch (dashboard) {
    case 'admin-dashboard':
      return user.role === 'admin';
    
    case 'faculty-dashboard':
      // Admin can access faculty dashboard (hierarchy)
      return user.role === 'admin' || user.role === 'faculty';
    
    case 'student-dashboard':
    case 'clubs-landing':
      // All logged-in users can access student features
      return true;
    
    case 'venue-booking':
      return user.role === 'admin' || user.role === 'office' || user.role === 'faculty';
    
    case 'schedule':
      return true;
    
    default:
      return true;
  }
}

/**
 * Get user-friendly permission description
 */
export function getPermissionDescription(role: UserRole): string {
  switch (role) {
    case 'admin':
      return 'Full system access - Can manage all clubs, events, users, and settings';
    case 'faculty':
      return 'Club management access - Can manage assigned club events and review applications';
    case 'student':
      return 'Standard access - Can view and register for events';
    case 'office':
      return 'Administrative access - Can manage venues and schedules';
    default:
      return 'No permissions';
  }
}
