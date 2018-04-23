/// <reference types="node" />
///<reference path="./@types/telegraf/index.d.ts"/>
'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
exports.__esModule = true;
var telegraf_1 = require("./@types/telegraf");
// import { Telegram, Context , InlineQueryResultArticle} from "telegraf";
var Telegraf = require("telegraf");
var Functions = require("./functions");
if (typeof localStorage === "undefined" || localStorage === null) {
    var LocalStorage = require('node-localstorage').LocalStorage;
    localStorage = new LocalStorage('./storage');
}
var BOT_TOKEN = process.env.BOT_TOKEN;
var PROVIDER_TOKEN = process.env.PROVIDER_TOKEN;
var MYID = process.env.MYID;
var PORT = process.env.PORT || 443;
// const bot = new Telegraf(BOT_TOKEN)
var telegram = new telegraf_1.Telegram(BOT_TOKEN);
var bot = new Telegraf(BOT_TOKEN, { telegram: telegram });
//Set the bot name
bot.telegram.getMe().then(function (botInfo) {
    console.log(botInfo.username + ' is running on port ' + PORT);
    bot.options.username = botInfo.username;
});
//So I can specfy a port
bot.startWebhook('/bot${BOT_TOKEN}', null, PORT);
bot.start(function (ctx) {
    var msg = 'Greetings! I am the Wise, I can help with all your decisions. 🧙'
        + "\n\n"
        + 'You can simply \/flip a 🌝, \/roll a 🎲, or even \/roll3 🎲 at a time.'
        + "\n\n"
        + 'You can also \/draw a 🃏 from a stack. If you wish you can enable \/singlestack mode to \/draw 🃏 from the same stack until you \/shuffle the stack.'
        + "\n\n"
        + 'Or I can help you \/pick the one from your choices'
        + "\n\n"
        + '\/suggest your favourite decision making method if I can\'t provide you yet, the universe may accept your suggestions'
        + "\n\n"
        + 'Ask \/help for more.';
    return ctx.reply(msg);
});
bot.command('help', function (ctx) {
    var msg = 'Greetings! I am the Wise, I can help you make decisions. 🧙'
        + "\n\n"
        + '*Coins*'
        + "\n"
        + '\/flip - flip a 🌝'
        + "\n\n"
        + '*Dices*'
        + "\n"
        + '\/roll - roll a 🎲'
        + "\n"
        + '\/roll3 - roll 🎲🎲🎲'
        + "\n\n"
        + '*Cards*'
        + "\n"
        + '\/draw - draw a 🃏 from a stack'
        + "\n"
        + '\/singlestack - toggle single stack mode'
        + "\n"
        + '\/shuffle - reset the stack when \/singlestack is toggled'
        + "\n\n"
        + '*Choices*'
        + "\n"
        + '\/pick - make the decision from your choices'
        + "\n\n"
        + '*Others*'
        + "\n"
        + '\/suggest - suggest a decision making method, or share me you view of universe'
        + "\n"
        + '\/nerddrink - buy the wise a nerd drink, he needs energy to make decisions';
    return ctx.replyWithMarkdown(msg);
});
//Coin
bot.command('flip', function (ctx) { return ctx.reply(Functions.coin()); });
//Dice
bot.command('roll', function (ctx) { return ctx.reply(Functions.die()); });
bot.command('roll3', function (ctx) { return ctx.reply(Functions.dice()); });
//Stack
bot.command('draw', function (ctx) { return ctx.reply(Functions.card(String(ctx.message.chat.id))); });
bot.command('singlestack', function (ctx) { return ctx.reply(Functions.toggleSingle(String(ctx.message.chat.id))); });
bot.command('shuffle', function (ctx) { return ctx.reply(Functions.shuffle(String(ctx.message.chat.id))); });
//Pick one from list
bot.command('pick', function (ctx) { return ctx.replyWithMarkdown(Functions.one(ctx.message.text)); });
//New suggestion from users
bot.command('suggest', function (ctx) { return ctx.replyWithMarkdown(Functions.suggest(ctx.message.text, ctx.from.username, MYID, bot.telegram)); });
//Donation section
var invoice = {
    provider_token: PROVIDER_TOKEN,
    start_parameter: 'buy-wise-a-drink',
    title: 'The Nerd Drink',
    description: 'Like everything in the universe , wisdom requires energy input to function. Please, if you\'re a seeker of wisdom, ensure that this wisdom can continue to be spread. To ensure this is done, it requires significant amount of redbulls to happen.',
    photo_url: 'https://upload.wikimedia.org/wikipedia/commons/0/00/Red_bull_tin.jpeg',
    photo_width: 233,
    photo_height: 681,
    currency: 'aud',
    prices: [
        { label: 'Nerd Drink', amount: 1000 }
    ],
    payload: {
        coupon: 'BURP'
    }
};
var buyOptions = Telegraf.Markup.inlineKeyboard([
    Telegraf.Markup.payButton('💸 Buy')
]).extra();
// bot.command('nerddrink', (ctx: Context) =>{
//     if (ctx.message.chat.type !== "private")
//         return ctx.reply('We should talk about this privately. 😉')
//     else
//         return ctx.replyWithInvoice(invoice, buyOptions)
// })
// bot.on('pre_checkout_query', (ctx: Context) => ctx.answerPreCheckoutQuery(true))
// bot.on('successful_payment', (ctx: Context) =>{
//     ctx.telegram.sendMessage(MYID, '@' + ctx.from.username + ' bought you a nerd drink! 🍻')
//     return ctx.reply('May the universe be with you! 🍻'+"\n"+'As you may know, energy bill is going up crazy, the Wise cannot make it on his own. Your help is very appreciated!')
// })
//Inline mode
bot.on('inline_query', function (ctx) { return __awaiter(_this, void 0, void 0, function () {
    var result;
    return __generator(this, function (_a) {
        result = [{ type: "article",
                id: "coin",
                title: "Heads or Tails 🌝",
                input_message_content: {
                    message_text: Functions.coin(),
                    parse_mode: 'Markdown'
                }
            },
            { type: "article",
                id: "die",
                title: "🎲",
                input_message_content: {
                    message_text: Functions.die(),
                    parse_mode: 'Markdown'
                }
            },
            { type: "article",
                id: "dice",
                title: "🎲🎲🎲",
                input_message_content: {
                    message_text: Functions.dice(),
                    parse_mode: 'Markdown'
                }
            },
            { type: "article",
                id: "card",
                title: "🃏",
                input_message_content: {
                    message_text: Functions.card(),
                    parse_mode: 'Markdown'
                }
            },
            { type: "article",
                id: "pick",
                title: "Pick from",
                description: "🅰️, 🅱️, ...",
                input_message_content: {
                    message_text: Functions.one(ctx.inlineQuery.query),
                    parse_mode: 'Markdown'
                }
            }];
        return [2 /*return*/, ctx.answerInlineQuery(result, {
                is_personal: true,
                cache_time: 0,
                next_offset: "",
                switch_pm_text: "",
                switch_pm_parameter: ""
            })];
    });
}); });
//start poll uptdates
bot.startPolling();
