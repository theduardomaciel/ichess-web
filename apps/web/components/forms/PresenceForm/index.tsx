"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// Components
import { Form, FormWrapper } from "@/components/ui/form";
import {
	ErrorDialog,
	LoadingDialog,
	SuccessDialog,
} from "@/components/forms/dialogs";

// Sections
import PresenceForm0 from "./Section0";
import PresenceForm1 from "./Section1";
import PresenceForm2 from "./Section2";

// Validation
import {
	type PresenceFormSchema,
	PresenceFormTypeEnum,
	presenceFormSchema,
} from "@/lib/validations/PresenceForm";
import { scrollToNextSection } from "@/lib/validations";

// Types
import type { GenericForm } from "..";

export default function PresenceForm({ email }: { email?: string | null }) {
	const router = useRouter();
	const [currentState, setCurrentState] = useState<
		false | "submitting" | "error" | "submitted"
	>(false);

	// 1. Define your form.
	const form = useForm<PresenceFormSchema>({
		resolver: zodResolver(presenceFormSchema),
		defaultValues: {
			formType: PresenceFormTypeEnum.Section0,
			section0: {
				email: email || undefined,
			},
			section1: {
				uniqueCode: "",
			},
			section2: {
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

		const values = form.getValues();

		// Switch between form sections.
		switch (formType) {
			case "section0":
				setFormType(PresenceFormTypeEnum.Section1);
				scrollToNextSection(Number(formSection) + 1);
				break;
			case "section1":
				setFormType(PresenceFormTypeEnum.Section2);
				scrollToNextSection(Number(formSection) + 1);
				break;
			case "section2":
				// ✅ This will be type-safe and validated.
				setCurrentState("submitting");

				setCurrentState("submitted");
				break;
			default:
				break;
		}
	}

	return (
		<Form {...form}>
			<FormWrapper>
				<form onSubmit={form.handleSubmit(handleNextFormType)}>
					<PresenceForm0 form={form as unknown as GenericForm} email={email} />
					<PresenceForm1 form={form as unknown as GenericForm} />
					<PresenceForm2 form={form as unknown as GenericForm} />
				</form>
			</FormWrapper>
			<LoadingDialog isOpen={currentState === "submitting"} />
			<SuccessDialog isOpen={currentState === "submitted"} />
			<ErrorDialog
				isOpen={currentState === "error"}
				onClose={() => setCurrentState(false)}
			/>
		</Form>
	);
}
