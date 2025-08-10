import React, { useCallback, useEffect, useRef, useState } from 'react';
import { getAllRooms } from '../../api/chatApi';
import socket from '../../chat/socket';
import { toast } from 'react-toastify';

function SideBar({ selectedRoomName, setSelectedRoomName }) {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);

  const initialLoadRef = useRef(true);
  const userClearedSelectionRef = useRef(false);

  const fetchRooms = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getAllRooms();
      // defensive extraction of rooms array
      // console.log("Fetched rooms:", response);
      const roomsData = Array.isArray(response?.data?.data?.rooms)
        ? response.data.data.rooms: [];

      const sorted = [...roomsData].sort((a, b) => {
        const ta = new Date(a?.createdAt || 0).getTime();
        const tb = new Date(b?.createdAt || 0).getTime();
        return tb - ta; 
      });

      setRooms(sorted);

      // Auto-select last room if none selected (here we choose the first of sorted = newest)
      if (
        initialLoadRef.current &&
        !userClearedSelectionRef.current &&
        !selectedRoomName &&
        sorted.length > 0
      ) {
        const first = sorted[0];
        setSelectedRoomName({
          roomName: first.roomName,
          roomId: first._id ?? first.id,
          participants: first.participants ?? [],
        });
        initialLoadRef.current = false; // don't auto-select again
      }
    } 
    catch (error) {
      console.error("Error fetching rooms:", error);
      toast.error("Failed to fetch rooms");
    } finally {
      setLoading(false);
    }
  }, [setSelectedRoomName, selectedRoomName]);

  useEffect(() => {
    fetchRooms();

    // Socket listeners for real-time updates
    socket.on("room_created", fetchRooms);
    socket.on("user_joined", fetchRooms);

    return () => {
      socket.off("room_created", fetchRooms);
      socket.off("user_joined", fetchRooms);
    };
  }, [fetchRooms]);

  const onRoomSelect = (room) => {
    setSelectedRoomName({
      roomName: room.roomName,
      roomId: room._id ?? room.id,
      participants: room.participants ?? [],
    });
  };

  return (
    <aside className="w-64 bg-gray-800 shadow-md h-screen overflow-y-auto p-4 border-r border-gray-200">
      <h2 className="text-xl text-yellow-500 font-semibold mb-4">Available Rooms</h2>
      {loading ? <p className="text-white">Loading rooms...</p> : (
        <ul className="space-y-2">
          <button className='bg-yellow-500 text-white px-4 py-2 rounded p-auto' onClick={() => setSelectedRoomName(null)}>
            Join/Create Room
          </button>
          {rooms.length === 0 ? (
            <li className="text-white">No rooms found.</li>
          ) : (
            rooms.map((room) => (
              <li
                key={room._id}
                onClick={() => onRoomSelect(room)}
                className={`cursor-pointer px-4 py-2 rounded hover:bg-blue-400 ${
                  selectedRoomName?.roomName === room?.roomName ? "bg-blue-500 text-white" : ""
                }`}
              >
                <>
                  <strong>{room.roomName}</strong>
                  <span className="text-sm text-white ml-2">
                    ({room.participants?.length || 0} users)
                  </span>
                </>
              </li>
            ))
          )}
        </ul>
      )}
    </aside>
  );
}

export default SideBar;
