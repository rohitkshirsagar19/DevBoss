import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Send, Sparkles, Code, Bug, Settings, FileText } from 'lucide-react';

interface ProjectInputProps {
  onSubmit: (project: { query: string; priority: string; type: string }) => void;
}

export const ProjectInput: React.FC<ProjectInputProps> = ({ onSubmit }) => {
  const [query, setQuery] = useState('');
  const [priority, setPriority] = useState('medium');
  const [type, setType] = useState('bug-fix');

  const taskTypes = [
    { value: 'bug-fix', label: 'Bug Fix', icon: Bug },
    { value: 'feature', label: 'Feature Request', icon: Sparkles },
    { value: 'code-review', label: 'Code Review', icon: Code },
    { value: 'optimization', label: 'Optimization', icon: Settings },
    { value: 'documentation', label: 'Documentation', icon: FileText }
  ];

  const exampleQueries = [
    'Fix login authentication timeout issue',
    'Implement user role-based access control',
    'Optimize database query performance',
    'Review code quality for payment module',
    'Update API documentation for v2.0'
  ];

  const handleSubmit = () => {
    if (query.trim()) {
      onSubmit({ query: query.trim(), priority, type });
      setQuery('');
    }
  };

  const handleExampleClick = (example: string) => {
    setQuery(example);
  };

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          New Project Request
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Task Type Selection */}
        <div>
          <label className="text-sm font-medium mb-2 block">Task Type</label>
          <Select value={type} onValueChange={setType}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {taskTypes.map((taskType) => (
                <SelectItem key={taskType.value} value={taskType.value}>
                  <div className="flex items-center gap-2">
                    <taskType.icon className="h-4 w-4" />
                    {taskType.label}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Priority Selection */}
        <div>
          <label className="text-sm font-medium mb-2 block">Priority</label>
          <Select value={priority} onValueChange={setPriority}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">
                <Badge variant="secondary">Low</Badge>
              </SelectItem>
              <SelectItem value="medium">
                <Badge variant="outline" className="border-warning text-warning">Medium</Badge>
              </SelectItem>
              <SelectItem value="high">
                <Badge variant="destructive">High</Badge>
              </SelectItem>
              <SelectItem value="critical">
                <Badge variant="destructive" className="bg-error">Critical</Badge>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Query Input */}
        <div>
          <label className="text-sm font-medium mb-2 block">Project Description</label>
          <Textarea
            placeholder="Describe what you need the AI agents to work on..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="min-h-[100px] resize-none"
          />
        </div>

        {/* Example Queries */}
        <div>
          <p className="text-sm font-medium mb-2">Quick Examples:</p>
          <div className="flex flex-wrap gap-2">
            {exampleQueries.slice(0, 3).map((example, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => handleExampleClick(example)}
                className="text-xs h-auto py-1 px-2"
              >
                {example}
              </Button>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <Button 
          onClick={handleSubmit}
          disabled={!query.trim()}
          className="w-full gap-2 bg-gradient-primary hover:opacity-90"
        >
          <Send className="h-4 w-4" />
          Deploy AI Agents
        </Button>

        {/* Active Projects Counter */}
        <div className="text-center pt-2 border-t">
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold text-primary">8</span> active projects being managed
          </p>
        </div>
      </CardContent>
    </Card>
  );
};