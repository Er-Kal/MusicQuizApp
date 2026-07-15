import { getPlaylistDetails } from "../services/spotifyService.js";
import socketBridge from "../sockets/socketBridge.js";

let currentQuizTracks = [];

export const submitPlaylist = async(req, res) => {
    try{
        const {playlistInput} = req.body;
        if (!playlistInput){
            return res.status(400).json({
                success:false,
                error: 'There was no Id provided'
            })
        }

        const idMatch = playlistInput.match(/playlist\/([a-zA-Z0-9]{22})/);
        const playlistId = idMatch ? idMatch[1] : playlistInput.trim();

        if (playlistId.length !== 22){
            return res.status(400).json({
                success:false,
                error: 'The provided Id is invalid'
            })
        }

        const {playlistName, tracks} = await getPlaylistDetails(playlistId);
        currentQuizTracks = tracks.items;
        console.log(`Loaded ${currentQuizTracks.length} tracks, from playlist ${playlistName}`);

        socketBridge.patchLobbyState({
            playlistName,
            totalTracks:currentQuizTracks.length,
        })

        return res.status(200).json({
            success:true,
            playlistName: playlistName,
            totalTracks: currentQuizTracks.length,
        });
    }
    catch (error) {
        return res.status(500).json({ success: false, error: "Failed to load playlist. Make sure it's public!" });
    }
}

export const getCurrentTracks = () => currentQuizTracks;