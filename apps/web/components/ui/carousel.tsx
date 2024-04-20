"use client";

import * as React from "react";
import useEmblaCarousel, {
	type UseEmblaCarouselType,
} from "embla-carousel-react";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type CarouselApi = UseEmblaCarouselType[1];
type UseCarouselParameters = Parameters<typeof useEmblaCarousel>;
type CarouselOptions = UseCarouselParameters[0];
type CarouselPlugin = UseCarouselParameters[1];

type CarouselProps = {
	opts?: CarouselOptions;
	plugins?: CarouselPlugin;
	orientation?: "horizontal" | "vertical";
	setApi?: (api: CarouselApi) => void;
};

type CarouselContextProps = {
	carouselRef: ReturnType<typeof useEmblaCarousel>[0];
	api: ReturnType<typeof useEmblaCarousel>[1];
	scrollPrev: () => void;
	scrollNext: () => void;
	canScrollPrev: boolean;
	canScrollNext: boolean;
	selectedIndex: number;
} & CarouselProps;

const CarouselContext = React.createContext<CarouselContextProps | null>(null);

function useCarousel() {
	const context = React.useContext(CarouselContext);

	if (!context) {
		throw new Error("useCarousel must be used within a <Carousel />");
	}

	return context;
}

const Carousel = React.forwardRef<
	HTMLDivElement,
	React.HTMLAttributes<HTMLDivElement> & CarouselProps
>(
	(
		{
			orientation = "horizontal",
			opts,
			setApi,
			plugins,
			className,
			children,
			...props
		},
		ref,
	) => {
		const [carouselRef, api] = useEmblaCarousel(
			{
				...opts,
				axis: orientation === "horizontal" ? "x" : "y",
			},
			plugins,
		);
		const [canScrollPrev, setCanScrollPrev] = React.useState(false);
		const [canScrollNext, setCanScrollNext] = React.useState(false);
		const [selectedIndex, setSelectedIndex] = React.useState(0);

		const tweenOpacity = React.useCallback((api: CarouselApi) => {
			if (!api) {
				return;
			}

			api.scrollSnapList().forEach((_, slideIndex) => {
				const slide = api.slideNodes()[slideIndex];
				slide.style.opacity =
					slideIndex === api.selectedScrollSnap() ? "1" : "0.25";
			});
		}, []);

		const onSelect = React.useCallback(
			(api: CarouselApi) => {
				if (!api) {
					return;
				}

				setCanScrollPrev(api.canScrollPrev());
				setCanScrollNext(api.canScrollNext());
				setSelectedIndex(api.selectedScrollSnap());

				tweenOpacity(api);
			},
			[tweenOpacity],
		);

		const scrollPrev = React.useCallback(() => {
			api?.scrollPrev();
		}, [api]);

		const scrollNext = React.useCallback(() => {
			api?.scrollNext();
		}, [api]);

		const handleKeyDown = React.useCallback(
			(event: React.KeyboardEvent<HTMLDivElement>) => {
				if (event.key === "ArrowLeft") {
					event.preventDefault();
					scrollPrev();
				} else if (event.key === "ArrowRight") {
					event.preventDefault();
					scrollNext();
				}
			},
			[scrollPrev, scrollNext],
		);

		React.useEffect(() => {
			if (!api || !setApi) {
				return;
			}

			setApi(api);
		}, [api, setApi]);

		React.useEffect(() => {
			if (!api) {
				return;
			}

			onSelect(api);
			api.on("init", onSelect);
			api.on("reInit", onSelect);
			api.on("select", onSelect);
			api.on("scroll", tweenOpacity);

			return () => {
				api?.off("select", onSelect);
			};
		}, [api, onSelect, tweenOpacity]);

		return (
			<CarouselContext.Provider
				value={{
					carouselRef,
					api,
					opts,
					orientation:
						orientation ||
						(opts?.axis === "y" ? "vertical" : "horizontal"),
					scrollPrev,
					scrollNext,
					canScrollPrev,
					canScrollNext,
					selectedIndex,
				}}
			>
				<div
					ref={ref}
					onKeyDownCapture={handleKeyDown}
					className={cn("relative", className)}
					role="region"
					aria-roledescription="carousel"
					{...props}
				>
					{children}
				</div>
			</CarouselContext.Provider>
		);
	},
);
Carousel.displayName = "Carousel";

const CarouselContent = React.forwardRef<
	HTMLDivElement,
	React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
	const { carouselRef, orientation } = useCarousel();

	return (
		<div ref={carouselRef} className="overflow-hidden">
			<div
				ref={ref}
				className={cn(
					"flex",
					orientation === "horizontal" ? "-ml-4" : "-mt-4 flex-col",
					className,
				)}
				{...props}
			/>
		</div>
	);
});
CarouselContent.displayName = "CarouselContent";

