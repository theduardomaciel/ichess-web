
import type { Metadata } from "next";

// Components
import { MemberPreview } from "@/components/members/MemberPreview";
import { PagesDisplay } from "@/components/Pagination";
import { Empty } from "@/components/Empty";

// Filters and Sorting
import { SearchBar } from "@/components/dashboard/SearchBar";
import { SortBy } from "@/components/dashboard/SortBy";

import { Filters } from "@/components/dashboard/filters";
import { Filter } from "@/components/dashboard/filters/Filter";

// Validation
import { z } from "zod";
import { getMembersParams } from "@ichess/api/routers/members";

// API
import { env } from "@ichess/env";
import { serverClient } from "@/lib/trpc/server";
import { memberRoles } from "@ichess/drizzle/schema";
import { Suspense } from "react";
import UpdateMembersButton from "./UpdateMembersButton";

export const metadata: Metadata = {
	title: "Membros",
	description: "Veja todos os membros cadastrados",
};

const membersPageParams = getMembersParams.partial().extend({
	r: z.string().optional(),
	role: z.enum(["any", ...memberRoles]).optional(),
});

type MembersPageParams = z.infer<typeof membersPageParams>;

export default async function DashboardMembersPage(
	props: {
		searchParams: Promise<MembersPageParams>;
	}
) {
	const searchParams = await props.searchParams;
	const { page, pageSize, search, sortBy, periods, role, r } =
		membersPageParams.parse(searchParams);

	const { members, pageCount } = await serverClient.getMembers({
		projectId: env.PROJECT_ID,
		page,
		pageSize,
		search,
		sortBy,
		periods,
		role: role === "any" ? undefined : role,
	});


	// O "r" equivale ao estado da barra de pesquisa quando o usuário clica em "Limpar filtros"
	// Isso é feito por meio da mudança de key do componente SearchBar

	return (
		<main className="flex min-h-screen flex-col items-start justify-start gap-[var(--wrapper)] px-wrapper py-12 lg:flex-row lg:gap-12">
			<div className="flex flex-1 flex-col items-start justify-center gap-4 w-full">
				<div className="flex w-full flex-col items-start justify-start gap-4 sm:flex-row sm:gap-9">
					<SearchBar key={r} placeholder="Pesquisar membros" />
					<div className="flex flex-row items-center justify-between gap-4 max-sm:w-full sm:justify-end">
						<span className="text-nowrap text-sm font-medium">
							Ordenar por
						</span>
						<SortBy sortBy={sortBy} />
					</div>
				</div>
				{
					<ul className="flex w-full flex-col items-start justify-start gap-4">
						{members && members.length > 0 ? (
							members.map((member) => (
								<MemberPreview
									key={member.id}
									member={member}
									memberCardHref={`/dashboard/members/${member.id}`}
								/>
							))
						) : (
							<Empty href={"/dashboard/members"} />
						)}
					</ul>
				}
				{members && members.length > 0 && (
					<Suspense fallback={null}>
						<PagesDisplay
							currentPage={page || 1}
							pageCount={pageCount}
						/>
					</Suspense>
				)}
			</div>
			<Filters>
				<UpdateMembersButton projectId={env.PROJECT_ID} />
				<Filter
					type={"select"}
					items={[
						{ name: "Qualquer cargo", value: "any" },
						{ name: "Moderador", value: "admin" },
						{ name: "Membro", value: "member" },
					]}
					className="w-full"
					prefix="role"
					title="Filtrar por cargo"
					config={{
						placeholder: "Escolha um cargo",
						className: "w-full",
					}}
				/>
			</Filters>
		</main>
	);
}
