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
    "id": string,           primary key
    "user_id": string,      who owns the chat
    "session_id": string,   chat grouping
    "sender": string,       "user" or "bot" 
    "message": string,      the content
    "created_at": Timestamp time of message send
}