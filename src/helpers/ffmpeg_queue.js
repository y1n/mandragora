import os from 'node:os';
import FfmpegCommandBase from '../classes/FfmpegCommandBase.js';

const max_thread_count = os.cpus().length;

class FfmpegQueue {
    constructor() {
        this._arr = [];
    }

    /**
     * @returns {FfmpegCommandBase[]}
     */
    get arr() {
        return this._arr;
    }
    /**
     * 
     * @param {FfmpegCommandBase} command 
     */
    add(command) {
        if (this.arr.length < max_thread_count) {
            this.arr.push(command);
        }
    }
    /**
     * 
     * @param {FfmpegCommandBase} command 
     */
    remove(command) {
        this.arr = this.arr.filter(cmd => cmd.id !== command.id);
    }
}

export default new FfmpegQueue();