
import { supabase } from "@/integrations/supabase/client";
import { Site, Equipment, Alert } from "@/types/database";

// Sites
export const getSites = async () => {
  const { data, error } = await supabase
    .from('sites')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data as Site[];
};

export const getSiteById = async (id: string) => {
  const { data, error } = await supabase
    .from('sites')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) throw error;
  return data as Site;
};

export const createSite = async (site: Omit<Site, 'id' | 'created_at' | 'updated_at'>) => {
  const { data, error } = await supabase
    .from('sites')
    .insert([site])
    .select()
    .single();
  
  if (error) throw error;
  return data as Site;
};

export const updateSite = async (id: string, site: Partial<Site>) => {
  const { data, error } = await supabase
    .from('sites')
    .update(site)
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data as Site;
};

export const deleteSite = async (id: string) => {
  const { error } = await supabase
    .from('sites')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
};

export const getSiteStats = async (siteId: string) => {
  // Pour les équipements, comptons manuellement chaque statut
  const equipmentResponse = await supabase
    .from('equipment')
    .select('status')
    .eq('site_id', siteId);

  const alertResponse = await supabase
    .from('alerts')
    .select('type, status')
    .eq('equipment.site_id', siteId);

  if (equipmentResponse.error) throw equipmentResponse.error;
  if (alertResponse.error) throw alertResponse.error;

  // Calculer les statistiques des équipements
  const equipmentStats = equipmentResponse.data.reduce((acc: Record<string, number>, curr) => {
    acc[curr.status] = (acc[curr.status] || 0) + 1;
    return acc;
  }, {});

  // Calculer les statistiques des alertes
  const alertStats = alertResponse.data.reduce((acc: Record<string, Record<string, number>>, curr) => {
    if (!acc[curr.type]) {
      acc[curr.type] = {};
    }
    acc[curr.type][curr.status] = (acc[curr.type][curr.status] || 0) + 1;
    return acc;
  }, {});

  return {
    equipment: equipmentStats,
    alerts: alertStats
  };
};

// Equipment
export const getEquipment = async () => {
  const { data, error } = await supabase
    .from('equipment')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data as Equipment[];
};

export const getEquipmentByType = async (type: Equipment['type']) => {
  const { data, error } = await supabase
    .from('equipment')
    .select('*')
    .eq('type', type)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data as Equipment[];
};

export const getEquipmentByStatus = async (status: Equipment['status']) => {
  const { data, error } = await supabase
    .from('equipment')
    .select('*')
    .eq('status', status)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data as Equipment[];
};

export const getEquipmentBySite = async (siteId: string) => {
  const { data, error } = await supabase
    .from('equipment')
    .select('*')
    .eq('site_id', siteId)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data as Equipment[];
};

export const getEquipmentById = async (id: string) => {
  const { data, error } = await supabase
    .from('equipment')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) throw error;
  return data as Equipment;
};

export const createEquipment = async (equipment: Omit<Equipment, 'id' | 'created_at' | 'updated_at'>) => {
  const { data, error } = await supabase
    .from('equipment')
    .insert([equipment])
    .select()
    .single();
  
  if (error) throw error;
  return data as Equipment;
};

export const updateEquipment = async (id: string, equipment: Partial<Equipment>) => {
  const { data, error } = await supabase
    .from('equipment')
    .update(equipment)
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data as Equipment;
};

export const deleteEquipment = async (id: string) => {
  const { error } = await supabase
    .from('equipment')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
};

export const bulkUpdateEquipment = async (ids: string[], updates: Partial<Equipment>) => {
  const { error } = await supabase
    .from('equipment')
    .update(updates)
    .in('id', ids);
  
  if (error) throw error;
};

// Alerts
export const getAlerts = async () => {
  const { data, error } = await supabase
    .from('alerts')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data as Alert[];
};

export const getActiveAlerts = async () => {
  const { data, error } = await supabase
    .from('alerts')
    .select('*')
    .eq('status', 'active')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data as Alert[];
};

export const getAlertsByType = async (type: Alert['type']) => {
  const { data, error } = await supabase
    .from('alerts')
    .select('*')
    .eq('type', type)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data as Alert[];
};

export const getAlertsByStatus = async (status: Alert['status']) => {
  const { data, error } = await supabase
    .from('alerts')
    .select('*')
    .eq('status', status)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data as Alert[];
};

export const getAlertsByEquipment = async (equipmentId: string) => {
  const { data, error } = await supabase
    .from('alerts')
    .select('*')
    .eq('equipment_id', equipmentId)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data as Alert[];
};

export const getAlertsBySite = async (siteId: string) => {
  const { data, error } = await supabase
    .from('alerts')
    .select('*')
    .eq('equipment.site_id', siteId)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data as Alert[];
};

export const createAlert = async (alert: Omit<Alert, 'id' | 'created_at' | 'updated_at'>) => {
  const { data, error } = await supabase
    .from('alerts')
    .insert([alert])
    .select()
    .single();
  
  if (error) throw error;
  return data as Alert;
};

export const updateAlert = async (id: string, alert: Partial<Alert>) => {
  const { data, error } = await supabase
    .from('alerts')
    .update(alert)
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data as Alert;
};

export const deleteAlert = async (id: string) => {
  const { error } = await supabase
    .from('alerts')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
};

export const bulkUpdateAlerts = async (ids: string[], updates: Partial<Alert>) => {
  const { error } = await supabase
    .from('alerts')
    .update(updates)
    .in('id', ids);
  
  if (error) throw error;
};
