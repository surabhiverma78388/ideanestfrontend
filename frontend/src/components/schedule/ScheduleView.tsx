import { motion } from 'motion/react';
import { ArrowLeft, Search, FileText, MapPin, User as UserIcon, Building } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { User } from '../../App';
import { useState } from 'react';
import { api } from '../../utils/api';
import { toast } from 'sonner';

interface ScheduleViewProps {
  onNavigate: (page: string, params?: any) => void;
  user: User | null;
  onLogout: () => void;
}

export default function ScheduleView({ onNavigate, user, onLogout }: ScheduleViewProps) {
  const [searchType, setSearchType] = useState<'teacher' | 'classroom' | 'batch'>('teacher');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSchedule, setShowSchedule] = useState(false);
  const [loading, setLoading] = useState(false);
  const [scheduleData, setScheduleData] = useState<any>(null);

  const handleSearch = async () => {
    if (!searchQuery) {
      toast.error('Please enter a search query');
      return;
    }
    
    setLoading(true);
    setShowSchedule(false);
    
    try {
      const response = await api.getSchedule(searchType, searchQuery);
      if (response.success && response.data && response.data.length > 0) {
        setScheduleData(response.data[0]); // Just take the first match for this UI
        setShowSchedule(true);
      } else {
        toast.error('No schedule found');
        setScheduleData(null);
      }
    } catch (error) {
      console.error('Error fetching schedule:', error);
      toast.error('Failed to fetch schedule');
    } finally {
      setLoading(false);
    }
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
              <span className="text-slate-900">Schedule</span>
            </div>
            
            <div className="flex items-center gap-4">
              {user && user.role === 'office' && (
                <Button onClick={() => onNavigate('schedule-update')}>
                  Update Schedule
                </Button>
              )}
              {user && (
                <Button variant="outline" size="sm" onClick={onLogout}>
                  Logout
                </Button>
              )}
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-slate-900 text-center mb-8">View Schedules</h1>

          <Tabs value={searchType} onValueChange={(v) => {
            setSearchType(v as any);
            setShowSchedule(false);
            setSearchQuery('');
          }} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="teacher">
                <UserIcon className="w-4 h-4 mr-2" />
                Teacher
              </TabsTrigger>
              <TabsTrigger value="classroom">
                <Building className="w-4 h-4 mr-2" />
                Classroom
              </TabsTrigger>
              <TabsTrigger value="batch">
                <FileText className="w-4 h-4 mr-2" />
                Batch
              </TabsTrigger>
            </TabsList>

            {/* Teacher Schedule */}
            <TabsContent value="teacher">
              <Card>
                <CardHeader>
                  <CardTitle>Search Teacher Schedule</CardTitle>
                  <CardDescription>View teacher's timetable and real-time location</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="teacher-name">Teacher's Name</Label>
                    <Input
                      id="teacher-name"
                      placeholder="Enter teacher name (e.g., Dr. Sarah Johnson)"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Button onClick={handleSearch} className="w-full" disabled={loading}>
                    <Search className="w-4 h-4 mr-2" />
                    {loading ? 'Searching...' : 'Search Schedule'}
                  </Button>

                  {showSchedule && scheduleData && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="space-y-4 pt-4 border-t"
                    >
                      <div className="bg-slate-50 rounded-lg p-4">
                        <h3 className="text-slate-900 mb-2">Schedule PDF</h3>
                        <div className="bg-white border-2 border-dashed border-slate-300 rounded-lg p-8 text-center">
                          <FileText className="w-12 h-12 text-slate-400 mx-auto mb-2" />
                          <p className="text-slate-600 mb-3">Teacher Schedule - {scheduleData.id}</p>
                          <Button variant="outline" size="sm">
                            View Full Schedule
                          </Button>
                        </div>
                      </div>

                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
                        <div className="flex items-start gap-3">
                          <MapPin className="w-5 h-5 text-blue-600 mt-0.5" />
                          <div className="flex-1">
                            <h4 className="text-slate-900 mb-2">Real-time Location</h4>
                            <div className="flex flex-wrap gap-2 items-center">
                              <span className="text-slate-600">Scheduled:</span>
                              <Badge variant="outline">{scheduleData.scheduledLocation}</Badge>
                              <span className="text-slate-400">|</span>
                              <span className="text-slate-600">Currently in:</span>
                              <Badge className="bg-green-600">{scheduleData.currentLocation}</Badge>
                            </div>
                            <p className="text-slate-500 mt-2">
                              Last updated: {scheduleData.lastUpdated}
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Classroom Schedule */}
            <TabsContent value="classroom">
              <Card>
                <CardHeader>
                  <CardTitle>Search Classroom Schedule</CardTitle>
                  <CardDescription>View classroom timetable by department and class</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="department">Department</Label>
                    <Select>
                      <SelectTrigger id="department">
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cs">Computer Science</SelectItem>
                        <SelectItem value="it">Information Technology</SelectItem>
                        <SelectItem value="ece">Electronics & Communication</SelectItem>
                        <SelectItem value="ee">Electrical Engineering</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="classroom">Classroom Name</Label>
                    <Input
                      id="classroom"
                      placeholder="e.g., CMS-202"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Button onClick={handleSearch} className="w-full" disabled={loading}>
                    <Search className="w-4 h-4 mr-2" />
                    {loading ? 'Searching...' : 'Search Schedule'}
                  </Button>

                  {showSchedule && scheduleData && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="space-y-4 pt-4 border-t"
                    >
                      <div className="bg-slate-50 rounded-lg p-4">
                        <h3 className="text-slate-900 mb-2">Classroom Schedule</h3>
                        <div className="bg-white border-2 border-dashed border-slate-300 rounded-lg p-8 text-center">
                          <FileText className="w-12 h-12 text-slate-400 mx-auto mb-2" />
                          <p className="text-slate-600 mb-3">Weekly Schedule - {scheduleData.id}</p>
                          <Button variant="outline" size="sm">
                            View Full Schedule
                          </Button>
                        </div>
                      </div>

                      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-200">
                        <div className="flex items-start gap-3">
                          <MapPin className="w-5 h-5 text-purple-600 mt-0.5" />
                          <div className="flex-1">
                            <h4 className="text-slate-900 mb-2">Current Class</h4>
                            <p className="text-slate-600 mb-2">{scheduleData.details}</p>
                            <div className="flex items-center gap-2">
                              <span className="text-slate-500">Location:</span>
                              <Badge variant="secondary">{scheduleData.currentLocation}</Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Batch Schedule */}
            <TabsContent value="batch">
              <Card>
                <CardHeader>
                  <CardTitle>Search Batch Schedule</CardTitle>
                  <CardDescription>View timetable for a specific batch</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="batch-dept">Department</Label>
                    <Select>
                      <SelectTrigger id="batch-dept">
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cs">Computer Science</SelectItem>
                        <SelectItem value="it">Information Technology</SelectItem>
                        <SelectItem value="ece">Electronics & Communication</SelectItem>
                        <SelectItem value="ee">Electrical Engineering</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="batch-name">Batch Name</Label>
                    <Input
                      id="batch-name"
                      placeholder="e.g., B.Tech CS 3rd Year"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Button onClick={handleSearch} className="w-full" disabled={loading}>
                    <Search className="w-4 h-4 mr-2" />
                    {loading ? 'Searching...' : 'Search Schedule'}
                  </Button>

                  {showSchedule && scheduleData && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="space-y-4 pt-4 border-t"
                    >
                      <div className="bg-slate-50 rounded-lg p-4">
                        <h3 className="text-slate-900 mb-2">Batch Timetable</h3>
                        <div className="bg-white border-2 border-dashed border-slate-300 rounded-lg p-8 text-center">
                          <FileText className="w-12 h-12 text-slate-400 mx-auto mb-2" />
                          <p className="text-slate-600 mb-3">Timetable - {scheduleData.id}</p>
                          <Button variant="outline" size="sm">
                            View Full Timetable
                          </Button>
                        </div>
                      </div>

                      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg p-4 border border-emerald-200">
                        <div className="flex items-start gap-3">
                          <MapPin className="w-5 h-5 text-emerald-600 mt-0.5" />
                          <div className="flex-1">
                            <h4 className="text-slate-900 mb-2">Current Location</h4>
                            <p className="text-slate-600 mb-2">{scheduleData.details}</p>
                            <div className="flex flex-wrap gap-2 items-center">
                              <span className="text-slate-600">Scheduled:</span>
                              <Badge variant="outline">{scheduleData.scheduledLocation}</Badge>
                              <span className="text-slate-400">|</span>
                              <span className="text-slate-600">Currently:</span>
                              <Badge className="bg-green-600">{scheduleData.currentLocation}</Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}