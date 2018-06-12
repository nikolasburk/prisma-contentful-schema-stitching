const fetch = require('node-fetch')
const { Binding } = require('graphql-binding')
const { HttpLink } = require('apollo-link-http')
const { makeRemoteExecutableSchema } = require('graphql-tools')
const typeDefs = require('./generated/contentful.js')
const contentful = require('contentful-management')
const fs = require('fs')

const DELIVERY_API_BASE_URL = 'https://cdn.contentful.com'
const SPACE_ID = '9t7hdjj3yor9'
const ACCESS_TOKEN =
  '9a6ce8c14abf5777c01e7c39a67d9bea3b491af2eb8647ca08c9ec26ba8a23b1'
const LOCALE_CODE = 'en-US'
const CMA_TOKEN = `CFPAT-XXX` // replace this with your own CFPAT

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
