import { Bot } from 'grammy';
import { run } from '@grammyjs/runner';
import auto_retry from '@grammyjs/auto-retry';
import transformer_throttler from '@grammyjs/transformer-throttler';
import rate_limit from '@grammyjs/ratelimiter';
import commands from './events/command.js';
// import blocked from 'blocked-at';
import ignore_bots_middleware from './helpers/ignore_bots_middleware.js'

const bot = new Bot(process.env.BOT_TOKEN);

bot.use(rate_limit.limit());
bot.api.config.use(auto_retry.autoRetry(), transformer_throttler.apiThrottler());

// blocked((time, stack) => {
//     console.error(`Blocked for ${time}ms, operation started here:`, stack)
// })

bot.on('msg::bot_command', ignore_bots_middleware);

const cmds = commands.map(c => {
    bot.command(c.name, c.execute);
    return ({ command: c.name, description: c.description })
});

await bot.api.setMyCommands(cmds);

run(bot);

bot.catch(err => console.error(err.message, err.stack || ''));

export default bot;