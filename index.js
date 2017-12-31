const Telegraf = require('telegraf')
const Markup = require('telegraf/markup')

const bot = new Telegraf(process.env.BOT_TOKEN)

bot.start((ctx) => {
    var msg = 'Grettings! I am the wise, I can help with all your decisions.'
    msg += "\n\n"
    msg += 'You can simply \/flip a coin, \/roll a die, or even \/roll3 dice at a time.'
    msg += "\n\n"
    msg += 'You can also \/draw a card from a stack. If you wish you can enable \/singlestack mode to \/draw cards from the same stack until you \/shuffle the stack'
    return ctx.reply(msg)
})

bot.command('help', (ctx) =>{
    var msg = 'Grettings! I am the wise, I can help you make decisions.'
    msg += "\n\n"
    msg += '*Coins*'
    msg += "\n"
    msg += '\/flip - flip a coin'
    msg += "\n\n"
    msg += '*Dices*'
    msg += "\n"
    msg += '\/roll - roll a die'
    msg += "\n"
    msg += '\/roll3 - roll three dice'
    msg += "\n\n"
    msg += '*Cards*'
    msg += "\n"
    msg += '\/draw - draw a card from a stack'
    msg += "\n"
    msg += '\/singlestack - toggle single stack mode'
    msg += "\n"
    msg += '\/shuffle - reset the stack when \/singlestack is toggled'
    msg += "\n\n"
    msg += '*Others*'
    msg += "\n"
    msg += '\/suggest - suggest a decision making method'
    msg += "\n"
    msg += '\/nerddrink - buy the wise a nerd drink, he needs energy to make decisions'
    
    return ctx.replyWithMarkdown(msg)
})

//Coin
bot.command('flip', (ctx) =>{
    //flip a coin
    var coin = (Math.random() >= 0.5 ? "Heads" : "Tails");
    return ctx.reply(coin)
})

//Dice
bot.command('roll', (ctx) =>{
    //roll a dics
    return ctx.reply(Math.floor(Math.random() * 6) + 1)
})

bot.command('roll3', (ctx) =>{
    //roll 3 dices
    var a = Math.floor(Math.random() * 6) + 1
    var b = Math.floor(Math.random() * 6) + 1
    var c = Math.floor(Math.random() * 6) + 1
    return ctx.reply(a + ' - ' + b + ' - ' + c)
})

//Stack
var single_stack = false
const stack_o = ['♠️ A', '♠️ 2', '♠️ 3', '♠️ 4', '♠️ 5', '♠️ 6', '♠️ 7', '♠️ 8', '♠️ 9', '♠️ 10', '♠️ J', '♠️ Q', '♠️ K', 
                '♥️ A', '♥️ 2', '♥️ 3', '♥️ 4', '♥️ 5', '♥️ 6', '♥️ 7', '♥️ 8', '♥️ 9', '♥️ 10', '♥️ J', '♥️ Q', '♥️ K', 
                '♣️ A', '♣️ 2', '♣️ 3', '♣️ 4', '♣️ 5', '♣️ 6', '♣️ 7', '♣️ 8', '♣️ 9', '♣️ 10', '♣️ J', '♣️ Q', '♣️ K', 
                '♦️ A', '♦️ 2', '♦️ 3', '♦️ 4', '♦️ 5', '♦️ 6', '♦️ 7', '♦️ 8', '♦️ 9', '♦️ 10', '♦️ J', '♦️ Q', '♦️ K']
var stack = stack_o

bot.command('singlestack', (ctx) =>{
    //
    if (single_stack){
        single_stack = false
        return ctx.reply('Now you draw a card from a new stack every time.' + "\n" + 'Call again to enable.')
    } else {
        single_stack = true
        return ctx.reply('Now you will never draw the same card until you \/shuffle the stack. ' + "\n" + 'Call again to enable.')
    }
})

bot.command('shuffle', (ctx) =>{
    //
    if (single_stack){
        stack = stack_o
        return ctx.reply('A brand new stack has been shuffled.' + "\n" + stack.length + ' card(s) left in the stack.')
    } else {
        return ctx.reply('You are not in \/singlestack mode.')
    }
    
})

bot.command('draw', (ctx) =>{
    //draw a card from a stack
    if (single_stack){
        var card = stack[Math.floor(Math.random() * stack.length)]
        stack = stack.filter(e => e !== card)
        return ctx.reply(card + "\n" + stack.length + ' card(s) left in the stack.')
    } else {
        var suits = ['♠️', '♥️', '♣️', '♦️']
        var ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K']
        return ctx.reply(suits[Math.floor(Math.random() * suits.length)] + ' ' + ranks[Math.floor(Math.random() * ranks.length)])
    }
    
})

//Pick one from list

bot.command('pick', (ctx) =>{
    var i = ctx.message.text.trim().indexOf(' ')
    if (i > 0){
        var options = (ctx.message.text.substr(i + 1)).split(',').map(item => item.trim()).filter(item => item !== '')
        if (options.length > 0){
            return ctx.reply(options[Math.floor(Math.random() * options.length)] + ' has to be the one.')
        } else {
            return ctx.reply('Huh? My hearing isn\'t too well. Try again with following pattern: \/pick option1, option2, option3, ...')
        }
    } else {
        return ctx.reply('Huh? My hearing isn\'t too well. Try again with following pattern: \/pick option1, option2, option3, ...')
    }
})

//New suggestion from users
bot.command('suggest', (ctx) =>{
})

//Donation section
const invoice = {
    provider_token: process.env.PROVIDER_TOKEN,
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
    return ctx.replyWithInvoice(invoice, buyOptions)
})
bot.on('pre_checkout_query', (ctx) => ctx.answerPreCheckoutQuery(true))
bot.on('successful_payment', (ctx) => ctx.reply('Thank you! 🍻'+"\n"+'As you may know, energy bill is going up crazy, the Wise cannot make it on his own. Your help is very appreciated!'))

//start poll uptdates
bot.startPolling()