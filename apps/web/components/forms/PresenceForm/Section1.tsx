"use client";

// Components
import {
	FormSection,
	SectionFooter,
	Panel,
	type GenericForm,
} from "@/components/forms";
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

// Validation
import { isValid } from "@/lib/validations";
import {
	type PresenceFormSection1Schema,
	presenceFormSection1Schema,
} from "@/lib/validations/PresenceForm/section1";

const section1Keys = Object.keys(
	presenceFormSection1Schema.shape,
) as (keyof PresenceFormSection1Schema)[];

const formTitles = {
	uniqueCode: "Código único",
};

export default function PresenceForm1({ form }: { form: GenericForm }) {
	const formSection = form.watch("formType");
	const sectionNumber = formSection?.replace("section", "");

	const section1 = section1Keys.map((key) => {
		return {
			name: formTitles[key],
			value: isValid(key, 1, form),
		};
	});

	return (
		<FormSection title="Validação" section={1} form={form} fields={section1}>
			<FormField
				control={form.control}
				name="section1.uniqueCode"
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
							Você pode encontrar esse código procurando um moderador durante o
							evento atual!
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
<ul className="flex flex-row items-center justify-between w-full gap-1.5">
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
