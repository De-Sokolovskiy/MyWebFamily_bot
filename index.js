const {Telegraf, session, Scenes: { WizardScene, Stage }, Markup} = require('telegraf')
require('dotenv').config() //Необходимо для запуска токена из файла указанного ниже
const text = require('./const')



const bot = new Telegraf(process.env.TOKEN) //подключение токена бота
/* 
bot.start((ctx) => ctx.reply(`Привет, ${ctx.message.from.first_name ? ctx.message.from.first_name :
     'друг'}! Я чат бот🙌🏻😇. Выбери то, что тебя интересует и я тебя со всем ознакомлю.`)) */

bot.help((ctx) => ctx.reply(text.commands)) //берем константы из файла const.js, там текст из const commands

bot.command('start', async (ctx)=>{
 
    try{ //ставим в try для отслеживания ошибки
        // await используем везде где метод ctx
        await ctx.replyWithHTML('Привет, друг! Меня зовут <b>Мистер Мопс</b>🙌🏻😇. Выбери то, что тебя интересует и я тебя со всем ознакомлю.', Markup.inlineKeyboard(
            [
                [Markup.button.callback('Заказать сайт', 'btn_1')],
                [Markup.button.callback('Портфолио', 'btn_2'), Markup.button.callback('Социальные сети', 'btn_3')]
              
            ]
        )) 
    } catch(e) {
        console.error(e) //если выскакивает ошибка, то она появляется в консоли
    }
  
})

function addActionBot(name, src, text) { //УНИВЕРСАЛЬНАЯ ФУНКЦИЯ ДЛЯ КНОПОК

    bot.action(name, async (ctx) => {

        try{
            await ctx.answerCbQuery()//Чтобы пропадали часики загрузки в прошлой кнопке
            if(src !== false) { //если нет изображения, вышла ошибка по ней и т.д.
                await ctx.replyWithPhoto({
                    source: src
                }) //то ничего не выполняется
            }
            await ctx.replyWithHTML(text, {
                disable_web_page_preview: true //если в тексте ссылка, то данный текст убирает сниппет
            })
    
        } catch(e) {
            console.error(e) //если выскакивает ошибка, то она появляется в консоли
        }
    })

}

//ЗАПОЛНИТЬ ЗАЯВКУ


addActionBot('btn_2', false, text.text2 )



bot.action('btn_3', async (ctx) => {

    try{
        await ctx.answerCbQuery()//Чтобы пропадали часики загрузки в прошлой кнопке
        await ctx.replyWithPhoto({
                source: './img/social.jpeg'
            }) 
        
        await ctx.replyWithHTML('Посмотреть нас можно здесь', Markup.inlineKeyboard([
            [
                Markup.button.callback('Вконтакте', 'btn_vk'),
                Markup.button.callback('Instagram', 'btn_instagram')
            ]
        
        ]))

    } catch(e) {
        console.error(e) //если выскакивает ошибка, то она появляется в консоли
    }
})

bot.action('btn_vk', async (ctx) => {
    try{
        await ctx.reply
    } catch(e) {
        console.error(e) //если выскакивает ошибка, то она появляется в консоли
    }
})







bot.launch()

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))