export default function PlayerList({ players }) {
  return (
    <>
      <h2 className="mb-2">People waiting</h2>
      {Object.keys(players).length === 0 ? (
        <p> Lobby is empty </p>
      ) : (
        <ul>
          {Object.keys(players).map((player) => {
            const isIdle = players[player].status === "idle";
            const isHost = players[player].is_host;
            return (
              <li key={player} className="flex gap-2 items-center border-b border-gray-900">
                <p>{player}</p> {isIdle && <p>Idle</p>}
                {isHost && <p className="text-white font-semibold text-sm">HOST</p>}
                <p className="ml-auto mr-2">{players[player].score}</p>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
