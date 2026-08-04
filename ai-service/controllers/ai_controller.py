from flask import jsonify
from services.groq_service import test_groq, get_current_model


def home_controller():
    """Home route controller"""
    return jsonify({
        "success": True,
        "message": "🤖 HealthNova AI Service is running!",
        "version": "1.0.0",
        "ai_provider": "Groq"
    })


def health_controller():
    """Health check controller"""
    return jsonify({
        "status": "OK",
        "service": "AI Service"
    })


def test_ai_controller():
    """Test AI controller"""
    try:
        result = test_groq()
        return jsonify({
            "success": True,
            "message": "Groq AI is working!",
            "response": result,
            "model": get_current_model()
        })
    except Exception as e:
        return jsonify({
            "success": False,
            "message": str(e)
        }), 500


def model_info_controller():
    """Get current AI model info"""
    return jsonify({
        "success": True,
        "provider": "Groq",
        "model": get_current_model(),
    })