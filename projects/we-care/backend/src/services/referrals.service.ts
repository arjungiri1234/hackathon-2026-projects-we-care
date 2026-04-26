import { supabase } from "../lib/supabase";
import { randomUUID } from 'crypto';
import { sendPatientPortalEmail } from './email.service';
import { extractLookupName } from "./lookup-service";

interface ReferralsQueryOptions {
  page: number;
  pageSize: number;
}

interface DoctorDirectoryRow {
  id: string;
  full_name: string;
  contact_number: string | null;
  specialties: { name: string } | Array<{ name: string }> | null;
  hospitals: { name: string } | Array<{ name: string }> | null;
}

async function getDoctorsByIds(doctorIds: string[]) {
  if (!doctorIds.length) return new Map<string, {
    id: string;
    full_name: string;
    contact_number: string | null;
    specialty: string;
    hospital: string;
  }>();

  const { data, error } = await supabase
    .from("doctors")
    .select("id, full_name, contact_number, specialties(name), hospitals(name)")
    .in("id", doctorIds);

  if (error) throw new Error(error.message);

  return new Map(
    ((data ?? []) as DoctorDirectoryRow[]).map((doctor) => [
      doctor.id,
      {
        id: doctor.id,
        full_name: doctor.full_name,
        contact_number: doctor.contact_number,
        specialty: extractLookupName(doctor.specialties) ?? "",
        hospital: extractLookupName(doctor.hospitals) ?? "",
      },
    ]),
  );
}

export async function createPatientAndReferral(
  doctorId: string,
  patientData: {
    full_name: string;
    date_of_birth?: string;
    gender?: string;
    email?: string;
    phone?: string;
    medical_history?: string;
  },
  referralData: {
    doctor_id: string;
    clinical_notes: string;
    extracted_data?: object;
    diagnosis?: string;
    required_specialty?: string;
    urgency: "low" | "medium" | "high";
  },
) {
  const { data: patient, error: patientError } = await supabase
    .from("patients")
    .insert(patientData)
    .select()
    .single();

  if (patientError) throw new Error(patientError.message);

  const { data: referral, error: referralError } = await supabase
    .from("referrals")
    .insert({
      doctor_id: referralData.doctor_id,
      referred_by: doctorId,
      patient_id: patient.id,
      clinical_notes: referralData.clinical_notes,
      extracted_data: referralData.extracted_data,
      diagnosis: referralData.diagnosis,
      required_specialty: referralData.required_specialty,
      urgency: referralData.urgency,
    })
    .select()
    .single();

  if (referralError) throw new Error(referralError.message);

  return { patient, referral };
}

export async function getReferralsByDoctor(
  doctorId: string,
  { page, pageSize }: ReferralsQueryOptions,
) {
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data, error, count } = await supabase
    .from("referrals")
    .select(
      `
      id, clinical_notes, diagnosis, urgency, status, created_at, doctor_id,
      patients (id, full_name)
    `,
      { count: "exact" },
    )
    .eq("doctor_id", doctorId)
    .range(from, to)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  const doctorMap = await getDoctorsByIds(
    [...new Set((data ?? []).map((referral) => referral.doctor_id).filter(Boolean))] as string[],
  );
  const mappedReferrals = data.map((referral) => {
    const targetDoctor = doctorMap.get(referral.doctor_id);

    return {
      ...referral,
      targetDoctor,
    };
  });

  const total = count ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return {
    items: mappedReferrals,
    page,
    pageSize,
    total,
    totalPages,
  };
}

export async function getReferralById(referralId: string, doctorId: string) {
  const { data, error } = await supabase
    .from("referrals")
    .select(
      `
      *,
      patients (*),
      referral_status_history (status, changed_at)
    `,
    )
    .eq("id", referralId)
    .eq("doctor_id", doctorId)
    .single();

  if (error) throw new Error(error.message);
  const doctorMap = await getDoctorsByIds([data.doctor_id]);
  const targetDoctor = doctorMap.get(data.doctor_id) ?? null;

  return {
    ...data,
    targetDoctor,
  };
}

export async function updateReferralStatus(
  referralId: string,
  doctorId: string,
  status: "pending" | "sent" | "accepted" | "completed",
) {
  const { data, error } = await supabase
    .from("referrals")
    .update({ status })
    .eq("id", referralId)
    .eq("doctor_id", doctorId)
    .select()
    .single();

  if (error) throw new Error(error.message);

  if (status === 'sent') {
    const { data: referral } = await supabase
      .from('referrals')
      .select('patients (full_name, email)')
      .eq('id', referralId)
      .single();

    const patientsRaw = referral?.patients as unknown as { full_name: string; email?: string } | { full_name: string; email?: string }[] | null;
    const patient = Array.isArray(patientsRaw) ? patientsRaw[0] : patientsRaw;

    const token = randomUUID();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await supabase.from('patient_tokens').insert({
      token,
      referral_id: referralId,
      expires_at: expiresAt.toISOString(),
    });

    if (patient?.email) {
      const frontendUrl = process.env.FRONTEND_URL ?? 'http://localhost:5173';
      await sendPatientPortalEmail(patient.email, patient.full_name, `${frontendUrl}/p/${token}`);
    }

    return { ...data, patient_token: token };
  }

  return data;
}
