"use client";

import { useState } from "react";

import { cn } from "@/lib/utils";

// Components
import {
	Command,
	CommandEmpty,
	CommandGroup,
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
		value: string;
	};
	placeholder?: string;
}

/* function checkTime(str: string) {
    // Verifica se a string está no formato HH:MM
    if (!/^\d{2}:\d{2}$/.test(str)) {
        return false;
    }

    // Divide a string em partes usando os dois pontos
    const timeParts = str.split(":");

    // Extrai as horas e os minutos
    const hours = parseInt(timeParts[0], 10);
    const minutes = parseInt(timeParts[1], 10);

    // Verifica se as horas estão no intervalo de 0 a 23
    if (hours < 0 || hours > 23) {
        return false;
    }

    // Verifica se os minutos estão no intervalo de 0 a 59
    if (minutes < 0 || minutes > 59) {
        return false;
    }

    // Se passou por todas as verificações, a string está no formato correto
    return true;
} */

function checkDiscrepancy(form: Props["form"]) {
	const dateFrom = form.getValues("dateFrom");
	const dateTo = form.getValues("dateTo") ?? dateFrom;

	const timeFrom = form.getValues("timeFrom");
	const timeTo = form.getValues("timeTo");

	const timeFromDate = new Date(
		`${dateFrom.toISOString().slice(0, 10)}T${timeFrom}:00`
	);
	const timeToDate = new Date(
		`${dateTo.toISOString().slice(0, 10)}T${timeTo}:00`
	);

	if (timeToDate <= timeFromDate) {
		const formattedTime = `${((parseInt(timeFrom.slice(0, 2)) + 1) % 24)
			.toString()
			.padStart(2, "0")}:${timeFrom.slice(3)}`;

		form.setValue("timeTo", formattedTime);
	}
}

export function TimePicker({ form, field, placeholder }: Props) {
	const [open, setOpen] = useState(false);

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<Command loop>
				<PopoverTrigger asChild>
					<FormControl>
						<CommandPrimitive.Input
							role="combobox"
							className={cn(
								"flex h-10 lg:h-11 w-full rounded-md border border-input bg-background px-3 lg:px-4 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm lg:text-base change_later file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
							)}
							value={field.value}
							maxLength={5}
							placeholder={placeholder}
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

								form.setValue(field.name, newString);
							}}
							onBlur={() => {
								if (!field.value || field.value.length === 0)
									return;

								let newString = field.value;

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
								form.setValue(field.name, newString);

								// Verificamos se o horário final é menor que o horário inicial
								checkDiscrepancy(form);
							}}
						/>
					</FormControl>
				</PopoverTrigger>
				<PopoverContent
					className="p-0 w-[var(--radix-popover-trigger-width)] max-h-56 overflow-y-scroll no-scrollbar"
					onOpenAutoFocus={(event) => event.preventDefault()}
					onCloseAutoFocus={(event) => event.preventDefault()}
				>
					<CommandEmpty>Nenhum horário encontrado.</CommandEmpty>
					<CommandGroup>
						{times.map((time) => (
							<CommandItem
								value={time}
								key={time}
								className="lg:py-3"
								onSelect={(currentValue) => {
									form.setValue(field.name, currentValue);

									// Verificamos se o horário final é menor que o horário inicial
									checkDiscrepancy(form);

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
