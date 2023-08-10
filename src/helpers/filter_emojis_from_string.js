/**
 * 
 * @param {string} str 
 * @returns {[string]}
 */
export default function(str = '') {
    return str.match(/\p{Emoji}/ug) || [];
}