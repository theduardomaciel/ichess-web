"use client";

import { cn } from "@/lib/utils";

// Icons
import EditIcon from "@/public/icons/edit.svg";
import CloudIcon from "@/public/icons/cloud.svg";

// Components
import { Panel } from "@/components/forms";
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
import { ModeratorPicker } from "@/components/dashboard/ModeratorPicker";

// Date and Time
import { ptBR } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";
import { TimePicker } from "@/components/dashboard/TimePicker";

// Types
import type { MutateEventFormSchema } from "@/lib/validations/MutateEventForm";
import type { UseFormReturn } from "react-hook-form";

// API
import { trpc } from "@/lib/trpc/react";
// import type { RouterOutput } from "@ichess/api";

const sectionClassName =
	"md:p-9 w-full md:rounded-2xl md:border border-gray-200";

interface Props {
	form: UseFormReturn<MutateEventFormSchema>;
	projectId: string;
	isEditing?: boolean;
}

export default function MutateEventFormContent({
	form,
	projectId,
	isEditing,
}: Props) {
	const aces = trpc.getAces.useQuery().data?.aces;

	return (
		<div className="flex w-full flex-col items-start justify-start gap-9">
			<div
				className={
					"flex w-full flex-col items-start justify-start gap-9 md:flex-row"
				}
			>
				<div className="flex w-full flex-col items-start justify-start gap-9">
					<FormField
						control={form.control}
						name="name"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Nome</FormLabel>
								<FormControl>
									<Input placeholder="Reunião Semanal" {...field} />
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
									<Textarea {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="type"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Tipo</FormLabel>
								<Select
									onValueChange={field.onChange}
									defaultValue={"internal"}
								>
									<FormControl>
										<SelectTrigger>
											<SelectValue placeholder="Selecione o tipo" />
										</SelectTrigger>
									</FormControl>
									<SelectContent>
										<SelectItem value="internal">Interno</SelectItem>
										<SelectItem value="external">Externo</SelectItem>
									</SelectContent>
								</Select>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="members"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Responsáveis</FormLabel>
								<ModeratorPicker
									projectId={projectId}
									initialModerators={field.value}
									onSelect={field.onChange}
								/>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>
				<div
					className={cn(
						"flex w-full flex-col items-start justify-start gap-9",
						sectionClassName,
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
					<div className="flex w-full flex-col items-start justify-start gap-2">
						<FormLabel>Horário</FormLabel>
						<div className="flex w-full flex-row items-center justify-between gap-3">
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
							<div className="h-0.5 w-[15px] rounded-full bg-gray-400" />
							<div className="flex w-full flex-row items-center justify-between">
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
					name="aceId"
					render={({ field }) => {
						const currentAce = aces?.find(
							(ace) => ace.id === Number(field.value),
						);

						return (
							<FormItem>
								<FormLabel>Ação Curricularizada de Extensão</FormLabel>
								<Select
									onValueChange={field.onChange}
									defaultValue={field.value}
									disabled={!aces}
								>
									<FormControl>
										<SelectTrigger>
											<SelectValue placeholder="Escolha uma opção" />
										</SelectTrigger>
									</FormControl>
									<SelectContent>
										{aces?.map((ace) => (
											<SelectItem key={ace.id} value={ace.id.toString()}>
												{ace.name} - {ace.hours}h
											</SelectItem>
										))}
									</SelectContent>
								</Select>
								{currentAce && (
									<Panel type="info">{currentAce.description}</Panel>
								)}
								<FormMessage />
							</FormItem>
						);
					}}
				/>
			</div>
			<div className="flex w-full flex-row items-center justify-end">
				{isEditing ? (
					<Button
						className="h-12 w-full bg-info-100 px-9 font-extrabold text-white ring-info-200 hover:bg-info-200 md:w-fit"
						type="submit"
					>
						<EditIcon width={24} height={24} />
						Editar evento
					</Button>
				) : (
					<Button
						className="h-12 w-full bg-primary-200 px-9 font-extrabold text-white md:w-fit"
						type="submit"
					>
						<CloudIcon />
						Cadastrar evento
					</Button>
				)}
			</div>
		</div>
	);
}
