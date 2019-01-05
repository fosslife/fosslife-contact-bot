const { Composer, session, Stage } = require('micro-bot');
const Scene = require('telegraf/scenes/base')
const { leave } = Stage
const axios = require('axios')
// Greeter
const greeter = new Scene('kutt');
greeter.enter((ctx) => ctx.reply('Send me the API key'))
greeter.leave((ctx) => ctx.reply('Bye'))
greeter.hears(/^Yf~.*/, async (ctx) => {
  ctx.session.apikey = ctx.update.message.text;
  ctx.reply('Thanks, now send the url to shorten');
})
greeter.hears(/^http/, async (ctx) => {
  const url = ctx.update.message.text;
  if (ctx.session.apikey) {
    const shortened = await axios({
      method: 'POST',
      url: 'https://kutt.it/api/url/submit',
      headers: {
        // 'Content-Type': 'application/x-www-form-urlencoded',
        'x-api-key': ctx.session.apikey
      },
      data: {
        target: url
      }
    })
    delete ctx.session.apikey
    ctx.reply(shortened.data.shortUrl);
  } else {
    console.log(ctx);
    ctx.reply('Need API key to generate short URL, please send /start Command')
  }
});
greeter.on('message', (ctx) => {
  ctx.reply('Please start again and send exactly asked data')
})

// Stage
const st = new Stage()
st.command('cancel', leave())
st.register(greeter)

const bot = new Composer()

// bot.use(log())
bot.use(session())
bot.use(st.middleware())

bot.start(({ reply }) => reply('Welcome to the fosslife. You can contact administrators with this bot and even share any posts/links you want to share'))
bot.help(({ reply }) => reply('Type anything and send, the message will be automatically forwarded to admins'))

bot.command('short', (ctx) => ctx.scene.enter('kutt'))

bot.on('message', ({ forwardMessage, reply, update: { message }, telegram }) => {
  if (message.chat.id !== -1001168418071) {
    forwardMessage(-1001168418071, message.from.id, message['message_id'])
    return reply('Thanks for contacting, Admins will get back to you soon :D')
  } else {
    telegram.sendMessage(message.reply_to_message.forward_from.id, message.text)
  }
})

module.exports = bot
