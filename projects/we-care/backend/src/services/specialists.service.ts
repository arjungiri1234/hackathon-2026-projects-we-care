import { supabase } from "../lib/supabase";
import { extractLookupName } from "./lookup-service";

interface SpecialistsQueryOptions {
  specialty?: string;
  page: number;
  pageSize: number;
}

export async function getAvailableSpecialists({
  specialty,
  page,
  pageSize,
}: SpecialistsQueryOptions) {
  const { data, error } = await supabase
    .from("doctors")
    .select("id, full_name, contact_number, specialties(name), hospitals(name)")
    .order("full_name");

  if (error) throw new Error(error.message);

  const allItems = data
    .map((doctor) => ({
      id: doctor.id,
      full_name: doctor.full_name,
      specialty: extractLookupName(doctor.specialties) ?? "",
      hospital: extractLookupName(doctor.hospitals) ?? "",
      phone: doctor.contact_number ?? "",
      available: true,
    }))
    .filter((doctor) => {
      if (!specialty) return true;
      return doctor.specialty.toLowerCase().includes(specialty.toLowerCase());
    });

  const total = allItems.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const startIndex = (page - 1) * pageSize;

  return {
    items: allItems.slice(startIndex, startIndex + pageSize),
    page,
    pageSize,
    total,
    totalPages,
  };
}
