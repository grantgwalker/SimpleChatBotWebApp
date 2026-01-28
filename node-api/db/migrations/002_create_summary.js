exports.up = async function (knex) {
	await knex.schema.createTable(
		"conversation_summaries",
		(table) => {
			table.increments("id").primary();
			table
				.string("user_id")
				.notNullable();
			table
				.string("session_id")
				.notNullable();
			table
				.text("summary")
				.notNullable();
			table
				.timestamp("updated_at")
				.defaultTo(knex.fn.now())
				.notNullable();

			table.unique([
				"user_id",
				"session_id",
			]);
		},
	);
};

exports.down = async function (knex) {
	await knex.schema.dropTableIfExists(
		"conversation_summaries",
	);
};
