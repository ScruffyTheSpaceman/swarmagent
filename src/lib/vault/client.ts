import nodeVault from 'node-vault';
import { VaultConfig, Result } from '@/types';

export class VaultClient {
  private vault: any;
  private config: VaultConfig;

  constructor(config: VaultConfig) {
    this.config = config;
    this.vault = nodeVault({
      apiVersion: 'v1',
      endpoint: config.endpoint,
      token: config.token,
      namespace: config.namespace
    });
  }

  async initialize(): Promise<Result<boolean>> {
    try {
      await this.vault.health();
      const tokenInfo = await this.vault.tokenLookupSelf();
      
      console.log('Vault connection established:', {
        endpoint: this.config.endpoint,
        policies: tokenInfo.data.policies
      });

      return { success: true, data: true };
    } catch (error: any) {
      console.error('Vault initialization failed:', error);
      return { 
        success: false, 
        error: new Error(`Vault connection failed: ${error.message}`) 
      };
    }
  }

  async storeAPIKey(provider: string, apiKey: string): Promise<Result<boolean>> {
    try {
      const secretPath = `${this.config.mountPath}/llm-providers/${provider}`;
      
      await this.vault.write(secretPath, {
        data: {
          api_key: apiKey,
          created_at: new Date().toISOString(),
          version: '1'
        }
      });

      console.log(`API key stored for provider: ${provider}`);
      return { success: true, data: true };
    } catch (error: any) {
      console.error(`Failed to store API key for ${provider}:`, error);
      return { 
        success: false, 
        error: new Error(`Failed to store API key: ${error.message}`) 
      };
    }
  }

  async getAPIKey(provider: string): Promise<Result<string>> {
    try {
      const secretPath = `${this.config.mountPath}/llm-providers/${provider}`;
      const secret = await this.vault.read(secretPath);
      
      if (!secret?.data?.data?.api_key) {
        return { 
          success: false, 
          error: new Error(`API key not found for provider: ${provider}`) 
        };
      }

      return { success: true, data: secret.data.data.api_key };
    } catch (error: any) {
      console.error(`Failed to retrieve API key for ${provider}:`, error);
      return { 
        success: false, 
        error: new Error(`Failed to retrieve API key: ${error.message}`) 
      };
    }
  }

  async rotateAPIKey(provider: string, newApiKey: string): Promise<Result<boolean>> {
    try {
      const secretPath = `${this.config.mountPath}/llm-providers/${provider}`;
      
      const currentSecret = await this.vault.read(secretPath);
      const currentVersion = currentSecret?.data?.data?.version || 1;
      
      await this.vault.write(secretPath, {
        data: {
          api_key: newApiKey,
          created_at: new Date().toISOString(),
          version: (parseInt(currentVersion) + 1).toString(),
          previous_rotation: new Date().toISOString()
        }
      });

      console.log(`API key rotated for provider: ${provider}`);
      return { success: true, data: true };
    } catch (error: any) {
      console.error(`Failed to rotate API key for ${provider}:`, error);
      return { 
        success: false, 
        error: new Error(`Failed to rotate API key: ${error.message}`) 
      };
    }
  }

  async listProviders(): Promise<Result<string[]>> {
    try {
      const listPath = `${this.config.mountPath}/llm-providers`;
      const list = await this.vault.list(listPath);
      
      return { success: true, data: list.data.keys || [] };
    } catch (error: any) {
      console.error('Failed to list providers:', error);
      return { 
        success: false, 
        error: new Error(`Failed to list providers: ${error.message}`) 
      };
    }
  }

  async deleteAPIKey(provider: string): Promise<Result<boolean>> {
    try {
      const secretPath = `${this.config.mountPath}/llm-providers/${provider}`;
      await this.vault.delete(secretPath);
      
      console.log(`API key deleted for provider: ${provider}`);
      return { success: true, data: true };
    } catch (error: any) {
      console.error(`Failed to delete API key for ${provider}:`, error);
      return { 
        success: false, 
        error: new Error(`Failed to delete API key: ${error.message}`) 
      };
    }
  }

  async createAgentRole(agentId: string, policies: string[]): Promise<Result<string>> {
    try {
      const roleName = `agent-${agentId}`;
      
      await this.vault.write(`auth/approle/role/${roleName}`, {
        policies: policies.join(','),
        token_ttl: '1h',
        token_max_ttl: '24h',
        secret_id_ttl: '10m'
      });

      const roleIdResponse = await this.vault.read(`auth/approle/role/${roleName}/role-id`);
      const roleId = roleIdResponse.data.role_id;

      const secretIdResponse = await this.vault.write(`auth/approle/role/${roleName}/secret-id`, {});
      const secretId = secretIdResponse.data.secret_id;

      console.log(`AppRole created for agent: ${agentId}`);
      return { success: true, data: JSON.stringify({ roleId, secretId }) };
    } catch (error: any) {
      console.error(`Failed to create agent role for ${agentId}:`, error);
      return { 
        success: false, 
        error: new Error(`Failed to create agent role: ${error.message}`) 
      };
    }
  }

  async authenticateAgent(roleId: string, secretId: string): Promise<Result<string>> {
    try {
      const authResponse = await this.vault.write('auth/approle/login', {
        role_id: roleId,
        secret_id: secretId
      });

      const token = authResponse.auth.client_token;
      return { success: true, data: token };
    } catch (error: any) {
      console.error('Agent authentication failed:', error);
      return { 
        success: false, 
        error: new Error(`Agent authentication failed: ${error.message}`) 
      };
    }
  }

  async getAuditLogs(path?: string): Promise<Result<any[]>> {
    try {
      const auditPath = path || 'sys/audit';
      const logs = await this.vault.read(auditPath);
      
      return { success: true, data: logs.data || [] };
    } catch (error: any) {
      console.error('Failed to retrieve audit logs:', error);
      return { 
        success: false, 
        error: new Error(`Failed to retrieve audit logs: ${error.message}`) 
      };
    }
  }

  async renewToken(): Promise<Result<boolean>> {
    try {
      await this.vault.tokenRenewSelf();
      console.log('Token renewed successfully');
      return { success: true, data: true };
    } catch (error: any) {
      console.error('Token renewal failed:', error);
      return { 
        success: false, 
        error: new Error(`Token renewal failed: ${error.message}`) 
      };
    }
  }
}