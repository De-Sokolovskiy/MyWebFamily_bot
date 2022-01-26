const {Telegraf, session, Scenes: { WizardScene, Stage }, Markup} = require('telegraf')
const TelegramBot = require('node-telegram-bot-api')
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
        await ctx.replyWithHTML(`Привет, ${ctx.message.from.first_name ? ctx.message.from.first_name :
            'друг'} ! Меня зовут <b>Мистер Мопс</b>🙌🏻😇. Выбери то, что тебя интересует и я тебя со всем ознакомлю.`, Markup.inlineKeyboard(
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
const exit_keyboard = Markup.keyboard(['Выйти из заполнения']).oneTime()
const remove_keyboard = Markup.removeKeyboard()

const nameHadler = Telegraf.on('text', async ctx => {

    ctx.scene.state.name = ctx.message.text

    await ctx.reply('Для того, чтобы оставить заявку, оставь, пожалуйста, номер телефона, чтобы мы могли с тобой связаться😉', exit_keyboard)

    return ctx.wizard.next()

})

const numberHadler = Telegraf.hears(/^[0-9]+$/, async ctx => {

    ctx.scene.state.telephon = ctx.message.text

    await ctx.reply('Если мы не дозвонимся, то отправим тебе на почту сообщение. Введи, пожалуйста, свою почту', exit_keyboard)

    return ctx.wizard.next()
})

const mailHadler = Telegraf.on('text', async ctx => {

    ctx.scene.state.mail = ctx.message.text

    await ctx.reply('Опиши проект, который тебе необходим, мы заранее подготовим вопросы для создания твоего сайта🤔', remove_keyboard)

    return ctx.wizard.next()

})

const descrHadler = Telegraf.on('text', async ctx => {

    ctx.scene.state.descr = ctx.message.text
    Object.assign(ctx.session, ctx.scene.state)

    await ctx.replyWithHTML(
        ` Проверь правильность внесенных данных, после чего, я отправлю их на рассмотрение.
        <b>Обращение:</b> ${ctx.session.name}
        <b>Твой номер:</b> ${ctx.session.telephon}
        <b>Твой номер:</b> ${ctx.session.mail}
        <b>Описание проекта:</b> ${ctx.session.descr}
        `,
        Markup.inlineKeyboard([
        Markup.button.callback('Отправить', 'btn_info'),
        ])
        

    )

    return ctx.scene.leave()
         
})

bot.action('btn_info', async (ctx) => {

    try{
        await ctx.answerCbQuery()//Чтобы пропадали часики загрузки в прошлой кнопке

        await ctx.replyWithPhoto({
            source: './img/desc.jpg'
        }) 
        
        await ctx.replyWithHTML ( 
        `
Урааааа, мы прошли все шаги и заявка направлена нам!🤩
Позднее мы свяжемся и обсудим твой проект.🤘        
Ну а пока, ты можешь ознакомиться с нашим портфолио или посмотреть наши странички в соц.сетях.
        `,
        Markup.inlineKeyboard([
            [Markup.button.callback('Портфолио', 'btn_2'), 
            Markup.button.callback('Социальные сети', 'btn_3')]
        
        ]))

    } catch(e) {
        console.error(e) //если выскакивает ошибка, то она появляется в консоли
    }

})

const infoScene = new WizardScene('infoScene', nameHadler, numberHadler, mailHadler, descrHadler)
infoScene.enter(ctx => ctx.reply('Как к тебе можно обращаться?', exit_keyboard))

const stage = new Stage([ infoScene ])
stage.hears('exit', ctx => ctx.scene.leave())

bot.use(session(), stage.middleware())


bot.action('btn_1', ctx => ctx.scene.enter('infoScene'))



//ПОРТФОЛИО
bot.action('btn_2', async (ctx) => {
    await ctx.answerCbQuery()//Чтобы пропадали часики загрузки в прошлой кнопке

    try{
        await ctx.replyWithPhoto({
            source: './img/intel.png'         
        }) 
        await ctx.replyWithHTML('Концепт редизайна сайта брендингового агентства Intelligent Deals', {
            reply_markup: {
                inline_keyboard: [
                    [
                        {
                            text: "Посмотреть",
                            url: 'https://www.behance.net/gallery/133147585/Intelligent-Deals-brand-agency-redesign-website'
                        }
                    ]
                ]
            }
        })

        await ctx.replyWithPhoto({
            source: './img/ostin.png'         
        }) 
        await ctx.replyWithHTML('Концепт промо-сайта интернет-магазина одежды O’STIN', {
            reply_markup: {
                inline_keyboard: [
                    [
                        {
                            text: "Посмотреть",
                            url: 'https://www.behance.net/gallery/133078249/OSTIN-online-clothing-store-redesign-website'
                        }
                    ]
                ]
            }
        })

        await ctx.replyWithPhoto({
            source: './img/cifra.png'         
        }) 
        await ctx.replyWithHTML('Концепция сайта для Высшей школы цифровой культуры Университета ИТМО', {
            reply_markup: {
                inline_keyboard: [
                    [
                        {
                            text: "Посмотреть",
                            url: 'https://www.behance.net/gallery/129926473/Higher-School-of-Digital-Culture-Website'
                        }
                    ]
                ]
            }
        })
            

        await ctx.replyWithPhoto({
            source: './img/puls.png'         
        }) 
        await ctx.replyWithHTML('Проект магазина пульсометров', {
            reply_markup: {
                inline_keyboard: [
                    [
                        {
                            text: "Посмотреть",
                            url: 'http://desokolovskiy.ru/'
                        }
                    ]
                ]
            }
        })

        await ctx.replyWithPhoto({
            source: './img/taxi.png'         
        }) 
        await ctx.replyWithHTML('Проект сервиса такси', {
            reply_markup: {
                inline_keyboard: [
                    [
                        {
                            text: "Посмотреть",
                            url: 'http://desokolovskiy.ru/'
                        }
                    ]
                ]
            }
        })

        await ctx.replyWithPhoto({
            source: './img/mlg.png'         
        }) 
        await ctx.replyWithHTML('Сайт с генератором паролей для внутренних нужд компании', {
            reply_markup: {
                inline_keyboard: [
                    [
                        {
                            text: "Посмотреть",
                            url: 'http://desokolovskiy.ru/'
                        }
                    ]
                ]
            }
        })

    } catch(e) {
        console.error(e) //если выскакивает ошибка, то она появляется в консоли
    }   

})


//СОЦ.СЕТИ
bot.action('btn_3', async (ctx) => {

    try{
        await ctx.answerCbQuery()//Чтобы пропадали часики загрузки в прошлой кнопке
        await ctx.replyWithPhoto({
                source: './img/social.jpeg'
            }) 
        
        await ctx.replyWithHTML('Посмотреть наши посты в соц.сети можно здесь', {
            reply_markup: {
                inline_keyboard: [
                    [
                        {
                            text: "Вконтакте",
                            url: 'https://m.vk.com/public209076745'
                        },
                        {
                            text: "Instagram",
                            url: 'https://www.instagram.com/my_web_family/'
                        }
                    ]
                ]
            }
        }
        
        
        /* Markup.inlineKeyboard([
            [
                Markup.button.callback('Вконтакте', 'btn_vk'),
                Markup.button.callback('Instagram', 'btn_instagram')
            ]
        
        ]) */
        
        )

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