"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { UseFormReturn, useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { FormSection, Panel } from ".";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";
import { useCallback, useEffect } from "react";

const formSchema = z.object({
	// 1. Dados Básicos
	name: z.string({ required_error: "Obrigatório" }).min(2, {
		message: "Um nome deve conter no mínimo 2 caracteres.",
	}),
	email: z
		.string({ required_error: "Obrigatório" })
		.email({ message: "E-mail inválido." })
		.refine(
			(email) => {
				return email.endsWith("ic.ufal.br");
			},
			{
				message:
					"Eita! Parece que você não inseriu um e-mail institucional...\nPara ingressar no IChess é necessário ser discente do IC. Caso você não faça parte, mas deseja se envolver em nossas atividades, confira os Eventos abertos ao público!",
			}
		),
	course: z.enum(["cc", "ec"], { required_error: "Selecione uma opção" }),
	registrationId: z.string({ required_error: "Obrigatório" }).min(7, {
		message: "O número de matrícula é inválido.",
	}),
	period: z.enum(["1", "2", "3", "4", "5", "6", "7", "8"], {
		required_error: "Selecione uma opção",
	}),

	// 2. Experiência com Xadrez
	experience: z.enum(["inexperienced", "rookie", "competitor", "master"], {
		required_error: "Por favor, selecione uma opção",
	}),
	/* experience: z.object({
        hasPlayed: z.boolean(),
        hasStudied: z.boolean(),
        hasCompeted: z.boolean(),
    }), */
	username: z.string({ required_error: "Obrigatório" }).min(4, {
		message: "O nick do Chess.com é inválido.",
	}),

	// 3. Pesquisa
	reason: z
		.string()
		.max(250, { message: "O limite de caracteres é 250 :(" })
		.optional(),
	discovery: z.enum(["social_media", "friends", "other"]).optional(),
	discoveryOther: z.string().max(50).optional(),
});

type FormSchema = z.infer<typeof formSchema>;

const section1Keys = Object.keys(
	formSchema.pick({
		name: true,
		email: true,
		course: true,
		registrationId: true,
		period: true,
	}).shape
) as (keyof FormSchema)[];

const section2Keys = Object.keys(
	formSchema.pick({
		experience: true,
		username: true,
	}).shape
) as (keyof FormSchema)[];

const section3Keys = Object.keys(
	formSchema.pick({
		reason: true,
		discovery: true,
	}).shape
) as (keyof FormSchema)[];

const formTitles = {
	name: "Nome completo",
	email: "E-mail",
	course: "Curso",
	registrationId: "Nº de matrícula",
	period: "Período",
	experience: "Experiência",
	username: "Nick no Chess.com",
	reason: "Pergunta 1",
	discovery: "Pergunta 2",
	discoveryOther: "Outro",
};

function isValid(key: keyof FormSchema, form: UseFormReturn<FormSchema>) {
	return form.formState.dirtyFields[key] && !form.formState.errors[key];
}

