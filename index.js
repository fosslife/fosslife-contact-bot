const { Composer, session } = require('micro-bot')

const bot = new Composer()

// bot.use(log())
bot.use(session())

bot.start(({ reply }) => reply('Welcome to the fosslife. You can contact administrators with this bot and even share any posts/links you want to share'))
bot.help(({ reply }) => reply('Type anything and send, the message will be automatically forwarded to admins'))

bot.on('message', ({forwardMessage, reply, update: {message}, telegram }) => {
  if (message.chat.id !== -1001168418071) {
    forwardMessage(-1001168418071, message.from.id, message['message_id'])
    return reply('Thanks for contacting')
  } else {
    console.log(telegram);
    telegram.sendMessage(message.reply_to_message.forward_from.id, message.text)
  }
})

module.exports = bot
