import httpx
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import List, Dict
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter(prefix="/chatbot", tags=["Chatbot"])

class Message(BaseModel):
    role: str = Field(..., description="The role of the message sender (e.g., 'user' or 'assistant')")
    content: str = Field(..., description="The content of the message")

class ChatRequest(BaseModel):
    messages: List[Dict[str, str]] = Field(..., description="List of message objects")

@router.post("")
async def chatbot_interaction(request: ChatRequest):
    try:
        # Log the incoming request
        logger.info(f"Received chat request with {len(request.messages)} messages")

        async with httpx.AsyncClient(timeout=30.0) as client:  # Add timeout
            response = await client.post(
                "http://localhost:1234/v1/chat/completions",
                json={
                    "model": "lmstudio-community/Meta-Llama-3.1-8B-Instruct-GGUF",
                    "messages": request.messages,
                    "temperature": 0.7,
                    "stream": False,
                    "max_tokens": 2000  # Add token limit
                }
            )

            # Log the raw response for debugging
            logger.info(f"LM Studio response status: {response.status_code}")
            logger.debug(f"Raw response: {response.text}")

            if response.status_code != 200:
                error_msg = f"LM Studio returned status code {response.status_code}"
                logger.error(error_msg)
                raise HTTPException(
                    status_code=500,
                    detail=error_msg
                )

            try:
                completion = response.json()
            except Exception as e:
                logger.error(f"Failed to parse JSON response: {str(e)}")
                raise HTTPException(
                    status_code=500,
                    detail="Invalid JSON response from LM Studio"
                )

            # Validate response structure
            if not isinstance(completion, dict):
                raise HTTPException(
                    status_code=500,
                    detail="Invalid response format from LM Studio"
                )

            if "choices" not in completion or not completion["choices"]:
                raise HTTPException(
                    status_code=500,
                    detail="No choices in LM Studio response"
                )

            response_content = completion["choices"][0].get("message", {}).get("content")
            
            if not response_content:
                raise HTTPException(
                    status_code=500,
                    detail="Empty response content from LM Studio"
                )

            logger.info("Successfully processed chatbot response")
            return {"response": response_content}

    except httpx.TimeoutException:
        logger.error("Request to LM Studio timed out")
        raise HTTPException(
            status_code=504,
            detail="Request to LM Studio timed out"
        )
    except httpx.RequestError as e:
        logger.error(f"Request error: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Error communicating with LM Studio: {str(e)}"
        )
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Unexpected error: {str(e)}"
        )