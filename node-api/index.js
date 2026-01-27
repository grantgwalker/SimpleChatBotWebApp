const express = require("express");
const axios = require("axios");
const chatRouter = require("./routes/chat");

const app = express();
app.use(express.json()); // parse JSON request bodies\

// debugging middleware
app.use((req, res, next) => {
	console.log("--- APP LEVEL ---");
	console.log(
		`Request Method: ${req.method}`,
	);
	console.log(
		`Request URL: ${req.url}`,
	);
	console.log(
		`Header: ${JSON.stringify(req.headers)}`,
	);
	console.log(
		`Body: ${JSON.stringify(req.body)}`,
	);
	next();
});

const PORT = 3000;

app.listen(PORT, () => {
	console.log(
		`Server is running on port ${PORT}`,
	);
});

app.get("/health", (req, res) => {
	res.json({ status: "healthy" });
});

// mount chatRouter function to handle /chat routes
app.use("/chat", chatRouter);

app.use((err, req, res, next) => {
	console.error(
		"Unhandled error:",
		err,
	);
	res.status(500).json({
		error: "Internal server error",
	});
});
