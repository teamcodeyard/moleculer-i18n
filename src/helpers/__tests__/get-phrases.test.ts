import { getPhrases } from '~/helpers/get-phrases'

const mockLocales = {
  en: {
    'errors.general.message': 'Ooops, somethig went wrong!',
    'greeter': {
      welcome: {
        message: 'Hello there!',
      },
    },
    'greeter.farewell': 'Good bye %{name}!',
  },
}

describe('getPhrases', () => {
  it('should return locales', async () => {
    let response = await getPhrases('locales')

    expect(response).toStrictEqual(mockLocales)

    response = await getPhrases(['locales'])

    expect(response).toStrictEqual(mockLocales)
  })
})
