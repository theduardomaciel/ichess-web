import { z } from "zod";

import {
	type PresenceFormSection0Schema,
	presenceFormSection0Schema,
} from "@/lib/validations/PresenceForm/section0";

import {
	type PresenceFormSection1Schema,
	presenceFormSection1Schema,
} from "@/lib/validations/PresenceForm/section1";

import {
	type PresenceFormSection2Schema,
	presenceFormSection2Schema,
} from "@/lib/validations/PresenceForm/section2";

export enum PresenceFormTypeEnum {
	Section0 = "section0",
	Section1 = "section1",
	Section2 = "section2",
}

export const presenceFormSchema = z.discriminatedUnion("formType", [
	z.object({
		formType: z.literal(PresenceFormTypeEnum.Section0),
		section0: presenceFormSection0Schema,
	}),
	z.object({
		formType: z.literal(PresenceFormTypeEnum.Section1),
		section1: presenceFormSection1Schema,
	}),
	z.object({
		formType: z.literal(PresenceFormTypeEnum.Section2),
		section2: presenceFormSection2Schema,
	}),
]);

export type PresenceFormSchema = {
	formType: PresenceFormTypeEnum;
	section0: PresenceFormSection0Schema;
	section1: PresenceFormSection1Schema;
	section2: PresenceFormSection2Schema;
};
