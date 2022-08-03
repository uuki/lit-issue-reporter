export type IssueReporterLocale = {
  app: {
    title: string
    overview: string
  }
  fields: {
    template: {
      description?: string
      placeholder: string
    }
    title: {
      description?: string
      placeholder: string
    }
    body: {
      description?: string
      placeholder: string
    }
  }
  ui: {
    screenshot: {
      title: string
    }
    submit: {
      text: string
    }
    cancel: {
      text: string
    }
  }
  errors: {
    connection: string
  }
}
