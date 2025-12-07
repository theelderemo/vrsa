  GNU nano 7.2                                                         /home/chris/vrsa-audio-api/main.py                                                                  
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import essentia.standard as es
import os
import shutil
import uuid

app = FastAPI()

# Allow your website to talk to this API
origins = ["*"]  # We allow all for now to avoid CORS errors during testing

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"status": "VRS/A Audio Engine Online"}

@app.post("/analyze")
async def analyze_audio(file: UploadFile = File(...)):
    file_id = str(uuid.uuid4())
    temp_filename = f"temp_{file_id}_{file.filename}"
    
    try:
        with open(temp_filename, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # Load audio (Essentia handles mp3/wav/m4a)
        loader = es.MonoLoader(filename=temp_filename, sampleRate=44100)
        audio = loader()

        # Perform Analysis
        rhythm_extractor = es.RhythmExtractor2013(method="multifeature")
        bpm, _, _, _, _ = rhythm_extractor(audio)

        key_extractor = es.KeyExtractor()
        key, scale, strength = key_extractor(audio)

        danceability = es.Danceability()
        dance_score, _ = danceability(audio)

        # Cleanup
        if os.path.exists(temp_filename):
            os.remove(temp_filename)

        return {
            "filename": file.filename,
            "bpm": round(bpm),
            "key": key,
            "scale": scale,
            "danceability": round(dance_score, 2)
        }

    except Exception as e:
        if os.path.exists(temp_filename):
            os.remove(temp_filename)
        raise HTTPException(status_code=500, detail=str(e))
