from flask import request, jsonify
from services.health_ai_service import (
    analyze_symptoms,
    generate_diet_plan,
    generate_workout_plan,
    chat_with_ai,
    analyze_report,
    generate_health_tips,
    analyze_report_with_image,
)


def symptom_checker_controller():
    """
    Analyze symptoms endpoint
    """
    try:
        # Get data from request
        data = request.get_json()

        # Validate required field
        if not data or not data.get("symptoms"):
            return jsonify({
                "success": False,
                "message": "Symptoms are required"
            }), 400

        # Analyze with AI
        result = analyze_symptoms(data)

        return jsonify({
            "success": True,
            "message": "Symptoms analyzed successfully",
            "data": result
        })

    except Exception as e:
        return jsonify({
            "success": False,
            "message": str(e)
        }), 500


def diet_plan_controller():
    """Generate diet plan endpoint"""
    try:
        data = request.get_json()

        # Validate required fields
        required = ["age", "gender", "height", "weight"]
        for field in required:
            if not data or not data.get(field):
                return jsonify({
                    "success": False,
                    "message": f"{field} is required"
                }), 400

        # Generate plan
        result = generate_diet_plan(data)

        return jsonify({
            "success": True,
            "message": "Diet plan generated successfully",
            "data": result
        })

    except Exception as e:
        return jsonify({
            "success": False,
            "message": str(e)
        }), 500

def workout_plan_controller():
    """Generate workout plan endpoint"""
    try:
        data = request.get_json()

        # Validate required fields
        required = ['age', 'gender', 'goal']
        for field in required:
            if not data or not data.get(field):
                return jsonify({
                    "success": False,
                    "message": f"{field} is required"
                }), 400

        # Generate plan
        result = generate_workout_plan(data)

        return jsonify({
            "success": True,
            "message": "Workout plan generated successfully",
            "data": result
        })

    except Exception as e:
        return jsonify({
            "success": False,
            "message": str(e)
        }), 500


def chat_controller():
    """AI Health Chatbot endpoint"""
    try:
        data = request.get_json()
        
        if not data or not data.get('message'):
            return jsonify({
                "success": False,
                "message": "Message is required"
            }), 400
        
        result = chat_with_ai(data)
        
        return jsonify({
            "success": True,
            "message": "Response generated",
            "data": result
        })
        
    except Exception as e:
        return jsonify({
            "success": False,
            "message": str(e)
        }), 500


def report_analyzer_controller():
    """Analyze medical report endpoint"""
    try:
        data = request.get_json()
        
        if not data or not data.get('reportText'):
            return jsonify({
                "success": False,
                "message": "Report text is required"
            }), 400
        
        result = analyze_report(data)
        
        return jsonify({
            "success": True,
            "message": "Report analyzed successfully",
            "data": result
        })
        
    except Exception as e:
        return jsonify({
            "success": False,
            "message": str(e)
        }), 500


def health_tips_controller():
    """Generate personalized health tips endpoint"""
    try:
        data = request.get_json() or {}
        
        result = generate_health_tips(data)
        
        return jsonify({
            "success": True,
            "message": "Health tips generated successfully",
            "data": result
        })
        
    except Exception as e:
        return jsonify({
            "success": False,
            "message": str(e)
        }), 500

def analyze_report_image_controller():
    """Analyze medical report from image"""
    try:
        data = request.get_json()
        
        if not data or not data.get('image'):
            return jsonify({
                "success": False,
                "message": "Image is required"
            }), 400
        
        result = analyze_report_with_image(data)
        
        return jsonify({
            "success": True,
            "message": "Report image analyzed successfully",
            "data": result
        })
        
    except Exception as e:
        return jsonify({
            "success": False,
            "message": str(e)
        }), 500