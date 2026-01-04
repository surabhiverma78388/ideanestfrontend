import { User } from '../App';

// ============================================================================
// TYPES (Mirroring Database Types)
// ============================================================================

export interface MockClub {
  id: string;
  name: string;
  category: 'Tech' | 'Cultural' | 'Sports' | 'Literature' | 'Social';
  description: string;
  about: string;
  logo: string;
  founded: string;
  totalMembers: number;
  achievements: number;
  isActive: boolean;
  president?: { id: string; name: string; email: string };
  vicePresident?: { id: string; name: string; email: string };
  facultyAdvisor?: { id: string; name: string; email: string; department: string };
  createdAt: string;
  updatedAt: string;
}

export interface MockEvent {
  id: string;
  clubId: string;
  clubName: string;
  clubLogo: string;
  clubCategory: string;
  title: string;
  description: string;
  type: 'Workshop' | 'Hackathon' | 'Conference' | 'Competition' | 'Event' | 'Seminar';
  date: string;
  time: string;
  venue: string;
  capacity: number;
  registeredCount: number;
  requiresResume: boolean;
  isActive: boolean;
  createdAt: string;
}

export interface MockRegistration {
  registrationId: string;
  eventId: string;
  userId: string;
  user?: {
    id: string;
    name: string;
    email: string;
    department?: string;
  };
  event?: any; // Populated event data
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  resumeUrl?: string | null;
  registeredAt: string;
}

export interface MockVenue {
  id: string;
  name: string;
  capacity: number;
  type: 'Lecture Hall' | 'Lab' | 'Auditorium' | 'Seminar Hall';
  available: boolean;
  amenities?: string[];
}

export interface MockSchedule {
  type: 'teacher' | 'classroom' | 'batch';
  id: string; // teacher name, classroom name, or batch name
  scheduledLocation: string;
  currentLocation: string;
  details: string; // Subject or Faculty name
  lastUpdated: string;
}

// ============================================================================
// MOCK DATA STORE
// ============================================================================

export const MOCK_USERS: User[] = [
  {
    id: 'user-student',
    name: 'Alex Student',
    email: 'alex@college.edu',
    role: 'student',
    department: 'Computer Science'
  },
  {
    id: 'user-faculty',
    name: 'Dr. Sarah Johnson',
    email: 'sarah@college.edu',
    role: 'faculty',
    clubId: 'acm',
    department: 'Computer Science'
  },
  {
    id: 'user-admin',
    name: 'Admin User',
    email: 'admin@college.edu',
    role: 'admin'
  },
  {
    id: 'user-office',
    name: 'Office Staff',
    email: 'office@college.edu',
    role: 'office'
  }
];

export const MOCK_CLUBS: MockClub[] = [
  {
    id: 'acm',
    name: 'ACM Chapter',
    category: 'Tech',
    description: 'Association for Computing Machinery',
    about: 'Leading tech community fostering innovation and collaboration among computer science enthusiasts.',
    logo: '💻',
    founded: '2015',
    totalMembers: 120,
    achievements: 15,
    isActive: true,
    president: { id: '1', name: 'Alice Johnson', email: 'alice@college.edu' },
    vicePresident: { id: '2', name: 'Bob Smith', email: 'bob@college.edu' },
    facultyAdvisor: {
      id: 'user-faculty',
      name: 'Dr. Sarah Johnson',
      email: 'sarah@college.edu',
      department: 'Computer Science',
    },
    createdAt: '2015-01-01T00:00:00Z',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'gdsc',
    name: 'Google DSC',
    category: 'Tech',
    description: 'Google Developer Student Clubs',
    about: 'Connecting students with Google technologies and building solutions for local communities.',
    logo: '🔷',
    founded: '2019',
    totalMembers: 150,
    achievements: 20,
    isActive: true,
    president: { id: '4', name: 'Carol White', email: 'carol@college.edu' },
    vicePresident: { id: '5', name: 'David Lee', email: 'david@college.edu' },
    facultyAdvisor: {
      id: '6',
      name: 'Prof. Michael Chen',
      email: 'michael@college.edu',
      department: 'Computer Science',
    },
    createdAt: '2019-01-01T00:00:00Z',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'dramatics',
    name: 'Dramatics Society',
    category: 'Cultural',
    description: 'Theater and performing arts',
    about: 'Bringing stories to life through theater, dance, and performance art.',
    logo: '🎭',
    founded: '2010',
    totalMembers: 85,
    achievements: 12,
    isActive: true,
    createdAt: '2010-01-01T00:00:00Z',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'ieee',
    name: 'IEEE Student Branch',
    category: 'Tech',
    description: 'Institute of Electrical and Electronics Engineers',
    about: 'Advancing technology for humanity through electrical and electronics engineering.',
    logo: '⚡',
    founded: '2012',
    totalMembers: 95,
    achievements: 18,
    isActive: true,
    createdAt: '2012-01-01T00:00:00Z',
    updatedAt: new Date().toISOString()
  },
];

