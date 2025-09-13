import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Eye, 
  EyeOff, 
  Camera, 
  Monitor, 
  Wifi,
  WifiOff,
  Settings,
  Maximize,
  Activity
} from 'lucide-react';

interface Camera {
  id: string;
  name: string;
  location: string;
  status: 'online' | 'offline' | 'maintenance';
  lastSeen: Date;
  recording: boolean;
}

const MonitoringGrid: React.FC = () => {
  const [cameras] = useState<Camera[]>([
    {
      id: '1',
      name: 'Main Entrance',
      location: 'Gate A',
      status: 'online',
      lastSeen: new Date(),
      recording: true
    },
    {
      id: '2',
      name: 'Parking Lot North',
      location: 'Sector B',
      status: 'online',
      lastSeen: new Date(),
      recording: true
    },
    {
      id: '3',
      name: 'Building Perimeter',
      location: 'East Side',
      status: 'online',
      lastSeen: new Date(),
      recording: true
    },
    {
      id: '4',
      name: 'Emergency Exit',
      location: 'Back Exit',
      status: 'maintenance',
      lastSeen: new Date(Date.now() - 30 * 60 * 1000),
      recording: false
    },
    {
      id: '5',
      name: 'Loading Dock',
      location: 'West Side',
      status: 'online',
      lastSeen: new Date(),
      recording: true
    },
    {
      id: '6',
      name: 'Roof Access',
      location: 'Building Top',
      status: 'offline',
      lastSeen: new Date(Date.now() - 2 * 60 * 60 * 1000),
      recording: false
    }
  ]);

  const getStatusIcon = (status: Camera['status']) => {
    switch (status) {
      case 'online':
        return <Wifi className="h-4 w-4 text-safe" />;
      case 'offline':
        return <WifiOff className="h-4 w-4 text-critical" />;
      case 'maintenance':
        return <Settings className="h-4 w-4 text-medium-risk" />;
      default:
        return <WifiOff className="h-4 w-4" />;
    }
  };

  const getStatusBadge = (status: Camera['status']) => {
    switch (status) {
      case 'online':
        return <Badge className="status-safe">ONLINE</Badge>;
      case 'offline':
        return <Badge className="status-critical">OFFLINE</Badge>;
      case 'maintenance':
        return <Badge className="status-medium">MAINTENANCE</Badge>;
      default:
        return <Badge variant="outline">UNKNOWN</Badge>;
    }
  };

  const generateMockVideoFeed = () => {
    // Simulate a security camera feed with a dark pattern
    return "data:image/svg+xml;base64," + btoa(`
      <svg width="320" height="240" xmlns="http://www.w3.org/2000/svg">
        <rect width="320" height="240" fill="#1a1f2e"/>
        <circle cx="160" cy="120" r="50" fill="none" stroke="#666" stroke-width="2" stroke-dasharray="5,5">
          <animateTransform attributeName="transform" type="rotate" dur="4s" values="0 160 120;360 160 120" repeatCount="indefinite"/>
        </circle>
        <text x="160" y="130" text-anchor="middle" fill="#666" font-family="monospace" font-size="12">LIVE FEED</text>
        <text x="10" y="20" fill="#0f0" font-family="monospace" font-size="10">REC ●</text>
        <text x="10" y="230" fill="#666" font-family="monospace" font-size="8">${new Date().toLocaleString()}</text>
      </svg>
    `);
  };

  return (
    <Card className="glass border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Monitor className="h-5 w-5 text-primary" />
          Surveillance Grid
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {cameras.map((camera) => (
            <div
              key={camera.id}
              className="bg-card/30 rounded-lg border border-border/30 overflow-hidden hover:border-primary/30 transition-all duration-300"
            >
              {/* Video Feed Area */}
              <div className="relative aspect-video bg-muted/20 border-b border-border/30">
                {camera.status === 'online' ? (
                  <img
                    src={generateMockVideoFeed()}
                    alt={`${camera.name} feed`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-muted/10">
                    <div className="text-center">
                      <EyeOff className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        {camera.status === 'offline' ? 'Camera Offline' : 'Under Maintenance'}
                      </p>
                    </div>
                  </div>
                )}
                
                {/* Overlay Controls */}
                <div className="absolute top-2 right-2 flex gap-1">
                  <Button size="sm" variant="outline" className="h-6 w-6 p-0 bg-background/80">
                    <Maximize className="h-3 w-3" />
                  </Button>
                </div>

                {/* Recording Indicator */}
                {camera.recording && (
                  <div className="absolute top-2 left-2 flex items-center gap-1 text-xs bg-red-500/20 text-red-400 px-2 py-1 rounded">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                    REC
                  </div>
                )}
              </div>

              {/* Camera Info */}
              <div className="p-3">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-foreground text-sm">{camera.name}</h4>
                  {getStatusIcon(camera.status)}
                </div>
                
                <p className="text-xs text-muted-foreground mb-2">{camera.location}</p>
                
                <div className="flex items-center justify-between">
                  {getStatusBadge(camera.status)}
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Activity className="h-3 w-3" />
                    {camera.status === 'online' ? 'Live' : 
                     camera.lastSeen.toLocaleTimeString()}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary Stats */}
        <div className="mt-6 grid grid-cols-3 gap-4">
          <div className="text-center p-3 bg-muted/10 rounded-lg">
            <div className="text-lg font-bold text-safe">
              {cameras.filter(c => c.status === 'online').length}
            </div>
            <div className="text-sm text-muted-foreground">Online</div>
          </div>
          <div className="text-center p-3 bg-muted/10 rounded-lg">
            <div className="text-lg font-bold text-medium-risk">
              {cameras.filter(c => c.status === 'maintenance').length}
            </div>
            <div className="text-sm text-muted-foreground">Maintenance</div>
          </div>
          <div className="text-center p-3 bg-muted/10 rounded-lg">
            <div className="text-lg font-bold text-critical">
              {cameras.filter(c => c.status === 'offline').length}
            </div>
            <div className="text-sm text-muted-foreground">Offline</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MonitoringGrid;