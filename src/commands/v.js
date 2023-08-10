import grammy from 'grammy';
import text_to_speech from '../helpers/text_to_speech.js';

export default {
    name: 'v',
    description: '[відповідь] /t | /t <текст> :: озвучити текст',
    /**
     * 
     * @param {grammy.CommandContext<grammy.Context>} ctx 
     */
    execute: async (ctx) => {
        const text = (ctx.message?.reply_to_message?.text || ctx.message.text)
            .replace('/v', '')
            .trim();
        if (!text) return;
        try {
            const res = await text_to_speech({text: text});
            const fd = new grammy.InputFile(res);
            await ctx.replyWithVoice(fd);
        }
        catch (e) {
            console.error(e);
            await ctx.reply('анлакі🥀');
        }
    }
}