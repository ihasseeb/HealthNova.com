import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("GEMINI_API_KEY")

if not API_KEY:
    raise ValueError("❌ GEMINI_API_KEY not found in .env")

genai.configure(api_key=API_KEY)


def get_available_model():
    """
    Automatically find best available Gemini model
    Priority: flash > pro > default
    """
    # Preferred models (priority order)
    preferred_models = [
        "gemini-2.0-flash",
        "gemini-1.5-flash",
        "gemini-1.5-flash-8b",
        "gemini-1.5-pro",
        "gemini-pro",
    ]

    try:
        # Get all available models
        available_models = []
        for m in genai.list_models():
            # Only models that support generateContent
            if "generateContent" in m.supported_generation_methods:
                model_name = m.name.replace("models/", "")
                available_models.append(model_name)

        print(f"\n✅ Available models: {available_models}\n")

        # Find first preferred model that's available
        for preferred in preferred_models:
            if preferred in available_models:
                print(f"🎯 Using model: {preferred}")
                return preferred

        # If no preferred model, use first available
        if available_models:
            print(f"⚠️  Using fallback: {available_models[0]}")
            return available_models[0]

        raise Exception("No models available")

    except Exception as e:
        print(f"❌ Error finding model: {str(e)}")
        # Ultimate fallback
        return "gemini-1.5-flash"


# Auto-select best model on startup
SELECTED_MODEL = get_available_model()
model = genai.GenerativeModel(SELECTED_MODEL)


def generate_response(prompt: str) -> str:
    """Generate AI response using Gemini"""
    try:
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        raise Exception(f"AI generation failed: {str(e)}")


def test_gemini() -> str:
    """Test if Gemini is working"""
    prompt = "Say 'Hello from Gemini AI!' in one line."
    return generate_response(prompt)


def get_current_model() -> str:
    """Return currently used model name"""
    return SELECTED_MODEL