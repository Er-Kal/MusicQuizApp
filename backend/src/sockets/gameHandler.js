
import { getCurrentTracks } from '../controllers/playlistController.js';
import { downloadCurrentSong } from '../services/songService.js';
import Leventshtein from 'fast-levenshtein';

let currentTracks = [];
let playlistName = "";
let artistName = "";
let trackName = "";
let roundStart = null;

// Function that waits for a delay
const delay = async (ms) => new Promise(resolve => setTimeout(resolve, ms));
const cleanString = (str) => str.toLowerCase().trim().replace(/[^a-z0-9]/g, '');

export default (io, socket, lobbyState) => {

    // Prepare lobby state for next round
    function prepareNextRound(){
        lobbyState.roundNumber++;
    }

    // Contains game loop logic
    // Check if game ended
    // Start round
    // Cooldown timer
    // Download song
    // Set guessing state
    // Wait 30s, prepare next round, restart game loop
    async function runGameLoop(){
        console.log(1);
        if (lobbyState.roundNumber>lobbyState.maxRounds){
        lobbyState.currentStatus = "GAME_OVER";
            io.emit("lobby_update",lobbyState);
            return;
        }
        console.log(2);
        if (currentTracks.length === 0) return;
        console.log(3);
        for (const player of Object.keys(lobbyState.players)){
            lobbyState.players[player].guessedSong=false;
            lobbyState.players[player].guessedArtist=false;
        }
        lobbyState.currentStatus = "INTERMISSION";
        io.emit('lobby_update', lobbyState);
        
        let randomIndex = Math.floor(Math.random()*currentTracks.length);
        let chosenSong = currentTracks[randomIndex];
        currentTracks.splice(randomIndex,randomIndex);
        trackName = chosenSong.track.name;
        artistName = chosenSong.track.artists[0].name;
        const songLookUpName = `${artistName} - ${trackName}`
        const audioBuffer = await downloadCurrentSong(songLookUpName)

        await delay(5000);
        roundStart = Date.now();
        
        io.emit('AUDIO_BUFFER',audioBuffer);

        lobbyState.currentStatus = "GUESSING";
        io.emit('lobby_update', lobbyState);


        setTimeout(() => {
            prepareNextRound();
            runGameLoop();
        }, 30000);
    }

    // Start lobby event
    socket.on('lobby_start', async () => {
        console.log("started");
        if (lobbyState.currentStatus !== "WAITING") return;
        console.log("started 2");
        for (const player of Object.keys(lobbyState.players)){
            lobbyState.players[socket.username].score=0;
        }
        
        currentTracks = getCurrentTracks();

        lobbyState.roundNumber = 0;
        lobbyState.maxRounds = 5;

        prepareNextRound();
        await runGameLoop();
    })

    socket.on('guess', (guess) => {
        console.log(`Guess received: ${guess}`);
 
        const cleanGuess = cleanString(guess);
        const cleanArtist = cleanString(artistName);
        const cleanTrack = cleanString(trackName);

        const artistDistance = Leventshtein.get(cleanGuess, cleanArtist);
        const trackDistance = Leventshtein.get(cleanGuess, cleanTrack);

        const maxArtistTypos = Math.ceil(cleanArtist.length * 0.2); // Allow 20% of the length of the artist name as typos
        const maxTrackTypos = Math.ceil(cleanTrack.length * 0.2); // Allow 20% of the length of the track name as typos

        console.log(`Artist distance: ${artistDistance} Max allowed: ${maxArtistTypos}`);
        console.log(`Track distance: ${trackDistance} Max allowed: ${maxTrackTypos}`);
        if (!lobbyState.players[socket.username].guessedArtist && artistDistance <= maxArtistTypos) {
            lobbyState.players[socket.username].guessedArtist = true;
            console.log(`${socket.username} guessed the artist correctly!`);
            const timeTaken = (Date.now() - roundStart) / 1000; // Time taken in seconds
            const score = Math.max(0, 100 - timeTaken); // Score decreases with time, minimum score is 0
            lobbyState.players[socket.username].score += score;
        }
        if (!lobbyState.players[socket.username].guessedSong && trackDistance <= maxTrackTypos) {
            lobbyState.players[socket.username].guessedSong = true;
            console.log(`${socket.username} guessed the song correctly!`);
            const timeTaken = (Date.now() - roundStart) / 1000; // Time taken in seconds
            const score = Math.max(0, 100 - timeTaken); // Score decreases with time, minimum score is 0
            lobbyState.players[socket.username].score += score;
        }
        io.emit('lobby_update', lobbyState);
    });

    return;
}