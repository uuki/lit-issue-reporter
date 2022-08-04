import { repositoryHandlers } from './repository'
import { issueHandlers } from './issue'
import { postHandlers } from './post'

export const handlers = [...postHandlers, ...repositoryHandlers, ...issueHandlers]
