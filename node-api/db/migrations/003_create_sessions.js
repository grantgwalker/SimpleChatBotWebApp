exports.up = async function (knex) {
	await knex.schema.createTable(
		"chat_sessions",
		(table) => {
			table.string("id").primary(); // uuid

			table
				.string("user_id")
				.notNullable();

			table
				.string("title")
				.notNullable();

			table
				.timestamp("created_at")
				.defaultTo(knex.fn.now());

			table
				.timestamp("updated_at")
				.defaultTo(knex.fn.now());

			table.index(["user_id"]);
		},
	);
};

exports.down = async function (knex) {
	await knex.schema.dropTableIfExists(
		"chat_sessions",
	);
};
