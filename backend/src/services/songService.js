import {
    spawn
} from 'child_process';

export const downloadCurrentSong = (songName) => {
    return new Promise((resolve, reject) => {
        const songQuery = "ytsearch:" + songName;

        const ytdlp = spawn('yt-dlp', [
            songQuery,
            '-x',
            '--audio-format', 'mp3',
            '-f', 'bestaudio/best',
            '-o', '-',
        ]);

        let chunks = [];

        ytdlp.stdout.on('data', (chunk) => {
            chunks.push(chunk);
        })

        ytdlp.stderr.on('data', (data) => {
            console.error('yt-dlp stderr', data.toString());
        })

        ytdlp.on('close', async (code) => {
            if (code !== 0) {
                console.error('yt-dlp failed to download');
                reject(new Error(`Download failed ${code}}`));
                return;
            }

            const fullAudio = Buffer.concat(chunks);
            resolve(fullAudio);
        })

        ytdlp.on('error', (error) => {
            reject(`Download failed ${error}}`)
        })
    })
}