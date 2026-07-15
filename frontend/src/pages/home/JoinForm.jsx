export default function JoinForm({
  setHasJoined,
  joinLobby,
  username,
  setUsername,
}) {
  // Username submission function
  const handleUsernameSubmit = (e) => {
    e.preventDefault();
    if (!username.trim()) return;
    joinLobby(username.trim());
    setHasJoined(true);
  };

  // Join Form (Contains text box and button to submit)
  return (
    <form onSubmit={handleUsernameSubmit}>
      <h2>Enter your username</h2>

      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="eg. eriks"
      />
      <button type="submit">Join Lobby</button>
    </form>
  );
}
