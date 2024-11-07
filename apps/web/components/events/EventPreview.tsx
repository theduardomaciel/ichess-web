import Image from "next/image";

import { cn } from "@/lib/utils";

// Components
import { DateDisplay } from "@/components/ui/calendar";
import { AceLabel } from "@/components/dashboard/AceCard";

// Types
import type { RouterOutput } from "@ichess/api";

interface Props {
	className?: string;
	event: RouterOutput["getEvents"]["events"][0];
	showModerators?: boolean;
}

export function EventPreview({
	className,
	event,
	showModerators = true,
}: Props) {
	const moderators = event.members.filter((m) => m.role === "admin");
	const moderatorsImages = moderators
		.filter((m) => m.user.image)
		.map((m) => m.user.image)
		.slice(0, 3);

	const lastModerator = moderators.length > 1 ? moderators.pop() : null;

	return (
		<li
			className={cn(
				"flex flex-col items-start justify-start gap-4 rounded-lg bg-gray-300 p-9 outline-gray-200 transition-[background-color,outline] hover:bg-gray-400 hover:outline",
				className,
			)}
		>
			<div className="flex w-full flex-row flex-wrap items-center justify-between gap-2">
				<h3 className="text-left font-title text-lg font-extrabold leading-snug lg:text-xl">
					{event.name}
				</h3>
				<p className="text-xs font-semibold leading-none text-neutral opacity-50 lg:text-base">
					#{event.id.split("-")[0]}
				</p>
			</div>
			<div className="mt-auto flex w-full flex-row flex-wrap items-center justify-between gap-4">
				<p className="text-left text-sm font-medium text-muted lg:text-base">
					{event.description || "[nenhuma descrição provida]"}
				</p>
				<DateDisplay
					dateString={event.dateFrom.toLocaleDateString("pt-BR", {
						year: "numeric",
						month: "2-digit",
						day: "numeric",
					})}
				/>
			</div>
			{showModerators && moderators.length > 0 && (
				<div className="flex w-full flex-row flex-wrap items-center justify-between gap-4 border-t border-t-gray-100 pt-4">
					<div className="flex flex-row items-center justify-start gap-2 max-sm:w-full">
						<ProfileImages image_urls={moderatorsImages} extraLength={moderators.length - 2} />
						<span className="text-left text-sm font-semibold text-neutral">
							Organizado por{" "}
							{moderators.slice(0, 3).map((mod) => mod?.user.name).join(", ")}{" "}
							{lastModerator && "e"} {moderators.length > 3 ? `outros ${moderators.length - 2}` : lastModerator?.user.name}
						</span>
					</div>
					<p className="text-right text-sm font-semibold text-neutral">
						+ de{" "}
						<span className="underline">
							{event.members.length - 1} membro
							{event.members.length - 1 !== 1 && "s"}
						</span>{" "}
						{event.dateTo.getTime() > Date.now()
							? "participando"
							: event.members.length - 1 !== 1
								? "participaram"
								: "participou"}
					</p>
				</div>
			)}
		</li>
	);
}

function ProfileImages({ image_urls, extraLength }: { image_urls: string[], extraLength: number }) {
	return (
		<div className="flex flex-row items-center justify-start">
			{image_urls.map((url, index) => (
				<Image
					src={url}
					alt="Profile Image"
					key={`${url}-${index}`}
					height={24}
					width={24}
					className={cn("h-6 w-6 min-w-6 rounded-full", {
						"-ml-1": index > 0,
					})}
				/>
			))}
			{
				extraLength > 0 && (
					<div className="w-6 h-6 rounded-full bg-gray-200 -ml-1 flex items-center justify-center border border-gray-100">
						<p className="text-xs font-semibold leading-none text-neutral opacity-50">
							+{extraLength}
						</p>
					</div>
				)
			}
		</div>
	);
}
