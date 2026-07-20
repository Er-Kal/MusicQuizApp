import Button from "../../components/Button";
import TextInput from "../../components/TextInput";

export default function JoinForm({
  setHasJoined,
  joinLobby,
  username,
  setUsername,
}) {
  // Username submission function
  const handleUsernameSubmit = (e) => {
    e.preventDefault();
    if (!username.trim()) return;
    joinLobby(username.trim());
    setHasJoined(true);
  };

  // Join Form (Contains text box and button to submit)
  return (
    <div className="min-h-50 flex items-center justify-center ">
      <form onSubmit={handleUsernameSubmit} className="p-4 w-full max-w-sm flex flex-col gap-4">
        <h2 className="text-2xl text-white font-semibold text-gray-800 text-center">Enter your username</h2>
        <TextInput field={username} setField={setUsername} placeHolderText={"eg. eriks"}/>
        <Button buttonText={"Join Lobby"}/>
      </form>
    </div>
  );
}
