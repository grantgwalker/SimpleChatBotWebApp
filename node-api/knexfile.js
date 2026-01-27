/** @type {import('knex').Knex.Config} */
require("dotenv").config();

module.exports = {
	development: {
		client: "pg",
		connection: {
			host: process.env.HOST,
			port: process.env.PORT,
			user: process.env.USER,
			password: process.env.PASSWORD,
			database: process.env.DATABASE,
		},
		migrations: {
			directory: "./db/migrations",
		},
	},
};
