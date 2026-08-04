from services.groq_service import generate_response
import json


def analyze_symptoms(data: dict) -> dict:
    """
    Analyze user symptoms using AI
    """
    # Build prompt
    prompt = f"""You are a medical AI assistant. Analyze the following symptoms and provide health guidance.

USER INFO:
- Age: {data.get('age', 'Not provided')}
- Gender: {data.get('gender', 'Not provided')}
- Medical Conditions: {', '.join(data.get('medicalConditions', [])) or 'None'}
- Current Medications: {', '.join(data.get('currentMedications', [])) or 'None'}

SYMPTOMS:
{data.get('symptoms', 'No symptoms provided')}

DURATION: {data.get('duration', 'Not specified')}

Please provide a JSON response with the following structure (respond ONLY with valid JSON, no extra text):

{{
  "severity": "LOW" | "MODERATE" | "HIGH" | "EMERGENCY",
  "possibleCauses": ["cause1", "cause2", "cause3"],
  "recommendations": [
    "recommendation 1",
    "recommendation 2",
    "recommendation 3"
  ],
  "homeRemedies": [
    "remedy 1",
    "remedy 2"
  ],
  "whenToSeeDoctor": "Description of when medical attention is needed",
  "warningSignsToWatch": ["warning 1", "warning 2"],
  "disclaimer": "This is AI-generated advice. Consult a healthcare professional for medical concerns."
}}

Important:
- Be accurate but cautious
- Always recommend seeing a doctor for serious symptoms
- Consider age and medical conditions
- Provide actionable advice
"""

    try:
        # Get AI response
        response = generate_response(prompt)
        
        # Clean response (remove markdown if any)
        cleaned = response.strip()
        if cleaned.startswith("```json"):
            cleaned = cleaned[7:]
        if cleaned.startswith("```"):
            cleaned = cleaned[3:]
        if cleaned.endswith("```"):
            cleaned = cleaned[:-3]
        cleaned = cleaned.strip()
        
        # Parse JSON
        result = json.loads(cleaned)
        return result
        
    except json.JSONDecodeError as e:
        raise Exception(f"AI response format error: {str(e)}")
    except Exception as e:
        raise Exception(f"Symptom analysis failed: {str(e)}")


def generate_diet_plan(data: dict) -> dict:
    """
    Generate personalized diet plan using AI
    """
    prompt = f"""You are a professional nutritionist AI. Create a personalized 7-day diet plan.

USER PROFILE:
- Age: {data.get('age')}
- Gender: {data.get('gender')}
- Height: {data.get('height')} cm
- Weight: {data.get('weight')} kg
- BMI: {data.get('bmi', 'Not calculated')}
- Activity Level: {data.get('activityLevel', 'MODERATE')}
- Goal: {data.get('goal', 'MAINTAIN')}
- Dietary Preference: {data.get('dietaryPreference', 'NON_VEG')}
- Allergies: {', '.join(data.get('allergies', [])) or 'None'}
- Medical Conditions: {', '.join(data.get('medicalConditions', [])) or 'None'}
- Target Weight: {data.get('targetWeight', 'Not specified')} kg

Provide response in this EXACT JSON format (no extra text, only JSON):

{{
  "dailyCalories": <number>,
  "macros": {{
    "protein": "<grams>",
    "carbs": "<grams>",
    "fats": "<grams>"
  }},
  "waterIntake": "<liters per day>",
  "weeklyPlan": [
    {{
      "day": "Monday",
      "meals": {{
        "breakfast": {{
          "name": "meal name",
          "calories": <number>,
          "items": ["item 1", "item 2"]
        }},
        "lunch": {{
          "name": "meal name",
          "calories": <number>,
          "items": ["item 1", "item 2"]
        }},
        "dinner": {{
          "name": "meal name",
          "calories": <number>,
          "items": ["item 1", "item 2"]
        }},
        "snacks": [
          {{
            "name": "snack name",
            "calories": <number>
          }}
        ]
      }}
    }}
  ],
  "tips": [
    "tip 1",
    "tip 2",
    "tip 3"
  ],
  "foodsToAvoid": ["food 1", "food 2"],
  "supplements": ["supplement 1", "supplement 2"],
  "disclaimer": "Consult a nutritionist for personalized medical advice."
}}

Requirements:
- Generate ALL 7 days (Monday to Sunday)
- Consider allergies and medical conditions
- Match dietary preference (VEG/NON_VEG/etc)
- Calculate calories based on goal
- Provide practical, realistic meals
"""

    try:
        response = generate_response(prompt)
        
        # Clean response
        cleaned = response.strip()
        if cleaned.startswith("```json"):
            cleaned = cleaned[7:]
        if cleaned.startswith("```"):
            cleaned = cleaned[3:]
        if cleaned.endswith("```"):
            cleaned = cleaned[:-3]
        cleaned = cleaned.strip()
        
        result = json.loads(cleaned)
        return result
        
    except json.JSONDecodeError as e:
        raise Exception(f"AI response format error: {str(e)}")
    except Exception as e:
        raise Exception(f"Diet plan generation failed: {str(e)}")


