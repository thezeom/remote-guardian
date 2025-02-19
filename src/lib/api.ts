
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

// Alerts
export const getAlerts = async () => {
  const { data, error } = await supabase
    .from('alerts')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data as Alert[];
};
