import os
from dotenv import load_dotenv
from groq import Groq

load_dotenv()

API_KEY = os.getenv("GROQ_API_KEY")

if not API_KEY:
    raise ValueError("❌ GROQ_API_KEY environment variable mein nahi mila!")

API_KEY = API_KEY.strip().strip("\"'")

client = Groq(api_key=API_KEY)

# Fastest & Most Stable Models on Groq
GROQ_MODELS = [
    "llama-3.1-8b-instant",  # Super fast (milliseconds mein response)
    "mixtral-8x7b-32768",    # Reliable backup
]

DEFAULT_MODEL = GROQ_MODELS[0]


def generate_response(prompt: str, model: str = None) -> str:
    """
    Direct and fast AI response generation
    """
    target_model = model if model else DEFAULT_MODEL

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
        print(f"⚠️ Primary model {target_model} failed: {str(e)}, trying backup...")
        # Fallback to backup model
        backup_model = GROQ_MODELS[1] if target_model == GROQ_MODELS[0] else GROQ_MODELS[0]
        
        try:
            chat_completion = client.chat.completions.create(
                messages=[{"role": "user", "content": prompt}],
                model=backup_model,
                temperature=0.7,
                max_tokens=2000,
            )
            return chat_completion.choices[0].message.content
        except Exception as backup_error:
            raise Exception(f"Groq AI generation failed: {str(backup_error)}")


def test_groq() -> str:
    """Test if Groq is working"""
    prompt = "Say 'Hello from Groq AI!' in one line."
    return generate_response(prompt)


def get_current_model() -> str:
    return DEFAULT_MODEL