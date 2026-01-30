require("dotenv").config();
const {
	GoogleGenerativeAI,
} = require("@google/generative-ai");
const {
	getConversationDesc,
} = require("../db/repositories/chat_repository");
const {
	getSummary,
	upsertSummary,
} = require("../db/repositories/conversation_summary_helpers");

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

	// build the prompt with system instructions and context
	const systemPrompt =
		"You are a helpful AI assistant on the web. \n\n";
	const context = await getContext(
		user_id,
		session_id,
	);
	// final prompt to send to the model
	// \n\nHere is previous chat history for context:\n${context}
	const prompt = `${systemPrompt} Please answer the following message from the user: ${sender}: ${message} \n\nHere is previous chat history for context:\n${context}`;

	console.log("Final Prompt:", prompt);
	// generate response from the AI model
	const result =
		await model.generateContent(prompt);
	return result;
}

// summarizes the given messages using the AI model
async function summarizeConversation(
	messages,
) {
	const summaryPrompt = `Summarize the following conversation 
    Focus On: 
    - user intent 
    - important details and facts
    - ongoing goals
    - open questions 
    Write in 3-6 bullet points 
    
    Conversation:\n${messages}`;

	const summaryResult =
		await model.generateContent(
			summaryPrompt,
		);

	console.log(
		"Summary Success:",
		summaryResult,
	);
	return summaryResult;
}

// builds the context for the AI model
async function getContext(
	user_id,
	session_id,
) {
	entireSession =
		await getConversationDesc(
			user_id,
			session_id,
		);

	// check if we need to summarize and upserts if needed
	await determineSummary(
		user_id,
		session_id,
		entireSession,
	);

	// get updated summary after possible upsert
	const summary = await getSummary(
		user_id,
		session_id,
	);

	// build context with recent messages and summary
	context = [];

	// get recent messages
	messagesBeforeSummarization =
		entireSession.slice(
			0,
			process.env
				.CHAT_RECENT_MESSAGE_COUNT,
		);

	context.push(
		...messagesBeforeSummarization,
	);

	console.log(
		"Using summary:",
		!!summary,
	);
	// include summary in the context if it exists
	if (summary) {
		context.push({
			sender: "system",
			message: `Conversation Summary: ${summary.summary}`,
		});
	}

	// format messages for context for the prompt
	let messagesForContext = context
		.map(
			(msg) =>
				`${msg.sender}: ${msg.message}`,
		)
		.join("\n");

	return messagesForContext;
}

// decides whether to summarize the conversation
// and performs the summarization and upserts if needed
async function determineSummary(
	user_id,
	session_id,
	entireSession,
) {
	if (
		entireSession.length >
		process.env.CHAT_SUMMARY_THRESHOLD
	) {
		// summarize the messages beyond our recent messages.
		// we want to keep the most recent messages intact for context.
		messagesToSummarize =
			entireSession.slice(
				process.env
					.CHAT_SUMMARY_THRESHOLD -
					process.env
						.CHAT_RECENT_MESSAGE_COUNT,
				process.env
					.CHAT_SUMMARY_THRESHOLD,
			);

		messagesToSummarizeFormatted =
			messagesToSummarize
				.map(
					(msg) =>
						`${msg.sender}: ${msg.message}`,
				)
				.join("\n");
		summary =
			await summarizeConversation(
				messagesToSummarizeFormatted,
			);
		await upsertSummary(
			user_id,
			session_id,
			summary,
		);
	} else {
		console.log(
			"No summarization needed.",
		);
		return null;
	}
}

module.exports = {
	getGeminiAIResponse,
	summarizeConversation,
};
