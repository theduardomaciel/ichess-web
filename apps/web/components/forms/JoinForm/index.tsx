"use client";

import { useState } from "react";
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
import JoinForm0 from "./Section0";

// Validation
import {
	type JoinFormSchema,
	JoinFormTypeEnum,
	joinFormSchema,
} from "@/lib/validations/JoinForm";

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
				name: user?.name || "",
			},
		},
	})

	async function submitData() {
		setCurrentState("submitting");

		if (!user) {
			console.error("User not found.");
			setCurrentState(false);
			return;
		}

		// ✅ This will be type-safe and validated.
		const values = form.getValues();

		// Send the data to the server.
		try {
			await mutation.mutateAsync({
				name: values.section0.name,
				course: "cc",
				registrationId: "123456",
				period: "1",
				experience: "advanced",
				username: user.name || "",
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
		submitData();
	}

	return (
		<Form {...form}>
			<FormWrapper>
				<form onSubmit={form.handleSubmit(handleNextFormType)}>
					<JoinForm0
						form={form as unknown as GenericForm}
						email={user?.email}
					/>
				</form>
			</FormWrapper>
			<LoadingDialog
				isOpen={currentState === "submitting"}
				title="Estamos realizando seu cadastro..."
			/>
			<SuccessDialog
				isOpen={currentState === "submitted"}
				description={
					<>
						Seu cadastro foi realizado com sucesso! 🎉
						<br />
						Avise um moderador para que você possa ser promovido a administrador.
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
