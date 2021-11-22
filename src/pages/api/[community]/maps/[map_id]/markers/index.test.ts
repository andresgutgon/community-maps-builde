import type { NextApiRequest, NextApiResponse } from 'next'
import { testApiHandler } from 'next-test-api-route-handler'

import data from '@maps/data/demoData'
import handler from './index'

const DEMO_TOKEN = process.env.DEMO_SECRET_TOKEN
const DEMO_PATH = 'demo'
const MAP_SLUG = 'first-map'
const firstMap = data.config.maps.find(m => m.slug === MAP_SLUG)

describe('api/[community]/maps/[id]/markers', () => {
  it('is token protected and map exists', async () => {
    await testApiHandler({
      handler,
      url: `/api/${DEMO_PATH}/maps/${MAP_SLUG}/markers`,
      params: { community: DEMO_PATH },
      test: async ({ fetch }) => {
        global.fetchMock(firstMap)

        const response = await fetch();

        expect(response.status).toBe(200);

        expect(await response.json()).toStrictEqual(firstMap)
      }
    });
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
      url: `/api/${DEMO_PATH}/maps/NOT_SLUG/markers`,
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

