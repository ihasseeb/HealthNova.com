from flask import Blueprint
from controllers.health_controller import (
    symptom_checker_controller,
    diet_plan_controller,
    workout_plan_controller,
    chat_controller,
    report_analyzer_controller,
    health_tips_controller,
     analyze_report_image_controller, 
)

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