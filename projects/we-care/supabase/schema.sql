-- ============================================================
-- RefAI Schema
-- Team: We Care
-- ============================================================

-- Doctors (linked to Supabase Auth)
CREATE TABLE doctors (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Specialists (pre-seeded, not users)
CREATE TABLE specialists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  specialty TEXT NOT NULL,
  hospital TEXT NOT NULL,
  available BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Patients (created when referral is submitted)
CREATE TABLE patients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  date_of_birth DATE,
  gender TEXT,
  medical_history TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Referrals (core table)
CREATE TABLE referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  doctor_id UUID NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  specialist_id UUID NOT NULL REFERENCES specialists(id) ON DELETE CASCADE,
  notes TEXT NOT NULL,
  extracted_data JSONB,
  urgency TEXT CHECK (urgency IN ('low', 'medium', 'high')) DEFAULT 'low',
  status TEXT CHECK (status IN ('pending', 'sent', 'accepted', 'completed')) DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-update updated_at on referral changes
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER referrals_updated_at
  BEFORE UPDATE ON referrals
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
