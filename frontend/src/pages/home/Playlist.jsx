export default function Playlist( {trackCount, playlistName}) {
    return (
        <div className="rounded-lg bg-gray-500/30">
            <h2>Playlist Details</h2>
            <h3>{playlistName ?? "Nothing loaded"}</h3>
            <p>Total tracks loaded {trackCount}</p>
        </div>
    );
}