import streamlit as st
import os
import sys

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.session_state import init_session
from pages import signup, symptoms
from db.db import init_db

AUTH_MODE_KEY = "auth_mode_choice"
CURRENT_PAGE_KEY = "current_page"
LOGIN_OPTION = "Login (Returning Patient)"

# 1. Initialize everything
init_session()
init_db()

# 2. THE GATEKEEPER LOGIC
# If the user is NOT logged in, we ONLY show the Portal (signup.show)
if not st.session_state.get("is_authenticated"):
    # This renders your signup.py which MUST have the Login/Signup choice
    signup.show() 
    
else:
    st.sidebar.title("CareDevi")
    
    # Get the name correctly for the sidebar
    user_profile = st.session_state.get("user_profile", {})
    user_name = user_profile.get("name", "User")
    
    # If the profile is FHIR format, name might be a list, handle that:
    if isinstance(user_name, list):
        user_name = user_name[0].get("text", "User")
    
    st.sidebar.success(f"✅ Patient: {user_name}")
    
    pages = ["Dashboard", "Symptom Checker", "Logout"]
    default_page = st.session_state.get(CURRENT_PAGE_KEY, "Dashboard")
    default_index = pages.index(default_page) if default_page in pages else 0
    nav = st.sidebar.radio("Navigation Menu", pages, index=default_index)
    
    if nav == "Dashboard":
        st.session_state[CURRENT_PAGE_KEY] = "Dashboard"
        signup.show()
    elif nav == "Symptom Checker":
        st.session_state[CURRENT_PAGE_KEY] = "Symptom Checker"
        symptoms.show()
        
    elif nav == "Logout":
        st.session_state.is_authenticated = False
        st.session_state.user_profile = {}
        st.session_state.patient_id = None
        st.session_state[AUTH_MODE_KEY] = LOGIN_OPTION
        st.session_state[CURRENT_PAGE_KEY] = "Dashboard"
        st.session_state.transcript = ""
        st.session_state.current_symptoms = ""
        st.session_state.symptoms = ""
        st.session_state.live_transcription = ""
        st.session_state.symptom_input_mode = "Type my symptoms"
        st.session_state.ner_results = {}
        st.session_state.diagnosis = {}
        st.session_state.risk_tier = None
        st.session_state.rag_sources = []
        st.session_state.pop("symptom_live_mic_output", None)
        st.session_state.pop("symptom_live_mic", None)
        st.session_state.pop("biomistral_mic_output", None)
        st.session_state.pop("biomistral_mic", None)
        st.session_state.pop("transcribed_symptoms_editor", None)
        st.rerun()