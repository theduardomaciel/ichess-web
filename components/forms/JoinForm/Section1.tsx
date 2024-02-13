"use client";

import { useSearchParams } from "next/navigation";

// Components
import {
	type FormProps,
	FormSection,
	NextSectionButton,
} from "@/components/forms";
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

// Validation
import { isValid } from "@/validations";
import {
	type JoinFormSection1Schema,
	joinFormSection1Schema,
} from "@/validations/JoinForm/section1";

const section1Keys = Object.keys(
	joinFormSection1Schema.shape
) as (keyof JoinFormSection1Schema)[];

const formTitles = {
	name: "Nome completo",
	email: "E-mail",
	course: "Curso",
	registrationId: "Nº de matrícula",
	period: "Período",
};

export default function JoinForm1({ form }: FormProps) {
	const currentSection = useSearchParams().get("section");

	const section1 = section1Keys.map((key) => {
		return {
			name: formTitles[key],
			value: isValid(key, 1, form),
		};
	});

	return (
		<FormSection
			section={1}
			form={form}
			canSelect={true}
			isSelected={!currentSection || currentSection === "1"}
			title="Dados Pessoais"
			fields={section1}
		>
			<FormField
				control={form.control}
				name="section1.name"
				render={({ field }) => (
					<FormItem>
						<FormLabel>{formTitles.name}</FormLabel>
						<FormControl>
							<Input placeholder="Fulano da Silva" {...field} />
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>
			<FormField
				control={form.control}
				name="section1.email"
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
					name="section1.course"
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
					name="section1.registrationId"
					render={({ field }) => (
						<FormItem>
							<FormLabel>{formTitles.registrationId}</FormLabel>
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
				name="section1.period"
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
								<SelectItem value="1">1º período</SelectItem>
								<SelectItem value="2">2º período</SelectItem>
								<SelectItem value="3">3º período</SelectItem>
								<SelectItem value="4">4º período</SelectItem>
								<SelectItem value="5">5º período</SelectItem>
								<SelectItem value="6">6º período</SelectItem>
								<SelectItem value="7">7º período</SelectItem>
								<SelectItem value="8">8+ período</SelectItem>
							</SelectContent>
						</Select>
						<FormMessage />
					</FormItem>
				)}
			/>
			<NextSectionButton />
		</FormSection>
	);
}
