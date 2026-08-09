import google.generativeai as genai
import os
from dotenv import load_dotenv
import base64
from PIL import Image
import io

load_dotenv()

API_KEY = os.getenv("GEMINI_API_KEY")

if not API_KEY:
    raise ValueError("❌ GEMINI_API_KEY not found in .env")

genai.configure(api_key=API_KEY)

# Priority list - if one fails, try next
VISION_MODELS = [
    "gemini-2.5-flash-lite",       # Best free quota
    "gemini-flash-lite-latest",    # Alternative
    "gemini-2.0-flash-lite",       # Backup
    "gemini-2.0-flash-lite-001",   # Stable backup
    "gemini-2.5-flash",            # If others fail
]


def analyze_image_with_gemini(image_base64: str, prompt: str) -> str:
    """
    Analyze image using Gemini Vision with fallback
    """
    try:
        image_bytes = base64.b64decode(image_base64)
        image = Image.open(io.BytesIO(image_bytes))
        
        last_error = None
        
        # Try each model until one works
        for model_name in VISION_MODELS:
            try:
                print(f"🎯 Trying model: {model_name}")
                model = genai.GenerativeModel(model_name)
                response = model.generate_content([prompt, image])
                print(f"✅ Success with: {model_name}")
                return response.text
            except Exception as e:
                error_str = str(e)
                print(f"❌ Failed {model_name}: {error_str[:100]}")
                last_error = e
                
                # If quota error, try next model
                if "429" in error_str or "quota" in error_str.lower():
                    continue
                # If model not found, try next
                if "404" in error_str or "not found" in error_str.lower():
                    continue
                # Other errors, raise
                raise
        
        raise Exception(f"All models failed. Last error: {last_error}")
        
    except Exception as e:
        raise Exception(f"Gemini vision failed: {str(e)}")
        # import google.generativeai as genai
# import os
# from dotenv import load_dotenv

# load_dotenv()

# API_KEY = os.getenv("GEMINI_API_KEY")

# if not API_KEY:
#     raise ValueError("❌ GEMINI_API_KEY not found in .env")

# genai.configure(api_key=API_KEY)


# def get_available_model():
#     """
#     Automatically find best available Gemini model
#     Priority: flash > pro > default
#     """
#     # Preferred models (priority order)
#     preferred_models = [
#         "gemini-2.0-flash",
#         "gemini-1.5-flash",
#         "gemini-1.5-flash-8b",
#         "gemini-1.5-pro",
#         "gemini-pro",
#     ]

#     try:
#         # Get all available models
#         available_models = []
#         for m in genai.list_models():
#             # Only models that support generateContent
#             if "generateContent" in m.supported_generation_methods:
#                 model_name = m.name.replace("models/", "")
#                 available_models.append(model_name)

#         print(f"\n✅ Available models: {available_models}\n")

#         # Find first preferred model that's available
#         for preferred in preferred_models:
#             if preferred in available_models:
#                 print(f"🎯 Using model: {preferred}")
#                 return preferred

#         # If no preferred model, use first available
#         if available_models:
#             print(f"⚠️  Using fallback: {available_models[0]}")
#             return available_models[0]

#         raise Exception("No models available")

#     except Exception as e:
#         print(f"❌ Error finding model: {str(e)}")
#         # Ultimate fallback
#         return "gemini-1.5-flash"


# # Auto-select best model on startup
# SELECTED_MODEL = get_available_model()
# model = genai.GenerativeModel(SELECTED_MODEL)


# def generate_response(prompt: str) -> str:
#     """Generate AI response using Gemini"""
#     try:
#         response = model.generate_content(prompt)
#         return response.text
#     except Exception as e:
#         raise Exception(f"AI generation failed: {str(e)}")


# def test_gemini() -> str:
#     """Test if Gemini is working"""
#     prompt = "Say 'Hello from Gemini AI!' in one line."
#     return generate_response(prompt)


# def get_current_model() -> str:
#     """Return currently used model name"""
#     return SELECTED_MODEL
