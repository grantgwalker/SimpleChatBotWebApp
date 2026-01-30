const express = require("express");
const router = express.Router();

const {
	createChatSession,
	getChatSessions,
} = require("../db/repositories/chat_sessions");

// debugging middleware for chat router
router.use((req, res, next) => {
	console.log(
		"--- SESSION ROUTER LEVEL ---",
	);
	console.log(
		`Body: ${JSON.stringify(req.body)}`,
	);
	next();
});

router.post(
	"/create",
	async (req, res) => {
		const { user_id } = req.body;
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
			const session_id =
				await createChatSession(
					req.db,
					user_id,
				);
			res.json({ session_id });
		} catch (error) {
			console.error(
				"Error creating chat session:",
				error,
			);
			res.status(500).json({
				error: "Internal server error",
			});
		}
	},
);

router.get("/", async (req, res) => {
	const { user_id } = req.query;
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
		const sessions =
			await getChatSessions(
				req.db,
				user_id,
			);
		res.json({ sessions });
	} catch (error) {
		console.error(
			"Error fetching chat sessions:",
			error,
		);
		res.status(500).json({
			error: "Internal server error",
		});
	}
});

module.exports = router;
