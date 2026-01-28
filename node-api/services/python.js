const axios = require("axios");
const { response } = require("express");
require("dotenv").config();

async function sendMessageToPythonAIBot(
	message,
) {
	const controller =
		new AbortController();
	const timeout = setTimeout(
		() => controller.abort(),
		process.env.TIMEOUT_MS,
	);

	const bot_error_response =
		"I am unavailable right now. Please try again later.";

	try {
		response = await axios.post(
			process.env.PYTHON_SERVICE_URL_AI,
			{ message },
			{ signal: controller.signal },
		);

		if (!response) {
			throw new Error(
				`Python service error: ${response}`,
			);
		}
		return response.data;
	} catch (error) {
		console.error(
			"Error communicating with Python AI bot:",
			error,
		);
		return bot_error_response;
	} finally {
		clearTimeout(timeout);
	}
}

async function sendMessageToPythonBot(
	message,
) {
	const controller =
		new AbortController();
	const timeout = setTimeout(
		() => controller.abort(),
		process.env.TIMEOUT_MS,
	);

	const bot_error_response =
		"I am unavailable right now. Please try again later.";

	try {
		const response = await axios.post(
			process.env.PYTHON_SERVICE_URL,
			{ message },
			{ signal: controller.signal },
		);

		if (!response) {
			throw new Error(
				`Python service error: ${response}`,
			);
		}
		return response.data;
	} catch (error) {
		console.error(
			"Error communicating with Python bot:",
			error,
		);
		return bot_error_response;
	} finally {
		clearTimeout(timeout);
	}
}

module.exports = {
	sendMessageToPythonBot,
	sendMessageToPythonAIBot,
};
