import { z } from "zod";

import {
	type JoinFormSection1Schema,
	joinFormSection1Schema,
} from "@/lib/validations/JoinForm/section1";

import {
	type JoinFormSection2Schema,
	joinFormSection2Schema,
} from "@/lib/validations/JoinForm/section2";

import {
	type JoinFormSection3Schema,
	joinFormSection3Schema,
} from "@/lib/validations/JoinForm/section3";

export enum JoinFormTypeEnum {
	Section0 = "section0",
	Section1 = "section1",
	Section2 = "section2",
	Section3 = "section3",
}

export const joinFormSchema = z.discriminatedUnion("formType", [
	z.object({
		formType: z.literal(JoinFormTypeEnum.Section1),
		section1: joinFormSection1Schema,
	}),
	z.object({
		formType: z.literal(JoinFormTypeEnum.Section2),
		section2: joinFormSection2Schema,
	}),
	z.object({
		formType: z.literal(JoinFormTypeEnum.Section3),
		section3: joinFormSection3Schema,
	}),
]);

export type JoinFormSchema = {
	formType: JoinFormTypeEnum;
	section1: JoinFormSection1Schema;
	section2: JoinFormSection2Schema;
	section3: JoinFormSection3Schema;
};
