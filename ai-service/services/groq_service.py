from groq import Groq
import os
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("GROQ_API_KEY")

if not API_KEY:
    raise ValueError("❌ GROQ_API_KEY not found in .env")

# Initialize Groq client
client = Groq(api_key=API_KEY)

# Default model (best free tier)
DEFAULT_MODEL = "llama-3.3-70b-versatile"


def generate_response(prompt: str, model: str = DEFAULT_MODEL) -> str:
    """
    Generate AI response using Groq
    """
    try:
        chat_completion = client.chat.completions.create(
            messages=[
                {
                    "role": "user",
                    "content": prompt,
                }
            ],
            model=model,
            temperature=0.7,
            max_tokens=2000,
        )
        return chat_completion.choices[0].message.content
    except Exception as e:
        raise Exception(f"Groq AI generation failed: {str(e)}")


def test_groq() -> str:
    """Test if Groq is working"""
    prompt = "Say 'Hello from Groq AI!' in one line."
    return generate_response(prompt)


def get_current_model() -> str:
    """Return currently used model"""
    return DEFAULT_MODEL


# Available Groq models (for reference)
AVAILABLE_MODELS = {
    "llama-3.3-70b-versatile": "Best quality, most capable",
    "llama-3.1-8b-instant": "Fast, good for simple tasks",
    "llama-3.1-70b-versatile": "High quality, versatile",
    "mixtral-8x7b-32768": "Long context (32k tokens)",
    "gemma2-9b-it": "Google's Gemma model",
}