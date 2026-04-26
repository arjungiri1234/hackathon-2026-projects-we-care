import { supabase } from "../lib/supabase";

export async function getAvailableSpecialists(specialty?: string) {
  let query = supabase
    .from("specialties")
    .select("id, name")
    .order("name");

  if (specialty) {
    query = query.ilike("name", `%${specialty}%`) as typeof query;
  }

  const { data, error } = await query;
  if (error) throw new Error(error.message);

  return (data ?? []).map((s) => ({
    id: s.id,
    full_name: s.name,
    specialty: s.name,
    hospital: "",
    phone: "",
    available: true,
  }));
}
