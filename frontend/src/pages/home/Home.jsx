import { useState } from "react";
import { useGameSocket } from "../../context/SocketContext.jsx";
import { submitPlaylistApi } from "../../services/gameService.js";

export default function Home(){

    const {lobby, joinLobby, startGame, isConnected} = useGameSocket();
    const [username, setUsername] = useState('');
    const [hasJoined, setHasJoined] = useState(false);
    const [playlistTrackId, setPlaylistTrackId] = useState('')
    const [playlistName, setPlaylistName] = useState('');
    const [trackCount, setTrackCount] = useState(0);

    const currentUserData = lobby.players[username];
    const isCurrentUserHost = currentUserData?.is_host;

    const handleUsernameSubmit = (e) => {
        e.preventDefault();
        if (!username.trim()) return;

        joinLobby(username.trim());
        setHasJoined(true);
    }
    

    const handlePlaylistIdSubmit = async (e) => {
        e.preventDefault();
        try{
            const data = await submitPlaylistApi(playlistTrackId);

            if (data?.success){
                setPlaylistName(data.playlistName);
                setTrackCount(data.totalTracks);
            }
        }
        catch (error){
            console.error(error);
        };
    }

    return (<div>
        
        <h1> Quiz App </h1>
        
        {!hasJoined && (<form onSubmit={handleUsernameSubmit}>
            <h2>Enter your username</h2>

            <input type="text"
            value={username}
            onChange={(e)=> setUsername(e.target.value)}
            placeholder="eg. eriks"/>
            <button type="submit">Join Lobby</button>
        </form>)}
        
        <p> Your Status: {isConnected? 'Connected' : 'Connecting...'}</p>
        
        {isCurrentUserHost && (<div>
            <form onSubmit={handlePlaylistIdSubmit}>
                <h1>Add a playlist</h1>
                <input type='text'
                value={playlistTrackId}
                onChange={(e)=> setPlaylistTrackId(e.target.value)}
                placeholder="paste playlist link here"/>
                <button type='submit'>Load Playlist</button>
            </form>
            <button onClick={startGame}> Start Game </button>
            
            </div>)}

        <div>
            <h2>Playlist Details</h2>
            <h3>{playlistName ?? "Nothing loaded"}</h3>
            <p>Total tracks loaded {trackCount}</p>
        </div>
        { hasJoined && (<>
        <h2>People waiting</h2>
        {Object.keys(lobby.players).length===0 ? (<p> Lobby is empty </p>) : 
        
        (<ul>
            {Object.keys(lobby.players).map((player) => {
                const isIdle = lobby.players[player].status === 'idle';
                const isHost = lobby.players[player].is_host;
                return (
                    <li key={player}>
                        <strong>{player}</strong> {isIdle && <p>Idle</p>} {isHost && <p>Host</p>}
                    </li>
                )
            })}
        </ul>)
        }
        </>)}
    </div>);
}