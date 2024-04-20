import { Metadata } from "next";
import { Suspense } from "react";

// Icons
import AccountIcon from "@/public/icons/account.svg";

// Components
import { Hero } from "@/components/Hero";
import { NotLogged } from "@/components/auth/NotLogged";
import { SearchBar } from "@/components/dashboard/SearchBar";
import { PagesDisplay } from "@/components/Pagination";
import { MemberGuestPreview } from "@/components/members/MemberPreview";

// API
import { env } from "@ichess/env";
import { auth } from "@ichess/auth";

import { serverClient } from "@/lib/trpc/server";

// Validation;
import { z } from "zod";
import { getMembersParams } from "@ichess/api/routers/members";
import { memberRoles } from "@ichess/drizzle/schema";

export const metadata: Metadata = {
	title: "Membros",
	description: "Veja os membros integrantes do IChess",
};

const membersPageParams = getMembersParams.partial().extend({
	r: z.string().optional(),
	role: z.enum(["any", ...memberRoles]).optional(),
});

type MembersPageParams = z.infer<typeof membersPageParams>;

export default async function LandingMembers({
	searchParams,
}: {
	searchParams: MembersPageParams;
}) {
	const { page, pageSize, search, role, r } =
		membersPageParams.parse(searchParams);

	const session = await auth();
	const isAuthenticated = session && !!session.user.member?.role;

	const { members, pageCount } = await serverClient.getMembers({
		projectId: env.PROJECT_ID,
		page,
		pageSize,
		search,
		role: role === "any" ? undefined : role,
	});

	const { periods } = await serverClient.getPeriods();

	return (
		<>
			<Hero
				title="Lista de Membros"
				description="Acompanhe a lista de atuais membros do IChess"
				outro={"2024.2"}
				buttonProps={{
					href: `/members/${session?.user.member?.id}`,
					title: "Ver meu perfil",
					icon: AccountIcon,
				}}
			/>
			<main className="flex min-h-screen flex-col items-start justify-start gap-6 px-wrapper py-[calc(var(--wrapper)/2)]">
				{!isAuthenticated ? (
					<NotLogged>
						É membro do IChess e deseja acompanhar os eventos
						participados, verificar sua quantidade de horas ou
						visitar o perfil de outros membros? Entre já na
						plataforma com seu e-mail institucional!
					</NotLogged>
				) : null}
				<div className="flex w-full flex-row items-center justify-between">
					<SearchBar placeholder="Pesquisar membros" key={r} />
				</div>
				<Suspense>
					<ul className="mb-auto grid w-full grid-cols-2 gap-4">
						{members &&
							members.map((member) => {
								return (
									<MemberGuestPreview
										key={member.id}
										member={member}
										periodSlug={
											periods.find(
												(period) =>
													period.from <=
														member.joinedAt &&
													period.to >=
														member.joinedAt,
											)?.slug
										}
									/>
								);
							})}
					</ul>
				</Suspense>
				<PagesDisplay currentPage={page || 1} pageCount={pageCount} />
			</main>
		</>
	);
}
