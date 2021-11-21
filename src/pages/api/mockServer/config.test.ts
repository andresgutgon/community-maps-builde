import type { NextApiRequest, NextApiResponse } from 'next'
import { testApiHandler } from 'next-test-api-route-handler'

import data from '@maps/data/demoData'
import configHandler from './config'

const DEMO_TOKEN = process.env.DEMO_SECRET_TOKEN

describe('api/mockServer/config', () => {
  it('is token protected', async () => {
    await testApiHandler({
      handler: configHandler,
      test: async ({ fetch }) => {
        const response = await fetch({
          headers: {
            'content-type': 'application/json',
            'Authorization': `Bearer ${DEMO_TOKEN}`
          }
        });
        expect(response.status).toBe(200);
        expect(await response.json()).toStrictEqual(data.config)
      }
    });
  })

  it('fails without token', async () => {
    await testApiHandler({
      handler: configHandler,
      test: async ({ fetch }) => {
        const response = await fetch({
          headers: { 'content-type': 'application/json' }
        });
        expect(response.status).toBe(400);
        expect(await response.json()).toStrictEqual({
          message: 'Unauthorized request'
        })
      }
    });
  })
})

