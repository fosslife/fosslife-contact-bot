const { Composer, session } = require('micro-bot')

const bot = new Composer()

// bot.use(log())
bot.use(session())

bot.start(({ reply }) => reply('Welcome to the fosslife. You can contact administrators with this bot and even share any posts/links you want to share'))
bot.help(({ reply }) => reply('Type anything and send, the message will be automatically forwarded to admins'))

bot.on('message', (ctx) => {
  if (ctx.update.message.chat.id !== -1001168418071) {
    ctx.forwardMessage(-1001168418071, ctx.update.message.from.id, ctx.update.message['message_id'])
    return ctx.reply('Thanks for contacting')
  } else {
    ctx.tg.sendMessage(ctx.update.message.reply_to_message.forward_from.id, ctx.update.message.text)
  }
})

module.exports = bot
