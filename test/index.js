/*global it: true, describe: true */
/*eslint no-console: 0*/

import should from 'should'
import lib from '../src'
//import request from 'superagent'

describe('npm-boilerplate-node', () => {
  it('should exist', async () => {
    should.exist(lib)
  })
  it('test superagent', async () => {
    console.log(lib)
    /*request
      .get('https://google.com/')
      .use(lib)*/
  })
})
