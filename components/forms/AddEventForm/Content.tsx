"use client";

import { ptBR } from "date-fns/locale";

// Components
import { type FormProps } from "@/components/forms";
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ResponsibleSelector } from "@/components/ResponsibleSelector";
import { Calendar } from "@/components/ui/calendar";

export default function AddEventFormContent({ form }: FormProps) {
	return (
		<div className="flex flex-col items-start justify-start gap-9 w-full">
			<div className="flex flex-col items-start justify-start gap-9 w-full">
				<FormField
					control={form.control}
					name="name"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Nome</FormLabel>
							<FormControl>
								<Input
									placeholder="Reunião Semanal"
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="description"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Descrição</FormLabel>
							<FormControl>
								<Textarea placeholder="" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="responsible"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Responsáveis</FormLabel>
							<ResponsibleSelector form={form} field={field} />
							<FormMessage />
						</FormItem>
					)}
				/>
			</div>
			<div className="flex flex-col items-start justify-start gap-9 w-full">
				<FormField
					control={form.control}
					name="dateFrom"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Data</FormLabel>
							<Calendar
								mode="single"
								lang="pt-br"
								locale={ptBR}
								selected={field.value}
								onSelect={field.onChange}
								disabled={(date) => date < new Date()}
								className="w-full rounded-md border"
								classNames={{
									cell: "w-full rounded-md",
									head_cell: "w-full",
									day_selected:
										"bg-muted hover:bg-muted text-background-200 hover:text-background-200",
								}}
							/>
							<FormMessage />
						</FormItem>
					)}
				/>
				<div className="flex flex-row items-center justify-between w-full">
					<FormField
						control={form.control}
						name="dateTo"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Horário</FormLabel>

								<FormMessage />
							</FormItem>
						)}
					/>
				</div>
			</div>
		</div>
	);
}
