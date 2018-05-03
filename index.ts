"use strict";
import * as Telegraf from "telegraf";
import * as Functions from "./functions";
import { ContextMessageUpdate, Telegram } from "./typings/telegraf";
import { InlineQueryResult} from "./typings/telegraf/telegram-types";

const BOT_TOKEN = process.env.BOT_TOKEN;
const PROVIDER_TOKEN = process.env.PROVIDER_TOKEN;
const MYID = process.env.MYID;
const PORT = process.env.PORT || 443;

const bot = new Telegraf(BOT_TOKEN);

// So I can specfy a port
bot.startWebhook(`/bot${BOT_TOKEN}`, null, PORT);

// Set the bot name
bot.telegram.getMe().then((botInfo: any) => {
    // tslint:disable-next-line:no-console
    console.log(botInfo.username + " is running on port " + PORT);
    bot.options.username = botInfo.username;
  });

bot.start((ctx: ContextMessageUpdate) => {
    const msg = "Greetings! I am the Wise, I can help with all your decisions. 🧙"
            + "\n\n"
            + "You can simply \/flip a 🌝, \/roll a 🎲, or even \/roll3 🎲 at a time."
            + "\n\n"
            // tslint:disable-next-line:max-line-length
            + "You can also \/draw a 🃏 from a stack. If you wish you can enable \/singlestack mode to \/draw 🃏 from the same stack until you \/shuffle the stack."
            + "\n\n"
            + "Or I can help you \/pick the one from your choices"
            + "\n\n"
            + "You can always \/learn stuff from me, just ask!"
            + "\n\n"
            // tslint:disable-next-line:max-line-length
            + "\/suggest your favourite decision making method if I can't provide you yet, the universe may accept your suggestions"
            + "\n\n"
            + "Ask \/help for more.";

    return ctx.replyWithMarkdown(msg);
});

bot.command("help", (ctx: ContextMessageUpdate) => {
    const msg = "Greetings! I am the Wise, I can help with all your decisions. 🧙"
            + "\n\n"
            + "*Coins*"
            + "\n"
            + "\/flip - flip a 🌝"
            + "\n\n"
            + "*Dices*"
            + "\n"
            + "\/roll - roll a 🎲"
            + "\n"
            + "\/roll3 - roll 🎲🎲🎲"
            + "\n\n"
            + "*Cards*"
            + "\n"
            + "\/draw - draw a 🃏 from a stack"
            + "\n"
            + "\/singlestack - toggle single stack mode"
            + "\n"
            + "\/shuffle - reset the stack when \/singlestack is toggled"
            + "\n\n"
            + "*Choices*"
            + "\n"
            + "\/pick - make the decision from your choices"
            + "\n\n"
            + "*Others*"
            + "\n"
            + "\/learn - learn from the wise"
            + "\n"
            + "\/suggest - suggest a decision making method, or sharenyour view of the universe"
            + "\n"
            + "\/nerddrink - buy the wise a nerd drink, he needs energy to make decisions"
            + "\n"
            + "\/github - check out how the wise looks like under the hood";

    return ctx.replyWithMarkdown(msg);
});

// Brief descriptions and GitHub link
bot.command("github", (ctx: ContextMessageUpdate) => {
    const msg = "@TheWiseBot is on "
            + "[GitHub](https://github.com/DinoLeung/TheWiseBot)"
            + "\n\n"
            + "If you can make me more wise, please fork me!"
            + "\n"
            + "Pull reqiestes are highly welcome!";
    return ctx.replyWithMarkdown(msg);
});

// Coin
bot.command("flip", (ctx: ContextMessageUpdate) => ctx.reply(Functions.coin()));

// Dice
bot.command("roll", (ctx: ContextMessageUpdate) => ctx.reply(Functions.die()));
bot.command("roll3", (ctx: ContextMessageUpdate) => ctx.reply(Functions.dice()));

// Stack
bot.command("draw", (ctx: ContextMessageUpdate) =>
    ctx.reply(Functions.card(String(ctx.message.chat.id))));
bot.command("singlestack", (ctx: ContextMessageUpdate) =>
    ctx.reply(Functions.toggleSingle(String(ctx.message.chat.id))));
