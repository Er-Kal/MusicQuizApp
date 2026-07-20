import { useState } from "react"
import TextInput from "../../components/TextInput";

export default function Quiz({submitGuess, artistGuessed, trackGuessed, artistName, songName}){
    const [guess, setGuess] = useState("");

    const handleGuess = (e) => {
        e.preventDefault();
        submitGuess(guess);
        console.log(`GUESSED ${guess}`);
        setGuess("");
    }

    return (
        <div className="rounded-lg bg-gray-500/30 flex flex-col items-center p-2">
            <h2>Song Name: {trackGuessed ? songName : ""}</h2>
            <h2>Artist: {artistGuessed ? artistName : ""}</h2>

            <form onSubmit={handleGuess} className="mt-2">
                <TextInput
                field={guess}
                setField={setGuess}
                placeHolderText={"Guess the song and artist"}
                />
            </form>
        </div>
    )
}