import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

// Icons
import WarningIcon from "@/public/icons/warning.svg";
import CheckCircleIcon from "@/public/icons/check_circle.svg";

interface FormSectionProps {
	title: string;
	fields: {
		name: string;
		value?: boolean;
	}[];
	section: number;
	isSelected?: boolean;
	children?: React.ReactNode;
}

function FormSection({ children, isSelected, ...rest }: FormSectionProps) {
	const router = useRouter();

	return (
		<div
			id={`section${rest.section}`}
			className={cn(
				"flex flex-col lg:flex-row items-start justify-start gap-9 lg:gap-16 w-full transition-opacity duration-300 ease-in-out pt-4 -mt-4",
				{
					"opacity-50 select-none": !isSelected,
				}
			)}
		>
			<FormProgress {...rest} />
			<div
				className="flex flex-col justify-start items-start gap-6 p-9 w-full rounded-2xl border border-background-100 relative"
				onClick={() => {
					if (!isSelected) {
						router.replace(`?section=${rest.section}`, {
							scroll: false,
						});
						document
							.getElementById(`section${rest.section}`)
							?.scrollIntoView({
								behavior: "smooth",
							});
					} /* else {
						router.replace(`?section=${rest.section + 1}`, {
							scroll: false,
						});
						document
							.getElementById(`section${rest.section + 1}`)
							?.scrollIntoView({
								behavior: "smooth",
							});
					} */
				}}
			>
				{children}
			</div>
		</div>
	);
}

/* 
fields={Object.entries(schema.shape)
.flatMap((props) => {
    const [key, value] = props as [string, z.ZodAny];
    return value.description || key;
})
.reduce((acc, key) => ({ ...acc, [key]: false }), {})}
*/

function FormProgress({ title, section, fields }: FormSectionProps) {
	return (
		<div className="flex flex-col w-full lg:sticky top-4 left-0 lg:w-2/5 bg-background-600 rounded-2xl border border-primary-100">
			<div className="flex flex-row items-center justify-start px-6 py-[18px] bg-primary-100 rounded-tl-2xl rounded-tr-2xl">
				<h6 className="font-extrabold text-base lg:text-lg">
					{section}. {title}
				</h6>
			</div>
			<ul className="flex flex-col items-start justify-start px-9 py-[18px] gap-4">
				{fields.map((field, key) => (
					<li
						key={key}
						className={cn(
							"flex flex-row items-center justify-start gap-2 text-sm lg:text-base text-neutral select-none",
							{
								"opacity-50 text-primary-200": field.value,
							}
						)}
					>
						{field.value && <CheckCircleIcon />}
						<span className="font-semibold">{field.name}</span>
					</li>
				))}
			</ul>
		</div>
	);
}

export interface PanelProps extends React.HTMLAttributes<HTMLParagraphElement> {
	className?: string;
	type?: "error" | "warning" | "info" | "hint";
	children: React.ReactNode;
}

function Panel({ className, type = "info", children, ...rest }: PanelProps) {
	return (
		<div
			className={cn(
				"inline-flex flex-row w-full px-6 py-3 rounded-lg justify-start items-center gap-2.5 text-white",
				{
					"bg-tertiary-200 dark:bg-tertiary-200/50": type === "error",
					"bg-secondary-100 dark:bg-secondary-100/50":
						type === "warning",
					"bg-info-100 dark:bg-info-100/50": type === "info",
					"bg-primary-200 dark:bg-primary-200/50": type === "hint",
				}
			)}
		>
			{/* {
				{
					error: <WarningIcon />,
					warning: <WarningIcon />,
					info: <WarningIcon />,
					hint: <WarningIcon />,
				}[type]
			} */}
			{type === "warning" && <WarningIcon />}
			<p
				className={cn(
					"grow shrink basis-0 text-sm font-medium whitespace-pre-wrap w-full",
					className
				)}
				{...rest}
			>
				{children}
			</p>
		</div>
	);
}

export { FormSection, FormProgress, Panel };
