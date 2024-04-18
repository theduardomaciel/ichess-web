"use client";

import { useRef, useState } from "react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// Components
import { Form } from "@/components/ui/form";
import { LoadingDialog, SuccessDialog } from "@/components/forms/dialogs";

// Content
import AddEventFormContent from "./Content";

// Validation
import {
	type AddEventFormSchema,
	addEventFormSchema,
} from "@/lib/validations/AddEventForm";
import { trpc } from "@/lib/trpc/react";

// const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export default function AddEventForm({ projectId }: { projectId: string }) {
	const [currentState, setCurrentState] = useState<
		false | "submitting" | "submitted"
	>(false);
	const submittedEventId = useRef<string | null>(null);

	const mutation = trpc.createEvent.useMutation();

	// 1. Define your form.
	const form = useForm<AddEventFormSchema>({
		resolver: zodResolver(addEventFormSchema),
		defaultValues: {
			moderators: [],
			dateFrom: new Date(),
		},
	});

	// 2. Define a submit handler.
	async function onSubmit(data: AddEventFormSchema) {
		setCurrentState("submitting");

		console.log(data);

		const { description, dateFrom, dateTo, ...rest } = data;

		const { event } = await mutation.mutateAsync({
			projectId,
			description: description ?? null,
			dateFrom: dateFrom.toISOString(),
			dateTo: dateTo?.toISOString(),
			...rest,
		});

		submittedEventId.current = event.id;
		setCurrentState("submitted");
	}

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="flex w-full flex-col items-center justify-start gap-9"
			>
				<AddEventFormContent form={form} projectId={projectId} />
			</form>
			<LoadingDialog isOpen={currentState === "submitting"} />
			<SuccessDialog
				isOpen={currentState === "submitted"}
				href={`/dashboard/events/${submittedEventId.current}`}
			/>
		</Form>
	);
}
