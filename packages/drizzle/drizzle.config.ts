import { env } from "@ichess/env";
import type { Config } from "drizzle-kit";

// console.log(env.DATABASE_URL);

export default {
	schema: "./schema/index.ts",
	out: "./migrations",
	driver: "pg",
	dbCredentials: {
		connectionString: env.DATABASE_URL,
	},
} satisfies Config;
