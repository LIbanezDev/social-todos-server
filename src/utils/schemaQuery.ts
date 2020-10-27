export const schemaQuery = `
    {
  __schema{
    queryType {
    fields {
        name
      }
    }
    mutationType {
      fields {
        name
      }
    }
    subscriptionType {
      fields {
        name
      }
    }
    types {
      kind
      name
      fields {
        name
      }
    }
  }
}
`
