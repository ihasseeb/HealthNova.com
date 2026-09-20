import os
from dotenv import load_dotenv
from groq import Groq
import tempfile
from werkzeug.datastructures import FileStorage

load_dotenv()

# Get API key from environment
API_KEY = os.getenv("GROQ_API_KEY")

if not API_KEY:
    raise ValueError("❌ GROQ_API_KEY environment variable mein nahi mila! Railway settings check karein.")

API_KEY = API_KEY.strip().strip("\"'")

client = Groq(api_key=API_KEY)


def get_available_models():
    """Dynamically fetch available models from your Groq account"""
    try:
        models_data = client.models.list()
        active_models = [m.id for m in models_data.data if m.active]
        print(f"✅ Active models on your Groq account: {active_models}")
        return active_models
    except Exception as e:
        print(f"⚠️ Could not fetch models list dynamically: {e}")
        # Fallback list agar API list fetch fail ho
        return [
            "llama-3.3-70b-versatile",
            "llama-3.1-8b-instant",
            "llama3-70b-8192",
            "llama3-8b-8192",
            "mixtral-8x7b-32768",
        ]


def generate_response(prompt: str, model: str = None) -> str:
    """
    Generate AI response with dynamic model fallback
    """
    if model:
        models_to_try = [model]
    else:
        available_models = get_available_models()
        # Chat models ko filter karein (whisper audio models ko nikaal kar)
        chat_models = [
            m for m in available_models 
            if not m.startswith("whisper") and "guard" not in m
        ]
        models_to_try = chat_models if chat_models else ["llama-3.1-8b-instant"]

    errors = []

    for target_model in models_to_try:
        try:
            chat_completion = client.chat.completions.create(
                messages=[
                    {
                        "role": "user",
                        "content": prompt,
                    }
                ],
                model=target_model,
                temperature=0.7,
                max_tokens=2000,
            )
            return chat_completion.choices[0].message.content
        except Exception as e:
            error_msg = f"Model {target_model} failed: {str(e)}"
            print(f"⚠️ {error_msg}")
            errors.append(error_msg)
            continue

    raise Exception(f"Groq AI generation failed. Details: {' | '.join(errors)}")


def test_groq() -> str:
    """Test if Groq is working"""
    prompt = "Say 'Hello from Groq AI!' in one line."
    return generate_response(prompt)


def get_current_model() -> str:
    models = get_available_models()
    return models[0] if models else "llama-3.1-8b-instant"



def transcribe_audio(audio_file) -> str:
    """
    Convert Audio to Text using Groq's Whisper model (Direct Bytes Input)
    """
    try:
        # Read file bytes directly from Flask's FileStorage
        file_bytes = audio_file.read()
        filename = audio_file.filename or "audio.webm"
        
        # Models to try (fallback strategy)
        whisper_models = ["whisper-large-v3-turbo", "whisper-large-v3"]
        last_error = None
        
        for model in whisper_models:
            try:
                transcription = client.audio.transcriptions.create(
                    file=(filename, file_bytes),
                    model=model,
                    response_format="verbose_json"
                )
                
                # Extract text attribute
                text_result = getattr(transcription, 'text', str(transcription))
                print(f"✅ Transcribed using {model}: {text_result}")
                return text_result
            except Exception as e:
                print(f"⚠️ Whisper model {model} failed: {str(e)}")
                last_error = e
                continue
                
        raise Exception(f"All Whisper models failed. Error: {str(last_error)}")
    except Exception as e:
        print(f"❌ Transcription error: {str(e)}")
        raise Exception(f"Audio transcription failed: {str(e)}")


def structure_prescription_from_text(text: str) -> dict:
    """
    Convert unstructured doctor speech transcript into a JSON prescription
    """
    prompt = f"""You are a medical AI assistant. A doctor has dictated their prescription via voice.
Convert the following speech transcript into a structured JSON prescription.

DOCTOR'S SPEECH TRANSCRIPT:
"{text}"

Provide the response in EXACTLY this JSON format (only valid JSON, no markdown, no extra text):
{{
  "diagnosis": "Main diagnosis or health condition mentioned",
  "notes": "Doctor's advice, dietary restrictions, or observations",
  "medicines": [
    {{
      "medicineName": "Name of drug",
      "dosage": "e.g. 500mg",
      "frequency": "e.g. Twice daily",
      "duration": "e.g. 5 days",
      "instructions": "e.g. After meals"
    }}
  ]
}}

If specific fields are missing in the speech, make logical medical assumptions (e.g. default duration '5 days').
"""
    try:
        response_text = generate_response(prompt)
        
        cleaned = response_text.strip()
        if cleaned.startswith("```json"):
            cleaned = cleaned[7:]
        if cleaned.startswith("```"):
            cleaned = cleaned[3:]
        if cleaned.endswith("```"):
            cleaned = cleaned[:-3]
        
        import json
        return json.loads(cleaned.strip())
    except Exception as e:
        print(f"❌ Structuring error: {str(e)}")
        raise Exception(f"Prescription structuring failed: {str(e)}")