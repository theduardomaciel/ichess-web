"use client";

import { cn } from "@/lib/utils";

/// Icons
import CloudIcon from "@/public/icons/cloud.svg";

// Components
import { Panel, type FormProps } from "@/components/forms";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { FormResponsiblePicker } from "@/components/ResponsiblePicker";

import { ptBR } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";
import { TimePicker } from "@/components/TimePicker";

// Utils
import { ACEs } from "@/lib/validations/AddEventForm";

const sectionClassName =
	"md:p-9 w-full md:rounded-2xl md:border border-gray-200";

export default function AddEventFormContent({ form }: FormProps) {
	return (
		<div className="flex flex-col items-start justify-start gap-9 w-full">
			<div
				className={
					"flex flex-col md:flex-row items-start justify-start gap-9 w-full"
				}
			>
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
								<FormResponsiblePicker
									form={form}
									field={field}
								/>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>
				<div
					className={cn(
						"flex flex-col items-start justify-start gap-9 w-full",
						sectionClassName
					)}
				>
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
									disabled={(date) => {
										const today = new Date();
										today.setHours(0, 0, 0, 0);
										return date < today;
									}}
									className="w-full rounded-md border"
									classNames={{
										caption_label: "lg:text-base",
										cell: "w-full rounded-md",
										head_cell: "w-full",
										day_selected:
											"bg-muted hover:bg-muted text-gray-300 hover:text-gray-300",
									}}
								/>
								<FormMessage />
							</FormItem>
						)}
					/>
					<div className="flex flex-col items-start justify-start gap-2 w-full">
						<FormLabel>Horário</FormLabel>
						<div className="flex flex-row items-center justify-between w-full gap-3">
							<FormField
								control={form.control}
								name="timeFrom"
								render={({ field }) => (
									<FormItem>
										<TimePicker
											form={form}
											field={field}
											placeholder={"HH:MM"}
										/>
										<FormMessage />
									</FormItem>
								)}
							/>
							<div className="w-[15px] h-0.5 bg-gray-400 rounded-full" />
							<div className="flex flex-row items-center justify-between w-full">
								<FormField
									control={form.control}
									name="timeTo"
									render={({ field }) => (
										<FormItem>
											<TimePicker
												form={form}
												field={field}
												placeholder={"HH:MM"}
											/>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div className={sectionClassName}>
				<FormField
					control={form.control}
					name="ace"
					render={({ field }) => {
						const currentACE = ACEs.find(
							(ace) => ace.id === field.value
						);

						return (
							<FormItem>
								<FormLabel>
									Ação Curricularizada de Extensão
								</FormLabel>
								<Select
									onValueChange={field.onChange}
									defaultValue={field.value}
								>
									<FormControl>
										<SelectTrigger>
											<SelectValue placeholder="Escolha uma opção" />
										</SelectTrigger>
									</FormControl>
									<SelectContent>
										{ACEs.map((ace) => (
											<SelectItem
												key={ace.id}
												value={ace.id}
											>
												{ace.name} - {ace.hours}h
											</SelectItem>
										))}
									</SelectContent>
								</Select>
								{currentACE && (
									<Panel type="info">
										{currentACE.description}
									</Panel>
								)}
								<FormMessage />
							</FormItem>
						);
					}}
				/>
			</div>
			<div className="flex flex-row items-center justify-end w-full">
				<Button
					className="px-9 h-12 text-white font-extrabold bg-primary-200 w-full md:w-fit"
					type="submit"
				>
					<CloudIcon />
					Cadastrar evento
				</Button>
			</div>
		</div>
	);
}
