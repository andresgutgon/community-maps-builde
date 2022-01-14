import type { NextApiRequest, NextApiResponse } from 'next'
import { testApiHandler } from 'next-test-api-route-handler'

import places from '@maps/data/places-multiple-categories.json'
import handler from './index'

import fetchMock from "jest-fetch-mock"
global.fetch = fetchMock

const DEMO_TOKEN = process.env.DEMO_SECRET_TOKEN
const DEMO_HOST = process.env.DEMO_HOST
const DEMO_PATH = 'demo'
const MAP_SLUG = 'first-map'

describe('api/[community]/maps/[id]/places', () => {
  beforeEach(() => {
    fetchMock.resetMocks()
  })

  it('is token protected and map exists', async () => {
    await testApiHandler({
      handler,
      url: `/api/${DEMO_PATH}/maps/${MAP_SLUG}/places`,
      params: { community: DEMO_PATH },
      test: async ({ fetch }) => {
        fetchMock.mockResponse(
          JSON.stringify(places),
          { status: 200 }
        )
        const response = await fetch();

        expect(response.status).toBe(200);

        const json = await response.json()
        expect(json).toStrictEqual(places)
      }
    })
  })

  it('it handles a not found map', async () => {
    await testApiHandler({
      handler,
      url: `/api/${DEMO_PATH}/maps/__LOL_NOT_FOUND_MAP_SLUG_/places`,
      params: { community: DEMO_PATH },
      test: async ({ fetch }) => {
        fetchMock.mockResponse(
          JSON.stringify({ message: 'Not found map' }),
          { status: 404 }
        )
        const response = await fetch()

        expect(response.status).toBe(404)
        const json = await response.json()
        expect(json).toStrictEqual({ message: 'Not found map' })
      }
    })
  })

  it('fails without community slug', async () => {
    await testApiHandler({
      handler,
      test: async ({ fetch }) => {
        const response = await fetch();
        expect(response.status).toBe(402);
        expect(await response.json()).toStrictEqual({
          message: 'Not community defined for this map'
        })
      }
    });
  })

  it('fails without community defined in maps server as environment variable', async () => {
    await testApiHandler({
      handler,
      url: `/api/${DEMO_PATH}/maps/NOT_SLUG/places`,
      params: { community: 'NOT_DEFINED_COMMUNITY' },
      test: async ({ fetch }) => {
        const response = await fetch();
        expect(response.status).toBe(402);
        expect(await response.json()).toStrictEqual({
          message: 'Not community defined for this map'
        })
      }
    });
  })
})

