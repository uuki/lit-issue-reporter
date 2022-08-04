import { graphql } from 'msw'
import { GetRepositoryQuery, GetRepositoryQueryVariables } from '@/types/generated/graphql'
import { repositoryFactory } from '../factories/repository'

type GetRepositoryResult = { data: GetRepositoryQuery; error: null; loading: boolean }

export const repositoryHandlers = [
  graphql.query<GetRepositoryResult, GetRepositoryQueryVariables>('getRepository', (req, res, ctx) => {
    // const { name, owner } = req.variables
    return res(
      ctx.data({
        data: {
          ...repositoryFactory(),
        },
        error: null,
        loading: false,
      })
    )
  }),
]
