export default function TextInput({field, setField, placeHolderText}) {
    return (
        <input
          type="text"
          value={field}
          onChange={(e) => setField(e.target.value)}
          placeholder={placeHolderText}
          className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
    )
}