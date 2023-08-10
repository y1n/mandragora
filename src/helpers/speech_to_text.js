import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

/**
 * 
 * @param {ReadableStream<Uint8Array>} stream 
 * @returns {Promise<string>}
 */
export default async function (stream) {
    const transcribe = await openai.audio.transcriptions.create({
        model: 'whisper-1',
        file: stream
    });

    if (!transcribe.text) return 'шляпа'

    return transcribe.text;
}