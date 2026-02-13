"""
Google OAuth Authentication Module
Handles Google Sign-In token verification
"""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import httpx
import os

router = APIRouter(prefix="/api/auth", tags=["auth"])


class GoogleCredentialRequest(BaseModel):
    credential: str


@router.post("/google")
async def verify_google_token(request: GoogleCredentialRequest):
    """
    Verify Google ID token and return user information.
    
    This endpoint receives the credential (JWT token) from Google Sign-In
    and verifies it with Google's tokeninfo endpoint.
    """
    credential = request.credential
    
    if not credential:
        raise HTTPException(status_code=400, detail="Credential is required")
    
    try:
        # Verify token with Google
        async with httpx.AsyncClient() as client:
            # Option 1: Use Google's tokeninfo endpoint (simpler, but less secure for production)
            # For production, use Google's library to verify JWT locally
            response = await client.get(
                "https://oauth2.googleapis.com/tokeninfo",
                params={"id_token": credential},
                timeout=10.0
            )
            
            if response.status_code != 200:
                raise HTTPException(
                    status_code=401,
                    detail="Invalid Google token"
                )
            
            token_info = response.json()
            
            # Extract user information
            user_data = {
                "name": token_info.get("name", ""),
                "email": token_info.get("email", ""),
                "picture": token_info.get("picture", ""),
                "provider": "google",
                "email_verified": token_info.get("email_verified", False),
            }
            
            if not user_data["email"]:
                raise HTTPException(
                    status_code=400,
                    detail="Email not found in token"
                )
            
            return user_data
            
    except httpx.RequestError as e:
        raise HTTPException(
            status_code=503,
            detail=f"Failed to verify token with Google: {str(e)}"
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error processing Google authentication: {str(e)}"
        )



