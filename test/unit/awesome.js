'use strict'

let awesome = require('../../awesome')
let expect = require('chai').expect

describe('awesome', () => {
  it('should return a good message', () => {
    expect(awesome.eyebrows()).to.equal('THOSE EYEBROWS')
  })
  it('should fail here', () => {
    expect(0).to.equal(1)
  })
})
