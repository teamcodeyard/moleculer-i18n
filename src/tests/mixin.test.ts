import { ServiceBroker } from 'moleculer'

import { mockI18NSchema } from './mocks/i18n-service-schema'

describe('Test with default settings', () => {
  let broker: ServiceBroker

  beforeAll(async () => {
    broker = new ServiceBroker({
      logLevel: 'error',
    })

    broker.createService(mockI18NSchema)

    await broker.start()
  })

  afterAll(async () => {
    await broker.stop()
  })

  it('should call t action and get proper translations', async () => {
    const response = await broker.call('greeter.welcome')

    expect(response).toEqual('Hello there!')
  })

  it('should call t action and get default english translation', async () => {
    const response = await broker.call('greeter.welcome', {}, { meta: { locale: 'hu' } })

    expect(response).toEqual('Hello there!')
  })

  it('should call t action and get missing translation key', async () => {
    const response = await broker.call('greeter.welcome', {}, { meta: { locale: 'es' } })

    expect(response).toEqual('es.greeter.welcome.message')
  })

  it('should call t action and get translated message with interpolation', async () => {
    const name = 'Jon'
    const response = await broker.call('greeter.farewell', { name })

    expect(response).toEqual(`Good bye ${name}!`)
  })
})
