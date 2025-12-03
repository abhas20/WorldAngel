import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import InputMessage from "./InputMessage";
import socket from "../../chat/socket";
import { getMessages } from "../../api/chatApi";

function Messages({ selectedRoom, user, setSelectedRoom, onJoinRoom }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [joinLoading, setJoinLoading] = useState(false);
  const [error, setError] = useState("");
  const containerRef = useRef(null);

  /** ----------------- FETCH MESSAGES ------------------ **/
  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedRoom?.roomName) return setMessages([]);
      setLoading(true);
      setError("");

      try {
        const response = await getMessages(selectedRoom.roomName);
        const payload = response?.data?.message?.messages;

        setMessages(Array.isArray(payload) ? payload : []);
      } catch (err) {
        setError("Failed to load messages");
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [selectedRoom?.roomName]);

  /** ----------------- SOCKET EVENTS ------------------ **/
  useEffect(() => {
    if (!selectedRoom?.roomName) return;

    const roomName = selectedRoom.roomName;

    const handleNewMessage = (newMessage) => {
      if (!newMessage) return;

      setMessages((prev) => {
        const newId = newMessage._id ?? newMessage.id;
        if (prev.some((m) => String(m._id ?? m.id) === String(newId))) {
          return prev;
        }
        return [...prev, newMessage];
      });
    };

    const handleUserJoined = (payload) => {
      if (!payload) return;
      const joinedUser = payload.user ?? payload.userId ?? payload;

      setSelectedRoom((prev) => {
        if (!prev) return prev;

        const exists = prev.participants?.some(
          (p) =>
            String(p._id ?? p.id ?? p) ===
            String(joinedUser._id ?? joinedUser.id ?? joinedUser)
        );

        if (exists) return prev;
        return {
          ...prev,
          participants: [...(prev.participants ?? []), joinedUser],
        };
      });
    };

    socket.emit("join_room_socket", roomName);

    socket.on("message", handleNewMessage);
    socket.on("user_joined", handleUserJoined);

    return () => {
      socket.off("message", handleNewMessage);
      socket.off("user_joined", handleUserJoined);
      socket.emit("leave_room", roomName);
    };
  }, [selectedRoom?.roomName, setSelectedRoom]);

  /** ----------------- AUTO SCROLL ------------------ **/
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    setTimeout(() => {
      el.scrollTop = el.scrollHeight;
    }, 100);
  }, [messages]);

  /** ----------------- JOIN ROOM LOGIC ------------------ **/
  const hasJoined = selectedRoom?.participants?.some((p) => {
    const pId = p._id ?? p.id ?? p;
    const pUname = p.username;

    return String(pId) === String(user?._id) || pUname === user?.username;
  });

  const handleJoinRoom = async () => {
    setJoinLoading(true);

    try {
      const resp = await onJoinRoom({ roomName: selectedRoom.roomName });
      const room = resp?.data?.data?.room;

      if (room) {
        setSelectedRoom((prev) => ({ ...prev, ...room }));
      }

      toast.success("Joined room!");
    } catch (err) {
      toast.error("Failed to join room");
    } finally {
      setJoinLoading(false);
    }
  };

  /** ----------------- UI ------------------ **/
  return (
    <div className="flex flex-col h-[84vh] sm:h-[88vh] bg-gray-900 rounded-lg shadow-md p-3 sm:p-4">
      {/* ---------- Messages container ---------- */}
      <div
        ref={containerRef}
        className="
          flex-1 overflow-y-auto 
          bg-gray-900 
          space-y-4 px-2 sm:px-4 py-3
          border border-gray-700 rounded-md
        ">
        {loading ? (
          <p className="text-white text-center">Loading messages...</p>
        ) : error ? (
          <p className="text-red-400 text-center">{error}</p>
        ) : messages.length > 0 ? (
          <ul className="space-y-4">
            {messages.map((msg) => {
              const sender = msg.sender;
              const senderId = sender?._id ?? sender?.id ?? sender;
              const isCurrentUser = String(senderId) === String(user?._id);

              return (
                <li
                  key={msg._id ?? msg.id ?? Math.random()}
                  className={`flex ${
                    isCurrentUser ? "justify-end" : "justify-start"
                  }`}>
                  <div
                    className={`max-w-[80%] sm:max-w-[60%] p-3 rounded-lg shadow-md 
                      ${
                        isCurrentUser
                          ? "bg-indigo-600 text-white"
                          : "bg-gray-800 text-white"
                      }
                    `}>
                    <div className="mb-1">
                      <strong className="block text-sm">
                        {isCurrentUser ? "You" : sender?.username ?? "User"}
                      </strong>
                      <p className="text-sm break-words">{msg.message}</p>

                      {msg.createdAt && (
                        <span className="text-xs text-gray-400 block mt-1">
                          {new Date(msg.createdAt).toLocaleString()}
                        </span>
                      )}
                    </div>

                    {Array.isArray(msg.attachments) &&
                      msg.attachments.length > 0 && (
                        <img
                          src={msg.attachments[0].url}
                          alt="attachment"
                          className="max-w-full sm:max-w-xs rounded mt-2"
                        />
                      )}
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="text-white text-center">No messages yet.</p>
        )}
      </div>

      {/* ---------- Input / Join Button ---------- */}
      <div className="mt-3">
        {hasJoined ? (
          <InputMessage
            selectedRoom={selectedRoom}
            user={user}
            setMessages={setMessages}
          />
        ) : (
          <div className="flex justify-center">
            <button
              onClick={handleJoinRoom}
              disabled={joinLoading}
              className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded shadow-md">
              {joinLoading ? "Joining..." : "Join Room"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Messages;
