from fastapi import APIRouter, HTTPException, UploadFile, File
from fastapi.responses import StreamingResponse
import httpx
import os
from typing import Optional

router = APIRouter(prefix="/api/v1/voice", tags=["voice"])

ELEVENLABS_API_KEY = os.getenv("ELEVENLABS_API_KEY", "demo-key")
ELEVENLABS_BASE_URL = os.getenv("ELEVENLABS_BASE_URL", "https://api.elevenlabs.io")
DEFAULT_VOICE_ID = os.getenv("ELEVENLABS_DEFAULT_VOICE_ID", "demo-voice")

@router.post("/stt")
async def speech_to_text(audio: UploadFile = File(...)):
    """Convert speech to text using ElevenLabs Scribe v1"""
    if not ELEVENLABS_API_KEY or ELEVENLABS_API_KEY == "demo-key":
        return {
            "text": "This is a demo speech-to-text response. Please configure ElevenLabs API key for real functionality.",
            "confidence": 0.95
        }
    
    try:
        async with httpx.AsyncClient() as client:
            files = {"audio": (audio.filename, await audio.read(), audio.content_type)}
            headers = {"xi-api-key": ELEVENLABS_API_KEY}
            
            response = await client.post(
                f"{ELEVENLABS_BASE_URL}/v1/speech-to-text",
                files=files,
                headers=headers
            )
            
            if response.status_code == 200:
                return response.json()
            else:
                raise HTTPException(status_code=response.status_code, detail="STT failed")
                
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"STT error: {str(e)}")

@router.post("/tts/stream")
async def text_to_speech_stream(
    text: str,
    voice_id: Optional[str] = None
):
    """Convert text to speech with streaming using ElevenLabs"""
    if not ELEVENLABS_API_KEY or ELEVENLABS_API_KEY == "demo-key":
        raise HTTPException(status_code=501, detail="ElevenLabs API key not configured")
    
    voice_id = voice_id or DEFAULT_VOICE_ID
    
    try:
        async with httpx.AsyncClient() as client:
            payload = {
                "text": text,
                "model_id": "eleven_flash_v2_5",
                "voice_settings": {
                    "stability": 0.5,
                    "similarity_boost": 0.75
                }
            }
            headers = {"xi-api-key": ELEVENLABS_API_KEY}
            
            response = await client.post(
                f"{ELEVENLABS_BASE_URL}/v1/text-to-speech/{voice_id}/stream",
                json=payload,
                headers=headers
            )
            
            if response.status_code == 200:
                return StreamingResponse(
                    response.aiter_bytes(),
                    media_type="audio/mpeg"
                )
            else:
                raise HTTPException(status_code=response.status_code, detail="TTS failed")
                
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"TTS error: {str(e)}")
