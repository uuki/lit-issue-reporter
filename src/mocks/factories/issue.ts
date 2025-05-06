import { CreateIssueMutation } from '@/types/generated/graphql'

export function issueFactory(): CreateIssueMutation {
  return {
    createIssue: {
      issue: {
        number: 1,
        // 05:Issue123456
        id: 'MDU6SXNzdWUxMjM0NTY=',
        __typename: 'Issue',
      },
      __typename: 'CreateIssuePayload',
    },
  }
}
