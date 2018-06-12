# prisma-contentful-schema-stitching

This repository contains a GraphQL API that is composed of two GraphQL APIs (from Prisma & Contentful) using schema stitching (via GraphQL bindings).

## Usage

### 1. Clone the repo & install dependencies

```bash
git clone git@github.com:nikolasburk/prisma-contentful-schema-stitching.git
cd prisma-contentful-schema-stitching
yarn install
```

### 2. Deploy the Prisma service

```bash
npm install -g prisma # install the Prisma CLI if necessary
prisma deploy
```

When prompted by the CLI where to deploy the service, select the **Demo server** and register with Prisma Cloud. If you have Docker installed, you can also deploy locally.

Once the command has finished, the Prisma CLI writes the `endpoint` property to [`prisma.yml`](./prisma/prisma.yml).

### 3. Create your Contentful API

In the [Contentful app](https://app.contentful.com/), create a new _space_ and create an `Article` content model that looks similar to this:

![](https://imgur.com/ysfCKmx.png)

### 4. Replace placeholer values

To connect the GraphQL server with the Prisma and Contentful APIs, you need to replace a few placeholder values in the code.

#### Prisma

Replace the following placeholder:

- `__PRISMA_ENDPOINT__` in [`src/index.js`](./src/index.js) with the `endpoint` from [`prisma.yml`](./prisma/prisma.yml)

#### Contentful

Replace the following placeholders:

- `__CONTENTFUL_ACCESS_TOKEN__` in [`.graphqlconfig.yml`](./.graphqlconfig.yml) & [`src/ContentfulBinding.js`](./src/ContentfulBinding.js) with an access token for the Contentful Delivery API
- `__CONTENTFUL_SPACE_ID__` in [`src/ContentfulBinding.js`](./src/ContentfulBinding.js) with the ID of the Contentful space you created in step 3
- `__CONTENTFUL_CONTENT_MANAGEMENT_TOKEN__`  in [`src/ContentfulBinding.js`](./src/ContentfulBinding.js) with with a Content Management Token

> **Note**: You can get the tokens from the Contentful dashboard of your space through **Settings -> API keys**.

### 5. Start the server

```bash
node src/index.js
```

### 6. Open a Playground

```bash
graphql playground
```

> **Note**: If you have the server running, you need to execute this command in a new terminal tab/window since the current tab is used by the server process.