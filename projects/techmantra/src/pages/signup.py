import streamlit as st
import pandas as pd

from app.session_state import init_session
from db.db import (
    get_patient,
    get_patient_by_email,
    get_patient_as_fhir,
    get_patient_full_context,
    save_allergy,
    save_known_condition,
    save_patient,
    save_physician,
)


AUTH_MODE_KEY = "auth_mode_choice"
CURRENT_PAGE_KEY = "current_page"
LOGIN_OPTION = "Login (Returning Patient)"
SIGNUP_OPTION = "Signup (New Patient)"


def _extract_display_name(profile: dict) -> str:
    raw_name = profile.get("name", "Patient")
    if isinstance(raw_name, list) and raw_name:
        return raw_name[0].get("text", "Patient")
    return raw_name if isinstance(raw_name, str) else "Patient"


def _load_fhir_patient_profile(patient_id: str) -> dict:
    fhir_bundle = get_patient_as_fhir(patient_id)
    entries = fhir_bundle.get("entry", [])
    for entry in entries:
        resource = entry.get("resource", {})
        if resource.get("resourceType") == "Patient":
            return resource
    return {}


def _render_patient_dashboard():
    patient_id = st.session_state.get("patient_id")
    if not patient_id:
        st.warning("No patient profile found in session.")
        return

    ctx = get_patient_full_context(patient_id)
    patient = ctx.get("patient", {})
    allergies = ctx.get("allergies", [])
    conditions = ctx.get("known_conditions", [])
    physician = ctx.get("physician", {})

    display_name = patient.get("name") or _extract_display_name(st.session_state.get("user_profile", {}))
    st.title(f"👋 Welcome, {display_name}!")
    st.caption(f"Patient ID: `{patient_id}`")
    st.subheader("Patient Dashboard")

    col1, col2 = st.columns(2)
    with col1:
        st.write(f"**Email:** {patient.get('email', 'NA')}")
        st.write(f"**Age:** {patient.get('age', 'NA')}")
        st.write(f"**Sex:** {patient.get('sex', 'NA')}")
        st.write(f"**Location:** {patient.get('place', 'NA')}")
    with col2:
        st.write(f"**Height (cm):** {patient.get('height_cm', 'NA')}")
        st.write(f"**Weight (kg):** {patient.get('weight_kg', 'NA')}")

    allergies_text = ", ".join([a.get("allergen", "") for a in allergies]) or "None"
    conditions_text = ", ".join([c.get("condition_name", "") for c in conditions]) or "None"
    st.write(f"**Allergies:** {allergies_text}")
    st.write(f"**Known Conditions:** {conditions_text}")

    st.subheader("Primary Physician")
    st.write(f"**Doctor Name:** {physician.get('doctor_name', 'Not Provided')}")
    st.write(f"**Hospital/Clinic:** {physician.get('hospital_name', 'Not Provided')}")
    st.write(f"**Email:** {physician.get('email', 'Not Provided')}")

    with st.expander("View FHIR Patient Data (Table)", expanded=True):
        fhir_patient = st.session_state.get("user_profile", {})
        patient_id = st.session_state.get("patient_id")
        
        # Extract fields for the unified view
        names = fhir_patient.get("name", [])
        telecom = fhir_patient.get("telecom", [])
        address = fhir_patient.get("address", [])

        # 1. Prepare the Data
        summary_rows = [
            {"Field": "Resource Type", "Value": fhir_patient.get("resourceType", "Patient")},
            {"Field": "FHIR ID", "Value": fhir_patient.get("id", patient_id)},
            {"Field": "Name", "Value": names[0].get("text", "NA") if names else "NA"},
            {"Field": "Gender", "Value": fhir_patient.get("gender", "NA")},
            {"Field": "Birth Date", "Value": fhir_patient.get("birthDate", "NA")},
            {"Field": "Email", "Value": telecom[0].get("value", "NA") if telecom else "NA"},
            {"Field": "Address", "Value": address[0].get("text", "NA") if address else "NA"},
        ]

        # 2. THE UI CHANGE: Use st.dataframe instead of st.table
        st.markdown("#### 📄 Patient Resource Summary")
        st.dataframe(
            pd.DataFrame(summary_rows),
            use_container_width=True,
            hide_index=True, # This removes the 0, 1, 2, 3 column
            column_config={
                "Field": st.column_config.TextColumn("Clinical Field", width="medium"),
                "Value": st.column_config.TextColumn("Data Value", width="large")
            }
        )

        st.markdown("**FHIR Allergies**")
        allergy_rows = [
            {
                "Allergen": item.get("allergen", "NA"),
                "Severity": item.get("severity", "unknown"),
            }
            for item in allergies
        ]
        st.table(pd.DataFrame(allergy_rows if allergy_rows else [{"Allergen": "None", "Severity": "NA"}]))

        st.markdown("**FHIR Conditions**")
        condition_rows = [
            {
                "Condition": item.get("condition_name", "NA"),
                "ICD-10": item.get("icd10_code", ""),
            }
            for item in conditions
        ]
        st.table(pd.DataFrame(condition_rows if condition_rows else [{"Condition": "None", "ICD-10": ""}]))

        st.markdown("**FHIR Physician Link**")
        physician_rows = [{
            "Doctor Name": physician.get("doctor_name", "Not Provided"),
            "Hospital/Clinic": physician.get("hospital_name", "Not Provided"),
            "Email": physician.get("email", "Not Provided"),
        }]
        st.table(pd.DataFrame(physician_rows))

    col_a, col_b = st.columns(2)
    with col_a:
        if st.button("Go to Symptom Checker", type="primary", use_container_width=True):
            st.session_state[CURRENT_PAGE_KEY] = "Symptom Checker"
            st.rerun()
    with col_b:
        if st.button("Logout and Switch Account", use_container_width=True):
            _set_logged_out_state()
            st.rerun()


