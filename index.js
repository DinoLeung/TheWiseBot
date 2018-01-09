const Telegraf = require('telegraf')
const Markup = require('telegraf/markup')

if (typeof localStorage === "undefined" || localStorage === null) {
    var LocalStorage = require('node-localstorage').LocalStorage;
    localStorage = new LocalStorage('./storage');
}

const BOT_TOKEN = process.env.BOT_TOKEN
const PROVIDER_TOKEN = process.env.PROVIDER_TOKEN
const MYID = process.env.MYID
const PORT = process.env.PORT || 443

const bot = new Telegraf(BOT_TOKEN)

//Set the bot name
bot.telegram.getMe().then((botInfo) => {
    console.log(botInfo.username + ' is running on port ' + PORT)
    bot.options.username = botInfo.username
  })
  
//So I can specfy a port
bot.startWebhook('/bot${BOT_TOKEN}', null, PORT)

bot.start((ctx) => {
    var msg = 'Greetings! I am the Wise, I can help with all your decisions. 🧙'
    msg += "\n\n"
    msg += 'You can simply \/flip a 🌝, \/roll a 🎲, or even \/roll3 🎲 at a time.'
    msg += "\n\n"
    msg += 'You can also \/draw a 🃏 from a stack. If you wish you can enable \/singlestack mode to \/draw 🃏 from the same stack until you \/shuffle the stack.'
    msg += "\n\n"
    msg += 'Or I can help you \/pick the one from your choices'
    msg += "\n\n"
    msg += '\/suggest your favourite decision making method if I can\'t provide you yet, the universe may accept your suggestions'
    msg += "\n\n"
    msg += 'Ask \/help for more.'
    return ctx.reply(msg)
})

bot.command('help', (ctx) =>{
    var msg = 'Greetings! I am the Wise, I can help you make decisions. 🧙'
    msg += "\n\n"
    msg += '*Coins*'
    msg += "\n"
    msg += '\/flip - flip a 🌝'
    msg += "\n\n"
    msg += '*Dices*'
    msg += "\n"
    msg += '\/roll - roll a 🎲'
    msg += "\n"
    msg += '\/roll3 - roll 🎲🎲🎲'
    msg += "\n\n"
    msg += '*Cards*'
    msg += "\n"
    msg += '\/draw - draw a 🃏 from a stack'
    msg += "\n"
    msg += '\/singlestack - toggle single stack mode'
    msg += "\n"
    msg += '\/shuffle - reset the stack when \/singlestack is toggled'
    msg += "\n\n"
    msg += '*Choices*'
    msg += "\n"
    msg += '\/pick - make the decision from your choices'
    msg += "\n\n"
    msg += '*Others*'
    msg += "\n"
    msg += '\/suggest - suggest a decision making method, or share me you view of universe'
    msg += "\n"
    msg += '\/nerddrink - buy the wise a nerd drink, he needs energy to make decisions'
    
    return ctx.replyWithMarkdown(msg)
})

//Coin
var coin = () => (Math.random() >= 0.5 ? "Heads" : "Tails")

bot.command('flip', (ctx) => ctx.reply(coin()))

//Dice
var die = () => (Math.floor(Math.random() * 6) + 1)
var dice = () => {
    return (Math.floor(Math.random() * 6) + 1) + ' - ' + 
            (Math.floor(Math.random() * 6) + 1) + ' - ' +
            (Math.floor(Math.random() * 6) + 1)
}
bot.command('roll', (ctx) => ctx.reply(die()))
bot.command('roll3', (ctx) => ctx.reply(dice()))

//Stack
var single_stack = false
const stack_o = ['♠️ A', '♠️ 2', '♠️ 3', '♠️ 4', '♠️ 5', '♠️ 6', '♠️ 7', '♠️ 8', '♠️ 9', '♠️ 10', '♠️ J', '♠️ Q', '♠️ K', 
                '♥️ A', '♥️ 2', '♥️ 3', '♥️ 4', '♥️ 5', '♥️ 6', '♥️ 7', '♥️ 8', '♥️ 9', '♥️ 10', '♥️ J', '♥️ Q', '♥️ K', 
                '♣️ A', '♣️ 2', '♣️ 3', '♣️ 4', '♣️ 5', '♣️ 6', '♣️ 7', '♣️ 8', '♣️ 9', '♣️ 10', '♣️ J', '♣️ Q', '♣️ K', 
                '♦️ A', '♦️ 2', '♦️ 3', '♦️ 4', '♦️ 5', '♦️ 6', '♦️ 7', '♦️ 8', '♦️ 9', '♦️ 10', '♦️ J', '♦️ Q', '♦️ K']

var settings = (ctx) => {
    if(localStorage.getItem(ctx.message.chat.id) === null)
        localStorage.setItem(ctx.message.chat.id, JSON.stringify([false, stack_o]))
    return JSON.parse(localStorage.getItem(ctx.message.chat.id))
}

var card = (inline, ctx) => {
    var setting
    if (inline)
        setting = [false, stack_o]
    else
        setting = settings(ctx)

    if (setting[0]){
        if (setting[1].length == 0)
            setting[1] = stack_o
        var card = setting[1][Math.floor(Math.random() * setting[1].length)]
        setting[1] = setting[1].filter(e => e !== card)
        localStorage.setItem(ctx.message.chat.id, JSON.stringify(setting))
        return (card + "\n" + setting[1].length + ' card(s) left in the stack.')
    } else {
        var suits = ['♠️', '♥️', '♣️', '♦️']
        var ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K']
        return (suits[Math.floor(Math.random() * suits.length)] + ' ' + ranks[Math.floor(Math.random() * ranks.length)])
    }
}

