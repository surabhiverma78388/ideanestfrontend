import { motion } from 'motion/react';
import { ArrowLeft, Users, Calendar, MapPin, Clock, Award, Edit, Plus, Trash2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { User } from '../../App';
import { useState } from 'react';
import { toast } from 'sonner@2.0.3';
import { canManageClub, canRegisterForEvents } from '../../utils/permissions';

interface Event {
  id: string;
  title: string;
  type: string;
  date: string;
  time: string;
  venue: string;
  capacity: number;
  registered: number;
  description: string;
  requiresResume: boolean;
}

interface ClubData {
  id: string;
  name: string;
  category: string;
  description: string;
  members: number;
  founded: string;
  logo: string;
  achievements: number;
  about: string;
  president: string;
  vicePresident: string;
  faculty: string;
}

interface IndividualClubViewProps {
  clubId: string;
  category: string;
  onNavigate: (page: string, params?: any) => void;
  user: User | null;
  onLogout: () => void;
}

const clubsData: Record<string, ClubData> = {
  'acm': {
    id: 'acm',
    name: 'ACM Chapter',
    category: 'Tech',
    description: 'Association for Computing Machinery - Leading tech community',
    members: 120,
    founded: '2015',
    logo: '💻',
    achievements: 15,
    about: 'The ACM Student Chapter is dedicated to advancing computing as a science and profession. We organize workshops, hackathons, and technical talks to help students stay updated with the latest technology trends.',
    president: 'Rahul Sharma',
    vicePresident: 'Priya Patel',
    faculty: 'Dr. Anil Kumar'
  },
  'ieee': {
    id: 'ieee',
    name: 'IEEE Student Branch',
    category: 'Tech',
    description: 'Institute of Electrical and Electronics Engineers',
    members: 95,
    founded: '2016',
    logo: '⚡',
    achievements: 12,
    about: 'IEEE Student Branch focuses on electrical engineering, electronics, and computer science. We conduct technical workshops, seminars, and industry interactions.',
    president: 'Amit Verma',
    vicePresident: 'Sneha Reddy',
    faculty: 'Dr. Rajesh Iyer'
  },
  'gdsc': {
    id: 'gdsc',
    name: 'Google DSC',
    category: 'Tech',
    description: 'Google Developer Student Clubs',
    members: 150,
    founded: '2019',
    logo: '🔷',
    achievements: 20,
    about: 'Google Developer Student Clubs help students learn about Google technologies and build solutions for local problems. We organize study jams, workshops, and solution challenges.',
    president: 'Arjun Mehta',
    vicePresident: 'Kavya Nair',
    faculty: 'Dr. Sunita Desai'
  }
};

const eventsData: Record<string, Event[]> = {
  'acm': [
    {
      id: 'acm-1',
      title: 'ACM Hackathon 2025',
      type: 'Hackathon',
      date: '2025-11-20',
      time: '9:00 AM - 9:00 PM',
      venue: 'Computer Lab A',
      capacity: 100,
      registered: 75,
      description: '24-hour hackathon focused on AI and ML projects',
      requiresResume: true
    },
    {
      id: 'acm-2',
      title: 'Web Development Workshop',
      type: 'Workshop',
      date: '2025-11-15',
      time: '2:00 PM - 5:00 PM',
      venue: 'Seminar Hall 2',
      capacity: 60,
      registered: 45,
      description: 'Learn modern web development with React and Node.js',
      requiresResume: false
    },
    {
      id: 'acm-3',
      title: 'Tech Talk: Cloud Computing',
      type: 'Seminar',
      date: '2025-11-25',
      time: '3:00 PM - 5:00 PM',
      venue: 'Auditorium',
      capacity: 200,
      registered: 150,
      description: 'Industry expert talk on cloud computing trends',
      requiresResume: false
    }
  ],
  'ieee': [
    {
      id: 'ieee-1',
      title: 'Embedded Systems Workshop',
      type: 'Workshop',
      date: '2025-11-18',
      time: '10:00 AM - 4:00 PM',
      venue: 'Electronics Lab',
      capacity: 50,
      registered: 40,
      description: 'Hands-on workshop on Arduino and Raspberry Pi',
      requiresResume: false
    },
    {
      id: 'ieee-2',
      title: 'IoT Innovation Challenge',
      type: 'Competition',
      date: '2025-11-28',
      time: '9:00 AM - 6:00 PM',
      venue: 'Innovation Center',
      capacity: 80,
      registered: 65,
      description: 'Build innovative IoT solutions',
      requiresResume: true
    }
  ],
  'gdsc': [
    {
      id: 'gdsc-1',
      title: 'Android Study Jam',
      type: 'Workshop',
      date: '2025-11-12',
      time: '10:00 AM - 5:00 PM',
      venue: 'Computer Lab B',
      capacity: 80,
      registered: 60,
      description: 'Learn Android app development with Kotlin',
      requiresResume: false
    },
    {
      id: 'gdsc-2',
      title: 'Solution Challenge Kickoff',
      type: 'Event',
      date: '2025-11-22',
      time: '4:00 PM - 6:00 PM',
      venue: 'Seminar Hall 1',
      capacity: 120,
      registered: 95,
      description: 'Launch of Google Solution Challenge 2025',
      requiresResume: false
    },
    {
      id: 'gdsc-3',
      title: 'Cloud Study Jam',
      type: 'Workshop',
      date: '2025-12-05',
      time: '10:00 AM - 5:00 PM',
      venue: 'Computer Lab C',
      capacity: 70,
      registered: 50,
      description: 'Google Cloud Platform fundamentals',
      requiresResume: false
    }
  ]
};

export default function IndividualClubView({ clubId, category, onNavigate, user, onLogout }: IndividualClubViewProps) {
  const club = clubsData[clubId];
  const events = eventsData[clubId] || [];
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  
  // Permission checks using hierarchy
  // Admin can manage all clubs, Faculty can manage their assigned club
  const isClubOfficial = canManageClub(user, clubId);
  
  // Everyone logged in can register (Admin inherits Faculty, Faculty inherits Student)
  const canRegister = canRegisterForEvents(user);

  const handleRegister = (eventId: string, requiresResume: boolean) => {
    if (!user) {
      toast.error('Please login to register for events', {
        action: {
          label: 'Login',
          onClick: () => onNavigate('club-login')
        }
      });
      return;
    }

    if (requiresResume) {
      toast.success('Registration submitted! You will receive an email after faculty approval.');
    } else {
      toast.success('Registration successful! Check your email for confirmation.');
    }
  };

  const handleCreateEvent = () => {
    setEditingEvent(null);
    setIsEventDialogOpen(true);
  };

  const handleEditEvent = (event: Event) => {
    setEditingEvent(event);
    setIsEventDialogOpen(true);
  };

  const handleDeleteEvent = (eventId: string) => {
    toast.success('Event deleted successfully');
  };

  const handleSaveEvent = () => {
    if (editingEvent) {
      toast.success('Event updated successfully');
    } else {
      toast.success('Event created successfully');
    }
    setIsEventDialogOpen(false);
  };

  if (!club) {
    return <div>Club not found</div>;
  }

  return (
    <div className="min-h-screen">
      {/* Navbar */}
      <motion.nav 
        className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={() => onNavigate('club-category', { category })}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to {category} Clubs
              </Button>
              <span className="text-slate-900">{club.name}</span>
            </div>
            
            <div className="flex items-center gap-4">
              {user ? (
                <>
                  <span className="text-slate-600">Welcome, {user.name}</span>
                  <Button variant="outline" size="sm" onClick={onLogout}>
                    Logout
                  </Button>
                </>
              ) : (
                <Button variant="outline" size="sm" onClick={() => onNavigate('club-login')}>
                  Login
                </Button>
              )}
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Club Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <Card className="border-2">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="text-6xl">{club.logo}</div>
                  <div>
                    <CardTitle className="text-3xl mb-2">{club.name}</CardTitle>
                    <CardDescription className="text-lg">{club.description}</CardDescription>
                  </div>
                </div>
                <Badge variant="secondary" className="text-lg px-4 py-1">{club.category}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-4 gap-6 mb-6">
                <div className="text-center p-4 bg-slate-50 rounded-lg">
                  <Users className="w-8 h-8 mx-auto mb-2 text-primary" />
                  <div className="text-2xl mb-1">{club.members}</div>
                  <div className="text-slate-600">Members</div>
                </div>
                <div className="text-center p-4 bg-slate-50 rounded-lg">
                  <Calendar className="w-8 h-8 mx-auto mb-2 text-primary" />
                  <div className="text-2xl mb-1">{club.founded}</div>
                  <div className="text-slate-600">Founded</div>
                </div>
                <div className="text-center p-4 bg-slate-50 rounded-lg">
                  <Award className="w-8 h-8 mx-auto mb-2 text-primary" />
                  <div className="text-2xl mb-1">{club.achievements}</div>
                  <div className="text-slate-600">Achievements</div>
                </div>
                <div className="text-center p-4 bg-slate-50 rounded-lg">
                  <Users className="w-8 h-8 mx-auto mb-2 text-primary" />
                  <div className="text-2xl mb-1">{events.length}</div>
                  <div className="text-slate-600">Events</div>
                </div>
              </div>
              
              <div className="border-t pt-6">
                <h3 className="mb-3">About {club.name}</h3>
                <p className="text-slate-600 mb-4">{club.about}</p>
                
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <div className="text-slate-500 mb-1">President</div>
                    <div>{club.president}</div>
                  </div>
                  <div>
                    <div className="text-slate-500 mb-1">Vice President</div>
                    <div>{club.vicePresident}</div>
                  </div>
                  <div>
                    <div className="text-slate-500 mb-1">Faculty Coordinator</div>
                    <div>{club.faculty}</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Events Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="flex justify-between items-center mb-6">
            <h2>Events & Activities</h2>
            {isClubOfficial && (
              <Button onClick={handleCreateEvent}>
                <Plus className="w-4 h-4 mr-2" />
                Create Event
              </Button>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {events.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                whileHover={{ y: -4 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                  <CardHeader>
                    <div className="flex justify-between items-start mb-2">
                      <Badge variant={event.type === 'Hackathon' ? 'default' : 'secondary'}>
                        {event.type}
                      </Badge>
                      {event.requiresResume && (
                        <Badge variant="outline">Resume Required</Badge>
                      )}
                    </div>
                    <CardTitle>{event.title}</CardTitle>
                    <CardDescription>{event.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center gap-2 text-slate-600">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(event.date).toLocaleDateString('en-US', { 
                          month: 'long', 
                          day: 'numeric', 
                          year: 'numeric' 
                        })}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-600">
                        <Clock className="w-4 h-4" />
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-600">
                        <MapPin className="w-4 h-4" />
                        <span>{event.venue}</span>
                      </div>
                      <div className="flex items-center justify-between pt-2">
                        <span className="text-slate-500">
                          {event.registered}/{event.capacity} registered
                        </span>
                        <div className="w-24 h-2 bg-slate-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-blue-500 to-indigo-600"
                            style={{ width: `${(event.registered / event.capacity) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                    
                    {isClubOfficial ? (
                      <div className="flex gap-2">
                        <Button 
                          className="flex-1"
                          onClick={() => handleRegister(event.id, event.requiresResume)}
                        >
                          Register
                        </Button>
                        <Button 
                          variant="outline"
                          size="icon"
                          onClick={() => handleEditEvent(event)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="outline"
                          size="icon"
                          onClick={() => handleDeleteEvent(event.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ) : (
                      <Button 
                        className="w-full"
                        onClick={() => handleRegister(event.id, event.requiresResume)}
                      >
                        Register Now
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Event Creation/Edit Dialog */}
      <Dialog open={isEventDialogOpen} onOpenChange={setIsEventDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingEvent ? 'Edit Event' : 'Create New Event'}</DialogTitle>
            <DialogDescription>
              {editingEvent ? 'Update the event details below' : 'Fill in the details to create a new event'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Event Title</Label>
              <Input id="title" placeholder="Enter event title" defaultValue={editingEvent?.title} />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="type">Event Type</Label>
                <Select defaultValue={editingEvent?.type || 'Workshop'}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Workshop">Workshop</SelectItem>
                    <SelectItem value="Seminar">Seminar</SelectItem>
                    <SelectItem value="Hackathon">Hackathon</SelectItem>
                    <SelectItem value="Competition">Competition</SelectItem>
                    <SelectItem value="Event">Event</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="date">Date</Label>
                <Input id="date" type="date" defaultValue={editingEvent?.date} />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="time">Time</Label>
                <Input id="time" placeholder="e.g., 10:00 AM - 4:00 PM" defaultValue={editingEvent?.time} />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="venue">Venue</Label>
                <Input id="venue" placeholder="Enter venue" defaultValue={editingEvent?.venue} />
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="capacity">Capacity</Label>
              <Input id="capacity" type="number" placeholder="Enter capacity" defaultValue={editingEvent?.capacity} />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" placeholder="Enter event description" defaultValue={editingEvent?.description} rows={3} />
            </div>
            
            <div className="flex items-center gap-2">
              <input type="checkbox" id="resume" defaultChecked={editingEvent?.requiresResume} />
              <Label htmlFor="resume" className="cursor-pointer">Requires Resume Submission</Label>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEventDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveEvent}>
              {editingEvent ? 'Update Event' : 'Create Event'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
