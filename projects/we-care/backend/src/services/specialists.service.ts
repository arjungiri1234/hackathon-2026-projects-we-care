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
    .select(
      "id, full_name, contact_number, specialties(name), hospitals(name)",
    )
    .order("full_name");

  if (error) throw new Error(error.message);

  const filteredSpecialists = data
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

  const total = filteredSpecialists.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const startIndex = (page - 1) * pageSize;

  return {
    items: filteredSpecialists.slice(startIndex, startIndex + pageSize),
    page,
    pageSize,
    total,
    totalPages,
  };
}
