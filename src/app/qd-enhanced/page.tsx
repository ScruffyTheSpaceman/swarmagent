'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface QDAgentState {
  id: string;
  name: string;
  type: string;
  status: 'idle' | 'reasoning' | 'planning' | 'executing' | 'reflecting' | 'collaborating';
  currentTask?: string;
  memoryStats: {
    shortTerm: number;
    longTerm: number;
    episodic: number;
    semantic: number;
  };
  tools: string[];
  collaborators: string[];
  currentPlan?: {
    id: string;
    goal: string;
    status: string;
    progress: string;
  };
  recentReflections: number;
  learningVelocity: number;
}

const QDEnhancedDashboard = () => {
  const [qdAgents, setQdAgents] = useState<QDAgentState[]>([
    {
      id: 'qd-coordinator',
      name: 'QD Coordinator',
      type: 'coordinator',
      status: 'reasoning',
      currentTask: 'Analyzing system optimization opportunities',
      memoryStats: { shortTerm: 45, longTerm: 128, episodic: 23, semantic: 67 },
      tools: ['analyze_task', 'communicate_with_agent', 'workflow_optimization', 'search_knowledge'],
      collaborators: ['qd-codegen', 'qd-reviewer', 'qd-learning'],
      currentPlan: {
        id: 'plan_001',
        goal: 'Optimize multi-agent workflow efficiency',
        status: 'executing',
        progress: '3/7'
      },
      recentReflections: 4,
      learningVelocity: 8.5
    },
    {
      id: 'qd-codegen',
      name: 'QD Code Generator',
      type: 'code-generator',
      status: 'planning',
      currentTask: 'Planning microservice architecture implementation',
      memoryStats: { shortTerm: 32, longTerm: 95, episodic: 18, semantic: 42 },
      tools: ['generate_code', 'code_complexity', 'pattern_detection', 'semantic_search'],
      collaborators: ['qd-reviewer', 'qd-tester'],
      currentPlan: {
        id: 'plan_002',
        goal: 'Implement scalable microservice architecture',
        status: 'active',
        progress: '2/5'
      },
      recentReflections: 3,
      learningVelocity: 7.2
    },
    {
      id: 'qd-reviewer',
      name: 'QD Code Reviewer',
      type: 'code-reviewer',
      status: 'executing',
      currentTask: 'Performing causal analysis of security vulnerabilities',
      memoryStats: { shortTerm: 28, longTerm: 156, episodic: 31, semantic: 89 },
      tools: ['analyze_code', 'causal_analysis', 'pattern_detection', 'knowledge_graph'],
      collaborators: ['qd-codegen', 'qd-security'],
      currentPlan: {
        id: 'plan_003',
        goal: 'Enhance security review processes',
        status: 'executing',
        progress: '4/6'
      },
      recentReflections: 5,
      learningVelocity: 9.1
    },
    {
      id: 'qd-learning',
      name: 'QD Learning Agent',
      type: 'learning',
      status: 'reflecting',
      currentTask: 'Consolidating cross-agent learning patterns',
      memoryStats: { shortTerm: 78, longTerm: 234, episodic: 67, semantic: 145 },
      tools: ['memory_consolidation', 'learning_transfer', 'reasoning_chain', 'data_analysis'],
      collaborators: ['qd-coordinator', 'qd-codegen', 'qd-reviewer'],
      currentPlan: {
        id: 'plan_004',
        goal: 'Optimize system-wide learning velocity',
        status: 'active',
        progress: '5/8'
      },
      recentReflections: 12,
      learningVelocity: 12.8
    }
  ]);

  const [systemMetrics, setSystemMetrics] = useState({
    overallSuccessRate: 94.2,
    averageTaskCompletionTime: 2340,
    interAgentCommunicationEfficiency: 89.5,
    knowledgeSharingRate: 15.7,
    systemLearningVelocity: 9.4,
    costEfficiency: 87.3,
    systemHealth: 'excellent'
  });

  const [recentInsights, setRecentInsights] = useState([
    {
      id: 'insight_001',
      insight: 'Cross-agent knowledge sharing increases success rate by 12%',
      evidence: ['Task success correlation analysis', 'Agent performance before/after knowledge transfer'],
      impact: 'high',
      implementationStatus: 'completed'
    },
    {
      id: 'insight_002', 
      insight: 'Planning phase duration optimal at 8-12% of total task time',
      evidence: ['Task timing analysis across 200+ tasks', 'Quality correlation studies'],
      impact: 'medium',
      implementationStatus: 'implementing'
    },
    {
      id: 'insight_003',
      insight: 'Semantic memory clustering improves retrieval efficiency by 34%',
      evidence: ['Memory access pattern analysis', 'Retrieval time measurements'],
      impact: 'high',
      implementationStatus: 'completed'
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'idle': return 'bg-blue-500';
      case 'reasoning': return 'bg-purple-500';
      case 'planning': return 'bg-yellow-500';
      case 'executing': return 'bg-green-500';
      case 'reflecting': return 'bg-orange-500';
      case 'collaborating': return 'bg-pink-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusBadgeVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case 'idle': return 'outline';
      case 'reasoning': return 'secondary';
      case 'planning': return 'secondary';
      case 'executing': return 'default';
      case 'reflecting': return 'secondary';
      case 'collaborating': return 'default';
      default: return 'outline';
    }
  };

  const getHealthColor = (health: string) => {
    switch (health) {
      case 'excellent': return 'text-green-400';
      case 'good': return 'text-blue-400';
      case 'fair': return 'text-yellow-400';
      case 'needs_attention': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            QD-Enhanced Multi-LLM Swarm System
          </h1>
          <p className="text-gray-300">Advanced agent coordination with memory, planning, and self-reflection capabilities</p>
        </div>

        <Card className="mb-8 bg-gradient-to-r from-green-600/20 to-emerald-600/20 border-green-500/30">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-green-300 flex items-center gap-2">
                🧠 QD System Intelligence
              </CardTitle>
              <Badge variant="default" className={`${getHealthColor(systemMetrics.systemHealth)} bg-transparent border-current`}>
                {systemMetrics.systemHealth.toUpperCase()}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div>
                <div className="text-2xl font-bold text-green-100">{systemMetrics.overallSuccessRate}%</div>
                <div className="text-sm text-green-300">Success Rate</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-100">{systemMetrics.knowledgeSharingRate}</div>
                <div className="text-sm text-green-300">Knowledge Transfers/Hour</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-100">{systemMetrics.systemLearningVelocity}</div>
                <div className="text-sm text-green-300">Learning Velocity</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-100">{systemMetrics.interAgentCommunicationEfficiency}%</div>
                <div className="text-sm text-green-300">Communication Efficiency</div>
              </div>
            </div>
            <Progress value={systemMetrics.overallSuccessRate} className="h-2" />
          </CardContent>
        </Card>

        <Tabs defaultValue="qd-agents" className="space-y-6">
          <TabsList className="bg-slate-800/50 border-slate-700">
            <TabsTrigger value="qd-agents" className="data-[state=active]:bg-purple-600">QD Agents</TabsTrigger>
            <TabsTrigger value="memory" className="data-[state=active]:bg-purple-600">Global Memory</TabsTrigger>
            <TabsTrigger value="insights" className="data-[state=active]:bg-purple-600">System Insights</TabsTrigger>
            <TabsTrigger value="tools" className="data-[state=active]:bg-purple-600">Advanced Tools</TabsTrigger>
          </TabsList>

          <TabsContent value="qd-agents">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {qdAgents.map((agent) => (
                <Card key={agent.id} className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 border-slate-600/30">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg text-white flex items-center gap-2">
                          {agent.name}
                          <Badge variant={getStatusBadgeVariant(agent.status)} className="capitalize">
                            {agent.status}
                          </Badge>
                        </CardTitle>
                        <CardDescription className="text-slate-300">{agent.currentTask}</CardDescription>
                      </div>
                      <div className={`w-3 h-3 rounded-full ${getStatusColor(agent.status)} animate-pulse`}></div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-slate-700/30 p-3 rounded-lg">
                      <div className="text-sm font-medium text-purple-300 mb-2">🧠 Memory System</div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>Short-term: <span className="font-semibold text-white">{agent.memoryStats.shortTerm}</span></div>
                        <div>Long-term: <span className="font-semibold text-white">{agent.memoryStats.longTerm}</span></div>
                        <div>Episodic: <span className="font-semibold text-white">{agent.memoryStats.episodic}</span></div>
                        <div>Semantic: <span className="font-semibold text-white">{agent.memoryStats.semantic}</span></div>
                      </div>
                    </div>

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

                    <div>
                      <div className="text-sm font-medium text-blue-300 mb-2">🛠️ QD Tools ({agent.tools.length})</div>
                      <div className="flex flex-wrap gap-1">
                        {agent.tools.slice(0, 4).map((tool, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tool.replace(/_/g, ' ')}
                          </Badge>
                        ))}
                        {agent.tools.length > 4 && (
                          <Badge variant="outline" className="text-xs">
                            +{agent.tools.length - 4} more
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-slate-400">Learning Velocity:</span>
                        <div className="font-semibold text-white">{agent.learningVelocity}/10</div>
                        <Progress value={agent.learningVelocity * 10} className="h-1 mt-1" />
                      </div>
                      <div>
                        <span className="text-slate-400">Reflections:</span>
                        <div className="font-semibold text-white">{agent.recentReflections} recent</div>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button size="sm" variant="outline" className="flex-1 text-xs">
                        View Memory
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1 text-xs">
                        Plan History
                      </Button>
                      <Button size="sm" variant="secondary" className="flex-1 text-xs">
                        Trigger Reflection
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="memory">
            <div className="grid gap-6">
              <Card className="bg-gradient-to-r from-slate-800/50 to-slate-700/50 border-slate-600/30">
                <CardHeader>
                  <CardTitle className="text-white">🧠 Global Memory System</CardTitle>
                  <CardDescription className="text-slate-300">Shared knowledge and cross-agent learnings</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-3">
                      <h4 className="font-medium text-purple-300">📚 Shared Knowledge</h4>
                      {[
                        { topic: 'React Optimization Patterns', confidence: 92, agents: 3 },
                        { topic: 'Security Best Practices', confidence: 87, agents: 4 },
                        { topic: 'Testing Strategies', confidence: 94, agents: 2 }
                      ].map((item, index) => (
                        <div key={index} className="bg-slate-700/30 p-3 rounded-lg">
                          <div className="text-sm font-medium text-white">{item.topic}</div>
                          <div className="flex justify-between text-xs text-gray-300 mt-1">
                            <span>Confidence: {item.confidence}%</span>
                            <span>{item.agents} agents</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-medium text-green-300">🔄 Knowledge Transfers</h4>
                      {[
                        { from: 'Code Reviewer', to: 'Code Generator', topic: 'Security Patterns', effectiveness: 89 },
                        { from: 'Learning Agent', to: 'Coordinator', topic: 'Optimization Insights', effectiveness: 92 },
                        { from: 'Tester', to: 'Code Generator', topic: 'Test-Driven Patterns', effectiveness: 85 }
                      ].map((transfer, index) => (
                        <div key={index} className="bg-slate-700/30 p-3 rounded-lg">
                          <div className="text-sm font-medium text-white">{transfer.topic}</div>
                          <div className="text-xs text-gray-300 mt-1">
                            {transfer.from} → {transfer.to}
                          </div>
                          <Progress value={transfer.effectiveness} className="h-1 mt-2" />
                        </div>
                      ))}
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-medium text-yellow-300">⭐ Best Practices</h4>
                      {[
                        { practice: 'Incremental Task Decomposition', adoption: 92, effectiveness: 85 },
                        { practice: 'Cross-Agent Knowledge Sharing', adoption: 74, effectiveness: 78 },
                        { practice: 'Adaptive Planning with Fallbacks', adoption: 67, effectiveness: 89 }
                      ].map((practice, index) => (
                        <div key={index} className="bg-slate-700/30 p-3 rounded-lg">
                          <div className="text-sm font-medium text-white">{practice.practice}</div>
                          <div className="grid grid-cols-2 gap-2 text-xs text-gray-300 mt-2">
                            <div>Adoption: {practice.adoption}%</div>
                            <div>Effectiveness: {practice.effectiveness}%</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="insights">
            <div className="grid gap-4">
              {recentInsights.map((insight) => (
                <Card key={insight.id} className="bg-gradient-to-r from-slate-800/50 to-slate-700/50 border-slate-600/30">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg text-white">{insight.insight}</CardTitle>
                      <Badge variant={insight.implementationStatus === 'completed' ? 'default' : 'secondary'}>
                        {insight.implementationStatus}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <div className="text-sm font-medium text-blue-300 mb-2">📊 Evidence</div>
                        <ul className="text-sm text-gray-300 space-y-1">
                          {insight.evidence.map((evidence, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <span className="text-blue-400 mt-1">•</span>
                              {evidence}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="flex justify-between items-center pt-2">
                        <Badge variant="outline" className={`${
                          insight.impact === 'high' ? 'border-red-400 text-red-300' :
                          insight.impact === 'medium' ? 'border-yellow-400 text-yellow-300' :
                          'border-green-400 text-green-300'
                        }`}>
                          {insight.impact} impact
                        </Badge>
                        <Button size="sm" variant="outline">
                          View Details
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="tools">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="bg-gradient-to-br from-purple-600/20 to-purple-700/20 border-purple-500/30">
                <CardHeader>
                  <CardTitle className="text-purple-300">🧠 Reasoning Tools</CardTitle>
                  <CardDescription className="text-purple-200">Advanced logical reasoning capabilities</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="bg-purple-500/20 p-3 rounded-lg">
                    <div className="text-sm font-medium text-white">Multi-Step Reasoning Chain</div>
                    <div className="text-xs text-purple-300 mt-1">Break complex problems into logical steps</div>
                  </div>
                  <div className="bg-purple-500/20 p-3 rounded-lg">
                    <div className="text-sm font-medium text-white">Causal Analysis Engine</div>
                    <div className="text-xs text-purple-300 mt-1">Identify cause-effect relationships</div>
                  </div>
                  <div className="bg-purple-500/20 p-3 rounded-lg">
                    <div className="text-sm font-medium text-white">Analogical Reasoning</div>
                    <div className="text-xs text-purple-300 mt-1">Apply patterns across domains</div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-blue-600/20 to-blue-700/20 border-blue-500/30">
                <CardHeader>
                  <CardTitle className="text-blue-300">🔍 Knowledge Tools</CardTitle>
                  <CardDescription className="text-blue-200">Semantic search and knowledge navigation</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="bg-blue-500/20 p-3 rounded-lg">
                    <div className="text-sm font-medium text-white">Semantic Search Engine</div>
                    <div className="text-xs text-blue-300 mt-1">Context-aware knowledge retrieval</div>
                  </div>
                  <div className="bg-blue-500/20 p-3 rounded-lg">
                    <div className="text-sm font-medium text-white">Knowledge Graph Navigator</div>
                    <div className="text-xs text-blue-300 mt-1">Explore concept relationships</div>
                  </div>
                  <div className="bg-blue-500/20 p-3 rounded-lg">
                    <div className="text-sm font-medium text-white">Pattern Matcher</div>
                    <div className="text-xs text-blue-300 mt-1">Find similar solutions and approaches</div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-orange-600/20 to-orange-700/20 border-orange-500/30">
                <CardHeader>
                  <CardTitle className="text-orange-300">🎓 Learning Tools</CardTitle>
                  <CardDescription className="text-orange-200">Memory management and learning transfer</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="bg-orange-500/20 p-3 rounded-lg">
                    <div className="text-sm font-medium text-white">Memory Consolidation</div>
                    <div className="text-xs text-orange-300 mt-1">Organize and optimize memory storage</div>
                  </div>
                  <div className="bg-orange-500/20 p-3 rounded-lg">
                    <div className="text-sm font-medium text-white">Learning Transfer Engine</div>
                    <div className="text-xs text-orange-300 mt-1">Apply knowledge across domains</div>
                  </div>
                  <div className="bg-orange-500/20 p-3 rounded-lg">
                    <div className="text-sm font-medium text-white">Reflection Processor</div>
                    <div className="text-xs text-orange-300 mt-1">Self-analysis and improvement</div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="mt-6 bg-gradient-to-r from-indigo-600/20 to-purple-600/20 border-indigo-500/30">
              <CardHeader>
                <CardTitle className="text-indigo-300">🚀 QD-LangChain Enhanced Features</CardTitle>
                <CardDescription className="text-indigo-200">Advanced capabilities inspired by QD research</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold text-indigo-300">🎯 Planning & Reasoning</h4>
                    <ul className="text-xs text-gray-300 space-y-1">
                      <li>• Multi-step decomposition</li>
                      <li>• Causal analysis chains</li>
                      <li>• Adaptive plan generation</li>
                      <li>• Risk-aware planning</li>
                    </ul>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold text-indigo-300">🧠 Memory & Learning</h4>
                    <ul className="text-xs text-gray-300 space-y-1">
                      <li>• Episodic memory system</li>
                      <li>• Semantic knowledge graphs</li>
                      <li>• Cross-domain transfer</li>
                      <li>• Continuous self-reflection</li>
                    </ul>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold text-indigo-300">🤝 Collaboration</h4>
                    <ul className="text-xs text-gray-300 space-y-1">
                      <li>• Inter-agent communication</li>
                      <li>• Knowledge sharing protocols</li>
                      <li>• Collective decision making</li>
                      <li>• Emergent behavior detection</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Card className="mt-6 bg-gradient-to-r from-slate-800/50 to-slate-700/50 border-slate-600/30">
          <CardHeader>
            <CardTitle className="text-white">📡 Real-time QD Activity Feed</CardTitle>
            <CardDescription className="text-slate-300">Live stream of agent reasoning, planning, and learning</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {[
                { time: '14:35:42', agent: 'QD Coordinator', action: '🧠 Reasoning about task optimization strategies', type: 'reasoning' },
                { time: '14:35:38', agent: 'QD Learning', action: '🎓 Consolidating episodic memories from last 6 hours', type: 'memory' },
                { time: '14:35:35', agent: 'QD Code Generator', action: '📋 Planning microservice implementation with fallback strategies', type: 'planning' },
                { time: '14:35:31', agent: 'QD Code Reviewer', action: '🔍 Performing causal analysis on performance bottleneck', type: 'analysis' },
                { time: '14:35:28', agent: 'QD Coordinator', action: '🤝 Sharing optimization insights with Code Generator', type: 'collaboration' },
                { time: '14:35:24', agent: 'QD Learning', action: '🧠 Detecting emergent collaboration patterns', type: 'learning' },
                { time: '14:35:20', agent: 'QD Code Generator', action: '✅ Completed step 2/5 of architecture plan', type: 'execution' },
                { time: '14:35:16', agent: 'QD Code Reviewer', action: '🎯 Updated semantic memory with new security patterns', type: 'memory' }
              ].map((activity, index) => (
                <div key={index} className="flex items-center gap-3 text-sm p-2 hover:bg-slate-700/30 rounded">
                  <span className="text-slate-400 font-mono text-xs">{activity.time}</span>
                  <span className="text-blue-300 font-medium min-w-fit">{activity.agent}</span>
                  <span className="text-gray-300">{activity.action}</span>
                  <Badge variant="outline" className="text-xs ml-auto">
                    {activity.type}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default QDEnhancedDashboard;