export default function JoinForm() {
	// 1. Define your form.
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: "",
			email: "",
			//course: "",
			registrationId: "",
			//period: "",
			//experience: "",
			username: "",
			reason: "",
			discoveryOther: "",
		},
	});
	/// "Important: Make sure to provide defaultValues at the useForm, so hook form can have a single source of truth to compare each field's dirtiness."

	const otherIsSelected = form.watch("discovery") === "other";

	// 2. Define a submit handler.
	function onSubmit(values: z.infer<typeof formSchema>) {
		// Do something with the form values.
		// ✅ This will be type-safe and validated.
		console.log(values);
	}

	const section1 = section1Keys.map((key) => {
		return {
			name: formTitles[key],
			value: isValid(key, form),
		};
	});

	const section2 = section2Keys.map((key) => {
		return {
			name: formTitles[key],
			value: isValid(key, form),
			/* value:
				form.formState.dirtyFields[key] && !form.formState.errors[key], */
		};
	});

	const section3 = section3Keys.map((key) => {
		return {
			name: formTitles[key],
			value: isValid(key, form),
		};
	});

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="flex flex-col items-center justify-start w-full gap-9 px-wrapper py-12 lg:py-24"
			>
				<FormSection title="1. Dados Pessoais" fields={section1}>
					<FormField
						control={form.control}
						name="name"
						render={({ field }) => (
							<FormItem>
								<FormLabel>{formTitles.name}</FormLabel>
								<FormControl>
									<Input
										placeholder="Fulano da Silva"
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="email"
						render={({ field }) => (
							<FormItem>
								<FormLabel>{formTitles.email}</FormLabel>
								<FormControl>
									<Input
										type="email"
										placeholder="fulano@ic.ufal.br"
										{...field}
									/>
								</FormControl>
								<FormMessage type="warning" />
							</FormItem>
						)}
					/>
					<div className="flex flex-col lg:flex-row items-center justify-between gap-6 w-full">
						<FormField
							control={form.control}
							name="course"
							render={({ field }) => (
								<FormItem className="space-y-3">
									<FormLabel>{formTitles.course}</FormLabel>
									<FormControl>
										<RadioGroup
											onValueChange={field.onChange}
											defaultValue={field.value}
											className="flex flex-col space-y-2"
										>
											<FormItem className="flex items-center space-x-3 space-y-0">
												<FormControl>
													<RadioGroupItem value="cc" />
												</FormControl>
												<FormLabel className="font-normal">
													Ciência da Computação
												</FormLabel>
											</FormItem>
											<FormItem className="flex items-center space-x-3 space-y-0">
												<FormControl>
													<RadioGroupItem value="ec" />
												</FormControl>
												<FormLabel className="font-normal">
													Engenharia da Computação
												</FormLabel>
											</FormItem>
										</RadioGroup>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="registrationId"
							render={({ field }) => (
								<FormItem>
									<FormLabel>
										{formTitles.registrationId}
									</FormLabel>
									<FormControl>
										<Input
											type="number"
											placeholder=""
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
					<FormField
						control={form.control}
						name="period"
						render={({ field }) => (
							<FormItem>
								<FormLabel>{formTitles.period}</FormLabel>
								<Select
									onValueChange={field.onChange}
									defaultValue={field.value}
								>
									<FormControl>
										<SelectTrigger>
											<SelectValue placeholder="Selecione o período" />
										</SelectTrigger>
									</FormControl>
									<SelectContent>
										<SelectItem value="1">
											1º período
										</SelectItem>
										<SelectItem value="2">
											2º período
										</SelectItem>
										<SelectItem value="3">
											3º período
										</SelectItem>
										<SelectItem value="4">
											4º período
										</SelectItem>
										<SelectItem value="5">
											5º período
										</SelectItem>
										<SelectItem value="6">
											6º período
										</SelectItem>
										<SelectItem value="7">
											7º período
										</SelectItem>
										<SelectItem value="8">
											8+ período
										</SelectItem>
									</SelectContent>
								</Select>
								<FormMessage />
							</FormItem>
						)}
					/>
				</FormSection>
				<FormSection
					title="2. Experiência com Xadrez"
					fields={section2}
				>
					<FormField
						control={form.control}
						name="experience"
						render={({ field }) => (
							<FormItem>
								<FormLabel>{formTitles.experience}</FormLabel>
								<Select
									onValueChange={field.onChange}
									defaultValue={field.value}
								>
									<FormControl>
										<SelectTrigger>
											<SelectValue placeholder="Escolha uma opção" />
										</SelectTrigger>
									</FormControl>
									<SelectContent>
										<SelectItem value="inexperienced">
											Nunca joguei nem sei como se mexe as
											peças
										</SelectItem>
										<SelectItem value="rookie">
											Já joguei algumas vezes, mas não sei
											muita coisa
										</SelectItem>
										<SelectItem value="competitor">
											Jogo frequentemente e já participei
											de torneios
										</SelectItem>
										<SelectItem value="master">
											Sou um mestre do xadrez
										</SelectItem>
									</SelectContent>
								</Select>
								<Panel type="hint">
									Não se acanhe ao escolher uma opção! Estamos
									aqui para garantir que você aprenda e se
									divirta com o xadrez!
								</Panel>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="username"
						render={({ field }) => (
							<FormItem>
								<FormLabel>{formTitles.username}</FormLabel>
								<FormControl>
									<Input placeholder="" {...field} />
								</FormControl>
								<Panel type="info">
									Não tem uma conta no Chess.com? Crie uma em
									<a
										className="underline ml-1 break-all"
										href="https://www.chess.com/pt-BR/register"
										target="_blank"
									>
										https://www.chess.com/pt-BR/register
									</a>
								</Panel>
								<FormMessage />
							</FormItem>
						)}
					/>
				</FormSection>
				<FormSection title="3. Pesquisa" fields={section3}>
					<FormField
						control={form.control}
						name="reason"
						render={({ field }) => (
							<FormItem>
								<ResearchHeader index={2}>
									“O que fez você se inscrever no IChess?”
								</ResearchHeader>
								<FormControl>
									<Textarea
										placeholder=""
										className="resize-y"
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<div className="flex flex-col items-start justify-start gap-2 w-full">
						<FormField
							control={form.control}
							name="discovery"
							render={({ field }) => (
								<FormItem>
									<ResearchHeader index={2}>
										“Por onde você descobriu o IChess?”
									</ResearchHeader>
									<Select
										onValueChange={field.onChange}
										defaultValue={field.value}
									>
										<FormControl>
											<SelectTrigger>
												<SelectValue placeholder="Escolha uma opção" />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											<SelectItem value="social_media">
												Redes sociais
											</SelectItem>
											<SelectItem value="friends">
												Amigos
											</SelectItem>
											<SelectItem value="other">
												Outro
											</SelectItem>
										</SelectContent>
									</Select>
									<FormMessage />
								</FormItem>
							)}
						/>
						{otherIsSelected && (
							<FormField
								control={form.control}
								name="discoveryOther"
								render={({ field }) => (
									<FormItem>
										<Input
											placeholder="Outro meio"
											{...field}
										/>
										<FormMessage />
									</FormItem>
								)}
							/>
						)}
					</div>
				</FormSection>
				<Button type="submit">Submit</Button>
			</form>
		</Form>
	);
}

function ResearchHeader({
	index,
	children,
}: {
	index: number;
	children: React.ReactNode;
}) {
	return (
		<div className="flex flex-col items-start justify-start gap-2">
			<div className="flex flex-row items-center justify-between w-full">
				<FormLabel>Pergunta {index}</FormLabel>
				<p className="text-xs lg:text-sm text-muted/80">Opcional</p>
			</div>
			<FormLabel className="font-bold">{children}</FormLabel>
		</div>
	);
}
