from groq import Groq
import os
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("GROQ_API_KEY")

if not API_KEY:
    raise ValueError("❌ GROQ_API_KEY not found in .env")

API_KEY = API_KEY.strip('"\'')

client = Groq(api_key=API_KEY)

# Currently active Groq models (removed decommissioned models)
GROQ_MODELS = [
    "llama-3.3-70b-versatile",
    "llama-3.1-8b-instant",
    "gemma2-9b-it",
]

DEFAULT_MODEL = GROQ_MODELS[0]


def generate_response(prompt: str, model: str = None) -> str:
    """
    Generate AI response using Groq with automatic model fallback
    """
    models_to_try = [model] if model else GROQ_MODELS
    last_error = None

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
            print(f"⚠️ Groq model {target_model} failed: {str(e)}")
            last_error = e
            continue

    raise Exception(f"Groq AI generation failed. Last error: {str(last_error)}")


def test_groq() -> str:
    """Test if Groq is working"""
    prompt = "Say 'Hello from Groq AI!' in one line."
    return generate_response(prompt)


def get_current_model() -> str:
    """Return currently active primary model"""
    return DEFAULT_MODEL