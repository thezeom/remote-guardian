
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

// Equipment
export const getEquipment = async () => {
  const { data, error } = await supabase
    .from('equipment')
    .select('*')
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

// Alerts
export const getAlerts = async () => {
  const { data, error } = await supabase
    .from('alerts')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data as Alert[];
};
