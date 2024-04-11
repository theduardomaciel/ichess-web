"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// Components
import { Form } from "@/components/ui/form";
import { LoadingDialog, SuccessDialog } from "@/components/forms/dialogs";

// Sections
import JoinForm1 from "./Section1";
import JoinForm2 from "./Section2";
import JoinForm3 from "./Section3";

// Validation
import {
	type JoinFormSchema,
	JoinFormTypeEnum,
	joinFormSchema,
} from "@/lib/validations/JoinForm";
import { scrollToNextSection } from "@/lib/validations";

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export default function JoinForm() {
	const [currentState, setCurrentState] = useState<
		false | "submitting" | "submitted"
	>(false);

	// 1. Define your form.
	const form = useForm<JoinFormSchema>({
		resolver: zodResolver(joinFormSchema),
		defaultValues: {
			formType: JoinFormTypeEnum.Section1,
			section1: {
				name: "",
				email: "",
				course: undefined,
				registrationId: "",
				period: undefined,
			},
			section2: {
				experience: undefined,
				username: "",
			},
			section3: {
				reason: undefined,
				discovery: undefined,
				discoveryOther: "",
			},
		},
	});

	const formType = form.watch("formType");

	function setFormType(formType: JoinFormTypeEnum) {
		form.setValue("formType", formType);
	}

	// 2. Define a submit handler.
	async function handleNextFormType() {
		const formSection = formType.replace("section", "");

		// 3. Switch between form sections.
		switch (formType) {
			case "section1":
				setFormType(JoinFormTypeEnum.Section2);
				scrollToNextSection(Number(formSection) + 1);
				break;
			case "section2":
				setFormType(JoinFormTypeEnum.Section3);
				scrollToNextSection(Number(formSection) + 1);
				break;
			case "section3":
				// Do something with the form values.
				// ✅ This will be type-safe and validated.
				const values = form.getValues();
				console.log(values);

				setCurrentState("submitting");

				await wait(5000);

				setCurrentState("submitted");

				break;
		}
	}

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(handleNextFormType)}
				className="flex w-full flex-col items-center justify-start gap-9 px-wrapper py-12 lg:py-24"
			>
				<JoinForm1 form={form} />
				<JoinForm2 form={form} />
				<JoinForm3 form={form} />
			</form>
			<LoadingDialog isOpen={currentState === "submitting"} />
			<SuccessDialog isOpen={currentState === "submitted"} />
		</Form>
	);
}
