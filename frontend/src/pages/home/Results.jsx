import { useMemo } from "react"

export default function Results({players}){

    const sortedList = useMemo(() => {
        return Object.entries(players).sort(([,a],[,b]) => {return b.score-a.score});
    },[players]);
    return (<div>
        {sortedList.map(([k,v]) => {
            return (
            <li key={k}>
            <p>{k} - {v.score}</p>
            </li>)
        })}
    </div>)
}