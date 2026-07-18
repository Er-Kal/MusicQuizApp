import { useState } from "react"

export default function Quiz({submitGuess}){
    const [guess, setGuess] = useState("");

    const handleGuess = (e) => {
        e.preventDefault();
        submitGuess(guess);
        console.log(`GUESSED ${guess}`);
        setGuess("");
    }

    return (
        <div>
            <form onSubmit={handleGuess}>
                <input type="text"
                value={guess}
                onChange={(e) => {setGuess(e.target.value)}}
                placeholder="Guess the song and artist"/>
            </form>
        </div>
    )
}