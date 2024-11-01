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

// API
import { trpc } from "@/lib/trpc/react";

// Types
import type { GenericForm } from "..";

// Actions
import { markVerificationCode } from "@/lib/actions/websockets/verification-code";

export default function PresenceForm({
	eventId,
	email,
}: { eventId: string; email?: string | null }) {
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

	const mutation = trpc.updateMemberPresence.useMutation();

	// 2. Define a submit handler.
	async function handleNextFormType() {
		const formSection = formType.replace("section", "");

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
			case "section2": {
				// ✅ This will be type-safe and validated.
				setCurrentState("submitting");

				const values = form.getValues();
				const verificationCode = values.section1.uniqueCode;

				// Submit the form.
				try {
					await mutation.mutateAsync({
						eventId,
						verificationCode,
					});

					setCurrentState("submitted");
				} catch (error) {
					console.error(error);
					setCurrentState("error");
				}

				// Informamos ao Pusher que o código de verificação foi utilizado
				try {
					await markVerificationCode({ verificationCode });
				} catch (error) {
					console.error(error);
				}

				// Send the research data to Google Sheets.
				try {
					const response = await fetch("/api/research/events", {
						method: "POST",
						body: JSON.stringify({
							data: {
								eventId,
								rating: values.section2.rating,
								comments: values.section2.comments,
							},
						}),
					});

					console.log("Response:", response);

					if (response.status !== 200) {
						console.error("Error: Invalid data.");
					}
				} catch (error) {
					console.error(error);
				}

				break;
			}
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
			<SuccessDialog
				isOpen={currentState === "submitted"}
				description={
					<>Sua presença foi confirmada com sucesso! Obrigado por participar.</>
				}
			/>
			<ErrorDialog
				isOpen={currentState === "error"}
				onClose={() => setCurrentState(false)}
				description={
					<>
						Por favor, verifique se o código de verificação está correto e tente
						novamente.
						<br />
						Caso o erro persista, entre em contato com a administração.
					</>
				}
			/>
		</Form>
	);
}
