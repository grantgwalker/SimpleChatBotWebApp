const axios = require("axios");

const PYTHON_SERVICE_URL =
	"http://127.0.0.1:8000/chat";
const TIMOUT_MS = 5000;

async function sendMessageToPythonBot(
	message,
) {
	const controller =
		new AbortController();
	const timeout = setTimeout(
		() => controller.abort(),
		TIMOUT_MS,
	);

	try {
		const response = await axios.post(
			PYTHON_SERVICE_URL,
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
		throw new Error(
			"Failed to communicate with Python bot",
		);
	} finally {
		clearTimeout(timeout);
	}
}

module.exports = {
	sendMessageToPythonBot,
};
