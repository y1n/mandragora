import grammy from 'grammy';
import get_url_from_file_entity from '../helpers/get_url_from_file_entity.js';
import mp4_to_webm from '../helpers/mp4_to_webm.js';
import filter_emojis_from_string from '../helpers/filter_emojis_from_string.js';
import image_to_webm from '../helpers/image_to_webm.js';
import file_entity_to_input_file from '../helpers/file_entity_to_input_file.js';

const max_media_file_size = 1e+7;
const video_mime_types = ['video/webm', 'video/mp4', 'video/mpeg', 'image/gif'];
const image_mime_types = ['image/jpeg', 'image/png', 'image/webp'];

export default {
    name: 'add',
    description: '[відповідь] /add :: поцупити стікер',
    /**
     * 
     * @param {grammy.CommandContext<grammy.Context>} ctx 
     */
    execute: async (ctx) => {
        const user = ctx.message.from;
        if (!user) return;
        const original_message = ctx.message.reply_to_message;
        if (!original_message) return;
        const emojis = filter_emojis_from_string(ctx.message.text).slice(0, 20);
        if (!emojis.length) {
            emojis.push('🌱');
        }
        const own_set_name = `user${user.id}_by_${ctx.me.username}`;
        const success_message = `Стікер додано до [твого власного стікерпаку💐](https://telegram.me/addstickers/${own_set_name})`;
        let new_sticker = null;

        try {
            const is_video = original_message.animation
                || original_message.video
                || original_message.video_note
                || (original_message.document && video_mime_types.includes(original_message.document.mime_type));
            
            const is_picture = original_message.photo?.length
                || (original_message.document && image_mime_types.includes(original_message.document.mime_type));
            
            const sticker = original_message.sticker;

            // console.log(`is_video: ${is_video}\nis_picture: ${is_picture}\nsticker: ${sticker}\ndocument: ${original_message.document}\ndocument_mime: ${original_message.document?.mime_type}`)

            if (is_video) {
                const message_video = original_message.animation
                    || original_message.video
                    || original_message.video_note
                    || original_message.document;

                if (message_video.file_size > max_media_file_size) return; //handle size threshold
                const duration = message_video.duration || 0;
                const speed_factor = duration > 3 ? (1 / (duration / 3)).toFixed(1) : '1';
                const url = await get_url_from_file_entity({ ctx, file_entity: message_video });
                const height = message_video.height || 0;
                const width = message_video.width || 0;
                const type = height > width ? 'vertical' : 'horizontal';
                const file = await mp4_to_webm({ url, type, speed_factor });
                new_sticker = file;
            }
            else if (is_picture) {
                const message_picture = original_message.photo?.pop()
                    || original_message.document;

                if (message_picture.file_size > max_media_file_size) return; //handle size threshold
                const height = message_picture.height || message_picture.thumbnail?.height || 0;
                const width = message_picture.width || message_picture.thumbnail?.width || 0;
                const type = height > width ? 'vertical' : 'horizontal';
                const url = await get_url_from_file_entity({ ctx, file_entity: message_picture });
                const file = await image_to_webm({ url, type });
                new_sticker = file;
            }
            else if (sticker) {
                if (sticker.is_animated) return ctx.reply('Додавання векторних анімованих стікерів \\(_поки що?_\\) не підтримується🥀', {parse_mode: 'MarkdownV2'})
                new_sticker = await file_entity_to_input_file({ctx, file_entity: sticker});
                emojis.push(sticker.emoji);
            }
            else {
                return; //handle unsupported file
            }

            const sticker_format = sticker ? undefined : is_video ? 'video' : 'static';
            const own_set = await ctx.api.getStickerSet(own_set_name).catch(() => null);
            
            if (!own_set) {
                await ctx.api.createNewStickerSet(user.id, own_set_name, `твій власний🌱 | by @${ctx.me.username}`, [{sticker: new_sticker, emoji_list: emojis}], sticker_format);
            }
            else {
                if (own_set.stickers.length === 50) {
                    return ctx.reply('Неможливо додати стікери через перевищення ліміту (50 стікерів/пак)🥀')
                }
                else {
                    await ctx.api.addStickerToSet(user.id, own_set_name, {sticker: new_sticker, emoji_list: emojis});
                }
            }
            return ctx.reply(success_message, {parse_mode: 'MarkdownV2'});
        }
        catch (e) {
            console.error(e);
            return ctx.reply('анлакі помилка')
        }
    }
}