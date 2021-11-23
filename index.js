const { Telegraf, Markup } = require('telegraf')
require('dotenv').config()
const text = require('./const')


const bot = new Telegraf(process.env.BOT_TOKEN)
bot.start((ctx) => ctx.reply(`Привет ${ctx.message.from.first_name ? ctx.message.from.first_name: 'друг'}!`))
bot.help((ctx) => ctx.reply(text.commands))

bot.command('course',  async (ctx) => {
    try {
        ctx.replyWithHTML('<b>Курсы</b>', Markup.inlineKeyboard(
            [
                [Markup.button.callback('Редакторы', 'btn_1'), Markup.button.callback('Обзор', 'btn_2')],
                [Markup.button.callback('Кукумбер', 'btn_3')]
            ]
        )) 
    } catch (e) {
        console.erroe(e)
    }
        
})

function addActionBot(name, src, text){
    bot.action(name, async (ctx) => {
        try {
            await ctx.answerCbQuery()
            if(src !== false){
                await ctx.replyWithPhoto({
                    source: src
                })
            }
            await ctx.replyWithHTML(text, {
                disable_web_page_preview: true
            })
        } catch (e) {
            console.erroe(e)
        }
    });
}


addActionBot('btn_1', './img/Denus.png', text.text1)
addActionBot('btn_2', './img/Sasha.png', text.text2)
addActionBot('btn_3', false, text.text3)

bot.launch()


// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))