import { env } from "@ichess/env";
import { faker } from "@faker-js/faker";

import { neon, NeonQueryFunction } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

import { ace, event } from "./schema";

const connection = neon(env.DATABASE_URL);
const db = drizzle(connection as NeonQueryFunction<boolean, boolean>);

export async function seedAces() {
	const data: (typeof ace.$inferInsert)[] = [];

	for (let i = 0; i < 10; i++) {
		data.push({
			id: i,
			hours: faker.number.int({ min: 10, max: 25 }),
			description: faker.lorem.sentence({ min: 3, max: 6 }),
			projectId: env.ICHESS_ID,
		});
	}

	console.log("🌱 Semeando o banco de dados... [Ace]");
	await db.insert(ace).values(data);
	console.log("✅ Banco de dados semeado com Aces!");
}

type EventTypes = "internal" | "external";

export async function seedEvents() {
	const data: (typeof event.$inferInsert)[] = [];

	const types = ["internal", "external", undefined] as EventTypes[];

	for (let i = 0; i < 20; i++) {
		const randomType = types[
			Math.floor(Math.random() * types.length)
		] as EventTypes;

		data.push({
			name: faker.lorem.words(),
			description: faker.lorem.paragraph(),
			dateFrom: faker.date.recent(),
			dateTo: faker.date.future(),
			type: randomType,
			aceId: faker.number.int({ min: 0, max: 9 }),
			projectId: env.ICHESS_ID,
		});
	}

	console.log("🌱 Semeando o banco de dados... [Event]");
	await db.insert(event).values(data);
	console.log("✅ Banco de dados semeado com eventos!");
}

// seedAces();
seedEvents();
