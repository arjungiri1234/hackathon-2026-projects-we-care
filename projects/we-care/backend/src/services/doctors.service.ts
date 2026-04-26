import { supabase } from "../lib/supabase";
import {
  normalizeLookupValue,
  resolveLookupId,
  resolveLookupName,
} from "./lookup-service";

const ALLOWED_AVATAR_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
]);

const MAX_AVATAR_SIZE_BYTES = 5 * 1024 * 1024;

interface UpdateDoctorProfileInput {
  full_name?: string;
  email?: string;
  specialty?: string;
  license_number?: string;
  hospital?: string;
}

type DoctorRow = {
  id: string;
  full_name: string;
  email: string;
  license_number: string | null;
  avatar_url: string | null;
  created_at: string;
  specialty_id: string | null;
  hospital_id: string | null;
};

async function mapDoctorProfile(row: DoctorRow) {
  const [specialty, hospital] = await Promise.all([
    resolveLookupName("specialties", row.specialty_id),
    resolveLookupName("hospital", row.hospital_id),
  ]);

  return {
    id: row.id,
    full_name: row.full_name,
    email: row.email,
    specialty,
    license_number: row.license_number,
    hospital,
    avatar_url: row.avatar_url,
    created_at: row.created_at,
  };
}

export async function uploadAvatar(
  doctorId: string,
  fileBuffer: Buffer,
  mimeType: string,
) {
  if (!ALLOWED_AVATAR_MIME_TYPES.has(mimeType)) {
    throw new Error("Unsupported avatar type. Allowed: JPEG, PNG, WEBP");
  }

  if (fileBuffer.length > MAX_AVATAR_SIZE_BYTES) {
    throw new Error("Avatar file is too large. Maximum size is 5MB");
  }

  const fileExtension = mimeType.split("/")[1] ?? "jpg";
  const filePath = `avatars/${doctorId}.${fileExtension}`;

  const { error: uploadError } = await supabase.storage
    .from("doctor-profiles")
    .upload(filePath, fileBuffer, {
      contentType: mimeType,
      upsert: true,
    });

  if (uploadError) throw new Error(uploadError.message);

  const { data } = supabase.storage
    .from("doctor-profiles")
    .getPublicUrl(filePath);

  const avatarUrl = `${data.publicUrl}?v=${Date.now()}`;

  const { error: updateError } = await supabase
    .from("doctors")
    .update({ avatar_url: avatarUrl })
    .eq("id", doctorId);

  if (updateError) throw new Error(updateError.message);

  return { avatar_url: avatarUrl };
}

export async function updateDoctorProfile(
  doctorId: string,
  updates: UpdateDoctorProfileInput,
) {
  const nextUpdates: Record<string, string | null> = {};

  if (updates.full_name !== undefined) {
    nextUpdates.full_name = updates.full_name.trim();
  }

  if (updates.email !== undefined) {
    nextUpdates.email = updates.email.trim();
  }

  if (updates.specialty !== undefined) {
    nextUpdates.specialty_id = await resolveLookupId(
      "specialties",
      updates.specialty,
    );
  }

  if (updates.hospital !== undefined) {
    nextUpdates.hospital_id = await resolveLookupId(
      "hospital",
      updates.hospital,
    );
  }

  if (updates.license_number !== undefined) {
    nextUpdates.license_number = normalizeLookupValue(updates.license_number);
  }

  const { data, error } = await supabase
    .from("doctors")
    .update(nextUpdates)
    .eq("id", doctorId)
    .select(
      "id, full_name, email, specialty_id, license_number, avatar_url, hospital_id, created_at",
    )
    .single();

  if (error) throw new Error(error.message);
  return await mapDoctorProfile(data as DoctorRow);
}

export async function getDoctorProfile(doctorId: string) {
  const { data, error } = await supabase
    .from("doctors")
    .select(
      "id, full_name, email, specialty_id, license_number, avatar_url, hospital_id, created_at",
    )
    .eq("id", doctorId)
    .single();

  if (error) throw new Error(error.message);
  return await mapDoctorProfile(data as DoctorRow);
}
