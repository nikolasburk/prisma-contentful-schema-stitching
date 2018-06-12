const fetch = require('node-fetch')
const { Binding } = require('graphql-binding')
const { HttpLink } = require('apollo-link-http')
const { makeRemoteExecutableSchema } = require('graphql-tools')
const typeDefs = require('./generated/contentful.js')
const contentful = require('contentful-management')
const fs = require('fs')

const DELIVERY_API_BASE_URL = 'https://cdn.contentful.com'
const SPACE_ID = '__CONTENTFUL_SPACE_ID__'
const ACCESS_TOKEN =
  '__CONTENTFUL_ACCESS_TOKEN__'
const LOCALE_CODE = 'en-US'
const CMA_TOKEN = `__CONTENTFUL_CONTENT_MANAGEMENT_TOKEN__` // replace this with your own CFPAT

class ContentfulBinding extends Binding {
  constructor() {
    const endpoint = `${DELIVERY_API_BASE_URL}/spaces/${SPACE_ID}/graphql/alpha?locale=${LOCALE_CODE}`
    const link = new HttpLink({
      fetch,
      uri: endpoint,
      headers: {
        Authorization: `Bearer ${ACCESS_TOKEN}`,
      },
    })

    const schema = makeRemoteExecutableSchema({ link, schema: typeDefs })

    super({
      schema,
    })
  }

  async createArticle(title, text, prismaAuthorId) {
    const client = contentful.createClient({
      accessToken: CMA_TOKEN,
    })
    const space = await client.getSpace(SPACE_ID)
    const entry = await space.createEntry('article', {
      fields: {
        title: {
          'en-US': title,
        },
        text: {
          'en-US': text,
        },
        prismaAuthorId: {
          'en-US': prismaAuthorId,
        },
      },
    })
    await entry.publish()
    return {
      sys: {
        id: entry.sys.id,
      },
      fields: {
        title: entry.fields.title['en-US'],
        text: entry.fields.text['en-US'],
        prismaAuthorId: entry.fields.prismaAuthorId['en-US'],
      },
    }
  }

}

module.exports = ContentfulBinding
