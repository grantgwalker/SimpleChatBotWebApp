In charge of API.

- passes info to Python backedn

In scope:

- user sends message to bot
- response is sent back to the user
- user can create new chat sessions
- user can view previous chat sessions
- must be pure JavaScript

JSON Strucutre:
{
"id": string, primary key
"user_id": string, who owns the chat
"session_id": string, chat grouping
"sender": string, "user" or "bot"
"message": string, the content
"created_at": Timestamp time of message send
}

start with node index.js

This is a test curl to save a message to the DB

- curl -X POST http://localhost:3000/chat `-H "Content-Type: application/json"` -d "{\"message\":\"Hello\",\"user_id\":\"u1\",\"session_id\":\"s1\"}"

This is a test curl to get messages of a conversation

- curl "http://localhost:3000/chat/conversation?user_id=u1&session_id=s1"

This is a test curl to get all conversations

- curl "http://localhost:3000/chat/allConversations?user_id=u1"
