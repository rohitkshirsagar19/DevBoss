import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Bot, GitBranch, Users, Eye, CheckCircle, Shield, FileText,
  Activity, Clock, TrendingUp, AlertTriangle, PlayCircle, PauseCircle, StopCircle
} from 'lucide-react';
import { AgentCard } from './AgentCard';
import { ProjectInput } from './ProjectInput';
// Import the component AND the message type
import { ActivityFeed, ActivityMessage } from './ActivityFeed'; 
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
  tasksCompleted: number; avgResolutionTime: string; successRate: number; activeProjects: number; currentLoad: number;
}

const Dashboard: React.FC = () => {
  // --- STATE MANAGEMENT ---
  // The Dashboard now controls the application's state
  const [systemStatus, setSystemStatus] = useState<'running' | 'paused' | 'stopped'>('stopped');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ActivityMessage[]>([]);
  const [escalationCount, setEscalationCount] = useState(0); // Kept for UI

  // The agent data is kept for display, but status is now dynamic
  const [agents, setAgents] = useState<Agent[]>([
    { id: 'coordinator', name: 'Coordinator', role: 'Workflow Orchestration', status: 'idle', icon: Bot, color: 'coordinator', currentTask: 'Standby', lastActivity: 'Ready', performance: 94 },
    { id: 'allocator', name: 'Allocator', role: 'Task Assignment', status: 'idle', icon: Users, color: 'allocator', currentTask: 'Standby', lastActivity: 'Ready', performance: 87 },
    { id: 'tracker', name: 'Tracker', role: 'Progress Monitoring', status: 'idle', icon: Eye, color: 'tracker', currentTask: 'Standby', lastActivity: 'Ready', performance: 91 },
    { id: 'reviewer', name: 'Reviewer', role: 'Code Review & QA', status: 'idle', icon: CheckCircle, color: 'reviewer', currentTask: 'Standby', lastActivity: 'Ready', performance: 89 },
    { id: 'resolver', name: 'Resolver', role: 'Conflict Resolution', status: 'idle', icon: Shield, color: 'resolver', currentTask: 'Standby', lastActivity: 'Ready', performance: 96 },
    { id: 'reporter', name: 'Reporter', role: 'Analytics & Reports', status: 'idle', icon: FileText, color: 'reporter', currentTask: 'Standby', lastActivity: 'Ready', performance: 92 }
  ]);
  
  // The metrics data is kept for display
  const [metrics, setMetrics] = useState<SystemMetrics>({
    tasksCompleted: 147, avgResolutionTime: '2.3h', successRate: 94.2, activeProjects: 8, currentLoad: 0
  });

  // --- HELPER FUNCTION ---
  // A helper to add new messages to the activity feed
  const addMessage = (from: string, message: string, agentColor: string, type: ActivityMessage['type'] = 'communication') => {
    setMessages(prev => [{
        id: Date.now().toString(),
        timestamp: new Date(),
        from,
        message,
        type,
        agentColor
    }, ...prev]);
  };
  
  // --- API CALL LOGIC ---
  // This function is passed to the ProjectInput component
  const handleProjectSubmit = async (project: { query: string; priority: string; type: string }) => {
    setIsLoading(true);
    setSystemStatus('running');
    setMessages([]); // Clear previous messages
    addMessage('System', `Received new project request: "${project.query}"`, 'primary', 'status');

    try {
        const response = await fetch('http://localhost:8000/run-project', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ goal: project.query }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const finalReport = data.result?.raw || "Project completed, but no detailed report was generated.";
        
        addMessage('System', 'Project execution completed successfully.', 'success', 'success');
        addMessage('Reporter', finalReport, 'reporter', 'status');

    } catch (error) {
        console.error("Failed to run project:", error);
        addMessage('System', `An error occurred: ${error instanceof Error ? error.message : String(error)}`, 'error', 'error');
    } finally {
        setIsLoading(false);
        setSystemStatus('stopped');
    }
  };

  const handleSystemControl = (action: 'play' | 'pause' | 'stop') => {
     // This is now just for UI display, the real status is controlled by the API call
    if (isLoading) return; // Prevent changes while running
    setSystemStatus(action === 'play' ? 'running' : action === 'pause' ? 'paused' : 'stopped');
  };

  const getStatusColor = () => {
    if (isLoading) return 'success';
    switch (systemStatus) {
      case 'running': return 'success';
      case 'paused': return 'warning';
      case 'stopped': return 'error';
    }
  };

  // The main render method now passes real state and handlers to the child components
  return (
    <div className="min-h-screen bg-background text-foreground p-6">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-hero bg-clip-text text-transparent">DevBoss</h1>
            <p className="text-muted-foreground mt-2">Multi-Agent AI IT Management System</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Button variant={systemStatus === 'running' ? 'default' : 'outline'} size="sm" onClick={() => handleSystemControl('play')} className="gap-2" disabled={isLoading}><PlayCircle className="h-4 w-4" />Run</Button>
              <Button variant={systemStatus === 'paused' ? 'default' : 'outline'} size="sm" onClick={() => handleSystemControl('pause')} className="gap-2" disabled={isLoading}><PauseCircle className="h-4 w-4" />Pause</Button>
              <Button variant={systemStatus === 'stopped' ? 'destructive' : 'outline'} size="sm" onClick={() => handleSystemControl('stop')} className="gap-2" disabled={isLoading}><StopCircle className="h-4 w-4" />Stop</Button>
            </div>
            <Badge variant="secondary" className={`border-${getStatusColor()} text-${getStatusColor()}`}>
              <Activity className="h-3 w-3 mr-1" />
              {isLoading ? 'RUNNING' : systemStatus.toUpperCase()}
            </Badge>
            {escalationCount > 0 && <Badge variant="destructive" className="animate-pulse"><AlertTriangle className="h-3 w-3 mr-1" />{escalationCount} Escalations</Badge>}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-4 space-y-6">
          <ProjectInput onSubmit={handleProjectSubmit} isLoading={isLoading} />
          <Card className="shadow-card">
            <CardHeader><CardTitle className="flex items-center gap-2"><TrendingUp className="h-5 w-5 text-success" />System Performance</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center"><span className="text-muted-foreground">Current Load</span><span className="font-semibold">{isLoading ? 100 : metrics.currentLoad}%</span></div>
              <Progress value={isLoading ? 100 : metrics.currentLoad} className="h-2" />
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="text-center"><div className="text-2xl font-bold text-success">{metrics.tasksCompleted}</div><div className="text-xs text-muted-foreground">Tasks Completed</div></div>
                <div className="text-center"><div className="text-2xl font-bold text-primary">{metrics.successRate}%</div><div className="text-xs text-muted-foreground">Success Rate</div></div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="col-span-12 lg:col-span-8">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-6">
            {agents.map((agent) => (<AgentCard key={agent.id} agent={agent} systemStatus={isLoading ? 'running' : systemStatus} />))}
          </div>
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Activity className="h-5 w-5" />Live Agent Activity</CardTitle>
              <CardDescription>Real-time communication between agents</CardDescription>
            </CardHeader>
            <CardContent>
              <ActivityFeed messages={messages} systemStatus={systemStatus} />
            </CardContent>
          </Card>
        </div>
      </div>
      <div className="mt-8">
        <MetricsDashboard metrics={metrics} />
      </div>
    </div>
  );
};

export default Dashboard;