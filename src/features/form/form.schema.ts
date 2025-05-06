import type { CreateIssueInput } from '@/types/generated/graphql'
import { z } from 'zod'
import { schemaForType } from '@/utils/zod'

export type ReportFields = CreateIssueInput & {
  projectIds?: string[]
}

export const ReportValidate = {
  repositoryId: z.string().min(1),
  title: z.string().min(1, { message: 'Input of title is required.' }),
  body: z.string(),
  issueTemplate: z.string().optional(),
  projectIds: z.array(z.string()).optional(),
}

export const ReportZodSchema = schemaForType<ReportFields>()(z.object(ReportValidate))
