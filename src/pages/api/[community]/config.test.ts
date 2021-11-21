import type { NextApiRequest, NextApiResponse } from 'next'
import { testApiHandler } from 'next-test-api-route-handler'

import data from '@maps/data/demoData'
import configHandler from './config'

const DEMO_TOKEN = process.env.DEMO_SECRET_TOKEN
const DEMO_PATH = 'demo'

describe('api/[community]/config', () => {
  it('is token protected', async () => {
    await testApiHandler({
      handler: configHandler,
      url: `/api/${DEMO_PATH}/config`,
      params: { community: DEMO_PATH },
      test: async ({ fetch }) => {
        const response = await fetch();
        expect(response.status).toBe(200);
        expect(await response.json()).toStrictEqual(data.config)
      }
    });
  })

  it('fails without community slug', async () => {
    await testApiHandler({
      handler: configHandler,
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
      handler: configHandler,
      url: '/api/NOT_DEFINED_COMMUNITY/config',
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

