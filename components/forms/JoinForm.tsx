"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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

const formSchema = z.object({
	// 1. Dados Básicos
	name: z.string().min(2, {
		message: "Username must be at least 2 characters.",
	}),
	email: z.string().email(),
	course: z.enum(["cc", "ec"]),
	registrationId: z.string(),
	period: z.number().int().gte(1).lte(8),

	// 2. Experiência com Xadrez
	experience: z.enum(["inexperienced", "rookie", "competitor", "master"]),
	/* experience: z.object({
        hasPlayed: z.boolean(),
        hasStudied: z.boolean(),
        hasCompeted: z.boolean(),
    }), */
	username: z.string().min(2, {
		message: "Username must be at least 2 characters.",
	}),

	// 3. Pesquisa
	reason: z.string().optional(),
	discovery: z.string().optional(),
});

export default function JoinForm() {
	// 1. Define your form.
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: "",
		},
	});

	// 2. Define a submit handler.
	function onSubmit(values: z.infer<typeof formSchema>) {
		// Do something with the form values.
		// ✅ This will be type-safe and validated.
		console.log(values);
	}

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="flex flex-col items-center justify-start w-full gap-9 px-wrapper py-12"
			>
				<FormSection
					title="1. Dados Pessoais"
					fields={formSchema.pick({
						name: true,
					})}
				>
					<FormField
						control={form.control}
						name="name"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Nome completo</FormLabel>
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
								<FormLabel>E-mail</FormLabel>
								<FormControl>
									<Input
										type="email"
										placeholder="fulano@ic.ufal.br"
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="course"
						render={({ field }) => (
							<FormItem className="space-y-3">
								<FormLabel>Curso</FormLabel>
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
				</FormSection>
				<Button type="submit">Submit</Button>
			</form>
		</Form>
	);
}
