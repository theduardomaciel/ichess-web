"use client";

import { forwardRef, useEffect, useState } from "react";
import Image from "next/image";

import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";

// Hooks
import { useMediaQuery } from "@/hooks/use-media-query";
import { useDebounce } from "@/hooks/use-debounce";

// Components
import { Button } from "@/components/ui/button";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
} from "@/components/ui/command";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";

// Types
import type { RouterOutput } from "@ichess/api";

// API
import { trpc } from "@/lib/trpc/react";

type Moderator = RouterOutput["getMembers"]["members"][number];

interface ModeratorFilterParams {
	projectId: string;
	className?: string;
	initialModerators?: string[] | string;
	onSelect?: (moderatorsIds: string[]) => void;
}

export function ModeratorPicker({
	projectId,
	className,
	onSelect,
	initialModerators,
}: ModeratorFilterParams) {
	const [open, setOpen] = useState(false);
	const isDesktop = useMediaQuery("(min-width: 768px)");

	const { data } = trpc.getMembers.useQuery(
		{
			projectId,
			role: "admin",
		},
		{
			staleTime: 5 * 60 * 1000,
		},
	);

	const moderators = data?.members || [];

	const [moderatorsIds, setModeratorsIds] = useState<string[]>(
		initialModerators
			? Array.isArray(initialModerators)
				? initialModerators
				: [initialModerators]
			: [],
	);
	const debouncedValue = useDebounce(moderatorsIds, 750);

	const isActive = (id: string) => moderatorsIds.includes(id);
	const filteredModerators = moderators?.filter((mod) =>
		moderatorsIds.includes(mod.id),
	);

	const handleSelect = (id: string) => {
		if (moderatorsIds.includes(id)) {
			setModeratorsIds(moderatorsIds.filter((modId) => modId !== id));
		} else {
			setModeratorsIds([...moderatorsIds, id]);
		}
	};

	useEffect(() => {
		onSelect?.(debouncedValue);
	}, [debouncedValue, onSelect]);

	if (isDesktop) {
		return (
			<Popover>
				<PopoverTrigger asChild>
					<SelectorTrigger
						className={className}
						moderators={filteredModerators}
					/>
				</PopoverTrigger>
				<PopoverContent
					className={"w-[var(--radix-popover-trigger-width)] p-0"}
				>
					<ModeratorsList
						onSelect={handleSelect}
						isActive={isActive}
						moderators={moderators}
						className={className}
					/>
				</PopoverContent>
			</Popover>
		);
	}

	return (
		<Drawer open={open} onOpenChange={setOpen}>
			<DrawerTrigger asChild>
				<SelectorTrigger
					className={className}
					moderators={filteredModerators}
				/>
			</DrawerTrigger>
			<DrawerContent>
				<div className="mt-4 border-t">
					<ModeratorsList
						onSelect={handleSelect}
						isActive={isActive}
						moderators={moderators}
						className={className}
					/>
				</div>
			</DrawerContent>
		</Drawer>
	);
}

function ModeratorPreview({
	moderator,
	isActive,
}: {
	moderator: Moderator;
	isActive: boolean;
}) {
	return (
		<div
			className={cn("flex w-full items-center justify-between", {
				"opacity-50": isActive,
			})}
		>
			<div className="flex items-center gap-3">
				<Image
					width={32}
					height={32}
					src={moderator.user?.image || ""}
					alt={moderator.user?.name || "Moderador"}
					className="h-8 w-8 rounded-full"
				/>
				<span>{moderator.user?.name}</span>
			</div>
			<Check
				className={cn("h-4 w-4", isActive ? "opacity-100" : "opacity-0")}
			/>
		</div>
	);
}

function Tag({ moderator }: { moderator: Moderator }) {
	return (
		<li className="flex items-center justify-start gap-2 rounded-full border border-primary-200/50 bg-gray-600 py-1 pl-1 pr-2">
			<div className="flex items-center gap-3">
				<Image
					width={24}
					height={24}
					src={moderator.user?.image || ""}
					alt={moderator.user?.name || "Moderador"}
					className="h-6 w-6 rounded-full"
				/>
				<span className="max-w-full overflow-hidden overflow-ellipsis whitespace-nowrap text-xs font-bold text-neutral">
					{moderator.user?.name}
				</span>
			</div>
		</li>
	);
}

interface SelectorTriggerProps
	extends React.ComponentPropsWithoutRef<typeof PopoverTrigger> {
	moderators?: Moderator[];
}

const SelectorTrigger = forwardRef<
	React.ElementRef<typeof PopoverTrigger>,
	SelectorTriggerProps
>(({ moderators, className, ...props }, ref) => (
	<Button
		ref={ref}
		variant="outline"
		role="combobox"
		type="button"
		className={cn(
			"h-fit min-h-[52px] w-full justify-between px-3 text-sm font-normal hover:bg-gray-300 hover:text-neutral lg:px-4 lg:text-base",
			!moderators ||
			(moderators && moderators.length === 0 && "text-muted-foreground"),
			className,
		)}
		{...props}
	>
		{moderators && moderators.length > 0 ? (
			<ul className="flex flex-row flex-wrap justify-start gap-1">
				{moderators.map((moderator) => {
					return <Tag key={moderator.id} moderator={moderator} />;
				})}
			</ul>
		) : (
			<p className="overflow-hidden overflow-ellipsis whitespace-nowrap">
				Selecione um moderador...
			</p>
		)}
		<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
	</Button>
));

SelectorTrigger.displayName = "SelectorTrigger";

interface ModeratorsListProps {
	onSelect: (id: string) => void;
	isActive: (id: string) => boolean;
	moderators?: Moderator[];
	className?: string;
}

function ModeratorsList({
	moderators,
	className,
	onSelect,
	isActive,
}: ModeratorsListProps) {
	return (
		<Command className={className}>
			<CommandInput placeholder="Procurar moderador..." />
			<CommandEmpty>Nenhum moderador encontrado.</CommandEmpty>
			<CommandGroup>
				{
					// Iterate through the moderators array
					// and render a CommandItem for each moderator
					moderators ? (
						moderators.map((moderator) => (
							<CommandItem
								key={moderator.id}
								className="aria-selected:bg-primary-200/50"
								onSelect={() => onSelect(moderator.id)}
							>
								<ModeratorPreview
									moderator={moderator}
									isActive={isActive(moderator.id)}
								/>
							</CommandItem>
						))
					) : (
						<div className="flex flex-1 items-center justify-center py-4">
							<Loader2 className="h-4 w-4 animate-spin" />
						</div>
					)
				}
			</CommandGroup>
		</Command>
	);
}
