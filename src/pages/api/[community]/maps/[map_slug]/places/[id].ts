import { NextApiRequest, NextApiResponse } from 'next'
import { JsonSchema } from '@jsonforms/core'
import { marked } from 'marked'
import sanitizeHtml from 'sanitize-html'

import withHeaderBearerToken from '@maps/lib/middlewares/withHeaderBearerToken'
import type { ResponseWithAuth } from '@maps/lib/middlewares/withHeaderBearerToken'

const renderer = new marked.Renderer();
// Add target="_blank" to all links
const linkRenderer = renderer.link
renderer.link = (href, title, text) => {
  const html = linkRenderer.call(renderer, href, title, text);
  return html.replace(/^<a /, `<a target="_blank" rel="noreferrer noopener nofollow" `);
}
marked.setOptions({ renderer })

const MARKDOWN_INDICATOR = '[markdown]'
function parseMarkdownValue (value: string) {
  // Remove placeholder used to mark this field as markdown
  const markdownText = value.replace(MARKDOWN_INDICATOR, '')
  const htmlText = marked.parse(markdownText)
  // Is always a good idea to sanitize input. Even if this come from
  // our trusted backends
  return `${MARKDOWN_INDICATOR} ${sanitizeHtml(htmlText).trim()}`
}

/**
 * Parse and sanitize fields that are in Markdown format.
 */
const parseMarkdownFields = (jsonSchema: JsonSchema | null, schemaData: any | null): any | null => {
  if (!jsonSchema || !schemaData) return null

  const properties = jsonSchema.properties
  const markdownFields = Object.keys(properties).filter((propKey: string) =>
    properties[propKey].type === 'string' && properties[propKey].format === 'markdown'
  )
  const dataKeys = Object.keys(schemaData)
  return dataKeys.reduce((memo: any, key: string) => {
    const value = markdownFields.includes(key)
      ? parseMarkdownValue(schemaData[key])
      : schemaData[key]
    memo[key] = value
    return memo
    // Process as markdown
  }, {})
}

const place = async ({ request, response, tokenHeaders, communityHost }: ResponseWithAuth) => {
  const { map_slug: slug, id } = request.query
  const serverResponse = await fetch(
    `${communityHost}/maps/${slug}/places/${id}`,
    {
      method: 'GET',
      headers: tokenHeaders
    }
  )
  const json = await serverResponse.json()

  if (serverResponse.status !== 200) {
    return response.status(serverResponse.status).json(json)
  }
  const { jsonSchema, schemaData } = json

  const parsedSchemaData = parseMarkdownFields(jsonSchema, schemaData)
  response.status(200).json({ ...json, schemaData: parsedSchemaData })
}

export default withHeaderBearerToken(place)
