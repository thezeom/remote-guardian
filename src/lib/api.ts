
/**
 * API Client pour l'application de surveillance réseau
 * 
 * Cette classe gère toutes les interactions avec le backend.
 * Chaque méthode correspond à un endpoint API spécifique.
 * Les types de données sont définis dans src/types/database.ts
 */

import type { Site, Equipment, Alert } from "@/types/database";

/**
 * Base URL de l'API. À configurer selon l'environnement.
 */
const API_URL = process.env.API_URL || "http://localhost:3000/api";

/**
 * Classe principale pour les appels API
 */
export class ApiClient {
  private baseUrl: string;
  private token: string | null;

  constructor(baseUrl: string = API_URL) {
    this.baseUrl = baseUrl;
    this.token = null;
  }

  /**
   * Configure le token d'authentification pour les requêtes
   */
  setAuthToken(token: string) {
    this.token = token;
  }

  /**
   * Headers par défaut pour toutes les requêtes
   */
  private get headers() {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };
    
    if (this.token) {
      headers["Authorization"] = `Bearer ${this.token}`;
    }
    
    return headers;
  }

  /**
   * Méthode générique pour les appels API
   */
  private async fetch<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: this.headers,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    return response.json();
  }

  // Sites API
  /**
   * Récupère la liste des sites
   * GET /api/sites
   */
  async getSites(): Promise<Site[]> {
    return this.fetch<Site[]>("/sites");
  }

  /**
   * Récupère un site par son ID
   * GET /api/sites/:id
   */
  async getSiteById(id: string): Promise<Site> {
    return this.fetch<Site>(`/sites/${id}`);
  }

  /**
   * Crée un nouveau site
   * POST /api/sites
   */
  async createSite(site: Omit<Site, "id" | "created_at" | "updated_at">): Promise<Site> {
    return this.fetch<Site>("/sites", {
      method: "POST",
      body: JSON.stringify(site),
    });
  }

  /**
   * Met à jour un site
   * PUT /api/sites/:id
   */
  async updateSite(id: string, site: Partial<Site>): Promise<Site> {
    return this.fetch<Site>(`/sites/${id}`, {
      method: "PUT",
      body: JSON.stringify(site),
    });
  }

  /**
   * Supprime un site
   * DELETE /api/sites/:id
   */
  async deleteSite(id: string): Promise<void> {
    await this.fetch(`/sites/${id}`, {
      method: "DELETE",
    });
  }

  // Equipment API
  /**
   * Récupère la liste des équipements
   * GET /api/equipment
   */
  async getEquipment(): Promise<Equipment[]> {
    return this.fetch<Equipment[]>("/equipment");
  }

  /**
   * Récupère les équipements d'un site
   * GET /api/sites/:siteId/equipment
   */
  async getEquipmentBySite(siteId: string): Promise<Equipment[]> {
    return this.fetch<Equipment[]>(`/sites/${siteId}/equipment`);
  }

  /**
   * Crée un nouvel équipement
   * POST /api/equipment
   */
  async createEquipment(
    equipment: Omit<Equipment, "id" | "created_at" | "updated_at">
  ): Promise<Equipment> {
    return this.fetch<Equipment>("/equipment", {
      method: "POST",
      body: JSON.stringify(equipment),
    });
  }

  /**
   * Met à jour un équipement
   * PUT /api/equipment/:id
   */
  async updateEquipment(
    id: string,
    equipment: Partial<Equipment>
  ): Promise<Equipment> {
    return this.fetch<Equipment>(`/equipment/${id}`, {
      method: "PUT",
      body: JSON.stringify(equipment),
    });
  }

  /**
   * Supprime un équipement
   * DELETE /api/equipment/:id
   */
  async deleteEquipment(id: string): Promise<void> {
    await this.fetch(`/equipment/${id}`, {
      method: "DELETE",
    });
  }

  // Alerts API
  /**
   * Récupère la liste des alertes
   * GET /api/alerts
   */
  async getAlerts(): Promise<Alert[]> {
    return this.fetch<Alert[]>("/alerts");
  }

  /**
   * Récupère les alertes d'un équipement
   * GET /api/equipment/:equipmentId/alerts
   */
  async getAlertsByEquipment(equipmentId: string): Promise<Alert[]> {
    return this.fetch<Alert[]>(`/equipment/${equipmentId}/alerts`);
  }

  /**
   * Crée une nouvelle alerte
   * POST /api/alerts
   */
  async createAlert(
    alert: Omit<Alert, "id" | "created_at" | "updated_at">
  ): Promise<Alert> {
    return this.fetch<Alert>("/alerts", {
      method: "POST",
      body: JSON.stringify(alert),
    });
  }

  /**
   * Met à jour une alerte
   * PUT /api/alerts/:id
   */
  async updateAlert(id: string, alert: Partial<Alert>): Promise<Alert> {
    return this.fetch<Alert>(`/alerts/${id}`, {
      method: "PUT",
      body: JSON.stringify(alert),
    });
  }

  /**
   * Récupère les statistiques d'un site
   * GET /api/sites/:siteId/stats
   */
  async getSiteStats(siteId: string): Promise<{
    equipment: { [key: string]: number };
    alerts: { [key: string]: { [key: string]: number } };
  }> {
    return this.fetch(`/sites/${siteId}/stats`);
  }

  // Agent API
  /**
   * Enregistre un nouvel agent
   * POST /api/agents
   */
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

  /**
   * Envoie des données de l'agent au serveur
   * POST /api/agents/:agentId/data
   */
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

// Export une instance par défaut
export const api = new ApiClient();

// Export des fonctions individuelles
export const getSites = () => api.getSites();
export const getSiteById = (id: string) => api.getSiteById(id);
export const createSite = (site: Omit<Site, "id" | "created_at" | "updated_at">) => api.createSite(site);
export const updateSite = (id: string, site: Partial<Site>) => api.updateSite(id, site);
export const deleteSite = (id: string) => api.deleteSite(id);
export const getEquipment = () => api.getEquipment();
export const getEquipmentBySite = (siteId: string) => api.getEquipmentBySite(siteId);
export const createEquipment = (equipment: Omit<Equipment, "id" | "created_at" | "updated_at">) => api.createEquipment(equipment);
export const updateEquipment = (id: string, equipment: Partial<Equipment>) => api.updateEquipment(id, equipment);
export const deleteEquipment = (id: string) => api.deleteEquipment(id);
export const getAlerts = () => api.getAlerts();
export const getAlertsByEquipment = (equipmentId: string) => api.getAlertsByEquipment(equipmentId);
export const createAlert = (alert: Omit<Alert, "id" | "created_at" | "updated_at">) => api.createAlert(alert);
export const updateAlert = (id: string, alert: Partial<Alert>) => api.updateAlert(id, alert);
export const getSiteStats = (siteId: string) => api.getSiteStats(siteId);
export const registerAgent = (siteId: string, agentInfo: { name: string; version: string; os: string; }) => api.registerAgent(siteId, agentInfo);
export const sendAgentData = (agentId: string, data: { metrics: any; devices: any[]; timestamp: string; }) => api.sendAgentData(agentId, data);