bot.command("shuffle", (ctx: ContextMessageUpdate) =>
    ctx.reply(Functions.shuffle(String(ctx.message.chat.id))));

// Pick one from list
bot.command("pick", (ctx: ContextMessageUpdate) =>
    ctx.replyWithMarkdown(Functions.one(ctx.message.text, false)));

// Let me google that
bot.command("learn", (ctx: ContextMessageUpdate) =>
    ctx.replyWithMarkdown(Functions.letMeGoogle(ctx.message.text, false)));

// New suggestion from users
bot.command("suggest", (ctx: ContextMessageUpdate) =>
    ctx.replyWithMarkdown(Functions.suggest(
        ctx.message.text,
        ctx.from.username, MYID, bot.telegram, false)));

// Donation section
const invoice = {
    provider_token: PROVIDER_TOKEN,
    start_parameter: "buy-wise-a-drink",
    title: "The Nerd Drink",
    // tslint:disable-next-line:max-line-length
    description: "Like everything in the universe , wisdom requires energy input to function. Please, if you're a seeker of wisdom, ensure that this wisdom can continue to be spread. To ensure this is done, it requires significant amount of redbulls to happen.",
    photo_url: "https://upload.wikimedia.org/wikipedia/commons/0/00/Red_bull_tin.jpeg",
    photo_width: 233,
    photo_height: 681,
    currency: "aud",
    prices: [
        { label: "Nerd Drink", amount: 1000 },
    ],
    payload: "BURP",

};

const buyOptions = Telegraf.Markup.inlineKeyboard([
    Telegraf.Markup.payButton("💸 Buy"),
]).extra();

bot.command("nerddrink", (ctx: ContextMessageUpdate) => {
    if (ctx.message.chat.type !== "private") {
        return ctx.reply("We should talk about this privately. 😉");
    } else {
        return ctx.replyWithInvoice(invoice, buyOptions);
    }
});
bot.on("pre_checkout_query", (ctx: ContextMessageUpdate) => ctx.answerPreCheckoutQuery(true));
bot.on("successful_payment", (ctx: ContextMessageUpdate) => {
    ctx.telegram.sendMessage(MYID, "@" + ctx.from.username + " bought you a nerd drink! 🍻");
    // tslint:disable-next-line:max-line-length
    return ctx.reply("May the universe be with you! 🍻" + "\n" + "As you may know, energy bill is going up crazy, the Wise cannot make it on his own. Your help is very appreciated!");
});

// Inline mode
bot.on("inline_query", async (ctx: ContextMessageUpdate) => {
    const result: InlineQueryResult[] = [
        {
            type: "article",
            id: "coin",
            title: "Heads or Tails 🌝",
            input_message_content:
            {
                message_text: Functions.coin(),
                parse_mode: "Markdown",
            },
        },
        {
            type: "article",
            id: "die",
            title: "🎲",
            input_message_content:
            {
                message_text: Functions.die(),
                parse_mode: "Markdown",
            },
        },
        {
            type: "article",
            id: "dice",
            title: "🎲🎲🎲",
            input_message_content:
            {
                message_text: Functions.dice(),
                parse_mode: "Markdown",
            },
        },
        {
            type: "article",
            id: "card",
            title: "🃏",
            input_message_content:
            {
                message_text: Functions.card(),
                parse_mode: "Markdown",
            },
        },
        {
            type: "article",
            id: "pick",
            title: "Pick from",
            description: "🅰️, 🅱️, ...",
            input_message_content:
            {
                message_text: Functions.one(ctx.inlineQuery.query, true),
                parse_mode: "Markdown",
            },
        },
        {
            type: "article",
            id: "google",
            title: "Ask the wise ...",
            description: "🧙",
            input_message_content:
            {
                message_text: Functions.letMeGoogle(ctx.inlineQuery.query, true),
                parse_mode: "Markdown",
            },
        },
    ];
    return ctx.answerInlineQuery(result,
        {
            is_personal: true,
            cache_time: 0,
            next_offset: "",
            switch_pm_text: "",
            switch_pm_parameter: "",
        });
});

// Error handling
bot.catch((err) => {
    // tslint:disable-next-line:no-console
    console.log(err);
    bot.telegram.sendMessage(MYID, "Error caught: " + err);
});

// start poll uptdates
bot.startPolling();
