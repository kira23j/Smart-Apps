from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from googletrans import Translator, LANGUAGES

app = FastAPI()
translator = Translator()

class TranslationRequest(BaseModel):
    source_language: str
    target_language: str
    text: str

@app.get("/languages")
def get_supported_languages():
    """Returns a dictionary of supported languages."""
    return LANGUAGES

@app.get("/language-options")
def get_language_options():
    """Returns lists of available source and target languages."""
    return {
        "source_languages": list(LANGUAGES.keys()),
        "target_languages": list(LANGUAGES.keys())
    }

@app.post("/translate")
def translate_text(request: TranslationRequest):
    """Translates text from source language to target language."""
    # Validate language codes
    if request.source_language not in LANGUAGES or request.target_language not in LANGUAGES:
        raise HTTPException(status_code=400, detail="Invalid language code")
    
    try:
        # Perform translation
        translation = translator.translate(
            request.text,
            src=request.source_language,
            dest=request.target_language
        )
        
        # Check for translation result
        if translation is None or translation.text is None:
            raise HTTPException(status_code=500, detail="Translation returned no result")
        
        return {"translated_text": translation.text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Translation failed: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)