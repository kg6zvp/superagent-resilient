/*global it: true, describe: true */
/*eslint no-console: 0*/

import should from 'should'
import request from 'superagent'
import resilient from '../src'
resilient(request)

import express from 'express'
import getPort from 'get-port'

let port, app, server

const jsonStr = JSON.stringify({
  "_id": "5bfd8a1813c33d93cd3f174f",
  "index": 0,
  "guid": "5defeed4-2853-4cce-aa08-835856bebe55",
  "isActive": false,
  "balance": "$3,066.43",
  "picture": "http://placehold.it/32x32",
  "age": 28,
  "eyeColor": "blue",
  "name": {
    "first": "Key",
    "last": "Hurst"
  },
  "company": "YOGASM",
  "email": "key.hurst@yogasm.biz",
  "phone": "+1 (970) 509-2478",
  "address": "890 Krier Place, Robinson, South Dakota, 2158",
  "about": "Eu occaecat in dolore elit mollit duis ipsum esse. Dolor minim cupidatat labore proident dolore incididunt. Adipisicing enim qui anim dolor cupidatat proident veniam voluptate officia elit eu.",
  "registered": "Monday, September 12, 2016 4:37 PM",
  "latitude": "-65.214201",
  "longitude": "54.856665",
  "tags": [
    "culpa",
    "sit",
    "occaecat",
    "laborum",
    "aliquip"
  ],
  "range": [
    0,
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    8,
    9
  ],
  "friends": [
    {
      "id": 0,
      "name": "Knowles Hickman"
    },
    {
      "id": 1,
      "name": "Ryan Cherry"
    },
    {
      "id": 2,
      "name": "Esther Blankenship"
    }
  ],
  "greeting": "Hello, Key! You have 8 unread messages.",
  "favoriteFruit": "apple"
})

describe('npm-boilerplate-node', () => {
  before(async () => {
    port = await getPort()
    app = express()
    app.get('/bad.json', (req, res) => {
      let sendStr = ''
      let beginningRange = 0
      console.log('express/headers: ', req.headers.range)
      if(req.headers.range) {
        beginningRange = req.headers.range.split('-')[0]
        sendStr = jsonStr.substring(beginningRange)
      } else {
        sendStr = jsonStr.substring(0, (jsonStr.length/2)+2)
      }
      res
        .status(200)
        .header({
          'Content-Length': jsonStr.length - beginningRange,
          'Content-Type': 'application/json',
          'Accept-Ranges': 'bytes',
          'Cache-Control': 'no-cache, max-age=0'
        })
        .write(sendStr)
      res
        .end()
    })
    server = app.listen(port)
  })
  after((cb) => server.close(cb))

  it('test superagent', async () => {
    console.log('port', port)
    const resp = await request
      .get(`http://localhost:${port}/bad.json`)
      //.retry()
      //.set('Range', 0)
      //.set('Cache-Control', 'no-cache')
    console.log('resp', resp)
  })
})
