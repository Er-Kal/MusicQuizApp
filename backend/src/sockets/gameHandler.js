
import { getCurrentTracks } from '../controllers/playlistController.js';
import { downloadCurrentSong } from '../services/songService.js';
import Fuse from 'fuse.js';

let currentTracks = [];
let playlistName = "";
let artistName = "";
let trackName = "";
const fuseOptions = {
    includeScore: true,
    threshold: 0.5
}

// Function that waits for a delay
const delay = async (ms) => new Promise(resolve => setTimeout(resolve, ms));

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
        
        currentTracks = getCurrentTracks();

        lobbyState.roundNumber = 0;
        lobbyState.maxRounds = 5;

        prepareNextRound();
        await runGameLoop();
    })

    socket.on('guess', (guess) => {
        const answers = [artistName, trackName];

        const fuse = new Fuse(answers, fuseOptions);
        
        const result = fuse.search(guess);

        console.log(`Fuse result ${result}`);
        if (result.length>0){
            console.log("Close guess");
        }
    });

    return;
}