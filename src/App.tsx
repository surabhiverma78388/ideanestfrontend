import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Toaster } from './components/ui/sonner';
import HomePage from './components/HomePage';
import ClubsLandingPage from './components/club/ClubsLandingPage';
import ClubCategoryView from './components/club/ClubCategoryView';
import IndividualClubView from './components/club/IndividualClubView';
import ClubLogin from './components/club/ClubLogin';
import StudentRegistration from './components/club/StudentRegistration';
import FacultyDashboard from './components/club/FacultyDashboard';
import AdminDashboard from './components/club/AdminDashboard';
import ScheduleView from './components/schedule/ScheduleView';
import ScheduleUpdate from './components/schedule/ScheduleUpdate';
import VenueBooking from './components/venue/VenueBooking';
import LoginPage from './components/auth/LoginPage';
import SignupPage from './components/auth/SignupPage';

export type UserRole = 'student' | 'faculty' | 'admin' | 'office' | null;

export interface User {
  id: string;
  role: UserRole;
  name: string;
  email: string;
  clubId?: string | null;
  department?: string;
}

function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'clubs-landing' | 'club-category' | 'club-detail' | 'schedule' | 'venue' | 'club-login' | 'student-registration' | 'faculty-dashboard' | 'admin-dashboard' | 'schedule-update' | 'venue-booking' | 'login' | 'signup'>('home');
  const [user, setUser] = useState<User | null>(null);
  const [navigationParams, setNavigationParams] = useState<any>(null);

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };

  const handleNavigate = (page: string, params?: any) => {
    setCurrentPage(page as any);
    setNavigationParams(params || null);
  };

  const handleLogin = (userData: User) => {
    setUser(userData);
    
    // Navigate based on role using centralized logic
    import('./utils/permissions').then(({ getDefaultDashboard }) => {
      const dashboard = getDefaultDashboard(userData);
      setCurrentPage(dashboard as any);
    });
  };

  const handleLogout = async () => {
    try {
      const { logout } = await import('./utils/auth');
      await logout();
      setUser(null);
      setCurrentPage('home');
      setNavigationParams(null);
    } catch (error) {
      console.error('Logout error:', error);
      // Still clear local state even if server logout fails
      setUser(null);
      setCurrentPage('home');
      setNavigationParams(null);
    }
  };

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { getCurrentUser } = await import('./utils/auth');
        const currentUser = await getCurrentUser();
        
        if (currentUser) {
          setUser(currentUser);
          // Navigate based on role using centralized logic
          import('./utils/permissions').then(({ getDefaultDashboard }) => {
            const dashboard = getDefaultDashboard(currentUser);
            setCurrentPage(dashboard as any);
          });
        }
      } catch (error) {
        console.error('Session check error:', error);
      }
    };

    checkSession();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Toaster position="top-right" />
      <AnimatePresence mode="wait">
        <motion.div
          key={currentPage}
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.3 }}
        >
          {currentPage === 'home' && (
            <HomePage 
              onNavigate={handleNavigate}
              user={user}
              onLogout={handleLogout}
            />
          )}
          {currentPage === 'clubs-landing' && (
            <ClubsLandingPage 
              onNavigate={handleNavigate}
              user={user}
              onLogout={handleLogout}
            />
          )}
          {currentPage === 'club-category' && navigationParams && (
            <ClubCategoryView 
              category={navigationParams.category}
              onNavigate={handleNavigate}
              user={user}
              onLogout={handleLogout}
            />
          )}
          {currentPage === 'club-detail' && navigationParams && (
            <IndividualClubView 
              clubId={navigationParams.clubId}
              category={navigationParams.category}
              onNavigate={handleNavigate}
              user={user}
              onLogout={handleLogout}
            />
          )}
          {currentPage === 'club-login' && (
            <ClubLogin 
              onNavigate={handleNavigate}
              onLogin={handleLogin}
            />
          )}
          {currentPage === 'student-registration' && (
            <StudentRegistration 
              onNavigate={handleNavigate}
            />
          )}
          {currentPage === 'faculty-dashboard' && (
            <FacultyDashboard 
              onNavigate={handleNavigate}
              user={user}
              onLogout={handleLogout}
            />
          )}
          {currentPage === 'admin-dashboard' && (
            <AdminDashboard 
              onNavigate={handleNavigate}
              user={user}
              onLogout={handleLogout}
            />
          )}
          {currentPage === 'schedule' && (
            <ScheduleView 
              onNavigate={handleNavigate}
              user={user}
              onLogout={handleLogout}
            />
          )}
          {currentPage === 'schedule-update' && (
            <ScheduleUpdate 
              onNavigate={handleNavigate}
              user={user}
              onLogout={handleLogout}
            />
          )}
          {currentPage === 'venue-booking' && (
            <VenueBooking 
              onNavigate={handleNavigate}
              user={user}
              onLogout={handleLogout}
            />
          )}
          {currentPage === 'login' && (
            <LoginPage 
              onNavigate={handleNavigate}
              onLogin={handleLogin}
            />
          )}
          {currentPage === 'signup' && (
            <SignupPage 
              onNavigate={handleNavigate}
              onLogin={handleLogin}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default App;