import React from 'react';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bot, Users, Eye, CheckCircle, Shield, FileText, ArrowRight, Clock, Server } from 'lucide-react';

// Export this interface so the Dashboard can use it
export interface ActivityMessage {
  id: string;
  timestamp: Date;
  from: string;
  to?: string;
  message: string;
  type: 'communication' | 'action' | 'status' | 'alert' | 'error' | 'success'; // Added error/success
  agentColor: string;
}

interface ActivityFeedProps {
  messages: ActivityMessage[];
  systemStatus: 'running' | 'paused' | 'stopped';
}

export const ActivityFeed: React.FC<ActivityFeedProps> = ({ messages, systemStatus }) => {
  // The agentIcons map is kept, but we add 'System' for system-level messages
  const agentIcons = {
    'Coordinator': Bot,
    'Allocator': Users,
    'Tracker': Eye,
    'Reviewer': CheckCircle,
    'Resolver': Shield,
    'Reporter': FileText,
    'System': Server
  };

  // The helper functions are kept and improved
  const getTypeColor = (type: ActivityMessage['type']) => {
    switch (type) {
      case 'communication': return 'primary';
      case 'action': return 'success';
      case 'status': return 'secondary';
      case 'alert': return 'warning';
      case 'error': return 'error';
      case 'success': return 'success';
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
      <ScrollArea className="h-80">
        <div className="space-y-3 pr-4">
          {/* Display a message when the log is empty or the system is stopped */}
          {messages.length === 0 && (
            <div className="text-center py-4 text-muted-foreground">
              <Clock className="h-6 w-6 mx-auto mb-2" />
              <p>{systemStatus === 'paused' ? 'Agent activity paused' : 'System ready. Waiting for project goal...'}</p>
            </div>
          )}

          {/* Render the messages passed in via props */}
          {messages.map((message) => {
            const IconComponent = agentIcons[message.from as keyof typeof agentIcons] || Bot;
            
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
                  
                  {/* Use whitespace-pre-wrap to respect newlines from the backend report */}
                  <p className="text-sm text-foreground mb-2 whitespace-pre-wrap">
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