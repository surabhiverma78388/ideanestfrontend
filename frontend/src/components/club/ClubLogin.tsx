import { motion } from 'motion/react';
import { ArrowLeft, User, Lock, Mail, Phone, IdCard } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { useState } from 'react';
import { toast } from 'sonner';
import { UserRole } from '../../App';

interface ClubLoginProps {
  onNavigate: (page: string, params?: any) => void;
  onLogin: (user: any) => void;
}

export default function ClubLogin({ onNavigate, onLogin }: ClubLoginProps) {
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');

  // Student Login State
  const [studentEmail, setStudentEmail] = useState('');
  const [studentPassword, setStudentPassword] = useState('');

  // Faculty Login State
  const [facultyName, setFacultyName] = useState('');
  const [facultyEmail, setFacultyEmail] = useState('');
  const [facultyPhone, setFacultyPhone] = useState('');
  const [facultyPassword, setFacultyPassword] = useState('');
  const [facultyClubId, setFacultyClubId] = useState('');

  // Admin Login State
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminClubId, setAdminClubId] = useState('');

  // Office Login State
  const [officeDept, setOfficeDept] = useState('');
  const [officeEmail, setOfficeEmail] = useState('');
  const [officePassword, setOfficePassword] = useState('');

  const handleLogin = (role: UserRole, data: any) => {
    // Mock login - in real app, this would validate credentials
    toast.success(`Welcome back, ${data.name || data.email}!`);
    onLogin({
      role,
      ...data
    });
  };

  const handleForgotPassword = () => {
    if (!forgotEmail) {
      toast.error('Please enter your email address');
      return;
    }
    toast.success('OTP sent to your email and phone number!');
    setShowForgotPassword(false);
    setForgotEmail('');
  };

  if (showForgotPassword) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md"
        >
          <Card>
            <CardHeader>
              <CardTitle>Forgot Password</CardTitle>
              <CardDescription>Enter your email to receive an OTP</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="forgot-email">Email Address</Label>
                <Input
                  id="forgot-email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => setShowForgotPassword(false)}
                >
                  Cancel
                </Button>
                <Button 
                  className="flex-1"
                  onClick={handleForgotPassword}
                >
                  Send OTP
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Navbar */}
      <motion.nav 
        className="bg-white/80 backdrop-blur-md border-b border-slate-200"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Button variant="ghost" size="sm" onClick={() => onNavigate('home')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </div>
        </div>
      </motion.nav>

      {/* Login Forms */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-slate-900 text-center mb-8">Login to InfoNest</h1>
          
          <Tabs defaultValue="student" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-8">
              <TabsTrigger value="student">Student</TabsTrigger>
              <TabsTrigger value="faculty">Faculty</TabsTrigger>
              <TabsTrigger value="admin">Admin</TabsTrigger>
              <TabsTrigger value="office">Office</TabsTrigger>
            </TabsList>

            {/* Student Login */}
            <TabsContent value="student">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Student Login</CardTitle>
                    <CardDescription>Login to register for events and view clubs</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="student-email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                        <Input
                          id="student-email"
                          type="email"
                          placeholder="student@university.edu"
                          className="pl-10"
                          value={studentEmail}
                          onChange={(e) => setStudentEmail(e.target.value)}
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="student-password">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                        <Input
                          id="student-password"
                          type="password"
                          placeholder="••••••••"
                          className="pl-10"
                          value={studentPassword}
                          onChange={(e) => setStudentPassword(e.target.value)}
                        />
                      </div>
                    </div>
                    <Button 
                      className="w-full"
                      onClick={() => handleLogin('student', { 
                        name: studentEmail.split('@')[0],
                        email: studentEmail 
                      })}
                    >
                      Login
                    </Button>
                    <div className="text-center space-y-2">
                      <button
                        className="text-blue-600 hover:underline"
                        onClick={() => setShowForgotPassword(true)}
                      >
                        Forgot Password?
                      </button>
                      <div className="text-slate-600">
                        Don't have an account?{' '}
                        <button
                          className="text-blue-600 hover:underline"
                          onClick={() => onNavigate('student-registration')}
                        >
                          Register here
                        </button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            {/* Faculty Login */}
            <TabsContent value="faculty">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Faculty Login</CardTitle>
                    <CardDescription>Login as Club Official to manage events</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="faculty-name">Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                        <Input
                          id="faculty-name"
                          type="text"
                          placeholder="Dr. John Doe"
                          className="pl-10"
                          value={facultyName}
                          onChange={(e) => setFacultyName(e.target.value)}
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="faculty-email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                        <Input
                          id="faculty-email"
                          type="email"
                          placeholder="faculty@university.edu"
                          className="pl-10"
                          value={facultyEmail}
                          onChange={(e) => setFacultyEmail(e.target.value)}
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="faculty-phone">Phone</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                        <Input
                          id="faculty-phone"
                          type="tel"
                          placeholder="+1 234 567 8900"
                          className="pl-10"
                          value={facultyPhone}
                          onChange={(e) => setFacultyPhone(e.target.value)}
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="faculty-clubid">Club ID (For Event Management)</Label>
                      <div className="relative">
                        <IdCard className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                        <Input
                          id="faculty-clubid"
                          type="text"
                          placeholder="e.g., acm, ieee, gdsc"
                          className="pl-10"
                          value={facultyClubId}
                          onChange={(e) => setFacultyClubId(e.target.value)}
                        />
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        Enter your club ID to manage events. Leave empty to browse as a regular user.
                      </p>
                    </div>
                    <div>
                      <Label htmlFor="faculty-password">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                        <Input
                          id="faculty-password"
                          type="password"
                          placeholder="••••••••"
                          className="pl-10"
                          value={facultyPassword}
                          onChange={(e) => setFacultyPassword(e.target.value)}
                        />
                      </div>
                    </div>
                    <Button 
                      className="w-full"
                      onClick={() => handleLogin('faculty', { 
                        name: facultyName,
                        email: facultyEmail,
                        clubId: facultyClubId || undefined
                      })}
                    >
                      Login as Faculty
                    </Button>
                    <div className="text-center">
                      <button
                        className="text-blue-600 hover:underline"
                        onClick={() => setShowForgotPassword(true)}
                      >
                        Forgot Password?
                      </button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            {/* Admin Login */}
            <TabsContent value="admin">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Admin Login</CardTitle>
                    <CardDescription>Login to manage clubs and faculty</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="admin-email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                        <Input
                          id="admin-email"
                          type="email"
                          placeholder="admin@university.edu"
                          className="pl-10"
                          value={adminEmail}
                          onChange={(e) => setAdminEmail(e.target.value)}
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="admin-clubid">Club ID</Label>
                      <div className="relative">
                        <IdCard className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                        <Input
                          id="admin-clubid"
                          type="text"
                          placeholder="CLUB001"
                          className="pl-10"
                          value={adminClubId}
                          onChange={(e) => setAdminClubId(e.target.value)}
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="admin-password">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                        <Input
                          id="admin-password"
                          type="password"
                          placeholder="••••••••"
                          className="pl-10"
                          value={adminPassword}
                          onChange={(e) => setAdminPassword(e.target.value)}
                        />
                      </div>
                    </div>
                    <Button 
                      className="w-full"
                      onClick={() => handleLogin('admin', { 
                        name: 'Admin',
                        email: adminEmail,
                        clubId: adminClubId
                      })}
                    >
                      Login as Admin
                    </Button>
                    <div className="text-center">
                      <button
                        className="text-blue-600 hover:underline"
                        onClick={() => setShowForgotPassword(true)}
                      >
                        Forgot Password?
                      </button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            {/* Office Login */}
            <TabsContent value="office">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Office Login</CardTitle>
                    <CardDescription>Login to manage schedules and venues</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="office-dept">Department Name</Label>
                      <Input
                        id="office-dept"
                        type="text"
                        placeholder="Computer Science"
                        value={officeDept}
                        onChange={(e) => setOfficeDept(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="office-email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                        <Input
                          id="office-email"
                          type="email"
                          placeholder="office@university.edu"
                          className="pl-10"
                          value={officeEmail}
                          onChange={(e) => setOfficeEmail(e.target.value)}
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="office-password">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                        <Input
                          id="office-password"
                          type="password"
                          placeholder="••••••••"
                          className="pl-10"
                          value={officePassword}
                          onChange={(e) => setOfficePassword(e.target.value)}
                        />
                      </div>
                    </div>
                    <Button 
                      className="w-full"
                      onClick={() => handleLogin('office', { 
                        name: 'Office',
                        email: officeEmail,
                        department: officeDept
                      })}
                    >
                      Login as Office
                    </Button>
                    <div className="text-center">
                      <button
                        className="text-blue-600 hover:underline"
                        onClick={() => setShowForgotPassword(true)}
                      >
                        Forgot Password?
                      </button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}
