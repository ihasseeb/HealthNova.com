from flask import Blueprint
from controllers.health_controller import (
    handle_pre_consultation,
    symptom_checker_controller,
    diet_plan_controller,
    workout_plan_controller,
    chat_controller,
    report_analyzer_controller,
    health_tips_controller,
     analyze_report_image_controller, 
     mental_health_controller
)
from controllers.health_controller import ai_voice_scribe_controller

# Create Blueprint
health_bp = Blueprint("health", __name__, url_prefix="/api/health")

# Routes
health_bp.route("/symptom-check", methods=["POST"])(symptom_checker_controller)
health_bp.route("/diet-plan", methods=["POST"])(diet_plan_controller)
health_bp.route("/workout-plan", methods=["POST"])(workout_plan_controller)
health_bp.route("/chat", methods=["POST"])(chat_controller)
health_bp.route("/analyze-report", methods=["POST"])(report_analyzer_controller)
health_bp.route("/health-tips", methods=["POST"])(health_tips_controller)
health_bp.route("/analyze-report-image", methods=["POST"])(analyze_report_image_controller)
health_bp.route('/pre-consultation', methods=['POST'])(handle_pre_consultation)
health_bp.route("/mental-health", methods=["POST"])(mental_health_controller)
health_bp.route("/voice-scribe", methods=["POST"])(ai_voice_scribe_controller)