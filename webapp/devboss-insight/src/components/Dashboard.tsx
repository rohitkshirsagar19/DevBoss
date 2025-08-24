import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Bot, 
  GitBranch, 
  Users, 
  Eye, 
  CheckCircle, 
  Shield, 
  FileText,
  Activity,
  Clock,
  TrendingUp,
  AlertTriangle,
  PlayCircle,
  PauseCircle,
  StopCircle
} from 'lucide-react';
import { AgentCard } from './AgentCard';
import { ProjectInput } from './ProjectInput';
import { ActivityFeed } from './ActivityFeed';
import { MetricsDashboard } from './MetricsDashboard';

export interface Agent {
  id: string;
  name: string;
  role: string;
  status: 'active' | 'idle' | 'processing' | 'error';
  icon: React.ElementType;
  color: string;
  currentTask?: string;
  lastActivity?: string;
  performance: number;
}

export interface SystemMetrics {
  tasksCompleted: number;
  avgResolutionTime: string;
  successRate: number;
  activeProjects: number;
  currentLoad: number;
}

const Dashboard: React.FC = () => {
  const [systemStatus, setSystemStatus] = useState<'running' | 'paused' | 'stopped'>('running');
  const [agents, setAgents] = useState<Agent[]>([
    {
      id: 'coordinator',
      name: 'Coordinator',
      role: 'Workflow Orchestration',
      status: 'active',
      icon: Bot,
      color: 'coordinator',
      currentTask: 'Managing bug fix workflow',
      lastActivity: '2 minutes ago',
      performance: 94
    },
    {
      id: 'allocator',
      name: 'Allocator',
      role: 'Task Assignment',
      status: 'processing',
      icon: Users,
      color: 'allocator',
      currentTask: 'Assigning code review tasks',
      lastActivity: '30 seconds ago',
      performance: 87
    },
    {
      id: 'tracker',
      name: 'Tracker',
      role: 'Progress Monitoring',
      status: 'active',
      icon: Eye,
      color: 'tracker',
      currentTask: 'Polling GitHub API',
      lastActivity: '1 minute ago',
      performance: 91
    },
    {
      id: 'reviewer',
      name: 'Reviewer',
      role: 'Code Review & QA',
      status: 'processing',
      icon: CheckCircle,
      color: 'reviewer',
      currentTask: 'Analyzing PR #247',
      lastActivity: '45 seconds ago',
      performance: 89
    },
    {
      id: 'resolver',
      name: 'Resolver',
      role: 'Conflict Resolution',
      status: 'idle',
      icon: Shield,
      color: 'resolver',
      currentTask: 'Standby',
      lastActivity: '10 minutes ago',
      performance: 96
    },
    {
      id: 'reporter',
      name: 'Reporter',
      role: 'Analytics & Reports',
      status: 'active',
      icon: FileText,
      color: 'reporter',
      currentTask: 'Generating performance report',
      lastActivity: '3 minutes ago',
      performance: 92
    }
  ]);

  const [metrics, setMetrics] = useState<SystemMetrics>({
    tasksCompleted: 147,
    avgResolutionTime: '2.3h',
    successRate: 94.2,
    activeProjects: 8,
    currentLoad: 67
  });

  const [escalationCount, setEscalationCount] = useState(3);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setAgents(prev => prev.map(agent => ({
        ...agent,
        performance: Math.max(75, Math.min(100, agent.performance + (Math.random() - 0.5) * 2))
      })));

      setMetrics(prev => ({
        ...prev,
        tasksCompleted: prev.tasksCompleted + Math.floor(Math.random() * 2),
        currentLoad: Math.max(0, Math.min(100, prev.currentLoad + (Math.random() - 0.5) * 5))
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const handleSystemControl = (action: 'play' | 'pause' | 'stop') => {
    switch (action) {
      case 'play':
        setSystemStatus('running');
        break;
      case 'pause':
        setSystemStatus('paused');
        break;
      case 'stop':
        setSystemStatus('stopped');
        break;
    }
  };

  const getStatusColor = () => {
    switch (systemStatus) {
      case 'running': return 'success';
      case 'paused': return 'warning';
      case 'stopped': return 'error';
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-hero bg-clip-text text-transparent">
              DevBoss Swarm
            </h1>
            <p className="text-muted-foreground mt-2">
              Multi-Agent AI IT Management System
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            {/* System Controls */}
            <div className="flex items-center gap-2">
              <Button
                variant={systemStatus === 'running' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleSystemControl('play')}
                className="gap-2"
              >
                <PlayCircle className="h-4 w-4" />
                Run
              </Button>
              <Button
                variant={systemStatus === 'paused' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleSystemControl('pause')}
                className="gap-2"
              >
                <PauseCircle className="h-4 w-4" />
                Pause
              </Button>
              <Button
                variant={systemStatus === 'stopped' ? 'destructive' : 'outline'}
                size="sm"
                onClick={() => handleSystemControl('stop')}
                className="gap-2"
              >
                <StopCircle className="h-4 w-4" />
                Stop
              </Button>
            </div>

            {/* System Status */}
            <Badge 
              variant="secondary" 
              className={`animate-pulse-glow border-${getStatusColor()} text-${getStatusColor()}`}
            >
              <Activity className="h-3 w-3 mr-1" />
              {systemStatus.toUpperCase()}
            </Badge>

            {/* Escalations */}
            {escalationCount > 0 && (
              <Badge variant="destructive" className="animate-pulse">
                <AlertTriangle className="h-3 w-3 mr-1" />
                {escalationCount} Escalations
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-12 gap-6">
        {/* Left Column - Project Input & Controls */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          <ProjectInput onSubmit={(project) => console.log('Project submitted:', project)} />
          
          {/* Quick Metrics */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-success" />
                System Performance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Current Load</span>
                <span className="font-semibold">{metrics.currentLoad}%</span>
              </div>
              <Progress value={metrics.currentLoad} className="h-2" />
              
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="text-center">
                  <div className="text-2xl font-bold text-success">{metrics.tasksCompleted}</div>
                  <div className="text-xs text-muted-foreground">Tasks Completed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{metrics.successRate}%</div>
                  <div className="text-xs text-muted-foreground">Success Rate</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Center Column - Agent Grid */}
        <div className="col-span-12 lg:col-span-8">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-6">
            {agents.map((agent) => (
              <AgentCard 
                key={agent.id} 
                agent={agent}
                systemStatus={systemStatus}
              />
            ))}
          </div>

          {/* Activity Feed */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Live Agent Activity
              </CardTitle>
              <CardDescription>
                Real-time communication between agents
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ActivityFeed systemStatus={systemStatus} />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Bottom Section - Detailed Analytics */}
      <div className="mt-8">
        <MetricsDashboard metrics={metrics} />
      </div>
    </div>
  );
};

export default Dashboard;