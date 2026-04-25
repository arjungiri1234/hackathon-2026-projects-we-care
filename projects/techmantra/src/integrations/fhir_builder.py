from datetime import datetime  # For generating timestamps

def build_patient_resource(name, age, sex, height, weight,
                            allergies, conditions,
                            doctor_name, hospital, doctor_email):
    """
    Creates a FHIR R4 Patient resource from signup form data.
    All parameters are strings or numbers from the Streamlit form.
    Returns: dict structured as a valid FHIR Patient resource
    """
    return {
        # resourceType is required in every FHIR resource
        # tells the receiving system what kind of data this is
        "resourceType": "Patient",
        
        # Unique identifier for this patient record
        # We generate it from the name — in production use UUID
        "id": f"patient-{name.lower().replace(' ', '-')}",
        
        # Patient name in FHIR HumanName format
        # "text" is the full display name
        "name": [{"text": name}],
        
        # Gender must be lowercase in FHIR standard
        "gender": sex.lower(),
        
        # Age stored as a simple extension since FHIR uses birthDate
        # In a real system this would be calculated from birthDate
        "age": age,
        
        # Extensions store non-standard fields in FHIR
        # We use them for health metrics and physician details
        "extension": [
            # Physical measurements
            {
                "url": "height",              # Extension identifier
                "value": height,              # Numeric value
                "unit": "cm"                  # Unit of measurement
            },
            {
                "url": "weight",
                "value": weight,
                "unit": "kg"
            },
            # Medical history
            {
                "url": "allergies",
                "value": allergies            # Free text allergy list
            },
            {
                "url": "conditions",
                "value": conditions           # Pre-existing conditions
            },
            # Linked physician information
            {
                "url": "physician",
                "value": {
                    "name": doctor_name,
                    "hospital": hospital,
                    "email": doctor_email     # Used for sending summaries
                }
            }
        ]
    }