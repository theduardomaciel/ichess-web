import { cn } from "@/lib/utils";
import { z } from "zod";

interface FormSectionProps {
	title: string;
	fields: z.ZodObject<any>;
	children?: React.ReactNode;
}

function FormSection({ title, fields, children }: FormSectionProps) {
	return (
		<div className="flex flex-col items-start justify-start gap-9 w-full">
			<FormProgress
				title={title}
				fields={Object.fromEntries(
					Object.keys(fields.shape).map((field) => [field, false])
				)}
			/>
			<div className="flex flex-col justify-start items-start gap-6 p-9 w-full rounded-2xl border border-background-100">
				{children}
			</div>
		</div>
	);
}

interface FormProgressProps {
	title: FormSectionProps["title"];
	fields: {
		[key: string]: boolean;
	};
}

function FormProgress({ title, fields }: FormProgressProps) {
	return (
		<div className="flex flex-col w-full bg-background-600 rounded-2xl border border-primary-100">
			<div className="flex flex-row items-center justify-start px-6 py-[18px] bg-primary-100 rounded-tl-2xl rounded-tr-2xl">
				<h6 className="font-extrabold text-lg">{title}</h6>
			</div>
			<ul className="flex flex-col items-start justify-start px-9 py-[18px] gap-4">
				{Object.entries(fields).map(([field, completed]) => (
					<li
						key={field}
						className="flex flex-row items-center justify-start gap-2"
					>
						<span className="font-semibold">{field}</span>
						{completed ? (
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="h-5 w-5 text-primary-100"
								viewBox="0 0 20 20"
								fill="currentColor"
							>
								<path
									fillRule="evenodd"
									d="M10 18a8 8 0 100-16 8 8 0 000 16zm0-2a6 6 0 100-12 6 6 0 000 12zm-1.293-7.707a1 1 0 011.32-1.497l1.5 1a1 1 0 01-1.32 1.497l-1.5-1zm-3.5 3a1 1 0 011.32-1.497l1.5 1a1 1 0 01-1.32 1.497l-1.5-1z"
									clipRule="evenodd"
								/>
							</svg>
						) : (
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="h-5 w-5 text-background-600"
								viewBox="0 0 20 20"
								fill="currentColor"
							>
								<path
									fillRule="evenodd"
									d="M10 18a8 8 0 100-16 8 8 0 000 16zm0-2a6 6 0 100-12 6 6 0 000 12zm-1.293-7.707a1 1 0 011.32-1.497l1.5 1a1 1 0 01-1.32 1.497l-1.5-1zm-3.5 3a1 1 0 011.32-1.497l1.5 1a1 1 0 01-1.32 1.497l-1.5-1z"
									clipRule="evenodd"
								/>
							</svg>
						)}
					</li>
				))}
			</ul>
		</div>
	);
}

interface PanelProps {
	type?: "error" | "warning" | "info" | "hint";
	children: React.ReactNode;
}

function Panel({ type = "info", children }: PanelProps) {
	return (
		<div
			className={cn(
				"inline-flex w-full px-6 py-3 rounded-lg justify-start items-center gap-2.5",
				{
					"bg-tertiary-200/50": type === "error",
					"bg-secondary-100/50": type === "warning",
					"bg-info-100/50": type === "info",
					"bg-primary-200/50": type === "hint",
				}
			)}
		>
			<p className="grow shrink basis-0 text-white text-sm font-medium">
				{children}
			</p>
		</div>
	);
}

export { FormSection, FormProgress, Panel };
