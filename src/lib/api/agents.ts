
/**
 * API Client pour la gestion des agents
 */

import { ApiClient, apiClient } from "./client";

export class AgentsApi extends ApiClient {
  async registerAgent(siteId: string, agentInfo: {
    name: string;
    version: string;
    os: string;
  }): Promise<{ token: string }> {
    return this.fetch("/agents", {
      method: "POST",
      body: JSON.stringify({ siteId, ...agentInfo }),
    });
  }

  async sendAgentData(agentId: string, data: {
    metrics: any;
    devices: any[];
    timestamp: string;
  }): Promise<void> {
    await this.fetch(`/agents/${agentId}/data`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }
}

export const agentsApi = new AgentsApi();

// Export des fonctions individuelles
export const registerAgent = (siteId: string, agentInfo: { name: string; version: string; os: string; }) => 
  agentsApi.registerAgent(siteId, agentInfo);
export const sendAgentData = (agentId: string, data: { metrics: any; devices: any[]; timestamp: string; }) => 
  agentsApi.sendAgentData(agentId, data);
