let ioInstance = null;
let lobbyStateRef = null;

export default {
    init(io, lobbyState){
        ioInstance = io;
        lobbyStateRef = lobbyState;
    },
    patchLobbyState(patchData){
        if (!lobbyStateRef) return;
        Object.assign(lobbyStateRef, patchData);
        this.emitLobbyUpdate();
    },
    emitLobbyUpdate(){
        if (ioInstance && lobbyStateRef){
            ioInstance.emit('lobby_update', lobbyStateRef);
        }
    }
}