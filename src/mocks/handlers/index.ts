import { graphql } from 'msw'
import { GetRepositoryQuery, GetRepositoryQueryVariables } from '@/types/generated/graphql'
import { repositoryFactory } from '../factories/repository'

type GetRepositoryResult = { data: GetRepositoryQuery; error: null; loading: boolean }

export const handlers = [
  graphql.query<GetRepositoryResult, GetRepositoryQueryVariables>('getRepository', (req, res, ctx) => {
    const { name, owner } = req.variables
    console.log('[msw] on query', name, owner)

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
