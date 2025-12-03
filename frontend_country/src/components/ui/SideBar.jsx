import React, { useCallback, useEffect, useRef, useState } from "react";
import { getAllRooms } from "../../api/chatApi";
import socket from "../../chat/socket";
import { toast } from "react-toastify";

function SideBar({
  selectedRoomName,
  setSelectedRoomName,
  isOpen,
  toggleSidebar,
}) {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);

  const initialLoadRef = useRef(true);
  const userClearedSelectionRef = useRef(false);

  const fetchRooms = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getAllRooms();
      const roomsData = Array.isArray(response?.data?.data?.rooms)
        ? response.data.data.rooms
        : [];

      const sorted = roomsData.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      setRooms(sorted);

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
        initialLoadRef.current = false;
      }
    } catch (error) {
      toast.error("Failed to fetch rooms");
    } finally {
      setLoading(false);
    }
  }, [selectedRoomName, setSelectedRoomName]);

  useEffect(() => {
    fetchRooms();

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
      roomId: room._id,
      participants: room.participants ?? [],
    });
    toggleSidebar(false); // close after selecting
  };

  return (
    <>
      {/* Overlay - show on all screens */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => toggleSidebar(false)}
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 h-full w-64 
          bg-gray-800 shadow-md border-r border-gray-600
          transform transition-transform duration-300 ease-in-out
          z-50
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}>
        <div className="p-4">
          <h2 className="text-xl text-yellow-500 font-semibold mb-4">
            Available Rooms
          </h2>

          {loading ? (
            <p className="text-white">Loading rooms...</p>
          ) : (
            <ul className="space-y-2">
              <button
                className="bg-yellow-500 text-white px-4 py-2 rounded mb-2"
                onClick={() => {
                  setSelectedRoomName(null);
                  toggleSidebar(false);
                }}>
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
                      selectedRoomName?.roomName === room.roomName
                        ? "bg-blue-500 text-white"
                        : "text-white"
                    }`}>
                    <strong>{room.roomName}</strong>
                    <span className="text-sm ml-2">
                      ({room.participants?.length || 0} users)
                    </span>
                  </li>
                ))
              )}
            </ul>
          )}
        </div>
      </aside>
    </>
  );
}

export default SideBar;
