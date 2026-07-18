import { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext(null);

// Express URL
const SOCKET_URL = 'http://localhost:3031';

export const SocketProvider = ({ children }) => {
    // States
    const [socket, setSocket] = useState(null);
    const [lobby, setLobby] = useState({
        players: {},
        playlistName: "",
        totalTracks: 0,
        currentStatus: "WAITING",
        roundNumber: 1,
        lobbyHost: null,
    });
    const [isConnected, setIsConnected] = useState(false);

    // Initiate the socket connection
    useEffect(() => {
        // Init socket, dont connect yet
        const socketInstance = io(SOCKET_URL, { autoConnect: false });
        setSocket(socketInstance);

        // Register connection events
        socketInstance.on('connect', () => setIsConnected(true));
        socketInstance.on('disconnect', () => setIsConnected(false));

        // Cleanup
        return () => {
            socketInstance.disconnect();
        };
    }, []);

    // Lobby update listener
    useEffect(() => {
        if (!socket) return;

        // Listen for lobby updates
        socket.on('lobby_update', (updatedLobby) => {
            setLobby(updatedLobby);
        })

        return () => {
            socket.off('lobby_update');
        }
    }, [socket]);

    useEffect(() => {
        if (!socket) return;

        let audio = null;

        socket.on('AUDIO_BUFFER', (buffer) => {
            // idk
            console.log("playiing audio");
            const blob = new Blob([buffer], {type: 'audio/mpeg'});
            const url = URL.createObjectURL(blob);
            audio = new Audio(url);
            audio.volume = 0.5;
            audio.play();
            setTimeout(() => {audio.pause();
                URL.revokeObjectURL(url);
                audio = null;
            }, 30000)
        })
    },[socket]);


    // Function to join the lobby, requires username
    const joinLobby = (username) => {
        // Return if there is no socket
        if (!socket) return;

        // Connect the socket, if not connected
        if (!socket.connected) {
            socket.connect();
        }

        // Emit join_lobby event with username as field
        socket.emit('join_lobby', username);
    }

    const startGame = () => {
        if (!socket) return;
        if (!lobby.lobbyHost === socket.id) return;

        socket.emit('lobby_start');
        console.log("started")
    }

    const submitGuess = (guess) => {
        if (!socket) return;
        if (lobby.currentStatus !== "GUESSING") return;

       socket.emit('guess', guess);
    }

    return <SocketContext.Provider value={{ socket, lobby, isConnected, joinLobby, startGame, submitGuess }}>
        {children}
    </SocketContext.Provider>
}

export const useGameSocket = () => useContext(SocketContext);