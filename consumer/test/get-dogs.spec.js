'use strict'

const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
const expect = chai.expect
const path = require('path')
const {Pact, Matchers} = require('@pact-foundation/pact')
const { eachLike, like, integer} = Matchers;
const getMeDogs = require('../index').getMeDogs

//chai.use(chaiAsPromised)

describe('The Dog API', () => {
  let url = 'http://localhost'
  const port = 8989

  const provider = new Pact({
    port: port,
    log: path.resolve(process.cwd(), 'logs', 'mockserver-integration.log'),
    dir: path.resolve(process.cwd(), 'pacts'),
    spec: 2,
    consumer: 'MyConsumer',
    provider: 'MyProvider',
    pactfileWriteMode: 'merge'
  })


  const MIN = 5
  const dogBodyExpectation = {
      'dog': integer()
    }

  const BODY_LIKE = eachLike(
    dogBodyExpectation,
    {
      min: MIN
    }
  )



  before(() => provider.setup())

  after(() => provider.finalize())

  describe('get /dogs', () => {
    before(done =>
      {
        const interaction = {
          state: 'i have a list of dogs',
          uponReceiving: 'a request for all dogs',
          withRequest: {
            method: 'GET',
            path: '/dogs',
            headers: {
              'Accept': 'application/json'
            }
          },
          willRespondWith: {
            status: 200,
            headers: {
              'Content-Type': 'application/json; charset=utf-8'
            },
            body: BODY_LIKE
          }
        }
        provider.addInteraction(interaction).then(() => {
          done()
        })
      }
    )


    it('returns the correct response', done => {
      const urlAndPort = {
        url: url,
        port: port
      }
      getMeDogs(urlAndPort)
        .then(response => {
          expect(response.data).to.have.lengthOf(MIN);
          expect(response.data).to.have.deep.property('[3].dog').to.be.an('number')
          done()
        }, done)
    })

    // verify with Pact, and reset expectations
    afterEach(() => provider.verify())
    after(()=> {
      provider.finalize()
    })
  })
})
