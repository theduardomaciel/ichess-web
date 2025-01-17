import { Fragment, Suspense } from "react";
import type { Metadata } from "next";

// Icons
import AccountIcon from "@/public/icons/account.svg";

// Components
import { Hero } from "@/components/Hero";
import { Wrapper } from "@/components/Wrapper";
import { NotLogged } from "@/components/auth/LoginStatus";
import { SearchBar } from "@/components/dashboard/SearchBar";
import { PagesDisplay } from "@/components/Pagination";
import { MemberGuestPreview } from "@/components/members/MemberPreview";
import { Filter } from "@/components/dashboard/filters/Filter";

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

export default async function LandingMembers(
    props: {
        searchParams: Promise<MembersPageParams>;
    }
) {
    const searchParams = await props.searchParams;
    const { page, pageSize, search, role, r } =
		membersPageParams.parse(searchParams);

    const session = await auth();
    const isMember = session && !!session.member?.role;

    const { members, pageCount } = await serverClient.getMembers({
		projectId: env.PROJECT_ID,
		page,
		pageSize,
		search,
		role: role === "any" ? undefined : role,
	});

    const { periods } = await serverClient.getPeriods();

    return (
		<Fragment>
			<Hero
				title="Lista de Membros"
				description="Acompanhe a lista de atuais membros do IChess"
				preTitle={"2024.2"}
				buttonProps={
					isMember
						? {
							href: `/members/${session?.member?.id}`,
							title: "Ver meu perfil",
							icon: AccountIcon,
							scroll: false,
						}
						: undefined
				}
			/>
			<Wrapper>
				{!isMember ? (
					<NotLogged className="mb-8" isAuthenticated={!!session} href="/join">
						É membro do IChess e deseja acompanhar os eventos participados,
						verificar sua quantidade de horas ou visitar o perfil de outros
						membros? Entre já na plataforma com seu e-mail institucional!
					</NotLogged>
				) : null}
				<div className="flex w-full flex-col items-start justify-start gap-4 sm:flex-row sm:gap-9">
					<SearchBar key={r} placeholder="Pesquisar membros" />
					<Filter
						type="select"
						items={[
							{ value: "any", name: "Qualquer um" },
							{ value: "member", name: "Membro" },
							{ value: "admin", name: "Moderador" },
						]}
						prefix="role"
						title="Filtrar por cargo"
						className="flex-row items-center"
						config={{
							placeholder: "Qualquer um",
							className: "w-40",
						}}
					/>
				</div>
				<Suspense>
					<ul className="mb-auto flex w-full grid-cols-2 flex-col gap-4 md:grid">
						{members.map((member) => {
							return (
								<MemberGuestPreview
									key={member.id}
									member={member}
									periodSlug={
										periods.find(
											(period) =>
												period.from <= member.joinedAt &&
												period.to >= member.joinedAt,
										)?.slug
									}
									isMember={isMember}
								/>
							);
						})}
					</ul>
				</Suspense>
				<PagesDisplay currentPage={page || 1} pageCount={pageCount} />
			</Wrapper>
		</Fragment>
	);
}
