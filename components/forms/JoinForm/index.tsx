"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

// Components
import { Form } from "@/components/ui/form";

// Sections
import JoinForm1 from "./Section1";
import JoinForm2 from "./Section2";
import JoinForm3 from "./Section3";

// Validation
import {
	type JoinFormSchema,
	JoinFormTypeEnum,
	joinFormSchema,
} from "@/validations/JoinForm";
import { goToNextSection } from "@/validations";
import { useRouter } from "next/navigation";

export default function JoinForm() {
	const router = useRouter();

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
	function handleNextFormType() {
		// 3. Switch between form sections.
		switch (formType) {
			case "section1":
				setFormType(JoinFormTypeEnum.Section2);
				goToNextSection(2, router);
				break;
			case "section2":
				setFormType(JoinFormTypeEnum.Section3);
				goToNextSection(3, router);
				break;
			case "section3":
				// Do something with the form values.
				// ✅ This will be type-safe and validated.
				const values = form.getValues();
				console.log(values);

				break;
		}
	}

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(handleNextFormType)}
				className="flex flex-col items-center justify-start w-full gap-9 px-wrapper py-12 lg:py-24"
			>
				<JoinForm1 form={form} />
				<JoinForm2 form={form} />
				<JoinForm3 form={form} />
			</form>
		</Form>
	);
}