def generate_workout_plan(data: dict) -> dict:
    """
    Generate personalized workout plan using AI
    """
    prompt = f"""You are a professional fitness trainer AI. Create a personalized weekly workout plan.

USER PROFILE:
- Age: {data.get('age')}
- Gender: {data.get('gender')}
- Height: {data.get('height')} cm
- Weight: {data.get('weight')} kg
- BMI: {data.get('bmi', 'Not calculated')}
- Activity Level: {data.get('activityLevel', 'MODERATE')}
- Goal: {data.get('goal', 'MAINTAIN')}
- Medical Conditions: {', '.join(data.get('medicalConditions', [])) or 'None'}
- Workout Location: {data.get('location', 'HOME')}
- Experience Level: {data.get('experience', 'BEGINNER')}

Provide response in this EXACT JSON format (no extra text, only JSON):

{{
  "planName": "Custom Workout Plan Name",
  "duration": "4 weeks",
  "daysPerWeek": <number>,
  "estimatedCaloriesBurn": "<per session>",
  "weeklySchedule": [
    {{
      "day": "Monday",
      "focus": "Upper Body / Cardio / Rest",
      "duration": "45 minutes",
      "warmup": [
        "5 min light cardio",
        "Dynamic stretching"
      ],
      "exercises": [
        {{
          "name": "Exercise Name",
          "sets": 3,
          "reps": "10-12",
          "rest": "60 seconds",
          "instructions": "Brief how-to"
        }}
      ],
      "cooldown": [
        "5 min stretching",
        "Deep breathing"
      ]
    }}
  ],
  "tips": [
    "tip 1",
    "tip 2",
    "tip 3"
  ],
  "safetyNotes": [
    "note 1",
    "note 2"
  ],
  "progressTracking": "How to track progress",
  "nutritionAdvice": "Brief nutrition guidance",
  "disclaimer": "Consult a fitness professional and doctor before starting any exercise program."
}}

Requirements:
- Generate ALL 7 days (Monday to Sunday)
- Include rest days
- Consider medical conditions
- Match user's goal and experience level
- Provide realistic, safe exercises
- Match workout location (home/gym)
"""

    try:
        response = generate_response(prompt)
        
        # Clean response
        cleaned = response.strip()
        if cleaned.startswith("```json"):
            cleaned = cleaned[7:]
        if cleaned.startswith("```"):
            cleaned = cleaned[3:]
        if cleaned.endswith("```"):
            cleaned = cleaned[:-3]
        cleaned = cleaned.strip()
        
        result = json.loads(cleaned)
        return result
        
    except json.JSONDecodeError as e:
        raise Exception(f"AI response format error: {str(e)}")
    except Exception as e:
        raise Exception(f"Workout plan generation failed: {str(e)}")


