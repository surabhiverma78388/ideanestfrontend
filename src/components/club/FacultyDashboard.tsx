import { motion } from 'motion/react';
import { ArrowLeft, Plus, Edit, Trash2, FileText, CheckCircle, XCircle, Download } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Checkbox } from '../ui/checkbox';
import { Badge } from '../ui/badge';
import { User } from '../../App';
import { useState } from 'react';
import { toast } from 'sonner@2.0.3';

interface FacultyDashboardProps {
  onNavigate: (page: string, params?: any) => void;
  user: User | null;
  onLogout: () => void;
}

interface Application {
  id: string;
  studentName: string;
  email: string;
  department: string;
  year: string;
  cgpa: number;
  skills: string[];
  experience: string;
  resumeUrl: string;
  score: number; // ML algorithm score
}

const mockApplications: Application[] = [
  {
    id: '1',
    studentName: 'Alice Johnson',
    email: 'alice@university.edu',
    department: 'Computer Science',
    year: '3rd Year',
    cgpa: 8.9,
    skills: ['Python', 'Machine Learning', 'Data Science', 'Pandas'],
    experience: '2 internships at tech companies',
    resumeUrl: '#',
    score: 92
  },
  {
    id: '2',
    studentName: 'Bob Smith',
    email: 'bob@university.edu',
    department: 'Information Technology',
    year: '4th Year',
    cgpa: 8.5,
    skills: ['JavaScript', 'React', 'Node.js'],
    experience: '1 internship, 3 personal projects',
    resumeUrl: '#',
    score: 85
  },
  {
    id: '3',
    studentName: 'Carol Davis',
    email: 'carol@university.edu',
    department: 'Computer Science',
    year: '3rd Year',
    cgpa: 9.2,
    skills: ['Python', 'TensorFlow', 'Deep Learning', 'AI'],
    experience: 'Research assistant, 2 publications',
    resumeUrl: '#',
    score: 95
  }
];

