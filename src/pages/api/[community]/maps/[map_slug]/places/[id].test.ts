import type { NextApiRequest, NextApiResponse } from 'next'
import { testApiHandler } from 'next-test-api-route-handler'

import placeDetail from '@maps/data/places/default.json'
import handler from './[id]'

import fetchMock from "jest-fetch-mock"
global.fetch = fetchMock

const DEMO_TOKEN = process.env.DEMO_SECRET_TOKEN
const DEMO_HOST = process.env.DEMO_HOST
const DEMO_PATH = 'demo'
const MAP_SLUG = 'first-map'
const PLACE_SLUG = 'place-slug'

describe('api/[community]/maps/[map_slug]/places/[slug]', () => {
  beforeEach(() => {
    fetchMock.resetMocks()
  })

  it('receives place details and process markdown fields', async () => {
    await testApiHandler({
      handler,
      url: `/api/${DEMO_PATH}/maps/${MAP_SLUG}/places/${PLACE_SLUG}`,
      params: { community: DEMO_PATH },
      test: async ({ fetch }) => {
        fetchMock.mockResponse(
          JSON.stringify(placeDetail),
          { status: 200 }
        )
        const response = await fetch()

        expect(response.status).toBe(200)

        const json = await response.json()
        expect(json).toStrictEqual({
          ok: true,
          data: {
            ...placeDetail,
            schemaData: {
              ...(placeDetail as any).schemaData,
              "warning": "[markdown] <p> <strong>Atención</strong>: debido al COVID algunas restricciones se podran aplicar. <a target=\"_blank\" href=\"https://www.sommobilitat.coop/mesures-covid19/\">más informacion</a></p>"
            }
          }
        })
      }
    })
  })
})

