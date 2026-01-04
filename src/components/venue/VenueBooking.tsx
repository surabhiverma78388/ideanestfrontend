import { motion } from 'motion/react';
import { ArrowLeft, Building, Calendar as CalendarIcon, Users, CheckCircle } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Checkbox } from '../ui/checkbox';
import { User } from '../../App';
import { useState } from 'react';
import { toast } from 'sonner@2.0.3';
import { api } from '../../utils/api';
import { MockVenue } from '../../utils/mockData';

interface VenueBookingProps {
  onNavigate: (page: string, params?: any) => void;
  user: User | null;
  onLogout: () => void;
}

export default function VenueBooking({ onNavigate, user, onLogout }: VenueBookingProps) {
  const [bookingType, setBookingType] = useState<'classroom' | 'event'>('classroom');
  
  // Classroom booking state
  const [classroomPurpose, setClassroomPurpose] = useState('');
  const [classroomCapacity, setClassroomCapacity] = useState('');
  const [classroomDate, setClassroomDate] = useState('');
  const [classroomTime, setClassroomTime] = useState('');
  const [classroomDuration, setClassroomDuration] = useState('');
  const [selectedClassroom, setSelectedClassroom] = useState<string | null>(null);

  // Event booking state
  const [eventName, setEventName] = useState('');
  const [eventType, setEventType] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventCapacity, setEventCapacity] = useState('');
  const [eventTime, setEventTime] = useState('');
  const [eventDuration, setEventDuration] = useState('');
  const [selectedEventVenue, setSelectedEventVenue] = useState<string | null>(null);

  const [showAvailableVenues, setShowAvailableVenues] = useState(false);
  const [availableVenues, setAvailableVenues] = useState<MockVenue[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearchClassrooms = async () => {
    if (!classroomPurpose || !classroomCapacity || !classroomDate || !classroomTime || !classroomDuration) {
      toast.error('Please fill all fields');
      return;
    }

    setLoading(true);
    setShowAvailableVenues(false);

    try {
      const response = await api.getVenues({
        type: 'classroom',
        capacity: parseInt(classroomCapacity),
        available: true
      });

      if (response.success && response.data) {
        setAvailableVenues(response.data);
        setShowAvailableVenues(true);
      } else {
        toast.error('Failed to fetch venues');
      }
    } catch (error) {
      console.error('Error fetching venues:', error);
      toast.error('Error searching for venues');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchEventVenues = async () => {
    if (!eventName || !eventType || !eventDate || !eventCapacity || !eventTime || !eventDuration) {
      toast.error('Please fill all fields');
      return;
    }

    setLoading(true);
    setShowAvailableVenues(false);

    try {
      const response = await api.getVenues({
        type: 'event',
        capacity: parseInt(eventCapacity),
        available: true
      });

      if (response.success && response.data) {
        setAvailableVenues(response.data);
        setShowAvailableVenues(true);
      } else {
        toast.error('Failed to fetch venues');
      }
    } catch (error) {
      console.error('Error fetching venues:', error);
      toast.error('Error searching for venues');
    } finally {
      setLoading(false);
    }
  };

  const handleBookClassroom = async () => {
    if (!selectedClassroom) {
      toast.error('Please select a classroom');
      return;
    }
    
    try {
      const venue = availableVenues.find(c => c.id === selectedClassroom);
      const response = await api.bookVenue({
        venueId: selectedClassroom,
        date: classroomDate,
        time: classroomTime,
        duration: classroomDuration,
        purpose: classroomPurpose,
        capacity: classroomCapacity
      });

      if (response.success) {
        toast.success(
          `Booked ${venue?.name} for ${classroomDuration} hour(s) on ${classroomDate} at ${classroomTime} with capacity ${classroomCapacity}.`,
          { duration: 5000 }
        );
        // Reset form
        setClassroomPurpose('');
        setClassroomCapacity('');
        setClassroomDate('');
        setClassroomTime('');
        setClassroomDuration('');
        setSelectedClassroom(null);
        setShowAvailableVenues(false);
        setAvailableVenues([]);
      } else {
        toast.error(response.message || 'Booking failed');
      }
    } catch (error) {
      console.error('Booking error:', error);
      toast.error('Failed to book venue');
    }
  };

  const handleBookEventVenue = async () => {
    if (!selectedEventVenue) {
      toast.error('Please select a venue');
      return;
    }

    try {
      const venue = availableVenues.find(v => v.id === selectedEventVenue);
      const response = await api.bookVenue({
        venueId: selectedEventVenue,
        date: eventDate,
        time: eventTime,
        duration: eventDuration,
        eventName: eventName,
        eventType: eventType,
        capacity: eventCapacity
      });

      if (response.success) {
        toast.success(
          `${venue?.name} booked for ${eventName} on ${eventDate}, ${eventTime} for ${eventDuration} hour(s), Capacity ${eventCapacity}.`,
          { duration: 5000 }
        );
        // Reset form
        setEventName('');
        setEventType('');
        setEventDate('');
        setEventCapacity('');
        setEventTime('');
        setEventDuration('');
        setSelectedEventVenue(null);
        setShowAvailableVenues(false);
        setAvailableVenues([]);
      } else {
        toast.error(response.message || 'Booking failed');
      }
    } catch (error) {
      console.error('Booking error:', error);
      toast.error('Failed to book venue');
    }
  };

  // Check if user can book (Faculty, Admin, or Office for classrooms; Faculty with Club ID for events)
  const canBookClassroom = user && ['faculty', 'admin', 'office'].includes(user.role);
  const canBookEvent = user && user.role === 'faculty' && user.clubId;

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle>Login Required</CardTitle>
            <CardDescription>Please login to book venues</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => onNavigate('login')} className="w-full">
              Go to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
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
              <Button variant="ghost" size="sm" onClick={() => onNavigate('home')}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <span className="text-slate-900">Venue Booking</span>
            </div>
            
            <div className="flex items-center gap-4">
              <span className="text-slate-600">Welcome, {user.name}</span>
              <Button variant="outline" size="sm" onClick={onLogout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-slate-900 text-center mb-8">Book Venue</h1>

          <Tabs value={bookingType} onValueChange={(v) => {
            setBookingType(v as any);
            setShowAvailableVenues(false);
            setAvailableVenues([]);
          }} className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
              <TabsTrigger value="classroom">
                <Building className="w-4 h-4 mr-2" />
                Classroom
              </TabsTrigger>
              <TabsTrigger value="event" disabled={!canBookEvent}>
                <CalendarIcon className="w-4 h-4 mr-2" />
                Event Venue
              </TabsTrigger>
            </TabsList>

            {/* Classroom Booking */}
            <TabsContent value="classroom">
              {!canBookClassroom ? (
                <Card>
                  <CardHeader>
                    <CardTitle>Access Denied</CardTitle>
                    <CardDescription>Only Faculty, Admin, and Office can book classrooms</CardDescription>
                  </CardHeader>
                </Card>
              ) : (
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Book Classroom</CardTitle>
                      <CardDescription>Fill in the details to find available classrooms</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="purpose">Purpose</Label>
                          <Select value={classroomPurpose} onValueChange={setClassroomPurpose}>
                            <SelectTrigger id="purpose">
                              <SelectValue placeholder="Select purpose" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="class">Class</SelectItem>
                              <SelectItem value="workshop">Workshop</SelectItem>
                              <SelectItem value="competition">Competition</SelectItem>
                              <SelectItem value="meeting">Meeting</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="capacity">Required Capacity</Label>
                          <Input
                            id="capacity"
                            type="number"
                            placeholder="e.g., 50"
                            value={classroomCapacity}
                            onChange={(e) => setClassroomCapacity(e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="grid md:grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="date">Date</Label>
                          <Input
                            id="date"
                            type="date"
                            value={classroomDate}
                            onChange={(e) => setClassroomDate(e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="time">Start Time</Label>
                          <Input
                            id="time"
                            type="time"
                            value={classroomTime}
                            onChange={(e) => setClassroomTime(e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="duration">Duration (hours)</Label>
                          <Input
                            id="duration"
                            type="number"
                            placeholder="e.g., 2"
                            value={classroomDuration}
                            onChange={(e) => setClassroomDuration(e.target.value)}
                          />
                        </div>
                      </div>

                      <Button onClick={handleSearchClassrooms} className="w-full" disabled={loading}>
                        {loading ? 'Searching...' : 'Search Available Classrooms'}
                      </Button>
                    </CardContent>
                  </Card>

                  {showAvailableVenues && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                    >
                      <Card>
                        <CardHeader>
                          <CardTitle>Available Classrooms</CardTitle>
                          <CardDescription>Select a classroom to book</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="grid md:grid-cols-2 gap-4 mb-4">
                            {availableVenues.map((classroom) => (
                                <motion.div
                                  key={classroom.id}
                                  initial={{ opacity: 0, scale: 0.95 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  whileHover={{ scale: 1.02 }}
                                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                                    selectedClassroom === classroom.id
                                      ? 'border-blue-500 bg-blue-50'
                                      : 'border-slate-200 hover:border-slate-300'
                                  }`}
                                  onClick={() => setSelectedClassroom(classroom.id)}
                                >
                                  <div className="flex items-start justify-between mb-2">
                                    <div>
                                      <h4 className="text-slate-900">{classroom.name}</h4>
                                      <p className="text-slate-600">{classroom.type}</p>
                                    </div>
                                    <Checkbox
                                      checked={selectedClassroom === classroom.id}
                                      onCheckedChange={() => setSelectedClassroom(classroom.id)}
                                    />
                                  </div>
                                  <div className="flex items-center gap-2 text-slate-600">
                                    <Users className="w-4 h-4" />
                                    <span>Capacity: {classroom.capacity}</span>
                                  </div>
                                </motion.div>
                              ))}
                          </div>
                          {availableVenues.length === 0 && (
                             <p className="text-center text-slate-500 mb-4">No venues found matching your criteria.</p>
                          )}
                          <Button onClick={handleBookClassroom} className="w-full" disabled={!selectedClassroom || loading}>
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Confirm Booking
                          </Button>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )}
                </div>
              )}
            </TabsContent>

            {/* Event Venue Booking */}
            <TabsContent value="event">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Book Event Venue</CardTitle>
                    <CardDescription>
                      Book auditoriums and seminar halls for events (Club ID: {user.clubId})
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="event-name">Event Name</Label>
                        <Input
                          id="event-name"
                          placeholder="e.g., Hackathon 2025"
                          value={eventName}
                          onChange={(e) => setEventName(e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="event-type">Event Type</Label>
                        <Select value={eventType} onValueChange={setEventType}>
                          <SelectTrigger id="event-type">
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="workshop">Workshop</SelectItem>
                            <SelectItem value="hackathon">Hackathon</SelectItem>
                            <SelectItem value="competition">Competition</SelectItem>
                            <SelectItem value="seminar">Seminar</SelectItem>
                            <SelectItem value="conference">Conference</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="event-date">Date</Label>
                        <Input
                          id="event-date"
                          type="date"
                          value={eventDate}
                          onChange={(e) => setEventDate(e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="event-capacity">Expected Capacity</Label>
                        <Input
                          id="event-capacity"
                          type="number"
                          placeholder="e.g., 250"
                          value={eventCapacity}
                          onChange={(e) => setEventCapacity(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="event-time">Start Time</Label>
                        <Input
                          id="event-time"
                          type="time"
                          value={eventTime}
                          onChange={(e) => setEventTime(e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="event-duration">Duration (hours)</Label>
                        <Input
                          id="event-duration"
                          type="number"
                          placeholder="e.g., 6"
                          value={eventDuration}
                          onChange={(e) => setEventDuration(e.target.value)}
                        />
                      </div>
                    </div>

                    <Button onClick={handleSearchEventVenues} className="w-full" disabled={loading}>
                       {loading ? 'Searching...' : 'Search Available Venues'}
                    </Button>
                  </CardContent>
                </Card>

                {showAvailableVenues && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                  >
                    <Card>
                      <CardHeader>
                        <CardTitle>Available Event Venues</CardTitle>
                        <CardDescription>Select a venue to book</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid md:grid-cols-2 gap-4 mb-4">
                          {availableVenues.map((venue) => (
                              <motion.div
                                key={venue.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                whileHover={{ scale: 1.02 }}
                                className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                                  selectedEventVenue === venue.id
                                    ? 'border-blue-500 bg-blue-50'
                                    : 'border-slate-200 hover:border-slate-300'
                                }`}
                                onClick={() => setSelectedEventVenue(venue.id)}
                              >
                                <div className="flex items-start justify-between mb-2">
                                  <div>
                                    <h4 className="text-slate-900">{venue.name}</h4>
                                    <p className="text-slate-600">{venue.type}</p>
                                  </div>
                                  <Checkbox
                                    checked={selectedEventVenue === venue.id}
                                    onCheckedChange={() => setSelectedEventVenue(venue.id)}
                                  />
                                </div>
                                <div className="flex items-center gap-2 text-slate-600">
                                  <Users className="w-4 h-4" />
                                  <span>Capacity: {venue.capacity}</span>
                                </div>
                              </motion.div>
                            ))}
                        </div>
                        {availableVenues.length === 0 && (
                            <p className="text-center text-slate-500 mb-4">No venues found matching your criteria.</p>
                        )}
                        <Button onClick={handleBookEventVenue} className="w-full" disabled={!selectedEventVenue || loading}>
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Confirm Booking
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}