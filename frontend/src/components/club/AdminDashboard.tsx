import { motion } from 'motion/react';
import { ArrowLeft, Plus, Trash2, Edit, UserPlus, UserMinus, EyeOff, CheckCircle, Eye } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { User } from '../../App';
import { useState } from 'react';
import { toast } from 'sonner@2.0.3';
import { getAvailableFeatures, getPermissionDescription } from '../../utils/permissions';

interface AdminDashboardProps {
  onNavigate: (page: string, params?: any) => void;
  user: User | null;
  onLogout: () => void;
}

export default function AdminDashboard({ onNavigate, user, onLogout }: AdminDashboardProps) {
  const [showAddClubDialog, setShowAddClubDialog] = useState(false);
  const [showEditClubDialog, setShowEditClubDialog] = useState(false);
  const [selectedClub, setSelectedClub] = useState<string | null>(null);
  
  const [addClubForm, setAddClubForm] = useState({
    clubId: '',
    clubName: '',
    sslt: '',
    details: ''
  });

  const [editClubId, setEditClubId] = useState('');

  const mockClubs = [
    { id: 'CLUB001', name: 'Tech Club', faculty: 3, events: 5, members: 250 },
    { id: 'CLUB002', name: 'Coding Club', faculty: 2, events: 3, members: 180 },
    { id: 'CLUB003', name: 'Design Club', faculty: 2, events: 2, members: 120 }
  ];

  const handleAddClub = () => {
    if (!addClubForm.clubId || !addClubForm.clubName || !addClubForm.sslt || !addClubForm.details) {
      toast.error('Please fill all required fields');
      return;
    }
    toast.success(`Club "${addClubForm.clubName}" created successfully!`);
    setShowAddClubDialog(false);
    setAddClubForm({ clubId: '', clubName: '', sslt: '', details: '' });
  };

  const handleRemoveClub = (clubId: string, clubName: string) => {
    if (confirm(`Are you sure you want to delete ${clubName}?`)) {
      toast.success(`Club "${clubName}" has been removed.`);
    }
  };

  const handleEditAction = (action: string) => {
    toast.success(`${action} action completed successfully!`);
    setShowEditClubDialog(false);
    setEditClubId('');
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
              <span className="text-slate-900">Admin Dashboard</span>
            </div>
            
            <div className="flex items-center gap-4">
              <span className="text-slate-600">Club ID: {user?.clubId}</span>
              <Button variant="outline" size="sm" onClick={onLogout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Permission Hierarchy Notice */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <Card className="border-2 border-green-200 bg-green-50">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-green-900 mb-2">Administrator Access - Full Control</h3>
                  <p className="text-green-700 mb-3">
                    You have complete access to all platform features with inherited permissions:
                  </p>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-green-800"><strong>Admin Level:</strong> Manage all clubs, users, and system settings</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-green-800"><strong>Faculty Level:</strong> Create/edit/delete events, review applications for any club</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-green-800"><strong>Student Level:</strong> Browse all clubs, register for any event</span>
                    </div>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => onNavigate('faculty-dashboard')}
                      className="bg-white"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View as Faculty
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => onNavigate('clubs-landing')}
                      className="bg-white"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View as Student
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 mb-8">
            <Dialog open={showAddClubDialog} onOpenChange={setShowAddClubDialog}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Club
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Club</DialogTitle>
                  <DialogDescription>Create a new club in the system</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div>
                    <Label htmlFor="club-id">Club ID *</Label>
                    <Input
                      id="club-id"
                      placeholder="CLUB004"
                      value={addClubForm.clubId}
                      onChange={(e) => setAddClubForm({ ...addClubForm, clubId: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="club-name">Club Name *</Label>
                    <Input
                      id="club-name"
                      placeholder="Robotics Club"
                      value={addClubForm.clubName}
                      onChange={(e) => setAddClubForm({ ...addClubForm, clubName: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="sslt">SSLT (Special Faculty/Leader) *</Label>
                    <Input
                      id="sslt"
                      placeholder="Dr. Jane Doe"
                      value={addClubForm.sslt}
                      onChange={(e) => setAddClubForm({ ...addClubForm, sslt: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="club-details">Club Details *</Label>
                    <Textarea
                      id="club-details"
                      placeholder="Describe the club's mission and activities..."
                      value={addClubForm.details}
                      onChange={(e) => setAddClubForm({ ...addClubForm, details: e.target.value })}
                    />
                  </div>
                  <Button onClick={handleAddClub} className="w-full">
                    Create Club
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog open={showEditClubDialog} onOpenChange={setShowEditClubDialog}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Club
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit Club</DialogTitle>
                  <DialogDescription>Manage club faculty and events</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div>
                    <Label htmlFor="edit-club-id">Enter Club ID</Label>
                    <Input
                      id="edit-club-id"
                      placeholder="CLUB001"
                      value={editClubId}
                      onChange={(e) => setEditClubId(e.target.value)}
                    />
                  </div>
                  
                  {editClubId && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="space-y-2"
                    >
                      <p className="text-slate-600 mb-3">Select an action:</p>
                      <Button 
                        variant="outline" 
                        className="w-full justify-start"
                        onClick={() => handleEditAction('Add Faculty')}
                      >
                        <UserPlus className="w-4 h-4 mr-2" />
                        Add Faculty
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full justify-start"
                        onClick={() => handleEditAction('Remove Faculty')}
                      >
                        <UserMinus className="w-4 h-4 mr-2" />
                        Remove Faculty
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full justify-start"
                        onClick={() => handleEditAction('Remove Event')}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Remove Event
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full justify-start"
                        onClick={() => handleEditAction('Hide Event')}
                      >
                        <EyeOff className="w-4 h-4 mr-2" />
                        Hide Event
                      </Button>
                    </motion.div>
                  )}
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Clubs List */}
          <div>
            <h2 className="text-slate-900 mb-6">All Clubs</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockClubs.map((club, index) => (
                <motion.div
                  key={club.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -4 }}
                >
                  <Card className="h-full">
                    <CardHeader>
                      <div className="flex justify-between items-start mb-2">
                        <Badge>{club.id}</Badge>
                      </div>
                      <CardTitle>{club.name}</CardTitle>
                      <CardDescription>{club.members} members</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between text-slate-600">
                          <span>Faculty:</span>
                          <span>{club.faculty}</span>
                        </div>
                        <div className="flex justify-between text-slate-600">
                          <span>Active Events:</span>
                          <span>{club.events}</span>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1"
                          onClick={() => {
                            setEditClubId(club.id);
                            setShowEditClubDialog(true);
                          }}
                        >
                          <Edit className="w-4 h-4 mr-1" />
                          Edit
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1"
                          onClick={() => handleRemoveClub(club.id, club.name)}
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Remove
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
