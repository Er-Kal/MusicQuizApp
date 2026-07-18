const DISCONNECT_TIMEOUT = 5000;

export default (io, socket, lobbyState) => {
    // Join lobby handling
    socket.on('join_lobby', (username) => {
        // If player is idle, prevent kicking
        if (lobbyState.players[username]) {
            if (lobbyState.players[username].timeoutId) {
                clearTimeout(lobbyState.players[username].timeoutId)
            }
            lobbyState.players[username].id = socket.id;
            lobbyState.players[username].status = 'active';
            lobbyState.players[username].timeoutId = null;
        } else {
            // Handle a new player
            lobbyState.players[username] = {
                id: socket.id,
                status: 'active',
                timeoutId: null,
                is_host: false,
                score: Math.random()*100%100,
                guessedSong: false,
                guessedArtist: false
            }
            if (Object.keys(lobbyState.players).length === 1) {
                lobbyState.players[username].is_host = true;
                console.log(`${username} has been made the host`);
                lobbyState.lobbyHost = socket.id;
            }
            console.log(`${username} has joined`)
        }
        // Sets username for the socket
        socket.username = username;

        // Broadcast to all players that the lobby was updated
        io.emit('lobby_update', lobbyState);
    })

    socket.on('disconnect', () => {
        // Gets the players username
        const username = socket.username;
        // Check to see if the player actually exists
        if (!username || !lobbyState.players[username]) return;

        // Sets their status as idle
        lobbyState.players[username].status = 'idle';
        // Send update to all clients
        io.emit('lobby_update', lobbyState);

        // Start timeout timer
        lobbyState.players[username].timeoutId = setTimeout(() => {

            // If player exists and their status is still IDLE
            if (!lobbyState.players[username]) return;
            if (!lobbyState.players[username].status === 'idle') return;
            // Delete the player from the lobby
            delete lobbyState.players[username];
            // Log who left
            console.log(`${username} timed out`);

            if (Object.keys(lobbyState.players).length === 0) return;
            const nextHost = Object.keys(lobbyState.players)[0];
            lobbyState.players[nextHost].is_host = true;
            lobbyState.lobbyHost = lobbyState.players[nextHost].id;

            // Send update to all clients
            io.emit('lobby_update', lobbyState);

            // If they are disconnected, then pick the next player and make them the host
        }, DISCONNECT_TIMEOUT);

    });
};