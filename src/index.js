const ContentfulBinding = require('./ContentfulBinding')
const { Prisma } = require('prisma-binding')
const { GraphQLServer } = require('graphql-yoga')

const resolvers = {
  Query: {
    user: (root, args, context, info) =>
      context.db.query.user({ where: { id: args.id } }, info),
    article: async (root, args, context, info) => {
      return context.cf.query.article(
        { id: args.id },
        `{sys{id}fields{title text prismaAuthorId}}`,
      )
    },
  },
  Mutation: {
    createUser: (root, args, context, info) => {
      return context.db.mutation.createUser({ data: { name: args.name } }, info)
    },
    createArticleForUser: async (root, args, context, info) => {
      const userExists = await context.db.exists.User({
        id: args.prismaAuthorId,
      })
      if (!userExists) {
        throw new Error(`No Prisma user found for id: ${args.prismaAuthorId}`)
      }
      return context.cf.createArticle(
        args.title,
        args.text,
        args.prismaAuthorId,
      )
    },
  },
  Article: {
    sysId: root => root.sys.id,
    title: root => root.fields.title,
    text: root => root.fields.text,
    prismaAuthor: (root, args, context, info) => {
      return context.db.query.user({
        where: { id: root.fields.prismaAuthorId },
      })
    },
  },
}

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers,
  resolverValidationOptions: {
    requireResolversForResolveType: false
  },
  context: req => ({
    ...req,
    db: new Prisma({
      typeDefs: './src/generated/prisma.graphql',
      endpoint: '__PRISMA_ENDPOINT__',
    }),
    cf: new ContentfulBinding(),
  }),
})

server.start(() => console.log(`Server is running on http://localhost:4000`))
