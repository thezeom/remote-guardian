
export interface Site {
  id: string;
  name: string;
  address: string;
  status: 'online' | 'offline' | 'warning';
  created_at: string;
  updated_at: string;
}

export interface Equipment {
  id: string;
  site_id: string;
  name: string;
  type: 'camera' | 'router' | 'switch' | 'server' | 'access_point' | 'other';
  status: 'online' | 'offline' | 'warning';
  ip_address: string | null;
  last_maintenance: string | null;
  created_at: string;
  updated_at: string;
}

export interface Alert {
  id: string;
  title: string;
  description: string | null;
  type: 'error' | 'warning' | 'success';
  status: 'new' | 'in_progress' | 'resolved';
  equipment_id: string;
  created_at: string;
  updated_at: string;
}
