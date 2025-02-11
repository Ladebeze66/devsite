from fastapi import FastAPI
import requests

app = FastAPI()

OLLAMA_API_URL = "http://localhost:11434/api/generate"

@app.get("/ask")
async def ask_question(q: str):
    data = {
        "model": "mistral",
        "prompt": q,
        "stream": False
    }
    response = requests.post(OLLAMA_API_URL, json=data)
    return response.json()
