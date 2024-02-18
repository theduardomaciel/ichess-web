"use client";

import { useSearchParams } from "next/navigation";
import { UseFormReturn } from "react-hook-form";

// Components
import {
	type FormProps,
	FormSection,
	SectionFooter,
	Panel,
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

// Validation
import { isValid } from "@/lib/validations";
import {
	type PresenceFormSection2Schema,
	presenceFormSection2Schema,
} from "@/lib/validations/PresenceForm/section2";

const section2Keys = Object.keys(
	presenceFormSection2Schema.shape
) as (keyof PresenceFormSection2Schema)[];

const formTitles = {
	uniqueCode: "Código único",
};

export default function PresenceForm2({ form }: FormProps) {
	const currentSection = useSearchParams().get("section");

	const section2 = section2Keys.map((key) => {
		return {
			name: formTitles[key],
			value: isValid(key, 2, form),
		};
	});

	return (
		<FormSection
			form={form}
			canSelect={
				!isNaN(Number(currentSection)) && Number(currentSection) > 1
			}
			section={2}
			isSelected={currentSection === "2"}
			title="Validação"
			fields={section2}
		>
			<FormField
				control={form.control}
				name="section2.uniqueCode"
				render={({ field }) => (
					<FormItem>
						<FormLabel>Código Único</FormLabel>
						<FormControl>
							<Input
								type="text"
								inputMode="numeric"
								placeholder="Ex: 123456"
								className="w-full"
								maxLength={6}
								{...field}
							/>
						</FormControl>
						<Panel type="info" showIcon>
							Você pode encontrar esse código procurando um
							moderador durante o evento atual!
						</Panel>
						<FormMessage />
					</FormItem>
				)}
			/>
			<SectionFooter />
		</FormSection>
	);
}
/* 
<ul className="flex flex-row items-center justify-between w-full gap-2.5">
	{Array.from({ length: 6 }).map((_, index) => (
		<li
			key={index}
			className="flex items-center justify-center w-full"
		>
			<Input
				type="text"
				inputMode="numeric"
				name={`${field.name}[${index}]`}
				value={
					field.value?.split("")[index] ??
					""
				}
				placeholder="_"
				onChange={(e) => {
					const value = e.target.value;
					console.log(
						`${field.value}${value}`
					);
					form.setValue(
						field.name,
						`${
							field.value || ""
						}${value}`
					);
				}}
				maxLength={1}
				className="px-6 py-16 text-center text-base lg:text-6xl font-extrabold"
			/>
		</li>
	))}
</ul> 
*/
