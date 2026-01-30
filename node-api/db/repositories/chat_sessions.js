const db = require("../knex");
const {
	randomUUID,
} = require("crypto");

// Create a new chat session
async function createChatSession(
	db,
	user_id,
) {
	const session_id = randomUUID();
	await db("chat_sessions").insert({
		id: session_id,
		user_id,
		title: "New Chat Session",
	});
	return session_id;
}

// Get all chat sessions for a user
async function getChatSessions(
	db,
	user_id,
) {
	const sessions = await db(
		"chat_sessions",
	)
		.where({ user_id })
		.orderBy("updated_at", "desc");
	return sessions;
}

module.exports = {
	createChatSession,
	getChatSessions,
};
