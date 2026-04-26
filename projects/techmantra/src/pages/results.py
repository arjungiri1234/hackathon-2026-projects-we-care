import streamlit as st
import json
import pandas as pd
from db.db import save_diagnostic_report, get_recent_sessions

def show():
    patient_id = st.session_state.get('patient_id')

    # --- FIX: AUTO-LOAD PREVIOUS RECORD IF STATE IS EMPTY ---
    if not st.session_state.get('diagnosis'):
        if patient_id:
            recent = get_recent_sessions(patient_id, limit=1)
            if recent:
                # Silently load the latest record into the session state
                entry = recent[0]
                st.session_state.diagnosis = json.loads(entry['diagnosis'])
                st.session_state.session_id = entry['id']
                st.session_state.severity = entry['risk_tier']
                st.session_state.current_symptoms = entry['symptoms']
            else:
                st.warning("Please run the symptom checker first.")
                if st.button("Go Back"):
                    st.session_state.current_page = "Symptoms"
                    st.rerun()
                return
        else:
            st.error("Please log in to view results.")
            return

    # 1. Get diagnosis data (either fresh from AI or auto-loaded from DB)
    diag = st.session_state.diagnosis
    risk = diag.get('risk_tier', 'LOW').upper()
    session_id = st.session_state.get('session_id')

    # 2. Display Urgent Banner
    if risk == "HIGH":
        st.error("🚨 **EMERGENCY: Please seek immediate medical attention.**")
    elif risk == "MEDIUM":
        st.warning("⚠️ **MEDIUM: Follow-up with a healthcare provider soon.**")
    else:
        st.success("✅ **LOW RISK: Manage symptoms at home and monitor.**")

    st.title("📋 Diagnostic Report")

    # --- STEP 4: FHIR HANDSHAKE ---
    # This converts our AI output into a standard medical record
    if patient_id and session_id:
        with st.spinner("Generating FHIR R4 Record..."):
            # Only one call needed here
            fhir_data = save_diagnostic_report(patient_id, session_id, diag)
            
        with st.expander("📂 View FHIR R4 JSON (Interoperability)", expanded=False):
            st.json(fhir_data)

    # 3. Display AI Analysis
    st.subheader("Summary")
    st.write(diag.get('summary', 'Analysis provided by MedGemma.'))

    col1, col2 = st.columns(2)
    with col1:
        st.markdown("### 🧬 Potential Conditions")
        # Added safety get() to prevent crashes if top_conditions is missing
        for cond in diag.get('top_conditions', []):
            st.markdown(f"- **{cond['name']}** ({int(cond['probability']*100)}%)")
            
    with col2:
        st.markdown("### 💊 Recommended Remedies")
        for rem in diag.get('remedies', []):
            st.markdown(f"- {rem}")

    # --- RECENT MEDICAL HISTORY SECTION ---
    st.divider()
    st.subheader("📜 Your Recent Medical History")
    
    if patient_id:
        recent_data = get_recent_sessions(patient_id, limit=3) 
        if recent_data:
            for i, entry in enumerate(recent_data):
                try:
                    past_diag = json.loads(entry['diagnosis'])
                    date_val = entry['created_at'][:10]
                    
                    with st.expander(f"Visit Date: {date_val} | Risk: {entry['risk_tier']}"):
                        st.write(f"**Symptoms:** {entry['symptoms']}")
                        st.info(f"**Main Condition:** {past_diag.get('top_conditions', [{}])[0].get('name', 'N/A')}")
                        
                        # Unique key per button using the index 'i'
                        if st.button(f"Reload This Report", key=f"reload_res_{i}"):
                            st.session_state.diagnosis = past_diag
                            st.session_state.session_id = entry['id']
                            st.rerun()
                except Exception: 
                    continue
        else:
            st.info("No previous reports found.")

    st.divider()
    if st.button("🏠 Return to Dashboard"):
        # Reset current diagnosis so user can start fresh from dashboard if they want
        st.session_state.diagnosis = None 
        st.session_state.current_page = "Symptoms"
        st.rerun()