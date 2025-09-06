'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';

interface APIKeyConfig {
  id: string;
  provider: string;
  name: string;
  status: 'active' | 'inactive' | 'expired' | 'error';
  lastUsed: string;
  usage: number;
  cost: number;
  masked: string;
}

const APIKeyManagement = () => {
  const [apiKeys, setApiKeys] = useState<APIKeyConfig[]>([
    { id: '1', provider: 'openai', name: 'OpenAI GPT-4', status: 'active', lastUsed: '2 hours ago', usage: 1250, cost: 34.20, masked: 'sk-...abc123' },
    { id: '2', provider: 'anthropic', name: 'Claude Sonnet', status: 'active', lastUsed: '30 minutes ago', usage: 890, cost: 28.15, masked: 'sk-ant-...def456' },
    { id: '3', provider: 'google', name: 'Gemini Pro', status: 'active', lastUsed: '1 hour ago', usage: 650, cost: 15.30, masked: 'AIza...ghi789' },
    { id: '4', provider: 'blackbox', name: 'BlackBox AI', status: 'inactive', lastUsed: '2 days ago', usage: 320, cost: 8.80, masked: 'bb-...jkl012' },
    { id: '5', provider: 'openrouter', name: 'OpenRouter', status: 'active', lastUsed: '45 minutes ago', usage: 150, cost: 3.00, masked: 'sk-or-...mno345' },
    { id: '6', provider: 'pinecone', name: 'Pinecone Vector DB', status: 'active', lastUsed: '3 hours ago', usage: 2100, cost: 12.50, masked: 'pc-...pqr678' }
  ]);

  const [newKeyForm, setNewKeyForm] = useState({
    provider: '',
    name: '',
    apiKey: '',
    autoRotate: false
  });

  const [vaultStatus, setVaultStatus] = useState({
    connected: true,
    health: 'healthy',
    lastBackup: '2024-01-20 10:30 UTC'
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'inactive': return 'bg-yellow-500';
      case 'expired': return 'bg-red-500';
      case 'error': return 'bg-red-600';
      default: return 'bg-gray-500';
    }
  };

  const getStatusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case 'active': return 'default';
      case 'inactive': return 'secondary';
      case 'expired': return 'destructive';
      case 'error': return 'destructive';
      default: return 'outline';
    }
  };

  const handleAddKey = () => {
    if (!newKeyForm.provider || !newKeyForm.name || !newKeyForm.apiKey) {
      alert('Please fill in all required fields');
      return;
    }

    const newKey: APIKeyConfig = {
      id: Date.now().toString(),
      provider: newKeyForm.provider,
      name: newKeyForm.name,
      status: 'active',
      lastUsed: 'Never',
      usage: 0,
      cost: 0,
      masked: `${newKeyForm.apiKey.substring(0, 6)}...${newKeyForm.apiKey.slice(-6)}`
    };

    setApiKeys([...apiKeys, newKey]);
    setNewKeyForm({ provider: '', name: '', apiKey: '', autoRotate: false });
  };

  const handleDeleteKey = (id: string) => {
    if (confirm('Are you sure you want to delete this API key?')) {
      setApiKeys(apiKeys.filter(key => key.id !== id));
    }
  };

  const handleRotateKey = (id: string) => {
    console.log(`Rotating key: ${id}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            API Key Management
          </h1>
          <p className="text-gray-300">Secure management of LLM provider API keys with HashiCorp Vault</p>
        </div>

        <Card className="mb-8 bg-gradient-to-r from-green-600/20 to-emerald-600/20 border-green-500/30">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-green-300 flex items-center gap-2">
                  🛡️ HashiCorp Vault Status
                </CardTitle>
                <CardDescription className="text-green-200">Security engine operational</CardDescription>
              </div>
              <Badge variant="default" className="bg-green-600">
                {vaultStatus.health.toUpperCase()}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-green-400">Connection:</span>
                <div className="font-semibold text-green-100">
                  {vaultStatus.connected ? '✅ Connected' : '❌ Disconnected'}
                </div>
              </div>
              <div>
                <span className="text-green-400">Last Backup:</span>
                <div className="font-semibold text-green-100">{vaultStatus.lastBackup}</div>
              </div>
              <div>
                <span className="text-green-400">Auto-rotation:</span>
                <div className="font-semibold text-green-100">✅ Enabled</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="keys" className="space-y-6">
          <TabsList className="bg-slate-800/50 border-slate-700">
            <TabsTrigger value="keys" className="data-[state=active]:bg-blue-600">API Keys</TabsTrigger>
            <TabsTrigger value="add" className="data-[state=active]:bg-blue-600">Add New Key</TabsTrigger>
            <TabsTrigger value="security" className="data-[state=active]:bg-blue-600">Security</TabsTrigger>
            <TabsTrigger value="audit" className="data-[state=active]:bg-blue-600">Audit Logs</TabsTrigger>
          </TabsList>

          <TabsContent value="keys">
            <div className="grid gap-4">
              {apiKeys.map((key) => (
                <Card key={key.id} className="bg-gradient-to-r from-slate-800/50 to-slate-700/50 border-slate-600/30">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg text-white flex items-center gap-2">
                          {key.name}
                          <Badge variant={getStatusVariant(key.status)} className="capitalize">
                            {key.status}
                          </Badge>
                        </CardTitle>
                        <CardDescription className="text-slate-300 capitalize">
                          {key.provider} • {key.masked}
                        </CardDescription>
                      </div>
                      <div className={`w-3 h-3 rounded-full ${getStatusColor(key.status)} animate-pulse`}></div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4 text-sm">
                      <div>
                        <span className="text-slate-400">Last Used:</span>
                        <div className="font-semibold text-white">{key.lastUsed}</div>
                      </div>
                      <div>
                        <span className="text-slate-400">Usage:</span>
                        <div className="font-semibold text-white">{key.usage.toLocaleString()} tokens</div>
                      </div>
                      <div>
                        <span className="text-slate-400">Cost:</span>
                        <div className="font-semibold text-white">${key.cost.toFixed(2)}</div>
                      </div>
                      <div>
                        <span className="text-slate-400">Provider:</span>
                        <div className="font-semibold text-white capitalize">{key.provider}</div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => handleRotateKey(key.id)}
                      >
                        🔄 Rotate
                      </Button>
                      <Button size="sm" variant="secondary">
                        📊 Usage Stats
                      </Button>
                      <Button size="sm" variant="secondary">
                        🔧 Configure
                      </Button>
                      <Button 
                        size="sm" 
                        variant="destructive" 
                        onClick={() => handleDeleteKey(key.id)}
                      >
                        🗑️ Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="add">
            <Card className="bg-gradient-to-r from-slate-800/50 to-slate-700/50 border-slate-600/30">
              <CardHeader>
                <CardTitle className="text-white">Add New API Key</CardTitle>
                <CardDescription className="text-slate-300">
                  Securely add a new LLM provider API key to Vault storage
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="provider" className="text-slate-300">Provider</Label>
                    <select 
                      className="w-full p-2 bg-slate-700 border border-slate-600 rounded-md text-white"
                      value={newKeyForm.provider}
                      onChange={(e) => setNewKeyForm({...newKeyForm, provider: e.target.value})}
                    >
                      <option value="">Select Provider</option>
                      <option value="openai">OpenAI</option>
                      <option value="anthropic">Anthropic (Claude)</option>
                      <option value="google">Google (Gemini)</option>
                      <option value="blackbox">BlackBox AI</option>
                      <option value="openrouter">OpenRouter</option>
                      <option value="pinecone">Pinecone</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-slate-300">Display Name</Label>
                    <Input
                      id="name"
                      placeholder="e.g., Production GPT-4"
                      className="bg-slate-700 border-slate-600 text-white"
                      value={newKeyForm.name}
                      onChange={(e) => setNewKeyForm({...newKeyForm, name: e.target.value})}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="apikey" className="text-slate-300">API Key</Label>
                  <Input
                    id="apikey"
                    type="password"
                    placeholder="Enter your API key"
                    className="bg-slate-700 border-slate-600 text-white"
                    value={newKeyForm.apiKey}
                    onChange={(e) => setNewKeyForm({...newKeyForm, apiKey: e.target.value})}
                  />
                  <p className="text-xs text-slate-400">
                    Key will be encrypted and stored securely in HashiCorp Vault
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch 
                    id="autorotate"
                    checked={newKeyForm.autoRotate}
                    onCheckedChange={(checked) => setNewKeyForm({...newKeyForm, autoRotate: checked})}
                  />
                  <Label htmlFor="autorotate" className="text-slate-300">
                    Enable automatic key rotation (if supported by provider)
                  </Label>
                </div>

                <Alert className="border-blue-500 bg-blue-500/10">
                  <AlertDescription className="text-blue-200">
                    🔐 All API keys are encrypted at rest and in transit using HashiCorp Vault's 
                    enterprise-grade security. Keys are never stored in plain text.
                  </AlertDescription>
                </Alert>

                <Button 
                  onClick={handleAddKey}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  disabled={!newKeyForm.provider || !newKeyForm.name || !newKeyForm.apiKey}
                >
                  🔒 Securely Add API Key
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security">
            <div className="grid gap-6">
              <Card className="bg-gradient-to-r from-slate-800/50 to-slate-700/50 border-slate-600/30">
                <CardHeader>
                  <CardTitle className="text-white">Security Settings</CardTitle>
                  <CardDescription className="text-slate-300">Configure Vault security policies</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button variant="outline" className="w-full justify-start">
                    🔑 Generate New Vault Token
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    👥 Manage Agent Permissions
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    📋 View Security Policies
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    🔄 Configure Auto-Rotation
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="audit">
            <Card className="bg-gradient-to-r from-slate-800/50 to-slate-700/50 border-slate-600/30">
              <CardHeader>
                <CardTitle className="text-white">Audit Logs</CardTitle>
                <CardDescription className="text-slate-300">View API key access and rotation history</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  {[
                    { time: '2024-01-20 14:30:15', event: 'API Key Access', user: 'code-generator-agent', key: 'OpenAI GPT-4', status: 'success' },
                    { time: '2024-01-20 14:25:42', event: 'Key Rotation', user: 'system', key: 'Claude Sonnet', status: 'success' },
                    { time: '2024-01-20 14:20:08', event: 'API Key Access', user: 'learning-agent', key: 'Gemini Pro', status: 'success' },
                    { time: '2024-01-20 14:15:33', event: 'Failed Access', user: 'unknown-agent', key: 'BlackBox AI', status: 'denied' }
                  ].map((log, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-slate-700/30 rounded-lg">
                      <div className="flex-1">
                        <div className="font-medium text-white">{log.event}</div>
                        <div className="text-slate-400">{log.time} • {log.user} • {log.key}</div>
                      </div>
                      <Badge variant={log.status === 'success' ? 'default' : 'destructive'}>
                        {log.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default APIKeyManagement;