import os
from dotenv import load_dotenv
from groq import Groq

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