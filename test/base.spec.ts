import { ServiceBroker } from 'moleculer'

import { mockSchema } from './mock/service-schema'

describe('Default settings', () => {
  let broker: ServiceBroker

  beforeAll(async () => {
    broker = new ServiceBroker({
      // INFO: level of info is a bit messy and noisy
      logLevel: 'error',
    })

    broker.createService(mockSchema)

    await broker.start()
  })

  afterAll(async () => {
    await broker.stop()
  })

  it('should call `t` action and get proper translations', async () => {
    // Select existing action key would be more useful instead of this 🤔
    const actionName = 'greeter.welcome'
    const response = await broker.call<string>(actionName)

    expect(response).toMatchInlineSnapshot('"en.greeter.welcome.message"')
  })
})
