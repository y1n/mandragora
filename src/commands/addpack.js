import grammy from 'grammy';
import filter_emojis_from_string from '../helpers/filter_emojis_from_string.js';
import file_entity_to_input_file from '../helpers/file_entity_to_input_file.js';

export default {
    name: 'addpack',
    description: '/addpack <посилання_на_пак> :: створити власний стікер-пак на основі вказаного',
    /**
     * 
     * @param {grammy.CommandContext<grammy.Context>} ctx 
     */
    execute: async (ctx) => {
        const message = ctx.message?.text.replace('/addpack', '').trim();
        if (!message) return;
        const user = ctx.message.from;
        if (!user) return;
        const sticker_set_name = message.replace('https://t.me/addstickers/', '');
        const search_set = await ctx.api.getStickerSet(sticker_set_name).catch(() => null);
        if (!search_set) return;
        if (!search_set.is_video) return ctx.reply(`Масово об'єднувати можна лише відео-паки \\(_поки що?_\\). Статичні стікери додавайте індивідуально \\(/add\\)🥀`, {parse_mode:'MarkdownV2'})
        const own_set_name = `user${user.id}_by_${ctx.me.username}`;

        /**
         * 
         * @param {number} stickers_count - number of added stickers 
         */
        function construct_success_message(stickers_count) {
            return `${stickers_count} стікерів додано до [твого власного стікерпаку💐](https://telegram.me/addstickers/${own_set_name})`
        }

        const own_set = await ctx.api.getStickerSet(own_set_name).catch(() => null);
        const slice_length = own_set ? 50 - own_set.stickers.length + search_set.stickers.length : 50;
        const slice = slice_length > 0 ? slice_length : 0;
        const sticker_map = search_set.stickers.slice(0, slice).map(async s => {
            const emojis = Array.isArray(s.emoji) ? s.emoji.join('') : s.emoji;
            const emojis_filtered = filter_emojis_from_string(emojis);
            const emojis_final = emojis_filtered.length ? emojis_filtered : ['🌱'];
            const sticker_data = await file_entity_to_input_file({ctx, file_entity: s});
            return ({ sticker: sticker_data, emoji_list: emojis_final })
        });

        const sticker_promises = await Promise.all(sticker_map);

        if (!own_set) {
            const success = await ctx.api.createNewStickerSet(user.id, own_set_name, `твій власний🌱 | by @${ctx.me.username}`, sticker_promises, 'video').catch(err => {
                console.error(err);
                return null;
            });
            if (!success) return ctx.reply('анлакі🥀')
            return ctx.reply(construct_success_message(sticker_promises.length));
        }
        else {
            const added_stickers = sticker_promises.map(async sticker => {
                return ctx.api.addStickerToSet(user.id, own_set_name, sticker).catch(() => null);
            });
            const promises = await Promise.all(added_stickers).then(res => res.filter(r => !!r));
            return ctx.reply(construct_success_message(promises.length), { parse_mode: 'MarkdownV2' });
        }
    }
}
