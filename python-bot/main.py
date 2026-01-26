from fastapi import FastAPI
from chatbot import response
from models import ChatMessage

app = FastAPI()

@app.get("/")
async def read_root():
    return {"Hello": "World"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

@app.post("/chat")
async def chat_endpoint(chat_message: ChatMessage):
    bot_response = response(chat_message.message)
    return {"response": bot_response}