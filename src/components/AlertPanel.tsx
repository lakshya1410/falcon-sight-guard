import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  AlertTriangle, 
  AlertCircle, 
  Info, 
  CheckCircle,
  Clock,
  MapPin,
  User
} from 'lucide-react';

interface Alert {
  id: string;
  type: 'critical' | 'high' | 'medium' | 'safe' | 'info';
  title: string;
  message: string;
  timestamp: Date;
  location?: string;
  acknowledged: boolean;
}

const AlertPanel: React.FC = () => {
  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: '1',
      type: 'safe',
      title: 'All Systems Operational',
      message: 'FALCON security systems are running normally',
      timestamp: new Date(),
      location: 'Main Control',
      acknowledged: true
    },
    {
      id: '2',
      type: 'info',
      title: 'Routine Patrol',
      message: 'Security patrol completed - Sector A',
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      location: 'Sector A',
      acknowledged: true
    },
    {
      id: '3',
      type: 'medium',
      title: 'Maintenance Reminder',
      message: 'Camera system maintenance due in 48 hours',
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
      location: 'Equipment Bay',
      acknowledged: false
    }
  ]);

  const getAlertIcon = (type: Alert['type']) => {
    switch (type) {
      case 'critical':
        return <AlertTriangle className="h-4 w-4 text-critical" />;
      case 'high':
        return <AlertCircle className="h-4 w-4 text-high-risk" />;
      case 'medium':
        return <AlertTriangle className="h-4 w-4 text-medium-risk" />;
      case 'safe':
        return <CheckCircle className="h-4 w-4 text-safe" />;
      case 'info':
        return <Info className="h-4 w-4 text-primary" />;
      default:
        return <Info className="h-4 w-4" />;
    }
  };

  const getAlertBadgeVariant = (type: Alert['type']) => {
    switch (type) {
      case 'critical':
        return 'destructive';
      case 'high':
        return 'destructive';  
      case 'medium':
        return 'secondary';
      case 'safe':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const acknowledgeAlert = (alertId: string) => {
    setAlerts(prev => 
      prev.map(alert => 
        alert.id === alertId ? { ...alert, acknowledged: true } : alert
      )
    );
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (minutes < 1440) return `${Math.floor(minutes / 60)}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <Card className="glass border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-primary" />
          Alert Center
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-4 rounded-lg border transition-all duration-300 ${
                alert.acknowledged 
                  ? 'bg-muted/20 border-border/30 opacity-75' 
                  : 'bg-card/50 border-border/50 hover:border-primary/30'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  {getAlertIcon(alert.type)}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-sm font-medium text-foreground">
                        {alert.title}
                      </h4>
                      <Badge 
                        variant={getAlertBadgeVariant(alert.type)}
                        className={`status-${alert.type}`}
                      >
                        {alert.type.toUpperCase()}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {alert.message}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatTime(alert.timestamp)}
                      </div>
                      {alert.location && (
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {alert.location}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                {!alert.acknowledged && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => acknowledgeAlert(alert.id)}
                    className="ml-3"
                  >
                    Acknowledge
                  </Button>
                )}
              </div>
            </div>
          ))}

          {alerts.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <CheckCircle className="h-12 w-12 mx-auto mb-3 text-safe" />
              <p>No active alerts</p>
              <p className="text-sm">All systems operating normally</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AlertPanel;