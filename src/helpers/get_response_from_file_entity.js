import get_url_from_file_entity from './get_url_from_file_entity.js';
import grammy_types from '@grammyjs/types';
import grammy from 'grammy';
import fetch from 'node-fetch';
/**
 * 
 * @param {object} obj
 * @param {grammy.Context} obj.ctx
 * @param {grammy_types.Video | grammy_types.VideoNote | grammy_types.Sticker | grammy_types.Animation} obj.file_entity
 * @returns {Promise<Response> | null>}
 */
export default async function(obj) {
    const file_url = await get_url_from_file_entity(obj);
    return fetch(file_url);
}