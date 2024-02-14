"use client";

import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";

// Components
import { Button } from "@/components/ui/button";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
} from "@/components/ui/command";
import { FormControl } from "@/components/ui/form";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";

import { Command as CommandPrimitive } from "cmdk";

// Types
import type { UseFormReturn } from "react-hook-form";
import { Input } from "./ui/input";
import { useState } from "react";

const times = [
	"00:00",
	"00:15",
	"00:30",
	"00:45",
	"01:00",
	"01:15",
	"01:30",
	"01:45",
	"02:00",
	"02:15",
	"02:30",
	"02:45",
	"03:00",
	"03:15",
	"03:30",
	"03:45",
	"04:00",
	"04:15",
	"04:30",
	"04:45",
	"05:00",
	"05:15",
	"05:30",
	"05:45",
	"06:00",
	"06:15",
	"06:30",
	"06:45",
	"07:00",
	"07:15",
	"07:30",
	"07:45",
	"08:00",
	"08:15",
	"08:30",
	"08:45",
	"09:00",
	"09:15",
	"09:30",
	"09:45",
	"10:00",
	"10:15",
	"10:30",
	"10:45",
	"11:00",
	"11:15",
	"11:30",
	"11:45",
	"12:00",
	"12:15",
	"12:30",
	"12:45",
	"13:00",
	"13:15",
	"13:30",
	"13:45",
	"14:00",
	"14:15",
	"14:30",
	"14:45",
	"15:00",
	"15:15",
	"15:30",
	"15:45",
	"16:00",
	"16:15",
	"16:30",
	"16:45",
	"17:00",
	"17:15",
	"17:30",
	"17:45",
	"18:00",
	"18:15",
	"18:30",
	"18:45",
	"19:00",
	"19:15",
	"19:30",
	"19:45",
	"20:00",
	"20:15",
	"20:30",
	"20:45",
	"21:00",
	"21:15",
	"21:30",
	"21:45",
	"22:00",
	"22:15",
	"22:30",
	"22:45",
	"23:00",
	"23:15",
	"23:30",
	"23:45",
] as const;

interface Props {
	form: UseFormReturn<any>;
	field: {
		name: string;
		value: Date;
	};
}

/* const validHHMMString = (string: string) =>
	/^([0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/.test(string); */

const setDate = (dateString: string, form: Props["form"]) => {
	const newDate = new Date(form.getValues("dateFrom"));
	const newHours = parseInt(dateString.slice(0, 2));
	const newMinutes = parseInt(dateString.slice(3, 5));

	newDate.setHours(newHours);
	newDate.setMinutes(newMinutes);

	form.setValue("dateFrom", newDate);
	console.log(`Data inicial: ${form.getValues("dateFrom")}`);
};

export function TimePicker({ form, field }: Props) {
	const [open, setOpen] = useState(false);
	const [value, setValue] = useState("");

	const placeholderDate = new Date(field.value)
		.toLocaleTimeString()
		.slice(0, 5);

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<Command>
				<PopoverTrigger asChild>
					<FormControl>
						<CommandPrimitive.Input
							role="combobox"
							className={cn(
								"flex h-10 lg:h-11 w-full rounded-md border border-input bg-background px-3 lg:px-4 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm lg:text-base change_later file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
								/* !field.value && "text-muted-foreground" */
							)}
							value={value}
							maxLength={5}
							placeholder={placeholderDate}
							onValueChange={(currentValue) => {
								let newString = currentValue;

								// Removemos caracteres não numéricos
								newString = newString.replace(/\D/g, "");

								// Formatamos como HH:MM
								if (newString.length > 2) {
									newString = `${newString.slice(
										0,
										2
									)}:${newString.slice(2)}`;
								}

								console.log(newString);

								setValue(newString);
							}}
							/* onBlur={() => {
								let newString = value;

								// Removemos espaços em branco no início e no final
								newString = newString.trim();

								// Dividimos a string em partes usando os possíveis delimitadores
								const timeParts = newString.split(/[\s:.-]+/);

								// Se houver pelo menos uma parte, formatamos as horas e os minutos
								if (timeParts.length > 0) {
									let hours = parseInt(timeParts[0], 10) || 0;
									let minutes =
										parseInt(timeParts[1], 10) || 0;

									// Garantimos que as horas estejam no intervalo de 0 a 23
									hours = Math.min(Math.max(hours, 0), 23);

									// Garantimos que os minutos estejam no intervalo de 0 a 59
									minutes = Math.min(
										Math.max(minutes, 0),
										59
									);

									// Formatamos as horas e os minutos como duas casas decimais
									newString = `${hours
										.toString()
										.padStart(2, "0")}:${minutes
										.toString()
										.padStart(2, "0")}`;
								}

								// Agora, newString contém o formato corrigido (HH:MM)
								setValue(newString);
								setDate(newString, form);
							}} */
						/>
					</FormControl>
				</PopoverTrigger>
				<PopoverContent
					className="p-0 w-[var(--radix-popover-trigger-width)] max-h-56 overflow-y-scroll"
					onOpenAutoFocus={(event) => event.preventDefault()}
					onCloseAutoFocus={(event) => event.preventDefault()}
				>
					<CommandEmpty>Nenhum horário encontrado.</CommandEmpty>
					<CommandGroup>
						{times.map((time) => (
							<CommandItem
								value={time}
								key={time}
								onSelect={(currentValue) => {
									setValue(currentValue);
									setDate(currentValue, form);
									setOpen(false);
								}}
							>
								{time}
							</CommandItem>
						))}
					</CommandGroup>
				</PopoverContent>
			</Command>
		</Popover>
	);
}

/* 
export function TimePicker({ form, field }: Props) {
	return (
		<Popover>
			<PopoverTrigger asChild>
				<FormControl>
					<Input
						role="combobox"
						className={cn(
							"w-full justify-between",
							!field.value && "text-muted-foreground"
						)}
						value={times.find((time) => time === field.value)}
					/>
				</FormControl>
			</PopoverTrigger>
			<PopoverContent className="w-full p-0 w-[var(--radix-popover-trigger-width);] max-h-[var(--radix-popover-content-available-height)]">
				<Command>
					<CommandInput placeholder="Procure por um horário..." />
					<CommandEmpty>Nenhum horário encontrado.</CommandEmpty>
					<CommandGroup>
						{times.map((time) => (
							<CommandItem
								value={time}
								key={time}
                                >
								<Check
									className={cn(
										"mr-2 h-4 w-4",
										time === field.value
											? "opacity-100"
											: "opacity-0"
									)}
								/>
								{time}
							</CommandItem>
						))}
					</CommandGroup>
				</Command>
			</PopoverContent>
		</Popover>
	);
}
*/
