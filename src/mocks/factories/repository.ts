import { GetRepositoryQuery } from '@/types/generated/graphql'

export function repositoryFactory(): GetRepositoryQuery {
  return {
    repository: {
      __typename: 'Repository',
      id: 'R_abcde123',
      name: 'repository-name',
      assignableUsers: {
        __typename: 'UserConnection',
        totalCount: 1,
        nodes: [{ __typename: 'User', id: 'xxxxxxxxxxxxx', name: 'user' }],
      },
      projects: {
        __typename: 'ProjectConnection',
        totalCount: 0,
        nodes: [],
      },
      labels: {
        __typename: 'LabelConnection',
        totalCount: 9,
        nodes: [
          { __typename: 'Label', id: 'LA_xxxxxxxxxxxxx', name: 'bug' },
          {
            __typename: 'Label',
            id: 'LA_1xxxxxxxxxxxxx',
            name: 'documentation',
          },
          {
            __typename: 'Label',
            id: 'LA_2xxxxxxxxxxxxx',
            name: 'duplicate',
          },
          {
            __typename: 'Label',
            id: 'LA_3xxxxxxxxxxxxx',
            name: 'enhancement',
          },
          {
            __typename: 'Label',
            id: 'LA_4xxxxxxxxxxxxx',
            name: 'help wanted',
          },
          {
            __typename: 'Label',
            id: 'LA_5xxxxxxxxxxxxx',
            name: 'good first issue',
          },
          {
            __typename: 'Label',
            id: 'LA_6xxxxxxxxxxxxx',
            name: 'invalid',
          },
          {
            __typename: 'Label',
            id: 'LA_7xxxxxxxxxxxxx',
            name: 'question',
          },
          {
            __typename: 'Label',
            id: 'LA_8xxxxxxxxxxxxx',
            name: 'wontfix',
          },
        ],
      },
      issueTemplates: [
        {
          __typename: 'IssueTemplate',
          body: '',
          name: 'Bug issue template',
          title: '【BUG】',
        },
        {
          __typename: 'IssueTemplate',
          body: '### Task list\n- [ ] Implementation of some kind.\n- [ ] Update of any kind.',
          name: 'Custom issue template',
          title: 'Tasks',
        },
      ],
    },
  }
}
