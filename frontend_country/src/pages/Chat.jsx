import React, { useEffect, useState, useCallback } from "react";
import RoomForm from "../components/ui/RoomForm";
import SideBar from "../components/ui/SideBar";
import Messages from "../components/ui/Messages";
import { createRoom, joinRoom } from "../api/chatApi";
import { toast } from "react-toastify";
import socket from "../chat/socket";
import useAuth from "../auth/hooks/useAuth";
import { useNavigate } from "react-router-dom";

function Chat() {
  const [selectedRoomName, setSelectedRoomName] = useState(null);
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const { auth } = useAuth();
  const navigate = useNavigate();

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  // Join room callback
  const handleJoinRoom = useCallback(async (data) => {
    if (!data?.roomName?.trim()) {
      toast.error("Invalid room name");
      return;
    }

    try {
      const res = await joinRoom(data);
      const joinedRoom = res?.data?.data?.room;

      if (!joinedRoom) throw new Error("Invalid room data");

      toast.success(`Joined room ${joinedRoom.roomName} successfully!`);

      setSelectedRoomName({
        roomName: joinedRoom.roomName,
        roomId: joinedRoom._id ?? joinedRoom.id,
        participants: joinedRoom.participants ?? [],
      });

      setSidebarOpen(false); // Close sidebar on mobile
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error joining room");
    }
  }, []);

  // Create room callback
  const handleCreateRoom = useCallback(async (data) => {
    if (!data?.roomName?.trim()) {
      toast.error("Invalid room name");
      return;
    }

    try {
      const res = await createRoom(data);
      const room = res?.data?.data?.room;

      if (!room) throw new Error("Room not created");

      setSelectedRoomName({
        roomName: room.roomName,
        roomId: room._id,
        participants: room.participants,
      });

      toast.success(`Room "${room.roomName}" created!`);
      setSidebarOpen(false);
    } catch (error) {
      toast.error("Error creating room");
    }
  }, []);

  useEffect(() => {
    const onUserJoined = (payload) => {
      console.log("user_joined payload:", payload);
    };

    socket.on("user_joined", onUserJoined);
    return () => socket.off("user_joined", onUserJoined);
  }, []);

  return (
    <div className="min-h-screen flex bg-gray-900 text-white">
      {/* Sidebar (now toggleable) */}
      <SideBar
        selectedRoomName={selectedRoomName}
        setSelectedRoomName={setSelectedRoomName}
        isOpen={isSidebarOpen}
        toggleSidebar={setSidebarOpen}
      />

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        <header className="flex items-center justify-between px-4 py-3 border-b border-gray-700 bg-gray-800 shadow-lg">
          <button
            className="p-2 text-white bg-gray-700 rounded-md hover:bg-gray-600"
            onClick={toggleSidebar}>
            ☰
          </button>

          {/* Title */}
          <h1 className="text-xl font-semibold text-yellow-400">
            {selectedRoomName ? selectedRoomName.roomName : "Chat Rooms"}
          </h1>

          {/* Profile Button */}
          <button
            onClick={() => navigate("/profile")}
            className="px-3 py-1 bg-yellow-500 text-black rounded-md hover:bg-yellow-400">
            Profile
          </button>
        </header>

        {/* Main Chat Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          {selectedRoomName ? (
            auth.accessToken ? (
              <Messages
                selectedRoom={selectedRoomName}
                user={auth.user}
                setSelectedRoom={setSelectedRoomName}
                onJoinRoom={handleJoinRoom}
              />
            ) : (
              <div className="mt-10 p-6 text-center text-xl bg-gray-700 rounded-lg">
                Please{" "}
                <span
                  className="text-yellow-400 hover:underline cursor-pointer"
                  onClick={() => navigate("/login")}>
                  log in
                </span>{" "}
                to view messages.
              </div>
            )
          ) : auth.accessToken ? (
            <RoomForm
              onCreateRoom={handleCreateRoom}
              onJoinRoom={handleJoinRoom}
            />
          ) : (
            <div className="mt-10 p-6 text-center text-xl bg-gray-700 rounded-lg">
              Please{" "}
              <span
                className="text-yellow-400 hover:underline cursor-pointer"
                onClick={() => navigate("/login")}>
                log in
              </span>{" "}
              to create or join rooms.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Chat;
