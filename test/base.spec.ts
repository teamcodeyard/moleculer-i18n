import Polyglot from 'node-polyglot';
import { ServiceBroker, type Context } from "moleculer";

import { I18nMixin } from "../src";
import type { I18nServiceSchema } from '../src/types';

type I18NContext = ThisType<I18nServiceSchema['methods']>;

interface ServiceActions {
    farewell: I18NContext;
    welcome: I18NContext;
};

describe("Test with default settings", () => {
    let broker: ServiceBroker;

    beforeAll(async () => {
        broker = new ServiceBroker({ logLevel: "info" });

        broker.createService({
            name: "greeter",
            mixins: [I18nMixin],
            settings: {
                i18n: {
                    dirName: "./test/testTranslations",
                    languages: ['en', 'es'],
                    polyglot: new Polyglot(),
                }
            },
            actions: {
                welcome: {
                    handler(ctx: Context<any, any>) {
                        return this.t(ctx, 'greeter.welcome.message');
                    }
                },
                farewell: {
                    params: {
                        name: "string",
                    },
                    handler(ctx: Context<{ name: string }, any>) {
                        const { name } = ctx.params;
                        return this.t(ctx, 'greeter.farewell', { name });
                    }
                }
            } satisfies ServiceActions,
        });

        await broker.start();
    });

    afterAll(async () => {
        await broker.stop();
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
