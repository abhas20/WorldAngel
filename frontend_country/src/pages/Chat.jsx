import React, { useEffect, useState, useCallback } from 'react';
import RoomForm from '../components/ui/RoomForm';
import SideBar from '../components/ui/SideBar';
import Messages from '../components/ui/Messages';
import { createRoom, joinRoom } from '../api/chatApi';
import { toast } from 'react-toastify';
import socket from '../chat/socket';
import useAuth from '../auth/hooks/useAuth';
import { useNavigate } from 'react-router-dom';

function Chat() {
  const [selectedRoomName, setSelectedRoomName] = useState(null);
  const { auth, authLoading } = useAuth();
  const navigate = useNavigate();

  
  // Callback to join room via form
  const handleJoinRoom = useCallback(async (data) => {
    if (!data || !data.roomName?.trim()) {
      toast.error("Invalid room name");
      return;
    }

    try {
      const res = await joinRoom(data);
      console.log(res.data);
      if (!res?.data?.data?.room) {
        throw new Error("Invalid room data");
      }

      const joinedRoom = res.data.data.room;
      console.log(joinedRoom);

      toast.success(`Joined room ${joinedRoom.roomName} successfully!`);
      setSelectedRoomName({
        roomName: joinedRoom.roomName,
        roomId: joinedRoom._id ?? joinedRoom.id,
        participants: joinedRoom.participants ?? [],
      });
    } catch (error) {
      toast.error(
        error?.response?.data?.message || error.message || "Error joining room"
      );
      console.error(error);
    }
  }, []);

  // Callback to create room via form
  const handleCreateRoom = useCallback(async (data) => {
    if (!data || !data.roomName?.trim()) {
      console.log(data);
      toast.error("Invalid room name");
      return;
    }

    try {
      const res = await createRoom(data);
      if (!res?.data?.data?.room) throw new Error("Room not created");
      console.log("Room created:", res);
      const room = res?.data?.data?.room;
      if (!room) throw new Error("Room not created");

      setSelectedRoomName({
        roomName: room.roomName,
        roomId: room._id,
        participants: room.participants,
      });

      toast.success(`Room ${res.data.data.room.roomName} created!`);
    } catch (error) {
      toast.error("Error creating room");
      console.error(error);
    }
  }, []);


  useEffect(() => {
    const onUserJoined = (payload) => {
      console.log("user_joined payload:", payload);
    };

    socket.on("user_joined", onUserJoined);
    return () => {
      socket.off("user_joined", onUserJoined);
    };

  },[])



  return (
    <div className="min-h-screen flex bg-gray-800 text-white">
      {/* Sidebar */}
      <SideBar
        selectedRoomName={selectedRoomName}
        setSelectedRoomName={setSelectedRoomName}
      />

      {/* Main Chat Area */}
      <div className="flex-1 p-6 overflow-y-auto">
        {selectedRoomName ? (
          <>
            <h1 className="text-2xl font-bold mb-4">
              Chat Room: {selectedRoomName.roomName}
            </h1>
            {auth.accessToken ? (
              <Messages
                selectedRoom={selectedRoomName}
                user={auth.user}
                setSelectedRoom={setSelectedRoomName}
                onJoinRoom={handleJoinRoom}
              />
            ) : (
              <p className='text-center text-2xl bg-gray-600'>
                Please <span className='text-yellow-500 hover:underline cursor-pointer' onClick={() => navigate('/login')}>log in</span> to view messages.
              </p>
            )}
          </>
        ) : (auth.accessToken?
          <RoomForm
            onCreateRoom={handleCreateRoom}
            onJoinRoom={handleJoinRoom}
          />:
          <p className='text-center text-2xl bg-gray-600'>
            Please <span className='text-yellow-500 hover:underline cursor-pointer' onClick={() => navigate('/login')}>log in</span> to create or join rooms.
          </p>
        )}
      </div>
    </div>
  );
}

export default Chat;
