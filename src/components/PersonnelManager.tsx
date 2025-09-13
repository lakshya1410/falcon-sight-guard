import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  Users, 
  Clock, 
  MapPin, 
  Phone, 
  Shield,
  CheckCircle,
  AlertCircle,
  UserCheck,
  Radio
} from 'lucide-react';

interface Personnel {
  id: string;
  name: string;
  role: string;
  status: 'on-duty' | 'off-duty' | 'break' | 'patrol';
  location: string;
  shiftStart: Date;
  contact: string;
  lastCheckIn: Date;
}

const PersonnelManager: React.FC = () => {
  const [personnel] = useState<Personnel[]>([
    {
      id: '1',
      name: 'John Rodriguez',
      role: 'Security Chief',
      status: 'on-duty',
      location: 'Control Room',
      shiftStart: new Date(Date.now() - 4 * 60 * 60 * 1000),
      contact: '+1-555-0101',
      lastCheckIn: new Date(Date.now() - 15 * 60 * 1000)
    },
    {
      id: '2',
      name: 'Sarah Chen',
      role: 'Patrol Officer',
      status: 'patrol',
      location: 'Building Perimeter',
      shiftStart: new Date(Date.now() - 3 * 60 * 60 * 1000),
      contact: '+1-555-0102',
      lastCheckIn: new Date(Date.now() - 8 * 60 * 1000)
    },
    {
      id: '3',
      name: 'Mike Johnson',
      role: 'Gate Security',
      status: 'on-duty',
      location: 'Main Entrance',
      shiftStart: new Date(Date.now() - 5 * 60 * 60 * 1000),
      contact: '+1-555-0103',
      lastCheckIn: new Date(Date.now() - 5 * 60 * 1000)
    },
    {
      id: '4',
      name: 'Lisa Park',
      role: 'Systems Monitor',
      status: 'break',
      location: 'Break Room',
      shiftStart: new Date(Date.now() - 6 * 60 * 60 * 1000),
      contact: '+1-555-0104',
      lastCheckIn: new Date(Date.now() - 20 * 60 * 1000)
    },
    {
      id: '5',
      name: 'David Wilson',
      role: 'Patrol Officer',
      status: 'patrol',
      location: 'Parking Structure',
      shiftStart: new Date(Date.now() - 2 * 60 * 60 * 1000),
      contact: '+1-555-0105',
      lastCheckIn: new Date(Date.now() - 12 * 60 * 1000)
    },
    {
      id: '6',
      name: 'Emma Thompson',
      role: 'Incident Response',
      status: 'on-duty',
      location: 'Ready Room',
      shiftStart: new Date(Date.now() - 3.5 * 60 * 60 * 1000),
      contact: '+1-555-0106',
      lastCheckIn: new Date(Date.now() - 3 * 60 * 1000)
    }
  ]);

  const getStatusIcon = (status: Personnel['status']) => {
    switch (status) {
      case 'on-duty':
        return <CheckCircle className="h-4 w-4 text-safe" />;
      case 'patrol':
        return <Radio className="h-4 w-4 text-primary" />;
      case 'break':
        return <Clock className="h-4 w-4 text-medium-risk" />;
      case 'off-duty':
        return <AlertCircle className="h-4 w-4 text-muted-foreground" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getStatusBadge = (status: Personnel['status']) => {
    switch (status) {
      case 'on-duty':
        return <Badge className="status-safe">ON DUTY</Badge>;
      case 'patrol':
        return <Badge className="bg-primary/20 text-primary border-primary/30">PATROL</Badge>;
      case 'break':
        return <Badge className="status-medium">ON BREAK</Badge>;
      case 'off-duty':
        return <Badge variant="outline">OFF DUTY</Badge>;
      default:
        return <Badge variant="outline">UNKNOWN</Badge>;
    }
  };

  const formatShiftTime = (date: Date) => {
    const hours = Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60));
    const minutes = Math.floor(((Date.now() - date.getTime()) % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  const formatLastCheckIn = (date: Date) => {
    const minutes = Math.floor((Date.now() - date.getTime()) / (1000 * 60));
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    return `${Math.floor(minutes / 60)}h ago`;
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n.charAt(0)).join('');
  };

  return (
    <Card className="glass border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" />
          Personnel Status
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {personnel.map((person) => (
            <div
              key={person.id}
              className="p-4 bg-card/30 rounded-lg border border-border/30 hover:border-primary/30 transition-all duration-300"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-primary/20 text-primary font-medium">
                      {getInitials(person.name)}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-foreground">{person.name}</h4>
                      {getStatusIcon(person.status)}
                    </div>
                    <p className="text-sm text-muted-foreground">{person.role}</p>
                  </div>
                </div>

                <div className="text-right">
                  {getStatusBadge(person.status)}
                </div>
              </div>

              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{person.location}</span>
                </div>
                
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>Shift: {formatShiftTime(person.shiftStart)}</span>
                </div>

                <div className="flex items-center gap-2 text-muted-foreground">
                  <UserCheck className="h-4 w-4" />
                  <span>Check-in: {formatLastCheckIn(person.lastCheckIn)}</span>
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  <span>{person.contact}</span>
                </div>
                
                <Button size="sm" variant="outline">
                  Contact
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Personnel Summary */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-muted/10 rounded-lg">
            <div className="text-lg font-bold text-safe">
              {personnel.filter(p => p.status === 'on-duty').length}
            </div>
            <div className="text-sm text-muted-foreground">On Duty</div>
          </div>
          
          <div className="text-center p-3 bg-muted/10 rounded-lg">
            <div className="text-lg font-bold text-primary">
              {personnel.filter(p => p.status === 'patrol').length}
            </div>
            <div className="text-sm text-muted-foreground">On Patrol</div>
          </div>
          
          <div className="text-center p-3 bg-muted/10 rounded-lg">
            <div className="text-lg font-bold text-medium-risk">
              {personnel.filter(p => p.status === 'break').length}
            </div>
            <div className="text-sm text-muted-foreground">On Break</div>
          </div>
          
          <div className="text-center p-3 bg-muted/10 rounded-lg">
            <div className="text-lg font-bold text-foreground">
              {personnel.filter(p => p.status === 'off-duty').length}
            </div>
            <div className="text-sm text-muted-foreground">Off Duty</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PersonnelManager;