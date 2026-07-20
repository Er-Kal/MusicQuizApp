import Button from "../../components/Button";
import TextInput from "../../components/TextInput";
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
    <div className="rounded-lg bg-gray-500/30 gap-2 flex flex-col items-center p-2">
      <form onSubmit={handlePlaylistIdSubmit} className="flex flex-col items-center gap-4">
        <h2 className="text-2xl text-white font-semibold text-gray-800 text-center">Choose a playlist</h2>
        <TextInput field={playlistTrackId} setField={setPlaylistTrackId} placeHolderText="Paste Playlist link here"/>
        <Button buttonText={"Load Playlist"}/>
      </form>
      <Button onClick={startGame} buttonText={"Start Game"}/>
    </div>
  );
}
