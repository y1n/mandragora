import ffmpeg from "fluent-ffmpeg";
import { Transform } from 'node:stream';
import grammy from 'grammy';

/**
 * @param {object} obj
 * @param {string} obj.url image url
 * @param {('vertical'|'horizontal')} obj.type
 * @returns {grammy.InputFile} .webm file
 */
export default async function (obj) {
    const io_stream = new Transform({
        transform(chunk, encoding, callback) {
            this.push(chunk);
            callback();
        }
    });

    const output_filters = [];
    const size_filter = obj.type === 'horizontal' ? 'scale=w=512:h=trunc(ow/a/2)*2' : 'scale=w=trunc(oh*a/2)*2:h=512';
    output_filters.push(size_filter);

    const output_filters_str = '-vf '+output_filters.join(',');
    const o_opts = ['-crf 50', '-vcodec libvpx-vp9', '-framerate 1', '-frames:v 1', '-loop 1', '-t 3', output_filters_str]

    const cmd = ffmpeg(obj.url)
        .outputOptions(o_opts)
        .toFormat('webm')
        .on('error', (err) => console.error(err));
    
    cmd.pipe(io_stream, { end: true });

    // io_stream.on('data', (data) => console.log(data));
    io_stream.on('error', (err) => console.error(err));
    // io_stream.on('finish', () => {
    //     console.log('io_stream finished')
    // });
    return new grammy.InputFile(io_stream, `${Date.now()}.webm`)
}