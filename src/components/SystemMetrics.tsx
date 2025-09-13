import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Cpu, 
  HardDrive, 
  Wifi, 
  Zap, 
  Thermometer,
  Server,
  Database,
  Shield
} from 'lucide-react';

interface SystemMetric {
  name: string;
  value: number;
  unit: string;
  icon: React.ElementType;
  status: 'good' | 'warning' | 'critical';
  description: string;
}

const SystemMetrics: React.FC = () => {
  const [metrics, setMetrics] = useState<SystemMetric[]>([
    {
      name: 'CPU Usage',
      value: 23,
      unit: '%',
      icon: Cpu,
      status: 'good',
      description: 'Processor utilization'
    },
    {
      name: 'Memory',
      value: 68,
      unit: '%',
      icon: Database,
      status: 'warning',
      description: 'RAM utilization'
    },
    {
      name: 'Storage',
      value: 45,
      unit: '%',
      icon: HardDrive,
      status: 'good',
      description: 'Disk space used'
    },
    {
      name: 'Network',
      value: 12,
      unit: 'Mbps',
      icon: Wifi,
      status: 'good',
      description: 'Data throughput'
    },
    {
      name: 'Temperature',
      value: 38,
      unit: '°C',
      icon: Thermometer,
      status: 'good',
      description: 'System temperature'
    },
    {
      name: 'Power',
      value: 87,
      unit: '%',
      icon: Zap,
      status: 'good',
      description: 'UPS battery level'
    }
  ]);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => prev.map(metric => ({
        ...metric,
        value: Math.max(0, Math.min(100, 
          metric.value + (Math.random() - 0.5) * 10
        )),
        status: getStatusFromValue(metric.value, metric.name)
      })));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getStatusFromValue = (value: number, name: string): 'good' | 'warning' | 'critical' => {
    if (name === 'Temperature') {
      if (value > 70) return 'critical';
      if (value > 55) return 'warning';
      return 'good';
    }
    
    if (name === 'Power') {
      if (value < 20) return 'critical';
      if (value < 40) return 'warning';
      return 'good';
    }

    // CPU, Memory, Storage
    if (value > 90) return 'critical';
    if (value > 75) return 'warning';
    return 'good';
  };

  const getStatusColor = (status: 'good' | 'warning' | 'critical') => {
    switch (status) {
      case 'good':
        return 'text-safe';
      case 'warning':
        return 'text-medium-risk';
      case 'critical':
        return 'text-critical';
      default:
        return 'text-muted-foreground';
    }
  };

  const getProgressColor = (status: 'good' | 'warning' | 'critical') => {
    switch (status) {
      case 'good':
        return '';
      case 'warning':
        return '[&>div]:bg-medium-risk';
      case 'critical':
        return '[&>div]:bg-critical';
      default:
        return '';
    }
  };

  return (
    <Card className="glass border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Server className="h-5 w-5 text-primary" />
          System Metrics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {metrics.map((metric, index) => (
            <div
              key={index}
              className="space-y-3 p-4 bg-muted/10 rounded-lg border border-border/20"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <metric.icon className={`h-4 w-4 ${getStatusColor(metric.status)}`} />
                  <span className="font-medium text-foreground">{metric.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`font-bold ${getStatusColor(metric.status)}`}>
                    {Math.round(metric.value)}{metric.unit}
                  </span>
                  <Badge 
                    variant="outline" 
                    className={`status-${metric.status}`}
                  >
                    {metric.status.toUpperCase()}
                  </Badge>
                </div>
              </div>

              <Progress 
                value={metric.value} 
                className={`h-2 ${getProgressColor(metric.status)}`}
              />

              <p className="text-xs text-muted-foreground">
                {metric.description}
              </p>
            </div>
          ))}
        </div>

        {/* System Health Summary */}
        <div className="mt-6 p-4 bg-card/20 rounded-lg border border-border/30">
          <div className="flex items-center gap-2 mb-3">
            <Shield className="h-5 w-5 text-primary" />
            <h4 className="font-medium text-foreground">System Health</h4>
          </div>
          
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-lg font-bold text-safe">
                {metrics.filter(m => m.status === 'good').length}
              </div>
              <div className="text-sm text-muted-foreground">Optimal</div>
            </div>
            <div>
              <div className="text-lg font-bold text-medium-risk">
                {metrics.filter(m => m.status === 'warning').length}
              </div>
              <div className="text-sm text-muted-foreground">Warnings</div>
            </div>
            <div>
              <div className="text-lg font-bold text-critical">
                {metrics.filter(m => m.status === 'critical').length}
              </div>
              <div className="text-sm text-muted-foreground">Critical</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SystemMetrics;