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
import AddEventFormContent from "./Content";

// Validation
import {
	type AddEventFormSchema,
	addEventFormSchema,
} from "@/lib/validations/AddEventForm";
import { trpc } from "@/lib/trpc/react";

// const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const setTimeOnDate = (date: Date, time: string) => {
	const timeParts = time.split(":");
	date.setHours(Number(timeParts[0]), Number(timeParts[1]));
};

export default function AddEventForm({ projectId }: { projectId: string }) {
	const [currentState, setCurrentState] = useState<
		false | "submitting" | "submitted" | "error"
	>(false);
	const submittedEventId = useRef<string | null>(null);

	// 1. Define your form.
	const form = useForm<AddEventFormSchema>({
		resolver: zodResolver(addEventFormSchema),
		defaultValues: {
			name: "",
			moderators: [],
			type: "internal",
			dateFrom: new Date(),
		},
	});

	// Atenção! O botão de "submit" não funcionará caso existam erros (mesmo que não visíveis) no formulário.
	// console.log("Errors: ", form.formState.errors);

	// 2. Define a submit handler.
	const mutation = trpc.createEvent.useMutation();

	async function onSubmit(data: AddEventFormSchema) {
		setCurrentState("submitting");

		console.log(data);

		const { description, dateFrom, timeFrom, timeTo, moderators, ...rest } =
			data;

		const dateFromWithTime = new Date(dateFrom);
		setTimeOnDate(dateFromWithTime, timeFrom);

		const dateToWithTime = new Date(dateFrom);
		setTimeOnDate(dateToWithTime, timeTo);

		try {
			const { eventId } = await mutation.mutateAsync({
				projectId,
				description: description ?? null,
				dateFrom: dateFromWithTime.toISOString(),
				dateTo: dateToWithTime.toISOString(),
				membersIds: moderators,
				...rest,
			});

			submittedEventId.current = eventId;
			setCurrentState("submitted");
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
				<AddEventFormContent form={form} projectId={projectId} />
				<button type="submit">testando</button>
			</form>
			<LoadingDialog isOpen={currentState === "submitting"} />
			<SuccessDialog
				isOpen={currentState === "submitted"}
				href={`/dashboard/events/${submittedEventId.current}`}
				description={
					<>
						O evento foi criado por sucesso e já pode ser acessado
						por todos os membros do grupo!
						<br />
						Agora, você pode visualizá-lo a qualquer momento através
						da página de eventos.
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