const CarouselItem = React.forwardRef<
	HTMLDivElement,
	React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
	const { orientation } = useCarousel();

	return (
		<div
			ref={ref}
			role="group"
			aria-roledescription="slide"
			className={cn(
				"min-w-0 shrink-0 grow-0 basis-full transition-opacity ",
				orientation === "horizontal" ? "pl-4" : "pt-4",
				className,
			)}
			{...props}
		/>
	);
});
CarouselItem.displayName = "CarouselItem";

const AbsoluteCarouselPrevious = React.forwardRef<
	HTMLButtonElement,
	React.ComponentProps<typeof Button>
>(({ className, variant = "outline", size = "icon", ...props }, ref) => {
	const { orientation, scrollPrev, canScrollPrev } = useCarousel();

	return (
		<Button
			ref={ref}
			variant={variant}
			size={size}
			className={cn(
				"absolute  h-8 w-8 rounded-full",
				orientation === "horizontal"
					? "-left-12 top-1/2 -translate-y-1/2"
					: "-top-12 left-1/2 -translate-x-1/2 rotate-90",
				className,
			)}
			disabled={!canScrollPrev}
			onClick={scrollPrev}
			{...props}
		>
			<ArrowLeft className="h-4 w-4" />
			<span className="sr-only">Slide anterior</span>
		</Button>
	);
});
AbsoluteCarouselPrevious.displayName = "CarouselPrevious";

const AbsoluteCarouselNext = React.forwardRef<
	HTMLButtonElement,
	React.ComponentProps<typeof Button>
>(({ className, variant = "outline", size = "icon", ...props }, ref) => {
	const { orientation, scrollNext, canScrollNext } = useCarousel();

	return (
		<Button
			ref={ref}
			variant={variant}
			size={size}
			className={cn(
				"absolute h-8 w-8 rounded-full",
				orientation === "horizontal"
					? "-right-12 top-1/2 -translate-y-1/2"
					: "-bottom-12 left-1/2 -translate-x-1/2 rotate-90",
				className,
			)}
			disabled={!canScrollNext}
			onClick={scrollNext}
			{...props}
		>
			<ArrowRight className="h-4 w-4" />
			<span className="sr-only">Próximo slide</span>
		</Button>
	);
});
AbsoluteCarouselNext.displayName = "CarouselNext";

interface CarouselControlProps extends React.ComponentProps<typeof Button> {
	direction: "prev" | "next";
}

const CarouselControl = React.forwardRef<
	HTMLButtonElement,
	CarouselControlProps
>(
	(
		{ className, variant = "outline", size = "icon", direction, ...props },
		ref,
	) => {
		const { scrollPrev, canScrollPrev, scrollNext, canScrollNext } =
			useCarousel();

		return (
			<Button
				ref={ref}
				variant={variant}
				size={size}
				className={cn("relative h-10 w-10 rounded-md p-0", className)}
				disabled={
					direction === "prev" ? !canScrollPrev : !canScrollNext
				}
				onClick={direction === "prev" ? scrollPrev : scrollNext}
				{...props}
			>
				{direction === "prev" ? (
					<ArrowLeft className="h-4 w-4" />
				) : (
					<ArrowRight className="h-4 w-4" />
				)}
				<span className="sr-only">
					Slide {direction === "prev" ? "anterior" : "seguinte"}
				</span>
			</Button>
		);
	},
);
CarouselControl.displayName = "CarouselControl";

const CarouselDotButtons = React.forwardRef<
	HTMLDivElement,
	React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
	const { api, selectedIndex } = useCarousel();

	if (!api) {
		return null;
	}

	const dots = Array.from(
		{ length: api.scrollSnapList().length },
		(_, i) => i,
	);

	return (
		<div
			ref={ref}
			className={cn(
				"flex flex-row items-center justify-end gap-2",
				className,
			)}
			{...props}
		>
			{dots.map((_, index) => (
				<button
					key={index}
					className={cn(
						"flex h-3 w-3 rounded-full",
						"bg-gray-300 transition-colors",
						{
							"hover:bg-gray-400": index !== selectedIndex,
							"bg-primary-100": index === selectedIndex,
						},
					)}
					onClick={() => api.scrollTo(index)}
				/>
			))}
		</div>
	);
});
CarouselDotButtons.displayName = "CarouselDotButtons";

export {
	type CarouselApi,
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselControl,
	AbsoluteCarouselPrevious,
	AbsoluteCarouselNext,
	CarouselDotButtons,
};
