const Telegraf = require('telegraf')
const bot = new Telegraf(process.env.BOT_TOKEN)

bot.start((ctx) => {
  console.log('started:', ctx.from.id)
  return ctx.reply('Hallo! I am the wise, I can help with all your decisions.')
})
// bot.command('help', (ctx) => ctx.reply('Try send a sticker!'))
// bot.hears('hi', (ctx) => ctx.reply('Kristy is a pig!'))
// bot.hears(/buy/i, (ctx) => ctx.reply('Buy-buy!'))
// bot.on('sticker', (ctx) => ctx.reply('👍'))

bot.command('flip', (ctx) =>{
    //flip a coin
    var coin = (Math.random() >= 0.5 ? "Heads" : "Tails");
    return ctx.reply(coin)
})

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

var single_stack = false
const stack_o = ['♠️ A', '♠️ 2', '♠️ 3', '♠️ 4', '♠️ 5', '♠️ 6', '♠️ 7', '♠️ 8', '♠️ 9', '♠️ 10', '♠️ J', '♠️ Q', '♠️ K', 
                '♥️ A', '♥️ 2', '♥️ 3', '♥️ 4', '♥️ 5', '♥️ 6', '♥️ 7', '♥️ 8', '♥️ 9', '♥️ 10', '♥️ J', '♥️ Q', '♥️ K', 
                '♣️ A', '♣️ 2', '♣️ 3', '♣️ 4', '♣️ 5', '♣️ 6', '♣️ 7', '♣️ 8', '♣️ 9', '♣️ 10', '♣️ J', '♣️ Q', '♣️ K', 
                '♦️ A', '♦️ 2', '♦️ 3', '♦️ 4', '♦️ 5', '♦️ 6', '♦️ 7', '♦️ 8', '♦️ 9', '♦️ 10', '♦️ J', '♦️ Q', '♦️ K']
var stack = stack_o

bot.command('single_stack', (ctx) =>{
    //
    if (single_stack){
        single_stack = false
        return ctx.reply('Now you draw a card from a new stack every time.')
    } else {
        single_stack = true
        return ctx.reply('Now you will never draw the same card until you \/shuffle_stack .')
    }
})

bot.command('shuffle_stack', (ctx) =>{
    //
    if (single_stack){
        stack = stack_o
        return ctx.reply('A brand new stack has been shuffled.' + "\n" + stack.length + ' card(s) left in the stack.')
    } else {
        return ctx.reply('You are not in \/single_stack mode.')
    }
    
})
bot.command('stack', (ctx) => ctx.reply(stack.length))

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

bot.command('one', (ctx) =>{
    //pick the one from a group
    return ctx.reply('pick the one from a group!')
})




bot.startPolling()