const {TOKEN} = require('./config');
const Telegraf = require('telegraf');
const Composer = require('telegraf/composer');
const session = require('telegraf/session');
const Stage = require('telegraf/stage');
const Markup = require('telegraf/markup');
const WizardScene = require('telegraf/scenes/wizard');
const rp = require('request-promise-native');
let currencyList = [];
let pair = [];
let response = [];

const stepHandler = new Composer();

stepHandler.command('/finish', (ctx) => {
    ctx.reply('Done');
    ctx.scene.leave();
});
stepHandler.action('finish', (ctx) => {
    ctx.reply('Done');
    ctx.scene.leave();
});

async function setupCurrency(ctx) {
    const result = await rp.get(`http://0.0.0.0:3000/coin`, {json: true});
    const currencies = (result || []).filter(currency =>
        currency.toLowerCase().includes(ctx.message.text.toLowerCase()));
    if (currencies.length === 0) {
        ctx.reply('We don\'t have info about this currency');
        ctx.scene.leave();
    } else if (currencies.length > 1) {
        ctx.reply(`We find ${currencies.length} matched currencies!`, Markup.inlineKeyboard(currencies.map(currency => {
            return Markup.callbackButton(currency, currency.toLowerCase())
        })).extra());
        ctx.wizard.next();
    } else {
        ctx.wizard.next();
        ctx.wizard.steps[ctx.wizard.cursor](ctx);
    }
    return 0;
}

const superWizard = new WizardScene('super-wizard',
    (ctx) => {
        pair = [];
        ctx.reply('Welcome to market cap bot!', Markup.inlineKeyboard([
            Markup.callbackButton('Cancel', 'cancel'),
            Markup.callbackButton('➡️ Next', 'next')
        ]).extra());
        ctx.wizard.next();
    },
    (ctx) => {
        ctx.reply('Type first currency');
        ctx.wizard.next();
    },
    async (ctx) => {
        await setupCurrency(ctx);
    },
    (ctx) => {
        ctx.reply('Type second currency');
        pair.push(ctx.update.callback_query ? ctx.update.callback_query.data : ctx.update.message.text);
        ctx.wizard.next();
    },
    async (ctx) => {
        await setupCurrency(ctx);
    },
    async (ctx) => {
        pair.push(ctx.update.callback_query ? ctx.update.callback_query.data : ctx.update.message.text);
        let result = null;
        try {
            result = await rp.get(`http://0.0.0.0:3000/price/average?from=${pair[0].toUpperCase()}&to=${pair[1].toUpperCase()}`, {json: true});
            res = result;
            if (res.price) {
                ctx.replyWithHTML(`<b>price: ${res.price}</b>
<b>pair: ${res.pair}</b>
<b>timestamp: ${res.timestamp}</b>`, Markup.inlineKeyboard([
                    Markup.callbackButton('Exchanges', 'exchanges'),
                    Markup.callbackButton('FINISH', 'finish'),
                ]).extra());
                ctx.wizard.next();
            } else {
                ctx.reply('Not found info for this pair, please try another one.');
                ctx.scene.leave();
            }

        } catch (e) {
            ctx.reply('Not found info for this pair, please try another one.');
            ctx.scene.leave();
        }

    },
    async (ctx) => {
        if (ctx.update.callback_query.data === 'exchanges') {
            try {
                // const exchanges = await rp.get(`http://0.0.0.0:3000/exchange`, {json: true});
                response = await rp.get(`http://0.0.0.0:3000/price?from=${pair[0].toUpperCase()}&to=${pair[1].toUpperCase()}`, {json: true});
                response.map((res, index) => {
                    ctx.replyWithHTML(`<b>price: ${res.price}</b>
<b>conversion path: ${res.coin_path}</b>
<b>pair: ${res.pair}</b>
<b>price type: ${res.order_type}</b>
<b>exchange: ${res.exchange}</b>`);
                    //    stepHandler.action(`details${index}`, (ctx) => {
                    //        ctx.reply(`DETAILS:
                    // ${JSON.stringify(exchanges.find(exch => exch === response[index].exchange))}`, Markup.inlineKeyboard([
                    //            Markup.callbackButton('Finish', `finish`),
                    //        ]).extra());
                    //    });
                });
                ctx.scene.leave();
            } catch (e) {
                ctx.reply('Not found info for this pair, please try another one.');
                ctx.scene.leave();
            }
        } else {
            ctx.reply('Finish');
            return ctx.scene.leave();
        }

        return ctx.wizard.next();
    },
    stepHandler
);

const bot = new Telegraf(TOKEN);
const stage = new Stage([superWizard], {default: 'super-wizard'});

bot.use(session());
bot.use(stage.middleware());
bot.startPolling();


