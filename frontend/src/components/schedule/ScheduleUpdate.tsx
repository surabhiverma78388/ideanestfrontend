import { motion } from 'motion/react';
import { ArrowLeft, Upload, FileText, Trash2, Eye } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Badge } from '../ui/badge';
import { User } from '../../App';
import { useState } from 'react';
import { toast } from 'sonner';

interface ScheduleUpdateProps {
  onNavigate: (page: string, params?: any) => void;
  user: User | null;
  onLogout: () => void;
}

export default function ScheduleUpdate({ onNavigate, user, onLogout }: ScheduleUpdateProps) {
  const [updateType, setUpdateType] = useState<'batch' | 'teacher' | 'classroom'>('batch');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [entityName, setEntityName] = useState('');

  const mockExistingSchedules = {
    batch: [
      { id: '1', name: 'B.Tech CS 3rd Year', lastUpdated: '2025-10-15' },
      { id: '2', name: 'B.Tech IT 2nd Year', lastUpdated: '2025-10-14' }
    ],
    teacher: [
      { id: '1', name: 'Dr. Sarah Johnson', lastUpdated: '2025-10-15' },
      { id: '2', name: 'Prof. Michael Brown', lastUpdated: '2025-10-13' }
    ],
    classroom: [
      { id: '1', name: 'CMS-202', lastUpdated: '2025-10-15' },
      { id: '2', name: 'CMS-201', lastUpdated: '2025-10-14' }
    ]
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (!entityName) {
      toast.error('Please enter the name');
      return;
    }
    if (!selectedFile) {
      toast.error('Please select a PDF file');
      return;
    }
    
    toast.success(`Schedule updated successfully for ${entityName}!`);
    setEntityName('');
    setSelectedFile(null);
  };

  const handleRemove = (name: string) => {
    if (confirm(`Are you sure you want to remove the schedule for ${name}?`)) {
      toast.success(`Schedule removed for ${name}`);
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
              <span className="text-slate-900">Update Schedule</span>
            </div>
            
            <div className="flex items-center gap-4">
              <span className="text-slate-600">Office: {user?.department}</span>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => onNavigate('schedule')}
              >
                <Eye className="w-4 h-4 mr-2" />
                View Schedules
              </Button>
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
          <h1 className="text-slate-900 text-center mb-8">Update Schedules</h1>

          <Tabs value={updateType} onValueChange={(v) => setUpdateType(v as any)} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="batch">Batch</TabsTrigger>
              <TabsTrigger value="teacher">Teacher</TabsTrigger>
              <TabsTrigger value="classroom">Classroom</TabsTrigger>
            </TabsList>

            {/* Batch Update */}
            <TabsContent value="batch">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Upload Section */}
                <Card>
                  <CardHeader>
                    <CardTitle>Upload Batch Schedule</CardTitle>
                    <CardDescription>Upload new timetable for a batch</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="batch-name">Batch Name</Label>
                      <Input
                        id="batch-name"
                        placeholder="e.g., B.Tech CS 3rd Year"
                        value={entityName}
                        onChange={(e) => setEntityName(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="batch-file">Upload PDF</Label>
                      <Input
                        id="batch-file"
                        type="file"
                        accept=".pdf"
                        onChange={handleFileSelect}
                      />
                      {selectedFile && (
                        <p className="text-slate-600 mt-2">
                          Selected: {selectedFile.name}
                        </p>
                      )}
                    </div>
                    <Button onClick={handleUpload} className="w-full">
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Schedule
                    </Button>
                  </CardContent>
                </Card>

                {/* Existing Schedules */}
                <Card>
                  <CardHeader>
                    <CardTitle>Existing Batch Schedules</CardTitle>
                    <CardDescription>View and manage current schedules</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {mockExistingSchedules.batch.map((schedule, index) => (
                        <motion.div
                          key={schedule.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
                        >
                          <div>
                            <p className="text-slate-900">{schedule.name}</p>
                            <p className="text-slate-500">
                              Updated: {new Date(schedule.lastUpdated).toLocaleDateString()}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemove(schedule.name)}
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </Button>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Teacher Update */}
            <TabsContent value="teacher">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Upload Section */}
                <Card>
                  <CardHeader>
                    <CardTitle>Upload Teacher Schedule</CardTitle>
                    <CardDescription>Upload new schedule for a teacher</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="teacher-name">Teacher Name</Label>
                      <Input
                        id="teacher-name"
                        placeholder="e.g., Dr. Sarah Johnson"
                        value={entityName}
                        onChange={(e) => setEntityName(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="teacher-file">Upload PDF</Label>
                      <Input
                        id="teacher-file"
                        type="file"
                        accept=".pdf"
                        onChange={handleFileSelect}
                      />
                      {selectedFile && (
                        <p className="text-slate-600 mt-2">
                          Selected: {selectedFile.name}
                        </p>
                      )}
                    </div>
                    <Button onClick={handleUpload} className="w-full">
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Schedule
                    </Button>
                  </CardContent>
                </Card>

                {/* Existing Schedules */}
                <Card>
                  <CardHeader>
                    <CardTitle>Existing Teacher Schedules</CardTitle>
                    <CardDescription>View and manage current schedules</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {mockExistingSchedules.teacher.map((schedule, index) => (
                        <motion.div
                          key={schedule.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
                        >
                          <div>
                            <p className="text-slate-900">{schedule.name}</p>
                            <p className="text-slate-500">
                              Updated: {new Date(schedule.lastUpdated).toLocaleDateString()}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemove(schedule.name)}
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </Button>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Classroom Update */}
            <TabsContent value="classroom">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Upload Section */}
                <Card>
                  <CardHeader>
                    <CardTitle>Upload Classroom Schedule</CardTitle>
                    <CardDescription>Upload new schedule for a classroom</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="classroom-id">Classroom ID</Label>
                      <Input
                        id="classroom-id"
                        placeholder="e.g., CMS-202"
                        value={entityName}
                        onChange={(e) => setEntityName(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="classroom-file">Upload PDF</Label>
                      <Input
                        id="classroom-file"
                        type="file"
                        accept=".pdf"
                        onChange={handleFileSelect}
                      />
                      {selectedFile && (
                        <p className="text-slate-600 mt-2">
                          Selected: {selectedFile.name}
                        </p>
                      )}
                    </div>
                    <Button onClick={handleUpload} className="w-full">
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Schedule
                    </Button>
                  </CardContent>
                </Card>

                {/* Existing Schedules */}
                <Card>
                  <CardHeader>
                    <CardTitle>Existing Classroom Schedules</CardTitle>
                    <CardDescription>View and manage current schedules</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {mockExistingSchedules.classroom.map((schedule, index) => (
                        <motion.div
                          key={schedule.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
                        >
                          <div>
                            <p className="text-slate-900">{schedule.name}</p>
                            <p className="text-slate-500">
                              Updated: {new Date(schedule.lastUpdated).toLocaleDateString()}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemove(schedule.name)}
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </Button>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}
