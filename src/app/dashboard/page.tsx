'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface AgentStatus {
  id: string;
  name: string;
  type: string;
  status: 'idle' | 'busy' | 'offline' | 'error';
  queueLength: number;
  successRate: number;
  avgResponseTime: number;
  specialization: string;
  capabilities: string[];
  memoryStats?: {
    shortTerm: number;
    longTerm: number;
    episodic: number;
    semantic: number;
  };
  tools?: string[];
  currentPlan?: {
    id: string;
    goal: string;
    status: string;
    progress: string;
  };
}

interface SystemMetrics {
  activeAgents: number;
  completedTasks: number;
  failedTasks: number;
  avgResponseTime: number;
  systemUptime: number;
  costs: {
    total: number;
    byProvider: Record<string, number>;
  };
}

const SwarmDashboard = () => {
  const [agents, setAgents] = useState<AgentStatus[]>([]);
  const [metrics, setMetrics] = useState<SystemMetrics>({
    activeAgents: 6,
    completedTasks: 147,
    failedTasks: 12,
    avgResponseTime: 2100,
    systemUptime: 99.7,
    costs: {
      total: 89.45,
      byProvider: {
        'OpenAI': 34.20,
        'Anthropic': 28.15,
        'Google': 15.30,
        'BlackBox': 8.80,
        'OpenRouter': 3.00
      }
    }
  });
  const [systemHealth, setSystemHealth] = useState('healthy');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAgentData();
    const interval = setInterval(fetchAgentData, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchAgentData = async () => {
    try {
      const response = await fetch('/api/agents');
      const result = await response.json();
      
      if (result.success) {
        setAgents(result.data.agents || []);
        if (result.data.summary) {
          setMetrics(prev => ({
            ...prev,
            activeAgents: result.data.summary.active || 0,
            completedTasks: result.data.summary.completedTasks || 0
          }));
        }
      }
    } catch (error) {
      console.error('Failed to fetch agent data:', error);
      setSystemHealth('error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAgentAction = async (agentId: string, action: string) => {
    try {
      const response = await fetch('/api/agents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action, agentId }),
      });

      const result = await response.json();
      
      if (result.success) {
        await fetchAgentData();
      } else {
        alert(`Action failed: ${result.error}`);
      }
    } catch (error) {
      console.error('Agent action failed:', error);
      alert('Action failed. Please try again.');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'idle': return 'bg-green-500';
      case 'busy': return 'bg-yellow-500'; 
      case 'offline': return 'bg-red-500';
      case 'error': return 'bg-red-600';
      default: return 'bg-gray-500';
    }
  };

  const getStatusBadgeVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case 'idle': return 'default';
      case 'busy': return 'secondary';
      case 'offline': return 'destructive';
      case 'error': return 'destructive';
      default: return 'outline';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-purple-300 text-lg">Loading Agent Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Multi-LLM Swarm Agent Dashboard
          </h1>
          <p className="text-gray-300">Real-time monitoring and control of your AI development agents</p>
        </div>

        {systemHealth !== 'healthy' && (
          <Alert className="mb-6 border-yellow-500 bg-yellow-500/10">
            <AlertDescription>
              System health check: Some agents may be experiencing issues. Check individual agent status below.
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-600/20 to-blue-700/20 border-blue-500/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-blue-300">Active Agents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-100">{metrics.activeAgents}/7</div>
              <p className="text-xs text-blue-300 mt-1">
                {((metrics.activeAgents / 7) * 100).toFixed(1)}% operational
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-600/20 to-green-700/20 border-green-500/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-green-300">Completed Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-100">{metrics.completedTasks}</div>
              <p className="text-xs text-green-300 mt-1">
                {((metrics.completedTasks / (metrics.completedTasks + metrics.failedTasks)) * 100).toFixed(1)}% success rate
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-600/20 to-purple-700/20 border-purple-500/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-purple-300">Avg Response Time</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-100">{(metrics.avgResponseTime / 1000).toFixed(1)}s</div>
              <p className="text-xs text-purple-300 mt-1">
                Across all agents
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-600/20 to-yellow-700/20 border-yellow-500/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-yellow-300">Total Cost</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-100">${metrics.costs.total}</div>
              <p className="text-xs text-yellow-300 mt-1">
                This month
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="agents" className="space-y-6">
          <TabsList className="bg-slate-800/50 border-slate-700">
            <TabsTrigger value="agents" className="data-[state=active]:bg-blue-600">Agents</TabsTrigger>
            <TabsTrigger value="projects" className="data-[state=active]:bg-blue-600">Projects</TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-blue-600">Analytics</TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-blue-600">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="agents">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {agents.map((agent) => (
                <Card key={agent.id} className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 border-slate-600/30">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg text-white">{agent.name}</CardTitle>
                        <CardDescription className="text-slate-300 capitalize">{agent.type.replace('-', ' ')}</CardDescription>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <Badge variant={getStatusBadgeVariant(agent.status)} className="capitalize">
                          {agent.status}
                        </Badge>
                        <div className={`w-3 h-3 rounded-full ${getStatusColor(agent.status)} animate-pulse`}></div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-slate-400">Queue Length:</span>
                        <div className="font-semibold text-white">{agent.queueLength} tasks</div>
                      </div>
                      <div>
                        <span className="text-slate-400">Success Rate:</span>
                        <div className="font-semibold text-white">{agent.successRate}%</div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-slate-400">Performance</span>
                        <span className="text-white">{agent.successRate}%</span>
                      </div>
                      <Progress value={agent.successRate} className="h-2" />
                    </div>

                    <div>
                      <span className="text-slate-400 text-sm">Response Time: </span>
                      <span className="text-white font-semibold">{(agent.avgResponseTime / 1000).toFixed(1)}s</span>
                    </div>

                    {agent.memoryStats && (
                      <div className="bg-slate-700/30 p-3 rounded-lg">
                        <div className="text-sm font-medium text-purple-300 mb-2">🧠 Memory System</div>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>Short-term: <span className="font-semibold text-white">{agent.memoryStats.shortTerm}</span></div>
                          <div>Long-term: <span className="font-semibold text-white">{agent.memoryStats.longTerm}</span></div>
                          <div>Episodic: <span className="font-semibold text-white">{agent.memoryStats.episodic}</span></div>
                          <div>Semantic: <span className="font-semibold text-white">{agent.memoryStats.semantic}</span></div>
                        </div>
                      </div>
                    )}

                    {agent.currentPlan && (
                      <div className="bg-slate-700/30 p-3 rounded-lg">
                        <div className="text-sm font-medium text-green-300 mb-2">📋 Active Plan</div>
                        <div className="text-xs text-gray-300 mb-1">{agent.currentPlan.goal}</div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-purple-300">Progress: {agent.currentPlan.progress}</span>
                          <Badge variant="outline" className="text-xs">
                            {agent.currentPlan.status}
                          </Badge>
                        </div>
                      </div>
                    )}

                    <div className="flex gap-2 pt-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="flex-1"
                        onClick={() => handleAgentAction(agent.id, 'view-logs')}
                      >
                        View Logs
                      </Button>
                      <Button 
                        size="sm" 
                        variant={agent.status === 'offline' ? 'default' : 'secondary'} 
                        className="flex-1"
                        onClick={() => handleAgentAction(agent.id, agent.status === 'offline' ? 'start' : 'restart')}
                      >
                        {agent.status === 'offline' ? 'Start' : 'Restart'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="projects">
            <Card className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 border-slate-600/30">
              <CardHeader>
                <CardTitle className="text-white">Active Projects</CardTitle>
                <CardDescription className="text-slate-300">Manage your AI-powered development projects</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <p className="text-slate-400 mb-4">No active projects yet</p>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    Create New Project
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 border-slate-600/30">
                <CardHeader>
                  <CardTitle className="text-white">Cost Breakdown</CardTitle>
                  <CardDescription className="text-slate-300">LLM provider usage costs</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Object.entries(metrics.costs.byProvider).map(([provider, cost]) => (
                      <div key={provider} className="flex justify-between items-center">
                        <span className="text-slate-300">{provider}</span>
                        <span className="font-semibold text-white">${cost.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 border-slate-600/30">
                <CardHeader>
                  <CardTitle className="text-white">System Performance</CardTitle>
                  <CardDescription className="text-slate-300">Overall system metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-slate-400">System Uptime</span>
                        <span className="text-white">{metrics.systemUptime}%</span>
                      </div>
                      <Progress value={metrics.systemUptime} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-slate-400">Task Success Rate</span>
                        <span className="text-white">
                          {((metrics.completedTasks / (metrics.completedTasks + metrics.failedTasks)) * 100).toFixed(1)}%
                        </span>
                      </div>
                      <Progress 
                        value={(metrics.completedTasks / (metrics.completedTasks + metrics.failedTasks)) * 100} 
                        className="h-2" 
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="settings">
            <Card className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 border-slate-600/30">
              <CardHeader>
                <CardTitle className="text-white">System Configuration</CardTitle>
                <CardDescription className="text-slate-300">Configure agents, providers, and security settings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Button variant="outline" className="w-full justify-start">
                    🔑 API Key Management
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    🛡️ Vault Security Settings
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    🤖 Agent Configuration
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    📊 Learning & Analytics
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    🔧 System Preferences
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SwarmDashboard;