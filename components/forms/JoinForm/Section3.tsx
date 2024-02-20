"use client";

import { useSearchParams } from "next/navigation";

// Components
import {
	type FormProps,
	FormSection,
	SectionFooter,
	ResearchHeader,
} from "@/components/forms";
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

// Validation
import { isValid } from "@/lib/validations";
import {
	type JoinFormSection3Schema,
	joinFormSection3Schema,
} from "@/lib/validations/JoinForm/section3";

const section3Keys = Object.keys(
	joinFormSection3Schema.shape
) as (keyof JoinFormSection3Schema)[];

const formTitles = {
	reason: "Pergunta 1",
	discovery: "Pergunta 2",
	discoveryOther: undefined,
};

export default function JoinForm3({ form }: FormProps) {
	const formSection = form.watch("formType");
	const otherIsSelected = form.watch("section3.discovery") === "other";

	const section3 = section3Keys.map((key) => {
		return {
			name: formTitles[key],
			value: isValid(key, 3, form),
		};
	});

	return (
		<FormSection title="Pesquisa" section={3} form={form} fields={section3}>
			<FormField
				control={form.control}
				name="section3.reason"
				render={({ field }) => (
					<FormItem>
						<ResearchHeader index={1}>
							&quot;O que fez você se inscrever no IChess?&quot;
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
					name="section3.discovery"
					render={({ field }) => (
						<FormItem>
							<ResearchHeader index={2}>
								&quot;Por onde você descobriu o IChess?&quot;
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
									<SelectItem value="other">Outro</SelectItem>
								</SelectContent>
							</Select>
							<FormMessage />
						</FormItem>
					)}
				/>
				{otherIsSelected && (
					<FormField
						control={form.control}
						name="section3.discoveryOther"
						render={({ field }) => (
							<FormItem>
								<Input placeholder="Outro meio" {...field} />
								<FormMessage />
							</FormItem>
						)}
					/>
				)}
			</div>
			<SectionFooter isFinalSection />
		</FormSection>
	);
}
