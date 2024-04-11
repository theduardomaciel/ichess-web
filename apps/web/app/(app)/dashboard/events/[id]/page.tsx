import Image from "next/image";

import { cn } from "@/lib/utils";

// Icons
import PersonCheckIcon from "@/public/icons/person_check.svg";
import EditIcon from "@/public/icons/edit.svg";
import AccountIcon from "@/public/icons/account.svg";
import BlockIcon from "@/public/icons/block.svg";

// Components
import { Button } from "@/components/ui/button";
import { AceCard } from "@/components/dashboard/AceCard";
import { AddParticipant } from "@/components/dashboard/AddParticipant";
import { DateDisplay } from "@/components/ui/calendar";

// Utils
import { ACEs } from "@/lib/validations/AddEventForm";
import { CodeGenerator } from "@/components/dashboard/CodeGenerator";

const members = [
	{
		id: "22210633",
		name: "Fulano da Silva",
		avatar: `https://github.com/marquinhos.png`,
		username: "theduardomaciel",
	},
];

export default function EventPage() {
	return (
		<main className="flex min-h-screen flex-col items-start justify-start px-wrapper py-12 gap-12">
			<div className="flex flex-col items-start justify-start w-full gap-4">
				<div className="flex flex-row flex-wrap items-start justify-between gap-4 w-full">
					<h1 className="text-neutral text-5xl md:text-6xl font-extrabold font-title max-w-full lg:max-w-[60%]">
						XVI Reunião Semanal do Clube
					</h1>
					<span className="text-foreground text-base font-semibold opacity-50">
						#817294
					</span>
				</div>
				<div className="flex flex-row items-center justify-start gap-4">
					<DateDisplay dateString="14:00 às 15:20" />
					<div className="w-1 h-1 bg-neutral rounded-full" />
					<p className="text-base font-medium">14:00 às 15:20</p>
				</div>
				<h2 className="text-neutral text-base font-semibold leading-normal">
					Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
					do eiusmod tempor incididunt ut labore et dolore magna
					aliqua. Ut enim ad minim veniam, quis nostrud exercitation
					ullamco laboris nisi ut aliquip ex ea commodo consequat.
					Duis aute irure dolor in reprehenderit in voluptate velit
					esse cillum dolore eu fugiat nulla pariatur.
				</h2>
			</div>
			<div className="flex flex-col md:flex-row items-center justify-start w-full gap-4">
				<AceCard className="w-full" ace={ACEs[0]} />
				<div className="flex flex-row items-center justify-between max-sm:w-full gap-4">
					<Button
						size={"icon"}
						className="bg-info-100 hover:bg-info-200 ring-info-200"
					>
						<EditIcon className="w-5 h-5" />
					</Button>
					<CodeGenerator />
				</div>
			</div>
			<div className="flex flex-col md:flex-row items-start justify-start w-full gap-12">
				<div className="flex flex-col items-center justify-start w-full md:w-3/5 gap-4">
					<MembersList members={members} />
					<AddParticipant members={members} />
				</div>
				<MembersList
					className="md:w-2/5"
					members={members}
					isResponsible
				/>
			</div>
		</main>
	);
}

interface MembersListProps {
	className?: string;
	isResponsible?: boolean;
	members: any[];
	onRemove?: (id: string) => void;
	onAdd?: () => void;
	onEdit?: (id: string) => void;
}

function MembersList({
	className,
	isResponsible = false,
	members,
	onRemove,
	onAdd,
	onEdit,
}: MembersListProps) {
	return (
		<div
			className={cn(
				"flex flex-col items-start justify-start w-full gap-4",
				className
			)}
		>
			<h2 className="text-lg font-extrabold font-title text-neutral">
				{isResponsible ? "Responsáveis" : "Membros"}
			</h2>
			<ul className="flex flex-col items-start justify-start gap-4 w-full">
				{members.map((member) => (
					<MemberCard
						key={member.id}
						member={{
							...member,
							role: isResponsible ? "Moderador" : undefined,
						}}
					/>
				))}
			</ul>
		</div>
	);
}

interface MemberCardProps {
	className?: string;
	member?: any;
	onRemove?: () => void;
	onEdit?: () => void;
}

function MemberCard({ className, member, onRemove, onEdit }: MemberCardProps) {
	return (
		<li className="flex flex-col items-start justify-start gap-4 px-6 py-4 rounded-lg border bg-gray-300 w-full">
			<div className="flex flex-row items-center justify-start gap-4">
				<Image
					src={member.image_url}
					width={42}
					height={42}
					alt="Member profile picture"
					className="rounded-full"
				/>
				<div className="flex flex-col items-start justify-start">
					<h3 className="text-left text-base font-bold">
						{member.name}
					</h3>
					<p className="opacity-50 text-xs text-foreground font-semibold">
						#817294
					</p>
				</div>
			</div>
			<div className="flex flex-row items-center justify-between w-full gap-4">
				<div className="flex flex-row items-center justify-start gap-4 text-foreground">
					{!member.role && (
						<PersonCheckIcon className="w-4 h-4 min-w-4 min-h-4 md:min-w-4 md:min-h-4" />
					)}
					<p className="text-sm font-medium text-left leading-tight">
						{member.role ?? "Marcou presença às 14:35"}
					</p>
				</div>
				<div className="flex flex-row items-center justify-end gap-2 md:gap-4">
					<button title="Exibir cartão da conta do membro">
						<AccountIcon className="w-6 h-6" />
					</button>

					{!member.role && (
						<button title="Remover presença do membro">
							<BlockIcon className="w-6 h-6" />
						</button>
					)}
				</div>
			</div>
		</li>
	);
}
