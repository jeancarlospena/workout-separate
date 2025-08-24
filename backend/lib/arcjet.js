import arcjet, { tokenBucket, shield, detectBot } from "@arcjet/node"

import 'dotenv/config'


// init arcjet

export const aj = arcjet({
  key: process.env.ARCJET_KEY,
  characteristics: ['ip.src'],
  rules: [
    // shield protects application from common attacks such as slq injections, xss, csrf attacks
    shield({ mode: "LIVE" }),
    detectBot({
      mode: "LIVE",
      // block all bots except search engine
      allow: [
        'CATEGORY:SEARCH_ENGINE'
        // SEE THE FULL LIST https://arcjet.com/bot-list
      ]
    }),
    // rate limiting
    tokenBucket({
      mode: 'LIVE',
      refillRate: 5,
      interval: 10,
      capacity: 10,
    })
  ]
})