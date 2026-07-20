import { useMemo } from "react"
import Button from "../../components/Button";

export default function Results({players, isHost=false, returnLobby}){

    const sortedList = useMemo(() => {
        return Object.entries(players).sort(([,a],[,b]) => {return b.score-a.score});
    },[players]);
    return (<div className="rounded-lg bg-gray-500/30 flex flex-col items-center p-2">

        {isHost && <Button onClick={returnLobby} buttonText={"Return to lobby"}/>}
        <h2 className="text-2xl text-white font-semibold text-gray-800 text-center mt-4">Game Results</h2>
        <ol>
        {sortedList.map(([k,v]) => {
            return (
            <li key={k}>
            <p>{k} - {v.score}</p>
            </li>)
        })}
        </ol>
    </div>)
}