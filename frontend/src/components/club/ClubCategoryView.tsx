import { motion } from 'motion/react';
import { ArrowLeft, Users, Calendar, Award } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { User } from '../../App';

interface Club {
  id: string;
  name: string;
  category: string;
  description: string;
  members: number;
  founded: string;
  logo: string;
  achievements: number;
}

interface ClubCategoryViewProps {
  category: string;
  onNavigate: (page: string, params?: any) => void;
  user: User | null;
  onLogout: () => void;
}

const clubsByCategory: Record<string, Club[]> = {
  'Tech': [
    { id: 'acm', name: 'ACM Chapter', category: 'Tech', description: 'Association for Computing Machinery - Leading tech community', members: 120, founded: '2015', logo: '💻', achievements: 15 },
    { id: 'ieee', name: 'IEEE Student Branch', category: 'Tech', description: 'Institute of Electrical and Electronics Engineers', members: 95, founded: '2016', logo: '⚡', achievements: 12 },
    { id: 'gdsc', name: 'Google DSC', category: 'Tech', description: 'Google Developer Student Clubs', members: 150, founded: '2019', logo: '🔷', achievements: 20 },
    { id: 'csi', name: 'CSI Student Chapter', category: 'Tech', description: 'Computer Society of India', members: 85, founded: '2017', logo: '🖥️', achievements: 10 }
  ],
  'Cultural': [
    { id: 'dramatics', name: 'Dramatics Club', category: 'Cultural', description: 'Theater and performing arts', members: 75, founded: '2014', logo: '🎭', achievements: 18 },
    { id: 'music', name: 'Music Society', category: 'Cultural', description: 'Vocal and instrumental music', members: 90, founded: '2013', logo: '🎵', achievements: 22 },
    { id: 'dance', name: 'Dance Troupe', category: 'Cultural', description: 'Various dance forms and performances', members: 65, founded: '2015', logo: '💃', achievements: 16 },
    { id: 'art', name: 'Fine Arts Club', category: 'Cultural', description: 'Painting, sketching, and visual arts', members: 55, founded: '2016', logo: '🎨', achievements: 14 }
  ],
  'Sports': [
    { id: 'cricket', name: 'Cricket Club', category: 'Sports', description: 'College cricket team and enthusiasts', members: 80, founded: '2012', logo: '🏏', achievements: 25 },
    { id: 'basketball', name: 'Basketball Team', category: 'Sports', description: 'Competitive basketball team', members: 45, founded: '2013', logo: '🏀', achievements: 19 },
    { id: 'football', name: 'Football Club', category: 'Sports', description: 'College football team', members: 70, founded: '2011', logo: '⚽', achievements: 23 },
    { id: 'athletics', name: 'Athletics Club', category: 'Sports', description: 'Track and field events', members: 60, founded: '2014', logo: '🏃', achievements: 21 }
  ],
  'Literature': [
    { id: 'debating', name: 'Debating Society', category: 'Literature', description: 'Debate competitions and public speaking', members: 50, founded: '2015', logo: '🗣️', achievements: 17 },
    { id: 'writing', name: 'Writers Club', category: 'Literature', description: 'Creative writing and literature', members: 40, founded: '2016', logo: '✍️', achievements: 11 },
    { id: 'quiz', name: 'Quiz Club', category: 'Literature', description: 'General knowledge and quiz competitions', members: 55, founded: '2017', logo: '❓', achievements: 13 }
  ],
  'Social': [
    { id: 'nss', name: 'NSS Unit', category: 'Social', description: 'National Service Scheme - Community service', members: 110, founded: '2010', logo: '🤝', achievements: 30 },
    { id: 'rotaract', name: 'Rotaract Club', category: 'Social', description: 'Community development and social service', members: 75, founded: '2014', logo: '🌟', achievements: 24 },
    { id: 'eco', name: 'Eco Club', category: 'Social', description: 'Environmental awareness and conservation', members: 65, founded: '2015', logo: '🌱', achievements: 15 }
  ]
};

export default function ClubCategoryView({ category, onNavigate, user, onLogout }: ClubCategoryViewProps) {
  const clubs = clubsByCategory[category] || [];

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
              <Button variant="ghost" size="sm" onClick={() => onNavigate('clubs-landing')}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Clubs
              </Button>
              <span className="text-slate-900">{category} Clubs</span>
            </div>
            
            <div className="flex items-center gap-4">
              {user ? (
                <>
                  <span className="text-slate-600">Welcome, {user.name}</span>
                  <Button variant="outline" size="sm" onClick={onLogout}>
                    Logout
                  </Button>
                </>
              ) : (
                <Button variant="outline" size="sm" onClick={() => onNavigate('club-login')}>
                  Login
                </Button>
              )}
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="mb-2">{category} Clubs</h1>
          <p className="text-slate-600 mb-8">Explore all {category.toLowerCase()} clubs and their activities</p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {clubs.map((club, index) => (
              <motion.div
                key={club.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                whileHover={{ y: -4 }}
              >
                <Card className="h-full hover:shadow-xl transition-all duration-300 cursor-pointer border-2 hover:border-primary/20"
                  onClick={() => onNavigate('club-detail', { clubId: club.id, category })}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="text-5xl mb-3">{club.logo}</div>
                      <Badge variant="secondary">{club.category}</Badge>
                    </div>
                    <CardTitle>{club.name}</CardTitle>
                    <CardDescription className="line-clamp-2">{club.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-slate-600">
                        <Users className="w-4 h-4" />
                        <span>{club.members} members</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-600">
                        <Calendar className="w-4 h-4" />
                        <span>Founded {club.founded}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-600">
                        <Award className="w-4 h-4" />
                        <span>{club.achievements} achievements</span>
                      </div>
                    </div>
                    <Button variant="outline" className="w-full mt-4">
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}