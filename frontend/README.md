In charge of all of frontend.

- UI and UX
- calling Node.js to pass info

In scope:

- user sends message to bot
- response is sent back to the user
- user can create new chat sessions
- user can view previous chat sessions
- must be pure HTML and CSS

JSON Strucutre:
{
"id": string, primary key
"user_id": string, who owns the chat
"session_id": string, chat grouping
"sender": string, "user" or "bot"
"message": string, the content
"timestamp": Timestamp time of message send
}
