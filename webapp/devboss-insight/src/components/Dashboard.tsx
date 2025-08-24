import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Bot, GitBranch, Users, Eye, CheckCircle, Shield, FileText,
  Activity, TrendingUp
} from 'lucide-react';
import { AgentCard } from './AgentCard';
import { ProjectInput } from './ProjectInput';
import { ActivityFeed, ActivityMessage } from './ActivityFeed'; 
import { MetricsDashboard } from './MetricsDashboard';

// Interfaces for our component's state
export interface Agent {
  id: string; name: string; role: string; status: 'active' | 'idle' | 'processing' | 'error';
  icon: React.ElementType; color: string; currentTask?: string; lastActivity?: string; performance: number;
}
export interface SystemMetrics {
  tasksCompleted: number; avgResolutionTime: string; successRate: number; activeProjects: number; currentLoad: number;
}

const Dashboard: React.FC = () => {
  const [systemStatus, setSystemStatus] = useState<'running' | 'paused' | 'stopped'>('stopped');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ActivityMessage[]>([]);
  
  // Static data for display
  const agents: Agent[] = [
    { id: 'coordinator', name: 'Coordinator', role: 'Workflow Orchestration', status: 'idle', icon: Bot, color: 'coordinator', currentTask: 'Standby', lastActivity: 'Ready', performance: 94 },
    { id: 'allocator', name: 'Allocator', role: 'Task Assignment', status: 'idle', icon: Users, color: 'allocator', currentTask: 'Standby', lastActivity: 'Ready', performance: 87 },
    { id: 'tracker', name: 'Tracker', role: 'Progress Monitoring', status: 'idle', icon: Eye, color: 'tracker', currentTask: 'Standby', lastActivity: 'Ready', performance: 91 },
    { id: 'reviewer', name: 'Reviewer', role: 'Code Review & QA', status: 'idle', icon: CheckCircle, color: 'reviewer', currentTask: 'Standby', lastActivity: 'Ready', performance: 89 },
    { id: 'resolver', name: 'Resolver', role: 'Conflict Resolution', status: 'idle', icon: Shield, color: 'resolver', currentTask: 'Standby', lastActivity: 'Ready', performance: 96 },
    { id: 'reporter', name: 'Reporter', role: 'Analytics & Reports', status: 'idle', icon: FileText, color: 'reporter', currentTask: 'Standby', lastActivity: 'Ready', performance: 92 }
  ];
  const [metrics, setMetrics] = useState<SystemMetrics>({
    tasksCompleted: 147, avgResolutionTime: '2.3h', successRate: 94.2, activeProjects: 8, currentLoad: 0
  });

  const addMessage = (from: string, message: string, agentColor: string, type: ActivityMessage['type'] = 'communication') => {
    setMessages(prev => [{ id: Date.now().toString(), timestamp: new Date(), from, message, type, agentColor }, ...prev]);
  };
  
  // SIMPLIFIED API Handler for the synchronous backend
  const handleProjectSubmit = async (project: { query: string; file?: File }) => {
    setIsLoading(true);
    setSystemStatus('running');
    setMessages([]);
    addMessage('System', `Submitting project: "${project.query}". Please wait, the agents are working...`, 'primary', 'status');

    try {
        const response = await fetch('http://localhost:8000/run-project', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ goal: project.query }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        const finalReport = data.result?.raw || "Project completed, but no detailed report was generated.";
        
        addMessage('System', 'Project execution completed successfully!', 'success', 'success');
        addMessage('Reporter', finalReport, 'reporter', 'status');

    } catch (error) {
        console.error("Failed to run project:", error);
        addMessage('System', `An error occurred: ${error instanceof Error ? error.message : String(error)}`, 'error', 'error');
    } finally {
        setIsLoading(false);
        setSystemStatus('stopped');
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-6">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-hero bg-clip-text text-transparent">DevBoss</h1>
            <p className="text-muted-foreground mt-2">Multi-Agent AI IT Management System</p>
          </div>
          <Badge variant="secondary" className={`border-${isLoading ? 'success' : 'muted'} text-${isLoading ? 'success' : 'muted'}`}>
            <Activity className="h-3 w-3 mr-1" />
            {isLoading ? 'RUNNING' : 'IDLE'}
          </Badge>
        </div>
      </div>
      
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-4 space-y-6">
          <ProjectInput onSubmit={handleProjectSubmit} isLoading={isLoading} />
          <Card className="shadow-card">
            <CardHeader><CardTitle className="flex items-center gap-2"><TrendingUp className="h-5 w-5 text-success" />Project Progress</CardTitle></CardHeader>
            <CardContent>
              {/* Progress bar will now show 0 or 100 */}
              <Progress value={isLoading ? 50 : (messages.length > 1 ? 100 : 0)} className="h-2" />
               <p className="text-xs text-center mt-2 text-muted-foreground">
                {isLoading ? "Agents are processing..." : "Awaiting project."}
               </p>
            </CardContent>
          </Card>
        </div>
        
        <div className="col-span-12 lg:col-span-8">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-6">
            {agents.map((agent) => (<AgentCard key={agent.id} agent={agent} systemStatus={systemStatus} />))}
          </div>
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Activity className="h-5 w-5" />Live Agent Activity</CardTitle>
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