bot.command('draw', (ctx) => ctx.reply(card(false, ctx)))

bot.command('singlestack', (ctx) =>{
    var msg
    var setting = settings(ctx)
    //trigger single stack mode
    if (setting[0]){
        setting[0] = false
        msg = ('Now you \/draw a card from a new stack every time.' + "\n" + 'Call again to enable.')
    } else {
        setting[0] = true
        msg = ('Now you will never \/draw the same card until you \/shuffle the stack. ' + "\n" + 'Call again to disable.')
    }
    localStorage.setItem(ctx.message.chat.id, JSON.stringify(setting))
    return ctx.reply(msg)
})

bot.command('shuffle', (ctx) =>{
    var setting = settings(ctx)
    //restore the stack in single stack mode
    if (setting[0]){
        setting[1] = stack_o
        localStorage.setItem(ctx.message.chat.id, JSON.stringify(setting))
        return ctx.reply('A brand new stack has been shuffled.' + "\n" + setting[1].length + ' card(s) left in the stack.')
    } else {
        return ctx.reply('You are not in \/singlestack mode.')
    }
    
})

//Pick one from list
var invalid_choices = 'Huh? My hearing isn\'t too well. Try again with following pattern: \/pick 🅰️, 🅱️, ...'
var one = (txt) => {
    var options = txt.split(',').map(item => item.trim()).filter(item => item !== '')
    if (options.length == 1)
        return (options[0] + ' is the one and the only one. Unlike the universe, there\'re multiple of them existing parallely.')
    else if (options.length > 0)
        return ('Out of ' + options.join(', ') +'\n*'+options[Math.floor(Math.random() * options.length)] + '* has to be the one. 😉')
    else 
        return (invalid_choices)
}
bot.command('pick', (ctx) => {
    var i = ctx.message.text.trim().indexOf(' ')
    if (i > 0)
        return ctx.replyWithMarkdown(one(ctx.message.text.substr(i + 1)))
    else
        return ctx.replyWithMarkdown(invalid_choices)
    
})

//New suggestion from users
bot.command('suggest', (ctx) =>{
    var invalid_suggestion = 'Huh? My hearing isn\'t too well. Try again with \/suggest and follow by your suggestions. The universe won\'t accept blank suggestions.'
    var i = ctx.message.text.trim().indexOf(' ')
    if (i > 0){
        var msg = ctx.message.text.substr(i + 1)
        if (msg.trim().length > 0){
            bot.telegram.sendMessage(MYID, '@' + ctx.from.username + ' suggested to ' + msg)
            return ctx.reply ('May the universe be with you, I will look into this soon. 💪')
        } else {
            return ctx.reply (invalid_suggestion)
        }
    } else {
        return ctx.reply(invalid_suggestion)
    }
})

//Donation section
const invoice = {
    provider_token: PROVIDER_TOKEN,
    start_parameter: 'buy-wise-a-drink',
    title: 'The Nerd Drink',
    description: 'Like everything in the universe , wisdom requires energy input to function. Please, if you\'re a seeker of wisdom, ensure that this wisdom can continue to be spread. To ensure this is done, it requires significant amount of redbulls to happen.',
    photo_url: 'https://holland.pk/uptow/i4/8c94c66b3a7600b76c17ad90eb6516d1.png',
    photo_width: 228,
    photo_height: 436,
    currency: 'aud',
    prices: [
        { label: 'Nerd Drink', amount: 1000 }
    ],
    payload: {
        coupon: 'BURP'
    }
}
const buyOptions = Markup.inlineKeyboard([
    Markup.payButton('💸 Buy')
  ]).extra()

bot.command('nerddrink', (ctx) =>{
    if (ctx.message.chat.type !== "private")
        return ctx.reply('We should talk about this privately. 😉')
    else
        return ctx.replyWithInvoice(invoice, buyOptions)
})
bot.on('pre_checkout_query', (ctx) => ctx.answerPreCheckoutQuery(true))
bot.on('successful_payment', (ctx) =>{
    ctx.telegram.sendMessage(MYID, '@' + ctx.from.username + ' bought you a nerd drink! 🍻')
    return ctx.reply('May the universe be with you! 🍻'+"\n"+'As you may know, energy bill is going up crazy, the Wise cannot make it on his own. Your help is very appreciated!')
})

//Inline mode
bot.on('inline_query', async (ctx) => {
    var result = [{type: "article",
                    id: "coin",
                    title: "Heads or Tails 🌝",
                    input_message_content: {
                        message_text: coin(),
                        parse_mode: 'Markdown'
                    }
                },
                    {type: "article",
                    id: "die",
                    title: "🎲",
                    input_message_content: {
                        message_text: die(),
                        parse_mode: 'Markdown'
                    }
                },
                    {type: "article",
                    id: "dice",
                    title: "🎲🎲🎲",
                    input_message_content: {
                        message_text: dice(),
                        parse_mode: 'Markdown'
                    }
                },
                    {type: "article",
                    id: "card",
                    title: "🃏",
                    input_message_content: {
                        message_text: card(true),
                        parse_mode: 'Markdown'
                    }
                },
                    {type: "article",
                    id: "pick",
                    title: "Pick from",
                    description: "🅰️, 🅱️, ...",
                    input_message_content: {
                        message_text: one(ctx.inlineQuery.query),
                        parse_mode: 'Markdown'
                    }
                }]
    return ctx.answerInlineQuery(result, 
        {
            is_personal: true,
            cache_time: 0
        })
})

//start poll uptdates
bot.startPolling()
