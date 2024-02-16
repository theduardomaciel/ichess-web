"use client";

import { forwardRef, useState } from "react";
import { useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";

import { useMediaQuery } from "@/hooks/use-media-query";
import { useQueryString } from "@/hooks/use-query-string";

// Components
import { Button } from "@/components/ui/button";
import { FormControl } from "@/components/ui/form";
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
import type { UseFormReturn } from "react-hook-form";

interface Moderator {
	name: string;
	image_url: string;
	id: string;
}

const moderators = [
	{
		name: "John Doe",
		image_url: "https://randomuser.me/api/portraits/men/18.jpg",
		id: "1",
	},
	{
		name: "Marcelo Silva",
		image_url: "https://randomuser.me/api/portraits/men/19.jpg",
		id: "2",
	},
	{
		name: "Marcos Melo",
		image_url: "https://randomuser.me/api/portraits/men/20.jpg",
		id: "3",
	},
	{
		name: "Luciano Cesa",
		image_url: "https://github.com/mark.png",
		id: "4",
	},
	{
		name: "Márcio Cavalcante",
		image_url: "https://randomuser.me/api/portraits/men/21.jpg",
		id: "5",
	},
] as Moderator[];

interface FormResponsiblePickerProps {
	form: UseFormReturn<any>;
	field: {
		value: string[];
	};
}

export function FormResponsiblePicker({
	form,
	field,
}: FormResponsiblePickerProps) {
	const [open, setOpen] = useState(false);
	const isDesktop = useMediaQuery("(min-width: 768px)");

	const handleSelect = (id: string) => {
		{
			if (field.value.includes(id)) {
				form.setValue(
					"responsible",
					field.value.filter((id) => id !== id)
				);
			} else {
				form.setValue("responsible", [...field.value, id]);
			}
		}
	};

	const isActive = (id: string) => field.value.includes(id);

	if (isDesktop) {
		return (
			<Popover>
				<PopoverTrigger asChild>
					<FormControl>
						<SelectorTrigger moderatorsIds={field.value} />
					</FormControl>
				</PopoverTrigger>
				<PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
					<ModeratorsList
						onSelect={handleSelect}
						isActive={isActive}
					/>
				</PopoverContent>
			</Popover>
		);
	}

	return (
		<Drawer open={open} onOpenChange={setOpen}>
			<DrawerTrigger asChild>
				<FormControl>
					<SelectorTrigger moderatorsIds={field.value} />
				</FormControl>
			</DrawerTrigger>
			<DrawerContent>
				<div className="mt-4 border-t">
					<ModeratorsList
						onSelect={handleSelect}
						isActive={isActive}
					/>
				</div>
			</DrawerContent>
		</Drawer>
	);
}

interface ParamsResponsiblePickerProps {}

export function ParamsResponsiblePicker({}: ParamsResponsiblePickerProps) {
	const [open, setOpen] = useState(false);
	const isDesktop = useMediaQuery("(min-width: 768px)");

	const router = useRouter();
	const { query, setQuery, deleteQuery, toUrl } = useQueryString();

	const handleSelect = (id: string) => {
		console.log("id", id);

		const responsible = query.get("responsible")?.split(",") ?? [];

		if (responsible.includes(id)) {
			responsible.splice(responsible.indexOf(id), 1);
		} else {
			responsible.push(id);
		}

		if (responsible.length === 0) {
			router.push(toUrl(deleteQuery("responsible")), { scroll: true });
		} else {
			router.push(toUrl(setQuery("responsible", responsible.join(","))), {
				scroll: true,
			});
		}
	};

	const isActive = (id: string) =>
		(query.get("responsible")?.split(",") ?? []).includes(id);

	if (isDesktop) {
		return (
			<Popover>
				<PopoverTrigger asChild>
					<SelectorTrigger
						moderatorsIds={query.get("responsible")?.split(",")}
					/>
				</PopoverTrigger>
				<PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
					<ModeratorsList
						onSelect={handleSelect}
						isActive={isActive}
					/>
				</PopoverContent>
			</Popover>
		);
	}

	return (
		<Drawer open={open} onOpenChange={setOpen}>
			<DrawerTrigger asChild>
				<SelectorTrigger
					moderatorsIds={query.get("responsible")?.split(",")}
				/>
			</DrawerTrigger>
			<DrawerContent>
				<div className="mt-4 border-t">
					<ModeratorsList
						onSelect={handleSelect}
						isActive={isActive}
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
			className={cn("flex items-center justify-between w-full", {
				"opacity-50": isActive,
			})}
		>
			<div className="flex items-center gap-3">
				<img
					src={moderator.image_url}
					alt={moderator.name}
					className="w-8 h-8 rounded-full"
				/>
				<span>{moderator.name}</span>
			</div>
			<Check
				className={cn(
					"h-4 w-4",
					isActive ? "opacity-100" : "opacity-0"
				)}
			/>
		</div>
	);
}

function Tag({ moderator }: { moderator: Moderator }) {
	return (
		<li className="flex justify-start items-center pl-1 pr-2 py-1 bg-background-600 border border-primary-200/50 gap-2 rounded-full">
			<div className="flex items-center gap-3">
				<img
					src={moderator.image_url}
					alt={moderator.name}
					className="w-6 h-6 rounded-full"
				/>
				<span className="text-neutral text-xs font-bold max-w-full overflow-hidden whitespace-nowrap overflow-ellipsis">
					{moderator.name}
				</span>
			</div>
		</li>
	);
}

interface SelectorTriggerProps
	extends React.ComponentPropsWithoutRef<typeof PopoverTrigger> {
	moderatorsIds?: string[];
}

const SelectorTrigger = forwardRef<
	React.ElementRef<typeof PopoverTrigger>,
	SelectorTriggerProps
>(({ moderatorsIds, ...props }, ref) => (
	<Button
		ref={ref}
		variant="outline"
		role="combobox"
		type="button"
		className={cn(
			"w-full justify-between h-fit font-normal hover:bg-background-200 hover:text-neutral text-sm lg:text-base min-h-[52px] px-3 lg:px-4",
			!moderatorsIds ||
				(moderatorsIds &&
					moderatorsIds.length === 0 &&
					"text-muted-foreground")
		)}
		{...props}
	>
		{moderatorsIds && moderatorsIds && moderatorsIds.length > 0 ? (
			<ul className="flex flex-row flex-wrap justify-start gap-1">
				{moderatorsIds.map((id) => {
					const moderator = moderators.find((mod) => mod.id === id);
					if (!moderator) return null;

					return <Tag key={moderator.id} moderator={moderator} />;
				})}
			</ul>
		) : (
			<p className="overflow-hidden whitespace-nowrap overflow-ellipsis">
				Selecione um moderador...
			</p>
		)}
		<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
	</Button>
));

interface ModeratorsListProps {
	onSelect: (id: string) => void;
	isActive: (id: string) => boolean;
}

function ModeratorsList({ onSelect, isActive }: ModeratorsListProps) {
	return (
		<Command>
			<CommandInput placeholder="Procurar moderador..." />
			<CommandEmpty>Nenhum moderador encontrado.</CommandEmpty>
			<CommandGroup>
				{
					// Iterate through the moderators array
					// and render a CommandItem for each moderator
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
				}
			</CommandGroup>
		</Command>
	);
}
