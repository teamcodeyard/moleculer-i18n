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
                    dirName: "./test/testTranslations"
                }
            },
            actions: {
                welcome: {
                    handler(ctx) {
                        ctx.meta.locale = "es"
                        return this.t(ctx, 'greeter.welcome.message');
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

});