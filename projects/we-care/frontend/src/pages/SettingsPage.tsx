import { ChevronDown } from "lucide-react";
import { type ChangeEvent, useEffect, useRef, useState } from "react";
import { Button } from "../components/ui/Button";
import {
  getApiErrorMessage,
  updateDoctorProfile,
  uploadDoctorAvatar,
} from "../lib/auth-api";
import { useAuthStore } from "../stores/authStore";
import { useProfileStore } from "../stores/profileStore";

const SPECIALTIES = [
  "Cardiology",
  "Dermatology",
  "Gastroenterology",
  "Neurology",
  "Oncology",
  "Orthopedics",
  "Pediatrics",
  "Psychiatry",
  "Radiology",
  "Urology",
];

interface ProfileForm {
  fullName: string;
  email: string;
  licenseNumber: string;
  specialty: string;
  hospital: string;
}

export default function SettingsPage() {
  const {
    fullName: storedName,
    email: storedEmail,
    specialty: storedSpecialty,
    licenseNumber: storedLicenseNumber,
    hospital: storedHospital,
    avatarUrl: storedAvatar,
    setProfile,
  } = useProfileStore();
  const doctor = useAuthStore((s) => s.doctor);
  const setDoctor = useAuthStore((s) => s.setDoctor);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(storedAvatar);
  const [form, setForm] = useState<ProfileForm>({
    fullName: storedName,
    email: storedEmail,
    licenseNumber: storedLicenseNumber,
    specialty: storedSpecialty,
    hospital: storedHospital,
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setAvatarUrl(storedAvatar);
    setForm({
      fullName: storedName,
      email: storedEmail,
      licenseNumber: storedLicenseNumber,
      specialty: storedSpecialty,
      hospital: storedHospital,
    });
  }, [
    storedAvatar,
    storedEmail,
    storedHospital,
    storedLicenseNumber,
    storedName,
    storedSpecialty,
  ]);

  function update(field: keyof ProfileForm, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setSaveError(null);
    setSaveSuccess(null);
  }

  async function handleImageChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }

    setSaveError(null);
    setSaveSuccess(null);
    setIsUploadingImage(true);

    try {
      const result = await uploadDoctorAvatar(file);
      setAvatarUrl(result.avatar_url);
      setProfile({ avatarUrl: result.avatar_url });
      if (doctor) {
        setDoctor({ ...doctor, avatar_url: result.avatar_url });
      }
      setSaveSuccess("Profile image updated successfully.");
    } catch (error) {
      setSaveError(
        getApiErrorMessage(
          error,
          "Unable to upload profile image. Please try again.",
        ),
      );
    } finally {
      setIsUploadingImage(false);
      e.target.value = "";
    }
  }

  async function handleSave() {
    setSaveError(null);
    setSaveSuccess(null);
    setIsSaving(true);

    try {
      const updatedDoctor = await updateDoctorProfile({
        full_name: form.fullName.trim(),
        email: form.email.trim(),
        license_number: form.licenseNumber.trim(),
        specialty: form.specialty.trim(),
        hospital: form.hospital.trim(),
      });

      setDoctor(updatedDoctor);
      setProfile({
        fullName: updatedDoctor.full_name,
        email: updatedDoctor.email,
        specialty: updatedDoctor.specialty ?? "",
        licenseNumber: updatedDoctor.license_number ?? "",
        hospital: updatedDoctor.hospital ?? "",
        avatarUrl: updatedDoctor.avatar_url ?? avatarUrl,
      });
      setSaveSuccess("Profile details updated successfully.");
    } catch (error) {
      setSaveError(
        getApiErrorMessage(error, "Unable to save profile. Please try again."),
      );
    } finally {
      setIsSaving(false);
    }
  }

  const inputCls =
    "w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-sm text-primary placeholder:text-placeholder focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-1";
  const selectCls = `${inputCls} cursor-pointer appearance-none pr-9`;

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-primary">Profile</h2>
        <p className="text-sm text-muted mt-1">
          Manage your professional profile.
        </p>
      </div>

      <div className="rounded-xl border border-border bg-surface shadow-sm">
        <div className="flex items-start gap-5 border-b border-border p-6">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-accent hover:opacity-90 transition-opacity overflow-hidden"
          >
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt="Profile"
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-2xl font-semibold text-white">
                {form.fullName?.[0] ?? "U"}
              </span>
            )}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
          />
          <div>
            <p className="text-md font-semibold text-primary">
              Profile Picture
            </p>
            <p className="text-sm text-muted mt-0.5">
              Upload a professional headshot for your clinician profile.
            </p>
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploadingImage}
              className="mt-2 text-sm font-medium text-accent hover:underline"
            >
              {isUploadingImage ? "Uploading..." : "Choose Image"}
            </button>
          </div>
        </div>

        <div className="p-6 space-y-5">
          {saveError ? (
            <p className="text-sm text-red-500">{saveError}</p>
          ) : null}
          {saveSuccess ? (
            <p className="text-sm text-emerald-600">{saveSuccess}</p>
          ) : null}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-primary mb-1.5">
                Full Name
              </label>
              <input
                className={inputCls}
                value={form.fullName}
                onChange={(e) => update("fullName", e.target.value)}
                placeholder="Dr. Full Name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-primary mb-1.5">
                Email
              </label>
              <input
                className={inputCls}
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                placeholder="doctor@hospital.org"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-primary mb-1.5">
                Medical License Number
              </label>
              <input
                className={inputCls}
                value={form.licenseNumber}
                onChange={(e) => update("licenseNumber", e.target.value)}
                placeholder="Enter license number"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-primary mb-1.5">
                Specialty
              </label>
              <div className="relative">
                <select
                  className={selectCls}
                  value={form.specialty}
                  onChange={(e) => update("specialty", e.target.value)}
                >
                  <option value="">Select a specialty...</option>
                  {SPECIALTIES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={15}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-primary mb-1.5">
                Hospital / Clinic Name
              </label>
              <input
                className={inputCls}
                value={form.hospital}
                onChange={(e) => update("hospital", e.target.value)}
                placeholder="Primary affiliation"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end border-t border-border px-6 py-4">
          <Button onClick={handleSave} loading={isSaving}>
            Save Profile
          </Button>
        </div>
      </div>
    </div>
  );
}
