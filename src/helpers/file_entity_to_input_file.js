import grammy_types from '@grammyjs/types';
import grammy from 'grammy';
import get_response_from_file_entity from './get_response_from_file_entity.js';
/**
 * 
 * @param {object} obj
 * @param {grammy.Context} obj.ctx
 * @param {grammy_types.Video | grammy_types.VideoNote | grammy_types.Sticker | grammy_types.Animation} obj.file_entity
 * @returns {Promise<grammy.InputFile>}
 */
export default async function(obj) {
    const res = await get_response_from_file_entity(obj);
    const blob = await res.blob();
    const stream = blob.stream();
    const input_file = new grammy.InputFile(stream);
    return input_file;
}