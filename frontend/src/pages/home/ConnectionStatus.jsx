import { VscDebugConnected } from "react-icons/vsc";

export default function ConnectionStatus({isConnected}){
    return (
    <div className="bg-gray-500/30 flex justify-evenly items-center rounded-lg gap-2 p-2">
        <VscDebugConnected />
        <div className={`w-3 h-3 rounded-full ${
                    isConnected ? "bg-green-500" : "bg-red-500"
                }`}></div>
    </div>
    )
}