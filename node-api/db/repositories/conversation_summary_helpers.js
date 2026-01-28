const db = require("../knex");

// Fetches the summary for a given user and session
async function getSummary(
	user_id,
	session_id,
) {
	return await db(
		"conversation_summaries",
	)
		.where({ user_id, session_id })
		.first();
}

// Inserts or updates the summary for a given user and session
async function upsertSummary(
	user_id,
	session_id,
	summary,
) {
	return await db(
		"conversation_summaries",
	)
		.insert({
			user_id,
			session_id,
			summary,
		})
		.onConflict([
			"user_id",
			"session_id",
		])
		.merge({
			summary,
			updated_at: db.fn.now(),
		});
}

module.exports = {
	getSummary,
	upsertSummary,
};
