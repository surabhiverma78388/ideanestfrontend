import { motion } from 'motion/react';
import { ArrowLeft, Mail, Lock, User as UserIcon, Users, Shield, CheckCircle, Zap, Eye, EyeOff, Building2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Checkbox } from '../ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useState } from 'react';
import { toast } from 'sonner';
import { User, UserRole } from '../../App';

interface SignupPageProps {
  onNavigate: (page: string, params?: any) => void;
  onLogin: (user: User) => void;
}

export default function SignupPage({ onNavigate, onLogin }: SignupPageProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student' as UserRole,
    clubId: ''
  });

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.fullName || !formData.email || !formData.password || !formData.confirmPassword) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (formData.password.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }

    if (!agreeToTerms) {
      toast.error('Please agree to the Terms of Use and Privacy Policy');
      return;
    }

    setIsLoading(true);

    try {
      const { signup, login } = await import('../../utils/auth');
      
      // Create account
      await signup({
        email: formData.email,
        password: formData.password,
        fullName: formData.fullName,
        role: formData.role,
        clubId: formData.clubId || undefined
      });

      // Auto-login after signup
      const result = await login({
        email: formData.email,
        password: formData.password
      });

      onLogin(result.user);
      toast.success(`Welcome to InfoNest, ${result.user.name}! 🎉`);
      
      // Navigation is handled by App.tsx based on role
    } catch (error) {
      console.error('Signup error:', error);
      toast.error(error instanceof Error ? error.message : 'Signup failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

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
              <span className="text-sm text-slate-600">Already have an account?</span>
              <Button variant="outline" size="sm" onClick={() => onNavigate('login')}>
                Sign In
              </Button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* Info Section */}
            <motion.div
              className="space-y-6 lg:sticky lg:top-24"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div>
                <h1 className="text-4xl font-semibold mb-4">Join InfoNest</h1>
                <p className="text-lg text-slate-600">
                  Create your account to access our comprehensive college management platform designed for students, faculty, and administrators.
                </p>
              </div>

              {/* Benefits */}
              <Card className="border-slate-200 shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50">
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-4">What you'll get:</h3>
                  <ul className="space-y-3">
                    {[
                      'Access to 50+ active clubs and organizations',
                      'Manage event registrations and applications',
                      'Real-time schedule updates and notifications',
                      'Venue booking and resource management',
                      'Track your academic and extracurricular activities',
                      'Connect with students and faculty across campus'
                    ].map((benefit, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-slate-700">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Trust Indicators */}
              <div className="grid grid-cols-3 gap-4">
                {[
                  { icon: Users, label: '10k+ Students', color: 'blue' },
                  { icon: Shield, label: 'Secure & Private', color: 'green' },
                  { icon: Zap, label: 'Easy to Use', color: 'purple' }
                ].map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <Card key={index} className="border-slate-200 text-center">
                      <CardContent className="pt-4 pb-3">
                        <div className={`w-10 h-10 bg-${item.color}-100 rounded-lg flex items-center justify-center mx-auto mb-2`}>
                          <Icon className={`w-5 h-5 text-${item.color}-600`} />
                        </div>
                        <p className="text-xs font-medium text-slate-700">{item.label}</p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </motion.div>

            {/* Signup Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card className="border-slate-200 shadow-xl">
                <CardHeader className="space-y-2">
                  <CardTitle className="text-2xl">Create your account</CardTitle>
                  <CardDescription>
                    Fill in your details to get started with InfoNest
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Full Name */}
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name *</Label>
                      <div className="relative">
                        <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <Input
                          id="fullName"
                          type="text"
                          placeholder="Enter your full name"
                          value={formData.fullName}
                          onChange={(e) => handleChange('fullName', e.target.value)}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="your.email@university.edu"
                          value={formData.email}
                          onChange={(e) => handleChange('email', e.target.value)}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>

                    {/* Role Selection */}
                    <div className="space-y-2">
                      <Label htmlFor="role">Role *</Label>
                      <Select
                        value={formData.role}
                        onValueChange={(value) => handleChange('role', value)}
                      >
                        <SelectTrigger id="role">
                          <SelectValue placeholder="Select your role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="student">Student</SelectItem>
                          <SelectItem value="faculty">Faculty / Club Official</SelectItem>
                          <SelectItem value="admin">Administrator</SelectItem>
                          <SelectItem value="office">Office Staff</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Club ID (conditional) */}
                    {formData.role === 'faculty' && (
                      <div className="space-y-2">
                        <Label htmlFor="clubId">Club ID (Optional)</Label>
                        <div className="relative">
                          <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                          <Input
                            id="clubId"
                            type="text"
                            placeholder="e.g., acm, ieee"
                            value={formData.clubId}
                            onChange={(e) => handleChange('clubId', e.target.value)}
                            className="pl-10"
                          />
                        </div>
                        <p className="text-xs text-slate-500">Enter your club ID if you're a club official</p>
                      </div>
                    )}

                    {/* Password */}
                    <div className="space-y-2">
                      <Label htmlFor="password">Password *</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <Input
                          id="password"
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Create a strong password"
                          value={formData.password}
                          onChange={(e) => handleChange('password', e.target.value)}
                          className="pl-10 pr-10"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                      <p className="text-xs text-slate-500">Minimum 8 characters</p>
                    </div>

                    {/* Confirm Password */}
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm Password *</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <Input
                          id="confirmPassword"
                          type={showConfirmPassword ? 'text' : 'password'}
                          placeholder="Re-enter your password"
                          value={formData.confirmPassword}
                          onChange={(e) => handleChange('confirmPassword', e.target.value)}
                          className="pl-10 pr-10"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        >
                          {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>

                    {/* Terms Agreement */}
                    <div className="flex items-start space-x-3 pt-2">
                      <Checkbox
                        id="terms"
                        checked={agreeToTerms}
                        onCheckedChange={(checked) => setAgreeToTerms(checked as boolean)}
                      />
                      <label htmlFor="terms" className="text-sm text-slate-600 cursor-pointer leading-relaxed">
                        I agree to the{' '}
                        <button
                          type="button"
                          className="text-blue-600 hover:text-blue-500 font-medium"
                          onClick={() => toast.info('Terms coming soon!')}
                        >
                          Terms of Use
                        </button>{' '}
                        and{' '}
                        <button
                          type="button"
                          className="text-blue-600 hover:text-blue-500 font-medium"
                          onClick={() => toast.info('Privacy Policy coming soon!')}
                        >
                          Privacy Policy
                        </button>
                      </label>
                    </div>

                    <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                      {isLoading ? 'Creating Account...' : 'Create Account'}
                    </Button>

                    <p className="text-center text-sm text-slate-600 pt-2">
                      Already have an account?{' '}
                      <button
                        type="button"
                        onClick={() => onNavigate('login')}
                        className="font-medium text-blue-600 hover:text-blue-500"
                      >
                        Sign in
                      </button>
                    </p>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-semibold mb-4">Why choose InfoNest?</h2>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto">
              A comprehensive platform designed to streamline college management and enhance student engagement.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Users,
                title: 'Club Management',
                description: 'Discover and join clubs, manage memberships, and participate in events across campus.'
              },
              {
                icon: Shield,
                title: 'Secure & Private',
                description: 'Enterprise-grade security with encrypted data transmission and role-based access control.'
              },
              {
                icon: Zap,
                title: 'Real-time Updates',
                description: 'Get instant notifications about schedule changes, event registrations, and venue bookings.'
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
                  <Card className="border-slate-200 h-full hover:shadow-lg transition-shadow">
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
              By creating an account you agree to InfoNest's{' '}
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
