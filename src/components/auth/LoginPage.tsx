import { motion } from 'motion/react';
import { ArrowLeft, Mail, Lock, Users, Shield, CheckCircle, Zap, Eye, EyeOff, User as UserIcon, Phone, IdCard } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { useState } from 'react';
import { toast } from 'sonner@2.0.3';
import { User, UserRole } from '../../App';

interface LoginPageProps {
  onNavigate: (page: string, params?: any) => void;
  onLogin: (user: User) => void;
}

export default function LoginPage({ onNavigate, onLogin }: LoginPageProps) {
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Student Login State
  const [studentEmail, setStudentEmail] = useState('');
  const [studentPassword, setStudentPassword] = useState('');
  const [showStudentPassword, setShowStudentPassword] = useState(false);
  const [studentFirstName, setStudentFirstName] = useState('');
  const [studentLastName, setStudentLastName] = useState('');

  // Faculty Login State
  const [facultyName, setFacultyName] = useState('');
  const [facultyEmail, setFacultyEmail] = useState('');
  const [facultyPhone, setFacultyPhone] = useState('');
  const [facultyPassword, setFacultyPassword] = useState('');
  const [facultyClubId, setFacultyClubId] = useState('');
  const [showFacultyPassword, setShowFacultyPassword] = useState(false);

  // Admin Login State
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [showAdminPassword, setShowAdminPassword] = useState(false);
  const [adminFirstName, setAdminFirstName] = useState('');
  const [adminLastName, setAdminLastName] = useState('');

  // Office Login State
  const [officeDept, setOfficeDept] = useState('');
  const [officeEmail, setOfficeEmail] = useState('');
  const [officePassword, setOfficePassword] = useState('');
  const [showOfficePassword, setShowOfficePassword] = useState(false);
  const [officeFirstName, setOfficeFirstName] = useState('');
  const [officeLastName, setOfficeLastName] = useState('');

  const handleLogin = async (role: UserRole, email: string, password: string, additionalData?: any) => {
    if (!email || !password) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsLoading(true);

    try {
      const { login } = await import('../../utils/auth');
      const result = await login({ email, password, role });

      onLogin(result.user);
      toast.success(`Welcome back, ${result.user.name}! 🎉`);
      
      // Navigation is handled by App.tsx based on role
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error instanceof Error ? error.message : 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    if (!forgotEmail) {
      toast.error('Please enter your email address');
      return;
    }
    toast.success('Password reset link sent to your email!');
    setShowForgotPassword(false);
    setForgotEmail('');
  };

  if (showForgotPassword) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md"
        >
          <Card className="border-slate-200 shadow-xl">
            <CardHeader>
              <CardTitle>Forgot Password</CardTitle>
              <CardDescription>Enter your email to receive a password reset link</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="forgot-email">Email Address</Label>
                <Input
                  id="forgot-email"
                  type="email"
                  placeholder="your.email@university.edu"
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
                  Send Reset Link
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navigation */}
      <motion.nav 
        className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={() => onNavigate('home')}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </div>
            
            <div className="flex items-center gap-4">
              <span className="text-sm text-slate-600">New to InfoNest?</span>
              <Button variant="outline" size="sm" onClick={() => onNavigate('signup')}>
                Sign Up
              </Button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* Login Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="mb-6">
                <h1 className="text-4xl font-semibold mb-2">Welcome back to InfoNest</h1>
                <p className="text-lg text-slate-600">
                  Secure access to your college management platform. Sign in to continue where learning, leadership, and collaboration converge.
                </p>
              </div>

              <Tabs defaultValue="student" className="w-full">
                <TabsList className="grid w-full grid-cols-4 mb-6">
                  <TabsTrigger value="student">Student</TabsTrigger>
                  <TabsTrigger value="faculty">Faculty</TabsTrigger>
                  <TabsTrigger value="admin">Admin</TabsTrigger>
                  <TabsTrigger value="office">Office</TabsTrigger>
                </TabsList>

                {/* Student Login */}
                <TabsContent value="student">
                  <Card className="border-slate-200 shadow-xl">
                    <CardHeader>
                      <CardTitle>Student Login</CardTitle>
                      <CardDescription>Access your student dashboard, clubs, and events</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="student-firstname">First Name</Label>
                          <div className="relative">
                            <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <Input
                              id="student-firstname"
                              type="text"
                              placeholder="John"
                              className="pl-10"
                              value={studentFirstName}
                              onChange={(e) => setStudentFirstName(e.target.value)}
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="student-lastname">Last Name</Label>
                          <div className="relative">
                            <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <Input
                              id="student-lastname"
                              type="text"
                              placeholder="Doe"
                              className="pl-10"
                              value={studentLastName}
                              onChange={(e) => setStudentLastName(e.target.value)}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="student-email">Email</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
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
                      <div className="space-y-2">
                        <Label htmlFor="student-password">Password</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                          <Input
                            id="student-password"
                            type={showStudentPassword ? 'text' : 'password'}
                            placeholder="••••••••"
                            className="pl-10 pr-10"
                            value={studentPassword}
                            onChange={(e) => setStudentPassword(e.target.value)}
                          />
                          <button
                            type="button"
                            onClick={() => setShowStudentPassword(!showStudentPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                          >
                            {showStudentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                      </div>
                      <Button 
                        className="w-full"
                        size="lg"
                        disabled={isLoading}
                        onClick={() => handleLogin('student', studentEmail, studentPassword, {
                          firstName: studentFirstName,
                          lastName: studentLastName
                        })}
                      >
                        {isLoading ? 'Signing in...' : 'Sign In'}
                      </Button>
                      <div className="text-center space-y-2">
                        <button
                          type="button"
                          className="text-sm text-blue-600 hover:text-blue-500"
                          onClick={() => setShowForgotPassword(true)}
                        >
                          Forgot Password?
                        </button>
                        <div className="text-sm text-slate-600">
                          Don't have an account?{' '}
                          <button
                            type="button"
                            className="text-blue-600 hover:text-blue-500 font-medium"
                            onClick={() => onNavigate('signup')}
                          >
                            Register here
                          </button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Faculty Login */}
                <TabsContent value="faculty">
                  <Card className="border-slate-200 shadow-xl">
                    <CardHeader>
                      <CardTitle>Faculty Login</CardTitle>
                      <CardDescription>Login as Club Official to manage events and students</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="faculty-name">Name</Label>
                        <div className="relative">
                          <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
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
                      <div className="space-y-2">
                        <Label htmlFor="faculty-email">Email</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
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
                      <div className="space-y-2">
                        <Label htmlFor="faculty-phone">Phone</Label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
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
                      <div className="space-y-2">
                        <Label htmlFor="faculty-clubid">Club ID (For Event Management)</Label>
                        <div className="relative">
                          <IdCard className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                          <Input
                            id="faculty-clubid"
                            type="text"
                            placeholder="e.g., acm, ieee, gdsc"
                            className="pl-10"
                            value={facultyClubId}
                            onChange={(e) => setFacultyClubId(e.target.value)}
                          />
                        </div>
                        <p className="text-xs text-slate-500">
                          Enter your club ID to manage events. Leave empty to browse as a regular user.
                        </p>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="faculty-password">Password</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                          <Input
                            id="faculty-password"
                            type={showFacultyPassword ? 'text' : 'password'}
                            placeholder="••••••••"
                            className="pl-10 pr-10"
                            value={facultyPassword}
                            onChange={(e) => setFacultyPassword(e.target.value)}
                          />
                          <button
                            type="button"
                            onClick={() => setShowFacultyPassword(!showFacultyPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                          >
                            {showFacultyPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                      </div>
                      <Button 
                        className="w-full"
                        size="lg"
                        disabled={isLoading}
                        onClick={() => handleLogin('faculty', facultyEmail, facultyPassword, { 
                          name: facultyName,
                          phone: facultyPhone,
                          clubId: facultyClubId || undefined
                        })}
                      >
                        {isLoading ? 'Signing in...' : 'Login as Faculty'}
                      </Button>
                      <div className="text-center">
                        <button
                          type="button"
                          className="text-sm text-blue-600 hover:text-blue-500"
                          onClick={() => setShowForgotPassword(true)}
                        >
                          Forgot Password?
                        </button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Admin Login */}
                <TabsContent value="admin">
                  <Card className="border-slate-200 shadow-xl">
                    <CardHeader>
                      <CardTitle>Admin Login</CardTitle>
                      <CardDescription>Login to manage clubs, faculty, and platform settings</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="admin-firstname">First Name</Label>
                          <div className="relative">
                            <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <Input
                              id="admin-firstname"
                              type="text"
                              placeholder="John"
                              className="pl-10"
                              value={adminFirstName}
                              onChange={(e) => setAdminFirstName(e.target.value)}
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="admin-lastname">Last Name</Label>
                          <div className="relative">
                            <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <Input
                              id="admin-lastname"
                              type="text"
                              placeholder="Doe"
                              className="pl-10"
                              value={adminLastName}
                              onChange={(e) => setAdminLastName(e.target.value)}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="admin-email">Email</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
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
                      <div className="space-y-2">
                        <Label htmlFor="admin-password">Password</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                          <Input
                            id="admin-password"
                            type={showAdminPassword ? 'text' : 'password'}
                            placeholder="••••••••"
                            className="pl-10 pr-10"
                            value={adminPassword}
                            onChange={(e) => setAdminPassword(e.target.value)}
                          />
                          <button
                            type="button"
                            onClick={() => setShowAdminPassword(!showAdminPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                          >
                            {showAdminPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                      </div>
                      <Button 
                        className="w-full"
                        size="lg"
                        disabled={isLoading}
                        onClick={() => handleLogin('admin', adminEmail, adminPassword, { 
                          firstName: adminFirstName,
                          lastName: adminLastName
                        })}
                      >
                        {isLoading ? 'Signing in...' : 'Login as Admin'}
                      </Button>
                      <div className="text-center">
                        <button
                          type="button"
                          className="text-sm text-blue-600 hover:text-blue-500"
                          onClick={() => setShowForgotPassword(true)}
                        >
                          Forgot Password?
                        </button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Office Login */}
                <TabsContent value="office">
                  <Card className="border-slate-200 shadow-xl">
                    <CardHeader>
                      <CardTitle>Office Login</CardTitle>
                      <CardDescription>Login to manage schedules, venues, and resources</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="office-firstname">First Name</Label>
                          <div className="relative">
                            <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <Input
                              id="office-firstname"
                              type="text"
                              placeholder="John"
                              className="pl-10"
                              value={officeFirstName}
                              onChange={(e) => setOfficeFirstName(e.target.value)}
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="office-lastname">Last Name</Label>
                          <div className="relative">
                            <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <Input
                              id="office-lastname"
                              type="text"
                              placeholder="Doe"
                              className="pl-10"
                              value={officeLastName}
                              onChange={(e) => setOfficeLastName(e.target.value)}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="office-dept">Department Name</Label>
                        <Input
                          id="office-dept"
                          type="text"
                          placeholder="Computer Science"
                          value={officeDept}
                          onChange={(e) => setOfficeDept(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="office-email">Email</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
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
                      <div className="space-y-2">
                        <Label htmlFor="office-password">Password</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                          <Input
                            id="office-password"
                            type={showOfficePassword ? 'text' : 'password'}
                            placeholder="••••••••"
                            className="pl-10 pr-10"
                            value={officePassword}
                            onChange={(e) => setOfficePassword(e.target.value)}
                          />
                          <button
                            type="button"
                            onClick={() => setShowOfficePassword(!showOfficePassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                          >
                            {showOfficePassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                      </div>
                      <Button 
                        className="w-full"
                        size="lg"
                        disabled={isLoading}
                        onClick={() => handleLogin('office', officeEmail, officePassword, { 
                          firstName: officeFirstName,
                          lastName: officeLastName,
                          department: officeDept
                        })}
                      >
                        {isLoading ? 'Signing in...' : 'Login as Office'}
                      </Button>
                      <div className="text-center">
                        <button
                          type="button"
                          className="text-sm text-blue-600 hover:text-blue-500"
                          onClick={() => setShowForgotPassword(true)}
                        >
                          Forgot Password?
                        </button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </motion.div>

            {/* Trust Cards */}
            <motion.div
              className="space-y-4 lg:sticky lg:top-24"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {/* Primary Trust Card */}
              <Card className="overflow-hidden border-slate-200 shadow-lg">
                <div className="relative h-48 bg-gradient-to-br from-blue-500 to-indigo-600">
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <div className="flex gap-2 mb-3">
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-xs font-medium">
                        <Shield className="w-3 h-3" />
                        Secure
                      </span>
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-xs font-medium">
                        <CheckCircle className="w-3 h-3" />
                        Trusted
                      </span>
                    </div>
                    <h3 className="text-xl font-semibold mb-1">Trusted by 500+ colleges</h3>
                    <p className="text-sm text-white/90">Enterprise-grade security protecting your student data and activities.</p>
                  </div>
                </div>
              </Card>

              {/* Feature Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Card className="border-slate-200">
                  <CardContent className="pt-6">
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Users className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">Single Sign-On</h4>
                        <p className="text-sm text-slate-600">Access all modules with one secure account</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-slate-200">
                  <CardContent className="pt-6">
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                        <Zap className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">Instant Access</h4>
                        <p className="text-sm text-slate-600">Get to your dashboard in seconds</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-semibold mb-4">Security & Privacy</h2>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto">
              InfoNest protects your session with enterprise-grade encryption and rigorous access controls to ensure your data remains confidential.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: 'Enterprise Encryption',
                description: 'All data transmission uses industry-standard TLS encryption to protect your credentials and personal information.'
              },
              {
                icon: CheckCircle,
                title: 'Multi-Factor Auth',
                description: 'Optional MFA via authenticator app or SMS for elevated account protection and security.'
              },
              {
                icon: Lock,
                title: 'Auto Sign-Out',
                description: 'Automatic sign-out after 30 minutes of inactivity protects your account on shared devices.'
              }
            ].map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card className="border-slate-200 h-full">
                    <CardContent className="pt-6">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                        <Icon className="w-6 h-6 text-blue-600" />
                      </div>
                      <h3 className="font-semibold mb-2">{feature.title}</h3>
                      <p className="text-sm text-slate-600">{feature.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center text-sm text-slate-600">
            <p className="mb-2">
              By signing in you agree to InfoNest's{' '}
              <button className="text-blue-600 hover:text-blue-500 font-medium" onClick={() => toast.info('Terms coming soon!')}>
                Terms of Use
              </button>{' '}
              and{' '}
              <button className="text-blue-600 hover:text-blue-500 font-medium" onClick={() => toast.info('Privacy Policy coming soon!')}>
                Privacy Policy
              </button>
            </p>
            <p className="text-slate-500">&copy; 2025 InfoNest. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}