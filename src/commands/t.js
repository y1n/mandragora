import grammy from 'grammy';
import speech_to_text from '../helpers/speech_to_text.js';
import get_response_from_file_entity from '../helpers/get_response_from_file_entity.js';

const file_size_limit = 1e+7;

export default {
    name: 't',
    description: '[відповідь] /t :: транскрибувати аудіо/відео',
    /**
     * 
     * @param {grammy.CommandContext<grammy.Context>} ctx 
     */
    execute: async (ctx) => {
        const original_message = ctx.message.reply_to_message;
        if (!original_message) return;

        const file_entity = original_message.voice || original_message.video_note;
        if (!file_entity || file_entity.file_size > file_size_limit) return;
        
        try {
            const file = await get_response_from_file_entity({ctx, file_entity});
            if (!file) throw 'Не вдалось завантажити файл';
            const text = await speech_to_text(file);
            await ctx.reply(text);
        }
        catch (e) {
            console.error(e);
            await ctx.reply('анлакі🥀');
        }
    }
}