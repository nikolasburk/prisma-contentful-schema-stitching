const typeDefs = `
type Article {
  sys: Sys
  fields: ArticleFields
}

type ArticleCollection {
  total: Int!
  skip: Int!
  limit: Int!
  items: [Article]!
}

type ArticleFields {
  title: String
  text: String
  prismaAuthorId: String
}

type Query {
  article(id: String!): Article
  articleCollection(skip: Int = 0, limit: Int = 100): ArticleCollection
}

type Sys {
  id: String
}
`

module.exports = typeDefs