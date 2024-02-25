import { env } from "@ichess/env";
import { neon, neonConfig, NeonQueryFunction } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { migrate } from "drizzle-orm/neon-http/migrator";

neonConfig.fetchConnectionCache = true;

const connection = neon(env.DATABASE_URL, {
	// ...neonConfig,
	// logger: console,
});
const db = drizzle(connection as NeonQueryFunction<boolean, boolean>);

migrate(db, { migrationsFolder: __dirname.concat("/migrations") }).then(() => {
	console.log("Migrations applied successfully!");
});
