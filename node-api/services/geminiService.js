require("dotenv").config();
const {
	GoogleGenerativeAI,
} = require("@google/generative-ai");
const {
	getConversation,
} = require("../db/repositories/chat_repository");

const genAI = new GoogleGenerativeAI(
	process.env.GEMINI_API_KEY,
);

const model = genAI.getGenerativeModel({
	model: "gemini-2.5-flash",
});

async function getGeminiAIResponse(
	user_id,
	session_id,
	sender,
	message,
) {
	console.log(
		"--- AI SERVICE LEVEL ---",
	);
	console.log(
		`Body: ${JSON.stringify({ user_id, session_id, sender, message })}`,
	);
	/**
	 * messages format:
	 *  [
	 *  { sender: "user" | "bot", message: "text", ... },
	 *  ...
	 *  ]
	 *
	 */
	const systemPrompt =
		"You are a helpful AI assistant on the web. \n\n";
	const context = await getContext(
		user_id,
		session_id,
	);

	const prompt = `${systemPrompt} ${sender}: ${message} \n\nContext:\n${context}`;

	const result =
		await model.generateContent(prompt);
	return result;
}

async function getContext(
	user_id,
	session_id,
) {
	context = await getConversation(
		user_id,
		session_id,
	);

	let messagesForContext = context
		.map(
			(msg) =>
				`${msg.sender}: ${msg.message}`,
		)
		.join("\n");
	return messagesForContext;
}

module.exports = {
	getGeminiAIResponse,
};
