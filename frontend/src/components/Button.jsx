export default function Button({onClick, buttonText}) {
    return (<button type="submit" onClick={onClick} className="bg-green-600 min-w-30 text-white font-semibold rounded-md py-2 hover:bg-green-700 transition-colors">{buttonText}</button>)
}