export default function FacultyDashboard({ onNavigate, user, onLogout }: FacultyDashboardProps) {
  const [selectedApplicants, setSelectedApplicants] = useState<Set<string>>(new Set());
  const [showEventDialog, setShowEventDialog] = useState(false);
  const [eventForm, setEventForm] = useState({
    name: '',
    details: '',
    time: '',
    venue: '',
    requiresResume: false
  });

  // Check if faculty has a club assigned
  const hasClubAssigned = user?.clubId && user.clubId.trim() !== '';
  const clubName = hasClubAssigned ? getClubName(user.clubId!) : null;

  function getClubName(clubId: string): string {
    const clubNames: Record<string, string> = {
      'acm': 'ACM Chapter',
      'ieee': 'IEEE Student Branch',
      'gdsc': 'Google DSC',
      'csi': 'CSI Student Chapter',
      'dramatics': 'Dramatics Club',
      'music': 'Music Society',
      'dance': 'Dance Troupe',
      'art': 'Fine Arts Club'
    };
    return clubNames[clubId] || clubId.toUpperCase();
  }

  const handleToggleApplicant = (id: string) => {
    const newSelected = new Set(selectedApplicants);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedApplicants(newSelected);
  };

  const handleApproveSelected = () => {
    if (selectedApplicants.size === 0) {
      toast.error('Please select at least one applicant');
      return;
    }
    toast.success(`${selectedApplicants.size} applicant(s) approved! Confirmation emails sent.`);
    setSelectedApplicants(new Set());
  };

  const handleAddEvent = () => {
    if (!eventForm.name || !eventForm.details || !eventForm.time || !eventForm.venue) {
      toast.error('Please fill all required fields');
      return;
    }
    toast.success('Event added successfully! Students will be notified.');
    setShowEventDialog(false);
    setEventForm({ name: '', details: '', time: '', venue: '', requiresResume: false });
  };

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
              <span className="text-slate-900">Faculty Dashboard</span>
            </div>
            
            <div className="flex items-center gap-4">
              <span className="text-slate-600">Welcome, {user?.name}</span>
              <Button variant="outline" size="sm" onClick={onLogout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Club Assignment Notice */}
        {hasClubAssigned ? (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <Card className="border-2 border-blue-200 bg-blue-50">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-blue-900">Club Official Access</h3>
                    <p className="text-blue-700">
                      You are managing <strong>{clubName}</strong>. You can create, edit, and manage events for this club.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <Card className="border-2 border-amber-200 bg-amber-50">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-12 h-12 bg-amber-500 rounded-lg flex items-center justify-center">
                    <XCircle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-amber-900">No Club Assigned</h3>
                    <p className="text-amber-700">
                      You don't have a club assigned. To manage events, please contact admin or login again with your Club ID.
                      You can still browse and register for events like a regular user.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        <Tabs defaultValue="events" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
            <TabsTrigger value="events">Event Management</TabsTrigger>
            <TabsTrigger value="applications">Applications</TabsTrigger>
          </TabsList>

          {/* Event Management */}
          <TabsContent value="events">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              <div className="flex justify-between items-center">
                <h2 className="text-slate-900">{hasClubAssigned ? `${clubName} Events` : 'Event Management'}</h2>
                <Dialog open={showEventDialog} onOpenChange={setShowEventDialog}>
                  <DialogTrigger asChild>
                    <Button disabled={!hasClubAssigned}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Event
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Event</DialogTitle>
                      <DialogDescription>Create a new event for your club</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div>
                        <Label htmlFor="event-name">Event Name *</Label>
                        <Input
                          id="event-name"
                          placeholder="Workshop on AI"
                          value={eventForm.name}
                          onChange={(e) => setEventForm({ ...eventForm, name: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="event-details">Event Details *</Label>
                        <Textarea
                          id="event-details"
                          placeholder="Describe the event..."
                          value={eventForm.details}
                          onChange={(e) => setEventForm({ ...eventForm, details: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="event-time">Time & Date *</Label>
                        <Input
                          id="event-time"
                          type="datetime-local"
                          value={eventForm.time}
                          onChange={(e) => setEventForm({ ...eventForm, time: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="event-venue">Venue *</Label>
                        <Input
                          id="event-venue"
                          placeholder="Auditorium"
                          value={eventForm.venue}
                          onChange={(e) => setEventForm({ ...eventForm, venue: e.target.value })}
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="requires-resume"
                          checked={eventForm.requiresResume}
                          onCheckedChange={(checked) => 
                            setEventForm({ ...eventForm, requiresResume: checked as boolean })
                          }
                        />
                        <label htmlFor="requires-resume" className="text-slate-700 cursor-pointer">
                          Requires Resume Submission
                        </label>
                      </div>
                      <Button onClick={handleAddEvent} className="w-full">
                        Create Event
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              {hasClubAssigned ? (
                <div className="grid md:grid-cols-2 gap-6">
                  {[
                    { id: '1', name: 'Tech Summit 2025', date: 'Nov 15, 2025', registrations: 180 },
                    { id: '2', name: 'AI Workshop', date: 'Nov 20, 2025', registrations: 45 }
                  ].map((event, index) => (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card>
                        <CardHeader>
                          <CardTitle>{event.name}</CardTitle>
                          <CardDescription>{event.date}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center justify-between mb-4">
                            <span className="text-slate-600">{event.registrations} registrations</span>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" className="flex-1">
                              <Edit className="w-4 h-4 mr-2" />
                              Edit
                            </Button>
                            <Button variant="outline" size="sm" className="flex-1">
                              <Trash2 className="w-4 h-4 mr-2" />
                              Remove
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <Card className="border-2 border-dashed border-slate-300">
                  <CardContent className="pt-12 pb-12 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center">
                        <FileText className="w-8 h-8 text-slate-400" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900 mb-2">No Club Access</h3>
                        <p className="text-slate-600 max-w-md mx-auto">
                          You need to be assigned to a club to manage events. Please contact your administrator 
                          or login again with your Club ID to access event management features.
                        </p>
                      </div>
                      <Button variant="outline" onClick={() => onNavigate('clubs-landing')}>
                        Browse Events as User
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </motion.div>
          </TabsContent>

          {/* Applications */}
          <TabsContent value="applications">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-slate-900">Student Applications</h2>
                  <p className="text-slate-600">{hasClubAssigned ? `Applications ranked by ML algorithm for ${clubName}` : 'Applications ranked by ML algorithm'}</p>
                </div>
                <Button 
                  onClick={handleApproveSelected}
                  disabled={selectedApplicants.size === 0 || !hasClubAssigned}
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Approve Selected ({selectedApplicants.size})
                </Button>
              </div>

              {hasClubAssigned ? (
                <div className="space-y-4">
                  {mockApplications.map((app, index) => (
                  <motion.div
                    key={app.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className={selectedApplicants.has(app.id) ? 'border-blue-500 border-2' : ''}>
                      <CardContent className="pt-6">
                        <div className="flex items-start gap-4">
                          <Checkbox
                            checked={selectedApplicants.has(app.id)}
                            onCheckedChange={() => handleToggleApplicant(app.id)}
                          />
                          
                          <div className="flex-1">
                            <div className="flex justify-between items-start mb-3">
                              <div>
                                <h3 className="text-slate-900">{app.studentName}</h3>
                                <p className="text-slate-600">{app.email}</p>
                              </div>
                              <div className="text-right">
                                <Badge 
                                  variant={app.score >= 90 ? 'default' : 'secondary'}
                                  className="mb-2"
                                >
                                  Match Score: {app.score}%
                                </Badge>
                                <div className="text-slate-600">CGPA: {app.cgpa}</div>
                              </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-4 mb-3">
                              <div>
                                <span className="text-slate-500">Department:</span>
                                <p className="text-slate-900">{app.department}</p>
                              </div>
                              <div>
                                <span className="text-slate-500">Year:</span>
                                <p className="text-slate-900">{app.year}</p>
                              </div>
                            </div>

                            <div className="mb-3">
                              <span className="text-slate-500">Skills:</span>
                              <div className="flex flex-wrap gap-2 mt-1">
                                {app.skills.map((skill) => (
                                  <Badge key={skill} variant="outline">{skill}</Badge>
                                ))}
                              </div>
                            </div>

                            <div className="mb-3">
                              <span className="text-slate-500">Experience:</span>
                              <p className="text-slate-900">{app.experience}</p>
                            </div>

                            <Button variant="outline" size="sm">
                              <Download className="w-4 h-4 mr-2" />
                              Download Resume
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
                </div>
              ) : (
                <Card className="border-2 border-dashed border-slate-300">
                  <CardContent className="pt-12 pb-12 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center">
                        <FileText className="w-8 h-8 text-slate-400" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900 mb-2">No Club Access</h3>
                        <p className="text-slate-600 max-w-md mx-auto">
                          You need to be assigned to a club to review student applications. Please contact your 
                          administrator or login again with your Club ID.
                        </p>
                      </div>
                      <Button variant="outline" onClick={() => onNavigate('clubs-landing')}>
                        Browse Events as User
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
