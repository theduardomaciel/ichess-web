import { z } from "zod";

import {
	type PresenceFormSection1Schema,
	presenceFormSection1Schema,
} from "@/lib/validations/PresenceForm/section1";

import {
	type PresenceFormSection2Schema,
	presenceFormSection2Schema,
} from "@/lib/validations/PresenceForm/section2";

import {
	type PresenceFormSection3Schema,
	presenceFormSection3Schema,
} from "@/lib/validations/PresenceForm/section3";

export enum PresenceFormTypeEnum {
	Section1 = "section1",
	Section2 = "section2",
	Section3 = "section3",
}

export const presenceFormSchema = z.discriminatedUnion("formType", [
	z.object({
		formType: z.literal(PresenceFormTypeEnum.Section1),
		section1: presenceFormSection1Schema,
	}),
	z.object({
		formType: z.literal(PresenceFormTypeEnum.Section2),
		section2: presenceFormSection2Schema,
	}),
	z.object({
		formType: z.literal(PresenceFormTypeEnum.Section3),
		section3: presenceFormSection3Schema,
	}),
]);

export type PresenceFormSchema = {
	formType: PresenceFormTypeEnum;
	section1: PresenceFormSection1Schema;
	section2: PresenceFormSection2Schema;
	section3: PresenceFormSection3Schema;
};
