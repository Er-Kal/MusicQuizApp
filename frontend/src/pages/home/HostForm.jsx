import { submitPlaylistApi } from "../../services/gameService";
import { useState } from "react";

export default function HostForm({
  setPlaylistName,
  setTrackCount,
  startGame,
}) {
  const [playlistTrackId, setPlaylistTrackId] = useState("");
  const handlePlaylistIdSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await submitPlaylistApi(playlistTrackId);

      if (data?.success) {
        setPlaylistName(data.playlistName);
        setTrackCount(data.totalTracks);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <form onSubmit={handlePlaylistIdSubmit}>
        <h1>Add a playlist</h1>
        <input
          type="text"
          value={playlistTrackId}
          onChange={(e) => setPlaylistTrackId(e.target.value)}
          placeholder="paste playlist link here"
        />
        <button type="submit">Load Playlist</button>
      </form>
      <button onClick={startGame}> Start Game </button>
    </div>
  );
}
