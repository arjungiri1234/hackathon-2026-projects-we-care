import { supabase } from "../lib/supabase";
import { extractLookupName } from "./lookup-service";

export async function getAvailableSpecialists(specialty?: string) {
  const { data, error } = await supabase
    .from("doctors")
    .select(
      "id, full_name, contact_number, specialties(name), hospitals(name)",
    )
    .order("full_name");

  if (error) throw new Error(error.message);

  return data
    .map((doctor) => ({
      id: doctor.id,
      full_name: doctor.full_name,
      specialty: extractLookupName(doctor.specialties) ?? "",
      hospital: extractLookupName(doctor.hospitals) ?? "",
      phone: doctor.contact_number,
    }))
    .filter((specialist) => {
      if (!specialty) return true;
      return specialist.specialty
        .toLowerCase()
        .includes(specialty.toLowerCase());
    });
}
