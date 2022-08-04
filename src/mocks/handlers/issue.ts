import { graphql } from 'msw'
import { CreateIssueMutation, CreateIssueMutationVariables } from '@/types/generated/graphql'
import { issueFactory } from '../factories/issue'

export const issueHandlers = [
  graphql.mutation<CreateIssueMutation, CreateIssueMutationVariables>('CreateIssue', (req, res, ctx) => {
    return res(
      ctx.data({
        ...issueFactory(),
      })
    )
  }),
]
