import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import socket from "../../chat/socket";
import { sendMessage } from "../../api/chatApi";

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

    // make sure we don't attach handler multiple times
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
  };

  const resetFileInput = () => {
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedRoom?.roomName) {
      toast.error("Please select a room first.");
      return;
    }
    if (!message.trim() && !file) {
      toast.error("Please enter a message or attach a file");
      return;
    }

    const formData = new FormData();
    formData.append("content", message);
    formData.append("room_name", selectedRoom.roomName);
    if (file) formData.append("attachments", file);

    try {
      setLoading(true);
      const res = await sendMessage(formData);

      const sentMessage =
        res?.data?.data?.message;

      if (sentMessage) {
        //avoid duplicate because of socket
        setMessages((prev) => {
          const id = sentMessage._id ?? sentMessage.id;
          if (id && prev.some((m) => String(m._id ?? m.id) === String(id))) {
            return prev;
          }
          return [...prev, sentMessage];
        });


        toast.success("Message sent!");
        setMessage("");
        resetFileInput();
      } else {
        toast.error("Failed to send message");
      }
    } catch (error) {
      console.error("Send message error:", error);
      toast.error("Error sending message");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center gap-2 p-4 bg-gray-900 border-t border-gray-700">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your message..."
        className="flex-grow px-4 py-2 rounded bg-gray-800 text-white focus:outline-none"
        disabled={loading}
      />
      <input
        ref={fileInputRef}
        type="file"
        onChange={handleFileChange}
        className="text-white"
        disabled={loading}
      />
      <button
        type="submit"
        disabled={loading}
        className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded disabled:opacity-60">
        {loading ? "Sending..." : "Send"}
      </button>
    </form>
  );
}

export default InputMessage;
