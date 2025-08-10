import { useState } from "react";

const RoomForm = ({ onCreateRoom, onJoinRoom }) => {
  const [mode, setMode] = useState("create"); 
  const [roomName, setRoomName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const name = roomName.trim();
    if (!name) return;

    setError("");
    setLoading(true);
    try {
      if (mode === "create") {
        await onCreateRoom({ roomName: name });
      } else {
        await onJoinRoom({ roomName: name });
      }
      setRoomName("");
    } catch (err) {
      console.log("Error:", err);
      setError(err?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-black shadow-md rounded-lg mt-10">
      <div className="flex justify-center mb-4 space-x-4">
        <button
          type="button"
          onClick={() => setMode("create")}
          disabled={loading}
          aria-pressed={mode === "create"}
          className={`px-4 py-2 rounded ${
            mode === "create" ? "bg-blue-600 text-white" : "bg-gray-600"
          }`}>
          Create Room
        </button>

        <button
          type="button"
          onClick={() => setMode("join")}
          disabled={loading}
          aria-pressed={mode === "join"}
          className={`px-4 py-2 rounded ${
            mode === "join" ? "bg-green-600 text-white" : "bg-gray-600"
          }`}>
          Join Room
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div>
          <label htmlFor="roomName" className="block text-white mb-1">
            Room Name
          </label>
          <input
            id="roomName"
            name="roomName"
            type="text"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter room name"
            maxLength={100}
            autoComplete="off"
            aria-invalid={!!error}
            aria-describedby={error ? "room-error" : undefined}
            disabled={loading}
            autoFocus
          />
        </div>

        <div aria-live="polite" className="min-h-[1.25rem]">
          {error && (
            <p id="room-error" className="text-sm text-red-400">
              {error}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={!roomName.trim() || loading}
          className="w-full py-2 px-4 rounded bg-indigo-600 text-white hover:bg-indigo-700 transition duration-200 disabled:opacity-60">
          {loading ? (
            <span>Loading...</span>
          ) : mode === "create" ? (
            "Create Room"
          ) : (
            "Join Room"
          )}
        </button>
      </form>
    </div>
  );
};

export default RoomForm;
