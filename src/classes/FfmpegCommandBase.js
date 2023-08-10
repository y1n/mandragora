export default class FfmpegCommandBase {
    /**
     * 
     * @param {object} obj
     * @param {string} obj.id
     * @param {Promise<any>} obj.command 
     */
    constructor(obj) {
        this.id = obj.id;
        this.command = obj.command;
    }
}