import { useState } from "react";
import { useGameSocket } from "../../context/SocketContext.jsx";
import JoinForm from "./JoinForm.jsx";
import HostForm from "./HostForm.jsx";
import PlayerList from "./PlayerList.jsx";
import Results from "./Results.jsx";
import Quiz from "./Quiz.jsx";

export default function Home() {
  const { lobby, joinLobby, startGame, submitGuess, isConnected } = useGameSocket();
  const [hasJoined, setHasJoined] = useState(false);
  const [playlistName, setPlaylistName] = useState("");
  const [trackCount, setTrackCount] = useState(0);
  // Username State
  const [username, setUsername] = useState("");

  const currentUserData = lobby.players[username];
  const isCurrentUserHost = currentUserData?.is_host;

  return (
    <div>
      <h1> Quiz App </h1>

      {!hasJoined && lobby.currentStatus === "WAITING" && (
        <JoinForm
          setHasJoined={setHasJoined}
          joinLobby={joinLobby}
          username={username}
          setUsername={setUsername}
        />
      )}

      <p> Your Status: {isConnected ? "Connected" : "Connecting..."}</p>

      {isCurrentUserHost && lobby.currentStatus === "WAITING" && (
        <HostForm
          setPlaylistName={setPlaylistName}
          setTrackCount={setTrackCount}
          startGame={startGame}
        />
      )}

      <div>
        <h2>Playlist Details</h2>
        <h3>{playlistName ?? "Nothing loaded"}</h3>
        <p>Total tracks loaded {trackCount}</p>
      </div>

      {lobby.currentStatus === "WAITING" && hasJoined && <PlayerList players={lobby.players} />}

      {lobby.currentStatus === "INTERMISSION" && hasJoined && <Results players={lobby.players}/>}

      {lobby.currentStatus === "GUESSING" && hasJoined && <Quiz submitGuess={submitGuess}/>}
    </div>
  );
}
