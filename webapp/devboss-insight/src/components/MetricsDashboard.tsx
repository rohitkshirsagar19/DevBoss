import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  Users, 
  GitBranch, 
  Target,
  Award,
  Zap
} from 'lucide-react';
import type { SystemMetrics } from './Dashboard';

interface MetricsDashboardProps {
  metrics: SystemMetrics;
}

// Sample data for charts
const performanceData = [
  { name: 'Mon', tasks: 12, efficiency: 89 },
  { name: 'Tue', tasks: 19, efficiency: 94 },
  { name: 'Wed', tasks: 15, efficiency: 91 },
  { name: 'Thu', tasks: 22, efficiency: 96 },
  { name: 'Fri', tasks: 18, efficiency: 88 },
  { name: 'Sat', tasks: 8, efficiency: 92 },
  { name: 'Sun', tasks: 5, efficiency: 90 }
];

const agentWorkload = [
  { name: 'Coordinator', value: 23, color: 'hsl(var(--coordinator))' },
  { name: 'Allocator', value: 19, color: 'hsl(var(--allocator))' },
  { name: 'Tracker', value: 18, color: 'hsl(var(--tracker))' },
  { name: 'Reviewer', value: 16, color: 'hsl(var(--reviewer))' },
  { name: 'Resolver', value: 12, color: 'hsl(var(--resolver))' },
  { name: 'Reporter', value: 12, color: 'hsl(var(--reporter))' }
];

const resolutionTimes = [
  { category: 'Bug Fixes', avgTime: 2.3, target: 3.0 },
  { category: 'Features', avgTime: 8.7, target: 10.0 },
  { category: 'Reviews', avgTime: 1.2, target: 2.0 },
  { category: 'Optimization', avgTime: 4.5, target: 6.0 }
];

export const MetricsDashboard: React.FC<MetricsDashboardProps> = ({ metrics }) => {
  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Tasks Completed</p>
                <p className="text-2xl font-bold text-success">{metrics.tasksCompleted}</p>
                <p className="text-xs text-success flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  +12% from last week
                </p>
              </div>
              <div className="p-3 rounded-lg bg-success/10 border border-success/20">
                <CheckCircle className="h-6 w-6 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Resolution Time</p>
                <p className="text-2xl font-bold text-primary">{metrics.avgResolutionTime}</p>
                <p className="text-xs text-success flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  -18% improvement
                </p>
              </div>
              <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
                <Clock className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Success Rate</p>
                <p className="text-2xl font-bold text-warning">{metrics.successRate}%</p>
                <p className="text-xs text-success flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  +2.3% this month
                </p>
              </div>
              <div className="p-3 rounded-lg bg-warning/10 border border-warning/20">
                <Target className="h-6 w-6 text-warning" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Projects</p>
                <p className="text-2xl font-bold text-coordinator">{metrics.activeProjects}</p>
                <p className="text-xs text-muted-foreground">
                  3 high priority
                </p>
              </div>
              <div className="p-3 rounded-lg bg-coordinator/10 border border-coordinator/20">
                <GitBranch className="h-6 w-6 text-coordinator" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Trend */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-success" />
              Weekly Performance Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="tasks" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={3}
                  dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 5 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="efficiency" 
                  stroke="hsl(var(--success))" 
                  strokeWidth={2}
                  strokeDasharray="5 5"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Agent Workload Distribution */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-allocator" />
              Agent Workload Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={agentWorkload}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  dataKey="value"
                  stroke="hsl(var(--background))"
                  strokeWidth={2}
                >
                  {agentWorkload.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }} 
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {agentWorkload.map((agent, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: agent.color }}
                  />
                  <span className="text-sm">{agent.name}</span>
                  <span className="text-sm text-muted-foreground ml-auto">{agent.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Resolution Times */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-warning" />
            Average Resolution Times vs Targets
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {resolutionTimes.map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{item.category}</span>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-muted-foreground">
                      {item.avgTime}h avg / {item.target}h target
                    </span>
                    <Badge 
                      variant={item.avgTime <= item.target ? "default" : "secondary"}
                      className={item.avgTime <= item.target ? "bg-success text-success-foreground" : ""}
                    >
                      {item.avgTime <= item.target ? (
                        <><Award className="h-3 w-3 mr-1" />On Target</>
                      ) : (
                        <><Zap className="h-3 w-3 mr-1" />Needs Improvement</>
                      )}
                    </Badge>
                  </div>
                </div>
                <Progress 
                  value={(item.avgTime / item.target) * 100} 
                  className="h-2"
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* RL Optimization Metrics */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            RL Optimization Results
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-success mb-2">15%</div>
              <div className="text-sm text-muted-foreground">Faster Task Allocation</div>
              <div className="text-xs text-success mt-1">vs baseline algorithm</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">23%</div>
              <div className="text-sm text-muted-foreground">Reduced Context Switching</div>
              <div className="text-xs text-primary mt-1">optimized workload distribution</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-warning mb-2">8.7</div>
              <div className="text-sm text-muted-foreground">Learning Episodes</div>
              <div className="text-xs text-warning mt-1">continuous improvement</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};