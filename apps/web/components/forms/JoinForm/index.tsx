"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// Components
import { Form } from "@/components/ui/form";
import {
	ErrorDialog,
	LoadingDialog,
	SuccessDialog,
} from "@/components/forms/dialogs";

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
import { scrollToNextSection } from "@/lib/validations";

// Types
import type { User } from "@ichess/auth";
import type { GenericForm } from "..";

// API
import { trpc } from "@/lib/trpc/react";

export default function JoinForm({ user }: { user?: User }) {
	const [currentState, setCurrentState] = useState<
		false | "submitting" | "error" | "submitted"
	>(false);

	const mutation = trpc.updateUser.useMutation();

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
		setCurrentState("submitting");

		if (!user) {
			console.error("User not found.");
			setCurrentState(false);
			return;
		}

		// ✅ This will be type-safe and validated.
		const values = form.getValues();

		// Send the research data to Google Sheets.
		try {
			const response = await fetch("/api/google", {
				method: "POST",
				body: JSON.stringify({
					data: {
						...values.section3,
						registrationId: values.section1.registrationId,
					},
				}),
			});

			if (response.status !== 200) {
				console.error("Error: Invalid data.");
			}
		} catch (error) {
			console.error(error);
		}

		// Send the data to the server.
		try {
			await mutation.mutateAsync({
				name: values.section1.name,
				course: values.section1.course,
				registrationId: values.section1.registrationId,
				period: values.section1.period,
				experience: values.section2.experience,
				username: values.section2.username,
			});
		} catch (error) {
			console.error(error);
			setCurrentState("error");
			return;
		}

		setCurrentState("submitted");
	}

	// 2. Define a submit handler.
	async function handleNextFormType() {
		// Switch between form sections.
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
				<JoinForm0 form={form as unknown as GenericForm} email={user?.email} />
				<JoinForm1 form={form as unknown as GenericForm} />
				<JoinForm2 form={form as unknown as GenericForm} />
				<JoinForm3 form={form as unknown as GenericForm} />
			</form>
			<LoadingDialog
				isOpen={currentState === "submitting"}
				title="Estamos realizando seu cadastro..."
			/>
			<SuccessDialog
				isOpen={currentState === "submitted"}
				description={
					<>
						Seu cadastro já foi enviado e está em análise.
						<br />
						Uma resposta será enviada ao seu e-mail institucional em breve!
					</>
				}
			/>
			<ErrorDialog
				isOpen={currentState === "error"}
				title="Erro ao enviar o formulário"
				onClose={() => setCurrentState(false)}
				description="Por favor, tente novamente mais tarde. Se o erro persistir, entre em contato com o suporte."
			/>
		</Form>
	);
}
