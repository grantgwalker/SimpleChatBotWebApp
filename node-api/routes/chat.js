const express = require("express");
const router = express.Router();
const {
	sendMessageToPythonBot,
} = require("../services/python");

const {
	saveChatMessageToDB,
	getConversation,
	getAllConversations,
} = require("../db/repositories/chat_repository");

// debugging middleware for chat router
router.use((req, res, next) => {
	console.log(
		"--- CHAT ROUTER LEVEL ---",
	);
	console.log(
		`Body: ${JSON.stringify(req.body)}`,
	);
	next();
});

// -----------------GET MESSAGES-----------------
router.get(
	"/conversation",
	async (req, res) => {
		const { user_id, session_id } =
			req.query;

		// validate user_id
		if (
			!user_id ||
			typeof user_id !== "string"
		) {
			return res.status(400).json({
				error:
					"user_id must be a nonempty string",
			});
		}

		// validate session_id
		if (
			!session_id ||
			typeof session_id !== "string"
		) {
			return res.status(400).json({
				error:
					"session_id must be a nonempty string",
			});
		}

		console.log(
			`Fetching conversation for user_id: ${user_id}, session_id: ${session_id}`,
		);
		// fetch conversation from database
		try {
			const conversation =
				await getConversation(
					user_id,
					session_id,
				);
			console.log(
				`Conversation fetched: ${JSON.stringify(
					conversation,
				)}`,
			);
			res.json(conversation);
		} catch (error) {
			console.error(
				"Error fetching conversation:",
				error,
			);
			res.status(500).json({
				error: "Internal server error",
			});
		}
	},
);

router.get(
	"/allConversations",
	async (req, res) => {
		// This endpoint is for debugging purposes only
		// In production, you would not expose all conversations
		const { user_id } = req.query;

		// validate user_id
		if (
			!user_id ||
			typeof user_id !== "string"
		) {
			return res.status(400).json({
				error:
					"user_id must be a nonempty string",
			});
		}
		try {
			const conversations =
				await getAllConversations(
					user_id,
				);
			res.json(conversations);
		} catch (error) {
			console.error(
				"Error fetching conversations:",
				error,
			);
			res.status(500).json({
				error: "Internal server error",
			});
		}
	},
);

// -----------------POST MESSAGES-----------------

router.post("/", async (req, res) => {
	// debugging logs for handler
	console.log("--- HANDLER LEVEL ---");
	console.log(
		`Body: ${JSON.stringify(req.body)}`,
	);

	// process the incoming message
	const {
		message,
		user_id,
		session_id,
	} = req.body;

	// validate user_id
	if (
		!user_id ||
		typeof user_id !== "string"
	) {
		return res.status(400).json({
			error:
				"user_id must be a nonempty string",
		});
	}
	// validate session_id
	if (
		!session_id ||
		typeof session_id !== "string"
	) {
		return res.status(400).json({
			error:
				"session_id must be a nonempty string",
		});
	}

	// validate message
	if (
		!message ||
		typeof message !== "string" ||
		message.length === 0
	) {
		return res.status(400).json({
			error:
				"Message must be a nonempty string",
		});
	}

	// save message to database
	try {
		await saveChatMessageToDB({
			user_id,
			session_id,
			sender: "user",
			message,
		});

		console.log(
			"User message saved to DB",
		);
	} catch (error) {
		console.error(
			"Error saving user message to DB:",
			error,
		);
	}

	// send message to Python bot
	try {
		const { response } =
			await sendMessageToPythonBot(
				message,
			);

		// save bot response to database
		try {
			await saveChatMessageToDB({
				user_id,
				session_id,
				message: response,
				sender: "bot",
			});
			console.log(
				"Bot message saved to DB",
			);
		} catch (error) {
			console.error(
				"Error saving bot message to DB:",
				error,
			);
		}

		// respond to client
		res.json({ response });
	} catch (error) {
		console.error(
			"Error communicating with Python bot:",
			error,
		);
		res.status(500).json({
			error: "Internal server error",
		});
	}
});

module.exports = router;
