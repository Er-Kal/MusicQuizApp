const DISCONNECT_TIMEOUT = 5000;
const disconnectTimers = {}; // username -> Timeout, kept OUT of lobbyState entirely

export default (io, socket, lobbyState) => {
  socket.on('join_lobby', (username) => {
    if (typeof username !== 'string' || !username.trim()) return; // basic validation
    username = username.trim();

    if (lobbyState.players[username]) {
      clearTimeout(disconnectTimers[username]);
      delete disconnectTimers[username];
      lobbyState.players[username].id = socket.id;
      lobbyState.players[username].status = 'active';
    } else {
      lobbyState.players[username] = {
        id: socket.id,
        status: 'active',
        is_host: false,
        score: 0,
        guessedSong: false,
        guessedArtist: false,
      };
      if (Object.keys(lobbyState.players).length === 1) {
        lobbyState.players[username].is_host = true;
        lobbyState.lobbyHost = socket.id;
      }
    }

    socket.username = username;
    io.emit('lobby_update', lobbyState);
  });

  socket.on('disconnect', () => {
    const username = socket.username;
    if (!username || !lobbyState.players[username]) return;
    if (lobbyState.players[username].id !== socket.id) return;
    lobbyState.players[username].status = 'idle';
    io.emit('lobby_update', lobbyState);

    disconnectTimers[username] = setTimeout(() => {
      if (!lobbyState.players[username] || lobbyState.players[username].status !== 'idle') return;
      delete lobbyState.players[username];
      delete disconnectTimers[username];
      const remaining = Object.keys(lobbyState.players);
      if (remaining.length > 0) {
        const nextHost = remaining[0];
        lobbyState.players[nextHost].is_host = true;
        lobbyState.lobbyHost = lobbyState.players[nextHost].id;
      }
      io.emit('lobby_update', lobbyState);
    }, DISCONNECT_TIMEOUT);
  });
};