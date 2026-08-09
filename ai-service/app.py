from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
import os
from routes.ai_routes import ai_bp
from routes.health_routes import health_bp

load_dotenv()

app = Flask(__name__)

# CORS - Allow all origins for now
CORS(app, origins=[
    "http://localhost:5000",
    "http://localhost:5173",
    "https://welcoming-serenity-production.up.railway.app",
    "https://healthnovacom-production.up.railway.app",
    "*"  # Allow all - can restrict later
])

# Register Blueprints
app.register_blueprint(ai_bp)
app.register_blueprint(health_bp)

if __name__ == "__main__":
    port = int(os.getenv("PORT", os.getenv("FLASK_PORT", 8000)))
    print(f"\n🤖 AI Service starting on port {port}")
    app.run(debug=False, host="0.0.0.0", port=port)