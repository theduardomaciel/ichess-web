import { env } from "@ichess/env";
import { faker } from "@faker-js/faker";

import { neon, type NeonQueryFunction } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

import {
	ace,
	event,
	eventTypes,
	period,
	user,
	member,
	userCourses,
	memberRoles,
	memberExperiences,
	userPeriods,
	memberOnEvent,
} from "./schema";

import * as schema from "./schema";

const connection = neon(env.DATABASE_URL);
const db = drizzle(connection as NeonQueryFunction<boolean, boolean>, {
	schema,
});

export async function seedAces() {
	const data: (typeof ace.$inferInsert)[] = [];

	for (let i = 0; i < 10; i++) {
		data.push({
			id: i,
			hours: faker.number.int({ min: 10, max: 25 }),
			name: faker.lorem.sentence({ min: 3, max: 6 }).slice(0, -1),
			description: faker.lorem.paragraph({ min: 1, max: 3 }),
			projectId: env.PROJECT_ID,
		});
	}

	console.log("🌱 Semeando o banco de dados... [Ace]");
	await db.insert(ace).values(data);
	console.log("✅ Banco de dados semeado com Aces!");
}

export async function seedPeriods() {
	const data: (typeof period.$inferInsert)[] = [];

	const semester = Math.random() > 0.5 ? "1" : "2";

	for (let i = 0; i < 10; i++) {
		data.push({
			slug: `202${i}.${semester}`,
			from: faker.date.recent({ days: 365 }),
			to: faker.date.future({ years: 1 }),
		});
	}

	console.log("🌱 Semeando o banco de dados... [Period]");
	await db.insert(period).values(data);
	console.log("✅ Banco de dados semeado com períodos!");
}

const usersData = require("./data.json");
/* 
{
	'Carimbo de data/hora': '15/02/2024 15:12:53',
	'Endereço de e-mail': 'jvgs@ic.ufal.br',
	'Nome completo': 'João Victor Gomes dos Santos',
	'Número de matrícula': 22111439,
	Curso: 'Ciência da Computação',
	'Período': '4º Período',
	'Nick Chess.com': 'T_Krampus',
	'Você já faz parte dos grupos do IChess? (WhatsApp e Discord)': 'Não'
}
*/

export async function seedUsersAndMembers() {
	const data: (typeof user.$inferInsert)[] = [];
	const memberData: (typeof member.$inferInsert)[] = [];

	for (const userData of usersData) {
		const email = userData["Endereço de e-mail"];

		const randomExperience =
			memberExperiences[Math.floor(Math.random() * memberExperiences.length)];

		data.push({
			id: faker.string.uuid(),
			name: userData["Nome completo"],
			email,
			emailVerified: faker.date.recent(),
			image: "https://i.imgur.com/PhloUna.png",
			course: userData.Curso === "Ciência da Computação" ? "cc" : "ec",
			registrationId: userData["Número de matrícula"],
			period: userData.Período.split(" ")[0].slice(0, 1),
		});

		memberData.push({
			userId: data[data.length - 1].id as string,
			projectId: env.PROJECT_ID,
			username: userData["Nick Chess.com"],
			role: memberRoles["0"],
			experience: randomExperience,
			joinedAt: faker.date.recent(),
		});
	}

	console.log("🌱 Semeando o banco de dados... [User]");
	await db.insert(user).values(data);
	console.log("✅ Banco de dados semeado com usuários!");

	console.log("🌱 Semeando o banco de dados... [Member]");
	await db.insert(member).values(memberData);
	console.log("✅ Banco de dados semeado com membros!");
}

export async function seedEvents() {
	const data: (typeof event.$inferInsert)[] = [];

	for (let i = 0; i < 20; i++) {
		const randomType =
			eventTypes[Math.floor(Math.random() * eventTypes.length)];

		data.push({
			name: faker.lorem.words(),
			description: faker.lorem.paragraph(),
			dateFrom: faker.date.recent(),
			dateTo: faker.date.future(),
			type: randomType,
			aceId: faker.number.int({ min: 0, max: 9 }),
			projectId: env.PROJECT_ID,
		});
	}

	console.log("🌱 Semeando o banco de dados... [Event]");
	await db.insert(event).values(data);
	console.log("✅ Banco de dados semeado com eventos!");
}

export async function seedMembersOnEvents() {
	const members = await db.query.member.findMany({
		where(fields, { eq }) {
			return eq(fields.projectId, env.PROJECT_ID);
		},
	});

	const events = await db.query.event.findMany({
		where(fields, { eq }) {
			return eq(fields.projectId, env.PROJECT_ID);
		},
	});

	const data: (typeof memberOnEvent.$inferInsert)[] = [];

	for (const event of events) {
		for (const member of members) {
			if (Math.random() > 0.5) {
				data.push({
					memberId: member.id as string,
					eventId: event.id as string,
				});
			}
		}
	}

	console.log("🌱 Semeando o banco de dados... [MemberOnEvent]");
	await db.insert(memberOnEvent).values(data);
	console.log("✅ Banco de dados semeado com membros em eventos!");
}

export async function seed() {
	/* await seedAces();
	await seedPeriods(); */
	await seedUsersAndMembers();
	await seedEvents();
	await seedMembersOnEvents();
}

seed().catch((error) => {
	console.error("❌ Erro ao semear o banco de dados:", error);
	process.exit(1);
});
