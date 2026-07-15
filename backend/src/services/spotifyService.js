import axios from 'axios';

let storedToken = null;
let tokenExpireTime = null;

export const getTrackList = async (playlistId) => {
    try{
        const accessToken = await getSpotifyAccessToken();

        const response = await axios.get(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
            {
                headers:
                {
                'Authorization' : `Bearer ${accessToken}`
                }
            });
        return response.data.items;
    }
    catch {
        console.log("error fetching tracks");
    }
};

export const getPlaylistDetails = async (playlistId) => {
    try {
        const accessToken = await getSpotifyAccessToken();

        const response = await axios.get(`https://api.spotify.com/v1/playlists/${playlistId}`,
            {
                headers:
                {
                'Authorization' : `Bearer ${accessToken}`
                }
            });
        return {
            playlistName: response.data.name,
            tracks: response.data.tracks,
        };
    }
    catch {
        console.log("there was an error fetching playlist details")
    }
}

export const getSpotifyAccessToken = async () => {
    const clientId = process.env.SPOTIFY_CLIENT_ID;
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

    if (storedToken && tokenExpireTime && Date.now() < tokenExpireTime - 60000){
        return storedToken;
    }

    try{
        const response = await axios.post('https://accounts.spotify.com/api/token',
            `grant_type=client_credentials&client_id=${clientId}&client_secret=${clientSecret}`,
            {
                headers:{
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
        );
        storedToken = response.data.access_token;
        tokenExpireTime = Date.now() + (3600*1000);

        return response.data.access_token;
    }
    catch{
        console.log("error getting access token");
    }
}