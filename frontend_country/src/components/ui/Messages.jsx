import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import InputMessage from "./InputMessage";
import socket from "../../chat/socket";
import { getMessages } from "../../api/chatApi";

/**
 * Messages component
 * Props:
 *  - selectedRoom: room object (must have roomName and participants)
 *  - user: current user object (must have _id, username)
 *  - setSelectedRoom: callback to update selectedRoom in parent
 *  - onJoinRoom: async function to call API to join room; should return API response
 */
function Messages({ selectedRoom, user, setSelectedRoom, onJoinRoom }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [joinLoading, setJoinLoading] = useState(false);
  const [error, setError] = useState("");
  const containerRef = useRef(null);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedRoom?.roomName) {
        setMessages([]);
        return;
      }
      setLoading(true);
      setError("");
      try {
        const response = await getMessages(selectedRoom.roomName);
        console.log("Fetched messages:", response);
        const payload = response?.data.message.messages;
        let msgs = [];

        if (Array.isArray(payload)) msgs = payload;
        else msgs = [];


        setMessages(msgs);
      } catch (err) {
        console.error("Error fetching messages:", err);
        setError("Failed to load messages");
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [selectedRoom?.roomName]);



  useEffect(() => {
    const roomName = selectedRoom?.roomName;
    if (!roomName) return;

    // handler will dedupe by _id or id
    const handleNewMessage = (newMessage) => {
      if (!newMessage) return;
      const newId = newMessage._id ?? newMessage.id;
      setMessages((prev) => {
        if (
          newId &&
          prev.some((m) => String(m._id ?? m.id) === String(newId))
        ) {
          return prev;
        }
        return [...prev, newMessage];
      });
    };

    const handleUserJoined = (payload) => {

      if (!payload) return;
      const joinedUser = payload.user || payload.userId || payload;
      if (!setSelectedRoom) return;

      setSelectedRoom((prev) => {
        if (!prev) return prev;
        const already = (prev.participants ?? []).some((p) => {
          const pId = p?._id ?? p?.id ?? p;
          return (
            String(pId) ===
            String(joinedUser?._id ?? joinedUser?.id ?? joinedUser)
          );
        });
        if (already) return prev;
        return {
          ...prev,
          participants: [...(prev.participants || []), joinedUser],
        };
      });
    };

    // Join the socket room (ack optional)
    socket.emit("join_room_socket", roomName, (ack) => {
      if (ack && ack.status === "error") {
        console.warn("Socket join ack error:", ack.message || ack);
      }
    });

    // attach listeners (make sure we don't attach duplicates)
    socket.on("message", handleNewMessage);
    socket.on("user_joined", handleUserJoined);

    return () => {
      socket.off("message", handleNewMessage);
      socket.off("user_joined", handleUserJoined);
      // leave room on cleanup
      socket.emit("leave_room", roomName, (ack) => {
        // optionally handle ack
      });
    };
  }, [selectedRoom?.roomName, setSelectedRoom]);

  // auto-scroll to bottom whenever messages change
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    setTimeout(() => {
      el.scrollTop = el.scrollHeight;
    }, 50);
  }, [messages]);

  
  const hasJoined =
    !!selectedRoom?.participants &&
    selectedRoom.participants.some((participant) => {
      if (!participant) return false;
      const pId = participant._id ?? participant.id ?? participant;
      const pUsername = participant.username ?? null;
      try {
        return (
          String(pId) === String(user?._id) ||
          (pUsername && pUsername === user?.username)
        );
      } catch {
        return false;
      }
    });

  // handle join room action
  const handleJoinRoom = async () => {
    if (!selectedRoom?.roomName) return;
    setJoinLoading(true);
    setError("");
    try {
      const resp = await onJoinRoom({ roomName: selectedRoom.roomName });
      console.log(resp);

      const updatedRoom = resp?.data?.data?.room 

      if (updatedRoom) {
        setSelectedRoom((prev) =>
          prev ? { ...prev, ...updatedRoom } : updatedRoom
        );
        toast.success("Joined room successfully!");
        socket.emit("join_room_socket", selectedRoom.roomName);
      } else {
        // fallback: optimistic local update
        setSelectedRoom((prev) =>
          prev
            ? {
                ...prev,
                participants: prev.participants?.some(
                  (p) => String(p._id ?? p) === String(user._id)
                )
                  ? prev.participants
                  : [...(prev.participants || []), user],
              }
            : prev
        );
        toast.success("Joined room (optimistic)!");
      }
    } catch (err) {
      console.error("Error joining room:", err);
      toast.error("Failed to join room");
    } finally {
      setJoinLoading(false);
    }
  };

  return (
    <div className="bg-gray-900 p-4 rounded-lg shadow-md max-h-[80vh]">
      <div
        ref={containerRef}
        className="overflow-y-auto max-h-[70vh] px-2 py-4 space-y-4 bg-gray-900">
        {loading ? (
          <p className="text-white text-center">Loading messages...</p>
        ) : error ? (
          <p className="text-red-400 text-center">{error}</p>
        ) : messages && messages.length > 0 ? (
          <ul className="space-y-4">
            {messages.map((msg) => {
              const sender = msg.sender;
              const senderId =
                typeof sender === "object" ? sender._id ?? sender.id : sender;
              const isCurrentUser = String(senderId) === String(user?._id);
              const displayName = isCurrentUser
                ? "You"
                : sender?.username ?? "Unknown";

              return (
                <li
                  key={msg._id ?? msg.id ?? `${msg._id}-${Math.random()}`}
                  className={`flex ${
                    isCurrentUser ? "justify-end" : "justify-start"
                  }`}>
                  <div
                    className={`max-w-md p-3 rounded-lg shadow-md bg-gray-800 ${
                      isCurrentUser ? "text-yellow-400" : "text-white"
                    }`}>
                    <div className="mb-1">
                      <strong className="block mb-1">{displayName}</strong>
                      <p className="text-sm break-words">{msg.message}</p>
                      {msg.createdAt && (
                        <span className="text-xs text-gray-500">
                          {new Date(msg.createdAt).toLocaleString()}
                        </span>
                      )}
                    </div>

                    {Array.isArray(msg.attachments) &&
                      msg.attachments.length > 0 && (
                        <img
                          src={msg.attachments[0].url}
                          alt={msg.attachments[0].filename ?? "attachment"}
                          className="max-w-xs rounded mt-2"
                        />
                      )}
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="text-white text-center">No messages found.</p>
        )}
      </div>

      <div className="mt-4">
        {hasJoined ? (
          <InputMessage
            selectedRoom={selectedRoom}
            user={user}
            setMessages={setMessages}
          />
        ) : (
          <div className="flex justify-center">
            <button
              className="bg-indigo-600 text-white px-4 py-2 rounded"
              onClick={handleJoinRoom}
              disabled={joinLoading}>
              {joinLoading ? "Joining..." : "Join Room"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Messages;
