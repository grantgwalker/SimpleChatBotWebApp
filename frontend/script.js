const PORT = 4000;
const API_BASE_URL = `http://localhost:${PORT}`;

const chatwindow =
	document.getElementById(
		"chat-window",
	);
const userInput =
	document.getElementById("user-input");
const sendButton =
	document.getElementById(
		"send-button",
	);

// generate a session ID for the page load
let sessionId = generateSessionId();
let userID = getUserID();

function generateSessionId() {
	return "s1";
}

function getUserID() {
	return "u1";
}

// Render a message to the chat window
function renderMessage(
	message,
	sender,
) {
	const messageElement =
		document.createElement("div");
	messageElement.classList.add(
		"message",
		sender,
	);
	messageElement.innerText = message;
	chatwindow.appendChild(
		messageElement,
	);
	chatwindow.scrollTop =
		chatwindow.scrollHeight;
}

// Fetch conversation history from the server
async function fetchConversationHistory() {
	console.log(
		"Fetching conversation history...",
	);
	try {
		const response = await fetch(
			`${API_BASE_URL}/chat/conversation?user_id=${userID}&session_id=${sessionId}`,
		);
		console.log(
			"Response received for conversation history",
		);
		const data = await response.json();
		console.log(
			`This is the parsed JSON of the conversation history: ${JSON.stringify(data)}`,
		);
		data.forEach((msg) => {
			renderMessage(
				msg.message,
				msg.sender,
			);
		});
	} catch (error) {
		console.error(
			"Error fetching conversation history:",
			error,
		);

		renderMessage(
			"Error loading conversation history.",
			"bot",
		);
	}
}

// send message
async function sendMessage() {
	const message =
		userInput.value.trim();
	if (message === "") return;

	// Render user message
	renderMessage(message, "user");

	try {
		const response = await fetch(
			`${API_BASE_URL}/chat`,
			{
				method: "POST",
				headers: {
					"Content-Type":
						"application/json",
				},
				body: JSON.stringify({
					user_id: userID,
					session_id: sessionId,
					message: message,
				}),
			},
		);
		const data = await response.json();

		// Render bot response
		renderMessage(data.response, "bot");
	} catch (error) {
		console.error(
			"Error sending message:",
			error,
		);
		renderMessage(
			"Sorry, I am having issues right now. Please try again.",
			"bot",
		);
	}

	userInput.value = "";
}

sendButton.addEventListener(
	"click",
	sendMessage,
);

userInput.addEventListener(
	"keypress",
	function (e) {
		if (e.key === "Enter") {
			sendMessage();
		}
	},
);

// Load conversation history on page load
window.onload =
	fetchConversationHistory;
