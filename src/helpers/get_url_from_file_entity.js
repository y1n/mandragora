import grammy_types from '@grammyjs/types';
import grammy from 'grammy';
/**
 * 
 * @param {object} obj
 * @param {grammy.Context} obj.ctx
 * @param {grammy_types.Video | grammy_types.VideoNote | grammy_types.Sticker | grammy_types.Animation} obj.file_entity
 * @returns {Promise<string | null>}
 */
export default async function(obj) {
    const file = await obj.ctx.api.getFile(obj.file_entity.file_id);
    if (!file.file_path) return null;
    return `https://api.telegram.org/file/bot${process.env.BOT_TOKEN}/${file.file_path}`;
}