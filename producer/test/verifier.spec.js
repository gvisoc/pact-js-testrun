'use strict'

const path = require('path')
const Verifier = require('@pact-foundation/pact').Verifier;
const VerifierOptions = require('@pact-foundation/pact-node').VerifierOptions;

describe('Pact Verification', () => {
  it('should validate the expectations of Matching Service', function () { // lexical binding required here
    this.timeout(10000)

    let opts = {
      providerBaseUrl : 'http://localhost:3000',
      provider: 'MyProvider',
      pactUrls: [path.resolve(process.cwd(), '../consumer/pacts/myconsumer-myprovider.json')]
    }

    return new Verifier().verifyProvider(opts).then(output => {
        console.log('Pact Verification Complete!')
        console.log(output)
    })
  })
})
