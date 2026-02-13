"""
Resume Analysis API
Handles resume upload, parsing, and scoring against job roles or custom job descriptions
"""
from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from typing import Optional
import tempfile
import os
from resume_analyzer.parser import extract_text_from_pdf
from resume_analyzer.scorer import calculate_advanced_resume_score
from resume_analyzer.job_roles_dataset import get_job_role_data
from resume_analyzer.embedder import calculate_similarity

router = APIRouter(prefix="/api/resume", tags=["resume"])


@router.post("/analyze")
async def analyze_resume(
    resume: UploadFile = File(...),
    job_role: Optional[str] = Form(None),
    job_description: Optional[str] = Form(None)
):
    """
    Analyze a resume PDF against a job role or custom job description.
    
    Args:
        resume: PDF file to analyze
        job_role: Predefined job role name (optional if job_description is provided)
        job_description: Custom job description text (optional if job_role is provided)
    
    Returns:
        Analysis results with score, matched/missing skills, strengths, improvements, etc.
    """
    # Validate input
    if not job_role and not job_description:
        raise HTTPException(
            status_code=400,
            detail="Either 'job_role' or 'job_description' must be provided"
        )
    
    if job_role and job_description:
        raise HTTPException(
            status_code=400,
            detail="Provide either 'job_role' OR 'job_description', not both"
        )
    
    # Validate file type
    if not resume.filename.endswith('.pdf'):
        raise HTTPException(
            status_code=400,
            detail="Only PDF files are supported"
        )
    
    # Save uploaded file temporarily
    temp_file = None
    try:
        # Create temporary file
        with tempfile.NamedTemporaryFile(delete=False, suffix='.pdf') as temp_file:
            content = await resume.read()
            temp_file.write(content)
            temp_file_path = temp_file.name
        
        # Extract text from PDF
        try:
            resume_text = extract_text_from_pdf(temp_file_path)
        except Exception as e:
            raise HTTPException(
                status_code=400,
                detail=f"Failed to extract text from PDF: {str(e)}"
            )
        
        if not resume_text or len(resume_text.strip()) < 50:
            raise HTTPException(
                status_code=400,
                detail="Resume PDF appears to be empty or could not be parsed"
            )
        
        # Get job role data or use custom description
        similarity_score = 0.0
        job_role_data = None
        
        if job_role:
            # Use predefined job role dataset
            job_role_data = get_job_role_data(job_role)
            if not job_role_data:
                raise HTTPException(
                    status_code=400,
                    detail=f"Invalid job role: {job_role}. Available roles: Software Engineer, Associate Software Engineer, Data Analyst, Web Developer, Frontend Developer, Backend Developer, Full Stack Developer, DevOps Engineer, Machine Learning Engineer"
                )
            
            # Calculate similarity with job role description
            try:
                similarity_score = calculate_similarity(resume_text, job_role_data.get("description", ""))
            except Exception:
                # If similarity calculation fails, continue without it
                similarity_score = 0.0
            
            # Calculate advanced score
            score_result = calculate_advanced_resume_score(
                resume_text=resume_text,
                job_role_data=job_role_data,
                similarity_score=similarity_score
            )
            
            # Format response
            matched_skills = (
                score_result["matched_skills"]["required"] +
                score_result["matched_skills"]["technical"] +
                score_result["matched_skills"]["soft"]
            )
            
            missing_skills = (
                score_result["missing_skills"]["required"] +
                score_result["missing_skills"]["technical"][:5]  # Limit missing technical skills
            )
            
            # Generate strengths
            strengths = []
            if score_result["matched_skills"]["required"]:
                strengths.append(f"Strong match on required skills: {', '.join(score_result['matched_skills']['required'][:5])}")
            if score_result["matched_skills"]["technical"]:
                strengths.append(f"Good technical skills: {', '.join(score_result['matched_skills']['technical'][:5])}")
            if score_result["experience_metrics"]["years"] > 0:
                strengths.append(f"Relevant experience: {score_result['experience_metrics']['years']} years")
            
            # Generate improvements
            improvements = []
            if score_result["missing_skills"]["required"]:
                improvements.append(f"Add required skills: {', '.join(score_result['missing_skills']['required'][:5])}")
            if score_result["missing_skills"]["technical"]:
                improvements.append(f"Consider adding: {', '.join(score_result['missing_skills']['technical'][:5])}")
            if score_result["experience_metrics"]["years"] == 0:
                improvements.append("Highlight your experience and projects more clearly")
            
            # Generate feedback
            score = score_result["overall_score"]
            feedback = f"Your resume scored {score}/100 for the {job_role} role."
            if similarity_score > 0:
                feedback += f" Semantic match: {similarity_score}%."
            
            if score >= 75:
                feedback += " Excellent match! You're well-qualified for this role."
            elif score >= 60:
                feedback += " Good match! With some improvements, you'll be very competitive."
            elif score >= 45:
                feedback += " Moderate match. Consider adding more relevant skills and experience."
            else:
                feedback += " Needs improvement. Focus on adding required skills and relevant experience."
            
            if matched_skills:
                feedback += f" Key matched skills: {', '.join(matched_skills[:5])}."
            
            return {
                "score": score,
                "similarity": similarity_score,
                "matched_skills": matched_skills[:10],  # Limit to top 10
                "missing_skills": missing_skills[:10],  # Limit to top 10
                "strengths": strengths,
                "improvements": improvements,
                "keywords": matched_skills[:15],  # Detected keywords
                "feedback": feedback
            }
        
        else:
            # Use custom job description
            # For custom descriptions, use a simpler scoring approach
            # Calculate similarity
            try:
                similarity_score = calculate_similarity(resume_text, job_description)
            except Exception:
                similarity_score = 0.0
            
            # Simple keyword-based scoring for custom descriptions
            job_desc_lower = job_description.lower()
            resume_lower = resume_text.lower()
            
            # Extract keywords from job description (simple approach)
            job_keywords = [word.strip() for word in job_desc_lower.split() if len(word) > 3]
            matched_keywords = [kw for kw in job_keywords if kw in resume_lower]
            
            # Calculate score based on keyword match and similarity
            keyword_match_ratio = len(matched_keywords) / len(job_keywords) if job_keywords else 0
            base_score = keyword_match_ratio * 60  # Base score from keyword matching
            similarity_bonus = (similarity_score / 100) * 40  # Bonus from semantic similarity
            final_score = min(base_score + similarity_bonus, 100)
            final_score = max(final_score, 15)  # Minimum score
            
            # Generate response
            strengths = []
            if matched_keywords:
                strengths.append(f"Matched keywords: {', '.join(matched_keywords[:5])}")
            if similarity_score > 70:
                strengths.append("Strong semantic similarity with job description")
            
            improvements = []
            if keyword_match_ratio < 0.5:
                improvements.append("Add more keywords from the job description to your resume")
            if similarity_score < 50:
                improvements.append("Improve alignment with job description requirements")
            
            feedback = f"Your resume scored {round(final_score, 1)}/100 against the custom job description."
            if similarity_score > 0:
                feedback += f" Semantic match: {similarity_score}%."
            
            if final_score >= 75:
                feedback += " Excellent match!"
            elif final_score >= 60:
                feedback += " Good match!"
            elif final_score >= 45:
                feedback += " Moderate match."
            else:
                feedback += " Needs improvement."
            
            return {
                "score": round(final_score, 1),
                "similarity": similarity_score,
                "matched_skills": matched_keywords[:10],
                "missing_skills": [kw for kw in job_keywords[:10] if kw not in matched_keywords],
                "strengths": strengths,
                "improvements": improvements,
                "keywords": matched_keywords[:15],
                "feedback": feedback
            }
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error analyzing resume: {str(e)}"
        )
    finally:
        # Clean up temporary file
        if temp_file_path and os.path.exists(temp_file_path):
            try:
                os.unlink(temp_file_path)
            except Exception:
                pass
