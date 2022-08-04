import { CreateIssueMutation } from '@/types/generated/graphql'

export function issueFactory(): CreateIssueMutation {
  return {
    createIssue: {
      issue: {
        number: 1,
        __typename: 'Issue',
      },
      __typename: 'CreateIssuePayload',
    },
  }
}
