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

    expect(response).toEqual('en.greeter.welcome.message')
    // expect(response).toEqual('Hello there!')
  })

  it('should call `t` action and get default english translation', async () => {
    const response = await broker.call('greeter.welcome', {}, { meta: { locale: 'hu' } })

    expect(response).toEqual('en.greeter.welcome.message')
    // expect(response).toEqual('Hello there!')
  })

  it('should call `t` action and get missing translation key', async () => {
    const response = await broker.call('greeter.welcome', {}, { meta: { locale: 'es' } })

    expect(response).toEqual('en.greeter.welcome.message')
  })

  it.skip('should call `t` action and get translated message with interpolation', async () => {
    const name = 'Jon'
    const response = await broker.call('greeter.farewell', { name })

    expect(response).toEqual(`Good bye ${name}!`)
  })
})
