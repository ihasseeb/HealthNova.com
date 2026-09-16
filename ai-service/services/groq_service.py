import os
from dotenv import load_dotenv
from groq import Groq

load_dotenv()

API_KEY = os.getenv("GROQ_API_KEY")

if not API_KEY:
    raise ValueError("❌ GROQ_API_KEY not found in environment variables")

API_KEY = API_KEY.strip("\"'")

client = Groq(api_key=API_KEY)

# Sirf 100% Active aur Official Production Models
GROQ_MODELS = [
    "llama-3.3-70b-versatile",
    "llama-3.1-8b-instant",
]

DEFAULT_MODEL = GROQ_MODELS[0]


def generate_response(prompt: str, model: str = None) -> str:
    """
    Generate AI response using Groq with automatic model fallback
    """
    # Agar user ne aisa model pass kiya jo list mein nahi ya decommissioned ho gaya hai
    if model and model not in GROQ_MODELS:
        models_to_try = [model] + GROQ_MODELS
    elif model:
        models_to_try = [model]
    else:
        models_to_try = GROQ_MODELS

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

    # Agar saare models fail ho jayein toh details show karein
    raise Exception(f"Groq AI generation failed. Details: {' | '.join(errors)}")


def test_groq() -> str:
    """Test if Groq is working"""
    prompt = "Say 'Hello from Groq AI!' in one line."
    return generate_response(prompt)


def get_current_model() -> str:
    """Return currently active primary model"""
    return DEFAULT_MODEL