import axios from 'axios';

const API_BASE_URL = 'http://localhost:3031/api/game';

export const submitPlaylistApi = async (playlistInput) => {
    try{
        const response = await axios.post(`${API_BASE_URL}/submit-playlist`,
            {
                'playlistInput':playlistInput
            }
        );
        console.log(response.data);
        return response.data;
    }
    catch (error){
        console.error(error.response?.data?.error);
    }
}