def chat_with_ai(data: dict) -> dict:
    """
    Health chatbot with conversation history
    """
    # Get user info
    user_info = data.get('userProfile', {})
    message = data.get('message', '')
    history = data.get('history', [])  # Previous messages

    if not message:
        raise Exception("Message is required")

    # Build conversation context
    conversation_context = ""
    if history:
        conversation_context = "\n\nPREVIOUS CONVERSATION:\n"
        for msg in history[-5:]:  # Last 5 messages for context
            role = "User" if msg.get('role') == 'user' else "Assistant"
            conversation_context += f"{role}: {msg.get('content')}\n"

    # Build user profile context
    profile_context = ""
    if user_info:
        profile_context = f"""
USER PROFILE:
- Age: {user_info.get('age', 'Not provided')}
- Gender: {user_info.get('gender', 'Not provided')}
- Weight: {user_info.get('weight', 'Not provided')} kg
- Height: {user_info.get('height', 'Not provided')} cm
- BMI: {user_info.get('bmi', 'Not calculated')}
- Medical Conditions: {', '.join(user_info.get('medicalConditions', [])) or 'None'}
- Allergies: {', '.join(user_info.get('allergies', [])) or 'None'}
"""

    prompt = f"""You are a professional AI health assistant for HealthNova AI.
You provide friendly, informative health advice while being safe and responsible.

{profile_context}

{conversation_context}

CURRENT USER MESSAGE: {message}

Respond in this EXACT JSON format (no extra text):

{{
  "reply": "Your helpful response here in a friendly, conversational tone",
  "suggestions": [
    "Follow-up question 1",
    "Follow-up question 2",
    "Follow-up question 3"
  ],
  "category": "GENERAL | SYMPTOMS | DIET | FITNESS | MENTAL_HEALTH | EMERGENCY",
  "needsDoctor": true or false,
  "urgency": "LOW | MEDIUM | HIGH"
}}

Guidelines:
- Be conversational and empathetic
- Give practical, actionable advice
- Consider user's profile if provided
- Reference previous conversation naturally
- If serious symptoms mentioned, recommend doctor
- Provide 3 relevant follow-up suggestions
- Keep responses concise (2-4 sentences)
- Use simple language, avoid heavy medical jargon
- Always be safe - never diagnose serious conditions
"""

    try:
        response = generate_response(prompt)

        # Clean response
        cleaned = response.strip()
        if cleaned.startswith("```json"):
            cleaned = cleaned[7:]
        if cleaned.startswith("```"):
            cleaned = cleaned[3:]
        if cleaned.endswith("```"):
            cleaned = cleaned[:-3]
        cleaned = cleaned.strip()

        result = json.loads(cleaned)
        return result

    except json.JSONDecodeError as e:
        raise Exception(f"AI response format error: {str(e)}")
    except Exception as e:
        raise Exception(f"Chat generation failed: {str(e)}")

def analyze_report(data: dict) -> dict:
    """
    Analyze medical report using AI
    """
    report_text = data.get('reportText', '')
    report_type = data.get('reportType', 'General')
    user_info = data.get('userProfile', {})

    if not report_text:
        raise Exception("Report text is required")

    profile_context = ""
    if user_info:
        profile_context = f"""
USER PROFILE:
- Age: {user_info.get('age', 'Not provided')}
- Gender: {user_info.get('gender', 'Not provided')}
- Medical Conditions: {', '.join(user_info.get('medicalConditions', [])) or 'None'}
"""

    prompt = f"""You are a medical AI assistant. Analyze this medical report and explain it in simple language.

{profile_context}

REPORT TYPE: {report_type}

REPORT CONTENT:
{report_text}

Provide response in this EXACT JSON format (no extra text):

{{
  "summary": "Brief overall summary in simple language (2-3 sentences)",
  "overallStatus": "NORMAL | ATTENTION_NEEDED | CONCERNING",
  "keyFindings": [
    {{
      "test": "Test name",
      "value": "Actual value",
      "normalRange": "Normal range",
      "status": "NORMAL | HIGH | LOW",
      "meaning": "What this means in simple words"
    }}
  ],
  "abnormalValues": [
    {{
      "test": "Test name",
      "value": "Value",
      "concern": "Why it's a concern",
      "recommendation": "What to do"
    }}
  ],
  "recommendations": [
    "Recommendation 1",
    "Recommendation 2",
    "Recommendation 3"
  ],
  "dietaryAdvice": [
    "Diet tip 1",
    "Diet tip 2"
  ],
  "lifestyleChanges": [
    "Lifestyle change 1",
    "Lifestyle change 2"
  ],
  "followUpNeeded": true or false,
  "urgency": "LOW | MEDIUM | HIGH",
  "questionsForDoctor": [
    "Question 1",
    "Question 2"
  ],
  "disclaimer": "This is AI analysis. Please consult your doctor for proper interpretation and treatment."
}}

Guidelines:
- Use simple, easy-to-understand language
- Avoid heavy medical jargon
- Be accurate but cautious
- Always recommend doctor consultation
- Highlight critical values
- Provide actionable advice
"""

    try:
        response = generate_response(prompt)

        cleaned = response.strip()
        if cleaned.startswith("```json"):
            cleaned = cleaned[7:]
        if cleaned.startswith("```"):
            cleaned = cleaned[3:]
        if cleaned.endswith("```"):
            cleaned = cleaned[:-3]
        cleaned = cleaned.strip()

        result = json.loads(cleaned)
        return result

    except json.JSONDecodeError as e:
        raise Exception(f"AI response format error: {str(e)}")
    except Exception as e:
        raise Exception(f"Report analysis failed: {str(e)}")


