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

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export default function AddEventForm({ projectId }: { projectId: string }) {
	const [currentState, setCurrentState] = useState<
		false | "submitting" | "submitted"
	>(false);
	const submittedEvent = useRef<(AddEventFormSchema & { id: string }) | null>(
		null,
	);

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

		await wait(5000);

		const response = {
			id: "123",
			...data,
		};

		submittedEvent.current = response;
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
				href={`/dashboard/events/${submittedEvent.current?.id}`}
			/>
		</Form>
	);
}
