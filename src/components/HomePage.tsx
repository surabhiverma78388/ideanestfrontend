import { motion } from 'motion/react';
import { Users, Calendar, MapPin, CheckCircle, Zap, Shield, ArrowRight, BookOpen, Bell, BarChart } from 'lucide-react';
import { Button } from './ui/button';
import { User } from '../App';
import { toast } from 'sonner';
import logoImage from 'figma:asset/583e3c1640b15c30c2b76d56f720d2271700024b.png';
import studentsImage from 'figma:asset/877a086f6b076acb995238343491f56f64a33473.png';
import calendarImage from 'figma:asset/50b5d290b3e39f7484a331095510e5051d748d46.png';
import buildingImage from 'figma:asset/fdde728f44539e672f15fac32e6daead47a0f727.png';
import clubIcon from 'figma:asset/9c0b1eae4949159e308b5d1d5a7e3f618fa35302.png';
import scheduleIcon from 'figma:asset/094582d7a3ee05f2d2512ad205d22a7c6afb0e5b.png';
import venueIcon from 'figma:asset/2561b3edd718510ced06b194bbd379b7bed6cb30.png';

interface HomePageProps {
  onNavigate: (page: string, params?: any) => void;
  user: User | null;
  onLogout: () => void;
}

export default function HomePage({ onNavigate, user, onLogout }: HomePageProps) {
  // Handle navigation with authentication check
  const handleModuleClick = (moduleId: string) => {
    if (!user) {
      toast.error('Please sign in to access this feature', {
        description: 'Create an account or sign in to explore all features',
        action: {
          label: 'Sign In',
          onClick: () => onNavigate('login')
        }
      });
      return;
    }
    onNavigate(moduleId);
  };

  return (
    <div className="homepage">
      {/* Navigation */}
      <nav className="navigation" id="mainNavigation">
        <div className="navigation__container">
          <a href="/" className="navigation__logo" aria-label="InfoNest - Home">
            <img src={logoImage} alt="InfoNest Logo" className="navigation__logo-image" />
          </a>

          <button className="navigation__toggle" id="navigationToggle" aria-label="Toggle navigation menu" aria-expanded="false" aria-controls="navigationMenu">
            <span className="navigation__toggle-icon navigation__toggle-icon--menu">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 5h16M4 12h16M4 19h16"/></svg>
            </span>
            <span className="navigation__toggle-icon navigation__toggle-icon--close">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m18 6l-12 12m0-12l12 12"/></svg>
            </span>
          </button>

          <div className="navigation__menu" id="navigationMenu">
            <ul className="navigation__list">
              <li className="navigation__item">
                <a href="#modules-section" className="navigation__link">
                  <span className="navigation__link-text">Try It</span>
                </a>
              </li>
              <li className="navigation__item">
                <a href="#features-section" className="navigation__link">
                  <span className="navigation__link-text">About Us</span>
                </a>
              </li>
              <li className="navigation__item">
                <a href="#footer-main" className="navigation__link">
                  <span className="navigation__link-text">Contact</span>
                </a>
              </li>
              <li className="navigation__item navigation__item--user">
                <div className="navigation__user-indicator">
                  <div className="navigation__user-avatar">
                    {user ? (
                      <span className="navigation__user-initials">
                        {user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                      </span>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
                        <circle cx="12" cy="7" r="4"/>
                      </svg>
                    )}
                  </div>
                  <span className="navigation__user-name">
                    {user ? user.name : 'User'}
                  </span>
                </div>
              </li>
            </ul>
          </div>

          <div className="navigation__backdrop" id="navigationBackdrop"></div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="hero-section" role="region" aria-labelledby="hero-heading">
        <div className="hero-container">
          <div className="hero-grid">
            <motion.div 
              className="hero-lead"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 id="hero-heading" className="hero-title">
                Streamline Your Campus Management with Confidence
              </h1>
              <p className="hero-summary">
                InfoNest empowers educational institutions with a comprehensive platform for club management, 
                event scheduling, and venue booking. Built for students, faculty, and administrators to 
                collaborate seamlessly.
              </p>
              <div className="hero-cta-cluster">
                <Button size="lg" onClick={() => onNavigate('signup')}>
                  Get Started
                </Button>
                <Button size="lg" variant="outline" onClick={() => onNavigate('login')}>
                  Sign In
                </Button>
              </div>
            </motion.div>

            <motion.div 
              className="hero-sidebar"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="feature-card">
                <div className="feature-card__background">
                  <img src={studentsImage} alt="" className="feature-card__bg-image" />
                </div>
                <div className="feature-card__content">
                  <div className="card-icon">
                    <Users className="w-6 h-6" />
                  </div>
                  <h3>Active Users</h3>
                  <p className="stat-large">0</p>
                  <p className="stat-label">Students & Faculty</p>
                </div>
              </div>
              <div className="feature-card">
                <div className="feature-card__background">
                  <img src={calendarImage} alt="" className="feature-card__bg-image" />
                </div>
                <div className="feature-card__content">
                  <div className="card-icon">
                    <Calendar className="w-6 h-6" />
                  </div>
                  <h3>Monthly Events</h3>
                  <p className="stat-large">180+</p>
                  <p className="stat-label">Across All Clubs</p>
                </div>
              </div>
              <div className="feature-card">
                <div className="feature-card__background">
                  <img src={buildingImage} alt="" className="feature-card__bg-image" />
                </div>
                <div className="feature-card__content">
                  <div className="card-icon">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <h3>Venues Managed</h3>
                  <p className="stat-large">45</p>
                  <p className="stat-label">Real-time Booking</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Modules Section */}
      <section id="modules-section" role="region" aria-labelledby="modules-heading">
        <div className="modules-container">
          <div className="section-header">
            <h2 id="modules-heading" className="section-title">Comprehensive Platform Modules</h2>
            <p className="section-subtitle">
              Three integrated systems working together to deliver seamless campus management
            </p>
          </div>

          <div className="modules-grid">
            {[
              {
                id: 'clubs-landing',
                icon: Users,
                iconImage: clubIcon,
                title: 'Club Management',
                description: 'Comprehensive club oversight, event creation, and student engagement tools with ML-powered resume screening.',
                features: ['Event Management', 'Student Registration', 'Resume Screening', 'Faculty Dashboard'],
                gradient: 'from-blue-500 to-indigo-600'
              },
              {
                id: 'schedule',
                icon: Calendar,
                iconImage: scheduleIcon,
                title: 'Schedule Module',
                description: 'Real-time timetable viewing with integrated venue booking and location tracking for seamless coordination.',
                features: ['Live Timetables', 'Location Tracking', 'Conflict Detection', 'Auto-sync'],
                gradient: 'from-purple-500 to-pink-600'
              },
              {
                id: 'venue-booking',
                icon: MapPin,
                iconImage: venueIcon,
                title: 'Venue Booking',
                description: 'Classroom and event venue booking system with role-based access and real-time availability updates.',
                features: ['Real-time Availability', 'Role-based Access', 'Auto-confirmation', 'Calendar Sync'],
                gradient: 'from-green-500 to-emerald-600'
              }
            ].map((module, index) => {
              const Icon = module.icon;
              return (
                <motion.div
                  key={module.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="module-card"
                  onClick={() => handleModuleClick(module.id)}
                >
                  <div className="module-icon" style={{ backgroundImage: `url(${module.iconImage})` }}>
                  </div>
                  <h3 className="module-title">{module.title}</h3>
                  <p className="module-description">{module.description}</p>
                  <ul className="module-features">
                    {module.features.map((feature, i) => (
                      <li key={i}>
                        <CheckCircle className="w-4 h-4" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button variant="outline" className="module-button">
                    Learn More
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features-section" role="region" aria-labelledby="features-heading">
        <div className="features-container">
          <div className="section-header">
            <h2 id="features-heading" className="section-title">Why Choose InfoNest?</h2>
            <p className="section-subtitle">
              Built with best practices for security, reliability, and user experience
            </p>
          </div>

          <div className="features-grid">
            {[
              {
                icon: Zap,
                title: 'Lightning Fast',
                description: 'Optimized performance ensures instant response times and smooth navigation across all modules.',
                color: 'text-yellow-500'
              },
              {
                icon: Shield,
                title: 'Secure & Compliant',
                description: 'Role-based access control, encrypted data, and FERPA compliance for student privacy.',
                color: 'text-green-500'
              },
              {
                icon: Bell,
                title: 'Real-time Updates',
                description: 'Instant notifications via email and SMS for bookings, approvals, and schedule changes.',
                color: 'text-blue-500'
              },
              {
                icon: Users,
                title: 'Multi-role Support',
                description: 'Tailored dashboards for students, faculty, admins, and office staff with appropriate permissions.',
                color: 'text-purple-500'
              },
              {
                icon: BarChart,
                title: 'Analytics & Reports',
                description: 'Comprehensive insights into event participation, venue utilization, and club activities.',
                color: 'text-pink-500'
              },
              {
                icon: CheckCircle,
                title: 'Integrated Workflows',
                description: 'Seamless synchronization between club events, schedules, and venue bookings.',
                color: 'text-teal-500'
              }
            ].map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="feature-item"
                >
                  <div className="feature-icon-wrapper">
                    <Icon className={`w-8 h-8 ${feature.color}`} />
                  </div>
                  <h3 className="feature-title">{feature.title}</h3>
                  <p className="feature-description">{feature.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="footer-main" className="footer-wrapper">
        <div className="footer-container">
          {/* Decorative Background */}
          <div className="footer-background-layer">
            <div className="footer-gradient-orb footer-gradient-orb--1"></div>
            <div className="footer-gradient-orb footer-gradient-orb--2"></div>
          </div>

          <div className="footer-content">
            {/* Top Section */}
            <div className="footer-top">
              <div className="footer-brand">
                <div className="footer-contact-list">
                  <a href="mailto:info@infonest.edu" className="footer-contact-item">
                    <span className="footer-contact-icon">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"><path d="m22 7l-8.991 5.727a2 2 0 0 1-2.009 0L2 7"/><rect width="20" height="16" x="2" y="4" rx="2"/></g></svg>
                    </span>
                    <span>info@infonest.edu</span>
                  </a>
                  <a href="tel:+15551234567" className="footer-contact-item">
                    <span className="footer-contact-icon">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233a14 14 0 0 0 6.392 6.384"/></svg>
                    </span>
                    <span>+1 (555) 123-4567</span>
                  </a>
                  <div className="footer-contact-item">
                    <span className="footer-contact-icon">
                      <MapPin className="w-5 h-5" />
                    </span>
                    <span>123 Education Drive, University Campus</span>
                  </div>
                </div>
              </div>

              <div className="footer-nav-grid">
                <div className="footer-nav-column">
                  <h3 className="footer-nav-title">Platform</h3>
                  <ul className="footer-nav-list">
                    <li><a href="#" onClick={(e) => { e.preventDefault(); handleModuleClick('clubs-landing'); }} className="footer-nav-link">Club Management</a></li>
                    <li><a href="#" onClick={(e) => { e.preventDefault(); handleModuleClick('schedule'); }} className="footer-nav-link">Event Scheduling</a></li>
                    <li><a href="#" onClick={(e) => { e.preventDefault(); handleModuleClick('venue-booking'); }} className="footer-nav-link">Venue Booking</a></li>
                    <li><a href="#" className="footer-nav-link">Schedule Module</a></li>
                  </ul>
                </div>

                <div className="footer-nav-column">
                  <h3 className="footer-nav-title">Resources</h3>
                  <ul className="footer-nav-list">
                    <li><a href="#" className="footer-nav-link">Documentation</a></li>
                    <li><a href="#" className="footer-nav-link">For Students</a></li>
                    <li><a href="#" className="footer-nav-link">For Faculty</a></li>
                    <li><a href="#" className="footer-nav-link">Support Center</a></li>
                  </ul>
                </div>

                <div className="footer-nav-column">
                  <h3 className="footer-nav-title">Company</h3>
                  <ul className="footer-nav-list">
                    <li><a href="#" className="footer-nav-link">About InfoNest</a></li>
                    <li><a href="#" className="footer-nav-link">Our Mission</a></li>
                    <li><a href="#" className="footer-nav-link">Contact Us</a></li>
                    <li><a href="#" className="footer-nav-link">Careers</a></li>
                  </ul>
                </div>

                <div className="footer-nav-column">
                  <h3 className="footer-nav-title">Legal</h3>
                  <ul className="footer-nav-list">
                    <li><a href="#" className="footer-nav-link">Privacy Policy</a></li>
                    <li><a href="#" className="footer-nav-link">Terms of Service</a></li>
                    <li><a href="#" className="footer-nav-link">Accessibility</a></li>
                    <li><a href="#" className="footer-nav-link">Cookie Policy</a></li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="footer-divider"></div>

            {/* Bottom */}
            <div className="footer-bottom">
              <div className="footer-copyright">
                <p className="footer-copyright-text">
                  © 2025 InfoNest. All rights reserved. Empowering educational institutions through innovative technology.
                </p>
              </div>

              <div className="footer-social">
                <span className="footer-social-label">Follow Us</span>
                <div className="footer-social-links">
                  <a href="https://facebook.com" className="footer-social-link" aria-label="Facebook" target="_blank" rel="noopener noreferrer">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                  </a>
                  <a href="https://twitter.com" className="footer-social-link" aria-label="Twitter" target="_blank" rel="noopener noreferrer">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6c2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4c-.9-4.2 4-6.6 7-3.8c1.1 0 3-1.2 3-1.2"/></svg>
                  </a>
                  <a href="https://linkedin.com" className="footer-social-link" aria-label="LinkedIn" target="_blank" rel="noopener noreferrer">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2a2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6M2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/></g></svg>
                  </a>
                  <a href="https://instagram.com" className="footer-social-link" aria-label="Instagram" target="_blank" rel="noopener noreferrer">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8A4 4 0 0 1 16 11.37m1.5-4.87h.01"/></g></svg>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Back to Top */}
          <button id="back-to-top" className="footer-back-to-top" aria-label="Back to top">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m5 12l7-7l7 7m-7 7V5"/></svg>
          </button>
        </div>
      </footer>

      <style>{`
        .homepage {
          min-height: 100vh;
          background: linear-gradient(to bottom, #f8fafc, #f1f5f9);
        }

        /* ============================================
           NAVIGATION
           ============================================ */

        .navigation {
          position: sticky;
          top: 0;
          left: 0;
          width: 100%;
          background: rgba(255, 255, 255, 0.8);
          border-bottom: 1px solid #e2e8f0;
          z-index: 1000;
          backdrop-filter: blur(12px);
          transition: box-shadow 0.3s ease;
        }

        .navigation.navigation--scrolled {
          box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
        }

        .navigation__container {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 2rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 80px;
          position: relative;
        }

        .navigation__logo {
          display: flex;
          align-items: center;
          text-decoration: none;
          transition: transform 0.3s ease;
          z-index: 1001;
        }

        .navigation__logo:hover {
          transform: translateY(-2px);
        }

        .navigation__logo-image {
          height: 80px;
          width: auto;
          object-fit: contain;
        }

        .navigation__toggle {
          display: none;
          align-items: center;
          justify-content: center;
          width: 48px;
          height: 48px;
          background: transparent;
          border: 1px solid #e2e8f0;
          border-radius: 0.75rem;
          cursor: pointer;
          transition: all 0.3s ease;
          z-index: 1001;
          position: relative;
        }

        .navigation__toggle:hover {
          background: #f8fafc;
          border-color: #2563eb;
        }

        .navigation__toggle-icon {
          position: absolute;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #0f172a;
          transition: opacity 0.3s ease, transform 0.3s ease;
        }

        .navigation__toggle-icon--menu {
          opacity: 1;
          transform: rotate(0deg);
        }

        .navigation__toggle-icon--close {
          opacity: 0;
          transform: rotate(90deg);
        }

        .navigation__toggle[aria-expanded="true"] .navigation__toggle-icon--menu {
          opacity: 0;
          transform: rotate(-90deg);
        }

        .navigation__toggle[aria-expanded="true"] .navigation__toggle-icon--close {
          opacity: 1;
          transform: rotate(0deg);
        }

        .navigation__menu {
          display: flex;
          align-items: center;
          gap: 3rem;
          flex: 1;
          justify-content: flex-end;
        }

        .navigation__list {
          display: flex;
          align-items: center;
          gap: 1rem;
          list-style: none;
          margin: 0;
          padding: 0;
        }

        .navigation__item {
          position: relative;
        }

        .navigation__link {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          text-decoration: none;
          color: #0f172a;
          font-family: 'Inter', sans-serif;
          font-size: 1rem;
          font-weight: 500;
          letter-spacing: -0.01em;
          white-space: nowrap;
          border-radius: 0.75rem;
          transition: all 0.3s ease;
          position: relative;
        }

        .navigation__link::before {
          content: '';
          position: absolute;
          bottom: 0;
          left: 50%;
          width: 0;
          height: 2px;
          background: #2563eb;
          transform: translateX(-50%);
          transition: width 0.3s ease;
        }

        .navigation__link:hover {
          color: #2563eb;
          background: rgba(37, 99, 235, 0.05);
        }

        .navigation__link:hover::before {
          width: 80%;
        }

        .navigation__link-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          color: #64748b;
          transition: color 0.3s ease, transform 0.3s ease;
        }

        .navigation__link:hover .navigation__link-icon {
          color: #2563eb;
          transform: translateY(-2px);
        }

        .navigation__actions {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .navigation__user-welcome {
          font-size: 0.875rem;
          color: #64748b;
          margin-right: 0.5rem;
        }

        .navigation__action-btn {
          white-space: nowrap;
        }

        .navigation__item--user {
          margin-left: 1rem;
          padding-left: 1rem;
          border-left: 1px solid #e2e8f0;
        }

        .navigation__user-indicator {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.5rem 1rem;
          background: linear-gradient(135deg, #f8fafc 0%, #ffffff 100%);
          border: 1px solid #e2e8f0;
          border-radius: 0.75rem;
          transition: all 0.3s ease;
        }

        .navigation__user-indicator:hover {
          background: rgba(37, 99, 235, 0.05);
          border-color: #2563eb;
          box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.05);
        }

        .navigation__user-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: linear-gradient(135deg, #2563eb 0%, #7c3aed 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          flex-shrink: 0;
          transition: all 0.3s ease;
        }

        .navigation__user-initials {
          font-family: 'Poppins', sans-serif;
          font-size: 0.875rem;
          font-weight: 600;
          letter-spacing: 0.025em;
        }

        .navigation__user-avatar svg {
          width: 18px;
          height: 18px;
          stroke: white;
        }

        .navigation__user-name {
          font-family: 'Inter', sans-serif;
          font-size: 0.875rem;
          font-weight: 500;
          color: #0f172a;
          max-width: 150px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .navigation__backdrop {
          display: none;
          position: fixed;
          inset: 0;
          background: rgba(15, 23, 42, 0.5);
          opacity: 0;
          transition: opacity 0.3s ease;
          z-index: 999;
          pointer-events: none;
        }

        .navigation__backdrop.navigation__backdrop--active {
          opacity: 1;
          pointer-events: auto;
        }

        @media (max-width: 991px) {
          .navigation__container {
            height: 72px;
            padding: 0 1.5rem;
          }

          .navigation__logo-icon {
            width: 42px;
            height: 42px;
          }

          .navigation__list {
            gap: 0.75rem;
          }

          .navigation__link {
            padding: 0.5rem 0.75rem;
            font-size: 0.875rem;
          }

          .navigation__actions {
            gap: 0.5rem;
          }
        }

        @media (max-width: 767px) {
          .navigation__container {
            height: 64px;
            padding: 0 1rem;
          }

          .navigation__toggle {
            display: flex;
          }

          .navigation__menu {
            position: fixed;
            top: 64px;
            right: 0;
            width: 320px;
            max-width: 85vw;
            height: calc(100vh - 64px);
            background: white;
            border-left: 1px solid #e2e8f0;
            box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1);
            padding: 2rem 1.5rem;
            flex-direction: column;
            align-items: stretch;
            gap: 2rem;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            z-index: 1000;
            overflow-y: auto;
          }

          .navigation__menu.navigation__menu--open {
            transform: translateX(0);
          }

          .navigation__backdrop {
            display: block;
          }

          .navigation__list {
            flex-direction: column;
            align-items: stretch;
            gap: 0.5rem;
          }

          .navigation__link {
            padding: 1rem 1.5rem;
            background: #f8fafc;
            border: 1px solid #e2e8f0;
          }

          .navigation__link::before {
            display: none;
          }

          .navigation__link:hover {
            background: rgba(37, 99, 235, 0.08);
            border-color: #2563eb;
          }

          .navigation__actions {
            flex-direction: column;
            align-items: stretch;
            gap: 0.75rem;
            padding-top: 1.5rem;
            border-top: 1px solid #e2e8f0;
          }

          .navigation__action-btn {
            width: 100%;
            justify-content: center;
          }

          .navigation__logo-tagline {
            display: none;
          }
        }

        /* ============================================
           HERO SECTION
           ============================================ */

        #hero-section {
          background: white;
          min-height: 90vh;
          display: flex;
          align-items: center;
          position: relative;
          overflow: hidden;
        }

        .hero-container {
          max-width: 1280px;
          margin: 0 auto;
          padding: 6rem 2rem;
          width: 100%;
        }

        .hero-grid {
          display: grid;
          grid-template-columns: 1fr 360px;
          gap: 4rem;
          align-items: start;
        }

        .hero-title {
          font-family: 'Poppins', sans-serif;
          font-size: 3.5rem;
          font-weight: 800;
          line-height: 1.1;
          letter-spacing: -0.025em;
          color: #0f172a;
          margin: 0 0 1.5rem 0;
        }

        .hero-summary {
          font-family: 'Inter', sans-serif;
          font-size: 1.125rem;
          font-weight: 400;
          line-height: 1.75;
          color: #475569;
          margin: 0 0 2rem 0;
          max-width: 60ch;
        }

        .hero-cta-cluster {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .hero-sidebar {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .feature-card {
          position: relative;
          background: linear-gradient(135deg, #f8fafc 0%, #ffffff 100%);
          border: 1px solid #e2e8f0;
          border-radius: 1rem;
          padding: 1.5rem;
          box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.05);
          transition: all 0.3s ease;
          overflow: hidden;
        }

        .feature-card__background {
          position: absolute;
          inset: 0;
          z-index: 0;
          overflow: hidden;
          border-radius: 1rem;
        }

        .feature-card__bg-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          opacity: 0.25;
          filter: blur(0.5px);
          transition: all 0.3s ease;
        }

        .feature-card:hover .feature-card__bg-image {
          opacity: 0.35;
          transform: scale(1.05);
        }

        .feature-card__content {
          position: relative;
          z-index: 1;
        }

        .feature-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.1);
        }

        .card-icon {
          margin-bottom: 0.75rem;
          color: #2563eb;
          position: relative;
          z-index: 2;
        }

        .feature-card h3 {
          font-family: 'Poppins', sans-serif;
          font-size: 1.125rem;
          font-weight: 600;
          color: #0f172a;
          margin: 0 0 0.5rem 0;
        }

        .stat-large {
          font-family: 'Poppins', sans-serif;
          font-size: 2.5rem;
          font-weight: 800;
          color: #2563eb;
          margin: 0;
          line-height: 1;
        }

        .stat-label {
          font-size: 0.875rem;
          color: #64748b;
          margin: 0.25rem 0 0 0;
        }

        @media (max-width: 991px) {
          .hero-grid {
            grid-template-columns: 1fr;
            gap: 3rem;
          }

          .hero-title {
            font-size: 2.5rem;
          }
        }

        @media (max-width: 767px) {
          .hero-container {
            padding: 4rem 1rem;
          }

          .hero-title {
            font-size: 2rem;
          }

          .hero-cta-cluster {
            flex-direction: column;
            width: 100%;
          }

          .hero-cta-cluster button {
            width: 100%;
          }
        }

        /* ============================================
           MODULES SECTION
           ============================================ */

        #modules-section {
          background: linear-gradient(135deg, #f8fafc 0%, #ffffff 100%);
          padding: 5rem 2rem;
        }

        .modules-container {
          max-width: 1280px;
          margin: 0 auto;
        }

        .section-header {
          text-align: center;
          margin-bottom: 4rem;
        }

        .section-title {
          font-family: 'Poppins', sans-serif;
          font-size: 2.5rem;
          font-weight: 800;
          color: #0f172a;
          margin: 0 0 1rem 0;
        }

        .section-subtitle {
          font-size: 1.125rem;
          color: #64748b;
          max-width: 600px;
          margin: 0 auto;
        }

        .modules-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
        }

        .module-card {
          background: white;
          border: 2px solid transparent;
          border-radius: 1rem;
          padding: 2rem;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          flex-direction: column;
        }

        .module-card:hover {
          border-color: rgba(37, 99, 235, 0.2);
          box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.1);
          transform: translateY(-4px);
        }

        .module-icon {
          width: 64px;
          height: 64px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 1rem;
          margin-bottom: 1.5rem;
          background-size: cover;
          background-position: center;
        }

        .module-title {
          font-family: 'Poppins', sans-serif;
          font-size: 1.5rem;
          font-weight: 700;
          color: #0f172a;
          margin: 0 0 0.75rem 0;
        }

        .module-description {
          font-size: 1rem;
          color: #64748b;
          line-height: 1.625;
          margin: 0 0 1.5rem 0;
        }

        .module-features {
          list-style: none;
          padding: 0;
          margin: 0 0 1.5rem 0;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .module-features li {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.875rem;
          color: #475569;
        }

        .module-features svg {
          color: #2563eb;
          flex-shrink: 0;
        }

        .module-button {
          margin-top: auto;
        }

        @media (max-width: 767px) {
          #modules-section {
            padding: 3rem 1rem;
          }

          .section-title {
            font-size: 2rem;
          }

          .modules-grid {
            grid-template-columns: 1fr;
          }
        }

        /* ============================================
           FEATURES SECTION
           ============================================ */

        #features-section {
          background: white;
          padding: 5rem 2rem;
        }

        .features-container {
          max-width: 1280px;
          margin: 0 auto;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 2rem;
        }

        .feature-item {
          background: linear-gradient(135deg, #f8fafc 0%, #ffffff 100%);
          border: 1px solid #e2e8f0;
          border-radius: 1rem;
          padding: 2rem;
          transition: all 0.3s ease;
        }

        .feature-item:hover {
          box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.1);
          transform: translateY(-4px);
        }

        .feature-icon-wrapper {
          width: 56px;
          height: 56px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: white;
          border-radius: 0.75rem;
          margin-bottom: 1rem;
          box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.05);
        }

        .feature-title {
          font-family: 'Poppins', sans-serif;
          font-size: 1.25rem;
          font-weight: 600;
          color: #0f172a;
          margin: 0 0 0.75rem 0;
        }

        .feature-description {
          font-size: 1rem;
          color: #64748b;
          line-height: 1.625;
          margin: 0;
        }

        @media (max-width: 767px) {
          #features-section {
            padding: 3rem 1rem;
          }

          .features-grid {
            grid-template-columns: 1fr;
          }
        }

        /* ============================================
           FOOTER
           ============================================ */

        .footer-wrapper {
          position: relative;
          background: #0f172a;
          overflow: hidden;
          margin-top: 0;
        }

        .footer-container {
          position: relative;
          max-width: 1280px;
          margin: 0 auto;
          padding: clamp(3rem, 6vw, 5rem) 2rem;
        }

        .footer-background-layer {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 1;
          pointer-events: none;
          overflow: hidden;
        }

        .footer-gradient-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0.15;
          animation: footer-orb-float 20s ease-in-out infinite;
        }

        .footer-gradient-orb--1 {
          width: 400px;
          height: 400px;
          background: #2563eb;
          top: -100px;
          left: -100px;
          animation-delay: 0s;
        }

        .footer-gradient-orb--2 {
          width: 500px;
          height: 500px;
          background: #7c3aed;
          bottom: -150px;
          right: -150px;
          animation-delay: 10s;
        }

        @keyframes footer-orb-float {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -30px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }

        .footer-content {
          position: relative;
          z-index: 3;
        }

        .footer-top {
          display: grid;
          grid-template-columns: 1.2fr 2fr;
          gap: clamp(2rem, 5vw, 4rem);
          margin-bottom: clamp(3rem, 5vw, 4rem);
        }

        .footer-brand {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .footer-logo-wrapper {
          position: relative;
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .footer-logo-accent {
          width: 8px;
          height: 40px;
          background: linear-gradient(180deg, #2563eb 0%, #7c3aed 100%);
          border-radius: 0.5rem;
          box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
        }

        .footer-logo {
          font-family: 'Poppins', sans-serif;
          font-size: clamp(1.75rem, 3vw, 2.25rem);
          font-weight: 700;
          color: white;
          margin: 0;
          letter-spacing: -0.025em;
        }

        .footer-tagline {
          font-size: 1rem;
          color: #94a3b8;
          line-height: 1.625;
          margin: 0;
        }

        .footer-contact-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-top: 1.5rem;
        }

        .footer-contact-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-size: 0.875rem;
          color: #cbd5e1;
          text-decoration: none;
          transition: all 0.3s ease;
        }

        .footer-contact-item:hover {
          color: #2563eb;
          transform: translateX(4px);
        }

        .footer-contact-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          border-radius: 0.75rem;
          background: #1e293b;
          border: 1px solid #334155;
          flex-shrink: 0;
          transition: all 0.3s ease;
        }

        .footer-contact-item:hover .footer-contact-icon {
          background: #2563eb;
          border-color: #2563eb;
          box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
        }

        .footer-contact-icon svg {
          stroke: #94a3b8;
          transition: stroke 0.3s ease;
        }

        .footer-contact-item:hover .footer-contact-icon svg {
          stroke: white;
        }

        .footer-nav-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 2rem;
        }

        .footer-nav-column {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .footer-nav-title {
          font-family: 'Poppins', sans-serif;
          font-size: 1rem;
          font-weight: 700;
          color: white;
          margin: 0;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          position: relative;
          padding-bottom: 0.75rem;
        }

        .footer-nav-title::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 32px;
          height: 2px;
          background: #2563eb;
          border-radius: 9999px;
        }

        .footer-nav-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .footer-nav-link {
          font-size: 1rem;
          color: #94a3b8;
          text-decoration: none;
          transition: all 0.3s ease;
          display: inline-block;
          position: relative;
          padding-left: 0;
        }

        .footer-nav-link::before {
          content: '';
          position: absolute;
          left: -16px;
          top: 50%;
          transform: translateY(-50%);
          width: 0;
          height: 2px;
          background: #2563eb;
          transition: width 0.3s ease;
        }

        .footer-nav-link:hover {
          color: #2563eb;
          padding-left: 16px;
        }

        .footer-nav-link:hover::before {
          width: 8px;
        }

        .footer-divider {
          height: 1px;
          background: #334155;
          margin: clamp(2rem, 4vw, 3rem) 0;
          position: relative;
        }

        .footer-bottom {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 2rem;
        }

        .footer-copyright-text {
          font-size: 0.875rem;
          color: #94a3b8;
          margin: 0;
          line-height: 1.625;
        }

        .footer-social {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }

        .footer-social-label {
          font-size: 0.875rem;
          font-weight: 500;
          color: white;
          letter-spacing: 0.05em;
        }

        .footer-social-links {
          display: flex;
          gap: 0.75rem;
        }

        .footer-social-link {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 44px;
          height: 44px;
          border-radius: 0.75rem;
          background: #1e293b;
          border: 1px solid #334155;
          color: #94a3b8;
          text-decoration: none;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .footer-social-link::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 0;
          height: 0;
          border-radius: 50%;
          background: #2563eb;
          transform: translate(-50%, -50%);
          transition: all 0.4s ease;
          z-index: 1;
        }

        .footer-social-link:hover::before {
          width: 100%;
          height: 100%;
        }

        .footer-social-link svg {
          position: relative;
          z-index: 2;
          transition: stroke 0.3s ease;
        }

        .footer-social-link:hover {
          border-color: #2563eb;
          box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
          transform: translateY(-2px);
        }

        .footer-social-link:hover svg {
          stroke: white;
        }

        .footer-back-to-top {
          position: fixed;
          bottom: 2rem;
          right: 2rem;
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background: #2563eb;
          border: none;
          color: white;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1);
          opacity: 0;
          visibility: hidden;
          transform: translateY(20px);
          transition: all 0.4s ease;
          z-index: 1000;
        }

        .footer-back-to-top.footer-visible {
          opacity: 1;
          visibility: visible;
          transform: translateY(0);
        }

        .footer-back-to-top:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 24px rgba(37, 99, 235, 0.4);
        }

        .footer-back-to-top svg {
          stroke: white;
        }

        @media (max-width: 991px) {
          .footer-top {
            grid-template-columns: 1fr;
            gap: clamp(2rem, 4vw, 3rem);
          }

          .footer-nav-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 1.5rem;
          }

          .footer-bottom {
            flex-direction: column;
            align-items: flex-start;
            gap: 1.5rem;
          }

          .footer-social {
            width: 100%;
            justify-content: space-between;
          }
        }

        @media (max-width: 767px) {
          .footer-container {
            padding: clamp(2.5rem, 5vw, 4rem) 1rem;
          }

          .footer-nav-grid {
            grid-template-columns: 1fr;
            gap: 2rem;
          }

          .footer-social {
            flex-direction: column;
            align-items: flex-start;
          }

          .footer-social-links {
            width: 100%;
            justify-content: flex-start;
          }

          .footer-back-to-top {
            bottom: 1.5rem;
            right: 1.5rem;
            width: 48px;
            height: 48px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>

      <script dangerouslySetSetInnerHTML={{__html: `
        (function() {
          // Navigation
          const navigation = document.getElementById('mainNavigation');
          const toggle = document.getElementById('navigationToggle');
          const menu = document.getElementById('navigationMenu');
          const backdrop = document.getElementById('navigationBackdrop');
          const links = menu ? menu.querySelectorAll('.navigation__link') : [];

          function toggleMenu() {
            const isOpen = toggle.getAttribute('aria-expanded') === 'true';
            toggle.setAttribute('aria-expanded', !isOpen);
            menu.classList.toggle('navigation__menu--open');
            backdrop.classList.toggle('navigation__backdrop--active');
            
            if (!isOpen) {
              document.body.style.overflow = 'hidden';
            } else {
              document.body.style.overflow = '';
            }
          }

          function closeMenu() {
            toggle.setAttribute('aria-expanded', 'false');
            menu.classList.remove('navigation__menu--open');
            backdrop.classList.remove('navigation__backdrop--active');
            document.body.style.overflow = '';
          }

          function handleLinkClick() {
            if (window.innerWidth <= 767) {
              closeMenu();
            }
          }

          function handleScroll() {
            if (window.scrollY > 10) {
              navigation.classList.add('navigation--scrolled');
            } else {
              navigation.classList.remove('navigation--scrolled');
            }
          }

          if (toggle && menu && backdrop) {
            toggle.addEventListener('click', toggleMenu);
            backdrop.addEventListener('click', closeMenu);
            links.forEach(link => link.addEventListener('click', handleLinkClick));
            window.addEventListener('scroll', handleScroll);

            window.addEventListener('resize', () => {
              if (window.innerWidth > 767) {
                closeMenu();
              }
            });

            document.addEventListener('keydown', (e) => {
              if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
                closeMenu();
              }
            });
          }

          // Back to Top
          const backToTopButton = document.getElementById('back-to-top');

          function handleBackToTopScroll() {
            if (window.scrollY > 500) {
              backToTopButton.classList.add('footer-visible');
            } else {
              backToTopButton.classList.remove('footer-visible');
            }
          }

          window.addEventListener('scroll', handleBackToTopScroll);

          if (backToTopButton) {
            backToTopButton.addEventListener('click', function() {
              window.scrollTo({
                top: 0,
                behavior: 'smooth'
              });
            });
          }
        })();
      `}} />
    </div>
  );
}