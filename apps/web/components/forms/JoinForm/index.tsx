"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// Components
import { Form } from "@/components/ui/form";
import { LoadingDialog, SuccessDialog } from "@/components/forms/dialogs";

// Sections
import JoinForm0 from "./Section0";
import JoinForm1 from "./Section1";
import JoinForm2 from "./Section2";
import JoinForm3 from "./Section3";

// Validation
import {
	type JoinFormSchema,
	JoinFormTypeEnum,
	joinFormSchema,
} from "@/lib/validations/JoinForm";
import { scrollToNextSection, wait } from "@/lib/validations";

// Types
import { User } from "@ichess/auth";

export default function JoinForm({ user }: { user?: User }) {
	const [currentState, setCurrentState] = useState<
		false | "submitting" | "submitted"
	>(false);

	// 1. Define your form.
	const form = useForm<JoinFormSchema>({
		resolver: zodResolver(joinFormSchema),
		defaultValues: {
			formType: JoinFormTypeEnum.Section0,
			section0: {
				email: user?.email || "",
			},
			section1: {
				name: user?.name || "",
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

	async function submitData() {
		// ✅ This will be type-safe and validated.
		const values = form.getValues();
		console.log(values);

		setCurrentState("submitting");

		await wait(5000);

		setCurrentState("submitted");
	}

	// 2. Define a submit handler.
	async function handleNextFormType() {
		// 3. Switch between form sections.
		switch (formType) {
			case "section0":
				setFormType(JoinFormTypeEnum.Section1);
				scrollToNextSection(1);
				break;
			case "section1":
				setFormType(JoinFormTypeEnum.Section2);
				scrollToNextSection(2);
				break;
			case "section2":
				setFormType(JoinFormTypeEnum.Section3);
				scrollToNextSection(3);
				break;
			case "section3":
				submitData();
				break;
		}
	}

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(handleNextFormType)}
				className="flex w-full flex-col items-center justify-start gap-9 px-wrapper py-12 lg:py-24"
			>
				<JoinForm0 form={form} email={user?.email} />
				<JoinForm1 form={form} />
				<JoinForm2 form={form} />
				<JoinForm3 form={form} />
			</form>
			<LoadingDialog isOpen={currentState === "submitting"} />
			<SuccessDialog isOpen={currentState === "submitted"} />
		</Form>
	);
}
