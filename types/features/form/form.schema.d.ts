import type { CreateIssueInput } from '@/types/generated/graphql';
import { z } from 'zod';
export declare type ReportFields = CreateIssueInput;
export declare const ReportValidate: {
    repositoryId: z.ZodString;
    title: z.ZodString;
    body: z.ZodString;
    issueTemplate: z.ZodOptional<z.ZodString>;
};
export declare const ReportZodSchema: z.ZodObject<{
    repositoryId: z.ZodString;
    title: z.ZodString;
    body: z.ZodString;
    issueTemplate: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    issueTemplate?: string | undefined;
    body: string;
    title: string;
    repositoryId: string;
}, {
    issueTemplate?: string | undefined;
    body: string;
    title: string;
    repositoryId: string;
}>;
