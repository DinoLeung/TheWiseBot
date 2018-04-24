'use strict';
import { Telegram, ContextMessageUpdate} from './typings/telegraf';
import { InlineQueryResult} from "./typings/telegraf/telegram-types";
import * as Telegraf from "telegraf";
import * as Functions from "./functions";

const BOT_TOKEN = process.env.BOT_TOKEN
const PROVIDER_TOKEN = process.env.PROVIDER_TOKEN
const MYID = process.env.MYID
const PORT = process.env.PORT || 443

const bot = new Telegraf(BOT_TOKEN)

//Set the bot name
bot.telegram.getMe().then((botInfo: any) => {
    console.log(botInfo.username + ' is running on port ' + PORT)
    bot.options.username = botInfo.username
  })
  
//So I can specfy a port
bot.startWebhook('/bot${BOT_TOKEN}', null, PORT)

bot.start((ctx: ContextMessageUpdate) => {
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
            + 'Ask \/help for more.'
    return ctx.reply(msg)
})

bot.command('help', (ctx: ContextMessageUpdate) =>{
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
            + '\/nerddrink - buy the wise a nerd drink, he needs energy to make decisions'
    
    return ctx.replyWithMarkdown(msg)
})

//Coin
bot.command('flip', (ctx: ContextMessageUpdate) => ctx.reply(Functions.coin()))

//Dice
bot.command('roll', (ctx: ContextMessageUpdate) => ctx.reply(Functions.die()))
bot.command('roll3', (ctx: ContextMessageUpdate) => ctx.reply(Functions.dice()))

//Stack
bot.command('draw', (ctx: ContextMessageUpdate) => ctx.reply(Functions.card(String(ctx.message.chat.id))))
bot.command('singlestack', (ctx: ContextMessageUpdate) => ctx.reply(Functions.toggleSingle(String(ctx.message.chat.id))))
bot.command('shuffle', (ctx: ContextMessageUpdate) => ctx.reply(Functions.shuffle(String(ctx.message.chat.id))))

//Pick one from list
bot.command('pick', (ctx: ContextMessageUpdate) => ctx.replyWithMarkdown(Functions.one(ctx.message.text)))

//New suggestion from users
bot.command('suggest', (ctx: ContextMessageUpdate) => ctx.replyWithMarkdown(Functions.suggest(ctx.message.text, ctx.from.username, MYID, bot.telegram)))


//Donation section
const invoice = {
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
    payload: 'BURP'
    
}

const buyOptions = Telegraf.Markup.inlineKeyboard([
    Telegraf.Markup.payButton('💸 Buy')
  ]).extra()
bot.command('nerddrink', (ctx: ContextMessageUpdate) =>{
    if (ctx.message.chat.type !== "private")
        return ctx.reply('We should talk about this privately. 😉')
    else
        return ctx.replyWithInvoice(invoice, buyOptions)
})
bot.on('pre_checkout_query', (ctx: ContextMessageUpdate) => ctx.answerPreCheckoutQuery(true))
bot.on('successful_payment', (ctx: ContextMessageUpdate) =>{
    ctx.telegram.sendMessage(MYID, '@' + ctx.from.username + ' bought you a nerd drink! 🍻')
    return ctx.reply('May the universe be with you! 🍻'+"\n"+'As you may know, energy bill is going up crazy, the Wise cannot make it on his own. Your help is very appreciated!')
})

//Inline mode
bot.on('inline_query', async (ctx: ContextMessageUpdate) => {
    var result: InlineQueryResult[] = [{type: "article",
                    id: "coin",
                    title: "Heads or Tails 🌝",
                    input_message_content: {
                        message_text: Functions.coin(),
                        parse_mode: 'Markdown'
                    }
                },
                    {type: "article",
                    id: "die",
                    title: "🎲",
                    input_message_content: {
                        message_text: Functions.die(),
                        parse_mode: 'Markdown'
                    }
                },
                    {type: "article",
                    id: "dice",
                    title: "🎲🎲🎲",
                    input_message_content: {
                        message_text: Functions.dice(),
                        parse_mode: 'Markdown'
                    }
                },
                    {type: "article",
                    id: "card",
                    title: "🃏",
                    input_message_content: {
                        message_text: Functions.card(),
                        parse_mode: 'Markdown'
                    }
                },
                    {type: "article",
                    id: "pick",
                    title: "Pick from",
                    description: "🅰️, 🅱️, ...",
                    input_message_content: {
                        message_text: Functions.one(ctx.inlineQuery.query),
                        parse_mode: 'Markdown'
                    }
                }]
    return ctx.answerInlineQuery(result, 
        {
            is_personal: true,
            cache_time: 0,
            next_offset: "",
            switch_pm_text: "",
            switch_pm_parameter: ""
        })
})

//start poll uptdates
bot.startPolling()
