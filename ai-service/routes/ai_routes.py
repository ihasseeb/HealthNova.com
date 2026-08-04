from flask import Blueprint
from controllers.ai_controller import (
    home_controller,
    health_controller,
    test_ai_controller,
    model_info_controller,
)

# Create Blueprint
ai_bp = Blueprint("ai", __name__)

# Define routes
ai_bp.route("/", methods=["GET"])(home_controller)
ai_bp.route("/health", methods=["GET"])(health_controller)
ai_bp.route("/test-Groq-ai", methods=["GET"])(test_ai_controller)
ai_bp.route("/model-info", methods=["GET"])(model_info_controller)