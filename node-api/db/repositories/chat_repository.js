const db = require("../knex");

async function saveChatMessageToDB({
	user_id,
	session_id,
	sender,
	message,
}) {
	// Validate sender explicitly
	if (
		["user", "bot"].includes(sender) ===
		false
	) {
		throw new Error(
			"Invalid sender type",
		);
	}

	// validate required fields
	if (
		!user_id ||
		!session_id ||
		!message
	) {
		throw new Error(
			"Missing required fields",
		);
	}

	// insert chat message into the database
	await db("chats").insert({
		user_id,
		session_id,
		sender,
		message,
	});

	await db("chat_sessions")
		.where({ id: session_id })
		.update({
			updated_at: db.fn.now(),
		});
}

async function getConversationAsc(
	user_id,
	session_id,
) {
	// validate required fields
	if (!user_id || !session_id) {
		throw new Error(
			"Missing required fields",
		);
	}

	// fetch all chat messages for the given user and session
	const messages = await db("chats")
		.where({
			user_id,
			session_id,
		})
		.orderBy("timestamp", "asc");

	return messages;
}

async function getConversationDesc(
	user_id,
	session_id,
) {
	// validate required fields
	if (!user_id || !session_id) {
		throw new Error(
			"Missing required fields",
		);
	}

	// fetch all chat messages for the given user and session
	const messages = await db("chats")
		.where({
			user_id,
			session_id,
		})
		.orderBy("timestamp", "desc");

	return messages;
}

async function getAllConversations(
	user_id,
) {
	// validate required fields
	if (!user_id) {
		throw new Error(
			"Missing required fields",
		);
	}

	// fetch all chat messages for the given user and session
	const messages = await db("chats")
		.where({
			user_id,
		})
		.orderBy("session_id", "asc");

	return messages;
}

module.exports = {
	saveChatMessageToDB,
	getConversationAsc,
	getConversationDesc,
	getAllConversations,
};