def _set_logged_out_state():
    st.session_state.is_authenticated = False
    st.session_state.user_profile = {}
    st.session_state.patient_id = None
    st.session_state[AUTH_MODE_KEY] = LOGIN_OPTION
    st.session_state[CURRENT_PAGE_KEY] = "Dashboard"
    st.session_state["live_transcription"] = ""
    st.session_state["symptom_input_mode"] = "Type my symptoms"
    st.session_state.pop("symptom_live_mic_output", None)
    st.session_state.pop("symptom_live_mic", None)
    st.session_state.pop("biomistral_mic_output", None)
    st.session_state.pop("biomistral_mic", None)
    st.session_state.pop("transcribed_symptoms_editor", None)


def _render_login_tab():
    st.subheader("Login")
    st.caption("Use your patient email to login.")
    login_email = st.text_input("Patient Email", placeholder="you@example.com")

    if st.button("Login", type="primary", use_container_width=True):
        clean_login_email = login_email.strip().lower()
        if not clean_login_email:
            st.warning("Please enter your patient email.")
            return

        patient_data = get_patient_by_email(clean_login_email)
        if not patient_data:
            st.error("Email not found. Please check and try again.")
            return

        patient_id = patient_data["id"]
        fhir_profile = _load_fhir_patient_profile(patient_id)
        st.session_state.is_authenticated = True
        st.session_state.patient_id = patient_id
        st.session_state.user_profile = fhir_profile or dict(patient_data)
        st.session_state[CURRENT_PAGE_KEY] = "Dashboard"
        st.success(f"Welcome back, {patient_data['name']}!")
        st.rerun()


def _render_signup_tab():
    st.subheader("Signup")
    st.caption("Create a new patient profile.")
    with st.form("signup_form_main"):
        patient_email = st.text_input("Patient Email")
        name = st.text_input("Full Name")
        age = st.number_input("Age", 1, 120, 25)
        sex = st.selectbox("Sex", ["Male", "Female", "Other"])
        place = st.text_input("Location/City")

        col1, col2 = st.columns(2)
        with col1:
            height_cm = st.number_input("Height (cm)", min_value=50.0, max_value=250.0, value=170.0, step=0.5)
        with col2:
            weight_kg = st.number_input("Weight (kg)", min_value=20.0, max_value=300.0, value=70.0, step=0.5)

        st.divider()
        allergies_text = st.text_input("Allergies (comma separated)")
        conditions_text = st.text_input("Known Conditions (comma separated)")

        st.divider()
        doctor_name = st.text_input("Primary Doctor Name")
        hospital_name = st.text_input("Hospital/Clinic")
        dr_email = st.text_input("Doctor's Email")

        submitted = st.form_submit_button("Create Profile", type="primary", use_container_width=True)
        if not submitted:
            return

        clean_email = patient_email.strip().lower()
        if not clean_email or not name.strip() or not place.strip():
            st.error("Patient Email, Full Name, and Location/City are required.")
            return

        if get_patient_by_email(clean_email):
            st.error("This email is already registered. Please login instead.")
            return

        pid = save_patient(clean_email, name.strip(), int(age), sex, float(height_cm), float(weight_kg), place.strip())

        for allergen in [a.strip() for a in allergies_text.split(",") if a.strip()]:
            save_allergy(pid, allergen)

        for condition in [c.strip() for c in conditions_text.split(",") if c.strip()]:
            save_known_condition(pid, condition)

        if doctor_name.strip() or hospital_name.strip() or dr_email.strip():
            save_physician(
                pid,
                doctor_name.strip() or "Not Provided",
                hospital_name.strip(),
                dr_email.strip(),
            )

        fhir_profile = _load_fhir_patient_profile(pid)
        st.session_state.is_authenticated = True
        st.session_state.patient_id = pid
        st.session_state.user_profile = fhir_profile or {"name": name.strip(), "id": pid}
        st.session_state[CURRENT_PAGE_KEY] = "Dashboard"
        st.success("Signup successful!")
        st.info(f"Registered email: {clean_email}")
        st.caption(f"Internal Patient ID: `{pid}`")
        st.rerun()


def show():
    init_session()

    if st.session_state.get("is_authenticated"):
        _render_patient_dashboard()
        return

    st.title("CareDevi Patient Portal")
    st.write("Login to your account or signup as a new patient.")

    if AUTH_MODE_KEY not in st.session_state:
        st.session_state[AUTH_MODE_KEY] = LOGIN_OPTION

    auth_mode = st.radio(
        "Choose one:",
        [LOGIN_OPTION, SIGNUP_OPTION],
        key=AUTH_MODE_KEY,
        horizontal=True,
    )
    st.divider()

    if auth_mode == LOGIN_OPTION:
        _render_login_tab()
    else:
        _render_signup_tab()