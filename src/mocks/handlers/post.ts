import { rest } from 'msw'
import { repositoryFactory } from '../factories/repository'
import { issueFactory } from '../factories/issue'

const RESPONSES: { [key in RestRequest['operationName']]: any } = {
  CreateIssue: issueFactory(),
  getRepository: repositoryFactory(),
}

type RestRequest = {
  operationName: string
  query: string
  variables: any
}

export const postHandlers = [
  rest.post('https://api.github.com/graphql', (req, res, ctx) => {
    const data = JSON.parse((req as any).body) as RestRequest
    return res(
      ctx.json({
        data: {
          ...RESPONSES[data.operationName],
        },
      })
    )
  }),
]
