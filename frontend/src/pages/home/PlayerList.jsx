export default function PlayerList({ players }) {
  return (
    <>
      <h2>People waiting</h2>
      {Object.keys(players).length === 0 ? (
        <p> Lobby is empty </p>
      ) : (
        <ul>
          {Object.keys(players).map((player) => {
            const isIdle = players[player].status === "idle";
            const isHost = players[player].is_host;
            return (
              <li key={player}>
                <strong>{player}</strong> {isIdle && <p>Idle</p>}{" "}
                {isHost && <p>Host</p>}
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
