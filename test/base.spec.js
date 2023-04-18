const { ServiceBroker } = require("moleculer");
const I18nMixin = require("../src");


describe("Test with default settings", () => {
    let broker;

    beforeAll(async () => {
        broker = new ServiceBroker({ logLevel: "info" });

        broker.createService({
            name: "greeter",
            mixins: [I18nMixin],
            settings: {
                i18n: {
                    dirName: "./test/testTranslations",
                    languages: ['en', 'es'],
                }
            },
            actions: {
                welcome: {
                    handler(ctx) {
                        return this.t(ctx, 'greeter.welcome.message');
                    }
                },
                farewell: {
                    params: {
                        name: "string",
                    },
                    handler(ctx) {
                        const { name } = ctx.params;
                        return this.t(ctx, 'greeter.farewell', { name });
                    }
                }
            }
        });

        await broker.start();
    });

    afterAll(() => {
        return broker.stop();
    });

    it("should call t action and get proper translations", async () => {
        const response = await broker.call('greeter.welcome');
        expect(response).toEqual('Hello there!');
    });

    it("should call t action and get default english translation", async () => {
        const response = await broker.call('greeter.welcome', {}, { meta: { locale: "hu" } });
        expect(response).toEqual('Hello there!');
    });

    it("should call t action and get missing translation key", async () => {
        const response = await broker.call('greeter.welcome', {}, { meta: { locale: "es" } });
        expect(response).toEqual('es.greeter.welcome.message');
    });

    it("should call t action and get translated message with interpolation", async () => {
        const name = "Jon";
        const response = await broker.call('greeter.farewell', { name });
        expect(response).toEqual(`Good bye ${name}!`);
    });

});