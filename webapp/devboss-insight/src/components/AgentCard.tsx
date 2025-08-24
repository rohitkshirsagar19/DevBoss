import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Zap, Pause, AlertCircle } from 'lucide-react';
import type { Agent } from './Dashboard';

interface AgentCardProps {
  agent: Agent;
  systemStatus: 'running' | 'paused' | 'stopped';
}

export const AgentCard: React.FC<AgentCardProps> = ({ agent, systemStatus }) => {
  const getStatusColor = (status: Agent['status']) => {
    switch (status) {
      case 'active': return 'success';
      case 'processing': return 'warning';
      case 'idle': return 'muted';
      case 'error': return 'error';
    }
  };

  const getStatusIcon = (status: Agent['status']) => {
    switch (status) {
      case 'active': return <Zap className="h-3 w-3" />;
      case 'processing': return <div className="animate-spin h-3 w-3 border border-warning border-t-transparent rounded-full" />;
      case 'idle': return <Pause className="h-3 w-3" />;
      case 'error': return <AlertCircle className="h-3 w-3" />;
    }
  };

  const isActive = systemStatus === 'running' && agent.status !== 'error';

  return (
    <Card className={`shadow-card transition-all duration-300 hover:shadow-elevation ${
      isActive ? 'animate-fade-in' : 'opacity-60'
    }`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg bg-${agent.color}/10 border border-${agent.color}/20`}>
              <agent.icon className={`h-5 w-5 text-${agent.color}`} />
            </div>
            <div>
              <CardTitle className="text-lg">{agent.name}</CardTitle>
              <p className="text-sm text-muted-foreground">{agent.role}</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Status */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {getStatusIcon(agent.status)}
            <Badge 
              variant="secondary" 
              className={`text-${getStatusColor(agent.status)} border-${getStatusColor(agent.status)}/20`}
            >
              {agent.status}
            </Badge>
          </div>
          <span className="text-xs text-muted-foreground">{agent.lastActivity}</span>
        </div>

        {/* Current Task */}
        <div>
          <p className="text-sm font-medium mb-1">Current Task</p>
          <p className="text-sm text-muted-foreground">{agent.currentTask}</p>
        </div>

        {/* Performance */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Performance</span>
            <span className="text-sm font-semibold">{agent.performance}%</span>
          </div>
          <Progress 
            value={agent.performance} 
            className="h-2"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <Button variant="outline" size="sm" className="flex-1">
            View Logs
          </Button>
          <Button variant="outline" size="sm" className="flex-1">
            Configure
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};