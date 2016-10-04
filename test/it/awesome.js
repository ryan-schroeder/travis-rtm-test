'use strict'

let expect = require('chai').expect
let rest = require('restler')

describe('awesome', () => {
  it('should return a good message when we do a GET on /', (done) => {
    rest.get('http://awesome:3000/').on('complete', result => {
      expect(result).to.equal('YO')
      done()
    })
  })
})
