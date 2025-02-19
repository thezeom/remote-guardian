
# Documentation de l'API Frontend

## Introduction

Cette documentation détaille les endpoints API nécessaires pour le développement du backend de l'application de surveillance réseau. L'application permet de gérer des sites, des équipements réseau et des alertes.

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
  created_at: string;
  updated_at: string;
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
  last_maintenance: string | null;
  created_at: string;
  updated_at: string;
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
  created_at: string;
  resolved_at: string | null;
  updated_at?: string;
}
```

## Endpoints API requis

### Sites

- `GET /api/sites` - Liste tous les sites
- `GET /api/sites/:id` - Récupère un site spécifique
- `POST /api/sites` - Crée un nouveau site
- `PUT /api/sites/:id` - Met à jour un site
- `DELETE /api/sites/:id` - Supprime un site
- `GET /api/sites/:id/stats` - Récupère les statistiques d'un site

### Équipements

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

## Notes pour le développement

1. Tous les timestamps doivent être en UTC et au format ISO 8601
2. Les IDs doivent être des UUIDs
3. Implémenter la pagination pour les endpoints de liste
4. Supporter le filtrage et le tri des résultats
5. Mettre en place des logs détaillés pour le debugging
6. Implémenter des mécanismes de rate limiting
7. Supporter CORS pour le développement local

