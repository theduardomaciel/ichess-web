"use client";

import { useRef, useState } from "react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// Components
import { Form } from "@/components/ui/form";
import {
	ErrorDialog,
	LoadingDialog,
	SuccessDialog,
} from "@/components/forms/dialogs";

// Content
import MutateEventFormContent from "./Content";

// Validation
import {
	type MutateEventFormSchema,
	mutateEventFormSchema,
} from "@/lib/validations/MutateEventForm";

// API
import { trpc } from "@/lib/trpc/react";
import type { RouterOutput } from "@ichess/api";
import { dateToTimeString } from "@/components/dashboard/TimePicker";

interface Props {
	event?: RouterOutput["getEvent"]["event"];
}

export default function MutateEventForm({ projectId, event }: Props) {
	const [currentState, setCurrentState] = useState<
		false | "submitting" | "submitted" | "error"
	>(false);
	const submittedEventId = useRef<string | null>(null);

	// 1. Define your form.
	const form = useForm<MutateEventFormSchema>({
		resolver: zodResolver(mutateEventFormSchema),
		defaultValues: {
			name: event?.name || "",
			description: event?.description || "",
			members: event?.members?.map((member) => member.id) || [],
			dateFrom: new Date(),
			timeFrom: event ? dateToTimeString(event.dateFrom) : undefined,
			timeTo: event ? dateToTimeString(event.dateTo) : undefined,
			aceId: event?.aceId.toString() || "",
			type: event?.type || "internal",
		},
	});

	// Atenção! O botão de "submit" não funcionará caso existam erros (mesmo que não visíveis) no formulário.
	// console.log("Errors: ", form.formState.errors);

	// 2. Define a submit handler.
	const updateMutation = trpc.updateEvent.useMutation();
	const createMutation = trpc.createEvent.useMutation();

	async function onSubmit(data: MutateEventFormSchema) {
		setCurrentState("submitting");

		console.log(data);
		const { dateFrom, timeFrom, timeTo, members, ...rest } = data;

		const dateFromWithTime = new Date(dateFrom);
		setTimeOnDate(dateFromWithTime, timeFrom);

		const dateToWithTime = new Date(dateFrom);
		setTimeOnDate(dateToWithTime, timeTo);

		try {
			if (event) {
				await updateMutation.mutateAsync({
					eventId: event.id,
					dateFrom: dateFromWithTime,
					dateTo: dateToWithTime,
					membersIds: members,
					...rest,
				});

				submittedEventId.current = event.id;
				setCurrentState("submitted");
			} else {
				const { eventId } = await createMutation.mutateAsync({
					projectId,
					dateFrom: dateFromWithTime,
					dateTo: dateToWithTime,
					membersIds: members,
					...rest,
				});

				submittedEventId.current = eventId;
				setCurrentState("submitted");
			}
		} catch (error) {
			console.error(error);
			setCurrentState("error");
		}
	}

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="flex w-full flex-col items-center justify-start gap-9"
			>
				<MutateEventFormContent
					form={form}
					projectId={projectId}
					isEditing={!!event}
				/>
			</form>
			<LoadingDialog
				isOpen={currentState === "submitting"}
				title="Estamos realizando a operação..."
			/>
			<SuccessDialog
				isOpen={currentState === "submitted"}
				href={`/dashboard/events/${submittedEventId.current}`}
				description={
					<>
						O evento foi {event ? "atualizado" : "criado"} por
						sucesso e já pode ser acessado por todos os membros do
						grupo!
						<br />
						{!event &&
							"Agora, você pode visualizá-lo a qualquer momento através da página de eventos."}
					</>
				}
				buttonText="Visualizar evento"
			/>
			<ErrorDialog
				isOpen={currentState === "error"}
				onClose={() => {
					setCurrentState(false);
				}}
			/>
		</Form>
	);
}

const setTimeOnDate = (date: Date, time: string) => {
	const timeParts = time.split(":");
	date.setHours(Number(timeParts[0]), Number(timeParts[1]));
};
