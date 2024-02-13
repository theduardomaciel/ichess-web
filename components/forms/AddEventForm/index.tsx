"use client";

import { useState } from "react";

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
} from "@/validations/AddEventForm";

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export default function AddEventForm() {
	const [currentState, setCurrentState] = useState<
		false | "submitting" | "submitted"
	>(false);

	// 1. Define your form.
	const form = useForm<AddEventFormSchema>({
		resolver: zodResolver(addEventFormSchema),
		defaultValues: {
			name: "",
			description: "",
			responsible: [],
			dateFrom: "",
			dateTo: "",
			ace: "no",
		},
	});

	// 2. Define a submit handler.
	async function onSubmit(data: AddEventFormSchema) {
		setCurrentState("submitting");

		console.log(data);

		await wait(1000);

		setCurrentState("submitted");
	}

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="flex flex-col items-center justify-start w-full gap-9"
			>
				<AddEventFormContent form={form} />
			</form>
			<LoadingDialog isOpen={currentState === "submitting"} />
			<SuccessDialog isOpen={currentState === "submitted"} />
		</Form>
	);
}
