exports.up = async function (knex) {
	await knex.schema.createTable(
		"chats",
		(table) => {
			table.increments("id").primary();
			table
				.string("user_id")
				.notNullable();
			table
				.string("session_id")
				.notNullable();

			// Enforce enum of 'user' and 'bot'
			table
				.enu(
					"sender",
					["user", "bot"],
					{
						userNative: true,
						enumName: "chat_sender",
					},
				)
				.notNullable();
			table
				.text("message")
				.notNullable();
			table
				.timestamp("timestamp")
				.defaultTo(knex.fn.now())
				.notNullable();

			table.index([
				"user_id",
				"session_id",
			]);
		},
	);
};

exports.down = async function (knex) {
	await knex.schema.dropTableIfExists(
		"chats",
	);
	await knex.raw(
		"DROP TYPE IF EXISTS chat_sender;",
	);
};