def generate_health_tips(data: dict) -> dict:
    """
    Generate personalized health tips using AI
    """
    user_info = data.get('userProfile', {})
    category = data.get('category', 'GENERAL')  # GENERAL, DIET, FITNESS, MENTAL, SLEEP
    
    profile_context = ""
    if user_info:
        profile_context = f"""
USER PROFILE:
- Age: {user_info.get('age', 'Not provided')}
- Gender: {user_info.get('gender', 'Not provided')}
- Weight: {user_info.get('weight', 'Not provided')} kg
- BMI: {user_info.get('bmi', 'Not calculated')}
- Activity Level: {user_info.get('activityLevel', 'MODERATE')}
- Goal: {user_info.get('goal', 'MAINTAIN')}
- Medical Conditions: {', '.join(user_info.get('medicalConditions', [])) or 'None'}
"""
    
    prompt = f"""You are a health coach AI. Generate personalized daily health tips for the user.

{profile_context}

CATEGORY: {category}

Provide response in this EXACT JSON format (no extra text):

{{
  "dailyTip": {{
    "title": "Catchy tip title",
    "description": "Detailed explanation (2-3 sentences)",
    "actionable": "One specific action to take today",
    "benefit": "Why this helps"
  }},
  "weeklyGoals": [
    {{
      "goal": "Goal name",
      "description": "How to achieve it",
      "target": "Specific target"
    }}
  ],
  "quickTips": [
    "Quick tip 1",
    "Quick tip 2",
    "Quick tip 3",
    "Quick tip 4",
    "Quick tip 5"
  ],
  "motivationalQuote": "Inspiring health quote",
  "todaysFocus": {{
    "area": "Focus area (Hydration, Sleep, Movement, etc)",
    "why": "Why focus on this today",
    "how": "Practical steps"
  }},
  "avoidToday": [
    "Thing to avoid 1",
    "Thing to avoid 2"
  ],
  "reminders": [
    "Reminder 1",
    "Reminder 2",
    "Reminder 3"
  ]
}}

Guidelines:
- Make it personalized based on profile
- Be practical and actionable
- Positive and encouraging tone
- Realistic goals
- Consider medical conditions
- Simple language
"""

    try:
        response = generate_response(prompt)
        
        cleaned = response.strip()
        if cleaned.startswith("```json"):
            cleaned = cleaned[7:]
        if cleaned.startswith("```"):
            cleaned = cleaned[3:]
        if cleaned.endswith("```"):
            cleaned = cleaned[:-3]
        cleaned = cleaned.strip()
        
        result = json.loads(cleaned)
        return result
        
    except json.JSONDecodeError as e:
        raise Exception(f"AI response format error: {str(e)}")
    except Exception as e:
        raise Exception(f"Health tips generation failed: {str(e)}")