export const MOCK_EVENTS: MockEvent[] = [
  {
    id: 'event-1',
    clubId: 'acm',
    clubName: 'ACM Chapter',
    clubLogo: '💻',
    clubCategory: 'Tech',
    title: 'Web Development Workshop',
    description: 'Learn modern web development with React and Node.js',
    type: 'Workshop',
    date: '2025-11-15',
    time: '10:00 AM - 4:00 PM',
    venue: 'Navmandir Auditorium',
    capacity: 250,
    registeredCount: 180,
    requiresResume: false,
    isActive: true,
    createdAt: '2025-10-01T00:00:00Z'
  },
  {
    id: 'event-2',
    clubId: 'gdsc',
    clubName: 'Google DSC',
    clubLogo: '🔷',
    clubCategory: 'Tech',
    title: 'Cloud Study Jam',
    description: 'Hands-on training with Google Cloud Platform',
    type: 'Workshop',
    date: '2025-12-01',
    time: '2:00 PM - 6:00 PM',
    venue: 'Computer Lab 3',
    capacity: 50,
    registeredCount: 35,
    requiresResume: false,
    isActive: true,
    createdAt: '2025-10-05T00:00:00Z'
  },
  {
    id: 'event-3',
    clubId: 'acm',
    clubName: 'ACM Chapter',
    clubLogo: '💻',
    clubCategory: 'Tech',
    title: 'HackNova 2025',
    description: '24-hour hackathon with amazing prizes',
    type: 'Hackathon',
    date: '2025-12-15',
    time: '9:00 AM (24 hours)',
    venue: 'Innovation Center',
    capacity: 100,
    registeredCount: 85,
    requiresResume: true,
    isActive: true,
    createdAt: '2025-10-10T00:00:00Z'
  },
];

export const MOCK_REGISTRATIONS: MockRegistration[] = [
  {
    registrationId: 'reg-1',
    eventId: 'event-1',
    userId: 'user-student',
    status: 'APPROVED',
    registeredAt: '2025-01-10T14:30:00Z',
    event: MOCK_EVENTS[0]
  }
];

export const MOCK_VENUES: MockVenue[] = [
  // Classrooms
  { id: 'CMS-101', name: 'CMS-101', capacity: 40, type: 'Lecture Hall', available: true },
  { id: 'CMS-102', name: 'CMS-102', capacity: 50, type: 'Lecture Hall', available: true },
  { id: 'CMS-201', name: 'CMS-201', capacity: 45, type: 'Lecture Hall', available: false },
  { id: 'CMS-202', name: 'CMS-202', capacity: 60, type: 'Lecture Hall', available: true },
  { id: 'LAB-301', name: 'Computer Lab 301', capacity: 30, type: 'Lab', available: true },
  // Event Venues
  { id: 'AUD-01', name: 'Navmandir Auditorium', capacity: 300, type: 'Auditorium', available: true },
  { id: 'AUD-02', name: 'Main Auditorium', capacity: 500, type: 'Auditorium', available: false },
  { id: 'SEM-01', name: 'Seminar Hall 1', capacity: 100, type: 'Seminar Hall', available: true },
  { id: 'SEM-02', name: 'Seminar Hall 2', capacity: 80, type: 'Seminar Hall', available: true }
];

export const MOCK_SCHEDULE_DATA: Record<string, any> = {
  teacher: [
    {
      id: 'Dr. Sarah Johnson',
      scheduledLocation: 'CMS-202',
      currentLocation: 'CMS-201',
      details: 'Dr. Sarah Johnson',
      lastUpdated: 'Just now'
    },
    {
      id: 'Prof. Michael Brown',
      scheduledLocation: 'LAB-301',
      currentLocation: 'LAB-301',
      details: 'Prof. Michael Brown',
      lastUpdated: '2 mins ago'
    }
  ],
  classroom: [
    {
      id: 'CMS-202',
      scheduledLocation: 'CMS-202',
      currentLocation: 'CMS-202',
      details: 'Data Structures (Dr. Smith)',
      lastUpdated: 'Just now'
    },
    {
      id: 'LAB-301',
      scheduledLocation: 'LAB-301',
      currentLocation: 'LAB-301',
      details: 'Database Lab (Prof. Brown)',
      lastUpdated: '5 mins ago'
    }
  ],
  batch: [
    {
      id: 'B.Tech CS 3rd Year',
      scheduledLocation: 'CMS-202',
      currentLocation: 'CMS-202',
      details: 'Data Structures',
      lastUpdated: 'Just now'
    }
  ]
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

// Simulate DB find
export const findUserByEmail = (email: string) => MOCK_USERS.find(u => u.email === email);
export const findClubById = (id: string) => MOCK_CLUBS.find(c => c.id === id);
export const findEventById = (id: string) => MOCK_EVENTS.find(e => e.id === id);
export const getEventsByClub = (clubId: string) => MOCK_EVENTS.filter(e => e.clubId === clubId);
export const getRegistrationsByUser = (userId: string) => MOCK_REGISTRATIONS.filter(r => r.userId === userId);
export const getRegistrationsByEvent = (eventId: string) => MOCK_REGISTRATIONS.filter(r => r.eventId === eventId);
