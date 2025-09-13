import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import MonitoringGrid from '@/components/MonitoringGrid';
import AlertPanel from '@/components/AlertPanel';
import SystemMetrics from '@/components/SystemMetrics';
import PersonnelManager from '@/components/PersonnelManager';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { 
  Shield, 
  MapPin, 
  Phone, 
  Mail, 
  AlertTriangle, 
  Activity,
  Users,
  Zap,
  Eye
} from 'lucide-react';

interface Profile {
  full_name: string;
  site_name: string;
  email: string;
  mobile_number: string;
  site_latitude?: number;
  site_longitude?: number;
}

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await (supabase as any)
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching profile:', error);
        return;
      }

      setProfile(data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const statusCards = [
    {
      title: 'System Status',
      value: 'OPERATIONAL',
      icon: Shield,
      status: 'safe',
      description: 'All systems functioning normally'
    },
    {
      title: 'Active Monitors',
      value: '12',
      icon: Eye,
      status: 'safe',
      description: 'Surveillance systems online'
    },
    {
      title: 'Alert Level',
      value: 'LOW',
      icon: AlertTriangle,
      status: 'safe',
      description: 'No immediate threats detected'
    },
    {
      title: 'Personnel',
      value: '8',
      icon: Users,
      status: 'safe',
      description: 'Staff members on duty'
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="processing-indicator text-lg">Loading FALCON Command Center...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="glass rounded-xl p-6 border border-border/50">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">
                  Welcome back, {profile?.full_name || 'Operator'}
                </h1>
                <p className="text-muted-foreground">
                  FALCON Command Center • {profile?.site_name || 'Site Location'}
                </p>
              </div>
              <div className="hidden md:flex items-center space-x-4">
                <Badge variant="secondary" className="bg-safe/20 text-safe border-safe/30">
                  <Activity className="w-3 h-3 mr-1" />
                  System Online
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Status Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statusCards.map((card, index) => (
            <Card key={index} className="glass border-border/50 hover:border-primary/30 transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {card.title}
                </CardTitle>
                <card.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground mb-1">{card.value}</div>
                <p className="text-xs text-muted-foreground">{card.description}</p>
                <Badge 
                  className={`mt-2 status-${card.status}`}
                  variant="outline"
                >
                  {card.status.toUpperCase()}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Advanced Monitoring Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8">
          <MonitoringGrid />
          <AlertPanel />
        </div>

        {/* System Health */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8">
          <SystemMetrics />
          <PersonnelManager />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Site Information */}
          <Card className="glass border-border/50 lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                Site Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Shield className="h-4 w-4 text-muted-foreground mt-1" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Site Name</p>
                    <p className="text-sm text-muted-foreground">{profile?.site_name || 'Not configured'}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Mail className="h-4 w-4 text-muted-foreground mt-1" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Contact Email</p>
                    <p className="text-sm text-muted-foreground">{profile?.email || 'Not configured'}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="h-4 w-4 text-muted-foreground mt-1" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Mobile</p>
                    <p className="text-sm text-muted-foreground">{profile?.mobile_number || 'Not configured'}</p>
                  </div>
                </div>

                {(profile?.site_latitude && profile?.site_longitude) && (
                  <div className="flex items-start gap-3">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
                    <div>
                      <p className="text-sm font-medium text-foreground">Coordinates</p>
                      <p className="text-sm text-muted-foreground">
                        {profile.site_latitude.toFixed(6)}, {profile.site_longitude.toFixed(6)}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <Button variant="outline" className="w-full mt-4">
                Update Site Information
              </Button>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="glass border-border/50 lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-primary" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button variant="outline" className="flex flex-col items-center gap-2 h-auto p-4">
                  <Shield className="h-6 w-6" />
                  <span className="text-sm">Emergency Alert</span>
                </Button>
                <Button variant="outline" className="flex flex-col items-center gap-2 h-auto p-4">
                  <Eye className="h-6 w-6" />
                  <span className="text-sm">View All Cameras</span>  
                </Button>
                <Button variant="outline" className="flex flex-col items-center gap-2 h-auto p-4">
                  <Users className="h-6 w-6" />
                  <span className="text-sm">Contact Personnel</span>
                </Button>
                <Button variant="outline" className="flex flex-col items-center gap-2 h-auto p-4">
                  <Activity className="h-6 w-6" />
                  <span className="text-sm">System Reports</span>
                </Button>
              </div>

              <div className="mt-6 p-4 bg-primary/10 rounded-lg border border-primary/20">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="h-5 w-5 text-primary" />
                  <span className="font-medium text-primary">FALCON System Status</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  All security systems operational. Last full system check: {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;