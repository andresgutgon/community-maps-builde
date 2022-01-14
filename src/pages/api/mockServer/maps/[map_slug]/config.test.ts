import type { NextApiRequest, NextApiResponse } from 'next'
import { testApiHandler } from 'next-test-api-route-handler'

import config from '@maps/data/config'
import categories from '@maps/data/categories.json'
import configHandler from './config'

const DEMO_TOKEN = process.env.DEMO_SECRET_TOKEN

describe('api/mockServer/config', () => {
  it('is token protected', async () => {
    await testApiHandler({
      handler: configHandler,
      params: { map_slug: 'one-category' },
      test: async ({ fetch }) => {
        const response = await fetch({
          headers: {
            'content-type': 'application/json',
            'Authorization': `Bearer ${DEMO_TOKEN}`
          }
        })
        expect(response.status).toBe(200);
        const json = await response.json()
        expect(json).toStrictEqual({
          ...config,
          categories: { car: categories.car }
        })
      }
    })
  })

  it('fails without token', async () => {
    await testApiHandler({
      handler: configHandler,
      test: async ({ fetch }) => {
        const response = await fetch({
          headers: { 'content-type': 'application/json' }
        });
        expect(response.status).toBe(401);
        expect(await response.json()).toStrictEqual({
          message: 'Unauthorized request'
        })
      }
    })
  })
})

