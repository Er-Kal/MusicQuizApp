import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
import gameRoutes from "./routes/gameRoutes.js";
import socketBridge from "./sockets/socketBridge.js";
import registerLobbyHandlers from "./sockets/lobbyHandler.js";
import registerGameHandlers from "./sockets/gameHandler.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "..", ".env") });

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/game", gameRoutes);

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "http://localhost:3000" },
});

const lobbyState = {
  players: {},
  playlistName: "",
  totalTracks: 0,
  currentStatus: "WAITING",
  roundNumber: 1,
  lobbyHost: null,
  maxRounds: 5,
};

// Lobby Status States
/*
WAITING = Lobby, players can join
INTERMISSION = Count down timer before round starts, show scores
GUESSING = Song plays, players guess
GAME_OVER = Display leaderboard, option to go back to lobby or restart game
*/

socketBridge.init(io, lobbyState);

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  // Register socket handlers
  registerGameHandlers(io, socket, lobbyState);
  registerLobbyHandlers(io, socket, lobbyState);
});

const PORT = process.env.PORT || 3031;
server.listen(PORT, () => console.log(`Server Running on port ${PORT}`));
