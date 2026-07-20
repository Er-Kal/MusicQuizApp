import { useState } from "react";
import { useGameSocket } from "../../context/SocketContext.jsx";
import JoinForm from "./JoinForm.jsx";
import HostForm from "./HostForm.jsx";
import PlayerList from "./PlayerList.jsx";
import Results from "./Results.jsx";
import Quiz from "./Quiz.jsx";
import Playlist from "./Playlist.jsx";
import ConnectionStatus from "./ConnectionStatus.jsx";

export default function Home() {
  const { lobby, joinLobby, returnLobby, startGame, submitGuess, isConnected } = useGameSocket();
  const [hasJoined, setHasJoined] = useState(false);
  const [playlistName, setPlaylistName] = useState("");
  const [trackCount, setTrackCount] = useState(0);
  // Username State
  const [username, setUsername] = useState("");

  const currentUserData = lobby.players[username];
  const isCurrentUserHost = currentUserData?.is_host;

  const artistName = lobby.artistName;
  const trackName = lobby.trackName;

  return (
    <div className="bg-gray-900/70 min-w-1/2 min-h-100 rounded-lg p-3 gap-2 flex flex-col items-center">
      <ConnectionStatus isConnected={isConnected}/>
      {!hasJoined && lobby.currentStatus === "WAITING" && (
          <JoinForm
            setHasJoined={setHasJoined}
            joinLobby={joinLobby}
            username={username}
            setUsername={setUsername}
          />
        )}
      

      {hasJoined && (
        <div className="relative w-full flex-1 flex gap-3">
          <div className="flex-0.5 w-40 rounded-lg p-1 bg-gray-500/30">
            {lobby.currentStatus !== "GAME_OVER" && <PlayerList players={lobby.players} />}
          </div>

          <div className="flex-1 flex flex-col gap-3">
            
            {isCurrentUserHost && lobby.currentStatus === "WAITING" && (
              <HostForm
                setPlaylistName={setPlaylistName}
                setTrackCount={setTrackCount}
                startGame={startGame}
              />
            )}

            {lobby.currentStatus === "WAITING" && hasJoined && <Playlist trackCount={trackCount} playlistName={playlistName}/>}

            {lobby.currentStatus === "INTERMISSION" && <p>5 Seconds until the next round starts</p>}
            
            {lobby.currentStatus === "GAME_OVER" && hasJoined && <Results isHost={isCurrentUserHost} players={lobby.players} returnLobby={returnLobby}/>}

            {lobby.currentStatus === "GUESSING" && hasJoined && <Quiz submitGuess={submitGuess} artistGuessed={currentUserData.guessedArtist} trackGuessed={currentUserData.guessedSong} songName={trackName} artistName={artistName}/>}
          </div>
        </div>)
      }
      
    </div>
  );
}
