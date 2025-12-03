import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import socket from "../../chat/socket";
import { sendMessage } from "../../api/chatApi";
import { FiSend, FiPaperclip } from "react-icons/fi";

function InputMessage({ selectedRoom, user, setMessages }) {
  const [message, setMessage] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!selectedRoom?.roomName) return;

    const roomName = selectedRoom.roomName;

    const handleNewMessage = (newMessage) => {
      setMessages((prev) => {
        if (!newMessage) return prev;
        const id = newMessage._id ?? newMessage.id;
        if (id && prev.some((m) => String(m._id ?? m.id) === String(id))) {
          return prev;
        }
        return [...prev, newMessage];
      });
    };

    socket.emit("join_room_socket", roomName);

    socket.off("message", handleNewMessage);
    socket.on("message", handleNewMessage);

    return () => {
      socket.off("message", handleNewMessage);
      socket.emit("leave_room", roomName);
    };
  }, [selectedRoom?.roomName, setMessages]);

  const handleFileChange = (e) => {
    const f = e.target.files?.[0] ?? null;
    setFile(f);
    if (f) toast.info(`Selected: ${f.name}`);
  };

  const resetFileInput = () => {
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim() && !file) {
      toast.error("Enter a message or select a file");
      return;
    }
    if (!selectedRoom?.roomName) {
      toast.error("Select a room first");
      return;
    }

    const fd = new FormData();
    fd.append("content", message);
    fd.append("room_name", selectedRoom.roomName);
    if (file) fd.append("attachments", file);

    try {
      setLoading(true);
      const res = await sendMessage(fd);
      const sent = res?.data?.data?.message;

      if (sent) {
        setMessages((prev) => {
          const id = sent._id ?? sent.id;
          if (id && prev.some((m) => String(m._id ?? m.id) === String(id))) {
            return prev;
          }
          return [...prev, sent];
        });
        setMessage("");
        resetFileInput();
      } else {
        toast.error("Failed to send message");
      }
    } catch (err) {
      toast.error("Error sending message");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="
        flex flex-col sm:flex-row items-center gap-2 
        px-3 sm:px-4 py-3 
        bg-gray-900 border-t border-gray-700
      ">
      {/* Text Input */}
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your message..."
        className="
          w-full sm:flex-grow 
          px-4 py-2 
          rounded bg-gray-800 text-white 
          focus:outline-none focus:ring-2 focus:ring-indigo-500
        "
        disabled={loading}
      />

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        onChange={handleFileChange}
        disabled={loading}
      />

      {/* Upload button */}
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className="
          flex items-center justify-center 
          p-2 sm:p-3 rounded bg-gray-700 text-white
          hover:bg-gray-600 transition 
          w-full sm:w-auto
        "
        disabled={loading}>
        <FiPaperclip size={20} />
      </button>

      {/* Send button */}
      <button
        type="submit"
        disabled={loading}
        className="
          flex items-center justify-center gap-1 
          px-4 py-2 rounded 
          bg-indigo-600 hover:bg-indigo-500 
          text-white transition 
          disabled:opacity-50 w-full sm:w-auto
        ">
        {loading ? (
          "Sending..."
        ) : (
          <>
            <FiSend size={18} /> Send
          </>
        )}
      </button>
    </form>
  );
}

export default InputMessage;
