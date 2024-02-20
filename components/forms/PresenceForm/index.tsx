"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// Components
import { Form } from "@/components/ui/form";
import { LoadingDialog, SuccessDialog } from "@/components/forms/dialogs";

// Sections
import PresenceForm1 from "./Section1";
import PresenceForm2 from "./Section2";
import PresenceForm3 from "./Section3";

// Validation
import {
	type PresenceFormSchema,
	PresenceFormTypeEnum,
	presenceFormSchema,
} from "@/lib/validations/PresenceForm";
import { scrollToNextSection } from "@/lib/validations";

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export default function PresenceForm() {
	const router = useRouter();
	const [currentState, setCurrentState] = useState<
		false | "submitting" | "submitted"
	>(false);

	// 1. Define your form.
	const form = useForm<PresenceFormSchema>({
		resolver: zodResolver(presenceFormSchema),
		defaultValues: {
			formType: PresenceFormTypeEnum.Section1,
			section1: {
				email: undefined,
				rememberMe: false,
			},
			section2: {
				uniqueCode: "",
			},
			section3: {
				rating: undefined,
				comments: "",
			},
		},
	});

	const formType = form.watch("formType");

	function setFormType(formType: PresenceFormTypeEnum) {
		form.setValue("formType", formType);
	}

	// 2. Define a submit handler.
	async function handleNextFormType() {
		const formSection = formType.replace("section", "");

		// 3. Switch between form sections.
		switch (formType) {
			case "section1":
				setFormType(PresenceFormTypeEnum.Section2);
				scrollToNextSection(Number(formSection) + 1);
				break;
			case "section2":
				setFormType(PresenceFormTypeEnum.Section3);
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
				className="flex flex-col items-center justify-start w-full gap-9 px-wrapper py-12 lg:py-24"
			>
				<PresenceForm1 form={form} />
				<PresenceForm2 form={form} />
				<PresenceForm3 form={form} />
			</form>
			<LoadingDialog isOpen={currentState === "submitting"} />
			<SuccessDialog isOpen={currentState === "submitted"} />
		</Form>
	);
}
