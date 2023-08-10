import tts from '@google-cloud/text-to-speech';

const client = new tts.TextToSpeechClient();

/**
 * 
 * @param {object} obj
 * @param {string} obj.text 
 * @param {number} obj.pitch
 * @param {number} obj.speed
 */
export default async function(obj) {
    if (!obj.text) return;
    obj.speed = parseFloat(obj.speed);
    obj.speed = isNaN(obj.speed) || (''+obj.speed).length > 4 ? 1 : obj.speed > 4 ? 4 : obj.speed < 0.25 ? 0.25 : obj.speed;
    obj.pitch = parseFloat(obj.pitch);
    obj.pitch = isNaN(obj.pitch) || (''+obj.pitch).length > 3 ? 0 : obj.pitch > 20 ? 20 : obj.pitch < -20 ? -20 : obj.pitch;

    const lang = 'uk-UA'
    const audio_encoding = 'OGG_OPUS';

    const [res] = await client.synthesizeSpeech({
        input: {
            text: obj.text
        },
        voice: {
            languageCode: lang,
            ssmlGender: 'FEMALE'
        },
        audioConfig: {
            audioEncoding: audio_encoding,
            pitch: obj.pitch,
            speakingRate: obj.speed
        }
    });
    
    return res.audioContent || null;
}