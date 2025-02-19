# Documentation de l'API Frontend

## Introduction

Cette documentation détaille les endpoints API nécessaires pour le développement du backend de l'application de surveillance réseau. L'application permet de gérer des sites, des équipements réseau et des alertes.

## Authentification

### Format du Token
```
Authorization: Bearer <jwt_token>
```

Le token JWT doit contenir :
- `sub`: ID de l'utilisateur
- `exp`: Timestamp d'expiration
- `role`: Rôle de l'utilisateur

### Rafraîchissement du Token
Le token a une durée de validité de 24h. Un endpoint de rafraîchissement est nécessaire :
```
POST /api/auth/refresh
Authorization: Bearer <refresh_token>
```

## Structure des données

### Sites
```typescript
interface Site {
  id: string;
  name: string;
  address: string;
  city?: string;
  postal_code?: string;
  status: 'online' | 'offline' | 'warning' | 'pending';
  created_at: string; // ISO 8601
  updated_at: string; // ISO 8601
}
```

### Équipements
```typescript
interface Equipment {
  id: string;
  site_id: string;
  name: string;
  type: 'camera' | 'video-recorder' | 'switch' | 'server' | 'access_point' | 'router' | 'other';
  status: 'online' | 'offline' | 'maintenance';
  ip_address: string | null;
  last_maintenance: string | null; // ISO 8601
  created_at: string; // ISO 8601
  updated_at: string; // ISO 8601
}
```

### Alertes
```typescript
interface Alert {
  id: string;
  equipment_id: string;
  type: 'error' | 'warning' | 'info';
  title: string;
  message: string;
  description?: string;
  status: 'active' | 'resolved' | 'acknowledged';
  created_at: string; // ISO 8601
  resolved_at: string | null; // ISO 8601
  updated_at?: string; // ISO 8601
}
```

### Format des Métriques Système
```typescript
interface SystemMetrics {
  cpu_usage: number;      // Pourcentage (0-100)
  memory_total: number;   // Bytes
  memory_used: number;    // Bytes
  disk_total: number;     // Bytes
  disk_used: number;      // Bytes
  network_in: number;     // Bytes/s
  network_out: number;    // Bytes/s
  timestamp: string;      // ISO 8601
}
```

## Endpoints API

### Sites

#### Liste des sites
```
GET /api/sites
Query Parameters:
  - page: number (default: 1)
  - limit: number (default: 20)
  - sort: string (ex: "name:asc", "status:desc")
  - status: string[] (filtrer par status)
```

#### Récupérer un site
```
GET /api/sites/:id
```

#### Créer un site
```
POST /api/sites
Protected: Requires authentication
```

#### Mettre à jour un site
```
PUT /api/sites/:id
Protected: Requires authentication
```

#### Supprimer un site
```
DELETE /api/sites/:id
Protected: Requires authentication
```

#### Statistiques d'un site
```
GET /api/sites/:id/stats
Response format:
{
  equipment: {
    total: number;
    online: number;
    offline: number;
    maintenance: number;
    by_type: {
      camera: number;
      switch: number;
      // etc...
    }
  },
  alerts: {
    total: number;
    by_status: {
      active: number;
      resolved: number;
      acknowledged: number;
    },
    by_type: {
      error: number;
      warning: number;
      info: number;
    }
  }
}
```

### Équipements

#### Liste des équipements
```
GET /api/equipment
Query Parameters:
  - page: number (default: 1)
  - limit: number (default: 20)
  - sort: string
  - type: string[]
  - status: string[]
  - site_id: string
```

- `GET /api/equipment` - Liste tous les équipements
- `GET /api/sites/:siteId/equipment` - Liste les équipements d'un site
- `POST /api/equipment` - Crée un nouvel équipement
- `PUT /api/equipment/:id` - Met à jour un équipement
- `DELETE /api/equipment/:id` - Supprime un équipement

### Alertes

- `GET /api/alerts` - Liste toutes les alertes
- `GET /api/equipment/:equipmentId/alerts` - Liste les alertes d'un équipement
- `POST /api/alerts` - Crée une nouvelle alerte
- `PUT /api/alerts/:id` - Met à jour une alerte

### Agents

- `POST /api/agents` - Enregistre un nouvel agent
- `POST /api/agents/:agentId/data` - Envoie des données depuis l'agent

## Format des réponses

Toutes les réponses doivent suivre ce format :

```json
{
  "data": {}, // Données de la réponse
  "error": null // Message d'erreur si applicable
}
```

## Gestion des erreurs

Les erreurs doivent retourner un statut HTTP approprié et un message d'erreur :

```json
{
  "data": null,
  "error": {
    "message": "Description de l'erreur",
    "code": "ERROR_CODE"
  }
}
```

## Authentification

L'API utilise l'authentification Bearer Token. Chaque requête doit inclure un header :
```
Authorization: Bearer <token>
```

## Exemples de requêtes

### Création d'un site
```bash
POST /api/sites
Content-Type: application/json
Authorization: Bearer <token>

{
  "name": "Site Paris",
  "address": "123 rue de Paris",
  "city": "Paris",
  "postal_code": "75001"
}
```

### Mise à jour d'un équipement
```bash
PUT /api/equipment/123
Content-Type: application/json
Authorization: Bearer <token>

{
  "status": "maintenance",
  "last_maintenance": "2024-03-14T12:00:00Z"
}
```

## Websockets

L'API doit supporter les WebSockets pour les mises à jour en temps réel :

### Événements

#### Connexion
```
ws://api-url/ws
Headers:
  Authorization: Bearer <token>
```

#### Types d'événements
```typescript
interface WebSocketEvent {
  type: 'equipment_status' | 'new_alert' | 'alert_update' | 'site_status';
  data: {
    id: string;
    // Données spécifiques à l'événement
  };
}
```

## Gestion des erreurs

### Format des erreurs
```typescript
interface ApiError {
  error: {
    code: string;
    message: string;
    details?: unknown;
  }
}
```

### Codes d'erreur standards
- `AUTH_REQUIRED`: Authentication requise
- `AUTH_INVALID`: Token invalide
- `NOT_FOUND`: Ressource non trouvée
- `VALIDATION_ERROR`: Données invalides
- `FORBIDDEN`: Action non autorisée
- `INTERNAL_ERROR`: Erreur serveur

## Notes pour le développement

1. Tous les timestamps doivent être en UTC et au format ISO 8601
2. Les IDs doivent être des UUIDs
3. Implémenter la pagination pour les endpoints de liste
4. Supporter le filtrage et le tri des résultats
5. Mettre en place des logs détaillés pour le debugging
6. Implémenter des mécanismes de rate limiting
7. Supporter CORS pour le développement local
8. Implémenter des healthchecks pour le monitoring
9. Mettre en place des backups réguliers de la base de données
10. Configurer un système de monitoring des performances
