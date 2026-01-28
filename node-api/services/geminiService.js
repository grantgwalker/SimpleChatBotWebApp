require("dotenv").config();
const {
	GoogleGenerativeAI,
} = require("@google/generative-ai");
const {
	getConversation,
} = require("../db/repositories/chat_repository");
const {
	getSummary,
	upsertSummary,
} = require("../db/repositories/conversation_summary_helpers");

const genAI = new GoogleGenerativeAI(
	process.env.GEMINI_API_KEY,
);

const model = genAI.getGenerativeModel({
	model: "gemini-2.5-flash-lite",
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

async function getContext(
	user_id,
	session_id,
) {
	entireSession = await getConversation(
		user_id,
		session_id,
	);

	await determineSummary(
		user_id,
		session_id,
		entireSession,
	);

	const summary = await getSummary(
		user_id,
		session_id,
	);

	context = [];

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
	if (summary) {
		context.push({
			sender: "system",
			message: `Conversation Summary: ${summary.summary}`,
		});
	}

	console.log(
		"Context size:",
		context.length,
	);

	let messagesForContext = context
		.map(
			(msg) =>
				`${msg.sender}: ${msg.message}`,
		)
		.join("\n");

	console.log(
		"Messages before summarization:",
		messagesBeforeSummarization,
	);
	console.log(
		"Summary:",
		summary
			? summary.summary
			: "No summary",
	);

	return messagesForContext;
}

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

		console.log(
			"Messages to summarize:",
			messagesToSummarize,
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
