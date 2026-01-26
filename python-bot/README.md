In charge of processing api requests. 
- creates and delivers a response from user input

In scope: 
- user sends message to bot
- response is sent back to the user
- user can create new chat sessions
- user can view previous chat sessions
- must be pure python


| Column     | Purpose                            |
| ---------- | ---------------------------------- |
| id         | Primary key                        |
| user_id    | Who owns the chat                  |
| session_id | Browser/session grouping           |
| chat_id    | Optional logical grouping (thread) |
| sender     | `"user"` or `"bot"`                |
| message    | The text content                   |
| created_at | Timestamp                          |

JSON Strucutre: 
{ 
    "id": string,           primary key
    "user_id": string,      who owns the chat
    "session_id": string,   chat grouping
    "sender": string,       "user" or "bot" 
    "message": string,      the content
    "created_at": Timestamp time of message send
}
