import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bot, Users, Eye, CheckCircle, Shield, FileText, ArrowRight, Clock } from 'lucide-react';

interface ActivityMessage {
  id: string;
  timestamp: Date;
  from: string;
  to?: string;
  message: string;
  type: 'communication' | 'action' | 'status' | 'alert';
  agentColor: string;
}

interface ActivityFeedProps {
  systemStatus: 'running' | 'paused' | 'stopped';
}

export const ActivityFeed: React.FC<ActivityFeedProps> = ({ systemStatus }) => {
  const [messages, setMessages] = useState<ActivityMessage[]>([
    {
      id: '1',
      timestamp: new Date(Date.now() - 30000),
      from: 'Coordinator',
      to: 'Allocator',
      message: 'New bug fix request received for login module. Please assign to available developer.',
      type: 'communication',
      agentColor: 'coordinator'
    },
    {
      id: '2',
      timestamp: new Date(Date.now() - 25000),
      from: 'Allocator',
      message: 'Analyzing developer workload and expertise. Assigning to Dev-3 (React specialist).',
      type: 'action',
      agentColor: 'allocator'
    },
    {
      id: '3',
      timestamp: new Date(Date.now() - 20000),
      from: 'Tracker',
      message: 'GitHub webhook received: PR #247 created by Dev-3.',
      type: 'status',
      agentColor: 'tracker'
    },
    {
      id: '4',
      timestamp: new Date(Date.now() - 15000),
      from: 'Reviewer',
      to: 'Coordinator',
      message: 'Code review completed. 2 minor issues found, auto-fixing syntax errors.',
      type: 'communication',
      agentColor: 'reviewer'
    },
    {
      id: '5',
      timestamp: new Date(Date.now() - 10000),
      from: 'Resolver',
      message: 'Conflict detected in merge request. Attempting automated resolution.',
      type: 'alert',
      agentColor: 'resolver'
    },
    {
      id: '6',
      timestamp: new Date(Date.now() - 5000),
      from: 'Reporter',
      message: 'Performance metrics updated. Bug fix completion rate: +15% this week.',
      type: 'status',
      agentColor: 'reporter'
    }
  ]);

  const agentIcons = {
    'Coordinator': Bot,
    'Allocator': Users,
    'Tracker': Eye,
    'Reviewer': CheckCircle,
    'Resolver': Shield,
    'Reporter': FileText
  };

  // Simulate real-time updates
  useEffect(() => {
    if (systemStatus !== 'running') return;

    const interval = setInterval(() => {
      const newMessages = [
        {
          from: 'Tracker',
          message: 'GitHub API polling completed. 3 new commits detected.',
          type: 'status' as const,
          agentColor: 'tracker'
        },
        {
          from: 'Coordinator',
          to: 'Reviewer',
          message: 'Priority task escalated. Please review security vulnerability fix.',
          type: 'communication' as const,
          agentColor: 'coordinator'
        },
        {
          from: 'Allocator',
          message: 'Reassigning task from Dev-1 to Dev-4 due to expertise match.',
          type: 'action' as const,
          agentColor: 'allocator'
        },
        {
          from: 'Reviewer',
          message: 'Automated test suite passed. Code quality score: 94/100.',
          type: 'status' as const,
          agentColor: 'reviewer'
        },
        {
          from: 'Reporter',
          message: 'Weekly report generated. 23 tasks completed, 2 pending review.',
          type: 'status' as const,
          agentColor: 'reporter'
        }
      ];

      const randomMessage = newMessages[Math.floor(Math.random() * newMessages.length)];
      const newMessage: ActivityMessage = {
        id: Date.now().toString(),
        timestamp: new Date(),
        ...randomMessage
      };

      setMessages(prev => [newMessage, ...prev.slice(0, 19)]); // Keep last 20 messages
    }, 4000);

    return () => clearInterval(interval);
  }, [systemStatus]);

  const getTypeColor = (type: ActivityMessage['type']) => {
    switch (type) {
      case 'communication': return 'primary';
      case 'action': return 'success';
      case 'status': return 'secondary';
      case 'alert': return 'warning';
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <div className="space-y-3">
      {systemStatus !== 'running' && (
        <div className="text-center py-4 text-muted-foreground">
          <Clock className="h-6 w-6 mx-auto mb-2" />
          <p>Agent activity paused</p>
        </div>
      )}
      
      <ScrollArea className="h-80">
        <div className="space-y-3 pr-4">
          {messages.map((message) => {
            const IconComponent = agentIcons[message.from as keyof typeof agentIcons];
            
            return (
              <div 
                key={message.id}
                className="flex gap-3 p-3 rounded-lg bg-accent/50 hover:bg-accent transition-colors animate-slide-up"
              >
                <div className={`p-1.5 rounded-md bg-${message.agentColor}/10 border border-${message.agentColor}/20 shrink-0`}>
                  <IconComponent className={`h-4 w-4 text-${message.agentColor}`} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`font-semibold text-${message.agentColor}`}>
                      {message.from}
                    </span>
                    {message.to && (
                      <>
                        <ArrowRight className="h-3 w-3 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">{message.to}</span>
                      </>
                    )}
                    <Badge 
                      variant="secondary" 
                      className={`text-xs border-${getTypeColor(message.type)}/20 text-${getTypeColor(message.type)}`}
                    >
                      {message.type}
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-foreground mb-2">
                    {message.message}
                  </p>
                  
                  <span className="text-xs text-muted-foreground">
                    {formatTime(message.timestamp)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
};