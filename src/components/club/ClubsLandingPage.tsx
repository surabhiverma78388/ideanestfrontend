import { motion } from 'motion/react';
import { ArrowLeft, Users, Calendar, MapPin, Code, Award, Lightbulb, Clock, Trophy, BookOpen, Search } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Input } from '../ui/input';
import { User } from '../../App';
import { useState, useEffect } from 'react';
import { toast } from 'sonner@2.0.3';

interface ClubsLandingPageProps {
  onNavigate: (page: string, params?: any) => void;
  user: User | null;
  onLogout: () => void;
}

export default function ClubsLandingPage({ onNavigate, user, onLogout }: ClubsLandingPageProps) {
  const [currentCard, setCurrentCard] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  const carouselFeatures = [
    { icon: Users, title: 'Student Clubs', description: 'Join 50+ active clubs across technology, arts, sports, and social impact.' },
    { icon: Code, title: 'Hackathons', description: 'Compete in campus-wide coding competitions and innovation challenges.' },
    { icon: Lightbulb, title: 'Workshops', description: 'Hands-on learning sessions led by faculty, industry experts, and peers.' },
    { icon: Calendar, title: 'Campus Events', description: 'Discover lectures, seminars, and community gatherings every week.' }
  ];

  const categories = [
    { id: 'Tech', name: 'Technical Clubs', description: 'Programming, AI, Robotics & Technology', clubs: 4, icon: Code, gradient: 'from-blue-500 to-indigo-600' },
    { id: 'Cultural', name: 'Cultural Clubs', description: 'Arts, Music, Dance & Drama', clubs: 4, icon: Award, gradient: 'from-purple-500 to-pink-600' },
    { id: 'Sports', name: 'Sports Clubs', description: 'Cricket, Football, Basketball & Athletics', clubs: 4, icon: Trophy, gradient: 'from-green-500 to-emerald-600' },
    { id: 'Literature', name: 'Literary Clubs', description: 'Debate, Writing & Quiz', clubs: 3, icon: BookOpen, gradient: 'from-orange-500 to-red-600' },
    { id: 'Social', name: 'Social Service', description: 'NSS, Rotaract & Community Work', clubs: 3, icon: Users, gradient: 'from-teal-500 to-cyan-600' }
  ];

  const mockEvents = [
    {
      id: '1',
      title: 'Tech Summit 2025',
      type: 'Conference',
      club: 'ACM',
      clubId: 'acm',
      date: '2025-11-15',
      time: '10:00 AM - 4:00 PM',
      venue: 'Navmandir Auditorium',
      capacity: 250,
      registered: 180,
      description: 'Annual technology conference featuring industry leaders',
      requiresResume: false
    },
    {
      id: '2',
      title: 'HackNest 2025',
      type: 'Hackathon',
      club: 'GDSC',
      clubId: 'gdsc',
      date: '2025-11-20',
      time: '9:00 AM - 9:00 PM',
      venue: 'Computer Lab',
      capacity: 100,
      registered: 87,
      description: '24-hour coding hackathon with exciting prizes',
      requiresResume: true
    },
    {
      id: '3',
      title: 'UI/UX Workshop',
      type: 'Workshop',
      club: 'Design Club',
      clubId: 'design',
      date: '2025-11-12',
      time: '2:00 PM - 5:00 PM',
      venue: 'Seminar Hall 1',
      capacity: 60,
      registered: 45,
      description: 'Learn modern design principles and tools',
      requiresResume: false
    },
    {
      id: '4',
      title: 'Robotics Competition',
      type: 'Competition',
      club: 'IEEE',
      clubId: 'ieee',
      date: '2025-11-25',
      time: '10:00 AM - 3:00 PM',
      venue: 'Engineering Block',
      capacity: 80,
      registered: 65,
      description: 'Build and compete with your robot',
      requiresResume: true
    }
  ];

  const allClubs = [
    {
      id: 'acm',
      name: 'ACM',
      fullName: 'Association for Computing Machinery',
      description: 'The world\'s largest computing society, promoting computer science education and innovation',
      category: 'Technical',
      members: 250,
      icon: Code,
      gradient: 'from-blue-500 to-indigo-600',
      upcomingEvents: mockEvents.filter(e => e.clubId === 'acm')
    },
    {
      id: 'ieee',
      name: 'IEEE',
      fullName: 'Institute of Electrical and Electronics Engineers',
      description: 'Advancing technology for humanity through electrical and electronics engineering',
      category: 'Technical',
      members: 200,
      icon: Trophy,
      gradient: 'from-purple-500 to-pink-600',
      upcomingEvents: mockEvents.filter(e => e.clubId === 'ieee')
    },
    {
      id: 'gdsc',
      name: 'GDSC',
      fullName: 'Google Developer Student Clubs',
      description: 'Community of developers learning Google technologies and building solutions',
      category: 'Technical',
      members: 300,
      icon: Lightbulb,
      gradient: 'from-green-500 to-emerald-600',
      upcomingEvents: mockEvents.filter(e => e.clubId === 'gdsc')
    },
    {
      id: 'design',
      name: 'Design Club',
      fullName: 'UI/UX Design Club',
      description: 'Creative minds exploring user interface and experience design',
      category: 'Technical',
      members: 150,
      icon: Award,
      gradient: 'from-orange-500 to-red-600',
      upcomingEvents: mockEvents.filter(e => e.clubId === 'design')
    },
    {
      id: 'robotics',
      name: 'Robotics Club',
      fullName: 'Robotics and Automation Club',
      description: 'Building intelligent robots and automated systems',
      category: 'Technical',
      members: 180,
      icon: Trophy,
      gradient: 'from-teal-500 to-cyan-600',
      upcomingEvents: mockEvents.filter(e => e.clubId === 'robotics')
    },
    {
      id: 'drama',
      name: 'Drama Club',
      fullName: 'Theatre and Drama Society',
      description: 'Performing arts enthusiasts creating theatrical experiences',
      category: 'Cultural',
      members: 120,
      icon: Award,
      gradient: 'from-pink-500 to-rose-600',
      upcomingEvents: []
    },
    {
      id: 'music',
      name: 'Music Club',
      fullName: 'Musical Arts Society',
      description: 'Musicians and singers creating harmony together',
      category: 'Cultural',
      members: 140,
      icon: Users,
      gradient: 'from-indigo-500 to-purple-600',
      upcomingEvents: []
    },
    {
      id: 'photography',
      name: 'Photography Club',
      fullName: 'Campus Photography Society',
      description: 'Capturing moments and creating visual stories',
      category: 'Arts',
      members: 160,
      icon: Award,
      gradient: 'from-amber-500 to-orange-600',
      upcomingEvents: []
    }
  ];

  const filteredClubs = allClubs.filter(club =>
    club.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    club.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    club.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentCard((prev) => (prev + 1) % carouselFeatures.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleRegister = (eventId: string, requiresResume: boolean) => {
    if (!user) {
      toast.error('Please login to register for events', {
        action: {
          label: 'Login',
          onClick: () => onNavigate('login')
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

  return (
    <div className="clubs-landing">
      {/* Navigation */}
      <motion.nav 
        className="clubs-nav"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="clubs-nav-container">
          <div className="clubs-nav-brand">
            <Button variant="ghost" size="sm" onClick={() => onNavigate('home')} className="clubs-back-btn">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div className="clubs-logo">
              <BookOpen className="clubs-logo-icon" />
              <span className="clubs-logo-text">InfoNest Clubs</span>
            </div>
          </div>
          
          <div className="clubs-nav-actions">
            {user ? (
              <>
                <span className="clubs-user-welcome">Welcome, {user.name}</span>
                <Button variant="outline" size="sm" onClick={onLogout}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" size="sm" onClick={() => onNavigate('login')}>
                  Login
                </Button>
                <Button size="sm" onClick={() => onNavigate('signup')}>
                  Get Started
                </Button>
              </>
            )}
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="clubs-hero">
        <div className="clubs-hero-container">
          <motion.div 
            className="clubs-hero-content"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="clubs-hero-title">
              Connect. Participate. Lead.
            </h1>
            <p className="clubs-hero-subtitle">
              Discover student clubs, hackathons, workshops, and campus events. Browse activities instantly, 
              review verified organizers and schedules, then register securely to join.
            </p>
            <p className="clubs-hero-trust">
              Quick access to curated opportunities, professional event coordination, and clear registration 
              steps for students, faculty, and administrators.
            </p>
          </motion.div>

          <motion.div 
            className="clubs-hero-feature"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="clubs-carousel">
              {carouselFeatures.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={index}
                    className={`clubs-carousel-card ${index === currentCard ? 'active' : ''}`}
                    initial={{ 
                      opacity: 0,
                      scale: 0.9,
                      x: 20,
                      rotateY: -10
                    }}
                    animate={{ 
                      opacity: index === currentCard ? 1 : 0,
                      scale: index === currentCard ? 1 : 0.9,
                      x: index === currentCard ? 0 : (index < currentCard ? -20 : 20),
                      rotateY: index === currentCard ? 0 : (index < currentCard ? 10 : -10),
                      zIndex: index === currentCard ? 10 : 1
                    }}
                    transition={{ 
                      duration: 0.6,
                      ease: [0.25, 0.46, 0.45, 0.94],
                      opacity: { duration: 0.4 },
                      scale: { duration: 0.5, ease: 'easeOut' }
                    }}
                  >
                    <div className="clubs-carousel-icon">
                      <Icon className="w-8 h-8" />
                    </div>
                    <h3>{feature.title}</h3>
                    <p>{feature.description}</p>
                  </motion.div>
                );
              })}
              <div className="clubs-carousel-indicators">
                {carouselFeatures.map((_, index) => (
                  <motion.button
                    key={index}
                    className={`clubs-indicator ${index === currentCard ? 'active' : ''}`}
                    onClick={() => setCurrentCard(index)}
                    aria-label={`Show card ${index + 1}`}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Tabs Section - Events and Clubs */}
      <section className="clubs-tabs-section">
        <div className="clubs-section-container">
          <Tabs defaultValue="events" className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
              <TabsTrigger value="events">Events</TabsTrigger>
              <TabsTrigger value="clubs">Clubs</TabsTrigger>
            </TabsList>

            <TabsContent value="events">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
              >
                <div className="clubs-section-header">
                  <h2>Upcoming Events</h2>
                  <p>Don't miss out on these exciting opportunities happening soon</p>
                </div>
                <div className="clubs-events-grid">
                  {mockEvents.map((event, index) => (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      whileHover={{ y: -4 }}
                    >
                      <Card className="clubs-event-card">
                        <CardHeader>
                          <div className="clubs-event-header">
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
                          <div className="clubs-event-details">
                            <div className="clubs-event-meta">
                              <Users className="w-4 h-4" />
                              <span>{event.club}</span>
                            </div>
                            <div className="clubs-event-meta">
                              <Calendar className="w-4 h-4" />
                              <span>{new Date(event.date).toLocaleDateString('en-US', { 
                                month: 'long', 
                                day: 'numeric', 
                                year: 'numeric' 
                              })}</span>
                            </div>
                            <div className="clubs-event-meta">
                              <Clock className="w-4 h-4" />
                              <span>{event.time}</span>
                            </div>
                            <div className="clubs-event-meta">
                              <MapPin className="w-4 h-4" />
                              <span>{event.venue}</span>
                            </div>
                          </div>
                          <div className="clubs-event-registration">
                            <span className="clubs-registration-count">
                              {event.registered}/{event.capacity} registered
                            </span>
                            <div className="clubs-progress-bar">
                              <div 
                                className="clubs-progress-fill"
                                style={{ width: `${(event.registered / event.capacity) * 100}%` }}
                              />
                            </div>
                          </div>
                          <Button 
                            className="w-full mt-4"
                            onClick={() => handleRegister(event.id, event.requiresResume)}
                          >
                            Register Now
                          </Button>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </TabsContent>

            <TabsContent value="clubs">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
              >
                <div className="clubs-section-header">
                  <h2>Discover Student Clubs</h2>
                  <p>Search and explore all clubs on campus</p>
                </div>
                
                {/* Search Bar */}
                <div className="clubs-search-container">
                  <div className="clubs-search-wrapper">
                    <Search className="clubs-search-icon" />
                    <Input
                      type="text"
                      placeholder="Search clubs by name or description..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="clubs-search-input"
                    />
                  </div>
                </div>

                {/* Clubs List */}
                <div className="clubs-list-grid">
                  {filteredClubs.length > 0 ? (
                    filteredClubs.map((club, index) => {
                      const Icon = club.icon;
                      return (
                        <motion.div
                          key={club.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, delay: index * 0.05 }}
                          whileHover={{ y: -4 }}
                        >
                          <Card 
                            className="clubs-club-card"
                            onClick={() => onNavigate('individual-club', { clubId: club.id })}
                          >
                            <CardHeader>
                              <div className="clubs-club-header">
                                <div className={`clubs-club-icon bg-gradient-to-br ${club.gradient}`}>
                                  <Icon className="w-6 h-6 text-white" />
                                </div>
                                <div className="clubs-club-title-section">
                                  <CardTitle>{club.name}</CardTitle>
                                  <CardDescription className="clubs-club-fullname">{club.fullName}</CardDescription>
                                </div>
                              </div>
                              <CardDescription className="mt-3">{club.description}</CardDescription>
                            </CardHeader>
                            <CardContent>
                              <div className="clubs-club-stats">
                                <div className="clubs-stat">
                                  <Users className="w-4 h-4" />
                                  <span>{club.members} members</span>
                                </div>
                                <div className="clubs-stat">
                                  <Calendar className="w-4 h-4" />
                                  <span>{club.upcomingEvents.length} upcoming events</span>
                                </div>
                              </div>
                              <Button variant="outline" className="w-full mt-4">
                                View Club Details
                              </Button>
                            </CardContent>
                          </Card>
                        </motion.div>
                      );
                    })
                  ) : (
                    <div className="clubs-no-results">
                      <Search className="w-12 h-12 text-slate-300" />
                      <h3>No clubs found</h3>
                      <p>Try searching with different keywords</p>
                    </div>
                  )}
                </div>
              </motion.div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      <style>{`
        .clubs-landing {
          min-height: 100vh;
          background: linear-gradient(to bottom, #f8fafc, #f1f5f9);
        }

        /* Navigation */
        .clubs-nav {
          position: sticky;
          top: 0;
          width: 100%;
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid #e2e8f0;
          z-index: 100;
          box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1);
        }

        .clubs-nav-container {
          max-width: 1280px;
          margin: 0 auto;
          padding: 1rem 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .clubs-nav-brand {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .clubs-back-btn {
          opacity: 0.8;
        }

        .clubs-logo {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .clubs-logo-icon {
          width: 32px;
          height: 32px;
          background: linear-gradient(135deg, #2563eb 0%, #4f46e5 100%);
          color: white;
          padding: 6px;
          border-radius: 8px;
        }

        .clubs-logo-text {
          font-family: 'Poppins', sans-serif;
          font-size: 1.25rem;
          font-weight: 700;
          color: #0f172a;
        }

        .clubs-nav-actions {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .clubs-user-welcome {
          font-size: 0.875rem;
          color: #64748b;
        }

        /* Hero Section */
        .clubs-hero {
          max-width: 1280px;
          margin: 0 auto;
          padding: 4rem 2rem 3rem;
          display: flex;
          align-items: center;
        }

        .clubs-hero-container {
          display: grid;
          grid-template-columns: 1fr 420px;
          gap: 4rem;
          width: 100%;
          align-items: center;
        }

        .clubs-hero-content {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .clubs-hero-title {
          font-family: 'Poppins', sans-serif;
          font-size: 3.5rem;
          font-weight: 800;
          line-height: 1.1;
          color: #0f172a;
          margin: 0;
        }

        .clubs-hero-subtitle {
          font-size: 1.125rem;
          line-height: 1.75;
          color: #475569;
          margin-top: 0.5rem;
        }

        .clubs-hero-trust {
          font-size: 1rem;
          line-height: 1.625;
          color: #64748b;
          margin-top: 1rem;
        }

        .clubs-hero-feature {
          background: white;
          border-radius: 1rem;
          box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.1);
          border: 1px solid #e2e8f0;
          padding: 2rem;
          position: relative;
        }

        .clubs-carousel {
          position: relative;
          min-height: 280px;
        }

        .clubs-carousel-card {
          opacity: 0;
          transform: translateX(100%);
          transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          background: linear-gradient(135deg, #f8fafc 0%, #ffffff 100%);
          border-radius: 0.75rem;
          box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.05);
          padding: 1.5rem;
          min-height: 180px;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .clubs-carousel-card.active {
          opacity: 1;
          transform: translateX(0);
          position: relative;
        }

        .clubs-carousel-icon {
          width: 56px;
          height: 56px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #2563eb 0%, #4f46e5 100%);
          color: white;
          border-radius: 0.75rem;
        }

        .clubs-carousel-card h3 {
          font-family: 'Poppins', sans-serif;
          font-size: 1.5rem;
          font-weight: 700;
          color: #0f172a;
          margin: 0;
        }

        .clubs-carousel-card p {
          font-size: 1rem;
          color: #64748b;
          line-height: 1.625;
          margin: 0;
        }

        .clubs-carousel-indicators {
          display: flex;
          gap: 0.5rem;
          justify-content: center;
          margin-top: 2rem;
        }

        .clubs-indicator {
          width: 32px;
          height: 4px;
          background: #cbd5e1;
          border: none;
          border-radius: 9999px;
          cursor: pointer;
          transition: all 0.3s ease;
          padding: 0;
        }

        .clubs-indicator.active {
          background: #2563eb;
          transform: scaleX(1.5);
        }

        .clubs-indicator:hover {
          background: #2563eb;
        }

        /* Tabs Section */
        .clubs-tabs-section {
          background: white;
          padding: 3rem 0;
        }

        /* Section Styles */
        .clubs-section-container {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 2rem;
        }

        .clubs-section-header {
          text-align: center;
          margin-bottom: 3rem;
        }

        .clubs-section-header h2 {
          font-family: 'Poppins', sans-serif;
          font-size: 2.5rem;
          font-weight: 800;
          color: #0f172a;
          margin: 0 0 1rem 0;
        }

        .clubs-section-header p {
          font-size: 1.125rem;
          color: #64748b;
          max-width: 600px;
          margin: 0 auto;
        }

        /* Categories Grid */
        .clubs-categories-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.5rem;
        }

        .clubs-category-card {
          cursor: pointer;
          border: 2px solid transparent;
          transition: all 0.3s ease;
          background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
        }

        .clubs-category-card:hover {
          border-color: #2563eb20;
          box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.1);
        }

        .clubs-category-icon {
          width: 64px;
          height: 64px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 0.75rem;
          margin: 0 auto 1rem;
        }

        .clubs-category-footer {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          align-items: center;
        }

        .clubs-club-count {
          font-size: 0.875rem;
          font-weight: 600;
          color: #64748b;
        }

        /* Events Grid */
        .clubs-events-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 2rem;
        }

        .clubs-event-card {
          background: white;
          border: 1px solid #e2e8f0;
          transition: all 0.3s ease;
        }

        .clubs-event-card:hover {
          box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.1);
        }

        .clubs-event-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-bottom: 0.75rem;
        }

        .clubs-event-details {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          margin-top: 1rem;
        }

        .clubs-event-meta {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #64748b;
          font-size: 0.875rem;
        }

        .clubs-event-registration {
          margin-top: 1rem;
        }

        .clubs-registration-count {
          display: block;
          font-size: 0.875rem;
          color: #64748b;
          margin-bottom: 0.5rem;
        }

        .clubs-progress-bar {
          width: 100%;
          height: 8px;
          background: #e2e8f0;
          border-radius: 9999px;
          overflow: hidden;
        }

        .clubs-progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #2563eb 0%, #4f46e5 100%);
          border-radius: 9999px;
          transition: width 0.3s ease;
        }

        /* Clubs List Grid */
        .clubs-list-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 2rem;
        }

        .clubs-club-card {
          background: white;
          border: 1px solid #e2e8f0;
          transition: all 0.3s ease;
        }

        .clubs-club-card:hover {
          box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.1);
        }

        .clubs-club-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-bottom: 0.75rem;
        }

        .clubs-club-icon {
          width: 64px;
          height: 64px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 0.75rem;
          margin: 0 auto 1rem;
        }

        .clubs-club-title-section {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .clubs-club-fullname {
          font-size: 0.875rem;
          color: #64748b;
        }

        .clubs-club-stats {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          margin-top: 1rem;
        }

        .clubs-stat {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #64748b;
          font-size: 0.875rem;
        }

        .clubs-no-results {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          border: 1px dashed #cbd5e1;
          border-radius: 0.75rem;
          margin-top: 2rem;
        }

        .clubs-no-results h3 {
          font-size: 1.25rem;
          color: #64748b;
          margin: 0.5rem 0;
        }

        .clubs-no-results p {
          font-size: 0.875rem;
          color: #94a3b8;
        }

        /* Search Bar */
        .clubs-search-container {
          margin-bottom: 2rem;
        }

        .clubs-search-wrapper {
          display: flex;
          align-items: center;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 0.75rem;
          padding: 0.5rem;
        }

        .clubs-search-icon {
          width: 16px;
          height: 16px;
          color: #94a3b8;
          margin-right: 0.5rem;
        }

        .clubs-search-input {
          border: none;
          outline: none;
          background: transparent;
          font-size: 0.875rem;
          color: #0f172a;
          flex: 1;
        }

        /* Responsive Design */
        @media (max-width: 991px) {
          .clubs-hero-container {
            grid-template-columns: 1fr;
            gap: 3rem;
          }

          .clubs-hero-title {
            font-size: 2.5rem;
          }

          .clubs-section-header h2 {
            font-size: 2rem;
          }
        }

        @media (max-width: 767px) {
          .clubs-hero {
            padding: 3rem 1rem 2rem;
          }

          .clubs-hero-title {
            font-size: 2rem;
          }

          .clubs-section-container {
            padding: 0 1rem;
          }

          .clubs-categories-grid,
          .clubs-events-grid,
          .clubs-list-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}