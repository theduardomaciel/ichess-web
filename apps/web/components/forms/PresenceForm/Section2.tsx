"use client";

import { useSearchParams } from "next/navigation";

// Components
import {
	FormSection,
	SectionFooter,
	ResearchHeader,
	type GenericForm,
} from "@/components/forms";
import {
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

// Faces
import Face1 from "@/public/faces/rate1.svg";
import Face2 from "@/public/faces/rate2.svg";
import Face3 from "@/public/faces/rate3.svg";
import Face4 from "@/public/faces/rate4.svg";
import Face5 from "@/public/faces/rate5.svg";

const faces = [Face1, Face2, Face3, Face4, Face5];

// Validation
import { isValid } from "@/lib/validations";
import {
	type PresenceFormSection2Schema,
	presenceFormSection2Schema,
} from "@/lib/validations/PresenceForm/section2";
import { cn } from "@/lib/utils";

const section2Keys = Object.keys(
	presenceFormSection2Schema.shape,
) as (keyof PresenceFormSection2Schema)[];

const formTitles = {
	rating: "Classificação",
	comments: "Comentários",
};

export default function PresenceForm2({ form }: { form: GenericForm }) {
	const currentSection = useSearchParams().get("section");
	const otherIsSelected = form.watch("section2.discovery") === "other";

	const section2 = section2Keys.map((key) => {
		return {
			name: formTitles[key],
			value: isValid(key, 2, form),
		};
	});

	return (
		<FormSection title="Avaliação" section={2} form={form} fields={section2}>
			<FormField
				control={form.control}
				name="section2.rating"
				render={({ field }) => (
					<FormItem>
						<ResearchHeader index={1}>
							&quot;De 1 a 5, como você classificaria o evento de hoje?&quot;
						</ResearchHeader>
						<FormControl>
							<ul className="flex flex-row items-center justify-between w-full gap-2 flex-wrap">
								{faces.map((Face, index) => (
									<li key={Face}>
										<Face
											className={cn(
												"w-12 h-12 md:w-24 md:h-24 filter sepia hover:filter-none transition-[filter] duration-100 ease-in-out cursor-pointer",
												{
													"filter-none": field.value === index + 1,
												},
											)}
											onClick={() => {
												field.onChange(index + 1);
											}}
										/>
										<Input
											id={`${field.name}${index}`}
											type="radio"
											value={index + 1}
											className="opacity-0 absolute top-0 left-0 -z-20 pointer-events-none select-none"
										/>
									</li>
								))}
							</ul>
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>
			<div className="flex flex-col items-start justify-start gap-2 w-full">
				<FormField
					control={form.control}
					name="section2.comments"
					render={({ field }) => (
						<FormItem>
							<ResearchHeader index={2}>
								&quot;Você tem alguma sugestão do que poderia ter sido melhor
								durante o evento?&quot;
							</ResearchHeader>
							<FormControl>
								<Textarea placeholder="" className="resize-y" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
			</div>
			<SectionFooter isFinalSection />
		</FormSection>
	);
}
