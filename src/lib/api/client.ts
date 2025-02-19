
/**
 * Client API de base avec la configuration commune
 */

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

export class ApiClient {
  private baseUrl: string;
  private token: string | null;

  constructor(baseUrl: string = API_URL) {
    this.baseUrl = baseUrl;
    this.token = null;
  }

  setAuthToken(token: string) {
    this.token = token;
  }

  private get headers() {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };
    
    if (this.token) {
      headers["Authorization"] = `Bearer ${this.token}`;
    }
    
    return headers;
  }

  protected async fetch<T>(
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
}

// Export une instance par défaut
export const apiClient = new ApiClient();
